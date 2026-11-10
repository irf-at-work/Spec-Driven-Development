# CCM Quickstart and Validation Guide

## Current implementation status

The current delivery is limited to read-only CCM browsing and approved lookup choices. The CCM list API and UI support paging, per-column filters, sorting, and status display. A detail GET API is present. CCM create/update, lifecycle changes, product associations, and end-to-end validation are not ready.

The owner directed that T003 be skipped and that no tests or database connections be performed in this session. T004 remains unresolved: the confirmed primary key is composite `(CCM_COMP_CODE, CCM_CODE)`, and the supplied evidence does not establish global uniqueness of `CCM_CODE`. Therefore CCM writes must remain disabled until database enforcement is verified or the owner approves an alternative schema decision. The product source and full choice review also remain unresolved. Do not treat the read-only UI as approval to run CCM writes.

No tests were run and no database connection was attempted while implementing this increment.

## Future local validation prerequisites

The following steps are for a later owner-approved validation session. Use an approved local Oracle schema and non-production records only.

## Prerequisites

- .NET 10 SDK and the repository's pinned Node/npm versions.
- Oracle 19c connectivity configured through the existing safe settings mechanism (user-secrets or environment variables; never commit credentials).
- Before running CCM create flows, set the fixed Company Code configuration to `ASRTEST` while login/session support is out of scope.
- Before testing dropdowns, the complete CCM `STD_LIST_ITEM.LI_TYPE` mappings and authoritative product-choice source must be confirmed.
- Before running write scenarios, verify database enforcement of globally unique `CCM_CODE`, or obtain owner approval for an alternative schema decision.

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

After the prerequisites are met, open Claim Configuration Master. Confirm the list has no global search, supports per-column filters and sorting, initially shows 10 records, offers page sizes 10/25/50, and displays active/inactive state. Write scenarios remain gated and are intentionally omitted from this current read-only walkthrough.

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

Employees can maintain a CCM and its product links from the CCM page. Product association retrieval exposes the linked CCM code(s); actual claim transaction selection, missing mappings, inactive configurations, and payout calculation remain outside this feature.
