const A=require('node:assert/strict'),E=require('../classroom-dungeon/dragon-engine');
const make=(n=5)=>E.create(Array.from({length:n},(_,i)=>({name:'group'+i,members:['student'+i,'second'+i]})));
A.throws(()=>E.create(Array.from({length:5},()=>({name:'empty',members:[]}))));
A.equal(E.stormRequired(make()),4);A.equal(E.finalGoal(make()),7);A.equal(E.stormRequired(make(4)),3);A.equal(E.finalGoal(make(4)),5);
for(let mask=0;mask<32;mask++){
const s=make();s.teams.forEach((t,i)=>{t.gold=[0,20,80,100,200][i];t.earned=400;});
E.draw(s,()=>.4);s.event=E.chooseEvent({...s,index:2,history:[{event:{kind:'rain'}}],teams:s.teams.map(t=>({...t,gold:100}))},()=>0);s.event.kind='raid';s.event.mode='ring';s.event.pairs=s.teams.map((t,i)=>[t.id,'t'+((i+1)%5)]);E.acknowledge(s);E.lock(s);s.teams.forEach((t,i)=>E.mark(s,t.id,!!(mask&(1<<i))));E.reveal(s);const oldTotal=s.teams.reduce((n,t)=>n+t.gold,0);E.settle(s);E.validate(s);
const correct=s.teams.filter(t=>s.first[t.id]).length;A.equal(s.teams.reduce((n,t)=>n+t.gold,0),oldTotal+100*correct);A(s.teams.every(t=>t.gold>=0));A.equal(new Set(s.history[0].logs.filter(l=>l.kind==='steal').map(l=>l.from)).size,s.history[0].logs.filter(l=>l.kind==='steal').length);
}
for(const n of [4,5])for(const correct of [true,false]){
let s=make(n);const selected=s.teams.map(()=>new Set());
for(let i=0;i<27;i++){E.draw(s);s.teams.forEach((t,j)=>{if(i<2)selected[j].add(s.selected[t.id]);});E.acknowledge(s);E.lock(s,s.event.kind==='cave'?Object.fromEntries(s.teams.map(t=>[t.id,'risk'])):{});s.teams.forEach(t=>E.mark(s,t.id,correct));E.reveal(s);E.settle(s);for(const id of E.pending(s))E.openChest(s,id);E.validate(E.clone(s));E.next(s);E.validate(E.clone(s));}
A.equal(s.phase,'finished');A.equal(s.storm,correct?n*2:0);A(selected.every(ids=>ids.size===2));}
let s=make();E.draw(s);s.event.kind='raid';s.event.mode='ring';s.event.pairs=[['t0','t1'],['t1','t0'],['t2','t3'],['t3','t4'],['t4','t2']];A.throws(()=>E.validate(s));
for(const count of [3,4]){s=make();E.draw(s);s.event.kind='storm';E.acknowledge(s);E.lock(s);s.teams.forEach((t,i)=>E.mark(s,t.id,i<count));E.reveal(s);E.settle(s);A.equal(s.event.success,count===4);A.equal(s.teams[4].gold,count===4?50:0);}
console.log('5 groups: 32 raid outcomes, one target per team, conservation, no negatives, storm thresholds, 4-team compatibility, representative rotation and 27-round completion passed');
