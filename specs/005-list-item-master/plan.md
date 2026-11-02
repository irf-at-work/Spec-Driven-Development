# Implementation Plan: List Item Master

**Branch**: `005-list-item-master` | **Date**: 2026-11-02 | **Spec**: [spec.md](./spec.md)

**Input**: List Item Master CRUD over the existing `STD_LIST_ITEM` table, with a paginated listing, details and in-place editing, and unchanged Company Master navigation.

## Summary

First verify the existing database-first `STD_LIST_ITEM` scaffold and its composite key and field mappings; the shared foundation already generated this representation, so do not rerun scaffolding or change the database. Then implement typed API operations and generate the Angular API client from the API's OpenAPI document. Replace the Listing Master placeholder with the list, create, and details workflows, keeping editing on the details page. Reuse shared pagination, navigation, filter, and presentation patterns. Cover service rules with code-only xUnit tests and user journeys with Playwright/Vitest mocks; never connect these tests to or change a database.

## Technical Context

**Language/Version**: C#/.NET 10; TypeScript/Angular 21.

**Primary Dependencies**: Existing ASP.NET Core, EF Core Oracle provider, `PaginatedResult<T>`, Angular Material, OpenAPI Generator wrapper 2.42.0 with CLI 7.26.0, xUnit, Playwright for .NET, and Vitest.

**Storage**: Existing Oracle 19c `IIRIS_RD_DEVP.STD_LIST_ITEM`; reuse the scaffolded `StdListItem` mapping. No DDL or migrations.

**Testing**: Code-only xUnit service/controller tests; Playwright E2E tests and Vitest component tests with mocked API responses. No test database connections or writes. Run `scripts/test.ps1`.

**Target Platform**: Local web application.

**Project Type**: Angular frontend with .NET API.

**Performance Goals**: Use the shared page size default of 10; no other response-time or volume targets are specified.

**Constraints**:

- The existing generated entity and context are authoritative and MUST NOT be edited. Verify their current `STD_LIST_ITEM` mapping before any feature behaviour; do not make DDL, migrations, or database writes.
- `LI_TYPE` and `LI_CODE` form the immutable composite identity. Preserve unexposed or unedited values on updates; expose the existing business fields including both flexible values, but do not accept audit fields from clients.
- Set audit identities to `Admin`, timestamps to UTC, and display timestamps in GST as DD-MM-YYYY. Treat active status as the existing one-character Y/N value.
- Allow only known list sort and filter fields. Filter and sort before paging; add `LI_TYPE`, `LI_CODE` as stable tie-breakers.
- Use typed controllers and DTOs, shared pagination, and typed errors. Generate OpenAPI from the API and the typed Angular client from that generated document; do not hand-author either API models or the client.
- Reuse existing Angular standalone, `OnPush`, signals, `inject()`, built-in control-flow, typed reactive-form, and Angular Material conventions. Do not add dependencies.
- No shared error handler/interceptor or new persistence layer is required. Keep error feedback in the relevant API action and UI component.
- Delete is confirmed by the user. Protect database integrity; currently scaffolded application entities contain no mapped references to `STD_LIST_ITEM`. Treat a database-reported reference constraint as a conflict; do not guess at or scan unrepresented tables.
- Authentication is out of scope. Use code-side fakes and browser mocks; never use real master data for CRUD tests.

## Constitution Check

### Pre-design gate

| Principle | Status | Plan application |
|---|---|---|
| Spec-first and testable acceptance criteria (Articles 1, 4) | PASS | The List Item Master spec defines scaffold-first verification, list/view, create/edit, delete, navigation, validation, and measurable outcomes. |
| Simplicity and explainability (Articles 2, 3) | PASS | Reuse the current API/UI structure, shared pagination, existing navigation and filter controls; avoid new packages or infrastructure. |
| Configuration and secret safety (Articles 6, 7) | PASS | Use the configured connection by name only where required for local application operation; never place credentials in commands, logs, or tracked files. Tests do not connect to a database. |
| Errors and human control (Articles 8, 9) | PASS | Show actionable errors; require confirmation for permanent removal and preserve database integrity. |
| Scope and branch discipline (Article 10) | PASS | Work is limited to List Item Master and its navigation entry; Company Master and database definitions remain unchanged. |
| Project technology and dependency rules (B2, B4) | PASS | Use the existing .NET 10, Angular 21, Oracle 19c, and pinned/pre-approved packages without dependency changes. |
| Testing and test-data safety (B5) | PASS | Use xUnit, Playwright, and Vitest; tests use fakes/mocks only and propagate cancellation tokens in asynchronous API/service operations. |
| API, database-first, and Angular rules (B6-B8) | PASS | Keep the generated mapping unchanged; use typed controllers/DTOs, return typed response shapes, generated client, strict typed forms, and existing shared pagination. |
| Shared-first workflow (B10) | PASS | The shared scaffold, pagination, layout, navigation, and filter control already exist and will be reused. |

No constitutional exception is proposed.

## Project Structure

### Documentation (this feature)

```text
specs/005-list-item-master/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── list-item-api.md
```

### Source Code (repository root)

```text
Spec-Driven-Development/
├── SDD.API/
│   ├── SDD.API/
│   │   ├── Controllers/                  # List item CRUD endpoints
│   │   ├── Contracts/                    # List item request and response DTOs
│   │   ├── Services/                     # List item validation and operations
│   │   └── Data/                         # Reuse BrokerDataContext/StdListItem unchanged
│   ├── SDD.API.Tests/                    # Code-only API/service tests
│   └── SDD.API.E2E.Tests/                # Browser journeys with mocked API responses
└── sdd-ui/
    └── src/app/
        ├── api/generated/                # Regenerated typed client; never hand-edited
        ├── pages/listing-master/         # Listing, create, details, and in-place edit
        └── shared/                       # Reuse common filter control and dashboard shell
```

**Structure Decision**: Extend the existing API and Angular projects. Follow the Company Master controller/service/DTO pattern, generate the client using the pinned generator, and replace the existing `ListingMasterPage` placeholder within the current dashboard route. Add no new project, package, table, or shared infrastructure.

## Design

1. Begin with a model-only review of the existing scaffolded `StdListItem` mapping: table name, `LI_TYPE`/`LI_CODE` composite key, properties, and configured lengths. Extend the existing model test to assert any of these details it does not yet cover. The shared foundation already scaffolded the entity. Stop if the model does not agree with the available database-first definition; do not change DDL or the generated context in this feature.
2. Implement list, read, create, update, and delete application operations using the existing controller and service patterns. Keep request/response DTOs separate from database entities; validate type/code and lengths at the API boundary, guard concurrent duplicate creation with the database key, set audit fields in the service, and translate referenced-delete failures to a typed conflict.
3. Implement a paginated list query with allow-listed data-column filters/sorts, count before page retrieval, page size 10 by default, and deterministic composite-key tie-breaks. Return `PaginatedResult<T>`.
4. Generate the OpenAPI document from API endpoint signatures and regenerate the Angular client with `npm run generate-api-client` in `Spec-Driven-Development/sdd-ui`; never hand-write OpenAPI or edit generated client files.
5. Replace the placeholder listing page with the filterable/sortable listing, create form, and details page. Keep edit mode on the details page. Preserve list state in route query parameters and keep the existing Company Master route and menu destination intact.
6. Reuse existing layout, filter control, styles, and Angular conventions. Surface operation errors locally, retain form values after save failures, and require an explicit confirmation before permanent removal.
7. Add code-only xUnit tests for validation, mapping, sorting/filtering, duplicate identity, auditing, update behavior, and error translation. Add Playwright tests for each user story with API mocks and Vitest tests for page/form behavior. Do not connect any automated test to Oracle or write real records.

## Constitution Check (post-design)

| Gate | Result | Evidence |
|---|---|---|
| Scope and requirements | PASS | The design implements the specified List Item Master experience and preserves Company Master; no unrelated master or schema changes are planned. |
| Database-first and safety | PASS | It first verifies the already-scaffolded table mapping, leaves generated files and database definitions unchanged, and uses no database-backed tests. |
| API and UI conventions | PASS | Typed controllers/DTOs and response types, generated OpenAPI client, standalone `OnPush` Angular components, and typed reactive forms are used. |
| Shared-first ordering | PASS | The existing scaffold, dashboard, navigation, pagination, and filter control are reused. |
| Testing and errors | PASS | Each user journey receives automated coverage; xUnit uses fakes, browser tests mock APIs, and errors remain explicit and actionable. |
| Human control and audit | PASS | Permanent removal requires confirmation; create/update audit identities and timestamps are set by the service, not accepted from the client. |

No constitutional exception or additional package is proposed.

## Complexity Tracking

No constitution violations or additional architectural components are proposed.
