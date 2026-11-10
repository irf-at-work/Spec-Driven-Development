# Implementation Plan: Claim Configuration Master

**Branch**: `003-claim-config-master` | **Date**: 09-Nov-2026 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-claim-config-master/spec.md`

## Summary

Build a master-data workflow for maintaining Claim Configuration Master (CCM) records and their many-to-many product associations. The Angular UI will use the existing .NET API conventions to create, find, view, update, activate/deactivate, and associate products with CCM records. Oracle remains the source of record. John’s claim use case is served by making the product-to-CCM mapping maintainable and retrievable; transaction-time choice among multiple mappings remains out of scope.

In plain English: an employee saves a CCM, then uses its Applicable Products section to link product codes. Those links are what let the claim process identify configurations associated with a policy’s product. Product list source and database enforcement details need read-only verification before implementation.

## Technical Context

**Language/Version**: C# / .NET 10; Angular 22 / TypeScript 6.0.

**Primary Dependencies**: Existing ASP.NET Core OpenAPI, `Oracle.EntityFrameworkCore`, NSwag.MSBuild, Angular Material/CDK, RxJS, SweetAlert2 through shared notifications, and existing Playwright/XUnit dependencies. No new package is proposed.

**Storage**: Oracle 19c, Database-First through `Oracle.EntityFrameworkCore`. CCM table definitions and keys are supplied in the feature spec, but the CCM tables are not scaffolded in the checked-in application. An owner-approved unique-index script is prepared; the owner must apply and verify it before enabling writes. The implementation agent did not execute DDL or database writes.

**Testing**: XUnit API tests and Playwright end-to-end tests per the constitution; Angular checks use the existing project scripts. Plan artifacts document validation commands; no tests are run in this planning phase.

**Target Platform**: Local machine; .NET API, Angular browser UI, Oracle 19c.

**Project Type**: Web application with an ASP.NET Core API and Angular UI.

**Performance Goals**: No feature-specific latency or throughput target is supplied. CCM lists and linked-product rows are paged; filter and sort behavior follows the existing master-data conventions.

**Constraints**: CCM identity is stored with composite primary key `(CCM_COMP_CODE, CCM_CODE)`, while product mapping stores only CCM Code. The agreed business rule makes CCM Code globally unique; owner-pasted metadata verifies an existing valid unique index on `CCM_CODE`, so no new index is required. `CCM_COMP_CODE` comes from session context when available; until sign-in exists, the required configured fixed Company Code is `ASRTEST`. Product choices use the owner-approved `STD_LIST_ITEM` mapping in FR-036. Applicable Products UI starts at five rows per page; the API retains the shared default of ten when no page size is supplied, and the UI requests five. Use existing shared filter/sort/page behavior, typed OpenAPI response shapes, `ProblemDetails`, and cancellation tokens. No transaction selection, missing-mapping, inactive-CCM, or payout behavior is designed here.

**Scale/Scope**: One CCM configuration master, its list/detail maintenance flow, and product association management. Product-choice volume and source remain unknown and must be verified during the read-only data review. Pagination is settled: choice controls retrieve 10 items per page by default and allow later pages, consistent with constitution B8.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Spec and plan state the user value and testable scenarios; no claim transaction behavior is invented (Article 1).
- [x] Scope remains CCM master data and its product associations only (Article 2).
- [x] Plain-English summary and owner-verifiable validation path are included (Article 3).
- [x] Implementation must add XUnit and Playwright coverage for the accepted scenarios; test commands are documented (Article 4, B5).
- [x] Reuse installed dependencies and existing formatting/lint conventions; no package additions proposed (Article 5, B4).
- [x] Temporary Company Code `ASRTEST` is a required configuration value validated at startup, rather than a source-code literal (Article 6).
- [x] No secrets or external personal data are added to the plan (Article 7).
- [x] Use existing ProblemDetails handling and audit conventions; messages stay plain and do not expose server exceptions (Article 8, B6).
- [x] Confirm before irreversible deletion of an association; no external action is introduced (Article 9).
- [x] Work remains confined to the feature documentation and existing feature code areas (Article 10).
- [x] No new database schema changes are made or presumed approved. If Oracle review finds the agreed global unique rule is absent, obtain owner confirmation before any DDL (B8, C3).
- [x] API contracts will use declared return types; OpenAPI remains the generated Angular client source (B7/B8).
- [x] CCM association table UI requests page size five; API default remains ten to comply with B8.
- [x] CCM lookup-choice and available-product listing endpoints use shared paginated responses with default page size ten; no unpaged lookup exception is assumed (B8).

**Owner-directed implementation constraints (updated 2026-11-10)**: The owner directed implementation to skip T003 and avoid tests and database connections in this session. The owner has since directed that product choices use existing `STD_LIST_ITEM` rows because no product master is available. The approved application mapping is `LI_TYPE='CCM_PRODUCT'`, `LI_CODE` product code, `LI_DESC` description, active flag `Y`; see FR-036 and [research.md](research.md). The current product-row count has not been independently queried. Use owner-pasted CCM schema metadata and approved lookup types. Do not connect to Oracle or apply DDL/DML. `WritesEnabled` defaults to false.

**Implementation review (2026-11-10)**: Added application-owned CCM mappings, paginated CCM list/detail and setting-choice APIs, create/update service and controller routes, and Angular list/detail/create/edit pages. Save is disabled in the UI and write routes return 503 unless `ClaimConfiguration:WritesEnabled=true`; the setting defaults to false. Later owner-pasted metadata confirms the existing global unique index `UX_BRM_CLM_CONFIG_CCM_CODE` is valid on `CCM_CODE` alone, so the database uniqueness gate is satisfied; no DDL is needed. Product choice and link APIs and the Applicable Products section now use the owner-approved `CCM_PRODUCT` type in `STD_LIST_ITEM`; [ccm-product-choice-insert.sql](ccm-product-choice-insert.sql) prepares product choice rows but was not executed. Rounding Value defaults to zero for create requests and negative values are rejected by the API and form (FR-042/FR-043). The implementation agent did not connect to Oracle or apply database changes. Browser and pure input-rule coverage is authored but not run. `sdd-ui/src/app/generated/api-client.ts` was not changed; client regeneration and broader API association tests remain incomplete.

**Pre-implementation gates and constraints**:

1. Use the supplied complete CCM table field map, including BYTE storage limits, nullability, keys, defaults, and audit fields. Do not infer additional UI validation from storage limits.
2. T004 is passed from later owner-pasted metadata: the existing global unique index is valid on `CCM_CODE` alone. `SYS_C00132035` is a check constraint and is not the uniqueness evidence. Do not rerun the failed index creation statement; no database change is needed for this constraint.
3. Six lookup type names have owner approval. The full module list and recovery-deduction mapping remain incomplete.
4. Product source and mapping are owner-approved as `STD_LIST_ITEM` / `CCM_PRODUCT` under FR-036. Product rows and current eligible count remain unverified; do not claim the choices are seeded. The paginated API calculates count dynamically.
5. Keep lookup endpoints paginated with the shared `PaginatedResult<T>` default page size ten; choices must be reachable across pages.
6. Configure Company Code as `ASRTEST`, validate it at startup, and do not hard-code it into source.

No database changes or test runs were performed during implementation.

## Project Structure

### Documentation (this feature)

```text
specs/003-claim-config-master/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── claim-configurations-api.md
```

### Source Code (repository root)

```text
Spec-Driven-Development/
├── SDD.API/SDD.API/
│   ├── Controllers/       # CCM and lookup endpoints
│   ├── DTOs/              # request, list, detail and lookup shapes
│   ├── Services/          # validation, mapping and paged queries
│   └── Data/              # scaffolded Oracle entities plus partial mappings
├── SDD.API/SDD.API.Tests/ # API and service tests
├── sdd-ui/src/app/
│   ├── features/claim-configurations/
│   └── generated/api-client.ts  # generated from OpenAPI; never hand-edited
└── tests/claim-config-e2e/       # Playwright scenarios
```

**Structure Decision**: Follow the current two-project web application structure. Place CCM-specific API code alongside `PremiumAdjustments` and UI code alongside `premium-adjustments`; extend generated Oracle context/entities only through partial files. The actual scaffolded entity names must follow the verified Oracle schema after owner-approved schema review.

## Phase 0: Research

See [research.md](research.md). Repository inspection establishes the stack and reusable UI/API patterns. The product mapping is owner-approved and recorded in FR-036; seven setting lookup mappings remain subject to their read-only gate. The Oracle global uniqueness guarantee is verified from owner-pasted metadata; no schema change is required.

## Phase 1: Design

- [Data model](data-model.md) captures supplied table fields, relationships, identity rules, audit fields, and unresolved database enforcement checks.
- [API contract](contracts/claim-configurations-api.md) defines the typed HTTP boundary, including the owner-approved product choice mapping.
- [Quickstart](quickstart.md) gives the owner local setup and validation steps without embedding implementation code.

**Post-design Constitution Check**: Pass, with the remaining setting-lookup review gate. Product source is owner-approved and does not require a schema change. The global CCM Code uniqueness constraint is confirmed by owner-pasted database metadata. Any future schema change still requires separate approval.

## Complexity Tracking

No Constitution exceptions or additional architectural layers are proposed.
