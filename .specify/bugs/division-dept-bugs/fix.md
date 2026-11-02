# Bug Fix: Company master and division details UI defects

- **Slug**: division-dept-bugs
- **Fixed**: 2026-11-02
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Aligned the Company Master header and made its table fill the remaining viewport height while keeping the paginator visible without a document scrollbar at 1920×1080. Consolidated company details, moved edit actions to the requested positions, and replaced custom division cards with collapsed-by-default Material expansion panels; division L2 data remains preserved on update.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html` | modified | Put the heading and Add company action in one header row. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css` | modified | Used a flex column layout and viewport-height section so the table takes remaining space and the paginator stays in view. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts` | modified | Asserted the shared heading row and flex sizing behavior. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` | modified | Moved company save/cancel below its fields; applied destructive-action styling; changed divisions to Material expansion panels with header edit/delete actions; moved division save/cancel below department controls; replaced the delete ligature with SVG. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css` | modified | Styled expansion panels and destructive actions and removed obsolete heading-input styling. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts` | modified | Added Material expansion support, removed custom collapse state and L2 edit controls, and preserved stored L2 values in update requests. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts` | modified | Covered default collapsed panels, header actions, edit action ordering, visible delete SVG, and L2 preservation. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.css` | modified | Styled company fields as one visual unit with retained section headings and separators. |

## Tests Added or Updated

- `company-master-page.spec.ts::renders the requested columns, company row and history action` — checks heading/action alignment and flex sizing of the page and table.
- `company-details-page.spec.ts::renders divisions as collapsed Material expansion panels by default` — checks collapsed state, panel actions, and the absence of redundant collapse/cancel controls.
- `company-details-page.spec.ts::edits division details in place and preserves the form when update fails` — verifies all L2 values remain in the update request.
- `company-details-page.spec.ts::places company and division edit actions after their details and renders the department icon` — checks preserved field headings, action ordering, omitted L2 controls, and an SVG delete icon.

## Local Verification

- Commands run: `npm --prefix 'D:\Spec-Driven-Development\Spec-Driven-Development\sdd-ui' test -- --watch=false` → 8 test files passed, 39 tests passed.
- Commands run: `npm --prefix 'D:\Spec-Driven-Development\Spec-Driven-Development\sdd-ui' run build` → production build succeeded with no component-style budget warning.
- Commands run: `git diff --check` → passed; Git reported only its existing LF-to-CRLF normalization notices for modified frontend files.
- Manual checks: At a 1920×1080 browser viewport with a successful mocked empty-list response, `document.documentElement.scrollHeight` and `clientHeight` were both 1080; the listing section measured 888px high and the paginator ended at the section bottom.
- Manual checks: The local development server was stopped after the browser verification.

## Deviations from Assessment

- User clarification established that delete styling applies to company, division, and department actions on the company-details screen, not to the listing page. No delete control was added to the listing.
- The previously unknown viewport was confirmed as 1080p; the viewport-fit behavior was verified at 1920×1080.
- Removed unused `.heading-input` rules from the details stylesheet after confirming the selector was absent from its template; this kept the compiled component stylesheet below the configured warning budget.

## Follow-ups

- Run `/speckit-bug-test slug=division-dept-bugs` if a separate downstream verification report is needed.
