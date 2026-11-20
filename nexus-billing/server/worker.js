import {receipt} from './pdf.js';
export function deliveryWorker(db,mailer,from){
 let busy=false;
 return async()=>{if(busy)return;busy=true;try{
  const jobs=db.prepare('SELECT * FROM deliveries WHERE sent=0 AND next_try<=? LIMIT 10').all(Date.now());
  for(const job of jobs){try{
   const inv=db.prepare('SELECT * FROM invoices WHERE id=?').get(job.invoice_id);
   const client=db.prepare('SELECT name,email FROM users WHERE id=?').get(inv.client_id);
   const pdf=job.pdf?Buffer.from(job.pdf):await receipt(inv,client);
   if(!job.pdf){db.prepare('UPDATE deliveries SET pdf=? WHERE invoice_id=?').run(pdf,inv.id);console.info('PDF generated:',inv.id);}
   await mailer.sendMail({from,to:client.email,subject:`Nexus payment receipt ${inv.id}`,text:`Hello ${client.name},\nYour payment is confirmed. Your receipt is attached.\nNexus Corporate`,messageId:`<receipt-${inv.id}@nexus.local>`,attachments:[{filename:`receipt-${inv.id}.pdf`,content:pdf,contentType:'application/pdf'}]});
   db.prepare('UPDATE deliveries SET sent=1 WHERE invoice_id=?').run(inv.id);console.info('Receipt email sent:',inv.id);
  }catch(e){db.prepare('UPDATE deliveries SET tries=tries+1,next_try=? WHERE invoice_id=?').run(Date.now()+Math.min(3600000,5000*2**Math.min(job.tries,10)),job.invoice_id);console.error('Receipt delivery failed; retry scheduled:',job.invoice_id,e.code||'delivery-error');}}
 }finally{busy=false;}};
}
