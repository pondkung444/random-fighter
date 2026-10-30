# โรงเรียนมังกรจอมป่วน — O-NET ม.3 ปี 2567

Entry: `dragon.html`, also selectable from the Classroom Dungeon question selector. Four teams, paper and pen; teacher operates the projected display.

## Source and flow

Twenty ordered questions from supplied `Kru-PonD-BSP-Math-M3-Suratpittaya2.pdf`, pages 12–21. Six original figures/expression crops, image zoom, independently worked solutions (not an official answer key). Questions preserve numbering and mathematical content; prose is condensed in places for projection. Question 17 retains the original typeset expression as an image.

Prepare/edit teams → random nonrepeating representatives → face-down item choices revealed together → teacher commits/pays before question opens → solo marks → team recovery marks → solution/explanation → confirm awards → next. Team retry has a fresh 90-second timer. Items available every round, two charges per kind per team (six total), at most one per round. Remaining charges derive from completed and pending orders, preserving old saves. Only solo correctness triggers an item; no swap, shield or map.

## Economy

Solo correct: food 100 + stars 2. Solo wrong/team correct: food 50 + stars 1. Otherwise zero. Stars alone decide rankings, including tied winners. Food and stars are separate; spending/losing food never removes stars or lifetime food earned from answers. Internal food balance uses `gold` for compatibility with the isolated engine structure; it is displayed as food everywhere in this mode.

| Move | Cost | Success |
| --- | --- | --- |
| ฉกเสบียง | 30 food | Select another team; own solo correct + target solo wrong → claim 80 food |
| จามไฟ | 40 food | Own solo correct → claim 30 from every other solo-wrong team |
| บุกคลังมังกร | floor(half own food) | Select another team; own solo correct + target solo wrong → claim floor(half target post-purchase food) |

Orders validate atomically before charging. Costs are not refunded. Transfers settle simultaneously against post-purchase snapshots before answer rewards; multiple claims share capped reserves proportionally using integer largest remainders, tie by team ID. Stolen incoming food cannot be stolen again that round.

## Growth and shared finale

All teams evolve after questions 5/10/15: hatchling → explorer → guardian → crowned adult. Lifetime answer food 500/1,000 unlocks visual sparkles. Food spending/theft never reverses growth. Current art uses the supplied transparent 4 × 4 dragon sheet, sliced into 16 WebP sprites (columns: orange, blue, green, purple; rows: levels 1–4), with gentle animation, with result/evolution effects and reduced-motion support.

Questions 19–20 contribute each answer's stars to shared storm power. At least 10/16 possible power protects the school. Ordinary individual/team stars still count unchanged. This shared goal does not add or subtract team points.

## Persistence and validation

Separate localStorage `classroom-dragon-onet2567-v1`; original Treasure and Dungeon autosaves remain separate. JSON format `dragon-session-v1`; validate before restore/import. Refresh pauses the timer. Undo restores food, stars, earned food, queue, uses and storm together. Teacher can export results/names as JSON.

Run `node tests/dragon.test.cjs` and `node tests/dragon-browser.cjs`. Browser uses the workspace's installed Playwright/Chrome runtime; adjust module location if running elsewhere.

Real classroom pacing, projector/iPad mirroring and food/move balance require classroom trials. This version has simple SVG animation, not individually rigged characters, audio or cinematic attacks. Current implementation supports four teams.
