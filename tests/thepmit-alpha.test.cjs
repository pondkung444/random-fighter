const assert=require('node:assert/strict');
const T=require('../classroom-dungeon/thepmit-dragon-engine.js');
const original=require('../classroom-dungeon/thepmit-camp-day2.json');
function checkpoint(){const s=T.clone(original.game);T.upgrade(s);T.validate(s);assert.deepEqual(s.history,original.game.history);assert.deepEqual(s.teams.map(t=>[t.gold,t.earned]),[[2580,2630],[1580,1680],[1420,1550],[1670,1900]]);T.next(s);return s;}
function round(kind,results,prepare=()=>{}){let s=checkpoint();prepare(s);s.eventDeck=[kind];T.draw(s,()=>.4);T.acknowledge(s);T.lock(s);for(const t of s.teams)T.submit(s,t.id,results.includes(t.id)?'ก':'ข');T.reveal(s,'ก');T.validate(s);T.settle(s);T.validate(s);return s;}
let s=round('hunt',['t3']);assert.equal(s.teams[0].gold,2193);assert.equal(s.teams[3].gold,2157);
s=round('hunt',['t0']);assert.equal(s.teams[0].gold,2780);
s=round('hunt',[]);assert.equal(s.teams[0].gold,2580);
s=round('hunt',['t1','t2','t3']);assert.equal(s.history.at(-1).logs.filter(l=>l.kind==='steal').reduce((n,l)=>n+l.paid,0),387);
s=round('volcano',[]);assert.deepEqual(s.teams.map(t=>t.gold),[2380,1422,1278,1503]);
s=round('wind',['t0','t1','t2','t3']);assert.deepEqual(s.teams.map(t=>t.gold),[2680,1830,1770,1820]);
s=round('gems',['t2']);assert.equal(s.teams[2].gold,1920);
s=round('gems',['t0','t1','t2']);assert.equal(s.history.at(-1).logs.filter(l=>l.kind==='reward').reduce((n,l)=>n+l.bonus,0),400);
s=round('gems',['t0'],s=>s.teams[0].roar=2);assert.equal(s.teams[0].roar,0);assert.equal(s.teams[0].gold,3230);assert.equal(s.history.at(-1).logs.filter(l=>l.kind==='roar').length,1);
for(const kind of Object.keys(T.events))for(let mask=0;mask<16;mask++){
const correct=['t0','t1','t2','t3'].filter((_,i)=>mask&(1<<i));s=round(kind,correct);assert.throws(()=>T.settle(s));T.next(s);T.validate(s);
}
// Ties, empty inventories and mature dragons: all combinations preserve integer balances.
for(const kind of Object.keys(T.events))for(let mask=0;mask<16;mask++){
s=round(kind,['t0','t1','t2','t3'].filter((_,i)=>mask&(1<<i)),s=>{s.teams.forEach(t=>{t.gold=0;t.earned=1800;});});assert(s.teams.every(t=>t.gold>=0));
}
// Whole continuation, no old events, no duplicate deck, no final-count regression.
for(let trial=0;trial<20;trial++){
s=checkpoint();while(s.phase!=='finished'){
T.draw(s);T.acknowledge(s);T.lock(s);for(const t of s.teams)T.submit(s,t.id,Math.random()<.65?'ก':'ข');T.reveal(s,'ก');T.settle(s);T.validate(s);const copy=T.clone(s);T.upgrade(copy);T.validate(copy);assert.deepEqual(copy,s);T.next(s);T.validate(s);
}assert.equal(s.history.length,50);assert(s.history.slice(18).every(r=>T.events[r.event.kind]));
}
console.log('PASS: checkpoint preservation, six events × all 16 answer patterns, ties/zero balances, roar, duplicate settlement, 20 complete sessions and JSON round trips');
