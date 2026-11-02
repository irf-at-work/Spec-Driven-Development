# Quickstart: Dashboard and Company UI Revamp

This guide validates the UI revamp without changing database schema or company data.

## Prerequisites

- .NET 10 SDK and Node.js/npm for the existing projects.
- The repository's existing dependencies installed for the API, Angular UI, Vitest, and Playwright.
- Tests must use code-side fakes or mocked API responses; do not connect to or change Oracle data.

## Automated checks

From the repository root, run:

```powershell
.\scripts\test.ps1
```

Expected: the .NET solution builds, xUnit and Playwright tests pass, and the Angular Vitest suite passes. The command must return a non-zero exit code on failure.

If regenerating the Angular API client, use JDK 11 or later with the repository's pinned OpenAPI Generator and run:

```powershell
Invoke-WebRequest http://localhost:5114/openapi/v1.json -OutFile .\Spec-Driven-Development\SDD.API\SDD.API\openapi.json
npm --prefix .\Spec-Driven-Development\sdd-ui run generate-api-client
```

For focused frontend checks, from the repository root run:

```powershell
npm --prefix .\Spec-Driven-Development\sdd-ui test -- --watch=false
```

## Manual UI walkthrough

Start the API and frontend using the existing local development instructions. Use mocked API responses or non-mutating test fixtures; do not create or edit real company records.

1. Open the dashboard and confirm the content area is empty while the shared application header and navigation remain available.
2. Open Company Master. Confirm there is no “Master data” subtitle or standalone loading message above the table, and the table does not jump while a list response is pending.
3. For each filterable text column, enter a term and verify starts with, ends with, contains, doesn't contain, equals to, and not equals to. Clear the filter and confirm the table and URL return to the unfiltered state. Confirm date columns remain visible and sortable but have no filter controls.
4. Scroll horizontally and confirm Actions is the last column and stays visible. Resize each column with a pointer and keyboard, then check the table remains usable. Confirm the table and pagination each have a visible border.
5. Set page, sort, and filter state, open a company, and return to confirm the state is restored.
6. Compare add, view, and edit forms. Confirm field order and grouping remain the same; switching view/edit keeps fields and values in place; existing validation and immutable-field rules still work.
7. Check the refreshed warm-neutral palette, deep teal accents, restrained amber highlights, text contrast, focus indicators, and control labels.

See the [filtering contract](./contracts/filtering-contract.md) for the UI and API behavior and the [data model](./data-model.md) for transient list state.
