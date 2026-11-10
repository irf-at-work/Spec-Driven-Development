# CCM Quickstart and Validation Guide

## Current implementation status

The current delivery includes CCM list/detail browsing and create/edit forms. The UI supports paging, per-column filters, sorting, status display, seven setting lookup lists, audit-field display, and an explicit Save gate. The API create/update routes return 503 and the UI disables Save until the owner enables writes. Product associations remain unresolved.

The owner directed that T003 be skipped and that no tests or database connections be performed by the implementation agent. The supplied screenshots confirm the composite primary key `(CCM_COMP_CODE, CCM_CODE)`. Later owner-pasted metadata confirms a valid unique index on the single `CCM_CODE` column, so T004 is passed. The attempted `CREATE INDEX` failed with ORA-00955 because that index name already exists; do not rerun its DDL. The owner approved `STD_LIST_ITEM` / `CCM_PRODUCT` for product choices; other setting-choice reviews remain incomplete.

No tests were run and no database connection was attempted while implementing this increment.

## Future local validation prerequisites

The following steps are for a later owner-approved validation session. Use an approved local Oracle schema and non-production records only.

## Prerequisites

- .NET 10 SDK and the repository's pinned Node/npm versions.
- Oracle 19c connectivity configured through the existing safe settings mechanism (user-secrets or environment variables; never commit credentials).
- Before running CCM create flows, set the fixed Company Code configuration to `ASRTEST` while login/session support is out of scope.
- Before testing recovery-deduction dropdowns, the owner-supplied choices must be inserted with [ccm-recovery-deduction-insert.sql](ccm-recovery-deduction-insert.sql). Product choices use active `STD_LIST_ITEM` rows with `LI_TYPE = 'CCM_PRODUCT'` per FR-036; the list starts empty until product codes/descriptions are seeded.
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

## Seed product choices

The Available Products dropdown reads `STD_LIST_ITEM` rows with `LI_TYPE = 'CCM_PRODUCT'` and `LI_ACTIVE_YN = 'Y'`. No product rows or eligible count were confirmed in the pasted lookup output. To add a product choice, open [ccm-product-choice-insert.sql](ccm-product-choice-insert.sql) in SQL Developer and use **Run Script (F5)** so the script prompts for product code and description. Review the before/after query output, then commit only after confirming the row is correct. Repeat once per product. This script writes only `STD_LIST_ITEM`; it does not create a product table or a CCM link. Link a seeded product from the CCM's Applicable Products section.

## Validate the read-only CCM list

Before enabling writes, open Claim Configuration Master and inspect the Add and view/edit pages; Save and Delete should be disabled. The owner-pasted output already verifies the unique index, so do not apply the index script again. When ready, set `WritesEnabled` and create a CCM with a unique code, then edit it. Confirm Company Code stays hidden and is supplied from configuration, key fields are immutable, audit values are populated, English names are uppercase, Arabic values retain their exact text and RTL display, Print Before Approval Yn and RePrint Allowed default unchecked (N), accounting flags default to Y, and unchanged inactive choices remain selected. Delete must be confirmed and blocked while product links exist. Recovery-deduction choices stay unavailable until their source is reviewed.

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

Employees can browse, create, and edit CCM records after the global unique index is verified and writes are enabled. Product choices are supplied through active `CCM_PRODUCT` rows in `STD_LIST_ITEM`; the list is empty until those rows are seeded. Actual claim transaction selection, missing mappings, inactive-CCM behavior, and payout calculation remain outside this feature.
