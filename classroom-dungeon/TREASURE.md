# Treasure Islands — O-NET 2568

Implemented 2026-10-30. Entry: `treasure.html`, also available from the existing pack selector. The original Dungeon app baseline comes from remote commit `136eaf625e664cbf2a9793924e310a7aab6d17ca`; only its selector and navigation handler are changed.

## Phases delivered
1. Isolated game state with reuse of existing roster/grouping helper and optional four-team import.
2. Twenty ordered questions transcribed from supplied worksheet pages 2–11; 12 cropped original figures, image zoom, worked solutions. Q6 retains 6.1–6.4 with previous/next buttons and counts as one all-or-nothing question.
3. Four ships, coin piles, shuffled nonrepeating member queues, solo 100 / team recovery 50, pre-question item commitment. Item windows 3/6/9/12/15/18, three uses per team. No shields. Hook costs 30 and draws 30 from every solo-wrong team when solo-correct. Raid costs floor(half own balance) and draws floor(half target post-purchase balance) when attacker solo-correct and target solo-wrong. Map costs 30 and awards 60 only for solo-correct.
4. Engine tests and 20-question browser flow; viewport review at 1180×820, 1920×1080 and 390×844.

## Settlement
Validate all orders before charging any team. Snapshot balances after all purchases. Build all successful theft claims, cap each victim at their snapshot balance, allocate proportionally using integer largest remainders (ties by team ID). Transfer simultaneously; stolen incoming money cannot itself be stolen that round. Then award question gold and map bonuses. Item costs leave the economy. Repeated settlement is rejected. Undo restores balances, use counts and queues together.

## Teacher operation
Start → randomize/edit teams (or reuse four existing Dungeon teams) → draw four representatives → write face-down item choices and reveal together → teacher enters choices → lock/pay/open question → record solo marks → wrong teams retry → record team marks → reveal worked solution → confirm payout → next. No student devices required. Only right/wrong status is projected before recovery ends. Teacher manually judges paper responses; the UI never exposes the answer in the solo/team phases.

Separate browser autosave key `classroom-treasure-onet2568-v1`, JSON backup/import, 60-step in-memory undo, timer, font size, fullscreen, reduced-motion support. Refresh pauses time. JSON import restores a session; backups contain student names and should be kept by the teacher. Existing Dungeon autosaves are not overwritten.

## Validation commands
`node tests/treasure.test.cjs`
`node tests/treasure-browser.cjs` (set Playwright module path for another machine)

Question 3: x² = (8 + 8√2) + 4, so x≈4.828, option 1. Question 4: outer a=1/40, inner b=1/20, m≈4.142 >80b=4. Question 6 preserves worksheet numbers, including false statements 307.55 and 341.24. Solutions are independently worked, not an official answer key.

## Continuation fixes
New sessions shuffle all 20 questions once and save questionOrder; original worksheet numbers remain visible. Item windows use round numbers, independently of worksheet question numbers. Legacy sessions without questionOrder preserve their ordered questions. Restores/imports validate state before acceptance; team recovery starts with a fresh 90 seconds.

## Teaching order (user correction)
New sessions open worksheet questions 1 through 20 in order. Representative selection remains random. Existing sessions preserve their stored order; start a new session to switch from a previous shuffled run.
