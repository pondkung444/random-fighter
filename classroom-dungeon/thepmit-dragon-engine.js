(function(root){
'use strict';
const COUNT=50,PACK='thepmit-sme-physics50-v1';
const legacyEvents={
rain:{icon:'🥕',title:'ฝนแครอตตก!',tag:'รอบแจกหนัก',description:'เมฆวิเศษโปรยแครอตทั่วโรงเรียน! ตัวแทนทีมใดตอบถูก รับอาหารเพิ่ม 100',reward:'ถูก: อาหาร 200 · ผิด: 0'},
raid:{icon:'🐉',title:'มังกรจอมฉกบุกคลัง',tag:'ดวลเป็นคู่',description:'สุ่มจับคู่ 2 คู่ ทีมที่ตอบถูกฉกอาหารคู่แข่งที่ตอบผิดได้สูงสุด 80 ถ้าผลเหมือนกันไม่มีการฉก',reward:'รางวัลปกติ + ฉกได้สูงสุด 80 · คิดจากอาหารก่อนแจกของข้อนี้'},
storm:{icon:'🌩️',title:'พายุถล่มโรงเรียน',tag:'ภารกิจร่วมมือ',description:'ตอบถูกอย่างน้อย 3 จาก 4 ทีม เพื่อกางเกราะปกป้องโรงเรียนสำเร็จ ทุกทีมรับอาหารเพิ่ม 50 แม้ทีมนั้นจะตอบผิด',reward:'สำเร็จ: ทุกทีม +50 อาหาร · รางวัลคำตอบยังได้ตามปกติ'},
cave:{icon:'💎',title:'ถ้ำอัญมณีลึกลับ',tag:'เลือกเส้นทางก่อนเห็นโจทย์',description:'แต่ละทีมเลือกทางปลอดภัยหรือทางเสี่ยงก่อนเปิดโจทย์ ทางปลอดภัยรับรางวัลปกติ ทางเสี่ยงตอบถูกได้อาหารรวม 200 แต่ตอบผิดเสียอาหารสูงสุด 50',reward:'ปลอดภัย: ถูก +100 อาหาร · เสี่ยง: ถูก +200 อาหาร หรือผิด −50 อาหาร'},
challenger:{icon:'👑',title:'มังกรผู้ท้าชิง',tag:'โอกาสพลิกเกม',description:'ทีมที่มีอาหารปัจจุบันน้อยที่สุดก่อนเริ่มข้อนี้ หากตัวแทนตอบถูก รับอาหารรวม 200 หากอาหารเสมอกัน ทุกทีมที่มีอาหารต่ำสุดได้สิทธิ์',reward:'ทีมผู้ท้าชิงตอบถูก: อาหาร 200 · ทีมอื่นรับรางวัลปกติ'},
chest:{icon:'🎁',title:'หีบสมบัติมังกร',tag:'ตอบถูกแล้วลุ้นต่อ',description:'ตัวแทนที่ตอบถูกจะได้เปิดหีบของทีม ลุ้นอาหารเพิ่ม 50, อาหารเพิ่ม 100 หรืออาหารเพิ่ม 150 โอกาสเท่ากัน ทุกหีบมีรางวัล',reward:'ตอบถูก: รับรางวัลปกติ แล้วเปิดหีบทีละทีม'}
};
const events={
hunt:{icon:'👑',title:'ล่าจ่าฝูง',tag:'ศึกชิงบัลลังก์',description:'จ่าฝูงก่อนเริ่มรอบต้องป้องกันคลัง! ถ้าตอบผิด เสียอาหาร 15% สูงสุด 450 แบ่งให้ผู้ล่าที่ตอบถูก ถ้าจ่าฝูงถูก ได้โบนัส 100 ถ้าไม่มีผู้ล่าถูก ไม่เสียอาหาร กรณีผู้นำเสมอ ทุกจ่าฝูงใช้กติกาเดียวกัน',reward:'ถูก +100 · จ่าฝูงป้องกันสำเร็จเพิ่ม +100 · ผู้ล่าชิงคลังเมื่อถูก'},
duel:{icon:'⚔️',title:'ศึกข้ามอันดับ',tag:'ผู้ตามท้าผู้นำ',description:'อันดับ 1 พบ 4 และ 2 พบ 3 ทีมที่ถูกชิงจากคู่ที่ผิดสูงสุด 200 ถ้าผลเหมือนกันไม่ชิง กรณีอันดับเสมอ ระบบสุ่มลำดับคู่ก่อนโจทย์',reward:'ถูก +100 · ชิงจากคู่ที่ผิดสูงสุด 200'},
volcano:{icon:'🌋',title:'ภูเขาไฟถล่มคลัง',tag:'ทุกทีมเผชิญภัย',description:'ภูเขาไฟระเบิด ทุกทีมต้องรับมือ! ถูกได้รับอาหารรวม 250 ผิดเสีย 10% ของอาหารก่อนรอบ สูงสุด 200 มังกรไม่ถอยร่าง',reward:'ถูกได้รวม +250 · ผิดเสีย 10% สูงสุด 200'},
wind:{icon:'🌌',title:'กระแสลมพลิกฟ้า',tag:'ผู้ตามเร่งเครื่อง',description:'ล็อกอันดับก่อนโจทย์ ทีมที่ตอบถูกได้อาหารรวมตามอันดับ: 1 ได้ 100 / 2 ได้ 150 / 3 ได้ 250 / 4 ได้ 350 อันดับเสมอได้รางวัลเท่ากัน',reward:'ถูกได้รวม 100 / 150 / 250 / 350 ตามอันดับ · ผิด 0'},
chaos:{icon:'🐉',title:'มังกรคลั่งป่วนสนาม',tag:'วงล่ามังกร',description:'สุ่มวงเป้าหมายให้ทุกทีม ทีมที่ถูกชิงจากเป้าหมายที่ผิดสูงสุด 150 แต่ละทีมมีผู้ล่าและเป้าหมายอย่างละหนึ่ง',reward:'ถูก +100 · ชิงจากเป้าหมายที่ผิดสูงสุด 150'},
gems:{icon:'💎',title:'อัญมณีแตกกระจาย',tag:'ถูกคนเดียวรับเต็ม',description:'ทีมที่ถูกได้รับรางวัลปกติ แล้วแบ่งกองอาหารพิเศษ 400 ถ้าถูกทีมเดียวรับทั้งกอง ถ้าผิดทั้งหมดกองหายไป เศษแบ่งตามลำดับทีม',reward:'ถูก +100 และแบ่งกองพิเศษ 400 อัตโนมัติ'}
};
function leaders(s){const high=Math.max(...s.teams.map(t=>t.gold));return s.teams.filter(t=>t.gold===high).map(t=>t.id);}
function enableNew(s){if(!s||s.packId!==PACK)return s;if(!s.rulesVersion){s.rulesVersion=2;s.eventDeck=[];for(const t of s.teams)t.roar=0;}return s;}
function stormRequired(s){return Math.ceil(s.teams.length*.75);}
function finalGoal(s){return Math.ceil(s.teams.length*1.25);}
const thresholds=[0,400,1000,1800],levelNames=['ลูกมังกร','มังกรนักสำรวจ','มังกรผู้พิทักษ์','มังกรร่างสมบูรณ์'];
function growth(t){const earned=t.earned,stage=thresholds.reduce((n,v,i)=>earned>=v?i:n,0),next=thresholds[stage+1];return {stage,level:stage+1,name:levelNames[stage],next:next??null,remaining:next?next-earned:0,progress:next?(earned-thresholds[stage])/(next-thresholds[stage]):1};}
function growthChanges(s,before){return s.teams.filter(t=>growth(t).level>before[t.id]).map(t=>({team:t.id,from:before[t.id],to:growth(t).level}));}
const clone=x=>JSON.parse(JSON.stringify(x));
function shuffle(a,rng){for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(groups){if(groups.length!==4||groups.some(g=>!g.members.length))throw Error('ต้องมี 4 ทีมและสมาชิกอย่างน้อยทีมละหนึ่งคน');return enableNew({version:4,answers:{},packId:PACK,storm:0,questionOrder:Array.from({length:COUNT},(_,i)=>i),index:0,phase:'harbor',teams:groups.map((g,i)=>({id:'t'+i,name:g.name,gold:0,earned:0,uses:0,members:g.members.map((m,j)=>({id:'t'+i+'m'+j,name:typeof m==='string'?m:m.name})),queue:[],last:null})),selected:{},orders:{},first:{},recovery:{},history:[],event:null,remaining:180,running:false,elapsed:0});}
function chooseEvent(s,rng=Math.random){
enableNew(s);
if(!s.eventDeck.length){s.eventDeck=shuffle(Object.keys(events),rng);if(s.eventDeck[0]===s.history.at(-1)?.event?.kind)[s.eventDeck[0],s.eventDeck[1]]=[s.eventDeck[1],s.eventDeck[0]];}
let kind=s.eventDeck.shift();
const shuffled=shuffle(s.teams.map(t=>t.id),rng),ranked=[...shuffled].sort((a,b)=>s.teams.find(t=>t.id===b).gold-s.teams.find(t=>t.id===a).gold);
const ranks=Object.fromEntries(s.teams.map(t=>[t.id,1+s.teams.filter(o=>o.gold>t.gold).length]));
return {kind,mode:'pairs',pairs:kind==='duel'?[[ranked[0],ranked[3]],[ranked[1],ranked[2]]]:kind==='chaos'?shuffled.map((id,i)=>[id,shuffled[(i+1)%4]]):[],leaders:leaders(s),ranks,base:Object.fromEntries(s.teams.map(t=>[t.id,t.gold])),eligible:[],choices:{},opened:{},prizes:{},acknowledged:false};
}
function draw(s,rng=Math.random){if(s.phase!=='harbor')throw Error('สุ่มได้ก่อนเริ่มข้อเท่านั้น');for(const t of s.teams){if(!t.queue.length){t.queue=shuffle(t.members.map(m=>m.id),rng);if(t.queue.length>1&&t.queue[0]===t.last)[t.queue[0],t.queue[1]]=[t.queue[1],t.queue[0]];}s.selected[t.id]=t.queue.shift();t.last=s.selected[t.id];}s.orders={};s.first={};s.answers={};s.event=chooseEvent(s,rng);s.phase='plan';}
function acknowledge(s){if(s.phase!=='plan'||!s.event)throw Error('ยังไม่มีเหตุการณ์');s.event.acknowledged=true;}
function lock(s,choices={}){if(s.phase!=='plan'||!s.event?.acknowledged)throw Error('อ่านเหตุการณ์แล้วกดยืนยันก่อนเปิดโจทย์');if(s.event.kind==='cave'){for(const t of s.teams)if(!['safe','risk'].includes(choices[t.id]))throw Error('เลือกเส้นทางให้ครบทุกทีมก่อน');s.event.choices=clone(choices);}s.orders=Object.fromEntries(s.teams.map(t=>[t.id,{kind:'pass',cost:0}]));s.base=Object.fromEntries(s.teams.map(t=>[t.id,t.gold]));s.phase='solo';s.running=false;}
function mark(s,id,correct){if(s.phase!=='answer'||!s.teams.some(t=>t.id===id)||typeof correct!=='boolean')throw Error('ผลคำตอบไม่ถูกต้อง');s.first[id]=correct;}
function submit(s,id,choice){if(s.phase!=='solo'||!s.teams.some(t=>t.id===id)||!['ก','ข','ค','ง'].includes(choice))throw Error('คำตอบไม่ถูกต้อง');if(s.answers[id])throw Error('ทีมนี้ส่งคำตอบแล้ว');s.answers[id]=choice;}
function reveal(s,key){if(s.phase!=='solo'||!['ก','ข','ค','ง'].includes(key)||s.teams.some(t=>!s.answers[t.id]))throw Error('ส่งคำตอบให้ครบทั้ง 4 ทีมก่อนเปิดเฉลย');s.first=Object.fromEntries(s.teams.map(t=>[t.id,s.answers[t.id]===key]));s.phase='answer';s.running=false;}
function settleLegacy(s,rng=Math.random){
if(s.phase!=='answer'||s.teams.some(t=>typeof s.first[t.id]!=='boolean'))throw Error('เปิดเฉลยและตรวจถูกผิดให้ครบทุกทีมก่อนรับอาหาร');const logs=[],ev=s.event,kind=ev?.kind,before=Object.fromEntries(s.teams.map(t=>[t.id,growth(t).level]));
const success=s.teams.filter(t=>s.first[t.id]).length>=stormRequired(s);
if(kind==='raid')for(const pair of ev.pairs){const [a,b]=pair;if(ev.mode==='ring'?!(s.first[a]&&!s.first[b]):s.first[a]===s.first[b])continue;const to=ev.mode==='ring'?a:s.first[a]?a:b,from=ev.mode==='ring'?b:to===a?b:a,paid=Math.min(80,s.base[from]);s.teams.find(t=>t.id===from).gold-=paid;s.teams.find(t=>t.id===to).gold+=paid;s.teams.find(t=>t.id===to).earned+=paid;logs.push({kind:'steal',from,to,paid});}
for(const t of s.teams){
const correct=s.first[t.id],reward=correct?100:0;
const bonus=correct&&(kind==='rain'||kind==='cave'&&ev.choices[t.id]==='risk'||kind==='challenger'&&ev.eligible.includes(t.id))?100:kind==='storm'&&success?50:0;
const penalty=kind==='cave'&&ev.choices[t.id]==='risk'&&!correct?Math.min(50,t.gold):0;
t.gold+=reward+bonus-penalty;t.earned+=reward+bonus;if(s.index>=COUNT-2&&correct)s.storm++;
logs.push({kind:'reward',team:t.id,reward,bonus,penalty});
}
if(ev)ev.success=success;
const record={number:s.index+1,questionNumber:s.index+1,questionYear:2569,answers:clone(s.answers),selected:clone(s.selected),orders:clone(s.orders),first:clone(s.first),logs,growth:growthChanges(s,before),event:clone(ev),gold:Object.fromEntries(s.teams.map(t=>[t.id,t.gold]))};s.history.push(record);s.phase='result';return record;
}
function settle(s,rng=Math.random){
if(!events[s.event?.kind])return settleLegacy(s,rng);
if(s.phase!=='answer'||s.teams.some(t=>typeof s.first[t.id]!=='boolean'))throw Error('เปิดเฉลยให้ครบก่อนรับผล');
const ev=s.event,kind=ev.kind,logs=[],before=Object.fromEntries(s.teams.map(t=>[t.id,growth(t).level])),oldLeaders=leaders(s),correct=s.teams.filter(t=>s.first[t.id]);
const team=id=>s.teams.find(t=>t.id===id),add=(id,n)=>{team(id).gold+=n;team(id).earned+=n;};
function split(total,ids,fn){if(!ids.length)return;ids.forEach((id,i)=>fn(id,Math.floor(total/ids.length)+(i<total%ids.length?1:0)));}
function steal(from,to,n){const paid=Math.min(n,team(from).gold);team(from).gold-=paid;add(to,paid);logs.push({kind:'steal',from,to,paid});}
if(kind==='hunt'){
const hunters=correct.filter(t=>!ev.leaders.includes(t.id)).map(t=>t.id);
for(const from of ev.leaders)if(!s.first[from]&&hunters.length){const n=Math.min(450,Math.floor(ev.base[from]*.15));split(n,hunters,(to,paid)=>steal(from,to,paid));}
}
if(kind==='duel')for(const [a,b] of ev.pairs){if(s.first[a]!==s.first[b])steal(s.first[a]?b:a,s.first[a]?a:b,Math.min(200,ev.base[s.first[a]?b:a]));}
if(kind==='chaos')for(const [to,from] of ev.pairs)if(s.first[to]&&!s.first[from])steal(from,to,Math.min(150,ev.base[from]));
const gemBonus={};if(kind==='gems')split(400,correct.map(t=>t.id),(id,n)=>gemBonus[id]=n);
for(const t of s.teams){const ok=s.first[t.id],reward=ok?100:0;
const bonus=ok?(kind==='volcano'?150:kind==='wind'?[100,150,250,350][ev.ranks[t.id]-1]-100:kind==='gems'?gemBonus[t.id]:kind==='hunt'&&ev.leaders.includes(t.id)?100:0):0;
const penalty=kind==='volcano'&&!ok?Math.min(t.gold,200,Math.floor(ev.base[t.id]*.1)):0;
add(t.id,reward+bonus);t.gold-=penalty;logs.push({kind:'reward',team:t.id,reward,bonus,penalty});
if(before[t.id]===4&&ok){t.roar++;if(t.roar===3){t.roar=0;add(t.id,150);logs.push({kind:'roar',team:t.id,food:150});}}
if(s.index>=COUNT-2&&ok)s.storm++;
}
ev.success=correct.length>0;
const record={number:s.index+1,questionNumber:s.index+1,questionYear:2569,answers:clone(s.answers),selected:clone(s.selected),orders:clone(s.orders),first:clone(s.first),logs,growth:growthChanges(s,before),event:clone(ev),gold:Object.fromEntries(s.teams.map(t=>[t.id,t.gold])),leadersBefore:oldLeaders,leadersAfter:leaders(s)};
s.history.push(record);s.phase='result';return record;
}
function pending(s){return s.phase==='result'&&s.event?.kind==='chest'?s.teams.filter(t=>s.first[t.id]&&!s.event.opened[t.id]).map(t=>t.id):[];}
function openChest(s,id){if(!pending(s).includes(id))throw Error('หีบนี้เปิดไปแล้วหรือไม่มีสิทธิ์');const t=s.teams.find(t=>t.id===id),prize=s.event.prizes[id],food=prize==='food50'?50:prize==='food100'?100:150,before=Object.fromEntries(s.teams.map(t=>[t.id,growth(t).level]));t.gold+=food;t.earned+=food;s.event.opened[id]=true;const r=s.history.at(-1);r.event=clone(s.event);r.logs.push({kind:'chest',team:id,food});r.gold[id]=t.gold;r.growth.push(...growthChanges(s,before));}
function next(s){if(s.phase!=='result')throw Error('รับผลก่อนเดินทางต่อ');if(pending(s).length)throw Error('เปิดหีบของทีมที่ตอบถูกให้ครบก่อน');if(s.index===COUNT-1){s.phase='finished';return;}s.index++;s.phase='harbor';s.selected={};s.orders={};s.first={};s.answers={};s.event=null;s.remaining=180;s.running=false;}
function upgrade(s){
if(s&&s.packId===PACK&&!s.answers){s.answers={};if(s.phase==='answer'){s.phase='solo';s.first={};}}
if(s?.version===2&&s.packId===PACK){s.version=3;s.event=null;if(['plan','team'].includes(s.phase)){s.phase='plan';s.first={};s.event=chooseEvent(s);}}
if(s?.version===3&&s.packId===PACK){
const converted=Object.fromEntries(s.teams.map(t=>[t.id,0])),stolen=Object.fromEntries(s.teams.map(t=>[t.id,0]));
for(const r of s.history){r.growth=[];for(const l of r.logs){
if(l.kind==='reward'){const food=(l.extraStars||0)*50;converted[l.team]+=food;l.bonus+=food;delete l.stars;delete l.extraStars;}
if(l.kind==='chest'){const food=(l.stars||0)*150;converted[l.team]+=food;l.food+=food;delete l.stars;}
if(l.kind==='steal')stolen[l.to]+=l.paid;
}for(const t of s.teams)r.gold[t.id]+=converted[t.id];
if(r.event)for(const id of Object.keys(r.event.prizes||{}))if(r.event.prizes[id]==='star1')r.event.prizes[id]='food150';
}
for(const t of s.teams){t.gold+=converted[t.id];t.earned+=converted[t.id]+stolen[t.id];delete t.stars;}
if(s.event)for(const id of Object.keys(s.event.prizes||{}))if(s.event.prizes[id]==='star1')s.event.prizes[id]='food150';
if(['solo','answer'].includes(s.phase)&&s.base)for(const t of s.teams)s.base[t.id]+=converted[t.id];
if(s.event?.kind==='challenger'&&['plan','solo','answer'].includes(s.phase)){const low=Math.min(...s.teams.map(t=>t.gold));s.event.eligible=s.teams.filter(t=>t.gold===low).map(t=>t.id);}
s.storm=Math.floor(s.storm/2);s.version=4;
}return enableNew(s);}
function validate(s){
const fail=()=>{throw Error('ไฟล์เซสชันไม่ถูกต้อง · โหมดนี้ใช้ 4 ทีม');};
if(!s?.answers||Array.isArray(s.answers)||Object.entries(s.answers).some(([id,a])=>!s.teams?.some(t=>t.id===id)||!['ก','ข','ค','ง'].includes(a)))fail();
if(!s||s.version!==4||s.packId!==PACK||!Number.isInteger(s.index)||s.index<0||s.index>=COUNT||!['harbor','plan','solo','answer','result','finished'].includes(s.phase)||!Array.isArray(s.teams)||s.teams.length!==4||!Array.isArray(s.history)||s.history.length!==s.index+(['result','finished'].includes(s.phase)?1:0)||!Number.isFinite(s.remaining)||s.remaining<0||!Number.isFinite(s.elapsed)||s.elapsed<0||!Number.isInteger(s.storm)||s.storm<0||s.storm>s.teams.length*2)fail();
if(!Array.isArray(s.questionOrder)||s.questionOrder.length!==COUNT||s.questionOrder.some((n,i)=>n!==i))fail();
for(let i=0;i<s.teams.length;i++){const t=s.teams[i];if(!t||t.id!=='t'+i||typeof t.name!=='string'||!Number.isSafeInteger(t.gold)||t.gold<0||!Number.isSafeInteger(t.earned)||t.earned<0||!Array.isArray(t.members)||!t.members.length||!Array.isArray(t.queue))fail();const ids=new Set();for(const m of t.members){if(!m||typeof m.id!=='string'||typeof m.name!=='string'||ids.has(m.id))fail();ids.add(m.id);}if(t.queue.some(id=>!ids.has(id))||new Set(t.queue).size!==t.queue.length||(t.last!==null&&!ids.has(t.last)))fail();if(s.phase!=='harbor'&&!ids.has(s.selected?.[t.id]))fail();if(['result','finished'].includes(s.phase)&&typeof s.first?.[t.id]!=='boolean')fail();}
if(s.phase==='finished'&&s.index!==COUNT-1)fail();
if(s.rulesVersion!==2||!Array.isArray(s.eventDeck)||s.eventDeck.some(k=>!events[k])||new Set(s.eventDeck).size!==s.eventDeck.length||s.teams.some(t=>!Number.isInteger(t.roar)||t.roar<0||t.roar>2))fail();
const ev=s.event;if(ev&&events[ev.kind]){const ids=s.teams.map(t=>t.id);if(!ev.base||!ev.ranks||!Array.isArray(ev.leaders)||ev.leaders.some(id=>!ids.includes(id))||ids.some(id=>!Number.isSafeInteger(ev.base[id])||ev.base[id]<0||!Number.isInteger(ev.ranks[id])||ev.ranks[id]<1||ev.ranks[id]>4))fail();if(['duel','chaos'].includes(ev.kind)){if(!Array.isArray(ev.pairs)||ev.pairs.some(p=>p.length!==2||p[0]===p[1]||p.some(id=>!ids.includes(id))))fail();if(ev.kind==='duel'&&(ev.pairs.length!==2||new Set(ev.pairs.flat()).size!==4))fail();if(ev.kind==='chaos'&&(ev.pairs.length!==4||new Set(ev.pairs.map(p=>p[0])).size!==4||new Set(ev.pairs.map(p=>p[1])).size!==4))fail();}}
if(s.phase==='plan'&&!ev)fail();if(ev){
if(!(events[ev.kind]||legacyEvents[ev.kind])||typeof ev.acknowledged!=='boolean'||!ev.choices||!ev.opened||!ev.prizes||!Array.isArray(ev.pairs)||!Array.isArray(ev.eligible))fail();
const ids=s.teams.map(t=>t.id);
if(ev.kind==='raid'){
if(ev.pairs.some(p=>!Array.isArray(p)||p.length!==2||p[0]===p[1]||p.some(id=>!ids.includes(id))))fail();
if(ev.mode==='ring'){if(ev.pairs.length!==ids.length||new Set(ev.pairs.map(p=>p[0])).size!==ids.length||new Set(ev.pairs.map(p=>p[1])).size!==ids.length)fail();let id=ids[0];const seen=new Set();for(let i=0;i<ids.length;i++){if(seen.has(id))fail();seen.add(id);id=ev.pairs.find(p=>p[0]===id)?.[1];}if(id!==ids[0])fail();}
else if(ev.pairs.length!==ids.length/2||new Set(ev.pairs.flat()).size!==ids.length)fail();
}
if(ev.eligible.some(id=>!ids.includes(id)))fail();
if(['solo','answer','result','finished'].includes(s.phase)&&!ev.acknowledged)fail();
if(ev.kind==='cave'&&s.phase!=='plan'&&ids.some(id=>!['safe','risk'].includes(ev.choices[id])))fail();
if(Object.keys(ev.opened).some(id=>!ids.includes(id)||ev.opened[id]!==true))fail();
if(Object.entries(ev.prizes).some(([id,p])=>!ids.includes(id)||!['food50','food100','food150'].includes(p)))fail();
if(ev.kind==='chest'&&['result','finished'].includes(s.phase)&&ids.some(id=>s.first[id]&&!ev.prizes[id]))fail();
}
for(let i=0;i<s.history.length;i++){const r=s.history[i];if(!r||r.number!==i+1||!Array.isArray(r.logs))fail();for(const t of s.teams)if(typeof r.first?.[t.id]!=='boolean'||!Number.isSafeInteger(r.gold?.[t.id])||r.gold[t.id]<0)fail();for(const l of r.logs)if(!l||!['reward','steal','chest','roar'].includes(l.kind))fail();}
return s;}
const api={leaders,legacyEvents,stormRequired,finalGoal,growth,thresholds,levelNames,create,draw,acknowledge,lock,mark,submit,reveal,settle,next,clone,validate,upgrade,events,chooseEvent,pending,openChest};if(typeof module!=='undefined')module.exports=api;else root.DragonEngine=api;
})(globalThis);
