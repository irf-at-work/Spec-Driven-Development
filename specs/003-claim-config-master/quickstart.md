# CCM Quickstart and Validation Guide

## Current implementation status

The current delivery includes CCM list/detail browsing and create/edit forms. The UI supports paging, per-column filters, sorting, status display, seven setting lookup lists, audit-field display, and an explicit Save gate. The API create/update routes return 503 and the UI disables Save until the owner enables writes. Product associations remain unresolved.

The owner directed that T003 be skipped and that no tests or database connections be performed by the implementation agent. The supplied screenshots confirm the composite primary key `(CCM_COMP_CODE, CCM_CODE)`. Later owner-pasted metadata confirms a valid unique index on the single `CCM_CODE` column, so T004 is passed. The attempted `CREATE INDEX` failed with ORA-00955 because that index name already exists; do not rerun its DDL. The product source and full choice review remain unresolved.

No tests were run and no database connection was attempted while implementing this increment.

## Future local validation prerequisites

The following steps are for a later owner-approved validation session. Use an approved local Oracle schema and non-production records only.

## Prerequisites

- .NET 10 SDK and the repository's pinned Node/npm versions.
- Oracle 19c connectivity configured through the existing safe settings mechanism (user-secrets or environment variables; never commit credentials).
- Before running CCM create flows, set the fixed Company Code configuration to `ASRTEST` while login/session support is out of scope.
- Before testing dropdowns, the owner-supplied recovery-deduction rows must be inserted with [ccm-recovery-deduction-insert.sql](ccm-recovery-deduction-insert.sql); the authoritative product-choice source remains to be reviewed.
- Before running write scenarios, apply the owner-approved unique index script and verify it reports a valid unique index on the single `CCM_CODE` column.

## Enable CCM writes after confirming the existing index

The owner-pasted metadata already confirms `UNIQUENESS = UNIQUE`, `STATUS = VALID`, and exactly one indexed column named `CCM_CODE`. Do not rerun the create-index statement in [ccm-global-unique-index.sql](ccm-global-unique-index.sql). The earlier “no rows selected” duplicate report does not show whether the table is empty; it only shows no duplicate CCM codes.

Then, from the API project directory, enable writes in that project's user-secrets store and restart the API:

```powershell
dotnet user-secrets set "ClaimConfiguration:WritesEnabled" "true"
dotnet run
```

`WritesEnabled` defaults to `false`. The unique index has been verified in the owner-pasted output; enable the setting only when ready to use the create/edit pages. The Company Code remains configured separately as `ClaimConfiguration:CompanyCode` (currently `ASRTEST`).

## Start the application

From the repository root, start the API:

```powershell
dotnet run --project Spec-Driven-Development/SDD.API/SDD.API/SDD.API.csproj
```

In a second terminal, start the Angular UI:

```powershell
Set-Location Spec-Driven-Development/sdd-ui
npm start
```

Open the local URL reported by Angular (normally `http://localhost:4200/`).

## Validate the read-only CCM list

Before enabling writes, open Claim Configuration Master and inspect the Add and view/edit pages; Save and Delete should be disabled. After the index is applied and verified and `WritesEnabled` is set, create a CCM with a unique code, then edit it. Confirm Company Code stays hidden and is supplied from configuration, key fields are immutable, audit values are populated, English names are uppercase, Arabic values retain their exact text and RTL display, Print Before Approval Yn and RePrint Allowed default unchecked (N), accounting flags default to Y, and unchanged inactive choices remain selected. Delete must be confirmed and blocked while product links exist. Recovery-deduction choices stay unavailable until their source is reviewed.

## Automated validation commands (later session)

These commands are recorded for a future owner-approved validation session. They were not run in this implementation session. Do not run database-backed checks until the prerequisites above are resolved.

Run the repository's existing checks after implementation:

```powershell
dotnet test Spec-Driven-Development/SDD.API/SDD.API.Tests/SDD.API.Tests.csproj
Set-Location Spec-Driven-Development/sdd-ui
npm run build
npm run test -- --watch=false
npm run e2e
```

The API tests require the test configuration expected by the existing suite. The Playwright suite must run against the local API/UI and approved test data. Confirm the project’s Angular test runner options if `--watch=false` differs from the installed runner configuration.

## Expected result

Employees can browse, create, and edit CCM records after the global unique index is applied and writes are enabled. Product association management remains pending product-source review; actual claim transaction selection, missing mappings, inactive-CCM behavior, and payout calculation remain outside this feature.
