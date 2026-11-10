# Implementation Plan: Claim Configuration Master (CCM)

**Branch**: `003-claim-configuration-master` | **Date**: 2026-11-10 | **Spec**: [spec.md](./spec.md)

**Input**: Approved CCM specification and owner clarifications.

## Summary

Add a Claim Configuration Master listing and parent detail page with lookup-backed fields, plus Applicable Products mappings managed from the saved parent's detail page. Use the existing Angular/.NET/Oracle architecture, fixed company code `CCM001`, the existing CCM tables, and lookup values from `STD_LIST_ITEM`. Preserve existing Codes Master and Document Setup behavior.

## Technical Context

**Language/Version**: C#/.NET 10; TypeScript/Angular 21.

**Primary Dependencies**: Existing ASP.NET Core MVC/API, EF Core Oracle provider, Angular Material, `ng-openapi-gen`, xUnit, Angular test runner, and Playwright. No new dependencies.

**Storage**: Existing Oracle 19c schema `IIRIS_RD_DEVP`; tables `BRM_CLM_CONFIG`, `BRM_CCM_PROD`, and `STD_LIST_ITEM`. Use the existing `CodesMasterContext` and its configured connection.

**Testing**: Existing .NET xUnit test project, Angular unit tests, Playwright end-to-end tests, and regression tests for Codes Master and Document Setup.

**Target Platform**: Existing local-machine Angular web application and .NET API.

**Project Type**: Existing web application with an Angular frontend, .NET API, and Oracle persistence.

**Performance Goals**: No CCM-specific latency or throughput target was supplied. Keep list filtering, sorting, and pagination server-side and follow existing page-size limits.

**Constraints**: Do not create or alter database objects; only Claim Config Code and Claim Config Name are required, and blank optional values persist as NULL against the verified development schema; do not change Codes Master or Document Setup behavior; do not add packages, another database connection, authentication, or authorization dependencies; do not edit generated API clients manually; preserve current authorization middleware and configuration.

**Scale/Scope**: One parent CCM listing and form, the existing parent's product mappings, and eight lookup types. Parent listing pages contain 10 records by default, with the existing supported page sizes. Child mapping filters apply to the loaded child collection without pagination.

## Constitution Check

*Gate: pass before design and re-check after design.*

| Constitution rule | Plan compliance |
|---|---|
| Specification first; unclear behavior resolved before planning | CCM spec and owner decisions are recorded in [spec.md](./spec.md). |
| Simplicity and no speculative architecture | Reuse current Angular/API/repository/Oracle patterns; add no framework, service, or database connection. |
| Automated tests prove new behavior | Add API, Angular, and Playwright coverage and existing-feature regression coverage; see [quickstart.md](./quickstart.md). |
| Validate external input and show errors | Require only Claim Config Code and Claim Config Name; validate lengths, numeric precision, Y/N values, lookup choices, filters, and duplicate keys; return safe ProblemDetails and visible UI feedback. |
| Protect secrets and log failures safely | Reuse existing secret/config handling; do not add credentials to files or expose exception detail. |
| Database-first, no migrations or schema changes | Map only the supplied existing schema through the current context's partial extension; no DDL or EF migrations. |
| Controllers, DTOs, cancellation, and ProblemDetails | Follow current typed controller/service/repository patterns, propagate `CancellationToken`, and use existing error handling. |
| Generated typed Angular API | Add CCM operations to the existing canonical OpenAPI source and run configured `ng-openapi-gen`; never edit generated client files. |
| Angular standalone/OnPush/signals/typed forms | Follow existing feature components, shared controls, and generated models. |
| Preserve unrelated behavior | Limit routes, dependencies, and behavior changes to CCM; run Codes Master and Document Setup regressions. |

**Gate result**: PASS. No constitution exceptions are required.

**Post-design gate result**: PASS. The design uses the existing solution structure and database objects, includes automated validation and regression tests, and adds no dependencies or unrelated changes.

## Phase 0: Research

Research decisions and alternatives are recorded in [research.md](./research.md). The design reuses the existing codes/document API conventions, the sole Oracle context, canonical OpenAPI generation, exact owner-provided lookup mappings, and Oracle key/audit rules.

## Phase 1: Design and Contracts

- [Data model](./data-model.md): CCM parent, product mapping, lookup fields, keys, constraints, validation, and audit lifecycle.
- [API contract](./contracts/claim-configuration-api.md): list, parent CRUD, child CRUD, lookup, paging, and error shapes. During implementation, add these operations to the existing canonical `specs/001-codes-master/contracts/codes-master.openapi.yaml` before client generation.
- [Quickstart](./quickstart.md): build, automated tests, regression, and end-to-end validation steps.

## Project Structure

### Documentation (this feature)

```text
specs/003-claim-configuration-master/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── claim-configuration-api.md
```

### Source Code

```text
Spec-Driven-Development/
├── SDD.API/
│   ├── SDD.API/
│   │   ├── Contracts/                 # CCM request/response and filter types
│   │   ├── Controllers/               # CCM and lookup endpoints
│   │   ├── Data/                      # Existing-table entity partials and context mapping
│   │   └── Services/                  # Validation, query, service, and repository
│   └── SDD.API.Tests/                 # xUnit CCM tests and regression suite
└── sdd-ui/
    ├── src/app/features/claim-configuration/
    │   ├── components/
    │   ├── forms/
    │   ├── pages/
    │   └── services/
    ├── src/app/api/generated/         # Regenerated only from canonical OpenAPI
    ├── src/app/app.routes.ts
    └── e2e/                           # Playwright CCM workflows
specs/001-codes-master/contracts/
└── codes-master.openapi.yaml          # Existing canonical generator input
```

**Structure Decision**: Extend the existing single Angular application and .NET API in place. The CCM feature gets its own UI feature area and follows the current API contracts, controllers, services, repositories, entity mappings, shared Oracle context, and tests. Existing generated code remains generator-owned.

## Implementation Boundaries

- Keep `CCM_COMP_CODE` fixed to `CCM001` in server-side persistence; never accept it from a request.
- Use `LI_CODE` and `LI_DESC` for dropdown value and description respectively. Query each exact `LI_TYPE`, including `CCM_DFLT_RECV_DEDU` for Dflt Recovery Code for Dedl and `CCM_PRODUCT` for Applicable Products. New choices include only active lookup rows; edits retain and display a saved inactive value without offering it as a new choice.
- Parent and child update requests include an expected-version token. Reject stale updates without overwriting newer values and ask the user to reload.
- Honor the primary and unique keys already supplied. Use database conflict handling for races; do not add DDL.
- Serialize parent deletion against child creation by locking the parent row during the child-existence check and delete, within one Oracle transaction. Child creation must use the same parent lock before inserting.
- When a child's product is edited, update the existing mapping identified by its original composite key; reject a duplicate target key and preserve its creation audit values.
- Determine actual Oracle string length semantics from `ALL_TAB_COLUMNS` at save time before validating submitted values; do not assume BYTE or CHAR semantics when development-database metadata is unavailable.
- Keep the child section hidden until parent creation succeeds. Do not stage product mappings against an unsaved parent.
- Reuse the shared column filter control for Product Code and Product Name. Apply its six operators case-insensitively with AND semantics to the already-loaded child collection; do not add child pagination or server-side filter parameters.

## Complexity Tracking

No constitution violations or additional architectural complexity are introduced.
