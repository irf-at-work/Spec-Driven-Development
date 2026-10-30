# Implementation Plan: Vehicle Make Master

**Branch**: `001-vehicle-make-master` | **Date**: 29-Oct-2026 (revised 30-Oct-2026: column filters, model pages, icons, typography) | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-vehicle-make-master/spec.md`

## Summary

Complete the vehicle-make master workflow and add vehicle-model maintenance on dedicated pages. Brokers can browse, add, view, edit, deactivate/reactivate, and permanently delete makes and models; make and model codes are immutable unique keys in their respective scopes. In plain English, the Angular page sends typed requests to the .NET API; the API validates and normalizes entries, then reads or writes the approved Oracle tables. Models belong to one make, and their nine optional coded fields use fixed lookup lists. Per-column filters (starts with, ends with, contains, equals, not equals; the single search box is removed), sorting and paging for makes, and per-column filters and paging for models, are applied on the server. The API publishes its OpenAPI description and the UI client is generated from that description.

## Technical Context

**Language/Version**: C# / .NET 10; Angular 22 / TypeScript 6.0 (as already declared in the UI project; constitution v1.0.2 aligned to match)

**Primary Dependencies**: Existing ASP.NET Core OpenAPI 10.0.14, Oracle.EntityFrameworkCore 10.23.26400, NSwag.MSBuild 14.7.1, Angular Material/CDK 22.2.5, Angular ESLint, Prettier, XUnit v3, ASP.NET Core test host, and Playwright Test 1.64.1. **Proposed new packages (owner approval and manual install required, constitution B4)**: `sweetalert2` (notifications and confirmations, wrapped in one shared service), `@fontsource/inter` and `@fontsource/noto-sans-arabic` (self-hosted typefaces, so they work offline), and one self-hosted icon-font package for Material icons (for example `@fontsource/material-symbols-outlined`; the owner confirms the choice). Exact versions and licences are recorded in `research.md` and `docs/decisions/vehicle-make-master.md` when the owner installs them. No other package is proposed. Any future package change still requires owner approval under constitution B4. Use the .NET SDK's built-in `dotnet format` for C# formatting.

**Storage**: Oracle 19c, Database-First. The repository has an existing scaffold for `BRM_VEH_MAKE`; the `BRM_VEH_MODEL` and `STD_LIST_ITEM` mappings and their live constraints must be verified before use. No migrations; do not make DDL or data changes without owner approval.

**Testing**: An XUnit API test project and Angular tests exist; Playwright Test is installed, but feature end-to-end coverage and its complete local-run setup remain implementation work. Test every make/model acceptance flow at the API boundary and in the browser.

**Target Platform**: Local machine; .NET 10 API, Angular browser UI, Oracle 19c database

**Project Type**: Web application with an ASP.NET Core API and Angular UI

**Performance Goals**: No latency or throughput target is specified. Queries must filter and sort the full matching record set in the database, then return a page of 10 records.

**Constraints**: Filter Make Code, Make Name, Short Name and Status by column, with operators starts with, ends with, contains (default), equals and not equals (Status: equals and not equals only); filters are case-insensitive, combine with AND, treat typed characters as plain text, and apply to all records before paging. Models get the same filters but no sorting. Allow-list the sortable fields and the operators; default to Make Code ascending. Return shared `PaginatedResult<T>` for makes and models, with a page size of 10. Enforce validation on save. Use `ProblemDetails` for failures and generated API types only. Confirm permanent deletion; refuse make deletion while models remain. Keep lookup options unpaged only after the owner-approved constitution C3 exception is recorded. Authentication is out of scope under B9.

**Scale/Scope**: One master-data workflow with make CRUD and model CRUD on dedicated pages; make/model lists are limited to 10 rows per page. Lookup options are small and returned in one unpaged response. No record-count, latency, throughput, or concurrent-user target is specified.

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
- [x] **Package scope (changed 30-Oct-2026).** The design now proposes `sweetalert2`, `@fontsource/inter`, `@fontsource/noto-sans-arabic` and an icon-font package. Owner approval and manual installation under B4 are required before the tasks that use them (T044 onwards).
- [ ] **Implementation gate: Oracle schema and access.** Confirm access to the intended Oracle 19c schema and verify make/model keys, the non-cascading model foreign key, list-item keys/data, defaults, audit behavior, and character-versus-byte length semantics. Do not scaffold new tables, run DDL, or mutate data without explicit owner approval.
- [ ] **Implementation gate: constitution C3 exception.** Before implementation, record the owner-approved exception for the single unpaged model-options lookup under C3, as required by the spec and constitution.

**Gate result**: The design is complete and the unpaged lookup has explicit owner approval in the spec. Implementation remains blocked until the schema/access checks and the formal C3 exception entry are complete; no database changes were made during this planning update.

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
│   ├── Controllers/VehicleModelsController.cs       # nested routes under a make
│   ├── Controllers/VehicleModelOptionsController.cs
│   ├── DTOs/VehicleMake*.cs and VehicleModel*.cs
│   ├── Contracts/PaginatedResult<T>.cs
│   ├── Services/VehicleMakeService.cs and VehicleModelService.cs
│   └── Data/Scaffolded/                             # database-first entities; generated files stay untouched
├── SDD.API/SDD.API.Tests/                           # existing XUnit project; extend with make/model coverage
├── sdd-ui/src/app/features/vehicle-makes/           # existing list/form; model list on the make page; separate model add/edit page
├── sdd-ui/src/app/shared/                           # column-filter control, notification service (wraps SweetAlert2)
├── sdd-ui/src/app/generated/                        # generated API client; never hand-edit
└── tests/vehicle-make-e2e/                          # Playwright acceptance coverage

docs/decisions/vehicle-make-master.md     # significant technical decisions
```

**Structure Decision**: Extend the existing API/UI projects and their test infrastructure. Use nested model routes so the make key comes from the route, keep model CRUD separate from unsaved make edits, and expose lookup options through one fixed, read-only endpoint. Use DTOs and the generated Angular client. Keep persistence in the database-first context and do not add a repository layer without demonstrated need. Column filters are one allow-listed filter definition per list (column, operator, text) turned into the database query on the server, never built from raw text. Models are added and edited on their own routes, which need a get-one-model endpoint so a page can load by key. All user messages and confirmations go through one notification service, so screens never call the SweetAlert2 library directly.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| B8 requires listings to be paged; the nine small model lookup lists are unpaged (spec-approved exception; C3 entry is a pre-implementation gate). | FR-021 requires dropdown choices from fixed list types. One small read-only response avoids nine requests and paging controls for lookup selections. | Paging each lookup would add UI and API complexity without a specified large lookup volume; the owner chose the unpaged behavior. |
| B8 names Angular Material as the primary UI library; SweetAlert2 is added for notifications and confirmations (owner preference, 30-Oct-2026). | The owner wants one consistent notification and confirmation style across the app. | Restyling Material snackbars and dialogs would avoid a second library, but the owner prefers SweetAlert2. It is used only through one shared service and never with raw HTML. |

## Post-Design Constitution Check

The Phase 1 model and contract preserve database-first scaffolding, typed API responses, shared pagination for make/model browsing lists, `ProblemDetails`, generated Angular types, confirmed hard deletes, validation, automated tests, formatting/lint checks, timestamped logging, and decision documentation. The unpaged options lookup is an owner-approved exception but must be formally recorded under C3 before implementation. Oracle schema/access verification and any required DDL approval remain implementation gates. Authentication remains out of scope under B9.
