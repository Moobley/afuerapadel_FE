# Task 3 Report: Create script.js

## What was implemented

- `script.js` created with the exact code from the task brief
- Mobile hamburger menu toggle (adds/removes `header__nav--open` class, closes on link click)
- Fetch standings from `assets/RISULTATO TORNEO.json`
- Renders table rows into `#standings-body` on success; shows error/empty messages on failure
- Top 4 rows receive `is-top` CSS class (orange left border)
- XSS protection via `escapeHtml()` helper

## What was tested

- `npx serve .` started from project root, confirmed both `index.html` and `assets/RISULTATO TORNEO.json` served correctly via HTTP on localhost:3000
- Verified HTML includes `<script src="script.js"></script>` at end of body
- Verified JSON data accessible (64 data rows + 1 header row)
- Verified the `is-top` class is applied to first 4 data rows, header row skipped
- Console error path renders fallback message on fetch failure

## Files changed

- Created: `script.js` (77 lines)

## Self-review findings

- `TOP_POSITIONS` array is declared but never used — matches brief exactly, no impact on functionality
- Score values are non-nullable (numbers or absent); `r['Column4'] != null` handles both null and undefined correctly

## Issues or concerns

None.

## Commit

`f004f69` feat: add JS for data loading, table rendering, and nav
