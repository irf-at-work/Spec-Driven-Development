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
- The owner requirement says `CCM_CODE` is globally unique, although the known `BRM_CLM_CONFIG` primary key is composite. The database must guarantee the business rule under concurrent writes; a service-only duplicate check is not sufficient. Verify whether a unique constraint/index already exists. If absent, stop for explicit schema-change approval.

## Decision: Treat product lookup mapping and volume as a design gate

**Decision**: The UI contract displays product options as `LI_CODE - LI_TYPE - LI_DESC` and linked rows as Product Code `LI_CODE` and Product Name `LI_TYPE - LI_DESC`, per the specification. Do not assume that `STD_LIST_ITEM` is the authoritative product catalog or invent its `LI_TYPE`. Confirm the source and expected number of items in Oracle before deciding whether the options request is unpaged or needs a paginated/searchable contract.

**Rationale**: The repository contains `STD_LIST_ITEM` but no product mapping. The constitution allows unpaged option lists only when small and bounded; the product list size is unknown.

**Alternatives considered**: Assuming all products are standard-list rows or loading an unbounded product catalog into one dropdown was rejected until the data source and volume are verified.

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
