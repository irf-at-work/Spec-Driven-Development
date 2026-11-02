# Vehicle Make Master Quickstart

This guide describes how to validate the feature after implementation and after all implementation gates in `plan.md` are approved. It does not authorize package installation or database access/change.

## Prerequisites

- Owner approval for any new package additions/updates, including acceptance of the Oracle provider's license terms. `Microsoft.EntityFrameworkCore.Relational` is explicitly referenced by the API test project at the same 10.0.14 version already used by the API runtime, so the test host loads a compatible provider assembly.
- The existing Angular 22 UI project (no downgrade; constitution v1.0.2) and its compatible TypeScript version.
- An owner-approved Oracle 19c connection and schema. The make/model keys, non-cascading model foreign key, defaults, audit behavior, and field lengths have been verified read-only; no DDL or database data was changed.
- Load active `STD_LIST_ITEM` fixtures for the nine supported vehicle list types through the approved Excel import page before dropdown-selection acceptance checks. The application does not seed the lists; the import is explicit, insert-only, and skips existing keys.
- The API test runner requires `SDD_TEST_ORACLE_CONNECTION` to contain the approved test-schema connection string, supplied through the local secure environment only. The runner creates and removes test rows with make codes beginning `ZT`; never put credentials in source control or this guide.
- .NET 10 SDK and a Node.js release supported by the installed Angular 22 patch.
- Connection credentials held in user-secrets or environment variables only; never put them in source or this guide.

**Known schema limitation**: Oracle stores the inspected text columns with byte semantics. The owner confirmed that Arabic limits remain 100/30/2000 characters. API validation enforces those counts and preserves Arabic input, but Oracle may reject values within the character limit if they exceed a column's byte limit. A schema resolution requires separate explicit approval; do not claim full persisted Arabic-length support until an approved change is implemented and verified.

## Build and Test

From the repository root, run the single implementation-provided test runner:

```powershell
.\Spec-Driven-Development\test-all.ps1
```

The runner must stop on errors and execute C# formatting and analyzer checks, Angular lint/format checks, API unit/integration tests, Angular tests, Playwright end-to-end tests, and production builds. Expected result: every command exits successfully once the approved lookup fixtures are loaded. Test names and generated artifacts must not contain credentials.

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

Return to the repository root after running UI commands. Playwright browser installation and the API/UI local origins must be documented in the approved implementation setup.

## Manual Acceptance Walkthrough

Use only an owner-approved local test schema. Create test makes and models through the application UI; do not seed or alter database rows through a separate command unless explicitly approved. The approved constitution C3 exception for unpaged lookup options is already recorded.

1. Open the vehicle-make list. Verify it defaults to 10 rows and offers page sizes 10, 25, and 50, the default order is Make Code ascending, and page navigation is available. Verify the breadcrumb is present and accessible.
2. Filter each text column using the available operators; verify a change takes effect 500 ms after typing stops, matches across pages, and combines with other filters. Sort by each supported column and verify ordering applies across the full result set.
3. Open Add. Try a blank Make Code and verify it is rejected; then use a valid code and required names. Verify case/spacing normalization, limits, and `admin` audit stamp.
4. Try an existing Make Code and verify the duplicate message and that no second record is created.
5. Enter optional English and Arabic details. Verify right-to-left Arabic rendering, exact preservation of Arabic characters and spacing, and API character-count validation. Persisted Arabic values at the maximum lengths remain gated on the approved schema resolution described above.
6. Open a make and verify editable fields are enabled immediately while Make Code remains immutable. Save a change. Make another unsaved change, leave the page and cancel discard, then repeat and confirm discard.
7. For a make with no models, request deletion, cancel and verify it remains. Request deletion again, confirm the irreversible warning, and verify it is gone. The C3 exception for the fixed, read-only model-options endpoint is recorded; approved lookup inserts use the separate import endpoint.
8. Open a make with no models and verify its model list is empty; add and edit models on their dedicated pages while make editing is enabled. Verify model codes are immutable after creation, unique within a make, and may be reused under another make. Try leaving an unsaved model form and verify the discard confirmation; verify model saves do not save or discard unsaved make changes.
9. Verify all nine optional model dropdowns show active English descriptions, save the selected codes, reject inactive or wrong-list codes from direct API requests, and allow an existing inactive selection to be kept unchanged on edit. These checks require the owner-provided list fixtures. Verify numeric limits and API field-length validation on model input.
10. Verify model and make Active flags can be switched on/off independently, inactive rows remain visible and openable, and a new make has no models section.
11. Download the vehicle dropdown Excel template, upload it with valid, duplicate, and invalid rows, and verify the preview blocks invalid rows and marks existing keys as skipped. Confirm an all-valid import, verify the inserted/skipped counts, and confirm new active choices appear in the model form dropdowns.
11. Try to permanently delete a make with models and verify a clear conflict says to delete the models first without removing any data. Delete the models, then confirm make deletion and verify it is gone.
12. Confirm API validation rejects invalid make/model requests independently of the browser and that error responses are ProblemDetails without stack traces.

## Expected Evidence

- After lookup fixtures are loaded and the approved Arabic storage resolution is implemented, API and UI test reports should show all acceptance tests passing; format and lint checks should pass. Until then, report fixture-dependent dropdown acceptance and persisted Arabic maximum-length support as blocked rather than treating empty lookup arrays as a complete acceptance pass.
- The end-to-end suite covers make list/filter/sort/page, make and model create/update validation and duplicates, open-in-edit and discard behavior, active-state changes, dedicated model-page lifecycle, breadcrumbs, dropdown selections, confirmed/cancelled deletions, and make-delete refusal with existing models.
- No secret values appear in logs, test reports, or committed files.

## Current Verification Checkpoint (30-Oct-2026)

- API test project: 86 passed against the approved Oracle test schema, including the 12 vehicle-model API tests.
- API formatting and analyzer verification: passed.
- Angular lint and Prettier checks: passed; Angular unit tests: 11 passed across 3 files.
- Angular production build: passed using an isolated validation output directory.
- The running API options endpoint returned HTTP 200 with all nine expected arrays, currently empty because the approved vehicle-model lookup fixtures are not loaded.
- The three model Playwright tests have been discovered but not executed; dropdown selections and preservation of an inactive current selection require those fixtures. The full single-command runner therefore has not been reported as passing.
- Oracle's byte-semantics limitation remains unresolved for persisted Arabic values at the specified maximum character lengths.
