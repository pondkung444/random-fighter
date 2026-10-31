const assert=require('node:assert/strict'),E=require('../classroom-dungeon/dragon-engine');
const groups=Array.from({length:4},(_,i)=>({name:'team'+i,members:['a','b','c']}));
const make=()=>E.create(groups);
function prepare(s,kind,choices={}){E.draw(s,()=>.4);if(kind){s.event.kind=kind;s.event.pairs=kind==='raid'?[['t0','t1'],['t2','t3']]:[];s.event.eligible=kind==='challenger'?['t0','t1']:[];s.event.prizes=kind==='chest'?{t0:'food50',t1:'food100',t2:'star1',t3:'food50'}:{};}assert.throws(()=>E.lock(s,choices));E.acknowledge(s);if(kind==='cave')assert.throws(()=>E.lock(s,{}));E.lock(s,choices);}
function answer(s,answers){assert.throws(()=>E.reveal(s));answers.forEach((v,i)=>E.mark(s,'t'+i,v));E.reveal(s);E.settle(s);E.validate(E.clone(s));}
let s=make();prepare(s,'rain');answer(s,[true,false,true,false]);assert.deepEqual(s.teams.map(t=>t.gold),[200,0,200,0]);assert.deepEqual(s.teams.map(t=>t.stars),[2,0,2,0]);assert.throws(()=>E.settle(s));
s=make();s.teams.forEach(t=>t.gold=40);prepare(s,'raid');answer(s,[true,false,true,true]);assert.deepEqual(s.teams.map(t=>t.gold),[180,0,140,140]);assert.equal(s.history[0].logs.find(l=>l.kind==='steal').paid,40);
for(const count of [2,3,4]){s=make();prepare(s,'storm');answer(s,[0,1,2,3].map(i=>i<count));assert.equal(s.event.success,count>=3);assert.equal(s.teams[3].gold,(count===4?100:0)+(count>=3?50:0));}
s=make();s.teams.forEach(t=>t.gold=20);prepare(s,'cave',{t0:'risk',t1:'risk',t2:'safe',t3:'safe'});answer(s,[true,false,true,false]);assert.deepEqual(s.teams.map(t=>t.stars),[4,0,2,0]);assert.deepEqual(s.teams.map(t=>t.gold),[120,0,120,20]);
s=make();prepare(s,'challenger');answer(s,[true,false,true,true]);assert.deepEqual(s.teams.map(t=>t.stars),[4,0,2,2]);
s=make();prepare(s,'chest');const before=E.clone(s);answer(s,[true,true,true,false]);assert.throws(()=>E.next(s));for(const id of E.pending(s)){E.openChest(s,id);E.validate(E.clone(s));assert.throws(()=>E.openChest(s,id));}assert.deepEqual(s.teams.map(t=>t.gold),[150,200,100,0]);assert.deepEqual(s.teams.map(t=>t.stars),[2,2,3,0]);
const replay=E.clone(before);answer(replay,[true,true,true,false]);assert.deepEqual(replay.event.prizes,s.event.prizes);
for(const correct of [true,false]){s=make();for(let i=0;i<27;i++){E.draw(s);const kind=s.event.kind;assert(i!==0||kind==='rain');assert(i!==1||kind==='chest');if(i>1)assert.notEqual(kind,s.history.at(-1).event.kind);if(i<7)assert.notEqual(kind,'challenger');if(kind==='raid')assert(s.teams.every(t=>t.gold>0));E.acknowledge(s);E.lock(s,kind==='cave'?{t0:'safe',t1:'risk',t2:'safe',t3:'risk'}:{});answer(s,[correct,correct,correct,correct]);for(const id of E.pending(s))E.openChest(s,id);E.next(s);E.validate(E.clone(s));}assert.equal(s.phase,'finished');assert.equal(s.storm,correct?16:0);}
s=make();s.version=2;E.upgrade(s);E.validate(s);
s=make();prepare(s,'rain');s.version=2;delete s.event;E.upgrade(s);answer(s,[true,false,true,false]);E.next(s);E.validate(s);
console.log('6 events: rewards, raid conservation/caps, storm threshold, cave choices, tied challengers, chest once-only and deterministic replay, migration, 27-round win/loss paths passed');
