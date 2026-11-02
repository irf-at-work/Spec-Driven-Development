# Quickstart: Division and Department Master

This guide is for validation after implementation. It does not apply schema changes or mutate real Oracle records.

## Prerequisites

- .NET 10 SDK and the existing solution dependencies.
- Node.js/npm supported by Angular 21.
- For the initial read-only reverse-engineering prerequisite, Oracle 19c access to `STD_DIVISION` and the configured `BrokerConnection` available via the approved credential source.
- Do not print, commit, or place credentials in a command, tracked file, or test output.

## First implementation prerequisite: scaffold `STD_DIVISION`

Before any other feature implementation, inspect and scaffold the existing `STD_DIVISION` table using an isolated output and context. Follow the existing read-only scaffolding pattern in `specs/001-shared-dashboard-foundation/quickstart.md`; do not use `--force` against the existing `BrokerDataContext`. Review the generated primary key, company reference, field limits, and nullability before integrating its mapping. The operation must not create or alter Oracle objects.

If `STD_DIVISION` is absent or access is denied, stop and get direction from the database owner. Do not create a table, run DDL, or write test/application data without the required approval.

## Build the API contract and client

After implementation, build the API and generate its OpenAPI document from the declared controller return types. Generate the Angular client from that document with the existing project command:

```powershell
npm --prefix .\Spec-Driven-Development\sdd-ui run generate-api-client
```

Do not edit the generated API client or OpenAPI document by hand.

## Automated validation

From the repository root, run:

```powershell
.\scripts\test.ps1
```

Expected: the .NET solution builds, xUnit service tests pass, Playwright user journeys pass with mocked API responses, and Angular Vitest tests pass. Tests must not connect to Oracle or modify database data.

## User-visible validation scenarios

1. Start a company add flow and verify the three steps and current-step progress indicator.
2. Save Basic Details with each available action; verify the company is persisted before the existing Save flow, Save and Exit, or Save & Add Division navigation occurs.
3. Simulate a failed save on each step; verify the user remains on that step with entered values available for retry, while data saved on earlier steps remains persisted.
4. Add, collapse, remove, and reset division cards. Verify division data is persisted before Save and Exit or Save & Add Department navigation, delete confirmation works, and Reset clears only unsaved values.
5. Add a department and assign it to multiple divisions. Verify the selector excludes divisions from other companies and the company details view shows each assignment.
6. Open company details and verify existing company details remain visible alongside collapsible division cards and department tables.
7. Edit a division, add a new department and link an existing department through their respective popups.
8. Remove one department assignment and verify its other division assignments remain. Verify deleting a division with unresolved assignments is blocked with an actionable explanation.
9. Trigger validation, duplicate assignment, and API failure scenarios using mocks; verify the UI identifies the problem and never reports a failed operation as successful.

See [the data model](./data-model.md) for the existing department identity and assignment rules and [the API contract](./contracts/company-division-department-api.md) for operation behavior.
