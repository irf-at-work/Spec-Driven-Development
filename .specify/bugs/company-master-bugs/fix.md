# Bug Fix: Company Master Layout and Navigation

- **Slug**: company-master-bugs
- **Fixed**: 2026-10-30
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Updated the listing's table area to fit the available viewport height while retaining its existing horizontal scrolling, and added clean borders, row separators, and header styling. Added a surface panel to company details and made Cancel return to the edited company's details while preserving query parameters; creation still returns to the listing.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css` | modified | Replaced the fixed table height with a viewport-relative height, retained `overflow: auto`, and added table borders, header styling, alternating row color, hover, and row separators. |
| `Spec-Driven-Development/sdd-ui/src/app/layout/dashboard-layout.css` | modified | Made the dashboard shell a flex column so its header margin does not create document-level vertical overflow; main content fills the viewport. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` | modified | Grouped the company heading, actions, and definition list in a details panel. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css` | modified | Added the surface panel and bordered detail cards, with a responsive heading/actions layout for narrow screens. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html` | modified | Made Cancel route to company details during edit and the listing during creation; query parameters are preserved. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts` | modified | Added Cancel-navigation tests for edit and create flows, including query preservation. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-delete.spec.ts` | modified | Added coverage that company details render inside the panel. |

## Diff Highlights

- The listing table area uses `max(10rem, calc(100dvh - 27.5rem))`; its existing horizontal overflow behavior remains unchanged.
- The dashboard shell now establishes a flex formatting context, preventing the header's top margin from adding a document-height overflow.
- Edit Cancel targets `/company-master/<companyCode>` and preserves the current query string.

## Tests Added or Updated

- `company-form.spec.ts` — `returns to the edited company details when edit is canceled` verifies the details destination and retained `page=2` query parameter.
- `company-form.spec.ts` — `returns to the company listing when creation is canceled` protects the existing create flow.
- `company-delete.spec.ts` — `presents company details inside a bordered panel` checks that detail content is grouped in the panel.

## Local Verification

- Commands run: `npm test -- --watch=false --include src/app/pages/company-master/company-master-page.spec.ts --include src/app/pages/company-master/company-form.spec.ts --include src/app/pages/company-master/company-delete.spec.ts` → passed (3 test files, 16 tests).
- Commands run: `npm run build` → passed.
- Commands run: `npx prettier --check` on the changed UI files → passed.
- Manual browser checks: at desktop and mobile listing viewports, the document had no vertical overflow and the table retained horizontal overflow. Verified the details panel border and responsive grid, and confirmed edit Cancel returns to company details with query parameters preserved.

## Deviations from Assessment

- The horizontal scrolling was already present and the user confirmed it did not need changes; its overflow behavior and table minimum width were left intact.
- Added `dashboard-layout.css` beyond the files initially listed after browser verification showed a 16px document overflow caused by the dashboard header margin collapsing outside its shell. Making the shell a flex column removes that page-level scrollbar and lets the content fill the viewport.
- Added panel verification to the existing `company-delete.spec.ts` suite, which already exercises the company details component.
- Used a restrained palette based on the existing design tokens; the user did not specify colors or border weights.

## Follow-ups

- Run `/speckit-bug-test slug=company-master-bugs` for the dedicated bug-test report.
