# Implementation Plan: Premium Adjustment Master

**Branch**: `002-premium-adjustment-master` | **Date**: 29-Oct-2026 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-premium-adjustment-master/spec.md`

## Summary

Provide brokers with one trusted master list for premium discounts, loadings, and excess additions. The Angular UI will load the active standard dropdown choices, then send typed requests to the .NET API. The API validates the composite key and required values, normalizes English text, preserves Arabic text, and reads or writes the approved Oracle master tables. The API's OpenAPI document remains the source for the generated Angular client. List filtering and sorting happen across all matching database records before pagination.

## Technical Context

**Language/Version**: C# / .NET 10; Angular 21 / TypeScript (current UI project declares Angular 22.2 and TypeScript 6.0; alignment requires owner approval)

**Primary Dependencies**: Existing ASP.NET Core OpenAPI 10.0.14; proposed Oracle.EntityFrameworkCore 10.23.26400, Angular Material/CDK 21.2.0, NSwag.MSBuild 14.7.1, xunit.v3 4.0.2, Microsoft.NET.Test.Sdk 18.11.0, Microsoft.AspNetCore.Mvc.Testing 10.0.14, and @playwright/test 1.64.1. All package additions/updates require owner approval.

**Storage**: Oracle 19c, Database-First. Physical adjustment/lookup schemas and connection settings are not present in the repository. No EF migrations; no schema or data changes without owner approval.

**Testing**: XUnit API/unit tests, Angular tests, and Playwright end-to-end tests. The repository currently has no API test project or Playwright setup; approvals and setup tasks are documented in research.md.

**Target Platform**: Local machine; .NET 10 API, Angular browser UI, and Oracle 19c

**Project Type**: Web application with an ASP.NET Core API and Angular UI

**Performance Goals**: No latency, throughput, or record-count target is specified. Queries must filter and sort the full matching set before returning 10 records per page.

**Constraints**: Unique key is Code Type + Code + Company Code. Code Type filters the list; search and allowed sorting span Code Type, Code, Company Code, Name, and Short Name across all records. New and updated records require Discount Type, Charges Type, and Charges Category. Lookup choices are independent of Code Type, active only, and ordered by description. Every listing endpoint, including lookups, returns shared `PaginatedResult<T>` with page size 10; the UI loads all pages of lookup values. Non-success API responses use `ProblemDetails`. Preserve generated client types, use confirmation for permanent deletion, and do not implement authentication or permissions in this feature.

**Scale/Scope**: One adjustment-code master workflow and four read-only standard-list dropdowns. List page size is 10. No volume or concurrency target is specified.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Feature spec is user-focused and its four prioritized stories include independently testable acceptance scenarios.
- [x] Scope is limited to adjustment-code CRUD and read-only retrieval of the four standard lists; no lookup CRUD or unrelated policy workflow is added.
- [x] This plan and quickstart explain the design in plain English and give owner-verifiable validation steps.
- [x] API design uses controllers, DTOs, typed return values, shared pagination, global `ProblemDetails`, and no controller/action Swagger attributes.
- [x] Angular design follows standalone components, OnPush, signals, `inject()`, signal inputs/outputs, built-in control flow, strict typing, typed reactive forms, one HTTP error interceptor, and generated API types.
- [x] Persistence follows Oracle Database-First; scaffolded files are not edited, migrations are not used, and any schema/data change requires owner approval.
- [x] XUnit, Angular, and Playwright coverage is planned; tests and the single test runner remain implementation requirements.
- [ ] **Implementation gate: framework mismatch.** Constitution requires Angular 21, but the current UI project declares Angular 22.2 and TypeScript 6.0. Aligning packages requires owner approval under B4.
- [ ] **Implementation gate: package approval.** Oracle provider, Material/CDK, client generation, API test host, XUnit, and Playwright packages are not all present. Purpose, alternatives, and license details are in `research.md`; obtain owner approval before any package change.
- [ ] **Implementation gate: Oracle schema and access.** Confirm the approved Oracle 19c schema contains the adjustment and four standard-list tables, and confirm connection access. Obtain explicit owner approval before any DDL or data mutation. Stop if the catalogs or required legacy relationships do not exist; do not invent schema.

**Gate result**: The proposed design follows the constitution. Implementation remains gated on package approval, Angular version alignment, and approved Oracle schema access. No packages or database objects/data were changed during planning.

## Project Structure

### Documentation (this feature)

```text
specs/002-premium-adjustment-master/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/premium-adjustments-api.md
```

### Source Code (repository root)
```text
Spec-Driven-Development/
├── SDD.API/SDD.API/
│   ├── Controllers/PremiumAdjustmentsController.cs
│   ├── Controllers/PremiumAdjustmentLookupsController.cs
│   ├── DTOs/PremiumAdjustment*.cs
│   ├── Contracts/PaginatedResult<T>.cs   # shared page response
│   ├── Services/PremiumAdjustmentService.cs
│   └── [database-first context/entities after approved schema inspection]
├── SDD.API/SDD.API.Tests/                # new, after package approval
├── sdd-ui/src/app/                       # list, detail/form, and routing
├── sdd-ui/src/app/generated/             # generated API client; never hand-edit
└── tests/premium-adjustment-e2e/         # new Playwright tests, after approval
```

**Structure Decision**: Extend the existing two-project web application. Keep adjustment CRUD and read-only lookup retrieval in focused controllers, with validation, normalization, filtering, and sorting in feature services. Use DTOs and the generated Angular client. Add the missing `PaginatedResult<T>` once as a shared API contract, not as a feature-local type. Use database-first scaffolding and partial classes only. Avoid a repository layer unless implementation demonstrates a concrete need. Add test projects and one root test runner only after package approval.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | No justified constitution exception is proposed. | Not applicable. |

## Post-Design Constitution Check

The Phase 1 data model and API contract preserve the composite business key, shared pagination, ProblemDetails errors, generated Angular types, Database-First scaffolding, active-only read-only lookups, confirmed permanent deletion, and test coverage. No new constitution conflict was introduced. The three implementation gates above remain open; do not begin implementation until resolved.
