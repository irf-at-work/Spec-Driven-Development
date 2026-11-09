# CCM Quickstart and Validation Guide

This guide is for validating the implemented CCM workflow locally. It does not change the database. Use an approved local Oracle schema and non-production test records only.

## Prerequisites

- .NET 10 SDK and the repository's pinned Node/npm versions.
- Oracle 19c connectivity configured through the existing safe settings mechanism (user-secrets or environment variables; never commit credentials).
- Before running CCM create flows, set the fixed Company Code configuration to `ASRTEST` while login/session support is out of scope.
- Before testing dropdowns, planning has confirmed the CCM `STD_LIST_ITEM.LI_TYPE` mappings and authoritative product-choice source.
- The database has been verified to enforce globally unique `CCM_CODE`. If not, do not run write scenarios until an approved schema change supplies that guarantee.

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

## Validate the CCM workflow

Use an approved local test schema and verify each outcome:

1. Open Claim Configuration Master. Confirm the list has no global search, supports per-column filters/sorting, initially shows 10 records, and offers the shared 10/25/50 page sizes.
2. Create a CCM with a unique employee-entered CCM Code, Claim Config Name, and confirmed setting values. Confirm Company Code is supplied by application configuration and is not an editable form field. Confirm English names and short names display uppercase, Arabic values remain unchanged and RTL, and flags default to Y.
3. Open the saved CCM. In Applicable Products, confirm the table columns are Product Code, Product Name, and Action. Add a product through the Available Products modal and verify option and row labels match the approved product source.
4. Attempt to add the same product to the CCM twice; confirm the duplicate is rejected and only one association remains.
5. Add more than five distinct products. Confirm the linked-products table paginates from five rows, while this page size is not imposed on the Available Products choices.
6. Delete one product association after confirmation. Confirm only that link is removed and the CCM plus its other product links remain.
7. Open another CCM and confirm a product can link to it as well. Deactivate/reactivate a CCM and confirm its settings and product associations remain stored.
8. Verify that a product ID can retrieve its linked CCM codes/configuration references without selecting one when multiple links exist.

## Automated validation commands

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
