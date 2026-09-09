/* Random Fighter: fixed-step combat simulation and shared illustrated fighters. */
(function (root) {
  'use strict';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const other = s => 1 - s;
  const JOBS = {
    takraw: { color: '#31d9ff', dark: '#12618a', label: 'นักตะกร้อ', moves: ['ชงลูกสายฟ้า', 'ฟาดฟ้าผ่าลงสนาม', 'ลูกเสิร์ฟสายฟ้า', 'จักรยานอากาศ', 'ตะกร้อดาวตก'] },
    somtam: { color: '#ff775e', dark: '#a32e42', label: 'แม่ค้าส้มตำ', moves: ['สากสะท้านซอย', 'ตำแหลกสิบครก', 'พริกบินแสบทรวง', 'ครกกระแทกใจ', 'ส้มตำพายุหมุน'] },
    lottery: { color: '#c49bff', dark: '#624095', label: 'ป้าใบ้หวย', moves: ['เลขเด็ดสะกิดดวง', 'หวยชุดถล่มฟ้า', 'ยันต์สะท้อนเคราะห์', 'ฟาดแผงรางวัลที่หนึ่ง', 'เปิดดวงพลิกชะตา'] },
    student: { color: '#ffe279', dark: '#315488', label: 'นักเรียน', moves: ['สมุดฟาดหน้า', 'การบ้านค้างสามวิชา', 'กระดาษสอบติดจรวด', 'กระเป๋าหนักเทอมนี้', 'ไม้บรรทัดพิพากษา'] }
  };
  const ENDINGS = ['rush', 'counter', 'launcher', 'projectile', 'feint', 'clash'];
  function seedRandom(seed) {
    return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function loadHistory() { try { const saved = JSON.parse(localStorage.getItem('rf-combat-v2') || '[]'); return Array.isArray(saved) ? saved.filter(x => x && typeof x.opening === 'string' && ENDINGS.includes(x.ending)).slice(-24) : []; } catch { return []; } }
  function saveHistory(history) { try { localStorage.setItem('rf-combat-v2', JSON.stringify(history.slice(-24))); } catch { /* Private browsing still supports a complete fight. */ } }

  class Fight {
    constructor(jobs, loser, options = {}) {
      this.random = options.random || Math.random;
      this.jobs = jobs;
      this.loser = loser;
      this.winner = other(loser);
      this.time = 0;
      this.ko = false;
      this.events = [];
      this.onEvent = options.onEvent || (() => {});
      this.history = options.history || [];
      const recent = this.history.slice(-4).map(x => x.ending);
      this.ending = this.pick(ENDINGS.filter(x => !recent.includes(x)));
      this.finishAt = this.range(17.1, 18.3);
      this.finishStarted = false;
      this.finishStep = 0;
      this.leadChanges = 0;
      this.lastLead = 0;
      this.fighters = jobs.map((job, side) => ({ side, job, x: side ? 765 : 235, hp: 100,
        action: null, stun: 0, ready: this.range(.12, .6), combo: 0, lastMove: -1,
        aggression: this.range(.38, .87), range: this.range(120, 175), drift: this.range(-1, 1),
        state: 'idle', pose: 0, hitAt: -10, knock: 0, vx: 0, guard: 0, attacks: 0, counterUntil: 0 }));
      // Refuse recently seen opening pairs, independent of the selected loser.
      const recentOpen = new Set(this.history.slice(-8).map(x => x.opening));
      do { this.opening = [this.int(0, 1), this.int(0, 4), this.int(0, 4)]; }
      while (recentOpen.has(this.opening.join(':')));
      this.fighters[this.opening[0]].ready = .06;
      this.fighters[other(this.opening[0])].ready = this.range(.3, .7);
      this.fingerprint = { ending: this.ending, opening: this.opening.join(':') };
    }
    range(a, b) { return a + this.random() * (b - a); }
    int(a, b) { return Math.floor(this.range(a, b + 1)); }
    pick(a) { return a[Math.floor(this.random() * a.length)]; }
    emit(type, data = {}) { const e = { type, time: this.time, ...data }; this.events.push(e); this.onEvent(e); }
    start(f, kind, move, final = false) {
      const durations = { jab: .38, heavy: .8, special: 1.04, projectile: .86, counter: .57, feint: .38 };
      f.action = { kind, move, elapsed: 0, duration: durations[kind], resolved: false, final };
      f.lastMove = move;
      f.state = kind;
      f.attacks++;
      if (kind !== 'feint') this.emit('move', { side: f.side, kind, move, final, name: JOBS[f.job].moves[move] });
      if (kind === 'special' && !this.finishStarted && !this.specialShown && this.time > 5 && this.random() < .55) {
        this.specialShown = true;
        this.emit('cinematic', { side: f.side, name: JOBS[f.job].moves[move], special: true });
      }
    }
    decide(f, enemy) {
      if (f.action || f.stun > 0 || f.ready > 0) return;
      const distance = Math.abs(f.x - enemy.x);
      const threat = enemy.action && enemy.action.elapsed < enemy.action.duration * .55;
      if (threat && this.random() < .38) {
        f.state = this.pick(['block', 'duck', 'jump', 'backstep']);
        f.guard = this.range(.26, .5);
        f.ready = f.guard + this.range(.02, .18);
        if (f.state === 'backstep') f.vx = (f.side ? 1 : -1) * 650;
        return;
      }
      if (distance > 210 && this.random() > .3) { f.ready = .1; return; }
      let kind = this.pick(f.combo > 0 ? ['jab', 'jab', 'heavy', 'feint'] : ['jab', 'heavy', 'projectile', 'feint', 'special']);
      if (this.time < 1.2) kind = 'jab';
      if (distance > 210) kind = 'projectile';
      if (f.counterUntil > this.time && distance < 185) kind = 'counter';
      if (kind === 'special' && this.time < 3) kind = 'heavy';
      let move = kind === 'special' ? 4 : kind === 'projectile' ? 2 : kind === 'heavy' ? 3 : this.int(0, 1);
      if (f.attacks === 0) move = this.opening[f.side === this.opening[0] ? 1 : 2];
      if (move === f.lastMove) move = move < 2 ? 1 - move : this.int(0, 1);
      if (kind !== 'counter' && kind !== 'feint') kind = ['jab', 'jab', 'projectile', 'heavy', 'special'][move];
      this.start(f, kind, move);
    }
    hit(f, enemy, action) {
      const distance = Math.abs(f.x - enemy.x);
      if (action.kind === 'feint') {
        this.emit('feint', { side: f.side });
        enemy.ready = Math.max(enemy.ready, .12);
        f.combo = 1;
        return;
      }
      const reach = action.kind === 'projectile' ? 700 : action.kind === 'jab' ? 150 : 185;
      if (distance > reach) { this.emit('miss', { side: f.side }); enemy.counterUntil = this.time + .65; enemy.ready = Math.min(enemy.ready, .07); return; }
      const defended = !action.final && enemy.guard > 0;
      if (defended && enemy.state !== 'block') {
        this.emit('dodge', { side: enemy.side });
        enemy.ready = .02;
        enemy.combo = 2;
        enemy.counterUntil = this.time + .8;
        return;
      }
      let damage = action.kind === 'jab' ? this.int(4, 7) : action.kind === 'special' ? this.int(12, 18) : this.int(7, 12);
      if (defended) damage = 2;
      // The draw owns the outcome. Low-health defense is visible, never a hidden HP reset.
      if (!action.final && damage >= enemy.hp) {
        enemy.state = 'block'; enemy.guard = .28;
        this.emit('block', { side: enemy.side, clutch: true });
        return;
      }
      if (action.final) damage = enemy.hp;
      enemy.hp -= damage;
      enemy.hitAt = this.time;
      if (!defended) {
        enemy.action = null;
        enemy.stun = action.kind === 'special' || action.kind === 'heavy' ? .43 : .16;
        enemy.knock = action.kind === 'special' ? .6 : 0;
        enemy.state = enemy.knock ? 'knockdown' : 'hit';
        enemy.vx = (enemy.side ? 1 : -1) * (action.kind === 'jab' ? 80 : 170);
      }
      f.combo = Math.min(4, f.combo + 1);
      this.emit(defended ? 'block' : 'hit', { side: f.side, target: enemy.side, damage, kind: action.kind, combo: f.combo, final: action.final });
      const lead = Math.sign(this.fighters[0].hp - this.fighters[1].hp);
      if (lead && this.lastLead && lead !== this.lastLead) { this.leadChanges++; this.emit('reversal', { side: lead > 0 ? 0 : 1 }); }
      if (lead) this.lastLead = lead;
      if (enemy.hp === 0) { this.ko = true; this.emit('ko', { side: f.side, target: enemy.side }); }
    }
    closing(dt) {
      const w = this.fighters[this.winner], l = this.fighters[this.loser];
      if (!this.finishStarted) {
        this.finishStarted = true;
        this.closingAt = this.time;
        this.fighters.forEach(f => { f.action = null; f.guard = 0; f.stun = 0; f.knock = 0; f.vx = 0; });
        const kind = { projectile: 'projectile', rush: 'heavy', counter: 'counter', feint: 'heavy', launcher: 'special', clash: 'special' }[this.ending];
        this.finishingKind = kind;
        // A cut-in can belong to the fighter whose ultimate gets interrupted.
        // Its appearance therefore does not disclose the locked winner.
        this.cutSide = ['counter', 'feint'].includes(this.ending) ? this.loser : this.ending === 'clash' ? this.int(0, 1) : this.winner;
        this.emit('cinematic', { side: this.cutSide, name: JOBS[this.fighters[this.cutSide].job].moves[4], ending: this.ending });
      }
      const age = this.time - this.closingAt;
      const gap = this.ending === 'projectile' ? 235 : 140;
      const midpoint = clamp((w.x + l.x) / 2, 230, 770);
      this.fighters.forEach(f => { f.x += (midpoint + (f.side ? gap / 2 : -gap / 2) - f.x) * Math.min(1, dt * 12); });
      if (this.finishStep === 0 && age > .15) {
        this.finishStep = 1;
        if (['counter', 'feint'].includes(this.ending)) { this.start(l, 'special', 4); w.state = this.ending === 'counter' ? 'block' : 'backstep'; w.guard = .68; }
        else if (this.ending === 'clash') { this.start(l, 'heavy', 3); this.start(w, 'heavy', 3); w.guard = .6; l.guard = .6; }
        else if (this.ending === 'rush') { this.start(w, 'jab', 0); }
        else if (this.ending === 'launcher') { this.start(w, 'heavy', 3); }
        else { this.start(w, 'feint', 0); }
      }
      if (this.finishStep === 1 && age > .72) {
        this.finishStep = 2;
        l.action = null; l.stun = 0; l.guard = 0; w.stun = 0; w.guard = 0;
        if (this.cutSide === this.loser) this.emit('interruption', { side: this.winner });
        this.start(w, this.finishingKind, 4, true);
      }
    }
    step(dt) {
      if (this.ko) return;
      this.time += dt;
      if (this.time >= this.finishAt) this.closing(dt);
      for (const f of this.fighters) {
        const enemy = this.fighters[other(f.side)];
        f.ready -= dt; f.stun = Math.max(0, f.stun - dt); f.guard = Math.max(0, f.guard - dt); f.knock = Math.max(0, f.knock - dt);
        f.x += f.vx * dt; f.vx *= Math.exp(-dt * 12);
        if (f.action) {
          const a = f.action;
          a.elapsed += dt;
          f.pose = a.elapsed / a.duration;
          if (a.kind !== 'projectile' && f.pose < .3 && !this.finishStarted && Math.abs(f.x - enemy.x) > 130) f.x += (f.side ? -1 : 1) * dt * 330;
          if (!a.resolved && f.pose >= .55) { a.resolved = true; this.hit(f, enemy, a); }
          if (f.pose >= 1) {
            f.action = null;
            f.ready = this.random() < f.aggression && f.combo < 4 ? this.range(.03, .12) : this.range(.2, .68);
            if (f.ready > .2) f.combo = 0;
          }
        } else if (!this.finishStarted && f.stun === 0 && f.guard === 0) {
          const distance = Math.abs(f.x - enemy.x);
          const advance = distance > f.range ? 1 : distance < 110 ? -.7 : Math.sin(this.time * 3 + f.drift * 8) * .35;
          f.x += (f.side ? -1 : 1) * advance * dt * (170 + f.aggression * 90);
          f.state = Math.abs(advance) > .5 ? 'walk' : 'idle';
          this.decide(f, enemy);
        }
        f.x = clamp(f.x, 90, 910);
      }
      const [a, b] = this.fighters;
      if (b.x - a.x < 100) { const m = (a.x + b.x) / 2; a.x = m - 50; b.x = m + 50; }
    }
  }

  function drawFighter(...args) { root.RandomFighterArt.drawFighter(...args); }

  function portrait(canvas, job) {
    canvas.width = 280; canvas.height = 240;
    const c = canvas.getContext('2d'); c.clearRect(0, 0, 280, 240);
    const g = c.createRadialGradient(140, 120, 10, 140, 120, 140); g.addColorStop(0, JOBS[job].color + '40'); g.addColorStop(1, '#11172900'); c.fillStyle = g; c.fillRect(0, 0, 280, 240);
    drawFighter(c, job, 136, 227, .97);
  }

  class Battle {
    constructor(elements, jobs, loser) {
      this.el = elements; this.jobs = jobs; this.canvas = elements.battleCanvas; this.ctx = this.canvas.getContext('2d');
      this.history = loadHistory();
      this.fx = []; this.text = ''; this.textUntil = 0; this.shake = 0; this.freeze = 0; this.cut = null; this.koAge = 0;
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.fight = new Fight(jobs, loser, { history: this.history, onEvent: e => this.event(e) });
    }
    event(e) {
      const f = this.fight.fighters[e.side ?? 0];
      if (e.type === 'move') { this.text = e.name; this.textUntil = this.fight.time + .9; this.textColor = JOBS[f.job].color; }
      if (e.type === 'cinematic') { this.cut = { ...e, age: 0, duration: e.special ? 1.8 : 2.35 }; this.freeze = this.cut.duration; }
      if (['hit', 'block'].includes(e.type)) {
        const target = this.fight.fighters[e.target ?? e.side];
        for (let i = 0; i < (e.type === 'hit' ? 15 : 6); i++) this.fx.push({ x: target.x, y: 305, vx: (Math.random() - .5) * 620, vy: (Math.random() - .8) * 450, life: .5, color: e.type === 'block' ? '#b8ecff' : JOBS[f.job].color });
        if (!this.reduced) this.shake = e.kind === 'jab' ? 3 : 8;
        this.freeze = e.final ? .16 : e.kind === 'special' ? .065 : .025;
        if (e.combo > 1) { this.badge = `${e.combo} HIT COMBO`; this.badgeUntil = this.fight.time + .6; }
      }
      if (['dodge', 'feint', 'reversal', 'block', 'miss', 'interruption'].includes(e.type)) {
        this.badge = { dodge: 'หลบได้!', feint: 'หลอกจังหวะ!', reversal: 'พลิกกลับมานำ!', block: e.clutch ? 'การ์ดสุดชีวิต!' : 'BLOCK', miss: 'วืด! เปิดช่องสวน', interruption: 'สวนทะลุท่าไม้ตาย!' }[e.type];
        this.badgeUntil = this.fight.time + .65;
      }
      if (e.type === 'ko') { this.el.arenaLabel.textContent = 'KO!'; this.el.arenaLabel.classList.remove('hidden'); saveHistory([...this.history, this.fight.fingerprint]); }
    }
    draw(dt = 0) {
      const c = this.ctx, rect = this.canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr)), h = Math.max(1, Math.round(rect.height * dpr));
      if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
      c.setTransform(w / 1000, 0, 0, h / 540, 0, 0);
      const sky = c.createLinearGradient(0, 0, 0, 540); sky.addColorStop(0, '#101931'); sky.addColorStop(.65, '#574150'); sky.addColorStop(1, '#171e2c'); c.fillStyle = sky; c.fillRect(0, 0, 1000, 540);
      c.save();
      if (!this.reduced && this.shake > .1) { c.translate(Math.sin(performance.now() * .16) * this.shake, Math.cos(performance.now() * .12) * this.shake * .4); this.shake *= Math.exp(-dt * 15); }
      // A Thai night-market court: fluorescent stalls, bunting and a painted ring.
      c.fillStyle = '#f8d798'; c.beginPath(); c.arc(785, 85, 35, 0, Math.PI * 2); c.fill();
      for (let n = 0; n < 8; n++) {
        const x = n * 145 - 20; c.fillStyle = n % 2 ? '#302b43' : '#222c43'; c.fillRect(x, 170 + n % 3 * 15, 132, 205);
        c.fillStyle = n % 2 ? '#b66065' : '#468494'; c.beginPath(); c.moveTo(x - 8, 215); c.lineTo(x + 67, 181); c.lineTo(x + 143, 215); c.fill();
        c.fillStyle = '#efc589'; c.fillRect(x + 20, 239, 85, 8);
      }
      c.strokeStyle = '#f5d8ae88'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 88); c.quadraticCurveTo(500, 190, 1000, 88); c.stroke();
      for (let n = 0; n < 16; n++) { const x = n * 66, y = 88 + Math.sin(n / 15 * Math.PI) * 50; c.fillStyle = ['#f5ce7e', '#ed8497', '#7ecdd2'][n % 3]; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 23, y + 5); c.lineTo(x + 8, y + 26); c.fill(); }
      c.fillStyle = '#252b37'; c.fillRect(0, 400, 1000, 140); c.strokeStyle = '#ebd6a433'; c.lineWidth = 3; c.strokeRect(65, 414, 870, 99); c.beginPath(); c.ellipse(500, 457, 185, 40, 0, 0, Math.PI * 2); c.stroke();
      c.fillStyle = '#f1d9a9'; c.font = 'bold 17px Kanit, sans-serif'; c.textAlign = 'center'; c.fillText('สังเวียนหลังเลิกเรียน', 500, 242);
      for (const f of this.fight.fighters) {
        let state = f.action?.kind || (f.knock > .2 ? 'knockdown' : f.stun > 0 ? 'hit' : f.guard > 0 ? f.state : f.state);
        if (this.fight.ko) state = f.side === this.fight.loser ? 'lose' : 'victory';
        const finishLift = this.fight.ko && f.side === this.fight.loser && this.fight.ending === 'launcher' ? Math.sin(clamp(this.koAge / .8, 0, 1) * Math.PI) * 80 : 0;
        drawFighter(c, f.job, f.x, 456 - finishLift, 1.13, f.side, state, this.fight.ko ? this.koAge : f.pose, this.fight.ko ? this.fight.time + this.koAge : this.fight.time, f.action?.move ?? 0);
        if (!this.reduced && f.action && ['heavy', 'special', 'counter'].includes(f.action.kind) && f.pose > .2 && f.pose < .7) {
          c.save(); c.strokeStyle = JOBS[f.job].color + '88'; c.lineWidth = f.action.kind === 'special' ? 12 : 5;
          c.beginPath(); const angle = f.side ? Math.PI : 0; c.arc(f.x, 328, 92, angle - .85, angle + .75); c.stroke(); c.restore();
        }
        if (f.action?.kind === 'projectile' && f.pose > .12 && f.pose < .58) {
          const enemy = this.fight.fighters[other(f.side)], p = clamp((f.pose - .12) / .43, 0, 1), px = f.x + (enemy.x - f.x) * p;
          root.RandomFighterArt.drawProjectile(c, f.job, px, 313 - Math.sin(p * Math.PI) * 40, f.side ? -1 : 1, p * 6);
        }
      }
      this.fx = this.fx.filter(p => p.life > 0);
      for (const p of this.fx) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += dt * 600; c.globalAlpha = clamp(p.life * 2, 0, 1); c.fillStyle = p.color; c.fillRect(p.x, p.y, 6, 6); } c.globalAlpha = 1;
      c.restore();
      if (this.badgeUntil > this.fight.time && !this.fight.ko) { c.fillStyle = '#ffe098'; c.font = '900 26px Kanit, sans-serif'; c.textAlign = 'center'; c.fillText(this.badge, 500, 74); }
      if (this.cut) {
        this.cut.age += dt;
        if (this.cut.age > this.cut.duration) this.cut = null;
        else {
          const j = this.jobs[this.cut.side]; c.fillStyle = '#070b17ef'; c.fillRect(0, 0, 1000, 540);
          c.fillStyle = JOBS[j].dark; c.beginPath(); c.moveTo(0, 115); c.lineTo(1000, 30); c.lineTo(1000, 415); c.lineTo(0, 510); c.fill();
          if (!this.reduced) { c.strokeStyle = JOBS[j].color + '55'; c.lineWidth = 2; for (let i = 0; i < 18; i++) { c.beginPath(); c.moveTo(0, 80 + i * 24); c.lineTo(1000, i * 24 - 35); c.stroke(); } }
          const entrance = this.reduced ? 1 : Math.min(1, this.cut.age / .3);
          drawFighter(c, j, (this.cut.side ? 765 : 235) + (this.cut.side ? 1 : -1) * (1 - entrance) * 150, 560, 2.1, this.cut.side, 'special', .2, this.cut.age, 4);
          c.textAlign = this.cut.side ? 'left' : 'right'; const tx = this.cut.side ? 55 : 945;
          c.fillStyle = '#ffe1a0'; c.font = 'bold 20px sans-serif'; c.fillText(this.cut.special ? 'SIGNATURE ART' : 'LIMIT BREAK', tx, 178);
          c.fillStyle = '#fff'; c.font = '900 42px Kanit, sans-serif'; c.fillText(this.cut.name, tx, 246, 570);
          c.fillStyle = JOBS[j].color; c.font = '24px Kanit, sans-serif'; c.fillText(JOBS[j].label, tx, 292);
        }
      }
      this.el.hpA.style.width = this.fight.fighters[0].hp + '%'; this.el.hpB.style.width = this.fight.fighters[1].hp + '%';
      this.el.battleTimer.textContent = String(Math.max(0, Math.ceil(20 - this.fight.time))).padStart(2, '0');
      this.el.battleNote.textContent = this.fight.ko ? 'จบด้วยน็อกเอาต์!' : this.textUntil > this.fight.time ? this.text : 'ขยับหาช่อง • แย่งจังหวะ';
      this.el.battleNote.style.color = this.textColor || '#fff';
    }
    run() {
      return new Promise(resolve => {
        let last = performance.now(), accumulator = 0;
        const tick = now => {
          const dt = Math.min((now - last) / 1000, .05); last = now;
          if (document.hidden) { this.raf = requestAnimationFrame(tick); return; }
          if (this.freeze > 0) this.freeze -= dt;
          else if (!this.fight.ko) { accumulator += dt; while (accumulator >= 1 / 120 && !this.fight.ko && this.freeze <= 0) { this.fight.step(1 / 120); accumulator -= 1 / 120; } }
          this.draw(dt);
          if (this.fight.ko) this.koAge += dt;
          if (this.koAge > 1.5) { resolve(this.fight.fighters.map(f => f.hp)); return; }
          this.raf = requestAnimationFrame(tick);
        };
        this.raf = requestAnimationFrame(tick);
      });
    }
  }
  root.RandomFighterCombat = { Fight, Battle, JOBS, ENDINGS, drawFighter, portrait, seedRandom };
  if (typeof module !== 'undefined') module.exports = root.RandomFighterCombat;
})(typeof window !== 'undefined' ? window : globalThis);
