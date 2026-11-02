# Bug Assessment: Department and division deletion behavior

- **Slug**: division-delete-workflow
- **Created**: 2026-11-02
- **Source**: pasted text
- **Verdict**: likely valid, needs reproduction
- **Severity**: medium

## Report (verbatim or summarized)

The user reports that clicking the delete action does not delete a single department and requests that a division be deletable even when it contains multiple departments, without deleting those departments.

## Symptom

The department-row action removes an assignment, but the API rejects removal when it is the department's final assignment, leaving the row in place. Division deletion also returns a conflict while any department assignment remains, so a division with departments cannot currently be deleted through this flow.

## Reproduction

1. Open a company’s details, enter division edit mode, and click the remove action for a department that has no assignment to another division; the service rejects the request.
2. Click Delete on a division that has department rows; the service rejects the request.
3. [NEEDS CLARIFICATION: It is not clear whether deleting a department should remove it from this division only or delete that department code from every division.]
4. [NEEDS CLARIFICATION: It is not clear how departments should be retained when their division is deleted. Department rows are keyed by company, division, and department code, so keeping a department requires assigning it to another division or changing the data model.]

## Suspected Code Paths

- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` — department action invokes `removeDepartmentAssignment`; division action invokes `deleteDivision`.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts:527-568` — successful department removal filters the row from the division; errors are surfaced in the structure alert.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts:571-604` — division deletion calls the API and filters the division only on success.
- `Spec-Driven-Development/SDD.API/SDD.API/Services/CompanyStructureService.cs:320-350` — department assignment removal explicitly blocks removal of the final assignment.
- `Spec-Driven-Development/SDD.API/SDD.API/Services/CompanyStructureService.cs:294-318` — division deletion explicitly conflicts when department assignments remain.
- `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CompanyStructureController.cs:165-184` — department endpoint exposes assignment removal and maps the invariant violation to a conflict.
- `Spec-Driven-Development/SDD.API/SDD.API/Data/BrokerDataContext.cs:173-177` — department primary key includes company code, division code, and department code.
- `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/CompanyStructureEditTests.cs:34-48,84-117` — current API tests pin down blocking division deletion with assignments, successful unlink when another assignment exists, and rejection of the final assignment.

## Root Cause Hypothesis

The UI action is an assignment-removal operation rather than a global department-delete operation, and its final-assignment guard intentionally refuses to remove the only persisted department row. Division deletion similarly refuses to remove any division while department rows point to it. The reported outcomes are therefore consistent with current API behavior, but the desired replacement semantics are underspecified; preserving departments through division deletion requires deciding how to retain or move their division-keyed rows. Confidence: high in the code-path explanation; medium that the requested behavior can be implemented without a data-model decision.

## Proposed Remediation

**Preferred**: After confirming the intended department deletion scope and how departments should survive division deletion, implement the smallest safe API/UI workflow matching those semantics. Add a separate delete-department endpoint if deletion means removing a department globally, or retain an assignment-removal action if deletion is only per division. For division deletion, preserve all department records by explicitly moving assignments to a selected destination division or by adopting an independently persisted department model; do not silently cascade-delete department records or leave them orphaned.

Keep the existing behavior until those choices are clarified. The current final-assignment and assigned-department tests protect against accidental data loss and should only be changed to match an explicit user decision.

**Files likely to change**:
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts`
- `Spec-Driven-Development/SDD.API/SDD.API/Services/CompanyStructureService.cs`
- `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CompanyStructureController.cs`
- `Spec-Driven-Development/SDD.API/SDD.API/Services/ICompanyStructureRepository.cs`
- `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/CompanyStructureEditTests.cs`

**Tests to add or update**:
- Verify department deletion follows the confirmed scope and leaves other department assignments intact when required.
- Verify division deletion retains every department according to the confirmed destination/persistence rule.
- Verify errors and successful delete actions update the company details UI consistently.
- Update the existing invariant tests only as required by the clarified behavior.

## Risks & Considerations

- Removing a department from its final division currently removes its only row of department data; treating that as a delete-all operation could erase that code from every division.
- A department row's composite key includes its division, so a department cannot remain persisted without a division assignment under the current model.
- Automatically moving departments during division deletion requires a destination choice and can change organizational ownership.
- Do not add a cascade that deletes department rows when deleting a division; that would contradict the request to retain departments.

## Open Questions

- [NEEDS CLARIFICATION: When deleting a department row in division edit mode, should the department be deleted company-wide, or should it only be unassigned from the current division?]
- [NEEDS CLARIFICATION: When deleting a division that has departments, which remaining division should receive those departments? If there is no suitable destination, should division deletion be blocked or should the data model be changed to store departments independently?]
