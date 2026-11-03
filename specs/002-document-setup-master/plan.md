# Implementation Plan: Document Setup Master

**Branch**: `002-document-setup-master` | **Date**: 2026-11-02 | **Spec**: [spec.md](./spec.md)

**Current worktree branch**: `002-document-setup-master`

## Summary

Add a Document Setup parent listing and parent form, plus child Applicable Module CRUD in the parent Edit flow. Store records in the existing Oracle tables and reuse the Codes Master connection, API conventions, Angular patterns, and generated-client workflow. Do not add a package, connection string, table, column, sequence, or foreign key. For child IDs, use the user-selected `MAX(DAMOD_UID) + 1` strategy, serialized with the insert. The exact implementation and contract details are in [research.md](./research.md), [data-model.md](./data-model.md), and [contracts/document-setup-api.md](./contracts/document-setup-api.md).

## Technical Context

**Language/Version**: C# / .NET 10; TypeScript / Angular 21  
**Primary Dependencies**: Existing Oracle.EntityFrameworkCore, Oracle Managed Data Access, Angular Material, RxJS, generated OpenAPI client; no new dependencies  
**Storage**: Oracle 19c; `IIRIS_RD_DEVP.STD_DOCUMENT` and `IIRIS_RD_DEVP.STD_DOC_APPL_MODULE`  
**Testing**: xUnit API unit/integration tests; Playwright end-to-end tests; Angular production build  
**Target Platform**: Local machine, desktop browser  
**Project Type**: Angular web application with ASP.NET Core Web API  
**Performance Goals**: No formal latency target is specified. Apply server-side filters before pagination, use the shared default page size of 10, and do not load complete master datasets.  
**Constraints**: Reuse the `CodesMasterOracle` connection; database-first only; no DDL, migrations, new sequence, schema change, or package changes; preserve primary-key uniqueness and parent-child association without a foreign key; no authentication requirement.  
**Scale/Scope**: Local broker master-data CRUD. Record volume and concurrency targets are unspecified; listing requests must remain paginated and writes must handle concurrent operations safely.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Pre-design check |
|---|---|
| Specification first | **PASS** — user outcomes, acceptance scenarios, and constraints are recorded in [spec.md](./spec.md); the database clarification is incorporated. |
| Simplicity | **PASS** — extend the existing API/UI, context, OpenAPI/client generation, and test stack; add no packages or new connection configuration. |
| Explainability | **PASS** — this plan includes a plain-language flow and [quickstart.md](./quickstart.md) gives validation and smoke-test steps. |
| Testing | **PASS** — cover service/controller behavior with xUnit and primary user flows with Playwright; document the validation command. |
| Code quality | **PASS** — use existing C# and Angular patterns, strict generated types, and repository lint/build checks. |
| Configuration | **PASS** — reuse the configured Codes Master Oracle connection; introduce no configuration options. |
| Security and privacy | **PASS** — validate all inputs, use parameterized database operations, and return no raw exceptions or sensitive diagnostics. |
| Errors and observability | **PASS** — use the existing global `ProblemDetails` handler and structured logs; surface safe actionable messages. |
| Human control | **PASS** — require explicit delete confirmation, block parent deletion with children, and confirm discarding dirty forms. |
| Version control | **PASS** — implementation is on the dedicated `002-document-setup-master` branch; pre-existing untracked documentation was preserved when creating it. |
| Decision records | **PASS** — record the significant ID, locking, and API decisions in `../../docs/decisions/002-document-setup-master.md`. |
| Database-first / no schema changes | **PASS** — map the supplied DDL; do not alter database objects or scaffold by changing database state. |
| API conventions | **PASS** — controllers, typed DTOs, `PaginatedResult<T>`, `ProblemDetails`, and propagated `CancellationToken` remain required. |
| Angular conventions | **PASS** — standalone OnPush components, signals, typed reactive forms, Material, and generated client only. |

No constitutional violation is identified. The table-lock serialization required by the selected max-plus-one ID strategy is a deliberate write-path tradeoff for this low-volume master-data feature; see [research.md](./research.md).

### Post-Design Recheck

| Gate | Result |
|---|---|
| Database-first / no schema changes | **PASS** — the design maps the supplied DDL and adds no schema objects. |
| Simplicity / dependencies | **PASS** — existing projects, Oracle connection, OpenAPI generator, and packages are reused. |
| Reliability / concurrency | **PASS** — serialized global child-ID allocation, parent association locking, and row-snapshot version checks are defined. |
| Errors / security | **PASS** — typed validation and safe `ProblemDetails`; no raw exceptions or secrets in responses. |
| Automated validation | **PASS** — xUnit, Playwright, build, and a configured-Oracle concurrency smoke test are documented. |
| Branch discipline | **PASS** — implementation is on `002-document-setup-master`; no prior untracked work was discarded. |
| Decision records | **PASS** — the accepted design is recorded in `docs/decisions/002-document-setup-master.md`. |

## Plain-English Design

The browser shows a paginated list of document setups. A user creates or edits a parent document, then manages its Applicable Module rows from the parent Edit page. The API validates the request and reads or writes the existing Oracle tables through the same connection as Codes Master. It checks parent/child relationships and stale edits itself because the database has no foreign key or version column. Child creation calculates the next numeric ID while serializing inserts. The API exposes typed responses and safe errors; Angular uses the generated client and shows the results in accessible, keyboard-operable forms and grids.

## Project Structure

### Documentation (this feature)

```text
specs/002-document-setup-master/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── document-setup-api.md
```

### Source Code (repository root)

```text
Spec-Driven-Development/
├── SDD.API/
│   ├── SDD.API/
│   │   ├── Controllers/                 # DocumentSetupsController
│   │   ├── Contracts/                  # Typed request/response/filter contracts
│   │   ├── Data/                       # Database-first entities and context extension
│   │   └── Services/                   # Document setup repository and service
│   └── SDD.API.Tests/                  # xUnit controller/service tests
└── sdd-ui/
    ├── src/app/features/document-setup/
    │   ├── pages/                      # List, parent add/edit, child add/edit
    │   ├── components/                 # Reusable feature-specific controls
    │   ├── forms/                      # Typed form definitions and mapping
    │   └── services/                   # API and feedback orchestration
    └── e2e/                            # Playwright Document Setup coverage
```

**Structure Decision**: Use the existing two-project web application layout. Keep generated Angular API code under `sdd-ui/src/app/api/generated`; never hand-edit it. Add no new project, database context connection, package, or backend test framework. New entity mappings must follow the database-first convention and keep generated files distinct from handwritten extensions.

## Complexity Tracking

No constitutional violations or extra projects, libraries, or services are proposed. The required Oracle table lock is the smallest schema-free serialization mechanism for the user-selected global `MAX(DAMOD_UID) + 1` allocation; its impact and safeguards are recorded in the research and decision documents.
