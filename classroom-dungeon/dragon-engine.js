(function(root){
'use strict';
const COUNT=27,PACK='onet2568-q14-2567-v1';
const events={
rain:{icon:'🥕',title:'ฝนแครอตตก!',tag:'รอบแจกหนัก',description:'เมฆวิเศษโปรยแครอตทั่วโรงเรียน! ตัวแทนทีมใดตอบถูก รับอาหารเพิ่ม 100',reward:'ถูก: อาหาร 200 + ดาว 2 · ผิด: 0'},
raid:{icon:'🐉',title:'มังกรจอมฉกบุกคลัง',tag:'ดวลเป็นคู่',description:'สุ่มจับคู่ 2 คู่ ถ้าทีมหนึ่งถูกแต่อีกทีมผิด ทีมที่ถูกฉกอาหารคู่แข่งได้สูงสุด 80 ถ้าถูกทั้งคู่หรือผิดทั้งคู่ ไม่มีการฉก',reward:'รางวัลปกติ + ฉกได้สูงสุด 80 · คิดจากอาหารก่อนแจกของข้อนี้'},
storm:{icon:'🌩️',title:'พายุถล่มโรงเรียน',tag:'ภารกิจร่วมมือ',description:'ตอบถูกอย่างน้อย 3 จาก 4 ทีม เพื่อกางเกราะปกป้องโรงเรียนสำเร็จ ทุกทีมรับอาหารเพิ่ม 50 แม้ทีมนั้นจะตอบผิด',reward:'สำเร็จ: ทุกทีม +50 อาหาร · รางวัลคำตอบยังได้ตามปกติ'},
cave:{icon:'💎',title:'ถ้ำอัญมณีลึกลับ',tag:'เลือกเส้นทางก่อนเห็นโจทย์',description:'แต่ละทีมเลือกทางปลอดภัยหรือทางเสี่ยงก่อนเปิดโจทย์ ทางปลอดภัยรับรางวัลปกติ ทางเสี่ยงตอบถูกได้ดาวเพิ่ม 2 แต่ตอบผิดเสียอาหารสูงสุด 50',reward:'ปลอดภัย: ถูก +100 อาหาร / +2 ดาว · เสี่ยง: ถูก +100 อาหาร / +4 ดาว หรือผิด −50 อาหาร'},
challenger:{icon:'👑',title:'มังกรผู้ท้าชิง',tag:'โอกาสพลิกเกม',description:'ทีมที่มีดาวน้อยที่สุดก่อนเริ่มข้อนี้ หากตัวแทนตอบถูก รับดาวเพิ่ม 2 หากดาวเสมอกัน ทุกทีมที่มีดาวต่ำสุดได้สิทธิ์',reward:'ทีมผู้ท้าชิงตอบถูก: อาหาร 100 + ดาว 4 · ทีมอื่นรับรางวัลปกติ'},
chest:{icon:'🎁',title:'หีบสมบัติมังกร',tag:'ตอบถูกแล้วลุ้นต่อ',description:'ตัวแทนที่ตอบถูกจะได้เปิดหีบของทีม ลุ้นอาหารเพิ่ม 50, อาหารเพิ่ม 100 หรือดาวเพิ่ม 1 โอกาสเท่ากัน ทุกหีบมีรางวัล',reward:'ตอบถูก: รับรางวัลปกติ แล้วเปิดหีบทีละทีม'}
};
const clone=x=>JSON.parse(JSON.stringify(x));
function shuffle(a,rng){for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(groups){if(groups.length!==4||groups.some(g=>!g.members.length))throw Error('ต้องมี 4 ทีมและสมาชิกอย่างน้อยทีมละหนึ่งคน');return {version:3,packId:PACK,storm:0,questionOrder:Array.from({length:COUNT},(_,i)=>i),index:0,phase:'harbor',teams:groups.map((g,i)=>({id:'t'+i,name:g.name,gold:0,stars:0,earned:0,uses:0,members:g.members.map((m,j)=>({id:'t'+i+'m'+j,name:typeof m==='string'?m:m.name})),queue:[],last:null})),selected:{},orders:{},first:{},recovery:{},history:[],event:null,remaining:180,running:false,elapsed:0};}
function chooseEvent(s,rng=Math.random){
let kind=s.index===0?'rain':s.index===1?'chest':null;
if(!kind){const previous=s.history.at(-1)?.event?.kind;
const pool=Object.keys(events).filter(k=>k!==previous&&(k!=='raid'||s.teams.every(t=>t.gold>0))&&(k!=='challenger'||s.index>=7));
kind=pool[Math.floor(rng()*pool.length)];}
const ids=shuffle(s.teams.map(t=>t.id),rng),low=Math.min(...s.teams.map(t=>t.stars));
return {kind,pairs:kind==='raid'?[[ids[0],ids[1]],[ids[2],ids[3]]]:[],eligible:kind==='challenger'?s.teams.filter(t=>t.stars===low).map(t=>t.id):[],choices:{},opened:{},prizes:kind==='chest'?Object.fromEntries(s.teams.map(t=>[t.id,['food50','food100','star1'][Math.floor(rng()*3)]])):{},acknowledged:false};
}
function draw(s,rng=Math.random){if(s.phase!=='harbor')throw Error('สุ่มได้ก่อนเริ่มข้อเท่านั้น');for(const t of s.teams){if(!t.queue.length){t.queue=shuffle(t.members.map(m=>m.id),rng);if(t.queue.length>1&&t.queue[0]===t.last)[t.queue[0],t.queue[1]]=[t.queue[1],t.queue[0]];}s.selected[t.id]=t.queue.shift();t.last=s.selected[t.id];}s.orders={};s.first={};s.event=chooseEvent(s,rng);s.phase='plan';}
function acknowledge(s){if(s.phase!=='plan'||!s.event)throw Error('ยังไม่มีเหตุการณ์');s.event.acknowledged=true;}
function lock(s,choices={}){if(s.phase!=='plan'||!s.event?.acknowledged)throw Error('อ่านเหตุการณ์แล้วกดยืนยันก่อนเปิดโจทย์');if(s.event.kind==='cave'){for(const t of s.teams)if(!['safe','risk'].includes(choices[t.id]))throw Error('เลือกเส้นทางให้ครบ 4 ทีมก่อน');s.event.choices=clone(choices);}s.orders=Object.fromEntries(s.teams.map(t=>[t.id,{kind:'pass',cost:0}]));s.base=Object.fromEntries(s.teams.map(t=>[t.id,t.gold]));s.phase='solo';s.running=false;}
function mark(s,id,correct){if(s.phase!=='solo'||!s.teams.some(t=>t.id===id)||typeof correct!=='boolean')throw Error('ผลคำตอบไม่ถูกต้อง');s.first[id]=correct;}
function reveal(s){if(s.phase!=='solo'||s.teams.some(t=>typeof s.first[t.id]!=='boolean'))throw Error('ตรวจคำตอบตัวแทนให้ครบ 4 ทีมก่อน');s.phase='answer';s.running=false;}
function settle(s,rng=Math.random){
if(s.phase!=='answer')throw Error('เปิดเฉลยก่อนรับผล');const logs=[],ev=s.event,kind=ev?.kind;
const success=s.teams.filter(t=>s.first[t.id]).length>=3;
if(kind==='raid')for(const pair of ev.pairs){const [a,b]=pair;if(s.first[a]===s.first[b])continue;const to=s.first[a]?a:b,from=to===a?b:a,paid=Math.min(80,s.base[from]);s.teams.find(t=>t.id===from).gold-=paid;s.teams.find(t=>t.id===to).gold+=paid;logs.push({kind:'steal',from,to,paid});}
for(const t of s.teams){
const correct=s.first[t.id],reward=correct?100:0;let bonus=correct&&kind==='rain'?100:kind==='storm'&&success?50:0,extraStars=correct&&((kind==='cave'&&ev.choices[t.id]==='risk')||(kind==='challenger'&&ev.eligible.includes(t.id)))?2:0,penalty=kind==='cave'&&ev.choices[t.id]==='risk'&&!correct?Math.min(50,t.gold):0;
const stars=correct?2:0;t.gold+=reward+bonus-penalty;t.earned+=reward+bonus;t.stars+=stars+extraStars;if(s.index>=25)s.storm+=stars;

logs.push({kind:'reward',team:t.id,reward,bonus,stars,extraStars,penalty});
}
if(ev)ev.success=success;
const record={number:s.index+1,questionNumber:s.index<7?s.index+14:s.index-6,questionYear:s.index<7?2568:2567,selected:clone(s.selected),orders:clone(s.orders),first:clone(s.first),logs,event:clone(ev),gold:Object.fromEntries(s.teams.map(t=>[t.id,t.gold]))};s.history.push(record);s.phase='result';return record;
}
function pending(s){return s.phase==='result'&&s.event?.kind==='chest'?s.teams.filter(t=>s.first[t.id]&&!s.event.opened[t.id]).map(t=>t.id):[];}
function openChest(s,id){if(!pending(s).includes(id))throw Error('หีบนี้เปิดไปแล้วหรือไม่มีสิทธิ์');const t=s.teams.find(t=>t.id===id),prize=s.event.prizes[id],food=prize==='food50'?50:prize==='food100'?100:0,stars=prize==='star1'?1:0;t.gold+=food;t.earned+=food;t.stars+=stars;s.event.opened[id]=true;const r=s.history.at(-1);r.event=clone(s.event);r.logs.push({kind:'chest',team:id,food,stars});r.gold[id]=t.gold;}
function next(s){if(s.phase!=='result')throw Error('รับผลก่อนเดินทางต่อ');if(pending(s).length)throw Error('เปิดหีบของทีมที่ตอบถูกให้ครบก่อน');if(s.index===COUNT-1){s.phase='finished';return;}s.index++;s.phase='harbor';s.selected={};s.orders={};s.first={};s.event=null;s.remaining=180;s.running=false;}
function upgrade(s){if(s?.version===2&&s.packId===PACK){s.version=3;s.event=null;if(['plan','team'].includes(s.phase)){s.phase='plan';s.first={};s.event=chooseEvent(s);} }return s;}
function validate(s){
const fail=()=>{throw Error('ไฟล์เซสชันไม่ถูกต้อง');};
if(!s||s.version!==3||s.packId!==PACK||!Number.isInteger(s.index)||s.index<0||s.index>=COUNT||!['harbor','plan','solo','answer','result','finished'].includes(s.phase)||!Array.isArray(s.teams)||s.teams.length!==4||!Array.isArray(s.history)||s.history.length!==s.index+(['result','finished'].includes(s.phase)?1:0)||!Number.isFinite(s.remaining)||s.remaining<0||!Number.isFinite(s.elapsed)||s.elapsed<0||!Number.isInteger(s.storm)||s.storm<0||s.storm>16)fail();
if(!Array.isArray(s.questionOrder)||s.questionOrder.length!==COUNT||s.questionOrder.some((n,i)=>n!==i))fail();
for(let i=0;i<4;i++){const t=s.teams[i];if(!t||t.id!=='t'+i||typeof t.name!=='string'||!Number.isSafeInteger(t.gold)||t.gold<0||!Number.isSafeInteger(t.stars)||t.stars<0||t.stars>COUNT*4||!Number.isSafeInteger(t.earned)||t.earned<0||!Array.isArray(t.members)||!t.members.length||!Array.isArray(t.queue))fail();const ids=new Set();for(const m of t.members){if(!m||typeof m.id!=='string'||typeof m.name!=='string'||ids.has(m.id))fail();ids.add(m.id);}if(t.queue.some(id=>!ids.has(id))||new Set(t.queue).size!==t.queue.length||(t.last!==null&&!ids.has(t.last)))fail();if(s.phase!=='harbor'&&!ids.has(s.selected?.[t.id]))fail();if(['answer','result','finished'].includes(s.phase)&&typeof s.first?.[t.id]!=='boolean')fail();}
if(s.phase==='finished'&&s.index!==COUNT-1)fail();
const ev=s.event;if(s.phase==='plan'&&!ev)fail();if(ev){
if(!events[ev.kind]||typeof ev.acknowledged!=='boolean'||!ev.choices||!ev.opened||!ev.prizes||!Array.isArray(ev.pairs)||!Array.isArray(ev.eligible))fail();
const ids=s.teams.map(t=>t.id);
if(ev.kind==='raid'&&(ev.pairs.length!==2||ev.pairs.some(p=>!Array.isArray(p)||p.length!==2)||new Set(ev.pairs.flat()).size!==4||ev.pairs.flat().some(id=>!ids.includes(id))))fail();
if(ev.eligible.some(id=>!ids.includes(id)))fail();
if(['solo','answer','result','finished'].includes(s.phase)&&!ev.acknowledged)fail();
if(ev.kind==='cave'&&s.phase!=='plan'&&ids.some(id=>!['safe','risk'].includes(ev.choices[id])))fail();
if(Object.keys(ev.opened).some(id=>!ids.includes(id)||ev.opened[id]!==true))fail();
if(Object.entries(ev.prizes).some(([id,p])=>!ids.includes(id)||!['food50','food100','star1'].includes(p)))fail();
if(ev.kind==='chest'&&['result','finished'].includes(s.phase)&&ids.some(id=>s.first[id]&&!ev.prizes[id]))fail();
}
for(let i=0;i<s.history.length;i++){const r=s.history[i];if(!r||r.number!==i+1||!Array.isArray(r.logs))fail();for(const t of s.teams)if(typeof r.first?.[t.id]!=='boolean'||!Number.isSafeInteger(r.gold?.[t.id])||r.gold[t.id]<0)fail();for(const l of r.logs)if(!l||!['reward','steal','chest'].includes(l.kind))fail();}
return s;}
const api={create,draw,acknowledge,lock,mark,reveal,settle,next,clone,validate,upgrade,events,chooseEvent,pending,openChest};if(typeof module!=='undefined')module.exports=api;else root.DragonEngine=api;
})(globalThis);
