# Implementation Plan: Codes Master

**Branch**: `sdd.muktha` | **Date**: 2026-10-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-codes-master/spec.md`

## Summary

Provide broker users with a paginated Codes Master listing and dedicated add/edit pages, while preserving the existing Oracle `STD_CODES` data and composite key. The .NET API will use the constitution-mandated Oracle Entity Framework Core database-first approach; the Angular UI will consume the API contract generated from OpenAPI. The API owns validation, key-safe CRUD, and creation audit values. The UI provides the required navigation, forms, feedback, and accessible audit details.

## Technical Context

**Language/Version**: C#/.NET 10; TypeScript/Angular 21 per the constitution. The checked-in UI currently declares Angular 22.2; resolve that conflict before implementation.

**Primary Dependencies**: ASP.NET Core controllers and OpenAPI; `Oracle.EntityFrameworkCore` is constitutionally required but is not currently referenced. Angular standalone components, Angular Material (required by the constitution but not currently referenced), typed reactive forms, and an OpenAPI-generated client. Package additions or changes require owner confirmation and pinned versions before installation.

**Storage**: Existing Oracle 19c `IIRIS_RD_DEVP.STD_CODES`, database-first; no schema edits or migrations. The API must use the supplied endpoint configuration without committing credentials. Connectivity, schema metadata, character set, and database server time zone have not been verified.

**Testing**: xUnit API tests and Playwright end-to-end tests per the constitution. The repository currently has no API test project or Playwright setup; the Angular starter has a Vitest test target. Align tests and obtain any required package approvals before implementation.

**Target Platform**: Local machine, with the existing .NET API and Angular application.

**Project Type**: Web application (ASP.NET Core API + Angular UI + Oracle database).

**Performance Goals**: No feature-specific response-time SLA is specified. The listing uses the constitution's default page size of 10.

**Constraints**: Keep schema and scaffolded files unchanged; use database-first entities and partial extensions; generated OpenAPI client only; strict Angular typing and typed forms; no authentication; no secrets in source control; require explicit user intent for data changes and confirmation for deletion; do not add packages without approval.

**Scale/Scope**: One Master-data feature over the existing `STD_CODES` records, with paginated listing, record-level audit details, and create/read/update/delete. No search, filter, sort, authentication, or schema change.

## Constitution Check

### Pre-research gate

| Principle | Plan alignment |
|---|---|
| Specification first | A reviewed Codes Master specification exists and defines observable acceptance criteria. |
| Simplicity | Use the existing API/UI projects and table; avoid new database objects and unrelated features. |
| Explainability | This plan and quickstart describe the user-facing workflow in plain language. |
| Testing | Plan xUnit API coverage and Playwright end-to-end coverage; current test-project/tooling gaps are recorded for implementation planning. |
| Code quality | Follow C# and Angular conventions; generated entities and API client are not hand-edited. |
| Configuration | Load connection settings safely, validate required configuration at startup, and provide placeholder-only example settings as required by the constitution. |
| Security and privacy | Keep credentials in an approved secret store/environment; validate input; do not add authentication to this phase. |
| Errors and observability | Return `ProblemDetails` for failures, handle exceptions globally, log significant actions without secrets, and show plain-English feedback. |
| Human control | Save operations require the user's explicit form submission; deletion also requires a confirmation. Do not run data-changing setup scripts or seed records. |
| Version control and scope | Work remains limited to Codes Master; no branch switch or commit is part of this plan. |
| Documentation | Record any significant technical decision in the project decision records during implementation if it warrants a durable project-wide rule. |
| Project architecture | Use .NET 10 controllers/DTOs, Oracle database-first EF Core, Angular standalone/OnPush/signals, typed reactive forms, and generated API types. |
| API contract | Listing returns the shared `PaginatedResult<T>` shape; error responses use `ProblemDetails`; response shapes are expressed through return types rather than controller attributes. |

**Pre-research result**: PASS with implementation prerequisites. No schema or package change is authorized by this planning task. Before implementation, obtain approval for each needed package change, reconcile the Angular version mismatch, and verify database connection/schema/time-zone details.

### Post-design gate

| Gate | Result |
|---|---|
| Existing table and composite identity are preserved | PASS |
| No migrations, DDL, seed data, or replacement data store are planned | PASS |
| Controller/DTO and OpenAPI-first generated client approach is defined | PASS |
| Non-success API results use `ProblemDetails`; client errors flow through the global interceptor | PASS as a required design outcome; current starter does not yet evidence the interceptor |
| Angular 21, Material, generated client, and test-stack requirements are reconciled with current dependencies | CONDITIONAL: implementation prerequisite; see [research.md](research.md) |
| Database byte semantics and `SYSDATE` behavior are treated as Oracle-owned | PASS; target character set and server time zone must be verified before implementation |
| User data changes require deliberate interaction and destructive delete confirmation | PASS |
| No authentication or extra search/sort/filter behavior is introduced | PASS |

**Post-design result**: PASS for design; implementation is gated on the explicit prerequisites in the research record. No constitutional exception is proposed.

## Project Structure

### Documentation (this feature)

```text
specs/001-codes-master/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── codes-master.openapi.yaml
└── tasks.md                 # Created by /speckit-tasks, not by this command
```

### Source Code (repository root)

```text
Spec-Driven-Development/
├── SDD.API/
│   └── SDD.API/
│       ├── Controllers/
│       │   └── CodesController.cs
│       ├── Contracts/
│       │   ├── CodeWriteRequest.cs
│       │   └── CodeRecordResponse.cs
│       ├── Data/
│       │   └── Database-first context and generated entity files
│       ├── Services/
│       │   └── Codes Master operations and validation
│       ├── Middleware/
│       │   └── Global exception handling and ProblemDetails
│       └── appsettings.example.json
└── sdd-ui/
    └── src/app/
        ├── core/
        │   └── shared HTTP error handling
        ├── features/codes-master/
        │   ├── pages/
        │   ├── components/
        │   └── codes-master.routes.ts
        ├── api/generated/   # Generated from API OpenAPI; never hand-edited
        └── navigation/
```

Test locations follow the existing solution/project conventions once approved test projects are established: API unit/integration tests in an xUnit project, and browser acceptance flows in Playwright. The current repository does not yet contain those projects.

**Structure Decision**: Extend the existing API and Angular application rather than create additional runtime projects. Separate the feature's user interface, API contract/DTOs, and database operations by responsibility. Scaffold Oracle entities into a designated generated area and extend them only with partial classes; exact scaffold paths must follow the generated output and must not be hand-assumed.

## Plain-English Workflow

The user opens Master > Codes Master and reviews ten records at a time. Add and Edit take the user to separate pages. The API checks required fields and Oracle byte limits, then reads or changes the matching record using both Code and Code Type. Creating a record derives Company Code from Code and records the required creation details in Oracle. Editing keeps the original key and creation details. Delete asks the user to confirm first. The UI reports success or a safe, understandable error and can show the selected record's creation details accessibly.

## Complexity Tracking

No constitutional exception or extra runtime project is proposed. Approval-gated dependencies and existing project/version gaps are not design complexity exceptions; they are prerequisites to execution.
