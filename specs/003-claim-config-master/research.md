# Research: Claim Configuration Master

**Date**: 09-Nov-2026
**Branch**: `003-claim-config-master`

## Decision: Reuse the existing application stack and master-data patterns

**Decision**: Implement CCM within the existing .NET 10 API, Angular 22 UI, and Oracle 19c database-first application. Reuse the Vehicle Make and Premium Adjustment conventions for paged/filterable lists, typed forms, notifications, breadcrumbs, API validation, and generated clients. Do not add dependencies.

**Rationale**: These are the current project technologies in the constitution and application manifests. The Premium Adjustment workflow is the closest reference for list filters, typed forms, options endpoints, composite keys, and ProblemDetails behavior.

**Alternatives considered**: A new service or framework was unnecessary and would add complexity and packages without meeting an additional user need.

**Evidence**: `Spec-Driven-Development/SDD.API/SDD.API/SDD.API.csproj`, `Spec-Driven-Development/sdd-ui/package.json`, `Spec-Driven-Development/SDD.API/SDD.API/Controllers/PremiumAdjustmentsController.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/PremiumAdjustmentListQuery.cs`, and `Spec-Driven-Development/sdd-ui/src/app/features/premium-adjustments/`.

## Decision: Keep OpenAPI as the API-client source of truth

**Decision**: Define CCM API response and request types on controller actions and generate the Angular client from the API OpenAPI document. Do not hand-write a duplicate Angular data model.

**Rationale**: Constitution B7 requires generated types and strict Angular typing. The current project already has NSwag generation and a shared paginated result.

**Alternatives considered**: Hand-maintained client interfaces were rejected because they can drift from the API.

**Evidence**: `Spec-Driven-Development/SDD.API/SDD.API/Contracts/PaginatedResult.cs`, `Spec-Driven-Development/SDD.API/SDD.API/nswag.json`, and `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts`.

## Decision: Preserve database-first boundaries and require database review before mapping

**Decision**: Do not create or alter database tables during planning. First perform an owner-approved, read-only Oracle review of `BRM_CLM_CONFIG`, `BRM_CCM_PROD`, `STD_LIST_ITEM`, their indexes/constraints, and product lookup candidates. Scaffold only after any separately approved schema change.

**Rationale**: No CCM/product entities or checked-in schema scripts exist in the repository. Constitution B8 prohibits editing scaffolded files and requires confirmation before database changes.

**Alternatives considered**: Inferring Oracle constraints or creating an EF model from screenshots was rejected because it could misrepresent deployed tables and would not prove global uniqueness.

**Review findings**:

- The feature owner supplied CCM key/field metadata and product mapping columns. These are captured in [data-model.md](data-model.md).
- Repository search found no `BRM_CCM_PROD`, `BRM_CLM_CONFIG`, `CCMP_CODE`, or product-master entity/controller.
- `STD_LIST_ITEM` is scaffolded with `LI_TYPE`, `LI_CODE`, `LI_DESC`, active flag and audit columns; checked-in code does not identify the product rows or CCM list types.
- The owner requires `CCM_CODE` to be globally unique, although the primary key is composite. The pasted constraint/index output does not demonstrate database enforcement; see the T004 correction below. An application-only duplicate check is insufficient.

### Owner-pasted read-only Oracle review (2026-11-09)

Evidence: owner-pasted SQL*Plus metadata and lookup output. It reports metadata/lookup results only; no DDL or DML was run, and no CCM triggers were found.

- `BRM_CLM_CONFIG` has 23 columns. The latest output confirms field names, data length, precision/scale, nullability, no defaults shown, and `CHAR_USED = B` for character columns. The field map and storage-versus-validation distinction are in [data-model.md](data-model.md). `CCM_ROUND_VALUE` is `NUMBER(8,5)`.
- `BRM_CCM_PROD` has six columns. Its enabled primary key is `(CCMP_CCM_CODE, CCMP_CODE)`; both columns are non-null. Audit columns are nullable and no defaults were shown.
- **Correction — T004 does not pass:** the pasted constraints output identifies `SYS_C00132035` as type `C`, which Oracle defines as a check constraint; unique constraints have type `U`. The index output lists only the composite primary-key index `(CCM_COMP_CODE, CCM_CODE)`. Therefore the pasted evidence does not show a database-enforced global unique key on `CCM_CODE`. This supersedes the earlier mistaken T004-pass note. No CCM write implementation may proceed without verified global uniqueness or explicit owner approval for an alternative schema decision.
- **Owner screenshots (2026-11-10)** confirm `PK_BRM_CLM_CONFIG` is the composite primary key `(CCM_COMP_CODE, CCM_CODE)` and `PK_BRM_CCM_PROD` is `(CCMP_CCM_CODE, CCMP_CODE)`. The displayed `SYS_C...` constraints are `Check` constraints for `IS NOT NULL`; they are not additional primary keys or unique keys. This confirms both composite PK mappings and leaves T004's separate global-`CCM_CODE` uniqueness gate unmet.
- **T003 remains incomplete:** the latest pasted output lists all 69 rows across 19 existing lookup types. None establishes the supplied CCM field-to-`LI_TYPE` mappings or provides the required CCM choice pairs. The overlapping codes 10 and 20 belong to `CALC_TYPE` (DISCOUNT/CHARGE), and 10 under `VEH_CYLINDER` is a cylinder description; these do not match Applicable Currency Type (All/Risk Currencies). Do not reuse or alter these unrelated rows as CCM choices.
- The owner asked whether missing CCM choice rows explain the empty CCM choices and requested a seed file. The pasted output confirms the expected CCM choice pairs are absent from the reviewed lookup rows. The initial review-only proposal is preserved in [ccm-std-list-item-seed-proposal.sql](ccm-std-list-item-seed-proposal.sql); its suggested `LI_TYPE` names were subsequently approved, but its module examples remain incomplete and recovery-deduction choices were not supplied.
- The owner approved the proposed type names for a seed file. The guarded, insert-only script is [ccm-std-list-item-seed.sql](ccm-std-list-item-seed.sql); it defaults to preview mode, has no `COMMIT`, and targets only `IIRIS_RD_DEVP.STD_LIST_ITEM`. The owner now reports that the six supplied choice sets were inserted; this was not independently re-queried. The script does not contain the complete module list, recovery-deduction choices, or product rows. T003 stays incomplete until the remaining lists and product source are resolved and recorded.
- Candidate product-related tables and columns were listed, but no product rows were queried. The authoritative product source, product code/name mapping, active rule, and product row count remain unverified. Product-source-dependent implementation remains blocked pending this read-only evidence.

Do not modify the database. If future evidence establishes that a database change is needed for any other rule, stop implementation pending explicit owner approval for that change or an approved alternative.

## Decision: Treat product lookup mapping and volume as a data-review gate

**Decision**: The UI displays the product code, type, and description in that order, and the linked row shows the code and type/description as the product name. Do not assume a source or invent its field mapping. Confirm the authoritative source, display columns, active rule, and expected number of items in Oracle before implementation. Choice paging is already settled: use 10 items per page by default and allow later pages, consistent with the specification and constitution B8.

**Rationale**: The repository contains a general lookup table but no authoritative product mapping. Source and volume determine query implementation, while the shared paged choice interaction remains the project convention.

**Alternatives considered**: Assuming all products are standard lookup rows or a specific source was rejected until the data source is verified.

## Decision: Use a required configured Company Code until session context exists

**Decision**: The employee does not enter Company Code. The API uses the authenticated/session company when that context exists. For the current no-login MVP, read the required fixed Company Code `ASRTEST` from application configuration and validate it at startup.

**Rationale**: This matches the clarified user rule and Constitution Article 6's configuration-over-code requirement. Authentication is out of scope.

**Alternatives considered**: A source-code literal or employee-entered Company Code was rejected: the first hides a changeable setting and the second conflicts with the accepted user requirement.

## Decision: Keep product association table pagination distinct from the shared API default

**Decision**: The Applicable Products table starts at five linked rows per page. Its API uses the shared paginated result; absent a requested page size, the server default remains ten as required by Constitution B8. The UI explicitly requests five for its initial page.

**Rationale**: This honors the owner clarification while preserving the project-wide API default. No other linked-table page sizes are specified.

**Alternatives considered**: Changing the shared API default to five was rejected because it would break the project-wide convention and other master features.

## Decision: Follow existing error, audit, and asynchronous conventions

**Decision**: Use `ProblemDetails` for non-success responses, global exception handling, cancellation tokens for async API operations, and the established audit configuration (`admin` as the current no-login audit user; GST timestamps). Use the shared notification and confirmation services in the UI.

**Rationale**: These behaviors are project constitution/common master conventions and are already present in the application.

**Alternatives considered**: CCM-specific authentication, audit identity, or error infrastructure is out of scope and would duplicate existing project behavior.
