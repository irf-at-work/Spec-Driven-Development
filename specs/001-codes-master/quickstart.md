# Codes Master Quickstart and Validation

**Feature**: [spec.md](spec.md)  
**API contract**: [contracts/codes-master.openapi.yaml](contracts/codes-master.openapi.yaml)  
**Data rules**: [data-model.md](data-model.md)

## Prerequisites

1. .NET 10 SDK and the approved Node/npm versions are installed.
2. The Oracle `ConnectionStrings:CodesMasterOracle` value is configured in .NET User Secrets for the API project. Never put credentials in this guide, source control, or command history.
3. The Oracle endpoint is reachable from the API host. The application uses the existing `IIRIS_RD_DEVP.STD_CODES` table; no schema changes or migrations are required.
4. Do not seed, insert, update, or delete shared database data for validation without explicit authorization.

## Automated checks

From the repository root:

```powershell
dotnet test .\Spec-Driven-Development\SDD.API\SDD.API.slnx
```

From the UI project directory:

```powershell
Set-Location .\Spec-Driven-Development\sdd-ui
npm test -- --watch=false
npm run build
npm run test:e2e -- --reporter=list
```

The Playwright tests mock API responses and do not write to Oracle.

To regenerate the typed Angular client from the feature contract:

```powershell
npm run generate:api
```

Do not hand-edit files under `src/app/api/generated/`.

## Run locally

In one terminal, run the API using the checked-in Development launch profile:

```powershell
Set-Location .\Spec-Driven-Development\SDD.API\SDD.API
dotnet run --launch-profile http
```

The profile sets `ASPNETCORE_ENVIRONMENT=Development`, where the API loads the configured User Secrets value. The local API listens on `http://localhost:5114`.

In another terminal:

```powershell
Set-Location .\Spec-Driven-Development\sdd-ui
npm start
```

The Angular development proxy forwards `/api` requests to the local API at `http://localhost:5114`.

## Verified results

Validation completed on 2026-10-30:

- API test project: 30 passed, 0 failed.
- Angular unit tests: 2 passed, 0 failed.
- Angular production build: succeeded.
- Codes Master Playwright acceptance suite: 27 passed, 0 failed, including sorting in both directions, page sizes 10/15/20/50, icon actions, audit hover, SweetAlert delete confirmation/cancellation, aligned listing filters, responsive Add-page layout, and combined filters.
- Read-only requests against the configured Oracle connection exercised all six filter operators, case-insensitive equality, an AND-combined filter, and filtered pagination; all 8 semantic checks passed. Record values and connection details were not printed.
- No inserts, updates, deletes, DDL, or migrations were run.

Oracle-backed create, update, and delete requests were not exercised because no authorized test data was provided. The browser tests for those flows use mocked API responses.

NuGet restore currently reports moderate and high advisories for the transitive `System.Security.Cryptography.Pkcs` 8.0.1 dependency. No unapproved package override was applied; see [research.md](research.md).

## Manual end-to-end scenarios

1. Open Master > Codes Master. Verify the default page contains at most 10 records, the specified columns/actions, and distinct loading, empty, and error states. Choose page sizes 10, 15, 20, and 50 and verify the selected size is requested.
2. Verify each data-column heading has its filter input and funnel icon directly below the heading, aligned across the columns. Open each filter and confirm the full operator list, including Starts With and Ends With, is visible above the table and is not clipped by the horizontally scrollable listing. Apply a filter whose matching records span multiple pages, and confirm the displayed rows and paginator count include all matching records. Combine filters on two columns and confirm a row is shown only when it matches both. Verify matching ignores case, `No Filter` clears only its column, and `Clear all filters` removes every active filter.
3. Open a row's audit control using hover, keyboard focus, and pointer activation. Verify the actual stored creation values, clear `Not recorded` values for NULLs, and `DD-MMM-YYYY` formatting. The stored Oracle `DATE` calendar value is displayed unchanged; the UI does not apply a timezone conversion.
4. Sort each data column ascending and descending. Verify sorting is applied to the full filtered result before pagination and a sort change returns to page 1. Actions is not sortable.
5. Open Add. Verify the light page background and distinct form card, an evenly aligned two-column field grid on desktop, and a single-column grid without horizontal overflow on mobile. Verify the exact field labels/order, required Code, Code Type, and Code Description, the top-right Add navigation control opens the Add page and does not submit the form, Back beside Add, centered Save/Cancel actions, and More hidden by default. Type a Code Description and verify Short Description copies up to its first 30 characters unless manually edited. Verify Active Y/N is a toggle on by default and maps to `Y`/`N`; verify all Arabic fields are right-aligned and right-to-left. Expand/collapse More and verify values remain. Enter values and click Cancel; verify fields reset, Active Y/N returns to on, and the page remains on Add.
6. On the listing, verify column headings and filter controls align and columns retain consistent proportions. Apply one column filter, enter a draft value in another column, and open its operator menu; verify the draft value remains available.
7. In an approved test-data environment, save a new record. Verify a SweetAlert success dialog, Company Code equals Code, `CC_CR_BY` equals `ADMIN`, Oracle generated `CC_CR_DT`, and update audit fields are NULL.
8. Attempt a duplicate Code+Type. Verify a clear duplicate error and unchanged existing row. Verify the same Code with another Type is not rejected solely because Code matches.
9. Edit a record by both key values. Verify a SweetAlert success dialog, keys cannot change, creation audit values are preserved, and update audit fields remain NULL.
10. Cancel a Delete confirmation and verify the row remains. Confirm deletion only for a separately approved test row; verify a SweetAlert success dialog and that only that composite-key record is removed.
11. Verify missing-record, database, byte-length, and constraint failures are safe and never reported as success.
