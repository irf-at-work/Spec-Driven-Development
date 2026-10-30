# Implementation Plan: Company Master CRUD

**Branch**: `002-company-master` | **Date**: 2026-10-29 | **Spec**: [spec.md](./spec.md)

**Input**: Company Master CRUD, including UI/API, validation, audit display, and retained list state.

## Summary

Use the existing Oracle `STD_COMPANY` table and scaffolded `StdCompany` mapping to provide typed company CRUD operations and a Company Master UI. The UI will use the existing Angular Material and routing setup; the API will use controllers, DTOs, and the shared paginated response. Pin the pre-approved OpenAPI Generator wrapper and CLI for client generation. Assistant in-charge is omitted per the owner's clarification.

## Technical Context

**Language/Version**: C#/.NET 10; TypeScript/Angular 21.

**Primary Dependencies**: Existing ASP.NET Core, EF Core Oracle provider, `PaginatedResult<T>`, Angular Material, xUnit, Playwright for .NET, Vitest, and OpenAPI Generator wrapper 2.42.0 with CLI 7.26.0.

**Storage**: Existing Oracle 19c `IIRIS_RD_DEVP.STD_COMPANY`; no DDL or migrations.

**Testing**: xUnit for code-only API/service validation; Playwright with mocked API responses for each UI journey; Vitest for Angular behavior. Tests must not connect to or change a database. Run the existing `scripts/test.ps1`.

**Target Platform**: Local web application.

**Project Type**: Angular frontend with .NET API.

**Performance Goals**: Use the existing page size default of 10; no other response-time or volume targets are specified.

**Constraints**:

- Treat the existing database mapping as authoritative. Do not edit scaffolded entities/context or add columns.
- Only the requested company fields are exposed; preserve unrelated `STD_COMPANY` columns on updates.
- The company code and name are immutable after creation. Audit user fields use `Admin` as required by the constitution; timestamps use UTC and display in GST as DD-MM-YYYY.
- List query values are allow-listed; database paging occurs after filtering and stable sorting.
- API failures return typed `ProblemDetails` responses for expected validation, not-found, conflict, and database-reference errors. UI components display API failures at the point of use; global exception handling and HTTP interception are not required.
- Implement the API first and generate OpenAPI from its endpoint definitions; do not author an OpenAPI contract manually. Then generate the typed Angular client from that OpenAPI output before starting UI implementation. The pinned generator command is `npm run generate-api-client` in `Spec-Driven-Development/sdd-ui`.
- No database DDL, test database connections, or test data writes. Unit tests use code-side fakes and browser tests mock API responses.

## Constitution Check

### Pre-design gate

| Principle | Status | Plan application |
|---|---|---|
| Spec-first and testable acceptance criteria (Articles 1, 4) | PASS | The Company Master spec defines CRUD, validation, list, and delete scenarios; automated coverage is required. |
| Simplicity and explainability (Articles 2, 3) | PASS | Reuse the existing API/UI, table, shared paging contract, and pre-approved generator; avoid unrelated layers. |
| Configuration and secret safety (Articles 6, 7) | PASS | Use the configured connection by name; never place credentials in tracked files, logs, or commands. |
| Errors and human control (Articles 8, 9) | PASS | Use shared error handling; require explicit delete confirmation; block deletion of referenced records. |
| Scope and branch discipline (Article 10) | PASS | Keep this feature to Company Master; no changes to other master pages or database schema. |
| Project technology and dependency rules (B2, B4) | PASS | Use the existing pinned stack and pre-approved OpenAPI Generator wrapper 2.42.0/CLI 7.26.0. |
| Testing and test-data safety (B5) | PASS | xUnit, Playwright, and Vitest tests use code-only fakes or mocked API responses; no database access or data changes. |
| API, database-first, and Angular rules (B6-B8) | PASS | DTO/controller API, generated EF mapping remains untouched, generated typed client, standalone OnPush Angular UI, and typed reactive forms. |
| Shared-first workflow (B10) | PASS | Reuse the shared pagination type, layout, and navigation; global exception handling, HTTP interception, and a migration/script runner are not required. |

No constitutional exception is proposed.

## Project Structure

### Documentation (this feature)

```text
specs/002-company-master/
├── plan.md
├── research.md
├── data-model.md
└── quickstart.md
```

### Source Code (repository root)

```text
Spec-Driven-Development/
├── SDD.API/
│   ├── SDD.API/
│   │   ├── Controllers/                  # Company CRUD endpoints
│   │   ├── Contracts/                    # Company request/response DTOs
│   │   ├── Services/                     # Company business rules and operations
│   │   └── Data/                         # Reuse BrokerDataContext/StdCompany
│   ├── SDD.API.Tests/                    # API validation and operation tests
│   └── SDD.API.E2E.Tests/                # Company API/UI journeys
└── sdd-ui/
    └── src/app/pages/company-master/     # List, details, and edit/create views
```

**Structure Decision**: Extend existing API and Angular projects. Company controllers handle HTTP concerns and delegate company operations and business rules to a separate service class. Generate the typed Angular client into `sdd-ui/src/app/api/generated` using the pinned generator; do not create a second hand-maintained model or client.

## Design

1. Implement a company service class containing business rules and operations, including validation, duplicate checks, list filtering/sorting/pagination, audit values, update behavior, and delete-reference checks. Keep controllers limited to HTTP request/response handling and delegation to the service.
2. Add code-only xUnit tests for service rules using fakes and Playwright/Vitest coverage with mocked API responses. Do not place business logic in controller actions or connect tests to a database.
3. Generate OpenAPI from the API endpoint definitions. Do not write an OpenAPI contract manually.
4. Generate the typed Angular client from the generated OpenAPI output using the approved, pinned generator. Complete and validate the API before beginning UI implementation.
5. Build the company list, details, add, and edit states with the existing Angular conventions. Persist page, sort, and column filters in route query parameters so they survive navigation and browser back/forward.
6. Validate maximum lengths and required fields in real time, retain API validation as authoritative, and focus/scroll to the first invalid field. Keep date entry as date-only values; display dates in the project's required format.
7. Add Playwright and Vitest coverage, then verify using `scripts/test.ps1` and the [quickstart](./quickstart.md).

## Constitution Check (post-design)

| Gate | Result | Evidence |
|---|---|---|
| Scope and requirements | PASS | Only Company Master, with assistant in-charge excluded by owner decision. |
| Database-first and safety | PASS | Use existing `STD_COMPANY`; no DDL, migrations, test database connections, or database writes. |
| API and UI conventions | PASS | Typed API responses and the pinned OpenAPI Generator are used; error feedback is handled in the relevant API action or UI component. |
| Testing | PASS | CRUD rules are covered with code-only tests and mocked API responses; no test database is used. |
| Shared-first ordering | PASS | The shared pagination type, layout, and navigation are reused; global error services and migration runner are not required. |

## Complexity Tracking

The pre-approved OpenAPI Generator wrapper is pinned for client generation; no other package or architecture layer is proposed.
