# Implementation Plan: Dashboard and Company UI Revamp

**Branch**: `003-ui-revamp` | **Date**: 2026-10-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-ui-revamp/spec.md`; user additionally requested one reusable filter component for all company text filters.

## Summary

Refresh the shared Angular shell and Company Master presentation, make the dashboard content area empty, and align the company add/view/edit field layout. Add one reusable filter control for filterable company text columns, while the Company Master page owns URL state and the .NET API applies the selected matching operator before pagination. Keep the existing stack, database schema, and business rules unchanged.

In plain English: the filter control gathers a value and matching rule, the company page remembers those choices in the URL, and the API returns the matching page of companies. The same form layout presents a company in read-only or editable mode so fields do not move. Automated tests use mocked responses and code-side fakes; they do not access or modify Oracle data.

## Technical Context

**Language/Version**: C#/.NET 10; TypeScript/Angular 21.

**Primary Dependencies**: Existing ASP.NET Core, EF Core Oracle provider, Angular Material/CDK, generated OpenAPI Angular client, xUnit, Playwright for .NET, and Vitest. No package changes are proposed.

**Storage**: Existing Oracle 19c `STD_COMPANY` mapping. No schema changes, migrations, or test-database access.

**Testing**: API filtering and validation with xUnit code-only fakes; shared-control and page behavior with Vitest; dashboard, listing, and form journeys with Playwright and mocked API responses. Run the existing `scripts/test.ps1` aggregate runner.

**Target Platform**: Local web application.

**Project Type**: Angular frontend with .NET API.

**Performance Goals**: Preserve server-side filtering before count and pagination; no additional latency or throughput target is specified.

**Constraints**:

- All user-facing text must use British English (en-GB).
- Preserve the current company fields, validation, database mapping, API operations, navigation, sorting, and pagination except for specified filter changes.
- Date columns stay visible and sortable but are not filterable in this stage.
- Support only the eight filterable text columns; combine active filters with AND and default the operator to case-insensitive `contains`.
- Use route query parameters for filter value/operator and existing page/sort state. Reset the page when a filter changes.
- The OpenAPI document remains the source for the generated Angular API client; do not hand-edit generated files or add an API/database model by duplicating generated types.
- No packages, database schema, database records, authentication, or persistent column-width preferences are added or changed.
- Column resizing must work with pointer and keyboard input without a new dependency.

**Scale/Scope**: One dashboard shell, the Company Master list and company create/view/edit experiences, eight text filters, and three visible sortable date columns without filters.

## Constitution Check

### Pre-design gate

| Principle | Status | Plan application |
|---|---|---|
| Specification-first and testable acceptance criteria (Articles 1, 4) | PASS | `spec.md` is updated with the user's date-filter clarification and defines acceptance scenarios for the dashboard, table/filter, and forms. |
| Simplicity and explainability (Articles 2, 3) | PASS | Reuse the current applications and libraries; introduce one shared filter control because the same interaction is repeated across columns; explain validation in `quickstart.md`. |
| Automated tests and code quality (Articles 4, 5) | PASS | Add service, shared-control, page, and Playwright coverage; keep strict typing and use existing formatter/test runner. |
| Configuration, privacy, and dependency approval (Articles 6, 7, B4) | PASS | No new configuration, packages, secrets, or personal data are required. |
| Errors, human control, and database safety (Articles 8, 9, B8) | PASS | Keep current user-facing API errors; no database writes, DDL, or irreversible operations are in scope. |
| Scope, documentation, and branch discipline (Articles 10, 11) | PASS | Stay within the `003-ui-revamp` feature scope and record the shared filter decision in `docs/decisions/reusable-company-filters.md`. |
| Project technology and Angular/API rules (B2, B6-B8) | PASS | Use .NET 10, Oracle EF database-first mappings unchanged, standalone OnPush Angular components, signals, typed inputs/outputs, typed reactive forms, and generated API types. |
| Test-data safety and shared-first workflow (B5, B10) | PASS | xUnit/Vitest/Playwright tests use fakes or mocked responses; the filter component is implemented once and consumed by the Company Master columns. |

No constitutional exception is proposed.

## Project Structure

### Documentation

```text
specs/003-ui-revamp/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── filtering-contract.md
docs/decisions/
└── reusable-company-filters.md
```

### Source Code

```text
Spec-Driven-Development/
├── SDD.API/
│   ├── SDD.API/Controllers/CompanyController.cs
│   ├── SDD.API/Contracts/CompanyListQuery.cs
│   ├── SDD.API/Services/CompanyService.cs
│   ├── SDD.API.Tests/Services/CompanyServiceReadTests.cs
│   └── SDD.API.E2E.Tests/
│       ├── DashboardNavigationTests.cs
│       ├── CompanyListAndDetailsE2ETests.cs
│       └── CompanyAddEditE2ETests.cs
└── sdd-ui/
    └── src/
        ├── styles.css
        └── app/
            ├── layout/dashboard-layout.css
            ├── pages/dashboard/
            ├── pages/company-master/
            └── shared/
                ├── filter-control/
                └── company-fields/
```

**Structure Decision**: Extend the existing Angular app and API. Put the presentation-only filter control and common company-field layout in Angular's shared area. Keep filter URL state and company-list composition in Company Master, and keep matching semantics in the API service. Regenerate the API client from the API's OpenAPI output after changing list query parameters.

## Design

1. **API filter behavior**: Add a typed operator for each of the eight filterable text fields while preserving existing value parameter names. Validate the operator allowlist, default to case-insensitive `contains`, trim terms, ignore blank search values, treat null column values as non-matches, combine active columns with AND, and apply all conditions before count/pagination. Apply primary-address operators to the same comma-separated value displayed in the table. Keep dates sortable but remove their filter parameters. Cover all operators, blank terms, null values, invalid values, address composition, and page totals with code-only service tests.
2. **Generated client**: Update the controller/query contract and service first, then regenerate the Angular client from generated OpenAPI using the existing pinned generator workflow. Do not edit the generated client or create hand-maintained API DTO duplicates.
3. **Shared filter control**: Add one standalone, OnPush control with signal inputs for label/value/operator and a typed output for changes/clear. It renders the requested text field, six operators, and clear action; it has no API, route, company-column, or persistence logic. Keep keyboard access and accessible labels.
4. **Company list state and table**: Bind the eight text-column instances to their existing value parameters and paired operator parameters in route query state. Omit the default operator from the URL; clearing removes value and operator and resets page to one. Keep date columns visible/sortable without filter controls. Move Actions to the last position and keep it visible on horizontal scroll. Provide accessible pointer/keyboard column resizing and clear table/pagination borders. Keep loading feedback within the stable table region, not above it.
5. **Dashboard and theme**: Remove all sample dashboard content, including the sample shared-presentation demonstration, while preserving the shared navigation shell. Update existing global design tokens and Angular Material surface/control styling to the specified warm-neutral, deep-teal, and restrained-amber palette with clear contrast and focus indicators. Add no theme package.
6. **Company forms**: Introduce one shared field layout for add, view, and edit, preserving field order and grouping. Use the same positions while values switch between read-only and editable states; keep values when entering or cancelling edit. Preserve current validation, immutable company code rules, and API error handling.
7. **Verification**: Add Vitest coverage for filter choices/events/clearing, URL synchronization, table resizing/sticky actions, empty dashboard, and stable form positions/values. Extend xUnit and mocked Playwright journeys for the operator results, clear behavior, navigation state, layout, and existing company rules. Run `scripts/test.ps1` and follow `quickstart.md`.

## Constitution Check (post-design)

| Gate | Result | Evidence |
|---|---|---|
| Requirements and scope | PASS | The design implements the approved `spec.md`; date filters are explicitly excluded and no business-data changes are proposed. |
| Simplicity and shared behavior | PASS | One reusable presentation-only filter control replaces repeated filter markup; no new package, state store, service layer, or persistence mechanism is added. |
| API/database safety | PASS | Only list query semantics change; scaffolded entities/context, schema, and records remain untouched; filtering remains server-side before paging. |
| Generated API and Angular conventions | PASS | Regenerate the client from OpenAPI; use strict typed standalone/OnPush components, signals, and existing Material controls. |
| Testing and error behavior | PASS | Use xUnit, Vitest, and Playwright with code fakes/mocked responses through the existing aggregate command; preserve visible errors. |
| British English and accessibility | PASS | Keep new labels en-GB, label each filter, expose operator and resize interactions to keyboard users, and retain visible focus treatment. |
| Documentation and decision record | PASS | `research.md`, `data-model.md`, `contracts/filtering-contract.md`, and `quickstart.md` capture the design and validation; the reusable-filter decision is recorded in `docs/decisions/`. |

No constitutional exception is proposed.

## Complexity Tracking

| Addition | Justification | Simpler alternative rejected because |
|---|---|---|
| Shared filter control | The same text/operator/clear interaction is required in eight table columns and is explicitly requested for reuse. | Copying filter markup per column duplicates operator, clear, and accessibility behavior and risks inconsistent updates. |
| Shared company-field layout | Add, view, and edit must keep the same fields in the same positions and preserve values across modes. | Separate templates can drift or shift fields when the display mode changes. |
