const assert = require('node:assert/strict');
const { Fight, JOBS, seedRandom } = require('../combat.js');
const { rigFor, POSES } = require('../fighter-art.js');
const poses = new Set();
for (const job of Object.keys(POSES)) for (let move = 0; move < 5; move++) {
  for (let frame = 0; frame <= 60; frame++) {
    const pose = rigFor(job, 'special', frame / 60, 1, move);
    assert(Object.values(pose).every(Number.isFinite), 'invalid animation joint');
  }
  poses.add(JSON.stringify(rigFor(job, 'special', .55, 1, move)));
}
assert.equal(poses.size, 20, 'profession moves share the same contact pose');
const history = [];
const signatures = new Set();
const stats = { rounds: 0, reversals: 0, combos: 0, dodges: 0, misses: 0, hits: 0, min: 100, max: 0, endings: {} };
for (const a of Object.keys(JOBS)) for (const b of Object.keys(JOBS)) {
  if (a === b) continue;
  for (let seed = 1; seed <= 100; seed++) {
    const loser = seed % 2;
    const fight = new Fight([a, b], loser, { random: seedRandom(seed * 7949 + stats.rounds), history });
    assert(!history.slice(-4).some(x => x.ending === fight.ending), 'recent ending repeated');
    assert(!history.slice(-8).some(x => x.opening === fight.fingerprint.opening), 'recent opening repeated');
    let previous = [100, 100];
    while (!fight.ko && fight.time < 21) {
      fight.step(1 / 120);
      assert(fight.fighters[0].x < fight.fighters[1].x, 'fighters crossed');
      fight.fighters.forEach((f, i) => { assert(f.hp <= previous[i], 'HP silently restored'); previous[i] = f.hp; });
    }
    assert(fight.ko, 'fight did not finish');
    assert(fight.time <= 20, 'fight exceeded active clock');
    assert.equal(fight.fighters[loser].hp, 0, 'wrong loser');
    assert(fight.fighters[1 - loser].hp > 0, 'winner has no HP');
    assert(fight.events.some(e => e.type === 'hit' && e.final), 'KO without a landed strike');
    stats.rounds++;
    stats.reversals += fight.leadChanges;
    stats.min = Math.min(stats.min, fight.time); stats.max = Math.max(stats.max, fight.time);
    stats.endings[fight.ending] = (stats.endings[fight.ending] || 0) + 1;
    for (const e of fight.events) { if (e.type === 'hit') stats.hits++; if (e.type === 'hit' && e.combo > 1) stats.combos++; if (e.type === 'dodge') stats.dodges++; if (e.type === 'miss') stats.misses++; }
    const signature = fight.events.filter(e => e.type === 'move').map(e => `${e.side}:${e.kind}:${e.move}`).join('|');
    assert(!signatures.has(signature), 'entire fight repeated'); signatures.add(signature);
    history.push(fight.fingerprint); if (history.length > 24) history.shift();
  }
}
assert(stats.reversals > 200, 'too few reversals');
assert(stats.combos > 1200, 'too few chained attacks');
assert(stats.dodges > 200, 'too few evasions');
assert(stats.misses > 100, 'spacing never creates a punishable miss');
console.log(JSON.stringify(stats, null, 2));
