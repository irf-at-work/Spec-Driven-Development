# Bug Fix: Company listing and form usability

- **Slug**: 003-bugs-1.0
- **Fixed**: 2026-11-02
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Reduced listing filter/operator width with an accessible icon-based operator control, constrained the Actions column, removed the details-view history icon, and sanitized Phone entry to digits. Follow-up refinements require an explicit operator before filtering, align the filter controls, fill the icon for selected `Contains`, and keep the Actions label and left divider on the sticky column.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.html` | modified | Added an unselected operator placeholder; the icon fills for every selected operator, including `Contains`. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.ts` | modified | Allows an unselected operator and validates select changes before emitting them. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.css` | modified | Reduced filter width and vertically aligns input, operator icon, and clear button. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html` | modified | Displays the Actions header text. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css` | modified | Constrains the sticky Actions column while allowing its label and icon; adds a left border and shadow to the sticky action columns. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.ts` | modified | Holds text locally until an operator is selected and serializes explicit operators, including `Contains`. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` | modified | Removed the history icon button without removing Audit history. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts` | modified | Removed the no-longer-used tooltip module and history-label helper. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.html` | modified | Attached digit filtering to Phone input events for the shared add/edit field. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.ts` | modified | Sanitizes typed and pasted Phone input to at most 10 digits and retains the cursor position. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.spec.ts` | modified | Covers unselected/selected operator states, filled `Contains`, and horizontal alignment. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts` | modified | Covers unapplied text until operator selection, ignored unpaired URL filters, Actions label, and sticky border styling. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-delete.spec.ts` | modified | Verifies the details history icon is absent while Audit history remains. |
| `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.spec.ts` | modified | Covers digit sanitization and preservation of an untouched legacy phone value. |

## Diff Highlights

- Text entered before an operator is selected remains local to the filter control and does not trigger a request. Selecting an operator applies the pending text; the operator remains available in query state, including explicit `Contains`.
- The operator icon is outlined before selection and filled for any selected operator. The overlaid native select continues to expose operator names and keyboard selection.
- The filter input, icon, and clear button share a centered grid row. The visible Actions heading and its left border/shadow are styled on the sticky column cells.
- Phone input now removes non-digits on input events, including paste events; unchanged pre-existing values are not rewritten until the field is edited.

## Tests Added or Updated

- `filter-control.spec.ts` — verifies the unselected placeholder, selected icon fill including `Contains`, removal of visible operator text, and aligned controls.
- `company-master-page.spec.ts` — verifies a filter is not sent until an operator is selected, an unpaired URL filter is ignored, and the Actions header and sticky border are present.
- `company-delete.spec.ts` — verifies removal of the details history icon and retention of the Audit history section.
- `company-fields.spec.ts` — verifies non-digit input is removed and a prefilled legacy value stays untouched until input changes.

## Local Verification

- Commands run: `npm test -- --watch=false` → 7 test files passed, 28 tests passed.
- Commands run: `npm run build` → production build succeeded.
- Commands run: `npx prettier --check <changed UI files>` → passed.
- Commands run: `git diff --check` → passed with no whitespace errors.
- Manual checks: Confirmed extension configuration contains no `before_bug_fix` or `after_bug_fix` hooks.

## Deviations from Assessment

The follow-up explicitly requires an operator choice, so operator selection is now nullable instead of treating `Contains` as implicitly selected. The query now includes the `Contains` operator when chosen, and legacy filter query strings without an operator are ignored. The original open questions remain resolved: one icon represents all operators, and unchanged legacy phone values remain accepted until edited.

## Follow-ups

- Run `/speckit-bug-test slug=003-bugs-1.0` for the bug-test workflow.
