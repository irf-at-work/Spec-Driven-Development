# Bug Fix: Department and division deletion

- **Slug**: division-delete-workflow
- **Fixed**: 2026-11-02
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Department assignment removal now succeeds even for a department's final division assignment, which removes that last department row instead of leaving it undeletable. Deleting a division that has departments now requires selecting another existing division, transfers the rows there without duplicating existing assignments, then deletes the source division.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `Spec-Driven-Development/SDD.API/SDD.API/Services/CompanyStructureService.cs` | modified | Removed the final-assignment block and reworked division deletion to transfer department rows to a validated destination, deduplicating departments already assigned there. |
| `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CompanyStructureController.cs` | modified | Added the optional `destinationDivisionCode` query parameter to division deletion. |
| `Spec-Driven-Development/SDD.API/SDD.API/openapi.json` | modified | Documented the division-delete destination query parameter. |
| `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/CompanyStructureEditTests.cs` | modified | Covered final assignment removal, department transfer, duplicate destination rows, and blocking deletion without a valid destination. |
| `Spec-Driven-Development/sdd-ui/src/app/api/generated/api/companyStructure.service.ts` | modified | Added optional destination query support to the generated client method. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts` | modified | Added destination selection and department-preserving deletion behavior; updated local division state on success. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` | modified | Added a destination-division dialog for divisions containing departments. |
| `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts` | modified | Added UI regressions for final department removal, division deletion with transfer, and no available destination. |

## Tests Added or Updated

- `CompanyStructureEditTests.Deletes_division_and_moves_departments_to_the_selected_division` — department rows survive division deletion in the selected destination.
- `CompanyStructureEditTests.Division_deletion_keeps_departments_already_assigned_to_the_destination` — transfer does not create duplicate assignments.
- `CompanyStructureEditTests.Division_deletion_requires_an_existing_destination_when_departments_remain` — missing destination leaves division and department rows unchanged.
- `CompanyStructureEditTests.Removes_the_final_department_assignment` — removal of a final assignment removes its last stored row.
- `company-details-page.spec.ts` — covers final-assignment removal and destination-based division deletion in the details UI.

## Local Verification

- Commands run: `dotnet test 'D:\Spec-Driven-Development\Spec-Driven-Development\SDD.API\SDD.API.Tests\SDD.API.Tests.csproj' --no-restore --verbosity minimal -p:BaseOutputPath=... -p:UseAppHost=false` → 48 passed, 0 failed; existing NuGet vulnerability warnings were reported.
- Commands run: `npm --prefix 'D:\Spec-Driven-Development\Spec-Driven-Development\sdd-ui' test -- --watch=false` → 8 files passed, 46 tests passed.
- Commands run: `npm --prefix 'D:\Spec-Driven-Development\Spec-Driven-Development\sdd-ui' run build` → passed.
- Commands run: Prettier check for the changed frontend component/template/spec → passed.
- Commands run: OpenAPI JSON parsing and `git diff --check` for changed files → passed.
- Manual checks: Reviewed the generated-client query serialization and the UI state update that retains transferred departments after success.

## Deviations from Assessment

- The clarification prompt could not be answered. To avoid data loss, the department action remains scoped to the current division (removing its final assignment deletes the last stored row), and division deletion requires the user to select another existing division to receive department rows. If no destination exists, deletion is blocked with an explanatory error.
- OpenAPI client generation was attempted but could not run because the installed Java 8 runtime is incompatible with the generator version. The OpenAPI document and the generated client method were updated narrowly by hand; the frontend build and tests verify the resulting TypeScript.

## Follow-ups

- Run `/speckit-bug-test slug=division-delete-workflow` for the dedicated bug verification report.
