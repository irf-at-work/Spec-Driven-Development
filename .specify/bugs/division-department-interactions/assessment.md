# Bug Assessment: Division editing and department workflow issues

- **Slug**: division-department-interactions
- **Created**: 2026-11-02
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

The report identifies five Company Details / Division Edit issues:

- The division Edit action remains visible while that division is already in edit mode.
- Removing a department assignment can replace/hide the division section with “A department must remain assigned to at least one division.”
- Division edit exposes fields not shown in the view state.
- Saving a new or existing department collapses all division expansion panels.
- The company details view has no provision to add a division. Department-add functionality already exists and is not part of this request.

The user clarified that division view mode should show every editable division field except L2 fields.

## Symptom

The division header always renders its Edit action, even for the division currently being edited. Failed department-removal requests set a shared structure error that takes precedence over and hides the entire list of divisions; successful add/link operations reload the divisions list, recreating expansion panels in their default collapsed state. The view state omits several division fields available in edit mode, and there is no division-creation control on the company details page.

## Reproduction

1. Open a company’s details page, expand a division, and select Edit; observe that the header still offers Edit for the active division.
2. In division edit mode, attempt to remove a department assignment that is its only assignment; the API rejects the operation with “A department must remain assigned to at least one division,” and the divisions list is hidden while the structure error is shown.
3. Add a new department or link an existing department from division edit mode; after the successful reload, observe that previously expanded division panels are collapsed.
4. Compare the division fields in edit mode with the division view details; edit currently includes commercial registration number, licence dates, fax, mobile, remarks, and active state that the view block does not show.
5. View a company’s details and inspect the division controls; there is no Add division action in this view.

## Suspected Code Paths

- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html:99-101` — The division section uses an `@else if` for `structureError`, so any structure error suppresses the subsequent empty-state / division-panel rendering.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html:109-127` — The panel header Edit button is rendered without checking whether `editingDivisionCode()` already matches the division.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html:132-222` — Edit mode contains a larger set of division attributes than the read-mode `.division-details` block.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html:290-298` — Department-add actions are shown only while editing an existing division; no Add division action is present in the company details view.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html` and `company-form.ts:590-632` — The company setup flow already provides division fields and calls the create-divisions API, which can inform reuse of a division-add flow.
- `Spec-Driven-Development/sdd-ui/src/app/api/generated/api/companyStructure.service.ts:563-573` — The generated client exposes the create-divisions endpoint for an existing company.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts:278-317,357-386` — New and existing department success handlers close the dialog and call `loadDivisions(companyCode)`, replacing the divisions array.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts:394-424,471-485` — Assignment removal failures populate the same `structureError` rendered at the top of the division section; a successful division load replaces its list.
- `Spec-Driven-Development/SDD.API/SDD.API/Services/CompanyStructureService.cs:320-348` — Removing the final company-scoped assignment is intentionally rejected with the reported conflict message.
- `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CompanyStructureController.cs:165-184` — The removal endpoint maps that invariant failure to a conflict response.
- `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/CompanyStructureEditTests.cs:84-117` — API tests establish that removing one of several assignments succeeds, while removing the final assignment is blocked.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts:224-280` — Existing UI tests exercise the new-department request and assignment-removal method, but do not assert error visibility, retained panel expansion, view-mode creation, or edit-button visibility.

## Root Cause Hypothesis

The issues arise from how the current page combines operation errors, panel lifecycle, and edit-only actions. The shared `structureError` is treated as an exclusive state instead of an alert alongside loaded division content; replacing the divisions array after create/link recreates panels and loses their expanded state. Header actions and read/edit field lists are not conditionally synchronized. The details page has no division-creation entry point, while division creation is available only in the company setup flow. The API’s final-assignment guard appears intentional and protects a company-wide data invariant; it explains the message but is not itself a defect. Confidence: high for these template/component causes.

## Proposed Remediation

**Preferred**: Keep structure errors visible as alerts while continuing to render the existing divisions, and preserve each panel’s expanded state when department operations reload division data. Hide or disable the active division’s Edit action during edit mode. Show every editable division field in read mode except L2 fields. Add a division-creation entry point to the company details view, reusing the established division fields and create-divisions endpoint.

Preserve the server-side rule that a department must remain assigned to at least one division. When that conflict occurs, keep the company’s division panels visible and make the failed removal understandable rather than replacing the section. Department creation already exists in the division edit flow and should remain unchanged.

**Files likely to change**:
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts`
- `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/CompanyStructureEditTests.cs` (only if API regression coverage needs adjustment; current invariant tests should remain)

**Tests to add or update**:
- Assert the active division’s header does not expose an Edit action while in edit mode.
- Assert removing a division’s final assignment keeps division panels visible alongside the conflict alert, and that removing one of multiple assignments still succeeds without losing unrelated assignments.
- Assert expanded/collapsed state is retained after creating a department and linking existing departments.
- Assert division view mode displays every editable field except L2 fields.
- Assert a user can open an Add division flow from company details, submit valid division details, and see the newly created division.
- Preserve existing coverage that department creation is available from division edit mode.

## Risks & Considerations

- The API intentionally blocks deletion of the last assignment. Changing that behavior could orphan departments or violate the company-structure invariant; prefer making the conflict non-destructive and visible.
- The Add division flow should follow the existing create-divisions API contract and required-field validation; no database or API schema change is indicated.
- Preserving panel state across reloads must handle division codes that are deleted or no longer returned without retaining stale state.
- View mode should include all editable non-L2 fields, as confirmed by the user; preserve the intentional L2 omission.

## Open Questions

- None. The user clarified that the missing company-details action is Add division, and that view mode should show all editable non-L2 division fields.
