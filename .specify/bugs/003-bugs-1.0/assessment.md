# Bug Assessment: Company listing and form usability

- **Slug**: 003-bugs-1.0
- **Created**: 2026-11-02
- **Source**: pasted text
- **Verdict**: likely valid, needs reproduction
- **Severity**: medium

## Report (verbatim or summarized)

> BUGS FOUND:
> listing screen:
> - the filter and its operator for each column are taking too much space, change the operator to just an icon(with no fill) and if operator is selected, then it should be same icon with fill color
> - remove the "xyz operator" text above operators
> - actions column is too wide, just make it as wide as the icon it contains.
> others:
> - remove the history icon in company details view page
> - make the phone number field accept only numbers and no letters in company add and edit page

## Symptom

The company listing uses a wide text-based operator selector with a redundant label in each filter, and the Actions column has no explicit compact width. The company details view shows a history icon, while phone fields use text inputs that can accept letters during entry even though form validation may reject them on save.

## Reproduction

1. Open the Company Master listing and inspect the filter row and Actions column.
2. Open a company details page in view mode and inspect the details actions.
3. Open the company add or edit form and type letters into the Phone field.

The precise rendered column widths and the desired mapping from operators to icons have not been confirmed. [NEEDS CLARIFICATION: Which icon or icon family should represent each operator?]

## Suspected Code Paths

- `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.html` — renders the visible “{{ label() }} operator” text and native select with full operator labels.
- `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.css` — assigns the filter and operator columns minimum widths of 9rem and 8rem, and the control a 20rem minimum width.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html` — defines the Actions column and renders its icon button without a dedicated compact width.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css` — fixes the table layout and sets a 20rem minimum width on filter-row header cells; these constraints contribute to the listing’s width.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` — renders the history icon button in view mode; the separate Audit history section is distinct from this icon.
- `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.html` — renders the shared Phone input used by add/edit and details editing; it sets a numeric input hint, but leaves the input as a text field.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts` — add/edit form validates phone length and a 10-digit pattern, but those validators do not prevent letters from being typed.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts` — details editing has phone validators, including an exception for an unchanged existing phone value.
- `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.spec.ts` — existing tests cover operator selection and emitted values.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts` — existing tests verify phone validation, but not restricting entry to digits.

## Root Cause Hypothesis

The operator UI is implemented as a labeled native select with verbose option text and fixed minimum widths; there is no explicit compact width for the Actions column. The details template includes a history action in view mode. Phone validation is implemented at the form-control level, while the shared input only provides `inputmode="numeric"`, which is a keyboard hint and does not restrict typed or pasted characters. Confidence: high for the label, selector, history icon, and input behavior; medium for the reported visual widths, which should be confirmed in the rendered page.

## Proposed Remediation

**Preferred**: Replace the full-width operator select with a compact, accessible icon-based operator control that distinguishes its selected state through the icon color/fill, and remove the redundant operator text. Keep each operator identifiable to assistive technology (for example, through an accessible name and selected-state semantics). Set an explicit compact width for the Actions column that accommodates its icon button, and adjust related table/filter minimum-width rules only as needed to avoid overflow. Remove the history icon button from details view mode without removing the separate Audit history section.

Enforce digit-only Phone entry in the shared field for all add/edit surfaces, including pasted input; preserve the existing optional/length/validation behavior and ensure the details edit path handles any legacy value consistently. Keep form validation as a defense in depth rather than relying on `inputmode` alone.

**Files likely to change**:
- `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.html`
- `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.ts`
- `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.html`
- Relevant filter, listing, company-fields, add/edit, and details tests

**Tests to add or update**:
- Verify operator controls remain keyboard and screen-reader accessible, expose the selected operator, and display the selected/unselected icon states while retaining the existing query behavior.
- Verify filter-row and Actions column sizing in the listing, including that the Actions column is constrained to its icon control.
- Verify the history icon is absent from details view while the Audit history content remains present.
- Verify letters are rejected or removed during typing and paste in Phone fields on add and edit surfaces, while digits, optional blank values, length constraints, and existing validation behavior remain covered.

## Risks & Considerations

- Icon-only operator controls can reduce discoverability or accessibility if operator names and selected state are not exposed to assistive technology and keyboard users.
- Restricting input must cover paste as well as typing. Avoid silently normalizing or invalidating an unchanged legacy phone value in the details editor without an intentional compatibility decision.
- Tighter column widths should be verified at supported viewport sizes to avoid clipping the action button or filter controls.
- No API or database change appears necessary; the phone remains a string and current form validation already applies format constraints.

## Open Questions

- [NEEDS CLARIFICATION: Which icon or icon family should represent each filter operator?]
- [NEEDS CLARIFICATION: Should a pre-existing non-digit phone value remain editable/savable unchanged, or should the edit flow require it to be corrected?]
