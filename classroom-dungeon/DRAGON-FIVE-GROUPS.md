# Five dragon groups — 2026-11-01

New games have five groups. Enter a roster, choose each student's group from a dropdown, rename groups and move students before Begin. Optional random grouping is balanced and remains editable. Unassigned students and empty groups block Begin. Duplicate displayed names remain separate roster entries; assignment uses roster index, not name.

Five-team raids use a shuffled directed cycle: each team targets the next team and is targeted by exactly one other team. Only own correct + target wrong transfers up to 80 food from the pre-reward balance. No team sits out; transfers are capped and all earned incoming food feeds growth. Four-team saved sessions keep the previous disjoint pairing.

Storm requires 4/5 correct; shared final defense requires 7/10 correct across the last two rounds. Legacy four-team saves keep thresholds 3/4 and 5/8. Existing saves remain intact; start a new game to arrange five groups. Food thresholds, question order and solo-only answers are unchanged.

The fifth group uses the existing orange dragon's four stages with a gold CSS hue treatment, avoiding missing sprite paths. Group names and a fifth team color identify it throughout play.

Checks: node tests/dragon.test.cjs (food regressions, all 32 raid answer combinations, four/five-team full sessions); node tests/dragon-browser.cjs (Playwright, optional PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH). Existing Dungeon and Treasure engine tests also pass.
