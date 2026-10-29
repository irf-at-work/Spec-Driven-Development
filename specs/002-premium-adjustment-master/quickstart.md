# Premium Adjustment Master Quickstart

This guide describes how to validate the feature after implementation and after all implementation gates in `plan.md` are approved. It does not authorize package installation or database access/change.

## Prerequisites

- Owner approval for proposed package additions/updates, including the Oracle provider's license terms.
- UI dependencies aligned with Angular 21 and a compatible TypeScript version.
- An owner-approved Oracle 19c connection and schema. Confirm the adjustment-code table and four standard-list tables before scaffolding; do not run DDL or mutate shared data without explicit approval.
- .NET 10 SDK and a Node.js release supported by the selected Angular 21 patch.
- Connection credentials held in user-secrets or environment variables only; never put them in source or this guide.

## Build and Test

From the repository root, run the single implementation-provided test runner:

```powershell
.\Spec-Driven-Development\test-all.ps1
```

The runner must stop on errors and execute the API unit/integration tests, Angular tests, Playwright end-to-end tests, and production builds. Expected result: every command exits successfully. Test names and generated artifacts must not contain credentials.

Individual diagnostic commands, after project setup:

```powershell
dotnet test .\Spec-Driven-Development\SDD.API\SDD.API.slnx
Set-Location .\Spec-Driven-Development\sdd-ui
npm test -- --watch=false
npm run build
npx playwright test
```

Return to the repository root after running UI commands. Playwright browser installation and the API/UI local origins must be documented in the approved implementation setup.

## Manual Acceptance Walkthrough

Use only an owner-approved local test schema. Create test adjustment codes through the application UI; do not seed or alter database rows through a separate command unless explicitly approved.

1. Open the adjustment-code list. Verify at most 10 rows are displayed, the default order is Code Type description ascending then Code ascending, and page navigation is available.
2. Filter by Code Type. Verify only codes of that type appear across all pages.
3. Search for a Code Type, Code, Company Code, Name, or Short Name known to exist on another page. Verify the match appears; sort by each supported column and verify ordering applies across the full result set.
4. Open each dropdown. Confirm the UI loads all pages of active rows from its own standard list, ordered by description, and the three adjustment classifications are independent of Code Type. Verify each API page uses `PaginatedResult<T>` with no more than 10 items.
5. Open Add. Try a blank Code or Company Code and verify it is rejected; then use valid codes and required names. Verify case/spacing normalization, limits, and `admin` audit stamp.
6. Try an existing Code Type + Code + Company Code combination and verify the duplicate message and that no second record is created.
7. Enter optional English and Arabic details. Verify right-to-left Arabic rendering, exact preservation of Arabic characters and spacing, and 100/30/2000 character limits.
8. Open an adjustment code and verify read-only mode. Edit it and verify Code Type, Code, and Company Code remain immutable. Make an unsaved change, turn editing off, cancel discard, then repeat and confirm discard.
9. Edit a record saved earlier without Discount Type, Charges Type, or Charges Category. Verify all three must be chosen before the save succeeds.
10. Request deletion, cancel and verify the record remains. Request deletion again, confirm the irreversible warning, and verify the record is gone.
11. Confirm API validation rejects invalid requests independently of the browser and that error responses are ProblemDetails without stack traces.

## Expected Evidence

- API and UI test reports show all tests passing.
- The end-to-end suite covers list/filter/search/sort/page, create/validation/duplicate, view/edit/discard, missing-required-fields, and confirmed/cancelled deletion.
- No secret values appear in logs, test reports, or committed files.