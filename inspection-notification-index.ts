const RESEND_API_KEY=Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL=Deno.env.get('FROM_EMAIL')||'American Property <notifications@example.com>';
const BUSINESS_EMAIL=Deno.env.get('BUSINESS_EMAIL')||'AmericanPropertyAI@icloud.com';
Deno.serve(async(req)=>{
 if(req.method!=='POST') return new Response('Method not allowed',{status:405});
 const x=await req.json();
 const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const detail=`<h2>New Inspection Request</h2><p><b>${esc(x.full_name)}</b><br>${esc(x.phone)}<br>${esc(x.email)}<br>${esc(x.property_address)}</p><p>${esc(x.inspection_type)}<br>Preferred: ${esc(x.preferred_date)} ${esc(x.preferred_time)}</p><p>${esc(x.additional_notes)}</p>`;
 const customer=`<h2>We received your inspection request</h2><p>Thank you, ${esc(x.full_name)}. American Property Adjusting & Inspection received your request for ${esc(x.inspection_type)}.</p><p>We will contact you to confirm appointment availability, scope and final pricing.</p><p>Questions? Call 208-901-9611.</p>`;
 async function send(to,subject,html){return fetch('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${RESEND_API_KEY}`},body:JSON.stringify({from:FROM_EMAIL,to:[to],subject,html})})}
 const a=await send(BUSINESS_EMAIL,`New inspection request - ${x.full_name}`,detail);
 const c=x.email?await send(x.email,'We received your inspection request',customer):null;
 return Response.json({business:a.ok,customer:c?c.ok:false},{status:a.ok?200:502});
});
