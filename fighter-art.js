/* Articulated, profession-specific key poses. Coordinates use a 220px figure. */
(function (root) {
  'use strict';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const COLORS = { takraw: ['#21c8e8', '#173e69'], somtam: ['#f37862', '#9e3443'], lottery: ['#ae81df', '#674384'], student: ['#fff6e6', '#284c76'] };
  const REST = { lean: 0, lift: 0, turn: 1, crouch: 0, fx: 39, fy: -115, ex: 32, ey: -128,
    bx: -37, by: -108, bex: -36, bey: -130, footX: 31, footY: 0, kneeX: 21, kneeY: -34,
    rearX: -31, rearY: 0, rearKneeX: -24, rearKneeY: -35, prop: -.25, head: 0 };
  // Each tuple is wind-up, contact and follow-through. Animation is not a shared punch.
  const POSES = {
    takraw: [
      [{ lean: -.16, kneeX: 35, kneeY: -70, footX: 14, footY: -35 }, { lean: -.25, kneeX: 66, kneeY: -75, footX: 110, footY: -103, fx: -18, fy: -135 }, { lean: -.12, kneeX: 45, kneeY: -53, footX: 63, footY: -36 }],
      [{ lean: -.3, turn: .8, footX: -52, footY: -15, bx: -55 }, { lean: -.48, turn: 1, lift: 16, kneeX: 64, kneeY: -100, footX: 113, footY: -127, bx: -64, by: -158, fx: -29, fy: -117 }, { lean: .2, footX: 76, footY: -34, fx: 52, fy: -122 }],
      [{ lean: -.18, footX: -62, footY: -25, fx: 38, fy: -158 }, { lean: -.19, kneeX: 53, kneeY: -57, footX: 112, footY: -79, fx: -30, fy: -143 }, { footX: 59, footY: -27, lean: .13 }],
      [{ crouch: 21, kneeX: 43, kneeY: -32, fx: 45, fy: -132 }, { lift: 80, lean: -1.05, footX: 122, footY: 22, kneeX: 60, kneeY: -30, rearX: -35, rearY: 35, rearKneeX: -45, rearKneeY: -20, fx: -43, fy: -109, bx: -63, by: -149 }, { lift: 28, lean: -.5, footX: 65, footY: -71, rearX: -43, rearY: -12 }],
      [{ crouch: 24, lean: -.2, fx: 33, fy: -151, bx: -41, by: -152 }, { lift: 102, lean: -1.35, footX: 124, footY: 46, kneeX: 68, kneeY: -20, rearX: -35, rearY: 35, rearKneeX: -45, rearKneeY: -20, fx: -55, fy: -132, bx: -68, by: -177 }, { lift: 22, lean: -.32, footX: 83, footY: -68, rearX: -45, rearY: -9 }]
    ],
    somtam: [
      [{ fx: 13, fy: -191, ex: 38, ey: -166, prop: -.9, lean: -.13 }, { fx: 78, fy: -99, ex: 52, ey: -115, prop: .7, lean: .13, bx: -27, by: -100 }, { fx: 68, fy: -80, prop: 1.1, lean: .17 }],
      [{ fx: -8, fy: -190, ex: 30, ey: -168, prop: -.6, bx: 14, by: -106 }, { fx: 76, fy: -107, ex: 38, ey: -116, prop: .35, bx: 43, by: -109, lean: .2 }, { fx: 40, fy: -113, prop: .2, bx: 24, by: -96 }],
      [{ bx: 5, by: -121, fx: -7, fy: -114, lean: -.16, prop: -.8 }, { fx: 97, fy: -144, ex: 55, ey: -146, bx: 19, by: -119, lean: .16, prop: 1.2 }, { fx: 73, fy: -138, lean: .1 }],
      [{ bx: 2, by: -166, bex: -30, bey: -155, fx: 14, fy: -178, prop: -.8, lean: -.23 }, { bx: 71, by: -110, bex: 25, bey: -110, fx: 73, fy: -106, ex: 44, ey: -118, lean: .23, prop: .8 }, { bx: 48, by: -73, fx: 52, fy: -74, lean: .25, crouch: 9 }],
      [{ fx: -30, fy: -195, ex: 6, ey: -178, bx: -51, by: -116, lean: -.3, prop: -1.3 }, { fx: 102, fy: -143, ex: 58, ey: -133, bx: 41, by: -103, lean: .2, prop: 1.45, lift: 13 }, { fx: 70, fy: -76, bx: 18, by: -100, lean: .28, prop: 2.1 }]
    ],
    lottery: [
      [{ fx: 8, fy: -165, ex: 23, ey: -142, prop: -.65, lean: -.08 }, { fx: 101, fy: -144, ex: 58, ey: -143, prop: 1.15, lean: .1 }, { fx: 65, fy: -140, prop: 1.7 }],
      [{ fx: 7, fy: -172, bx: -39, by: -115, prop: -1.1 }, { fx: 95, fy: -156, ex: 54, ey: -140, prop: .8, lean: .12 }, { fx: 77, fy: -105, prop: 1.6 }],
      [{ fx: 12, fy: -167, ex: 35, ey: -134, lean: -.12, prop: 0 }, { fx: 91, fy: -139, ex: 55, ey: -139, bx: -51, by: -126, prop: -.1 }, { fx: 76, fy: -137, prop: .4 }],
      [{ fx: -3, fy: -190, bx: -19, by: -171, ex: 27, ey: -171, lean: -.23, prop: -.9 }, { fx: 78, fy: -112, ex: 37, ey: -121, bx: 58, by: -117, lean: .25, prop: .65 }, { fx: 66, fy: -84, bx: 49, by: -88, lean: .27, prop: 1.1 }],
      [{ fx: -35, fy: -205, bx: -58, by: -185, ex: -8, ey: -178, lean: -.1, prop: -.5 }, { fx: 94, fy: -168, ex: 57, ey: -145, bx: -66, by: -176, lift: 28, prop: 1.1 }, { fx: 84, fy: -135, bx: -51, by: -131, lift: 8, prop: .6 }]
    ],
    student: [
      [{ fx: 5, fy: -189, ex: 32, ey: -162, lean: -.15, prop: -.75 }, { fx: 92, fy: -126, ex: 55, ey: -128, prop: 1.3, lean: .16 }, { fx: 67, fy: -93, prop: 1.75, lean: .18 }],
      [{ fx: 0, fy: -175, ex: 22, ey: -153, prop: -.8, bx: -29, by: -99 }, { fx: 96, fy: -133, ex: 51, ey: -135, prop: .9, lean: .19 }, { fx: 73, fy: -105, prop: 1.4 }],
      [{ fx: -12, fy: -174, ex: -25, ey: -148, prop: -.3, lean: -.18 }, { fx: 102, fy: -155, ex: 55, ey: -149, prop: .2, lean: .17, rearX: -48 }, { fx: 83, fy: -137, prop: .5, lean: .1 }],
      [{ fx: -30, fy: -128, ex: 2, ey: -137, prop: -1.7, lean: -.3 }, { fx: 91, fy: -137, ex: 50, ey: -120, prop: .5, lean: .22, rearX: -47 }, { fx: 61, fy: -92, prop: 1.4, lean: .28 }],
      [{ fx: -17, fy: -214, ex: 28, ey: -184, bx: -42, by: -133, prop: -1.2, crouch: 10 }, { fx: 97, fy: -142, ex: 48, ey: -148, prop: .9, lean: .22, lift: 27, rearX: -46 }, { fx: 81, fy: -83, prop: 1.7, lean: .28 }]
    ]
  };
  function rigFor(job, state, p, time, move) {
    const rig = { ...REST };
    const attacking = ['jab', 'heavy', 'special', 'projectile', 'counter', 'feint'].includes(state);
    if (attacking) {
      const sequence = POSES[job][move];
      const frames = [REST, { ...REST, ...sequence[0] }, { ...REST, ...sequence[1] }, { ...REST, ...sequence[2] }, REST];
      const stamps = [0, .24, .55, .73, 1];
      let segment = 0; while (segment < 3 && p > stamps[segment + 1]) segment++;
      const t = smooth((p - stamps[segment]) / (stamps[segment + 1] - stamps[segment]));
      for (const key of Object.keys(REST)) rig[key] = mix(frames[segment][key], frames[segment + 1][key], t);
      if (state === 'feint') { for (const key of Object.keys(REST)) rig[key] = mix(REST[key], rig[key], .42); }
    } else if (state === 'walk') {
      const step = Math.sin(time * 14); rig.footX += step * 22; rig.rearX -= step * 22;
      rig.footY = -Math.max(0, step) * 12; rig.rearY = Math.min(0, step) * 12;
      rig.kneeX += step * 10; rig.rearKneeX -= step * 10; rig.fx -= step * 8; rig.bx += step * 8;
    } else if (state === 'block') Object.assign(rig, { fx: 27, fy: -169, ex: 43, ey: -142, bx: 13, by: -146, bex: -8, bey: -124, lean: -.13, crouch: 7 });
    else if (state === 'duck') Object.assign(rig, { crouch: 42, lean: -.27, footX: 47, rearX: -42, kneeX: 49, rearKneeX: -43, fx: 22, fy: -157 });
    else if (state === 'jump') Object.assign(rig, { lift: 54, footX: 12, footY: -34, kneeX: 38, kneeY: -57, rearY: -29, rearKneeX: -44, fx: 25, fy: -159 });
    else if (state === 'backstep') Object.assign(rig, { lean: -.3, footX: 14, footY: -9, rearX: -47, fx: 18, fy: -154 });
    else if (state === 'hit') Object.assign(rig, { lean: -.26, fx: 13, fy: -91, bx: -54, by: -122, head: -.23 });
    else if (state === 'knockdown' || state === 'lose') Object.assign(rig, { lean: -1.32 * (state === 'lose' ? smooth(p * 3) : .9), fx: 4, fy: -89, bx: -52, by: -93, footX: 51, footY: -8 });
    else if (state === 'victory') {
      Object.assign(rig, job === 'lottery' ? { fx: 33, fy: -201, bx: -40, by: -131, prop: -.6 } : job === 'somtam' ? { fx: 42, fy: -192, bx: -35, by: -101, prop: -.4 } : { fx: 39, fy: -215, ex: 43, ey: -173, bx: -43, by: -201, bex: -47, bey: -169 });
      rig.lift = Math.abs(Math.sin(time * 5)) * 5;
    }
    return rig;
  }
  function drawFighter(c, job, x, y, scale, side = 0, state = 'idle', pose = 0, time = 0, move = 0) {
    const r = rigFor(job, state, clamp(pose), time, move), dir = side ? -1 : 1;
    const [color, dark] = COLORS[job];
    const attack = ['jab', 'heavy', 'special', 'counter', 'projectile'].includes(state);
    const hurt = ['hit', 'knockdown', 'lose'].includes(state);
    const skin = '#f0bd95', ink = '#151c2b';
    const path = (points, fill, width = 3) => { c.beginPath(); points.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = ink; c.lineWidth = width; c.stroke(); };
    const line = (points, fill, width = 4, outline = true) => { c.beginPath(); points.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); if (outline) { c.strokeStyle = ink; c.lineWidth = width + 5; c.stroke(); } c.strokeStyle = fill; c.lineWidth = width; c.stroke(); };
    const ellipse = (x, y, rx, ry, fill, stroke = true) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = ink; c.lineWidth = 2.5; c.stroke(); } };
    const box = (x, y, w, h, fill) => path([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill, 2);
    const card = (x, y, angle = 0) => { c.save(); c.translate(x, y); c.rotate(angle); box(-10, -21, 22, 33, '#fff1cb'); line([[-6, -13], [7, -13]], '#b6597e', 3, false); line([[-6, -6], [6, -6]], '#548b99', 2, false); c.restore(); };
    const board = (x, y) => { box(x - 28, y - 12, 62, 52, '#b8864b'); for (let i = 0; i < 6; i++) { box(x - 23 + i % 3 * 18, y - 7 + Math.floor(i / 3) * 23, 15, 19, '#fff0c8'); line([[x - 20 + i % 3 * 18, y + Math.floor(i / 3) * 23], [x - 13 + i % 3 * 18, y + Math.floor(i / 3) * 23]], '#ba6a81', 2, false); } };
    const mortar = (x, y) => { path([[x - 27, y - 3], [x + 25, y - 3], [x + 17, y + 36], [x - 18, y + 36]], '#b27148'); ellipse(x - 1, y - 3, 26, 8, '#573326'); line([[x - 17, y + 18], [x + 14, y + 18]], '#d19761', 3, false); };
    const bag = (x, y) => { box(x - 24, y - 20, 45, 56, '#cc9143'); box(x - 21, y + 5, 38, 24, '#f3bd58'); line([[x - 11, y - 20], [x - 8, y - 31], [x + 8, y - 31], [x + 11, y - 20]], '#b3793e', 5); };
    const book = (x, y) => { box(x - 13, y - 28, 36, 48, '#52aabb'); box(x - 7, y - 22, 24, 33, '#fff6df'); for (let i = 0; i < 3; i++) line([[x - 3, y - 15 + i * 7], [x + 12, y - 15 + i * 7]], '#78a5ac', 2, false); };
    c.save(); c.translate(x, y); c.scale(scale * dir, scale); c.lineCap = 'round'; c.lineJoin = 'round';
    ellipse(0, 5, 61 - r.lift * .12, 8, '#080e2480', false);
    c.translate(0, -r.lift); c.rotate(r.lean);
    const wide = job === 'somtam' ? 1.13 : job === 'lottery' ? 1.08 : job === 'student' ? .93 : 1;
    c.scale(wide, job === 'lottery' ? .91 : job === 'student' ? .95 : 1);
    const bob = state === 'idle' ? Math.sin(time * 4) * 2 : 0;
    c.translate(0, bob);
    // Legs bend at the knee independently of the body and the feet stay planted in guards.
    const hipY = -70 + r.crouch;
    line([[-12, hipY], [r.rearKneeX, r.rearKneeY], [r.rearX, r.rearY]], job === 'student' || job === 'takraw' ? skin : dark, 16);
    line([[12, hipY], [r.kneeX, r.kneeY], [r.footX, r.footY]], job === 'student' || job === 'takraw' ? skin : dark, 17);
    if (job === 'takraw' || job === 'student') {
      line([[r.rearX, r.rearY - 16], [r.rearX, r.rearY - 3]], '#f5eedc', 15);
      line([[r.footX, r.footY - 17], [r.footX, r.footY - 3]], '#f5eedc', 16);
    }
    line([[r.rearX - 9, r.rearY], [r.rearX + 9, r.rearY]], '#edf3e8', 12);
    line([[r.footX - 7, r.footY], [r.footX + 16, r.footY]], '#edf3e8', 12);
    c.save(); c.translate(0, r.crouch);
    if (job === 'student' && !(attack && move === 3)) bag(-31, -119);
    line([[-18, -140], [r.bex, r.bey], [r.bx, r.by]], skin, 15);
    path([[-25, -149], [23, -149], [29, -77], [-29, -77]], color);
    path([[-24, -148], [-7, -151], [-7, -138], [-24, -130]], job === 'student' ? '#e7e9dd' : color);
    if (job === 'takraw') {
      path([[-28, -80], [28, -80], [29, -53], [5, -53], [0, -68], [-5, -53], [-29, -53]], dark);
      box(-19, -147, 6, 22, '#ffe38f'); box(12, -147, 6, 22, '#ffe38f');
      c.fillStyle = '#f7eabc'; c.textAlign = 'center'; c.font = '900 27px sans-serif'; c.fillText('9', 0, -104);
    } else if (job === 'somtam') {
      path([[-13, -145], [13, -145], [30, -54], [-31, -54]], '#f8edbf'); box(-16, -92, 31, 23, '#efa164');
      line([[-13, -145], [-16, -121]], '#fff5d9', 4, false); line([[13, -145], [16, -121]], '#fff5d9', 4, false);
    } else if (job === 'lottery') {
      path([[-28, -83], [26, -83], [40, -22], [-35, -22]], dark);
      line([[-18, -142], [20, -86]], '#f2d385', 6);
      for (let n = 0; n < 3; n++) ellipse(-10 + n * 12, -130, 4, 4, '#f8d86d');
    } else {
      path([[-28, -80], [28, -80], [26, -54], [3, -54], [0, -69], [-4, -54], [-26, -54]], dark);
      path([[-14, -148], [0, -129], [14, -148], [4, -153], [-5, -153]], '#d5dedb');
      box(9, -126, 11, 13, '#fbfff3'); line([[-18, -145], [-18, -83]], '#ad7638', 5);
    }
    // Face has independent brows, eyes and mouth for anticipation, impact and recovery.
    c.save(); c.translate(0, -174); c.rotate(r.head);
    ellipse(0, 0, job === 'somtam' || job === 'lottery' ? 29 : 26, 30, skin);
    ellipse(-25, 1, 5, 8, skin);
    if (job === 'somtam') {
      ellipse(-18, -36, 14, 13, '#362938'); path([[-28, -8], [-27, -26], [-10, -35], [19, -28], [28, -10], [8, -20]], '#362938'); line([[-27, -25], [24, -25]], '#f76854', 7);
    } else if (job === 'lottery') {
      [-24, -10, 4, 18].forEach((v, i) => ellipse(v, -28 + i % 2 * 3, 11, 12, '#dce0e7'));
      line([[-24, 0], [25, 0]], '#6a4171', 2, false);
    } else {
      path([[-25, -3], [-26, -25], [-15, -34], [-5, -29], [10, -37], [23, -26], [25, -10], [9, -17], [-9, -10]], '#202b39');
      if (job === 'takraw') { line([[-26, -17], [24, -17]], '#ffe28b', 7); path([[-27, -17], [-48, -29 + Math.sin(time * 12) * 3], [-41, -7]], '#ffe28b'); }
    }
    const eyesY = 0;
    if (hurt) {
      line([[-8, -3], [-2, 3], [-8, 7]], '#37292d', 2, false); line([[13, -2], [7, 3], [13, 6]], '#37292d', 2, false);
      ellipse(10, 17, 6, 7, '#713740');
    } else if (state === 'victory') {
      line([[-9, 2], [-5, -2], [-1, 2]], ink, 2, false); line([[8, 2], [12, -2], [16, 2]], ink, 2, false);
      path([[-1, 13], [17, 11], [13, 21], [5, 22]], '#713941'); line([[2, 14], [13, 13]], '#fff5df', 3, false);
    } else {
      ellipse(-5, eyesY + 2, 3, attack ? 4 : 3, ink, false); ellipse(12, eyesY + 2, 3, attack ? 4 : 3, ink, false);
      const tension = attack || state === 'block';
      line([[-11, tension ? -7 : -6], [-1, tension ? -3 : -6]], ink, 2.5, false); line([[7, tension ? -3 : -6], [17, tension ? -7 : -6]], ink, 2.5, false);
      if (attack && pose > .3 && pose < .7) ellipse(10, 17, 7, 8, '#713740');
      else if (state === 'block') line([[2, 17], [16, 17]], '#75433e', 3, false);
      else line([[5, 16], [12, 18], [18, 14]], '#75433e', 2, false);
    }
    if (job === 'lottery') { c.strokeStyle = '#614174'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(-6, 2, 10, 9, 0, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.ellipse(14, 2, 10, 9, 0, 0, Math.PI * 2); c.stroke(); }
    c.restore();
    // Back-hand props follow the elbow/hand rig rather than floating at the hip.
    if (job === 'somtam' && !(attack && move === 3)) mortar(r.bx, r.by);
    if (job === 'lottery' && !(attack && move === 3)) board(r.bx - 2, r.by);
    line([[20, -140], [r.ex, r.ey], [r.fx, r.fy]], skin, 16);
    ellipse(r.fx, r.fy, 10, 10, skin);
    c.save(); c.translate(r.fx, r.fy); c.rotate(r.prop);
    if (job === 'somtam') {
      if (attack && move === 3) mortar(1, -7);
      else if (attack && move === 2) { path([[-2, -7], [20, -15], [26, -4], [14, 6]], '#e64b48'); line([[20, -15], [20, -23]], '#5aa85d', 3, false); }
      else { line([[0, 17], [0, -46]], '#b67d48', 11); line([[0, -34], [0, -46]], '#daa267', 16); }
    } else if (job === 'lottery') {
      if (attack && move === 3) board(0, -21);
      else { for (let i = -1; i <= 1; i++) card(i * 8, -5, i * .3); }
    } else if (job === 'student') {
      if (attack && move === 3) bag(7, -9);
      else if (attack && move === 4) { box(-5, -85, 12, 99, '#eec367'); for (let n = 0; n < 10; n++) line([[-4, -77 + n * 8], [n % 2 ? 0 : 3, -77 + n * 8]], '#946a3c', 1, false); }
      else if (attack && move === 2) path([[-12, 6], [34, -10], [7, 18], [5, 5]], '#f3f9e8');
      else book(0, 0);
    }
    c.restore(); c.restore();
    if (job === 'takraw' && !(attack && move === 2 && pose > .45)) {
      const bx = r.footX + 24, by = r.footY - 25;
      ellipse(bx, by, 18, 18, '#e7bf59'); line([[bx - 14, by - 9], [bx + 14, by + 9]], '#997231', 2, false); line([[bx - 14, by + 9], [bx + 14, by - 9]], '#997231', 2, false); line([[bx, by - 17], [bx, by + 17]], '#997231', 2, false);
    }
    if (attack && move === 4 && pose > .24 && pose < .78 && job === 'lottery') {
      for (let n = 0; n < 5; n++) { const a = time * 6 + n * Math.PI * .4; card(Math.cos(a) * 83, -125 + Math.sin(a) * 65, a); }
    }
    c.restore();
  }
  function drawProjectile(c, job, x, y, facing = 1, spin = 0) {
    c.save(); c.translate(x, y); c.scale(facing, 1); c.rotate(job === 'student' ? -.12 : spin);
    c.lineWidth = 2; c.strokeStyle = '#182137';
    if (job === 'takraw') {
      c.fillStyle = '#f6cf64'; c.beginPath(); c.arc(0, 0, 18, 0, Math.PI * 2); c.fill(); c.stroke();
      c.strokeStyle = '#99743b'; for (let i = 0; i < 3; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.ellipse(0, 0, 7, 18, 0, 0, Math.PI * 2); c.stroke(); }
    } else if (job === 'somtam') {
      c.fillStyle = '#ff4f48'; c.beginPath(); c.moveTo(-17, -9); c.quadraticCurveTo(17, -15, 29, 8); c.quadraticCurveTo(1, 6, -17, 2); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = '#75c472'; c.lineWidth = 4; c.beginPath(); c.moveTo(-16, -4); c.quadraticCurveTo(-24, -13, -26, -6); c.stroke();
    } else if (job === 'lottery') {
      c.fillStyle = '#fff0c3'; c.fillRect(-19, -13, 38, 26); c.strokeRect(-19, -13, 38, 26);
      c.fillStyle = '#b84772'; c.font = 'bold 15px sans-serif'; c.textAlign = 'center'; c.fillText('99', 0, 5);
    } else {
      c.fillStyle = '#fffce9'; c.beginPath(); c.moveTo(-24, -13); c.lineTo(31, 0); c.lineTo(-18, 17); c.lineTo(-7, 1); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(31, 0); c.lineTo(-7, 1); c.lineTo(-24, -13); c.stroke();
    }
    c.restore();
  }
  root.RandomFighterArt = { drawFighter, drawProjectile, rigFor, POSES };
  if (typeof module !== 'undefined') module.exports = root.RandomFighterArt;
})(typeof window !== 'undefined' ? window : globalThis);
