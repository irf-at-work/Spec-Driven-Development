# Bug Fix: Company and Master UI Bugs

- **Slug**: func-and-ui-bugs
- **Fixed**: 2026-11-04
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Completed the Company and List Item presentation and setup fixes already recorded, then corrected the remaining Company Details overflow. At narrow viewports, the long title's intrinsic flex/grid sizing could expand the details layout to 2245px even though the title itself was ellipsized and had a tooltip.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` | modified | Combined the four audit fields into one grid; added tooltips to detail values, division names, and department cells; added a close control and sticky header/actions to the Add division dialog. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css` | modified | Matched division details to Company read-only field styling, added four-column audit and responsive dialog layouts, and constrained long values. Added a zero-minimum details grid track and title sizing constraints to prevent intrinsic-width overflow. Kept the wider dialog styling scoped to Add division. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts` | modified | Imported Angular Material tooltip support. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts` | modified | Covered audit grid, long-value tooltip, division tooltips, and Add division layout/close behavior. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.html` | modified | Added full-value tooltips to all read-only Company values. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.css` | modified | Ellipsized read-only values without changing editable inputs; constrained the component host and root grid to the available width. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.ts` | modified | Imported tooltip support for Company fields. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.spec.ts` | modified | Added a 100-character Company-name truncation/tooltip regression test. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.html` | modified | Added full-value tooltips to read-only values. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.css` | modified | Aligned detail field cards and responsive grid with the Company detail presentation. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.ts` | modified | Imported Angular Material tooltip support. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.spec.ts` | modified | Asserted all 14 read-only values have tooltips and the matching three-column layout. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html` | modified | Cleared setup query parameters from the grid link and added Department-step Exit after Save. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts` | modified | Creates an initial Division card when none are returned; Exit discards unsaved department data and navigates to company details. Basic save now clears setup-only query parameters when opening details. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts` | modified | Covered the default open Division card, unsaved Department Exit behavior, and query cleanup on return to the grid. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html` | modified | Clears stale setup parameters when starting a new company while retaining other query state. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css` | modified | Overrides the filter-actions cell’s inherited 12rem minimum so the Company actions column stays icon-width. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts` | modified | Verifies the Company action and filter-action columns are both 88px and that Add company drops stale setup parameters. |
| `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyListAndDetailsE2ETests.cs` | modified | Added a browser regression test for 100-character company names at desktop and narrow viewport widths. |

## Diff Highlights

- The Company detail audit history is now one `dl` grid with four fields on desktop and responsive two-/one-column layouts.
- Read-only values remain complete in the DOM and use ellipsis plus Angular Material tooltips for inspection; editable controls are unchanged.
- The Company actions width discrepancy came from `.filter-row th { min-width: 12rem; }` also applying to the empty `filter-actions` cell. A specific override restores the intended 5.5rem/88px actions width.
- Department-step Exit does not invoke department persistence and routes to `/company-master/<companyCode>`.

## Tests Added or Updated

- `company-details-page.spec.ts > renders all four audit fields together and keeps actors paired with their GST dates` — validates the unified audit grid.
- `company-details-page.spec.ts > truncates the displayed company name while retaining its full text and tooltip` — locks down the reported 100-character name case.
- `company-details-page.spec.ts > adds a division from the company details screen` and `closes the Add division dialog from its sticky heading button` — verify the dialog controls and three-column field layout.
- `company-form.spec.ts > renders multiple Division and Department expansion panels open at once` — verifies the initial Division card is open.
- `company-form.spec.ts > discards unsaved department data and navigates to company details on Exit` — verifies no department save occurs before navigation.
- `company-form.spec.ts > clears setup parameters when returning from company setup to the grid` and `company-master-page.spec.ts > clears stale company setup parameters when starting a new company` — guard the setup route cleanup.
- `company-master-page.spec.ts > renders the requested columns, company row and history action` — checks the action-column widths.
- `list-item-details-page.spec.ts > displays all business and audit fields in view mode` — verifies tooltip coverage and the aligned grid.
- `CompanyListAndDetailsE2ETests.Company_details_with_long_name_stay_within_the_viewport_and_details_panel` — asserts that a 100-character company name does not create document overflow and keeps the fields panel within its details panel at 320, 768, 1024, and 1440px viewport widths.

## Local Verification

- Commands run: `npm test -- --watch=false` → passed, 12 test files / 65 tests.
- Commands run: `dotnet test .\Spec-Driven-Development\SDD.API\SDD.API.E2E.Tests\SDD.API.E2E.Tests.csproj --filter "FullyQualifiedName~Company_details_with_long_name_stay_within_the_viewport_and_details_panel" --no-restore -p:BaseOutputPath=D:\Spec-Driven-Development\Spec-Driven-Development\SDD.API\SDD.API.E2E.Tests\.bugfix-bin\` → passed, 1 browser test. The isolated output path avoided files held by an already-running `SDD.API.exe`.
- Commands run: `npm run build` → passed. Angular reported bundle-size budget warnings: initial bundle 742.67 kB against 500 kB, and Company details CSS 4.98 kB against 4 kB; neither is a build error.
- Commands run: `npm exec prettier -- --check <changed frontend files>` → passed.
- Commands run: `git diff --check` → passed.
- Manual checks: the new browser test confirmed the details document and fields panel remain within their intended bounds at all four viewport widths. The overflow initially reproduced at 320px with a document width of 2245px.

## Deviations from Assessment

- The assessment's truncation recommendation was already present but did not prevent the page from expanding. Browser reproduction identified intrinsic flex/grid sizing in the title area as the remaining cause; the details grid and title are now allowed to shrink within their container.
- Added an end-to-end test in `CompanyListAndDetailsE2ETests.cs`, outside the assessment's likely-file list, because component tests cannot measure document overflow or actual browser layout containment.
- The assessment left the Company column sizing discrepancy unexplained. Inspection identified the 12rem minimum on all Company filter-row header cells as the cause; the fix scopes an 88px override to the filter-actions cell, retaining the existing icon action width.
- The wider Add division dialog styles are scoped only to that dialog; other dialogs using the shared `.department-dialog` keep their previous width.

## Follow-ups

- `/speckit-bug-test slug=func-and-ui-bugs`
- Consider reducing the Company details component stylesheet or reviewing its Angular style budget warning.
