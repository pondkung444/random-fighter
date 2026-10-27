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

Arcane Observatory art direction is approved and applied: existing painterly background, brass/ivory/teal surfaces, large central question, eight colored party crests, floor accents, constellation-ring boss emblem, and nonblocking Switch/Critical/Recovery/Reveal/Boss/Final Attack banners. These are limited presentation effects; cinematic guardian character art, a sequenced final-attack countdown and richer sound remain polish work. Sound currently provides a simple optional beep.

Scheduled events and teacher-triggered events exist; Formula Hint / Recalculate / RECHECK usage is tracked once per party per floor. Timed silent windows, reserve-question selection/import, separate display and printable scrolls are not complete. Teacher currently enforces paper/relay/no-rewind rules. Final Chance is available. Boss Armor has different equivalent data cards per party; other encounters use shared content.

Presentation Mode hides controls and unrevealed solutions; mirror is still one shared screen. Explicitly revealing a solution displays it on TV. Exit Presentation to grade; this is not a private second controller.

Autosave is local to browser and URL origin. Refresh restores the current session paused. Changing preview hostname or browser does not transfer data; JSON export is available, import UI is not yet implemented. Do not move a real class between preview and production during a session.

Production remains unchanged pending classroom validation. No student accounts, backend, analytics or external requests are added.

## Art checkpoint — 27 October 2026

Reuses approved image blob b58ec8464932b0f7a21d7732a4897bfac82a45b4 at classroom-dungeon/assets/observatory.png. No engine/content or localStorage schema changes. System Thai fonts avoid network font dependencies. Keyboard focus and 48px teacher controls retained; reduced-motion preference disables banner animation.

Validated: seven engine tests; full 22-room browser run through final attack/report and refresh; 45 layout cases (2/4/8 parties, short/Lab/Armor/Link/Core prompts, 1024x768 / 1180x820 / 1920x1080). All question and party card bounds fit the viewport in these 45 cases. Explicit solutions/diagnostic reports remain scrollable rather than clipped. Presentation masks teacher controls and answers until explicitly shown. Art tests also check explicit answer visibility and reduced motion. Background downloaded locally and visually inspected. No real iPad/TV test yet.
## Preparation checkpoint — 27 October 2026

Names, party membership and flexible role choices now share one preparation screen. Creating groups does not start gameplay. Move members without wiping role assignments, rename groups, update the roster while preserving remaining members, or explicitly reshuffle. Readiness requires nonempty parties, a role for every member and all four functions covered in every party. Temporary incomplete assignments are allowed during editing; Begin is gated. Preparation autosaves using the existing v1 session envelope with optional preparing/prepareNames fields; older sessions continue playing normally. Begin clears the preparation flag and starts the first encounter paused. The play header provides preparation return before the first scored encounter and a confirmed New Room action.

Short entry host: pond-class.vercel.app (alias to Preview). A host-scoped root redirect sends users to the canonical stable classroom-dungeon Preview origin so existing localStorage is retained. This entry does not replace the production Random Fighter domain or root. Alias assignment and deployment readiness must be verified separately.

Validation: preparation browser coverage for every party count 2–8, refresh while preparing, moves preserving roles, member additions preserving assignments, group rename, readiness gate, mobile width and playing-session refresh. Existing full-session browser test now explicitly clicks Begin after arranging groups. Engine tuning and scoring unchanged. Broader TV/boss flow redesign remains separate work.
