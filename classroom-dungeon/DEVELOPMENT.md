# Classroom Dungeon functional preview

Source of truth: Notion Classroom Dungeon — Physics Math Bootcamp v0.1 (Grill Locked), Gameplay v0.2 and latest 60–70 minute Camp timetable.

## Implementation

Isolated dependency-free static module at /classroom-dungeon in the existing Random Fighter hosting. This first playable uses plain JavaScript rather than introducing Next.js/React into a static repository. It requires no installation, build migration, CDN or network dependencies. Content, gameplay engine and DOM UI are separate files. React/TypeScript migration remains optional after classroom validation.

22 scored encounters and 8 reserve questions. Timers total 73 minutes; setup 10, Camp 10, debrief 10 leave 17 minutes for marking, transitions and explanation. This is a pacing estimate, not a measured classroom session.

## Tuning assumptions

Boss HP = 1000 per party; correct 30 damage, recovery 20, explanation 20, teamwork 10, successful combo +2 up to +10. Stars: 3/2/2/1 respectively. Full armor break +30 per party. Final attack +120 per party once after all parties complete the core. Final chance +150 for each successful party, once per session. Dungeon Clear threshold = HP remaining <=35%; zero HP = Perfect Clear, or Miracle Finish after Final Chance. All damage/threshold numbers need classroom tuning.

Original correctness is immutable in recorded encounter history; recovery and error tags remain separate. Report is party-level evidence, not individual mastery assessment.

## Validation

- node --test tests/dungeon.test.cjs
- With Playwright available: node tests/dungeon-browser.cjs (PLAYWRIGHT_MODULE can point to an installed module)
- Browser test uses request interception to serve actual local files, because this sandbox blocks localhost networking. Covers normal flow, complete 22-room session, final attack/report, refresh restore, presentation masking, 8-party layout at 1024x768, 1180x820 and 1920x1080.
- Vercel Preview route returned HTTP 200. No on-device iPad/TV test yet.

## Remaining work before classroom-ready production

Functional UI only: final art direction, reveal transitions, boss/final-attack animation and sound design await the agreed Art Direction discussion. Sound currently provides a simple optional beep.

Scheduled events and teacher-triggered events exist; Formula Hint / Recalculate / RECHECK usage is tracked once per party per floor. Timed silent windows, reserve-question selection/import, separate display and printable scrolls are not complete. Teacher currently enforces paper/relay/no-rewind rules. Final Chance is available. Boss Armor has different equivalent data cards per party; other encounters use shared content.

Presentation Mode hides controls and unrevealed solutions; mirror is still one shared screen. Explicitly revealing a solution displays it on TV. Exit Presentation to grade; this is not a private second controller.

Autosave is local to browser and URL origin. Refresh restores the current session paused. Changing preview hostname or browser does not transfer data; JSON export is available, import UI is not yet implemented. Do not move a real class between preview and production during a session.

Production remains unchanged pending classroom validation and art direction. No student accounts, backend, analytics or external requests are added.
