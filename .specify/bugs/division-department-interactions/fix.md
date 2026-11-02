# Bug Fix: Division and department interactions

- **Slug**: division-department-interactions
- **Fixed**: 2026-11-02
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Updated the company details division workflow so structure errors no longer hide divisions, panel expansion survives department refreshes, and the active division’s Edit action is hidden. Division view mode now displays every editable non-L2 field, and company details includes a validated Add division flow using the existing API.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` | modified | Kept errors independent from division panels, added full non-L2 view details and Add division dialog, bound panel state, and hid Edit while editing. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts` | modified | Preserved expanded division codes on reload, added division creation form/API submission, and cleaned expansion state when a division is deleted. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css` | modified | Reused the existing details and dialog styling for the new controls. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts` | modified | Added regressions for field visibility, edit action visibility, add division, conflict display, and panel-state retention after department operations. |

## Tests Added or Updated

- `company-details-page.spec.ts` — verifies all editable non-L2 division fields appear in view mode.
- `company-details-page.spec.ts` — verifies the active division’s Edit action is hidden during editing.
- `company-details-page.spec.ts` — verifies Add division submits to the existing create-divisions endpoint and displays the created division.
- `company-details-page.spec.ts` — verifies a final-assignment conflict leaves division panels visible with the error alert.
- `company-details-page.spec.ts` — verifies expanded panels remain expanded after creating and linking departments.

## Local Verification

- Commands run: `npm --prefix 'D:\Spec-Driven-Development\Spec-Driven-Development\sdd-ui' test -- --watch=false` → 8 test files passed, 44 tests passed.
- Commands run: `npm --prefix 'D:\Spec-Driven-Development\Spec-Driven-Development\sdd-ui' run build` → passed with no build-budget warnings.
- Commands run: `npm exec -- prettier --check ...` for the four changed frontend files → passed.
- Commands run: `git diff --check` for the four changed frontend files → passed.
- Manual checks: regression tests cover the requested interaction and visibility behavior; the API’s last-assignment guard remains unchanged.

## Deviations from Assessment

None.

## Follow-ups

- Run `/speckit-bug-test slug=division-department-interactions` for the dedicated bug verification report.
