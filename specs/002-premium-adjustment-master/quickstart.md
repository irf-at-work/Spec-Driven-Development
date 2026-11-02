# Premium Adjustment Master Quickstart

This guide describes how to validate the feature after implementation and after all implementation gates in `plan.md` are approved. It does not authorise package installation or database access/change.

## Prerequisites

- No new package is needed. Feature 001 already installed everything this feature uses (Angular Material, SweetAlert2, the Inter and Noto Sans Arabic fonts, the icon font, XUnit, Playwright).
- The existing Angular 22 UI project and its compatible TypeScript version (constitution v1.0.2).
- The owner-approved Oracle 19c read-only inspection identified `IIRIS_RD_DEVP.BRM_MISC_CODES`; its verified schema is recorded in `data-model.md`. The three-column primary key is `(MC_CODE, MC_COMP_CODE, MC_TYPE)`; all its `VARCHAR2` columns use BYTE semantics; there are no defaults or triggers, and `MC_ACTIVE_YN` is nullable. Do not run DDL or mutate shared data without separate explicit approval.
- The owner-confirmed `STD_LIST_ITEM` mappings are Code Type=`CALC_TYPE`, Discount Type=`DISCOUNT_TYPE`, Charges Type=`CHARGE_TYPE`, and Charges Category=`CHARGE_CAT`. A read-only development smoke check returned 4, 2, 3 and 2 active rows respectively; another schema may differ. The application does not seed or modify these lists.
- The API test runner requires `SDD_TEST_ORACLE_CONNECTION` to contain the approved test-schema connection string, supplied through the local secure environment only. Tests create and remove their own rows with codes beginning `ZT`; never put credentials in source control or this guide.
- .NET 10 SDK and a Node.js release supported by the installed Angular 22 patch.
- Connection credentials held in user-secrets or environment variables only; never put them in source or this guide.

**Known schema limitation**: `BRM_MISC_CODES` VARCHAR2 columns use BYTE semantics. API validation can enforce character counts and preserve Arabic input, but the database may not persist Arabic values at their maximum character limits. An owner-approved schema resolution is required before claiming that full persistence is supported; inspection alone does not authorize DDL.

## Build and Test

From the repository root, run the single implementation-provided test runner:

```powershell
.\Spec-Driven-Development\test-all.ps1
```

The runner stops on errors and covers C# formatting and analyser checks, Angular lint/format checks, API unit/integration tests, Angular tests, Playwright end-to-end tests, and production builds. It requires `SDD_TEST_ORACLE_CONNECTION` before starting; without the approved test-schema connection it stops at that prerequisite and does not run. Test names and generated artefacts must not contain credentials.

Individual diagnostic commands, after project setup:

```powershell
dotnet format whitespace .\Spec-Driven-Development\SDD.API\SDD.API.slnx --verify-no-changes
dotnet format analyzers .\Spec-Driven-Development\SDD.API\SDD.API.slnx --verify-no-changes
dotnet test --project .\Spec-Driven-Development\SDD.API\SDD.API.Tests\SDD.API.Tests.csproj
Set-Location .\Spec-Driven-Development\sdd-ui
npm run lint
npm run format:check
npm test -- --watch=false
npm run build
npx playwright test
```

Return to the repository root after running UI commands. After the API's list or filter parameters change, regenerate the Angular client from the running API with NSwag before building the UI.

## Manual Acceptance Walkthrough

Use only an owner-approved local test schema. Create test adjustment codes through the application UI; do not seed or alter database rows through a separate command unless explicitly approved. The unpaged options endpoint is covered by the constitution C3 exception recorded on 02-Nov-2026.

1. Open the adjustment-code list. Verify at most 10 rows are displayed, the default order is Code Type description ascending then Code ascending, page navigation is available, there is no global search box, and every data column (Code Type, Code, Company Code, Name, Short Name, Status) has its own filter. Verify the breadcrumb trail, the icon actions with tooltips, and the larger Inter text.
2. Filter each text column with each operator (starts with, ends with, contains, equal to, not equal to), including upper and lower case and a character such as `%` or `_`. Verify matches are found on other pages, several filters must all match, a blank filter is ignored, "not equal to" also lists records with an empty value, changing a filter returns to page 1, and clearing the filter brings the full list back.
3. Filter Status by Active and Inactive, with equal to and not equal to. Sort by each supported column and verify ordering ignores case and applies across the full result set without repeating or losing a row between pages.
4. Open each dropdown. Confirm the four options come from one request, each shows the active items of its own standard list ordered by description, and the three classifications are independent of Code Type.
5. Open Add. Verify Active is on by default. Try a blank Code or Company Code and verify it is rejected; then use valid codes and required names. Verify case/spacing normalisation, limits, and the `admin` audit stamp. Turn Active off before saving and verify the saved code shows as inactive in the list.
6. Try an existing Code Type + Code + Company Code combination and verify the duplicate message and that no second record is created.
7. Enter optional English and Arabic details. Verify right-to-left Arabic rendering, exact preservation of Arabic characters and spacing, and 100/30/2000 character limits. Persisted Arabic values at the maximum lengths remain gated on the byte-versus-character limitation above.
8. Open an adjustment code and verify read-only mode, including a read-only Active status. Edit it and verify Code Type, Code, and Company Code remain immutable. Make an unsaved change, turn editing off, cancel discard, then repeat and confirm discard.
9. While a form has unsaved changes, use Back, a breadcrumb link and the browser's back button, and verify each asks before discarding.
10. Edit a record saved earlier without Discount Type, Charges Type, or Charges Category. Verify all three must be chosen before the save succeeds.
11. Turn Active off for a code and save, then turn it on again and save. Verify the inactive code stays in the list and stays openable, and is restored when turned back on.
12. Request permanent deletion, cancel and verify the record remains. Request deletion again, confirm the irreversible warning, and verify the record is gone.
13. Confirm API validation rejects invalid requests (including a classification code that is not an active item of the right list) independently of the browser, and that error responses are ProblemDetails without stack traces.

## Validation Record

Validation on 02-Nov-2026:

- 25 Angular unit tests passed; the Angular production build and lint passed.
- All 11 Playwright tests in `tests/premium-adjustment-e2e` passed, covering list/filter/sort/page, create/validation/duplicate, view/edit/discard, active-state changes, confirmed/cancelled deletion, and unsaved-change prompts.
- 24 focused API query/input-rule unit tests passed. C# whitespace and analyzer checks passed.
- `npm run format:check` still reports formatting warnings in 12 existing feature-001/shared files; the changed breadcrumb test was formatted and the premium-adjustment feature files were checked separately.
- Read-only development API smoke checks returned the options counts above and a valid empty list page (`page=1`, `pageSize=10`). No write endpoint or database mutation was used.
- The complete `test-all.ps1` run was attempted but stopped at its required-connection check because `SDD_TEST_ORACLE_CONNECTION` is unavailable. Oracle-backed API CRUD tests and the manual create/edit/delete walkthrough against the approved test schema therefore remain unverified.
- Persisted Arabic values at their maximum character lengths remain blocked by the verified BYTE-semantics limitation. Do not present this as passed.
- No secret values appear in logs, test reports, or committed files.

The end-to-end suite uses mocked API responses; it does not replace Oracle-backed CRUD acceptance. Until an approved test-schema connection is supplied, report those database-dependent checks as blocked rather than passed.
