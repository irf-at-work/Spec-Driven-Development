# CCM Design Research

## Decision: Reuse the current application architecture

**Decision**: Implement the feature in the existing Angular 21 standalone application and .NET 10 API, using the existing Oracle EF Core context, repository/service/controller layers, Angular Material and shared UI components, and current testing tools.

**Rationale**: The constitution and existing Codes Master/Document Setup features establish these technologies and patterns. The feature adds no framework, dependency, authentication, authorization, or database connection.

**Alternatives considered**: A new service, framework, or database connection would duplicate existing infrastructure and violate the scope and constitution constraints.

## Decision: Map the existing Oracle tables without schema changes

**Decision**: Persist parent, child, and lookup data in the existing `BRM_CLM_CONFIG`, `BRM_CCM_PROD`, and `STD_LIST_ITEM` tables through the current `CodesMasterContext` Oracle connection. Map the existing schema through the context's partial extension and entity partials; do not use EF migrations or alter database objects.

**Rationale**: The user confirms all three tables already exist and prohibits DDL. The existing context already centralizes the connection and uses partial model configuration. Required CCM model registrations are not present in the current context.

**Alternatives considered**: A second connection, replacement table, schema migration, or edits to generated API client files violate explicit constraints. Raw SQL without the existing context would bypass the established repository pattern.

## Decision: Use the supplied lookup mapping and preserve every lookup type

**Decision**: Read lookup values from `STD_LIST_ITEM.LI_CODE` and labels from `STD_LIST_ITEM.LI_DESC`. Use the exact field/source mappings in the feature specification, including `CCM_DFLT_RECV_DEDU` for Dflt Recovery Code for Dedl and `CCM_PRODUCT` for Applicable Products.

**Rationale**: The owner supplied the table columns and confirmed the value/description columns and exact lookup types.

**Alternatives considered**: Reusing Codes Master rows or substituting different lookup types would not meet the approved source requirement.

## Decision: Filter Applicable Products in the loaded child list

**Decision**: Reuse the shared column-filter control and its six operators on Product Code and Product Name. Apply filters case-insensitively with AND semantics to the full child collection already loaded for the current parent; do not add child pagination or API query parameters.

**Rationale**: The child endpoint already returns the complete parent-scoped collection, and the user requested filtering without asking for child pagination.

**Alternatives considered**: Adding server-side filters and paging would expand the API contract and is not required for this request.

## Decision: Restrict new lookup selections to active rows

**Decision**: Dropdowns for new selections query only `STD_LIST_ITEM` rows with `LI_ACTIVE_YN = 'Y'`. When editing a record whose existing lookup value is inactive, include that existing value in the displayed selection without offering it as a new option.

**Rationale**: The owner confirmed that inactive lookup values should not be assigned to new records, while existing saved values must remain visible and maintainable.

**Alternatives considered**: Listing inactive choices for new selections could permit retired configuration values; removing an existing selection on edit would silently alter saved data.

## Decision: Follow Codes Master list semantics

**Decision**: Apply case-insensitive AND-combined column filters and sorting on the server before pagination. Use page size 10 by default and choices 10, 15, 20, and 50; return the shared paginated response.

**Rationale**: These are the established Codes Master behaviors explicitly required by the CCM spec and project constitution.

**Alternatives considered**: Client-side filtering/paging or a separate pagination model would behave differently and could expose incomplete result sets.

## Decision: Enforce identity and duplicate rules at both layers

**Decision**: Create new parents under fixed company code `CCM001`. The CCM listing includes both `CCM001` and `ASRTEST` records and displays the stored company code. Resolve existing parent rows by `CCM_CODE`, whose unique index is database-wide, and preserve each row's company code during update. Identify child mappings by `(CCMP_CCM_CODE, CCMP_CODE)`. Validate duplicate mappings in the UI for feedback and in persistence for correctness, including concurrent insert conflicts.

**Rationale**: The supplied database keys/indexes define identity. Frontend checks alone cannot prevent races.

**Alternatives considered**: Client-only duplicate checks cannot protect concurrent submissions. Introducing new uniqueness constraints or schema changes is prohibited.

## Decision: Guard parent deletion and preserve child audit semantics

**Decision**: Confirm parent deletion, reject it while child mappings exist, and delete only a child-free parent. Confirm child deletion and remove only the selected composite-key mapping. Edit a child mapping by loading its current product and updating the selected mapping; reject a duplicate target key. On edits, retain creation audit values and set update audit values to `ADMIN` and Oracle `SYSDATE`.

**Rationale**: These behaviors follow the owner’s clarification and the supplied table keys/audit columns. They avoid cascading deletes and preserve mapping identity unless the user explicitly changes the product.

**Alternatives considered**: Cascading child deletion is not approved. Delete-and-recreate for an edit would unnecessarily change creation audit history.

## Decision: Reject stale parent and child edits

**Decision**: Return an opaque version token with parent and child records. Require the token on updates, compare it with the current persisted record inside the update transaction, and reject mismatches with a conflict that asks the user to reload.

**Rationale**: This preserves another user's newer data and matches the current Document Setup update behavior.

**Alternatives considered**: Last-write-wins could silently erase another user's changes.

## Decision: Keep endpoint contracts in the canonical OpenAPI source

**Decision**: Document CCM endpoints and DTOs in this feature's contract, then add them to the existing `specs/001-codes-master/contracts/codes-master.openapi.yaml` during implementation and regenerate the Angular client through the existing `ng-openapi-gen` command. Do not edit generated files by hand.

**Rationale**: `sdd-ui/ng-openapi-gen.json` currently reads the Codes Master OpenAPI YAML. The Document Setup API contract documents this same canonical-source process.

**Alternatives considered**: A second disconnected OpenAPI source would not be consumed by the configured client generator.

## Decision: Reuse existing validation, error, and test conventions

**Decision**: Validate required values, configured Oracle field limits, `NUMBER(8,5)`, toggle encodings, allowed lookup values, page sizes, and key uniqueness on the server, with matching client validation for usability. Return existing ProblemDetails error shapes. Add API tests with xUnit, Angular unit tests, Playwright flows, and Codes Master/Document Setup regression checks.

**Rationale**: This meets the constitution's validation, error visibility, generated-client, and automated-test requirements without introducing tooling.

**Alternatives considered**: Raw server exception messages, silent lookup failures, client-only validation, or new test frameworks conflict with existing conventions.

## Open implementation verification

- The supplied column definitions do not specify Oracle `BYTE` versus `CHAR` length semantics. Implementation must preserve the actual existing column semantics and validate accordingly; it must not infer or change them.
- The current `CodesMasterContext` does not register CCM or `STD_LIST_ITEM` entities. The implementation must map the existing schema through the current context extension without changing database objects.
- The configured API generation input is the existing Codes Master OpenAPI file; implementation must update that canonical source before regeneration.
