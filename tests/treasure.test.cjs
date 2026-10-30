const assert=require('node:assert/strict'),E=require('../classroom-dungeon/treasure-engine.js'),Q=require('../classroom-dungeon/treasure-questions.js');
const make=()=>E.create(Array.from({length:4},(_,i)=>({name:'team'+i,members:['a','b','c']})));
const resolve=(s,first,orders={})=>{E.draw(s);E.lock(s,orders);first.forEach((v,i)=>E.mark(s,'t'+i,v));E.help(s);s.teams.filter(t=>!s.first[t.id]).forEach(t=>E.recover(s,t.id,true));E.reveal(s);return E.settle(s);};
assert.equal(Q.length,20);assert.deepEqual(Q.map(q=>q.number),Array.from({length:20},(_,i)=>i+1));
let s=make();const seen=new Set();for(let i=0;i<3;i++){resolve(s,[true,false,true,false]);seen.add(s.selected.t0);E.next(s);}assert.equal(seen.size,3);assert.equal(s.teams[0].gold,300);assert.equal(s.teams[1].gold,150);
s=make();s.index=2;s.teams.forEach(t=>t.gold=400);resolve(s,[true,false,true,false],{t0:{kind:'raid',target:'t1'},t2:{kind:'hook'}});assert.deepEqual(s.teams.map(t=>t.gold),[500,220,530,420]);
// Raid and hook compete for 400: claims 200+30 do not exceed reserve.
assert.equal(s.history[0].logs.filter(l=>l.kind==='steal').reduce((n,l)=>n+l.paid,0),260);
s=make();s.index=2;s.teams.forEach(t=>t.gold=2);resolve(s,[true,true,true,false],{t0:{kind:'raid',target:'t3'},t1:{kind:'raid',target:'t3'},t2:{kind:'raid',target:'t3'}});assert.equal(s.teams[3].gold,50);assert.equal(s.teams.reduce((n,t)=>n+t.gold,0),355);assert(s.teams.every(t=>t.gold>=0));
s=make();E.draw(s);assert.throws(()=>E.lock(s,{t0:{kind:'hook'}}));assert.equal(s.phase,'plan');assert.equal(s.teams[0].gold,0);
s=make();s.index=2;s.teams.forEach(t=>t.gold=100);resolve(s,[false,true,true,true],{t0:{kind:'map'}});assert.equal(s.teams[0].gold,120);assert.throws(()=>E.settle(s));
s=make();for(let i=0;i<20;i++){resolve(s,[true,false,true,false]);E.next(s);}assert.equal(s.phase,'finished');assert.equal(s.history.length,20);assert.equal(s.teams[0].gold,2000);assert.equal(s.teams[1].gold,1000);
console.log('treasure: full 20-question session, fairness, phase guards, item failure, conservation passed');


// Restored sessions must be usable in every phase; corrupt imports fail before replacing the current game.
s=make();for(let i=0;i<20;i++){E.validate(E.clone(s));E.draw(s);E.validate(E.clone(s));E.lock(s,{});E.validate(E.clone(s));for(let j=0;j<4;j++)E.mark(s,'t'+j,j%2===0);E.help(s);E.validate(E.clone(s));assert.throws(()=>E.recover(s,'t1','true'));E.recover(s,'t1',true);E.recover(s,'t3',false);E.reveal(s);E.validate(E.clone(s));E.settle(s);E.validate(E.clone(s));E.next(s);}E.validate(E.clone(s));
for(const corrupt of [g=>g.phase='missing',g=>g.teams[0].gold=-1,g=>g.teams[0].queue=['unknown'],g=>g.teams[1].id='t0',g=>g.selected.t0='unknown',g=>g.history[0].logs=[{kind:'steal',from:'t0',to:'unknown',paid:1}]]){const bad=E.clone(s);corrupt(bad);assert.throws(()=>E.validate(bad));}
console.log('restore: every phase across 20 rounds and malformed imports passed');
