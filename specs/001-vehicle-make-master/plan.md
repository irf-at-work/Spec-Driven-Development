# Implementation Plan: Vehicle Make Master

**Branch**: `001-vehicle-make-master` | **Date**: 29-Oct-2026 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-vehicle-make-master/spec.md`

## Summary

Build a trusted vehicle-make master list for insurance brokers. Brokers can find, add, view, edit, and permanently delete makes, with Make Code as the immutable unique key, data normalized and validated when saved, and all list filtering and sorting applied before pagination. In plain English, the Angular page sends typed requests to the .NET API; the API validates and normalizes entries, then reads or writes the approved Oracle master table. The API publishes its OpenAPI description and the UI client is generated from that description.

## Technical Context

**Language/Version**: C# / .NET 10; Angular 22 / TypeScript 6.0 (as already declared in the UI project; constitution v1.0.2 aligned to match)

**Primary Dependencies**: Existing ASP.NET Core OpenAPI 10.0.14 and Prettier 3.8.1; proposed Oracle.EntityFrameworkCore 10.23.26400, Angular Material/CDK 22.2.5 (MIT), Angular ESLint schematics 22.6.0 (MIT), NSwag.MSBuild 14.7.1 for generated TypeScript API client, API test host, XUnit, and Playwright; package additions/updates require owner approval. Use the .NET SDK's built-in `dotnet format` for C# formatting.

**Storage**: Oracle 19c, Database-First; existing database schema and connection are not present in the repository. No migrations; do not make DDL or data changes without owner approval.

**Testing**: XUnit API/unit tests and Playwright end-to-end tests, neither test project nor Playwright setup is present yet. Proposed packages and versions are listed in research.md and require approval.

**Target Platform**: Local machine; .NET 10 API, Angular browser UI, Oracle 19c database

**Project Type**: Web application with an ASP.NET Core API and Angular UI

**Performance Goals**: No latency or throughput target is specified. Queries must filter and sort the full matching record set in the database, then return a page of 10 records.

**Constraints**: Search Make Code, Make Name, and Short Name; allow-list those sortable fields; default to Make Code ascending. Enforce all validation on save. Return the shared `PaginatedResult<T>`; non-success API responses use `ProblemDetails`. Generated API types only; no hand-authored duplicate models. Hard delete requires confirmation. No authentication or permission checks in this feature.

**Scale/Scope**: One master-data workflow; 10 rows per page; no specified record-count or concurrent-user target. This phase implements vehicle-make CRUD only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Feature spec is user-focused, prioritized, and has testable acceptance scenarios.
- [x] Scope is limited to one master-data CRUD workflow; no speculative features or layers are proposed.
- [x] Plan and quickstart explain the design in plain English and give owner-verifiable steps.
- [x] API shape follows controllers, DTOs, typed return values, shared pagination, global `ProblemDetails`, and no controller/action Swagger attributes.
- [x] Angular design follows standalone components, OnPush, signals, `inject()`, signal inputs/outputs, built-in control flow, strict typing, typed reactive forms, and one HTTP error interceptor.
- [x] Database design is Database-First, uses Oracle EF Core, avoids migrations and scaffolded-file edits, and requires explicit approval before schema/data changes.
- [x] XUnit and Playwright coverage is planned; tests remain an implementation requirement.
- [x] Formatter and linter gates are planned for C# and Angular/TypeScript, with Prettier used for formatting and Angular ESLint for linting.
- [x] Timestamped success/failure logging, secret/privacy exclusions, and a technical decision record are covered by implementation tasks.
- [x] **Framework version resolved.** Constitution amended to v1.0.2 (Angular 22), matching `sdd-ui/package.json` (Angular 22.2, TypeScript 6.0). No downgrade is needed.
- [ ] **Implementation gate: package approval.** Oracle provider, Angular Material/CDK, Angular ESLint, OpenAPI client generation, API test host, XUnit, and Playwright dependencies are not all present. Purpose, alternatives, and license details are in `research.md`; obtain owner approval before adding/updating packages.
- [ ] **Implementation gate: Oracle change approval and access.** Confirm access to the intended Oracle 19c schema and approve any required DDL before scaffolding. The owner has described table `BRM_VEH_make` (primary key `VMAK_CODE`); constraints, column defaults and character-versus-byte length semantics must still be confirmed against the live schema. Do not create or alter tables without approval.

**Gate result**: The design follows the constitution, but implementation is not authorized until the two unchecked gates are resolved. No packages, database schema, or database data were changed during planning.

## Project Structure

### Documentation (this feature)

```text
specs/001-vehicle-make-master/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/vehicle-makes-api.md
```

### Source Code (repository root)

```text
Spec-Driven-Development/
├── SDD.API/SDD.API/
│   ├── Controllers/VehicleMakesController.cs
│   ├── DTOs/VehicleMake*.cs
│   ├── Contracts/PaginatedResult<T>.cs    # shared list response required by constitution
│   ├── Services/VehicleMakeService.cs
│   └── [database-first context and entities generated after schema approval]
├── SDD.API/SDD.API.Tests/                # new, after package approval
├── sdd-ui/src/app/                       # list, detail/form, and routing
├── sdd-ui/src/app/generated/             # generated API client; never hand-edit
└── tests/vehicle-make-e2e/               # new Playwright tests, after approval

docs/decisions/vehicle-make-master.md     # significant technical decisions
```

**Structure Decision**: Extend the existing two-project web application. Keep HTTP concerns in one controller, validation/query/normalization in one feature service, and persistence in the database-first context. Use request/response DTOs and the generated Angular client. Do not introduce a repository layer unless implementation proves one is necessary. Test projects and a single root test runner are new and should be added only after package approval.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | No justified constitution exception is proposed. | Not applicable. |

## Post-Design Constitution Check

The Phase 1 model and contract preserve database-first scaffolding, API response typing, shared pagination, ProblemDetails errors, generated Angular types, user-confirmed hard deletion, automated tests, formatting/lint checks, timestamped error/action logging, and decision documentation. The package approval, Oracle provider/license and schema access, and any required DDL approval gates remain open. The authorization-scope conflict identified in analysis is intentionally unchanged and excluded from this remediation at the user's direction.
