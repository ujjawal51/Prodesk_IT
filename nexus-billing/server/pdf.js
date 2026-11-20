import PDFDocument from 'pdfkit';
export function receipt(invoice,client){return new Promise((resolve,reject)=>{
 const doc=new PDFDocument({size:'A4',margin:50});const chunks=[];
 doc.on('data',c=>chunks.push(c));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);
 // Original vector wordmark; replace with the client's approved logo if supplied.
 doc.roundedRect(50,45,44,44,10).fill('#193f37');doc.fillColor('white').fontSize(27).text('N',61,52);
 doc.fillColor('#193f37').fontSize(23).text('NEXUS CORPORATE',108,50).fontSize(10).text('BILLING & CLIENT SERVICES',109,79);
 doc.moveTo(50,115).lineTo(545,115).strokeColor('#dce5df').stroke();
 doc.fontSize(28).text(invoice.status==='Paid'?'Payment receipt':'Invoice',50,145);
 doc.fontSize(10).fillColor('#52635e').text(`Invoice: ${invoice.id}`,50,190).text(`Issued: ${invoice.created_at}`).text(`Due: ${invoice.due_date}`);
 doc.moveDown(2).text('BILLED TO').fillColor('#122b25').fontSize(14).text(client.name).fontSize(11).text(client.email);
 doc.moveDown(2).fontSize(12).text(invoice.description,{width:490});doc.moveDown(2);
 doc.fontSize(22).text(`Total: ${invoice.currency.toUpperCase()} ${(invoice.amount/100).toFixed(2)}`);
 if(invoice.status==='Paid'){doc.moveDown().fillColor('#167b53').fontSize(30).text('PAID');doc.fontSize(10).text(`Confirmed: ${invoice.paid_at}`).text(`Payment reference: ${invoice.payment_id}`);}
 doc.fillColor('#52635e').fontSize(10).text('Thank you for choosing Nexus Corporate.',50,740);doc.end();
});}
