# Implementation Plan: Shared Dashboard Foundation

**Branch**: `001-shared-dashboard-foundation` | **Date**: 2026-10-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-shared-dashboard-foundation/spec.md`

## Summary

Generate application representations of the existing `STD_COMPANY`, `STD_DEPARTMENT`, and `STD_LIST_ITEM` tables with EF Core Database-First, using the `BrokerConnection` configuration key without printing or embedding its value. Add one reusable `PaginatedResult<T>` response type. Replace the starter screen with a shared responsive dashboard shell whose only top-level menu is Masters, and whose two destinations are Company Master and Listing Master. Use the constitution's Angular 21 baseline and Angular Material, with shared global styles for repeated controls. This feature does not alter database tables or implement either master area's CRUD workflows.

## Technical Context

**Language/Version**: C# on .NET 10; Angular 21 is the selected target and the frontend manifest and lockfile are aligned to Angular 21.

**Primary Dependencies**: ASP.NET Core controllers and OpenAPI; Oracle.EntityFrameworkCore 10.23.26400 and EF Core Design/dotnet-ef 10.0.14; Angular Router and Angular Material 21.2.14; xUnit, Playwright for .NET, and Vitest as specified by the constitution. The Angular and .NET test projects and the repository test runner are in place.

**Storage**: Existing Oracle 19c schema. The three named tables are authoritative; this feature performs reverse engineering only and makes no DDL or data changes.

**Testing**: xUnit for backend unit tests; Playwright for .NET with xUnit for each user story's end-to-end coverage; Vitest for Angular unit tests. Add a single documented PowerShell test entry point to run the applicable suites and propagate failures.

**Target Platform**: Local-machine web application, with the Angular UI and .NET API running locally.

**Project Type**: Web application with a .NET API and Angular frontend.

**Performance Goals**: Meet the feature's measurable outcomes; no additional throughput or latency target is specified.

**Constraints**:

- Follow the approved specification and constitution; all user-facing text is en-GB.
- Keep generated EF Core entities and context unedited. Use partial classes for any later extensions; do not use EF migrations.
- Pass the named connection-string configuration key to the EF command, never its value. The generated context must not contain connection configuration.
- Explicitly include only the three named tables in the scaffold command; do not combine table filters with a schema-wide filter. Do not use overwrite/force options on the initial scaffold.
- Treat scaffolding as read-only against Oracle. Do not run it until dependencies and safe local credential configuration are verified.
- Keep Angular core, CLI, Material, and CDK on compatible, pinned Angular 21 versions. The package changes were approved and recorded in `docs/decisions/shared-dashboard-dependencies.md`.
- Keep the dashboard shell shared and the two master destinations as navigation placeholders only; each master page and its CRUD behaviour has its own feature specification.
- Before either master-page feature begins, deliver the constitution's other shared foundations (global API exception handler, global Angular HTTP error interceptor, and migration/script runner) once for reuse. They are separate prerequisites, not scope added to this feature; the runner must not introduce EF migrations contrary to B8.
- Confirm the named database-scaffolding owner required by B10 before running the EF command.
- Do not add authentication, speculative database changes, migrations, or hand-written duplicate API models.

## Constitution Check

### Pre-design gate

| Principle                                                                        | Status | Plan application                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Specification-first and testable acceptance criteria (Articles 1, 4)             | PASS   | The approved spec is the source of truth; automated tests are planned for each user story.                                                                                                                                                                     |
| Simplicity, understandable design, and current documentation (Articles 2, 3, 11) | PASS   | Reuse the existing API and Angular apps, keep the shell shared, explain operation in the quickstart, and record no new architectural layer.                                                                                                                    |
| Configuration and secret handling (Articles 6, 7)                                | PASS   | Use `Name=ConnectionStrings:BrokerConnection` with the credential supplied through the Windows user environment; do not print the value or include it in generated code. The user confirmed the credential previously shared in chat was rotated.              |
| Error visibility, logging, and human control (Articles 8, 9)                     | PASS   | Surface scaffold/build/test failures; no database writes or irreversible actions are in scope.                                                                                                                                                                 |
| Branch and scope discipline (Article 10)                                         | PASS   | Work remains on the feature branch and excludes unrelated starter cleanup.                                                                                                                                                                                     |
| .NET 10, Oracle 19c, Angular 21, approved dependencies (B2, B4)                  | PASS   | Angular, test, and EF Core dependencies are aligned, pinned, and approved. The three requested Oracle tables have been scaffolded read-only.                                                                                                                   |
| Test coverage and one documented test command (B5)                               | PASS   | The shared dashboard, presentation, pagination, and generated-table mappings have xUnit, Playwright, and Vitest coverage through the single PowerShell runner.                                                                                                 |
| API response and database-first rules (B6, B8)                                   | PASS   | Keep controllers and typed responses; use EF Core reverse engineering only, no migrations, no generated-file edits, and no DB changes.                                                                                                                         |
| Angular component, routing, styling, and accessibility rules (B7, B8)            | PASS   | Use standalone OnPush components, typed routes, shared styles, and Angular Material 21 with keyboard-accessible menu controls.                                                                                                                                 |
| Shared-first workflow (B10)                                                      | PASS   | This feature delivers pagination, the shared layout, and read-only table scaffolding. The global exception handler, global HTTP error interceptor, and a non-EF-migrations script runner remain separate shared foundations before either master-page feature. |

No constitutional exception is proposed. The database scaffold is complete using the approved local environment configuration; no database writes or schema changes were made.

## Project Structure

### Documentation (this feature)

```text
specs/001-shared-dashboard-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── paginated-result.schema.json
└── tasks.md                         # Created by /speckit-tasks
```

### Source Code (repository root)

```text
Spec-Driven-Development/
├── SDD.API/
│   ├── SDD.API/
│   │   ├── Common/
│   │   │   └── PaginatedResult.cs
│   │   ├── Data/
│   │   │   ├── BrokerDataContext.cs             # EF-generated
│   │   │   └── Entities/                        # EF-generated
│   │   └── SDD.API.csproj
│   ├── SDD.API.Tests/                           # New xUnit unit-test project
│   └── SDD.API.E2E.Tests/                       # New Playwright/xUnit project
├── sdd-ui/
│   └── src/
│       ├── styles.css                           # Shared theme/table/form rules
│       └── app/
│           ├── app.routes.ts                    # Dashboard and two master routes
│           ├── layout/                          # Shared shell and Masters menu
│           └── app.spec.ts                      # Vitest component coverage
└── scripts/
    └── test.ps1                                  # Single documented test entry point
```

**Structure Decision**: Retain the repository's existing split API/UI layout. Put the generic response type under the API's shared/common area, EF-generated output under a dedicated data area, and the navigation shell in a shared Angular layout. Keep global style tokens and genuinely cross-page control styles in `sdd-ui/src/styles.css`; keep shell-specific layout styles alongside the shell. Add only the test projects required by the constitution.

## Implementation Design

### Database reverse engineering

Run EF Core's `dbcontext scaffold` from the API project using `Name=ConnectionStrings:BrokerConnection`; never put the connection-string value in the command. Select only `STD_COMPANY`, `STD_DEPARTMENT`, and `STD_LIST_ITEM`; generate `BrokerDataContext` and entity files in the planned data directories. Use `--no-onconfiguring` so generated code does not retain connection configuration. Do not specify `--force`; inspect the generated diff before accepting it. The database is the source of truth for columns, keys, and relationships, which are not guessed in this plan.

### Shared pagination

Add a public, generic, inheritable `PaginatedResult<T>` response model with the four required values: `Items`, `Page`, `PageSize`, and `TotalCount`. ASP.NET's configured JSON conventions expose the agreed lower-camel-case JSON names. Keep the type focused on response data; list endpoints remain responsible for applying filtering, counting all matches before paging, and supplying a page size of 10 when omitted. Use DTO item types rather than exposing generated database entities as API models. Do not add list endpoints to this feature.

### Dashboard and shared styles

Use a shared standalone OnPush layout with a sticky floating header and a single top-level Masters menu. Follow the constitution's Angular component rules: signals, `inject()`, signal-based inputs/outputs when applicable, and built-in `@if`/`@for` control flow. Provide exactly two router destinations, Company Master and Listing Master; render lightweight destination placeholders because full master-page features are out of scope. Use Angular Material's accessible menu/toolbar primitives and ensure keyboard and focus operation. Create a restrained blue palette and shared global table/input conventions, while keeping layout-specific styling local. At narrow widths, preserve readable labels and usable navigation without horizontal overlap.

### Verification

Cover pagination metadata/default behavior and generated-table mapping boundaries with xUnit tests that do not alter development data. Cover dashboard navigation and responsive/keyboard interaction with Playwright, and shared Angular components with Vitest. The documented PowerShell test entry point must run the suites and fail if any suite fails. Validate the frontend at the Angular 21 baseline; do not mix Angular 21 and 22 packages.

## Constitution Check (post-design)

| Gate                                                         | Result | Evidence                                                                                                                                                                                                             |
| ------------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirements remain the source of scope                      | PASS   | Design implements only the four spec stories and preserves the two master-page boundaries.                                                                                                                           |
| No unjustified architecture or dependency                    | PASS   | Reuses the existing projects and the approved, pinned Oracle/Material/test tooling.                                                                                                                                  |
| Generated database code remains database-first and protected | PASS   | Explicit table allowlist, no schema writes, no `--force`, and no edits to generated files.                                                                                                                           |
| Secret and data safety                                       | PASS   | The read-only command used the configuration name and `--no-onconfiguring`; the credential is supplied via the approved local environment and is absent from generated code.                                         |
| Required automated verification is feasible                  | PASS   | Unit, end-to-end, and frontend tests pass through the repository test runner, including generated-table mapping coverage.                                                                                            |
| Angular requirements match the selected baseline             | PASS   | Angular 21 packages are pinned and aligned; the shared shell uses standalone OnPush components and Angular Material.                                                                                                 |
| Shared pieces precede master-page work (B10)                 | PASS   | The shared layout, pagination, and read-only scaffold are implemented. The global error handler, HTTP interceptor, and non-migrations script runner remain separate prerequisites before either master-page feature. |
| Plain-English operation instructions                         | PASS   | `quickstart.md` describes setup, validation, and expected results without duplicating implementation details.                                                                                                        |

No gate is waived. The toolchain prerequisites and read-only scaffold are complete.

## Complexity Tracking

No constitutional violations or extra architectural components are proposed. The test-runner script is the minimal way to satisfy the requirement that all automated suites have one documented invocation.
