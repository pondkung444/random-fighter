# Dragon Academy: automatic events
Updated 2026-10-31. Replaces manual items; questions remain 2568 Q14–20, then 2567 Q1–20 (27 rounds).

Flow: draw one representative per team → event announcement → acknowledge rules → select routes if cave → reveal question → mark all four representatives → solution → settle event → open eligible chests → next round. No team recovery round.

Base reward: correct 100 food and 2 stars; incorrect zero. Event rewards are additional:
- Rain: correct adds 100 food.
- Raid: random disjoint pairs; only correct versus incorrect transfers up to 80 food from the loser's pre-reward balance; matching outcomes transfer nothing.
- Storm: at least three correct grants every team 50 food.
- Cave: choose safe or risk before question. Risk correct adds 2 stars; incorrect loses up to 50 food, clamped to balance.
- Challenger: teams tied for lowest stars at event draw are eligible; correct adds 2 stars. Available from round 8.
- Chest: correct teams reveal one prize each, equal chance of 50 food, 100 food or 1 star. Prizes are sampled with the event and persisted, so reload/undo cannot reroll them. Next is blocked until all eligible chests are opened.

First events are rain then chest. Later events do not repeat consecutively. Raid is eligible only when every team has food. No speed scoring, negative food, item purchases or charges.
Final school-defense meter still counts only base answer stars in the final two rounds, target 10.
Growth remains after completed rounds 5, 10 and 15.

State version 3 upgrades version 2 without discarding teams/history. An existing solo/answer/result round finishes under its old base rewards; the next draw starts events. Existing preparation screens receive an event. Export format remains dragon-session-v1.
Event acknowledgement, routes, prizes and chest-open status persist. Undo restores the previous state.
Motion toggle and prefers-reduced-motion disable event animations.
Checks: node tests/dragon.test.cjs; node tests/dragon-browser.cjs.
