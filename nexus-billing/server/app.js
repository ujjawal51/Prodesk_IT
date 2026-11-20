import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {transaction} from './db.js';
import {receipt} from './pdf.js';
const fail=(status,message)=>Object.assign(new Error(message),{status});
export function createApp({db,stripe,secret,webhookSecret,appUrl,production=false}){
 if(secret.length<32)throw Error('JWT_SECRET must contain at least 32 characters');
 const app=express();app.use(helmet());
 app.post('/api/webhooks/stripe',express.raw({type:'application/json',limit:'1mb'}),async(req,res)=>{
  let event;try{event=stripe.webhooks.constructEvent(req.body,req.headers['stripe-signature'],webhookSecret);}catch{return res.status(400).json({error:'Invalid Stripe signature'});}
  if(!['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type))return res.json({received:true});
  try{
   const s=event.data.object;
   if(s.payment_status!=='paid')return res.json({received:true});
   transaction(db,()=>{
    if(db.prepare('SELECT id FROM events WHERE id=?').get(event.id))return;
    const inv=db.prepare('SELECT * FROM invoices WHERE id=?').get(s.metadata?.invoiceId||'');
    const attempt=db.prepare('SELECT * FROM attempts WHERE invoice_id=?').get(inv?.id||'');
    if(!inv||!attempt||attempt.id!==s.metadata?.attemptId||(attempt.session_id&&attempt.session_id!==s.id)||s.mode!=='payment'||s.amount_total!==inv.amount||s.currency!==inv.currency||!s.payment_intent)throw Error('Payment reconciliation mismatch');
    if(inv.status==='Paid'&&inv.payment_id!==s.payment_intent)throw Error('Conflicting payment');
    db.prepare("UPDATE invoices SET status='Paid',paid_at=COALESCE(paid_at,?),payment_id=? WHERE id=?").run(new Date().toISOString(),s.payment_intent,inv.id);
    db.prepare('INSERT OR IGNORE INTO deliveries(invoice_id) VALUES(?)').run(inv.id);
    db.prepare('INSERT INTO events(id) VALUES(?)').run(event.id);
   });
   console.info('Verified payment webhook persisted:',event.id);res.json({received:true});
  }catch(e){console.error('Webhook reconciliation failed:',e.message);res.status(500).json({error:'Reconciliation failed; retry required'});}
 });
 app.use(express.json({limit:'32kb'}),cookieParser());
 app.use('/api',(req,res,next)=>{res.set('Cache-Control','no-store');if(!['GET','HEAD','OPTIONS'].includes(req.method)&&req.headers.origin!==appUrl)return res.status(403).json({error:'Untrusted origin'});next();});
 const cookie={httpOnly:true,secure:production,sameSite:'strict',path:'/',maxAge:3600000};
 app.post('/api/auth/login',rateLimit({windowMs:900000,limit:20,standardHeaders:'draft-7',legacyHeaders:false}),async(req,res)=>{
  const parsed=z.object({email:z.string().email().max(254),password:z.string().min(1).max(128)}).safeParse(req.body);
  if(!parsed.success)throw fail(400,'Valid email and password required');
  const u=db.prepare('SELECT * FROM users WHERE email=?').get(parsed.data.email.toLowerCase());
  if(!await bcrypt.compare(parsed.data.password,u?.password||'$2b$12$C6UzMDM.H6dfI/f/IKcEe.5Z0gNLMJ6Yd8Ezu5mxQ1QPjYNl45V4W'))throw fail(401,'Invalid email or password');
  res.cookie('session',jwt.sign({},secret,{subject:u.id,expiresIn:'1h',issuer:'nexus',audience:'nexus-web',algorithm:'HS256'}),cookie).json({id:u.id,name:u.name,role:u.role});
 });
 app.use('/api',(req,res,next)=>{try{const p=jwt.verify(req.cookies.session,secret,{algorithms:['HS256'],issuer:'nexus',audience:'nexus-web'});req.user=db.prepare('SELECT id,name,email,role FROM users WHERE id=?').get(p.sub);if(!req.user)throw Error();next();}catch{res.status(401).json({error:'Please sign in'});}});
 const admin=(req,res,next)=>req.user.role==='Admin'?next():res.status(403).json({error:'Admin access required'});
 const owned=(req,res,next)=>{req.invoice=db.prepare('SELECT * FROM invoices WHERE id=?').get(req.params.id);if(!req.invoice)return res.status(404).json({error:'Invoice not found'});if(req.user.role!=='Admin'&&req.invoice.client_id!==req.user.id)return res.status(403).json({error:'This invoice belongs to another client'});next();};
 app.get('/api/auth/me',(req,res)=>res.json(req.user));
 app.post('/api/auth/logout',(req,res)=>res.clearCookie('session',cookie).json({ok:true}));
 app.get('/api/admin/dashboard',admin,(req,res)=>res.json({clients:db.prepare("SELECT id,name,email FROM users WHERE role='Client'").all(),revenue:db.prepare("SELECT COALESCE(SUM(amount),0) total FROM invoices WHERE status='Paid'").get().total}));
 app.post('/api/admin/invoices',admin,(req,res)=>{
  const data=z.object({clientId:z.string().uuid(),description:z.string().trim().min(1).max(1000),amount:z.number().int().positive().max(99999999),dueDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s)}).parse(req.body);
  if(!db.prepare("SELECT id FROM users WHERE id=? AND role='Client'").get(data.clientId))throw fail(400,'Unknown client');
  const id=randomUUID();db.prepare('INSERT INTO invoices(id,client_id,description,amount,due_date) VALUES(?,?,?,?,?)').run(id,data.clientId,data.description,data.amount,data.dueDate);res.status(201).json({id});
 });
 app.get('/api/invoices',(req,res)=>res.json(req.user.role==='Admin'?db.prepare('SELECT i.*,u.name client_name FROM invoices i JOIN users u ON u.id=i.client_id ORDER BY i.created_at DESC').all():db.prepare('SELECT * FROM invoices WHERE client_id=? ORDER BY created_at DESC').all(req.user.id)));
 app.get('/api/invoices/:id',owned,(req,res)=>res.json(req.invoice));
 app.get('/api/invoices/:id/pdf',owned,async(req,res)=>{
  const inv=req.invoice;const stored=db.prepare('SELECT pdf FROM deliveries WHERE invoice_id=?').get(inv.id)?.pdf;
  const pdf=stored||await receipt(inv,db.prepare('SELECT name,email FROM users WHERE id=?').get(inv.client_id));
  res.set({'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="nexus-${inv.id}.pdf"`}).send(Buffer.from(pdf));
 });
 app.post('/api/invoices/:id/checkout',owned,async(req,res)=>{
  const inv=req.invoice;if(req.user.role!=='Client')throw fail(403,'Only the billed client can pay');
  if(inv.status==='Paid')throw fail(409,'Invoice already paid');
  // Persist a stable attempt BEFORE calling Stripe. Concurrent requests use the same key and parameters.
  let attempt=transaction(db,()=>{db.prepare('INSERT OR IGNORE INTO attempts(id,invoice_id,created) VALUES(?,?,?)').run(randomUUID(),inv.id,Math.floor(Date.now()/1000));return db.prepare('SELECT * FROM attempts WHERE invoice_id=?').get(inv.id);});
  if(attempt.session_id){const s=await stripe.checkout.sessions.retrieve(attempt.session_id);if(s.status==='open')return res.json({url:s.url});if(s.status!=='expired')throw fail(409,'Payment is processing. Wait for confirmation.');
   transaction(db,()=>{db.prepare('DELETE FROM attempts WHERE id=?').run(attempt.id);});
   throw fail(409,'Checkout expired. Click Pay again to start a new session.');
  }
  // Fail closed after ambiguity/expiry: never blindly rotate an unresolved Stripe idempotency key.
  if(Date.now()/1000-attempt.created>1800)throw fail(409,'Checkout needs reconciliation. Contact your administrator.');
  const s=await stripe.checkout.sessions.create({mode:'payment',payment_method_types:['card'],client_reference_id:inv.id,metadata:{invoiceId:inv.id,attemptId:attempt.id},line_items:[{price_data:{currency:inv.currency,unit_amount:inv.amount,product_data:{name:inv.description}},quantity:1}],success_url:`${appUrl}/invoices/${inv.id}?payment=return`,cancel_url:`${appUrl}/invoices/${inv.id}?payment=cancelled`,expires_at:attempt.created+3600},{idempotencyKey:`invoice-${attempt.id}`});
  db.prepare('UPDATE attempts SET session_id=? WHERE id=?').run(s.id,attempt.id);res.json({url:s.url});
 });
 app.use('/api',(req,res)=>res.status(404).json({error:'Route not found'}));
 app.use((err,req,res,next)=>{if(err instanceof z.ZodError)return res.status(400).json({error:'Invalid invoice fields'});console.error(err.message);res.status(err.status||500).json({error:err.status?err.message:'Request failed. Please retry.'});});
 return app;
}
