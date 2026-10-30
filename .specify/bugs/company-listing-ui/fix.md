# Bug Fix: Company Master Listing Presentation

- **Slug**: company-listing-ui
- **Fixed**: 2026-10-30
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Kept the company table mounted during loads and errors, gave its scroll area a fixed 42rem height, and kept the empty message inside that area. Replaced company-page icon ligatures with inline SVGs and updated the global font stack to a modern system-font fallback stack.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html` | modified | Moved loading and error messages outside the table branch, kept the table rendered with zero rows, placed the empty state inside the table area, and replaced add/history ligatures with inline SVGs. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css` | modified | Set the table scroll area to a fixed 42rem height with horizontal and vertical overflow. |
| `Spec-Driven-Development/sdd-ui/src/styles.css` | modified | Applied the Inter / Segoe UI Variable / Segoe UI / system-ui font stack globally. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` | modified | Replaced arrow-back, history, and edit ligatures with inline SVGs. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html` | modified | Replaced the arrow-back ligature with an inline SVG. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts` | modified | Added coverage for SVG icons, table persistence while a filter request is pending, and an empty table with no data rows. |

## Diff Highlights

- The table now remains in the template while loading; the status is announced separately and previous results stay visible until the response arrives.
- The table area is 42rem high (672px at the browser default root size), enough for the default 10 rows and both header rows.
- Custom icon SVGs use `currentColor` and decorative accessibility attributes, with no external font request or visible ligature text.

## Tests Added or Updated

- `company-master-page.spec.ts` — `renders the requested columns, company row and history action` verifies company action icons render as SVGs without ligature text.
- `company-master-page.spec.ts` — `keeps the table and existing rows visible while a filter request is pending` verifies the table and prior data remain visible during refresh.
- `company-master-page.spec.ts` — `shows an explicit empty state when the API returns no companies` verifies the table remains present without company rows.

## Local Verification

- Commands run: `npm test -- --watch=false --include src/app/pages/company-master/company-master-page.spec.ts` → passed (5 tests).
- Commands run: `npm run build` → passed.
- Manual browser check: confirmed the table remains visible during loading, the table area computes to 672px, the empty message is inside that area, and the custom icon SVGs contain no ligature text. The API was unavailable during this check.

## Deviations from Assessment

- Updated the company details and form templates as well as the listing template because the reported arrow-back, history, and edit icons are also used on those company-master screens.
- Used inline SVGs rather than adding an icon-font dependency; this follows the assessment's bundled-SVG alternative and avoids an external network dependency.
- Applied the font and table dimensions using the user's follow-up preferences: a modern professional system-font stack and a table area tall enough for the default 10 rows.

## Follow-ups

- Run `/speckit-bug-test slug=company-listing-ui` for the dedicated bug-test report.
