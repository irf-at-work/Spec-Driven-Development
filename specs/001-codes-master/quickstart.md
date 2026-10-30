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

Validation completed on 2026-10-29:

- API solution tests: 22 passed, 0 failed.
- Angular unit tests: 2 passed, 0 failed.
- Angular production build: succeeded.
- Playwright acceptance tests: 17 passed, 0 failed.
- A read-only `GET /api/codes?page=1&pageSize=10` through the Angular development proxy to the API's configured Oracle connection returned HTTP 200 with a ten-record page. Record values and connection details were not printed.
- No inserts, updates, deletes, DDL, or migrations were run.

Oracle-backed create, update, and delete requests were not exercised because no authorized test data was provided. The browser tests for those flows use mocked API responses.

NuGet restore currently reports moderate and high advisories for the transitive `System.Security.Cryptography.Pkcs` 8.0.1 dependency. No unapproved package override was applied; see [research.md](research.md).

## Manual end-to-end scenarios

1. Open Master > Codes Master. Verify the default page contains at most 10 records, the specified columns/actions, and distinct loading, empty, and error states.
2. Open a row's audit control using hover, keyboard focus, and pointer activation. Verify the actual stored creation values, clear `Not recorded` values for NULLs, and `DD-MMM-YYYY` formatting. The stored Oracle `DATE` calendar value is displayed unchanged; the UI does not apply a timezone conversion.
3. Open Add. Verify the exact field labels/order, required Code and Code Type, byte-limit feedback, and More hidden by default. Expand/collapse More and verify values remain.
4. In an approved test-data environment, save a new record. Verify Company Code equals Code, `CC_CR_BY` equals `ADMIN`, Oracle generated `CC_CR_DT`, and update audit fields are NULL.
5. Attempt a duplicate Code+Type. Verify a clear duplicate error and unchanged existing row. Verify the same Code with another Type is not rejected solely because Code matches.
6. Edit a record by both key values. Verify keys cannot change, creation audit values are preserved, and update audit fields remain NULL.
7. Cancel a Delete confirmation and verify the row remains. Confirm deletion only for a separately approved test row and verify only that composite-key record is removed.
8. Verify missing-record, database, byte-length, and constraint failures are safe and never reported as success.
