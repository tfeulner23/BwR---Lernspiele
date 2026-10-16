import {VERSION,blank,sanitize} from './assignment.mjs';
import {grade} from './grading.mjs';
const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export const normalizeCode=x=>typeof x==='string'?x.replace(/[\s-]/g,'').toLowerCase():'';
export async function hashCode(code){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(code)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
const ALPHABET='23456789abcdefghjkmnpqrstuvwxyz';
export const makeCode=()=>{const out=[];while(out.length<4){for(const b of crypto.getRandomValues(new Uint8Array(8))){if(b<Math.floor(256/ALPHABET.length)*ALPHABET.length)out.push(ALPHABET[b%ALPHABET.length]);if(out.length===4)break;}}return out.join('');};
async function unusedCode(db,reserved){for(let i=0;i<50;i++){const code=makeCode(),hash=await hashCode(code);if(!reserved.has(hash)&&!(await db.get('abschluss_seats',{code_hash:'eq.'+hash,select:'id',limit:'1'})).length&&!(await db.get('abschluss_seats',{short_code_hash:'eq.'+hash,select:'id',limit:'1'})).length){reserved.add(hash);return {code,hash};}}throw new Fault('Bitte die Codevergabe erneut versuchen.',503);}
class Fault extends Error{constructor(message,status=400,code='request'){super(message);this.status=status;this.code=code;}}
export function createHandler({db,verifyUser,issueSession,verifySession,allowedOrigins,now=()=>new Date().toISOString()}){
 const bursts=new Map();
 return async function(req){const origin=req.headers.get('Origin')||'',allowed=allowedOrigins.includes(origin);const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin',...(allowed?{'Access-Control-Allow-Origin':origin}:{})};const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(req.method==='OPTIONS')return new Response(null,{status:allowed?204:403,headers:{...headers,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Max-Age':'3600'}});
 if(origin&&!allowed)return reply({error:'Diese Herkunft ist nicht freigegeben.'},403);
 if(req.method!=='POST')return reply({error:'Nur POST ist erlaubt.'},405);
 try{const text=await req.text();if(text.length>60000)throw new Fault('Anfrage zu groß.',413);let input;try{input=JSON.parse(text);}catch{throw new Fault('Ungültige Anfrage.');}if(!input||typeof input!=='object'||Array.isArray(input))throw new Fault('Ungültige Anfrage.');
 const action=input.action;if(typeof action!=='string')throw new Fault('Aktion fehlt.');
 if(action==='health')return reply({ok:true,version:VERSION});
 if(action.startsWith('student.')){
   const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'shared',minute=Math.floor(Date.now()/60000),b=bursts.get(ip);if(b&&b.minute===minute&&b.count>=3000)throw new Fault('Zu viele Anfragen. Bitte eine Minute warten.',429);bursts.set(ip,{minute,count:b?.minute===minute?b.count+1:1});if(bursts.size>5000)bursts.clear();
   if(action==='student.open'&&db.allowLogin&&!await db.allowLogin(await hashCode('login:'+ip)))throw new Fault('Zu viele Anmeldeversuche. Bitte eine Minute warten.',429);
   let seat;
   if(action!=='student.open'){
     const seatId=await verifySession(input.code);if(!seatId)throw new Fault('Bitte mit deinem Zugangscode erneut anmelden.',401);
     seat=(await db.get('abschluss_seats',{id:'eq.'+seatId,select:'id,class_id,label',limit:'1'}))[0];
   }else{
     const code=normalizeCode(input.code);if(!/^(?:[2-9a-hjkmnp-z]{4}|[0-9a-f]{32})$/.test(code))throw new Fault('Zugangscode nicht erkannt.',401);
     const hash=await hashCode(code);seat=(await db.get('abschluss_seats',{code_hash:'eq.'+hash,select:'id,class_id,label',limit:'1'}))[0];if(!seat&&code.length===4)seat=(await db.get('abschluss_seats',{short_code_hash:'eq.'+hash,select:'id,class_id,label',limit:'1'}))[0];
   }
   if(!seat)throw new Fault('Zugangscode nicht erkannt.',401);
   const cls=(await db.get('abschluss_classes',{id:'eq.'+seat.class_id,select:'id,title,version',limit:'1'}))[0];if(!cls||cls.version!==VERSION)throw new Fault('Diese Aufgabe ist nicht verfügbar.',404);
   let attempt=(await db.get('abschluss_attempts',{seat_id:'eq.'+seat.id,select:'*',limit:'1'}))[0];if(!attempt)throw new Fault('Bearbeitung noch nicht eingerichtet.',503);
   if(action==='student.open'){
     if(!attempt.started_at){await db.patch('abschluss_attempts',{seat_id:'eq.'+seat.id,started_at:'is.null'},{started_at:now(),updated_at:now()});attempt=(await db.get('abschluss_attempts',{seat_id:'eq.'+seat.id,select:'*',limit:'1'}))[0];}
     return reply({accessCode:await issueSession(seat.id),seat:{id:seat.id,label:seat.label},classTitle:cls.title,attempt:publicAttempt(attempt)});
   }
   if(!['student.save','student.submit'].includes(action))throw new Fault('Unbekannte Aktion.',404);
   if(action==='student.submit'&&attempt.submission_revision===input.revision+1&&JSON.stringify(sanitize(input.answers))===JSON.stringify(sanitize(attempt.submitted_answers)))return reply({attempt:publicAttempt(attempt,'result')});
   if(!Number.isSafeInteger(input.revision)||input.revision!==attempt.revision)throw new Fault('Ein anderer Bearbeitungsstand liegt vor. Bitte Serverstand laden.',409,'conflict');
   if(!input.answers||typeof input.answers!=='object'||Array.isArray(input.answers))throw new Fault('Antworten fehlen.');const answers=sanitize(input.answers),stamp=now();
   const update={answers,revision:attempt.revision+1,started_at:attempt.started_at||stamp,updated_at:stamp};if(action==='student.submit'){update.feedback=grade(answers);update.submitted_at=stamp;update.submitted_answers=answers;update.submission_revision=update.revision;}
   const updated=await db.patch('abschluss_attempts',{seat_id:'eq.'+seat.id,revision:'eq.'+attempt.revision},update);if(!updated[0])throw new Fault('Zwischenzeitlich wurde ein anderer Stand gespeichert. Bitte neu laden.',409,'conflict');return reply({attempt:publicAttempt(updated[0],action==='student.submit'?'result':'draft')});
 }
 if(action.startsWith('teacher.')){
   const auth=req.headers.get('Authorization')||'';if(!auth.startsWith('Bearer '))throw new Fault('Bitte als Lehrkraft anmelden.',401);const user=await verifyUser(auth.slice(7));if(!user?.id||user.is_anonymous)throw new Fault('Die Anmeldung ist nicht gültig.',401);
   if(action==='teacher.claim'){
     const code=normalizeCode(input.setupCode);if(!/^[0-9a-f]{32}$/.test(code))throw new Fault('Einrichtungscode ungültig.',403);const hash=await hashCode(code);const row=(await db.get('abschluss_setup',{singleton:'eq.true',code_hash:'eq.'+hash,select:'*',limit:'1'}))[0];if(!row||new Date(row.expires_at).getTime()<Date.now())throw new Fault('Einrichtungscode ungültig oder abgelaufen.',403);if(row.claimed_by&&row.claimed_by!==user.id)throw new Fault('Dieser Zugang wurde bereits eingerichtet.',403);
     if(!row.claimed_by){const claim=await db.patch('abschluss_setup',{singleton:'eq.true',code_hash:'eq.'+hash,claimed_by:'is.null'},{claimed_by:user.id,claimed_at:now()});if(!claim[0])throw new Fault('Der Einrichtungscode wurde gerade verwendet. Bitte erneut versuchen.',409);}
     await db.insert('abschluss_teachers',{user_id:user.id},{onConflict:'user_id',ignore:true});return reply({ok:true});
   }
   const permitted=(await db.get('abschluss_teachers',{user_id:'eq.'+user.id,select:'user_id',limit:'1'}))[0];if(!permitted)throw new Fault('Dieser Zugang ist nicht als Lehrkraft freigeschaltet.',403);
   if(action==='teacher.classes'){return reply({classes:await db.get('abschluss_classes',{owner_id:'eq.'+user.id,select:'id,title,version,created_at',order:'created_at.desc'})});}
   if(action==='teacher.create'){
     const title=typeof input.title==='string'?input.title.trim():'';if(!title||title.length>60||!Number.isInteger(input.count)||input.count<1||input.count>40)throw new Fault('Bezeichnung oder Platzanzahl ist ungültig.');const existing=await db.get('abschluss_classes',{owner_id:'eq.'+user.id,select:'id',limit:'51'});if(existing.length>=50)throw new Fault('Höchstens 50 Lerngruppen sind erlaubt.');
     const cls={id:crypto.randomUUID(),owner_id:user.id,title,version:VERSION,created_at:now()};await db.insert('abschluss_classes',cls);const codes=[],rows=[],reserved=new Set();for(let i=1;i<=input.count;i++){const secret=await unusedCode(db,reserved),label='Platz '+String(i).padStart(2,'0'),id=crypto.randomUUID();codes.push({label,code:secret.code.toUpperCase()});rows.push({id,class_id:cls.id,label,code_hash:secret.hash});}await db.insert('abschluss_seats',rows);await db.insert('abschluss_attempts',rows.map(s=>({seat_id:s.id,answers:blank()})));return reply({class:{id:cls.id,title:cls.title,version:cls.version,created_at:cls.created_at},codes});
   }
   if(action==='teacher.roster'){
     if(typeof input.classId!=='string'||!UUID.test(input.classId))throw new Fault('Ungültige Lerngruppe.');const cls=(await db.get('abschluss_classes',{id:'eq.'+input.classId,owner_id:'eq.'+user.id,select:'id',limit:'1'}))[0];if(!cls)throw new Fault('Kein Zugriff auf diese Lerngruppe.',403);
     const seats=await db.get('abschluss_seats',{class_id:'eq.'+cls.id,select:'id,label',order:'label.asc'});const ids=seats.map(s=>s.id);const attempts=ids.length?await db.get('abschluss_attempts',{seat_id:'in.('+ids.join(',')+')',select:'*'}):[];return reply({seats:seats.map(s=>({id:s.id,label:s.label,attempt:publicAttempt(attempts.find(a=>a.seat_id===s.id),'teacher')}))});
   }
   throw new Fault('Unbekannte Aktion.',404);
 }
 throw new Fault('Unbekannte Aktion.',404);
 }catch(e){if(e instanceof Fault)return reply({error:e.message,code:e.code},e.status);console.error('Abschluss-API: Anfrage konnte nicht verarbeitet werden.');return reply({error:'Der Speicherdienst ist vorübergehend nicht verfügbar. Dein lokaler Stand bleibt erhalten.'},503);}
 };
}
function publicAttempt(row,view='draft'){if(!row)return null;const submitted=row.submitted_at?sanitize(row.submitted_answers||row.answers):null;return {answers:view!=='draft'&&submitted?submitted:sanitize(row.answers),revision:row.revision,started_at:row.started_at,updated_at:view==='teacher'&&submitted?row.submitted_at:row.updated_at,submitted_at:row.submitted_at,feedback:view!=='draft'&&row.submitted_at?row.feedback:null,last_submission:row.submitted_at?{at:row.submitted_at,score:row.feedback.score,max:row.feedback.max}:null,draft_pending:!!submitted&&JSON.stringify(sanitize(row.answers))!==JSON.stringify(submitted)};}
