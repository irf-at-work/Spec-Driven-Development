# Implementation Plan: Claim Configuration Master

**Branch**: `003-claim-config-master` | **Date**: 09-Nov-2026 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-claim-config-master/spec.md`

## Summary

Build a master-data workflow for maintaining Claim Configuration Master (CCM) records and their many-to-many product associations. The Angular UI will use the existing .NET API conventions to create, find, view, update, activate/deactivate, and associate products with CCM records. Oracle remains the source of record. John’s claim use case is served by making the product-to-CCM mapping maintainable and retrievable; transaction-time choice among multiple mappings remains out of scope.

In plain English: an employee saves a CCM, then uses its Applicable Products section to link product codes. Those links are what let the claim process identify configurations associated with a policy’s product. Product list source and database enforcement details need read-only verification before implementation.

## Technical Context

**Language/Version**: C# / .NET 10; Angular 22 / TypeScript 6.0.

**Primary Dependencies**: Existing ASP.NET Core OpenAPI, `Oracle.EntityFrameworkCore`, NSwag.MSBuild, Angular Material/CDK, RxJS, SweetAlert2 through shared notifications, and existing Playwright/XUnit dependencies. No new package is proposed.

**Storage**: Oracle 19c, Database-First through `Oracle.EntityFrameworkCore`. CCM table definitions and keys are supplied in the feature spec, but the CCM tables are not scaffolded in the checked-in application. No DDL, seed data, or database writes are part of planning.

**Testing**: XUnit API tests and Playwright end-to-end tests per the constitution; Angular checks use the existing project scripts. Plan artifacts document validation commands; no tests are run in this planning phase.

**Target Platform**: Local machine; .NET API, Angular browser UI, Oracle 19c.

**Project Type**: Web application with an ASP.NET Core API and Angular UI.

**Performance Goals**: No feature-specific latency or throughput target is supplied. CCM lists and linked-product rows are paged; filter and sort behavior follows the existing master-data conventions.

**Constraints**: CCM identity is stored with composite primary key `(CCM_COMP_CODE, CCM_CODE)`, while product mapping stores only CCM Code. The agreed business rule makes CCM Code globally unique, which must be verified in Oracle metadata and supported by a database uniqueness guarantee before writes are implemented. `CCM_COMP_CODE` comes from session context when available; until sign-in exists, the required configured fixed Company Code is `ASRTEST`. Applicable Products UI starts at five rows per page; the API retains the shared default of ten when no page size is supplied, and the UI requests five. Use existing shared filter/sort/page behavior, typed OpenAPI response shapes, `ProblemDetails`, and cancellation tokens. No transaction selection, missing-mapping, inactive-CCM, or payout behavior is designed here.

**Scale/Scope**: One CCM configuration master, its list/detail maintenance flow, and product association management. Product-choice volume is unknown because its source has not been located; lookup paging or unpaged loading cannot be finalized until the source and size are verified.

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

**Pre-implementation gates (not plan violations)**:

1. Read-only Oracle review identifies the authoritative product list and its product code/name fields, relevant active rule, and any list type values.
2. Read-only Oracle review verifies CCM keys, audit/default behavior, and whether `CCM_CODE` is globally unique. If it is not guaranteed, stop and obtain approval for the necessary schema decision before implementation.
3. Configure Company Code as `ASRTEST` for the no-login setup; validate the required setting at startup and do not hard-code it into source.
4. Dropdown `STD_LIST_ITEM.LI_TYPE` sources are identified for each CCM code/type setting.

No database changes or test runs were performed during planning.

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

See [research.md](research.md). Repository inspection establishes the stack and reusable UI/API patterns. It does not establish the product list source or the Oracle constraints for the CCM tables. These are documented as pre-implementation gates rather than guessed.

## Phase 1: Design

- [Data model](data-model.md) captures supplied table fields, relationships, identity rules, audit fields, and unresolved database enforcement checks.
- [API contract](contracts/claim-configurations-api.md) defines the proposed typed HTTP boundary, while marking product lookup details that depend on Oracle review.
- [Quickstart](quickstart.md) gives the owner local setup and validation steps without embedding implementation code.

**Post-design Constitution Check**: Pass, with the pre-implementation gates above. No unresolved contradiction with the Constitution remains; the product source and database uniqueness verification require owner-approved read-only inspection, and any schema change requires separate approval.

## Complexity Tracking

No Constitution exceptions or additional architectural layers are proposed.
