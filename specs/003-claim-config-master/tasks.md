# Tasks: Claim Configuration Master

**Input**: Design documents from `specs/003-claim-config-master/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/claim-configurations-api.md`, and `quickstart.md`.

**Tests**: Automated XUnit and Playwright tests are included because the project constitution requires test coverage for feature acceptance criteria. Write the story tests before the matching implementation and verify that they fail for the expected reason.

**Organization**: Tasks are grouped by user story. The project structure is a .NET 10 API, Angular 22 UI, and Oracle 19c database-first schema.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because the task edits a different file and has no dependency on unfinished tasks.
- **[Story]**: User story represented by the task, using `[US1]` through `[US4]`.
- Every task names its target file path(s).

## Constitution Check

**Check**: This task list was reviewed against `.specify/memory/constitution.md` and the project conventions in `specs/master-data-common.md`. Implementation must preserve these requirements:

- Automated XUnit and Playwright tests cover each user story and are written before matching implementation (Articles 4 and B5).
- The fixed Company Code `ASRTEST` is required configuration and must be validated at startup, not embedded as a source-code literal (Article 6).
- Do not add packages or make database/schema/data changes without explicit owner approval; scaffolded Oracle files remain generated (B4 and B8).
- API errors use `ProblemDetails`, asynchronous API methods propagate cancellation, and Angular types are generated from OpenAPI rather than hand-maintained (B5–B8).
- The association table UI requests page size five while API list defaults remain ten; use the shared UI/API conventions.
- Commit each completed story increment as a small, working change with a descriptive message after that story's tests pass (Article 10).

## Phase 1: Setup

**Purpose**: Prepare the one feature-specific runtime setting needed by every CCM write.

- [X] T001 Add API configuration validation tests for required Company Code `ASRTEST` in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationOptionsTests.cs`.
- [X] T002 Implement required `ClaimConfigurationOptions` validation and startup registration, set the example value to `ASRTEST`, and update the example settings in `Spec-Driven-Development/SDD.API/SDD.API/Configuration/ClaimConfigurationOptions.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Program.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/appsettings.Example.json`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify the existing database facts and prepare database-first mappings before any CCM story is implemented.

**Owner direction (2026-11-09)**: Skip T003 and continue the remaining work. Do not connect to Oracle or run tests during this implementation session. Use the owner-pasted schema metadata and approved six lookup type names. Product-source, full module-list, and recovery-deduction details remain unresolved; do not infer them.

- [X] T003 **SKIPPED BY OWNER**. Full review was not completed. The owner directed continuation without tests or database connections; unresolved sources remain recorded in `research.md` and `data-model.md`.
- [ ] T004 **NOT PASSED**: the pasted report identifies `SYS_C00132035` as constraint type `C` (check), not `U` (unique); the index report shows only the composite primary-key index `(CCM_COMP_CODE, CCM_CODE)`. CCM write implementation remains blocked until a global unique constraint/index is verified or the owner approves an alternative schema decision. No database changes are authorized in this session.
- [X] T005 Add schema-derived CCM entity mappings outside the generated directory under `Spec-Driven-Development/SDD.API/SDD.API/Data/ClaimConfigurations/`, based on the complete CCM table metadata already supplied, and register them in `Spec-Driven-Development/SDD.API/SDD.API/Data/SddDbContext.Partial.cs`. Do not edit existing generated files, connect to Oracle, run scaffolding, or change database schema/data.

**Checkpoint**: T003 was skipped at the owner's direction and its unresolved sources are not treated as verified. T004 is not passed; read-only work may continue, but CCM writes remain blocked. Use supplied CCM metadata and approved lookup types without Oracle connections or test execution. Leave product-source-dependent work incomplete if it requires an unverified source.

---

## Phase 3: User Story 1 — Find and browse CCM configurations (Priority: P1) 🎯 MVP

**Goal**: Let employees browse and filter CCM records with the shared master-data list behavior.

**Independent Test**: With enough CCM test records to span pages, verify the default 10-row page, 10/25/50 page sizes, per-column filters, sorting across the filtered result set, status visibility, and no global search.

### Tests for User Story 1

- [ ] T006 [P] [US1] Write XUnit API tests for CCM list paging, supported page sizes, per-column filter operators, combined case-insensitive filters, literal matching, blank-filter handling, inclusion of empty values for `not equals`, 500 ms filter refresh behavior, page-one reset after filter/sort changes, sorting/tie-breakers, and invalid query errors in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationListApiTests.cs`.
- [ ] T007 [P] [US1] Write Playwright coverage for CCM list columns, no global search, default ordering, filters, sorting, status visibility, paging, the 500 ms filter refresh, returning to page one after filter/sort changes, and `not equals` results that include empty values in `Spec-Driven-Development/tests/claim-config-e2e/list-and-read.spec.ts`.

### Implementation for User Story 1

- [X] T008 [US1] Implement the CCM list DTO, server-side query/filter/sort/page behavior, and list controller action returning `PaginatedResult<T>` in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/ClaimConfigurationListItemDto.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationListQuery.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationsController.cs`; initial order must be Company Code then CCM Code ascending.
- [ ] T009 [US1] Regenerate the Angular API client from the declared OpenAPI return types using the configured NSwag process and update only generated output in `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts`. Deferred: the configured process fetches OpenAPI from the running API, whose startup requires Oracle connection configuration; no database-related process was started per owner instruction.
- [X] T010 [US1] Implement the standalone read-only CCM list page with server-driven filters, sorting and page sizes 10/25/50, and register its route. The feature uses its own typed HTTP service because the generated API client was not regenerated; see T009.

**Checkpoint**: The list is independently usable and passes the US1 API and browser acceptance tests.

**Commit checkpoint**: After the US1 tests pass, commit the working list increment on the feature branch with a message describing CCM list browsing/filtering.

---

## Phase 4: User Story 2 — Maintain claim configurations (Priority: P1)

**Goal**: Let employees create, view and update CCM records with the confirmed field rules and lookups.

**Independent Test**: Create a CCM using Company Code `ASRTEST` from configuration, read it by its composite key, edit an allowed field, and verify saved casing, Arabic preservation, numeric values, dropdown codes and immutable keys.

### Tests for User Story 2

- [ ] T011 [P] [US2] Write XUnit tests for CCM create/read/update, required CCM Code and Claim Config Name, Company Code from `ASRTEST` configuration, global duplicate rejection, immutable keys, lookup validation with actionable field errors, retaining an unchanged inactive current lookup value without offering it for new selections, uppercase English names, Arabic exact preservation, rounding numeric validation, Y/N create defaults, and persistence/updates of CCM creation and update user/date audit fields in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationCrudApiTests.cs`; add separate paging-contract tests (shared `PaginatedResult<T>` and default page size 10) for CCM lookup choices in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationOptionsTests.cs`.
- [ ] T012 [P] [US2] Write Playwright coverage for create, view, edit, required fields, actionable validation messages with entered values retained after a failed save, dropdown labels, retrieving CCM dropdown choices across pages, retaining an unchanged inactive current choice while offering active choices for new selections, uppercase English names, RTL Arabic inputs, Company Code display without employee editing, and unsaved-change confirmation in `Spec-Driven-Development/tests/claim-config-e2e/create-edit-claim-configuration.spec.ts`.

### Implementation for User Story 2

- [ ] T013 [US2] Implement typed CCM create, update and detail DTOs plus server validation/mapping in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/CreateClaimConfigurationRequest.cs`, `Spec-Driven-Development/SDD.API/SDD.API/DTOs/UpdateClaimConfigurationRequest.cs`, `Spec-Driven-Development/SDD.API/SDD.API/DTOs/ClaimConfigurationDto.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationInputRules.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationMapping.cs`; enforce `CCM_CODE` 1–12 letters, digits, or hyphens and uppercase, uppercase `CCM_NAME`/`CCM_SHORT_NAME`, preserve `CCM_NAME_L2`/`CCM_SHORT_NAME_L2` text and spacing exactly, keep both key fields immutable, maintain `CCM_ROUND_VALUE` within `NUMBER(8,5)` with `2.000` valid and no extra range rule, accept only Y/N for `CCM_PRNT_BEF_APPR_YN`, `CCM_RE_PRNT_YN`, `CCM_CLM_ACNT_DOC_GEN_YN`, and `CCM_CLM_COINS_ACNT_DOC_GEN_YN`, and default those four flags to Y on create.
- [ ] T014 [US2] Implement CCM persistence and create/read/update service operations in `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationService.cs`, mapping the verified `BRM_CLM_CONFIG` field-to-column map and correctly retaining creation audit values while setting update audit values; do not invent unspecified validation.
- [ ] T015 [US2] Implement `GET /api/claim-configurations/{ccmCode}`, `POST /api/claim-configurations`, and `PUT /api/claim-configurations/{ccmCode}`; derive Company Code from user context or configured `ASRTEST` rather than a caller-supplied path value, and use declared return types, `ProblemDetails`, duplicate conflict handling, and propagated `CancellationToken` in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationsController.cs`. Read-only GET and a read-only detail page are implemented; POST/PUT remain blocked by T004.
- [ ] T016 [US2] Implement typed read-only, paginated choice queries for the verified CCM `STD_LIST_ITEM` mappings, returning a shared `PaginatedResult<LookupChoiceDto>` with default page size 10 for the requested field/list type, in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/ClaimConfigurationOptionsDto.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationOptionsService.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationOptionsController.cs`; offer active items for new selections and let the detail response retain/display an unchanged inactive current value without offering it as a new choice. Six approved mappings are implemented; recovery-deduction mapping and inactive-current edit behavior remain incomplete.
- [ ] T017 [US2] Regenerate the Angular API client for the verified CCM DTOs and options response through the configured NSwag process into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts`.
- [ ] T018 [US2] Implement the standalone CCM create/view/edit form with typed reactive controls, Company Code display from context, confirmed lookup dropdowns, Y/N defaults, uppercase English fields, exact RTL Arabic preservation, and unsaved-change handling in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-form.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-form.component.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-form.component.css`; connect detail and edit navigation through `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`. Read-only details are implemented; create/edit remain gated by T004 and incomplete lookup review.

**Checkpoint**: An employee can create, view and update a CCM independently of product associations, and US2 API/browser tests pass.

**Commit checkpoint**: After the US2 tests pass, commit the working CCM maintenance increment with a descriptive message.

---

## Phase 5: User Story 3 — Associate products with CCM configurations (Priority: P1)

**Goal**: Maintain the Applicable Products links from a saved CCM page, including the specified modal and five-row linked-product table.

**Independent Test**: Add two distinct products to a CCM, verify Product Code/Product Name/Action rows, reject a duplicate, paginate after adding more than five products, delete one link, and confirm remaining records and links are preserved.

### Tests for User Story 3

- [ ] T019 [P] [US3] Write XUnit tests for the product association list, initial UI request size 5 with API default 10, adding links, rejecting duplicate `(CCM Code, product code)` pairs, removing only the selected link, retrieving links by product ID, and recording creation/update user/date audit fields for association changes in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationProductsApiTests.cs`.
- [ ] T020 [P] [US3] Write Playwright coverage for the bottom-of-page Applicable Products section on saved CCM view/edit pages, three table columns, Available Products modal, required Product Code dropdown, exact option/row label formats, retrieving product choices across pages (default 10 per API page), duplicate prevention, five-row linked-table pagination, confirmed deletion, and dirty-modal close confirmation where cancelling retains the selected product in `Spec-Driven-Development/tests/claim-config-e2e/manage-claim-configuration-products.spec.ts`.

### Implementation for User Story 3

- [ ] T021 [US3] After T003 identifies the authoritative product source and confirms its volume/active rules, implement a typed product-choice query and read-only endpoint returning `PaginatedResult<AvailableProductDto>` with default page size 10, and labels as `LI_CODE - LI_TYPE - LI_DESC`, in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/AvailableProductDto.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/AvailableProductQuery.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationProductsController.cs`.
- [ ] T022 [US3] Implement the associated-product DTO and service operations for paginated CCM product links, duplicate rejection, single-link deletion, and retrieval by product ID in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/AssociatedProductDto.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationProductService.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationProductsController.cs`; map verified association columns and preserve/set creation/update audit values as appropriate, derive Company Code from context for CCM-scoped routes, and ensure deletion does not remove CCM data or other links.
- [ ] T023 [US3] Regenerate Angular API client types for product-choice and association endpoints through the configured NSwag process into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts`.
- [ ] T024 [US3] Implement the Applicable Products section and Available Products modal with required Product Code selection, `LI_CODE` and `LI_TYPE - LI_DESC` display, duplicate handling, initial linked-table page size 5, pagination, confirmed Delete action, and a dirty-modal close prompt that retains the selected product when closing is cancelled in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-products.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-products.component.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-products.component.css`; integrate it into the saved CCM view/edit page.

**Checkpoint**: Employees can maintain links from a CCM, see the correct product labels, and remove one association without affecting the CCM or other products.

**Commit checkpoint**: After the US3 tests pass, commit the working Applicable Products increment with a descriptive message.

---

## Phase 6: User Story 4 — Activate or deactivate configurations (Priority: P2)

**Goal**: Reversibly change CCM availability while retaining its configuration and product associations.

**Independent Test**: Deactivate and reactivate a CCM, confirm its status in the list and form, and verify its settings and product links remain stored.

### Tests for User Story 4

- [ ] T025 [P] [US4] Write XUnit tests for active/inactive status persistence, default active `Y`, reactivation, and retention of all product links in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationLifecycleApiTests.cs`.
- [ ] T026 [P] [US4] Write Playwright coverage for changing status in the CCM edit flow, seeing inactive rows in the list, filtering by status, reactivating, and verifying associations remain in `Spec-Driven-Development/tests/claim-config-e2e/activate-deactivate-claim-configuration.spec.ts`.

### Implementation for User Story 4

- [ ] T027 [US4] Implement lifecycle persistence so new CCMs default active and updates can set active/inactive without deleting data or product links in `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationsController.cs`; store `Y`/`N` per the verified column behavior.
- [ ] T028 [US4] Add the Active status control and inactive-state presentation to the CCM edit form and list using the shared master-data conventions in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-form.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-form.component.html`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-list.component.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-list.component.ts`.

**Checkpoint**: Deactivation and reactivation retain the CCM record and every product association.

**Commit checkpoint**: After the US4 tests pass, commit the working CCM lifecycle increment with a descriptive message.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify end-to-end consistency, accessibility, generated-client discipline, and the owner walkthrough.

- [ ] T029 Review CCM UI copy, accessible action names/tooltips, breadcrumb behavior, 16px body/15px table text, Arabic font/RTL handling, and right-aligned page Back button in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-list.component.html`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-list.component.css`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-form.component.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-form.component.css`. List/detail copy, action labels, and Arabic RTL display were addressed; form review remains pending because no form was implemented.
- [ ] T030 Update the owner validation sequence and commands to match the implemented routes, approved local data, and resolved product lookup in `specs/003-claim-config-master/quickstart.md`. The guide now documents the read-only status and gates; product source and full review remain unresolved.
- [ ] T031 Run the CCM API and existing regression suite with `dotnet test Spec-Driven-Development/SDD.API/SDD.API.Tests/SDD.API.Tests.csproj` and resolve failures in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationOptionsTests.cs`, `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationListApiTests.cs`, `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationCrudApiTests.cs`, `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationProductsApiTests.cs`, and `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationLifecycleApiTests.cs`. Not run per owner instruction.
- [ ] T032 Run Angular build, unit checks, lint/format checks, and Playwright E2E scenarios using the existing scripts in `Spec-Driven-Development/sdd-ui/package.json`; fix failures in `Spec-Driven-Development/tests/claim-config-e2e/list-and-read.spec.ts`, `Spec-Driven-Development/tests/claim-config-e2e/create-edit-claim-configuration.spec.ts`, `Spec-Driven-Development/tests/claim-config-e2e/manage-claim-configuration-products.spec.ts`, and `Spec-Driven-Development/tests/claim-config-e2e/activate-deactivate-claim-configuration.spec.ts`. Angular production build succeeded; tests, lint, format, and E2E were not run per owner instruction.
- [X] T033 Confirm no generated API client file was edited by hand and that no database schema/data change occurred without explicit owner approval; record the final review in `specs/003-claim-config-master/plan.md`. `api-client.ts` is unchanged. No database connection or database operation was performed by the implementation agent; the owner reported the approved lookup rows were inserted separately.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: Required Company Code config tests and implementation; no CCM story can write records without this value.
- **Phase 2 Foundational**: Depends on Phase 1 and completes the read-only schema/lookup review and approved database-first scaffolding. It blocks CCM writes if the global unique `CCM_CODE` rule is not database-enforced.
- **US1 (Phase 3)**: Begins after foundational mapping and schema verification; browse/list can be delivered before create/edit.
- **US2 (Phase 4)**: Depends on foundational setup and the CCM entity; provides the saved CCM record needed by US3 and the editable lifecycle surface used by US4.
- **US3 (Phase 5)**: Depends on US2 saved CCM details and the product source/volume decision from T003.
- **US4 (Phase 6)**: Depends on US2's CCM update flow; preserves associations created by US3 when US3 is included.
- **Polish (Phase 7)**: Depends on the stories selected for delivery and on resolved database gates.

### User Story Dependencies

- **US1 (P1)**: Depends on foundational CCM schema mapping. It can be tested independently with existing CCM records.
- **US2 (P1)**: Depends on foundational schema, Company Code configuration, and verified global CCM Code uniqueness.
- **US3 (P1)**: Depends on US2 and verified product source, display fields, active rules, and product-list volume.
- **US4 (P2)**: Depends on US2's update flow; association-retention acceptance is best verified after US3.

### Parallel Opportunities

- T001's configuration tests and initial contract/list test preparation can be developed independently, but implementation follows the tests.
- Within US1, the XUnit API tests and Playwright list scenarios (T006/T007) are separate files and can be authored in parallel.
- Within US2, the XUnit and Playwright test files (T011/T012) can be authored in parallel; implementation must follow both.
- Within US3, the XUnit and Playwright association tests (T019/T020) can be authored in parallel after the product source decision is recorded.
- Within US4, the XUnit and Playwright lifecycle tests (T025/T026) can be authored in parallel.
- API and UI implementation are not marked parallel because the UI relies on generated OpenAPI types and multiple tasks modify the same generated client/component files.

---

## Parallel Example: User Story 3

```text
Task: T019 Write the association API tests in Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationProductsApiTests.cs
Task: T020 Write the association browser tests in Spec-Driven-Development/tests/claim-config-e2e/manage-claim-configuration-products.spec.ts
```

Both test files can be authored in parallel. Implement the source query, API, generated client, and UI only after their test expectations and the Oracle product-source review are ready.

---

## Implementation Strategy

### Recommended Minimum Useful Increment

Deliver US1, US2, and US3 together: the list lets employees find configurations, create/update makes them maintainable, and product associations connect the configuration to a policy's product. US1 alone is an early checkpoint but does not deliver the main product-to-CCM outcome. Add US4 lifecycle controls as the next increment.

### Incremental Delivery

1. Complete setup and database gates; stop if the global uniqueness guarantee needs an unapproved DDL change.
2. Implement US1, then validate list behavior against existing data.
3. Implement US2 and validate create/read/update with `ASRTEST` in an approved test schema.
4. Implement US3 after product lookup source/volume is verified; validate duplicate, paging and delete behavior.
5. Implement US4, then run the full cross-cutting checks and quickstart walkthrough.

## Notes

- `[P]` means a task can be completed in parallel without editing the same files or depending on unfinished work.
- Every story task has its story label and a concrete repository path.
- Preserve database-first generated entity boundaries. Do not add packages, DDL, data writes, or hand-edited generated client types without following project approval/convention rules.
- Transaction-time selection across multiple CCM links, missing mapping handling, inactive CCM transaction behavior, policy-specific rules, and payout calculation remain out of scope.
