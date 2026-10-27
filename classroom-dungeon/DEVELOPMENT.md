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


## Motion Chronicles chapter-one preview (2026-10-27)

New sessions enter campaign version 3: preparation → three lore scenes → team reveal → map → room rules → selected seats → explicit Ready → timed task → marking → results → optional solution → reward. Old sessions without campaign retain the original engine; campaign version 2 retains its 20 steps.

The first chapter has 14 assessed stages: tram (4), bridge choice and error hunt (2), knight braking plan (3), sign illusion (2), party-link seal (3). All five constant-acceleration equations are covered; classroom rules and peer checking are teacher enforced. Timers are 90 seconds per stage (21 minutes total), plus setup, transitions, explanation and Camp; this is not a full 120-minute lesson. Final Chance is 120 seconds after a separate readiness screen. The 20-second silent window needs the teacher to press Open team help after it expires.

Artwork uses the existing painterly key art at assets/knight-keyart.png (Git blob 590060a57295503ca8b1f0cb61a4041e8b71dc3b), with CSS crops and glow states. These are not separate illustrated poses or full animations. Tram/bridge use CSS mechanism emblems.

Each party earns a time crystal after the tram. One use adds 30 seconds to the shared class timer. Camp retains unused crystals and marks spent ones; rewards are idempotent. Correct first answer gives 3 stars, successful recovery 1; original incorrect flags remain false. Eight boss stages distribute 100 seal points by party success fraction. Full success frees the knight; otherwise Final Attack leads to Final Chance, with success only if every party explains correctly. Failed Final Chance leads to evacuation/Camp. No negative scores or student elimination.

Undo restores state before an action, pauses the clock, and reverses scores/reward consumption. Autosave uses the same browser origin; reload pauses. JSON export exists; import and real separate teacher/TV screens remain outside this change. Real iPad mirroring still needs classroom validation.

Run: node --test tests/dungeon.test.cjs; node tests/campaign-browser.cjs; node tests/dungeon-preparation.cjs; node tests/dungeon-browser.cjs. Browser scripts require a locally installed playwright (or PLAYWRIGHT_MODULE) and Chrome. No machine-specific dependency path is committed. campaign-visual.cjs captures visual review frames.


## Curriculum and question visuals revision (v4, 2026-10-27)

Per user correction, new sessions start with Number Gate (4 independent arithmetic questions: order of operations, signed numbers, fractions, powers), then Equation Balance (4 independent algebra questions: x+7=19, 3x−4=20, x/4+2=5, rearrange y=3x+2). Both rooms select one weighted random member per party from ALL members, ignoring assigned role; previous member is avoided when another is available. Questions remain hidden until teacher Ready. Every question is assessed separately.

The original five motion rooms follow at indices 2–6 (14 stages, all five constant-acceleration formulas). New total: 7 rooms and 22 assessed stages, 33 minutes of task timers plus transitions/discussion/Camp; still not a measured 120-minute lesson. Roles continue in motion rooms; miniboss damage begins only at room 4. Time-crystal reward now follows the arithmetic gate. Versions 2 and 3 retain their old room sets to preserve in-progress autosaves. Start a new room for v4.

Each task includes semantic inline SVG: operation groups, signed-number direction diagram, grouped crystals, exponent blocks, balance scale with equation sides, or start/end motion schematic with known values and unknown target. Physics diagrams identify right as positive and explicitly state not to scale. The task diagram is absent from readiness screens, preventing early disclosure. No numeric solution is inserted in a diagram. Final Chance also has a motion schematic. The earlier vague at-unit prompt is replaced for v4 with: write final velocity with its unit and explain positive direction; the solution explains how acceleration changes velocity each second. Physics room introductions define u/v/a/s/t in Thai.

Question visuals sit beside text at classroom widths and stack on mobile. During work, decorative boss art yields its space to the task diagram; key art remains in story and room scenes. campaign-task-layout.cjs checks all 22 task layouts at 3 classroom resolutions.


## Question clarity audit (2026-10-27)

Reviewed and edited all 22 live v4 stages. Every task now has separate Given information and What to do sections; numerical assumptions and positive direction are repeated instead of requiring recall of a previous screen. Arithmetic uses direct expressions instead of ambiguous negative energy stories. Algebra distinguishes numeric solving from expressing x in terms of y. Motion role tasks explicitly request identification, formula selection, substitution/calculation, or verification with units/direction. Bridge and sign-error tasks include the actual incorrect working, labelled as work to check. The stop-before-gate task restates braking inputs and the gate distance.

Diagrams now use the current stage target, avoid adding a 30 m gate before that distance is introduced, and correctly keep the dedicated a/s target in Final Chance. Readiness instructions are generic to avoid disclosing numerical hints before Ready. No room index, score, formula coverage or autosave version changes: current v4 sessions receive the wording fixes after refresh.


## Selectable question packs (2026-10-27)

Question data extracted into packs/motion-equations.js and registered through question-packs.js. Preparation now selects a pack, displays its room/stage/timer totals, and preserves choice through grouping and draft refresh. The only published ready lesson is สมการการเคลื่อนที่. new-pack.example.js is a developer example, not loaded in the classroom catalog.

New v5 sessions snapshot named-field pack data (id, revision, rooms, givens/asks/answers, timing, diagrams, lore, summary and Final Chance) into autosave/JSON. Snapshot compilation restores the engine's legacy step shape without losing view metadata during JSON serialization. Existing v2/v3/v4 remain compatible; snapshot content protection begins with v5.

Room counts, stage counts, story lengths, per-stage times, silent intervals, boss start and damage normalization now derive from pack data. Future packs support cards, balance and motion SVG templates; the detailed motion-classic diagrams still use the old room-specific renderer and are reserved for the built-in lesson. Theme/4 Role engine remain Astra; this is not a complete lesson builder. See packs/README.md for authoring steps and known limits.
