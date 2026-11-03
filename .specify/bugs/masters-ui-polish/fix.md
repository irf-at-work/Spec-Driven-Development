# Bug Fix: Master UI polish and company setup flow

- **Slug**: masters-ui-polish
- **Fixed**: 2026-11-03
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Updated the shared filter and master-page actions to match the requested UI, and corrected company setup navigation and saved-division persistence. Newly created divisions now appear first in company details; regression tests cover the updated UI and workflow paths.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.html` | modified | Removed the visible “Choose operator” option while preserving the operator control and its empty state. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.css` | modified | Styled the operator control with existing UI colors, border, surface, and rounded corners. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.spec.ts` | modified | Verifies the placeholder is absent, filtering remains operable, and filter control styling is applied. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts` | modified | Routes saved divisions through update requests, records successfully saved codes, preserves company and division state when returning to Basic details, updates rather than recreates the company, and synchronizes expansion-panel state. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html` | modified | Adds return navigation, Material expansion panels for both structure steps, protects saved division codes, and places department removal in the card header. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.css` | modified | Aligns expansion panels and destructive actions with the existing UI. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts` | modified | Covers saving then revisiting a division, updating the company after returning to Basic details, and independently expanded Division/Department cards. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts` | modified | Prepends newly created divisions while preserving existing division order. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` | modified | Adds pen/bin SVGs to company and division Edit/Delete actions. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts` | modified | Verifies new divisions appear first and Edit/Delete actions include icons. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/listing-master-page.html` | modified | Replaces the visible Add ligature text with a plus SVG. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/listing-master-page.spec.ts` | modified | Verifies the Add action renders an SVG icon. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.html` | modified | Adds a back arrow, sets the heading to “List item master,” and adds pen/bin icons to Edit/Delete. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.spec.ts` | modified | Verifies the exact heading and the back/Edit/Delete icons. |

## Tests Added or Updated

- `src/app/shared/filter-control/filter-control.spec.ts` — confirms the operator placeholder is absent while value/operator changes and clearing remain functional.
- `src/app/pages/company-master/company-form.spec.ts` — exercises the company creation → division save → department → division → Basic details flow; confirms saved divisions use the update API and Basic details saves do not create a duplicate company.
- `src/app/pages/company-master/company-form.spec.ts` — verifies multiple Division and Department panels can remain open and removal is in the department card header.
- `src/app/pages/company-master/company-details-page.spec.ts` — checks new division ordering and action icons.
- `src/app/pages/listing-master/list-item-details-page.spec.ts` — checks the required title, back arrow, and Edit/Delete icons.
- `src/app/pages/listing-master/listing-master-page.spec.ts` — checks the Add plus icon.

## Local Verification

- Commands run: `npm test -- --watch=false` → passed, 12 test files and 59 tests.
- Commands run: `npm run build` → succeeded. Angular reported the initial bundle at 740.57 kB, above the configured 500 kB warning budget; the build completed successfully.
- Commands run: `npx prettier --check <touched UI files>` → passed.
- Commands run: `git diff --check` → passed; Git emitted only line-ending conversion warnings for changed files.
- Manual checks: None; the workflow and markup were verified through automated Angular tests.

## Deviations from Assessment

None.

## Follow-ups

- Consider addressing the initial bundle budget warning separately from this UI fix.
