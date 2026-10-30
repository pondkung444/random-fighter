(function(root){
'use strict';
const windows=Array.from({length:20},(_,i)=>i+1),MAX_ITEMS=2;
const clone=x=>JSON.parse(JSON.stringify(x));
function create(groups){if(groups.length!==4||groups.some(g=>!g.members.length))throw Error('ต้องมี 4 ทีมและสมาชิกอย่างน้อยทีมละหนึ่งคน');return {version:1,storm:0,questionOrder:Array.from({length:20},(_,i)=>i),index:0,phase:'harbor',teams:groups.map((g,i)=>({id:'t'+i,name:g.name,gold:0,stars:0,earned:0,uses:0,members:g.members.map((m,j)=>({id:'t'+i+'m'+j,name:typeof m==='string'?m:m.name})),queue:[],last:null})),selected:{},orders:{},first:{},recovery:{},history:[],remaining:180,running:false,elapsed:0};}
function shuffle(a,rng){for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function draw(s,rng=Math.random){if(s.phase!=='harbor')throw Error('สุ่มได้ก่อนเริ่มข้อเท่านั้น');for(const t of s.teams){if(!t.queue.length){t.queue=shuffle(t.members.map(m=>m.id),rng);if(t.queue.length>1&&t.queue[0]===t.last)[t.queue[0],t.queue[1]]=[t.queue[1],t.queue[0]];}s.selected[t.id]=t.queue.shift();t.last=s.selected[t.id];}s.orders={};s.first={};s.recovery={};s.phase='plan';}
function available(s){return Number.isInteger(s.index)&&s.index>=0&&s.index<20;}
function used(s,id,kind){return s.history.filter(r=>r.orders?.[id]?.kind===kind).length+(['solo','team','answer'].includes(s.phase)&&s.orders?.[id]?.kind===kind?1:0);}
function remaining(s,id,kind){return Math.max(0,MAX_ITEMS-used(s,id,kind));}
function lock(s,orders){if(s.phase!=='plan')throw Error('ล็อกคำสั่งไปแล้ว');const validated={};for(const t of s.teams){const o=orders[t.id]||{kind:'pass'};if(!['pass','hook','raid','snatch'].includes(o.kind))throw Error('ไม่รู้จักของ');let cost=0;if(o.kind!=='pass'){if(!available(s)||remaining(s,t.id,o.kind)===0)throw Error('ของชนิดนี้ใช้ครบ 2 ชิ้นแล้ว');cost=o.kind==='raid'?Math.floor(t.gold/2):o.kind==='hook'?40:30;if(['raid','snatch'].includes(o.kind)&&(!s.teams.some(x=>x.id===o.target&&x.id!==t.id)||(o.kind==='raid'&&t.gold<2)))throw Error('เลือกทีมเป้าหมายและมีอาหารเพียงพอ');if(t.gold<cost)throw Error(t.name+' มีอาหารไม่พอ');}validated[t.id]={kind:o.kind,target:o.target,cost};}for(const t of s.teams){const o=validated[t.id];t.gold-=o.cost;if(o.kind!=='pass')t.uses++;}s.orders=validated;s.base=Object.fromEntries(s.teams.map(t=>[t.id,t.gold]));s.phase='solo';s.running=false;}
function mark(s,id,correct){if(s.phase!=='solo')throw Error('ไม่ใช่รอบบุคคล');if(!s.teams.some(t=>t.id===id)||typeof correct!=='boolean')throw Error('ผลไม่ถูกต้อง');s.first[id]=correct;}
function help(s){if(s.phase!=='solo'||s.teams.some(t=>typeof s.first[t.id]!=='boolean'))throw Error('ตรวจรอบบุคคลครบ 4 ทีมก่อน');s.running=false;s.phase='team';}
function recover(s,id,correct){if(s.phase!=='team'||!s.teams.some(t=>t.id===id)||s.first[id]!==false||typeof correct!=='boolean')throw Error('ทีมนี้ไม่มีรอบช่วยแก้ หรือผลไม่ถูกต้อง');s.recovery[id]=correct;}
function reveal(s){if(s.phase!=='team'||s.teams.some(t=>s.first[t.id]===false&&typeof s.recovery[t.id]!=='boolean'))throw Error('ตรวจรอบทีมให้ครบก่อน');s.phase='answer';s.running=false;}
function settle(s){if(s.phase!=='answer')throw Error('เปิดเฉลยก่อนรับอาหาร');const claims=[];const logs=[];for(const t of s.teams){const o=s.orders[t.id];if(!s.first[t.id]||o.kind==='pass')continue;if(o.kind==='hook'){for(const target of s.teams)if(target.id!==t.id&&s.first[target.id]===false)claims.push({from:target.id,to:t.id,want:30,paid:0});}if(o.kind==='snatch'&&s.first[o.target]===false)claims.push({from:o.target,to:t.id,want:80,paid:0});if(o.kind==='raid'&&s.first[o.target]===false)claims.push({from:o.target,to:t.id,want:Math.floor(s.base[o.target]/2),paid:0});}
// Settle simultaneously from the snapshot; largest remainder allocates whole coins.
for(const target of s.teams){const cs=claims.filter(c=>c.from===target.id),total=cs.reduce((n,c)=>n+c.want,0),budget=Math.min(s.base[target.id],total);if(!total)continue;for(const c of cs){c.exact=c.want*budget/total;c.paid=Math.floor(c.exact);}let left=budget-cs.reduce((n,c)=>n+c.paid,0);cs.sort((a,b)=>(b.exact-b.paid)-(a.exact-a.paid)||a.to.localeCompare(b.to));for(let i=0;i<left;i++)cs[i].paid++;}
for(const c of claims){s.teams.find(t=>t.id===c.from).gold-=c.paid;s.teams.find(t=>t.id===c.to).gold+=c.paid;logs.push({kind:'steal',...c});}
for(const t of s.teams){const reward=s.first[t.id]?100:s.recovery[t.id]?50:0,bonus=0,stars=s.first[t.id]?2:s.recovery[t.id]?1:0;t.gold+=reward;t.earned+=reward;t.stars+=stars;if(s.index>=18)s.storm+=stars;logs.push({kind:'reward',team:t.id,reward,bonus,stars});}
const record={number:s.index+1,questionNumber:(s.questionOrder?.[s.index]??s.index)+1,selected:clone(s.selected),orders:clone(s.orders),first:clone(s.first),recovery:clone(s.recovery),logs,gold:Object.fromEntries(s.teams.map(t=>[t.id,t.gold]))};s.history.push(record);s.phase='result';return record;}
function next(s){if(s.phase!=='result')throw Error('รับอาหารก่อนเดินทางต่อ');if(s.index===19){s.phase='finished';return;}s.index++;s.phase='harbor';s.selected={};s.orders={};s.first={};s.recovery={};s.remaining=180;s.running=false;}
function validate(s){
const fail=()=>{throw Error('ไฟล์เซสชันไม่ถูกต้อง');};
if(!s||!Number.isInteger(s.storm)||s.storm<0||s.storm>16||s.version!==1||!Array.isArray(s.teams)||s.teams.length!==4||!Number.isInteger(s.index)||s.index<0||s.index>19||!['harbor','plan','solo','team','answer','result','finished'].includes(s.phase)||!Array.isArray(s.history)||s.history.length>20||!Number.isFinite(s.remaining)||s.remaining<0||!Number.isFinite(s.elapsed)||s.elapsed<0)fail();
if(s.questionOrder!==undefined&&(!Array.isArray(s.questionOrder)||s.questionOrder.length!==20||new Set(s.questionOrder).size!==20||s.questionOrder.some(n=>!Number.isInteger(n)||n<0||n>19)))fail();
for(let i=0;i<4;i++){
const t=s.teams[i];
if(!t||!Number.isInteger(t.stars)||t.stars<0||t.stars>40||!Number.isSafeInteger(t.earned)||t.earned<0||t.id!=='t'+i||typeof t.name!=='string'||!Number.isSafeInteger(t.gold)||t.gold<0||!Number.isInteger(t.uses)||t.uses<0||t.uses>6||!Array.isArray(t.members)||!t.members.length||!Array.isArray(t.queue))fail();
const ids=new Set();for(const m of t.members){if(!m||typeof m.id!=='string'||typeof m.name!=='string'||ids.has(m.id))fail();ids.add(m.id);}
if(t.queue.some(id=>!ids.has(id))||new Set(t.queue).size!==t.queue.length||(t.last!==null&&!ids.has(t.last)))fail();
if(s.phase!=='harbor'&&!ids.has(s.selected?.[t.id]))fail();
if(['solo','team','answer','result','finished'].includes(s.phase)){
const o=s.orders?.[t.id];if(!o||!['pass','hook','raid','snatch'].includes(o.kind)||!Number.isSafeInteger(o.cost)||o.cost<0||!Number.isSafeInteger(s.base?.[t.id])||s.base[t.id]<0)fail();
if(['raid','snatch'].includes(o.kind)&&!s.teams.some(x=>x.id===o.target&&x.id!==t.id))fail();
}
if(['team','answer','result','finished'].includes(s.phase)&&typeof s.first?.[t.id]!=='boolean')fail();
if(['answer','result','finished'].includes(s.phase)&&s.first[t.id]===false&&typeof s.recovery?.[t.id]!=='boolean')fail();
}
if(s.history.length!==s.index+(['result','finished'].includes(s.phase)?1:0)||(s.phase==='finished'&&s.index!==19))fail();
for(let i=0;i<s.history.length;i++){
const r=s.history[i];if(!r||r.number!==i+1||!Array.isArray(r.logs))fail();
for(const t of s.teams){if(typeof r.first?.[t.id]!=='boolean'||!r.orders?.[t.id]||!Number.isSafeInteger(r.gold?.[t.id])||r.gold[t.id]<0)fail();}
for(const l of r.logs){if(!l||!['steal','reward'].includes(l.kind))fail();if(l.kind==='steal'&&(!s.teams.some(t=>t.id===l.from)||!s.teams.some(t=>t.id===l.to)||!Number.isSafeInteger(l.paid)||l.paid<0))fail();if(l.kind==='reward'&&(!s.teams.some(t=>t.id===l.team)||!Number.isSafeInteger(l.reward)||l.reward<0||!Number.isSafeInteger(l.bonus)||l.bonus<0))fail();}
}
return s;
}
const api={create,draw,available,lock,mark,help,recover,reveal,settle,next,clone,windows,used,remaining,validate};if(typeof module!=='undefined')module.exports=api;else root.DragonEngine=api;
})(globalThis);
