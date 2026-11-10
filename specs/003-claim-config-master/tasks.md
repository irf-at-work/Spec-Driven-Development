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

**Owner direction (updated 2026-11-10)**: Skip T003 and do not connect to Oracle or run tests during this implementation session. Product choices are owner-approved to use existing `STD_LIST_ITEM` under `LI_TYPE='CCM_PRODUCT'`; this mapping is recorded in FR-036/research/data-model. Product rows and eligible count are not independently verified; count is dynamic and rows must be seeded. Full module-list and other unresolved setting lookup details remain unverified.

  - [X] T003 **SKIPPED BY OWNER**. Full read-only review was not completed. The owner later approved the `STD_LIST_ITEM` / `CCM_PRODUCT` product mapping as a replacement source; product seed rows and count remain unverified. Other unresolved setting sources remain recorded in `research.md` and `data-model.md`.
- [X] T004 **PASSED FROM OWNER-PASTED METADATA**: `IIRIS_RD_DEVP.UX_BRM_CLM_CONFIG_CCM_CODE` is shown as a valid unique index on `IIRIS_RD_DEVP.BRM_CLM_CONFIG`, with the single indexed column `CCM_CODE` at position 1. The `ORA-00955` occurred because this index name already exists. Do not rerun the `CREATE INDEX` statement. Enable `ClaimConfiguration:WritesEnabled` before using Save. The implementation agent did not connect to Oracle or apply DDL.
- [X] T005 Add schema-derived CCM entity mappings outside the generated directory under `Spec-Driven-Development/SDD.API/SDD.API/Data/ClaimConfigurations/`, based on the complete CCM table metadata already supplied, and register them in `Spec-Driven-Development/SDD.API/SDD.API/Data/SddDbContext.Partial.cs`. Do not edit existing generated files, connect to Oracle, run scaffolding, or change database schema/data.

  **Checkpoint**: T003 was skipped. Product source is owner-approved as recorded in FR-036; product seed rows remain data-dependent. Other unresolved setting choices stay gated. T004 passed from owner-pasted metadata. CCM writes remain disabled until `ClaimConfiguration:WritesEnabled` is set to true.

---

## Phase 3: User Story 1 — Find and browse CCM configurations (Priority: P1) 🎯 MVP

**Goal**: Let employees browse and filter CCM records with the shared master-data list behavior.

**Independent Test**: With enough CCM test records to span pages, verify the default 10-row page, 10/25/50 page sizes, per-column filters, sorting across the filtered result set, status visibility, and no global search.

### Tests for User Story 1

- [ ] T006 [P] [US1] Write XUnit API tests for CCM list paging, supported page sizes, per-column filter operators, combined case-insensitive filters, literal matching, blank-filter handling, inclusion of empty values for `not equals`, 500 ms filter refresh behavior, page-one reset after filter/sort changes, sorting/tie-breakers, and invalid query errors in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationListApiTests.cs`. Initial coverage is authored for supported paging, default order, not-equals empty values, and invalid page parameters; operator/literal/tie-breaker cases remain to add.
- [ ] T007 [P] [US1] Write Playwright coverage for CCM list columns, no global search, default ordering, filters, sorting, status visibility, paging, the 500 ms filter refresh, returning to page one after filter/sort changes, and `not equals` results that include empty values in `Spec-Driven-Development/tests/claim-config-e2e/list-and-read.spec.ts`. Initial coverage is authored for the upload icon, no global search, default ordering, filter debounce, sorting, and page-one reset; status and full operator/result cases remain to add.

### Implementation for User Story 1

- [X] T008 [US1] Implement the CCM list DTO, server-side query/filter/sort/page behavior, and list controller action returning `PaginatedResult<T>` in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/ClaimConfigurationListItemDto.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationListQuery.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationsController.cs`; initial order must be Company Code then CCM Code ascending.
- [ ] T009 [US1] Regenerate the Angular API client from the declared OpenAPI return types using the configured NSwag process and update only generated output in `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts`. Deferred; the local API OpenAPI endpoint was unavailable to NSwag in this sandbox. No generated output was hand-edited; the feature continues to use its typed service until NSwag can run.
- [X] T010 [US1] Implement the standalone CCM list page with server-driven filters, sorting, page sizes 10/25/50, and Add navigation. The feature uses its own typed HTTP service because the generated API client was not regenerated; see T009.

**Checkpoint**: The list is independently usable and passes the US1 API and browser acceptance tests.

**Commit checkpoint**: After the US1 tests pass, commit the working list increment on the feature branch with a message describing CCM list browsing/filtering.

---

## Phase 4: User Story 2 — Maintain claim configurations (Priority: P1)

**Goal**: Let employees create, view and update CCM records with the confirmed field rules and lookups.

**Independent Test**: Create a CCM using Company Code `ASRTEST` from configuration, read it by its composite key, edit an allowed field, and verify saved casing, Arabic preservation, numeric values, dropdown codes and immutable keys.

### Tests for User Story 2

- [ ] T011 [P] [US2] Write XUnit tests for CCM create/read/update/delete, required CCM Code and Claim Config Name, Company Code from `ASRTEST` configuration, global duplicate rejection, immutable keys, lookup validation with actionable field errors, retaining an unchanged inactive current lookup value without offering it for new selections, uppercase English names, Arabic exact preservation, Rounding Value default `0.00000` and rejection of negative values (FR-042/FR-043), N defaults for Print Before Approval Yn and RePrint Allowed, Y defaults for the accounting flags, linked-product delete rejection without association changes, and persistence/updates of CCM creation and update user/date audit fields. Pure input-rule coverage is in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationInputRulesTests.cs`; API persistence coverage belongs in `ClaimConfigurationCrudApiTests.cs`. Add separate paging-contract tests (shared `PaginatedResult<T>` and default page size 10) for CCM lookup choices in `ClaimConfigurationOptionsTests.cs`. Initial API coverage is authored for CRUD, duplicate keys, configuration-derived Company Code, defaults, Arabic preservation, and one invalid lookup; inactive lookup and linked-delete cases remain.
- [ ] T012 [P] [US2] Write Playwright coverage for create, view/edit, required fields, actionable validation messages with entered values retained after a failed save, dropdown labels, retrieving CCM dropdown choices across pages, retaining an unchanged inactive current choice while offering active choices for new selections, uppercase English names, RTL Arabic inputs, Rounding Value default `0.00000` and negative-value rejection (FR-042/FR-043), unchecked N defaults for Print Before Approval Yn and RePrint Allowed, no Company Code/company name on any CCM screen, delete confirmation and linked-product rejection, and unsaved-change confirmation in `Spec-Driven-Development/tests/claim-config-e2e/create-edit-claim-configuration.spec.ts` and `Spec-Driven-Development/tests/claim-config-e2e/list-and-read.spec.ts`. Existing and new mocked coverage includes rounding validation, Arabic fields, hidden Company Code, defaults, delete conflict, and Add/discard handling; paginated choices and full save-error retention remain.

### Implementation for User Story 2

- [X] T013 [US2] Implement typed CCM create, update and detail DTOs plus server validation/mapping in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/CreateClaimConfigurationRequest.cs`, `Spec-Driven-Development/SDD.API/SDD.API/DTOs/UpdateClaimConfigurationRequest.cs`, `Spec-Driven-Development/SDD.API/SDD.API/DTOs/ClaimConfigurationDto.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationInputRules.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationMapping.cs`; enforce the accepted code/name/flag/rounding rules including FR-042/FR-043, preserve Arabic fields, and keep key fields immutable. Recovery-deduction selection remains unavailable until its lookup source is reviewed. Writes remain disabled by default through `ClaimConfiguration:WritesEnabled`.
- [X] T014 [US2] Implement CCM persistence and create/read/update service operations in `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationService.cs`, mapping the reviewed `BRM_CLM_CONFIG` field-to-column map and retaining/stamping creation and update audit values. Persistence is implemented; API writes remain disabled by default through `ClaimConfiguration:WritesEnabled`.
- [X] T015 [US2] Implement `GET /api/claim-configurations/{ccmCode}`, `POST /api/claim-configurations`, `PUT /api/claim-configurations/{ccmCode}`, and `DELETE /api/claim-configurations/{ccmCode}`; derive Company Code from configuration, use typed return values and `ProblemDetails`, report global duplicates and linked-product delete rejection as conflicts, and propagate `CancellationToken`. Write routes return 503 while `ClaimConfiguration:WritesEnabled` is false.
- [X] T016 [US2] Implement typed read-only, paginated choice queries for all seven CCM setting mappings. Choices are paginated at 10 and unchanged inactive values remain available during editing. The owner supplied recovery-deduction choices 100 (Excess) and 200 (Nil); [ccm-recovery-deduction-insert.sql](ccm-recovery-deduction-insert.sql) prepares the rows for owner execution.
- [ ] T017 [US2] Regenerate the Angular API client for the verified CCM DTOs and options response through the configured NSwag process into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts`. Deferred with T009: NSwag could not retrieve OpenAPI in this sandbox; no generated output was hand-edited.
- [X] T018 [US2] Implement the CCM create/view/edit form with reactive controls, no Company Code/company name display, paginated choices, Rounding Value default `0.00000` and `min=0` per FR-042/FR-043, N checkbox defaults for Print Before Approval Yn and RePrint Allowed, Y checkbox defaults for both accounting flags, uppercase English fields, exact RTL Arabic preservation inside the shared Additional Information expansion panel, and the standard Active slide toggle. The Recovery Code for Deduction field is a dropdown. Saves remain disabled until the owner enables the write setting.

**Checkpoint**: An employee can create, view and update a CCM independently of product associations, and US2 API/browser tests pass.

**Commit checkpoint**: After the US2 tests pass, commit the working CCM maintenance increment with a descriptive message.

---

## Phase 5: User Story 3 — Associate products with CCM configurations (Priority: P1)

**Goal**: Maintain the Applicable Products links from a saved CCM page, including the specified modal and five-row linked-product table.

**Independent Test**: Add two distinct products to a CCM, verify Product Code/Product Name/Action rows, reject a duplicate, paginate after adding more than five products, delete one link, and confirm remaining records and links are preserved.

### Tests for User Story 3

- [ ] T019 [P] [US3] Write XUnit tests for the product association list, initial UI request size 5 with API default 10, adding links, rejecting duplicate `(CCM Code, product code)` pairs, removing only the selected link, retrieving links by product ID, and asserting `CCMP_CR_BY`, `CCMP_CR_DT`, `CCMP_UP_BY`, and `CCMP_UP_DT` are stamped on creation and retained as expected in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationProductsApiTests.cs`. Initial coverage checks pagination contracts, empty product lookups, and inactive-product rejection; association write/audit coverage needs seeded test choices.
- [X] T020 [P] [US3] Write Playwright coverage for the bottom-of-page Applicable Products section on saved CCM view/edit pages, three table columns, Available Products modal, required Product Code dropdown, exact option/row label formats, retrieving product choices across pages (default 10 per API page), duplicate prevention, five-row linked-table pagination, confirmed deletion, and dirty-modal close confirmation where cancelling retains the selected product in `Spec-Driven-Development/tests/claim-config-e2e/manage-claim-configuration-products.spec.ts`. Added; not run per owner instruction.

### Implementation for User Story 3

- [X] T021 [US3] Use the owner-approved `STD_LIST_ITEM` product mapping in FR-036 to implement a typed, paginated active `CCM_PRODUCT` choice query and endpoint, default page size 10, with labels `LI_CODE - LI_TYPE - LI_DESC`, in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/AvailableProductDto.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationProductService.cs`, and the claim-configuration API controller. The eligible count is calculated dynamically; product rows must be seeded before choices appear.
- [X] T022 [US3] Implement the associated-product DTO and service operations for paginated CCM product links, duplicate rejection, single-link deletion, retrieval by product ID, and association creation audit fields (`CCMP_CR_BY`, `CCMP_CR_DT`) and update audit fields (`CCMP_UP_BY`, `CCMP_UP_DT`) in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/AssociatedProductDto.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationProductService.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationProductsController.cs`; use the verified association columns and Company Code from context for CCM-scoped routes; ensure deletion does not remove CCM data or other links.
- [ ] T023 [US3] Regenerate Angular API client types for product-choice and association endpoints through the configured NSwag process into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts`. Deferred with T009: NSwag could not retrieve OpenAPI in this sandbox; no generated output was hand-edited.
- [X] T024 [US3] Implement the Applicable Products section and Available Products modal with required Product Code selection, `LI_CODE` and `LI_TYPE - LI_DESC` display, duplicate handling, initial linked-table page size 5, pagination, confirmed Delete action, and a dirty-modal close prompt that retains the selected product when closing is cancelled in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-products.component.ts`; integrate it into the saved CCM view/edit page. Uses the owner-approved `CCM_PRODUCT` list type in FR-036.

**Checkpoint**: Employees can maintain links from a CCM, see the correct product labels, and remove one association without affecting the CCM or other products.

**Commit checkpoint**: After the US3 tests pass, commit the working Applicable Products increment with a descriptive message.

---

## Phase 6: User Story 4 — Activate or deactivate configurations (Priority: P2)

**Goal**: Reversibly change CCM availability while retaining its configuration and product associations.

**Independent Test**: Deactivate and reactivate a CCM, confirm its status in the list and form, and verify its settings and product links remain stored.

### Tests for User Story 4

- [ ] T025 [P] [US4] Write XUnit tests for active/inactive status persistence, default active `Y`, reactivation, and retention of all product links in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationLifecycleApiTests.cs`. Initial API coverage verifies default active state, deactivation, and reactivation; link-retention coverage remains.
- [X] T026 [P] [US4] Write Playwright coverage for changing status in the CCM edit flow, seeing inactive rows in the list, filtering by status, reactivating, and verifying associations remain in `Spec-Driven-Development/tests/claim-config-e2e/activate-deactivate-claim-configuration.spec.ts`. Mocked coverage is authored but not run per owner direction.

### Implementation for User Story 4

- [X] T027 [US4] Implement lifecycle persistence so new CCMs default active and updates can set active/inactive without deleting data or product links in `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationsController.cs`; store `Y`/`N` per the verified column behavior. Implementation present; lifecycle API tests remain open.
- [X] T028 [US4] Add the Active status control and inactive-state presentation to the CCM edit form and list using the shared master-data conventions in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-form.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-form.component.html`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-list.component.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-list.component.ts`. Implementation present; browser lifecycle tests remain open.

**Checkpoint**: Deactivation and reactivation retain the CCM record and every product association.

**Commit checkpoint**: After the US4 tests pass, commit the working CCM lifecycle increment with a descriptive message.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify end-to-end consistency, accessibility, generated-client discipline, and the owner walkthrough.

- [ ] T029 Review CCM UI copy, accessible action names/tooltips, breadcrumb behavior, 16px body/15px table text, Arabic font/RTL handling, and right-aligned page Back button in the CCM list and form. Implementation is present; visual review remains pending.
- [X] T030 Update the owner validation sequence and commands to match the implemented routes, approved local data, and owner-approved `STD_LIST_ITEM` product choice mapping in `specs/003-claim-config-master/quickstart.md`. The guide explains how to seed `CCM_PRODUCT` rows; no SQL was run.
- [ ] T031 Run the CCM API and existing regression suite with `dotnet test Spec-Driven-Development/SDD.API/SDD.API.Tests/SDD.API.Tests.csproj` and resolve failures in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationOptionsTests.cs`, `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationListApiTests.cs`, `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationCrudApiTests.cs`, `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationProductsApiTests.cs`, and `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationLifecycleApiTests.cs`. API and test projects compile; tests not run per owner instruction.
- [ ] T032 Run Angular build, unit checks, lint/format checks, and Playwright E2E scenarios using the existing scripts in `Spec-Driven-Development/sdd-ui/package.json`; fix failures in `Spec-Driven-Development/tests/claim-config-e2e/list-and-read.spec.ts`, `Spec-Driven-Development/tests/claim-config-e2e/create-edit-claim-configuration.spec.ts`, `Spec-Driven-Development/tests/claim-config-e2e/manage-claim-configuration-products.spec.ts`, and `Spec-Driven-Development/tests/claim-config-e2e/activate-deactivate-claim-configuration.spec.ts`. Angular production build and API/test-project builds succeeded; tests, lint, format, and E2E not run per owner instruction.
- [X] T033 Confirm no generated API client file was edited by hand and that no database schema/data change occurred without explicit owner approval; record the final review in `specs/003-claim-config-master/plan.md`. `api-client.ts` is unchanged. No database connection or database operation was performed by the implementation agent; the owner reported the approved lookup rows were inserted separately.
- [X] T034 Add mocked Playwright regression coverage for the eye action opening the editable maintenance form, right-to-left Arabic fields and preserved input, the standard Active slide toggle, no company code/name or audit metadata on the form, and PUT save behavior in `Spec-Driven-Development/tests/claim-config-e2e/create-edit-claim-configuration.spec.ts`. Added but not run per owner instruction.
- [X] T035 Add a confirmed Delete action to the rightmost CCM Actions column. The API deletes only the CCM row and returns conflict while product links exist; it does not modify linked rows. Remove Company Code from all frontend CCM screens, display the legacy Module Name column, and set the print/reprint flags to unchecked N defaults. The API explicitly consumes `TNS_ADMIN` for TNS alias resolution; no database operation was performed.
- [X] T036 Add mocked browser coverage for the rightmost Action column, hidden Company Code, Module Name display, Delete confirmation and linked-product conflict, unchecked N defaults, and removed helper labels in `Spec-Driven-Development/tests/claim-config-e2e/list-and-read.spec.ts`. Added but not run per owner instruction.
- [X] T037 Present the Claim Accounting Document Generation and Claim Coinsurance Accounting Document Generation fields as checked-by-default checkboxes and move both Arabic fields into the Additional Information expansion panel at the bottom of the form grid. Remove audit metadata from the frontend. Add the Applicable Products section to saved views; enable it only when CCM writes are enabled and use the owner-approved `CCM_PRODUCT` list mapping in FR-036. Browser coverage is authored but not run.
- [X] T039 Prepare the guarded association insert template in `specs/003-claim-config-master/ccm-product-link-insert.sql` for a user-supplied CCM Code/Product Code pair. It targets only `BRM_CCM_PROD`, avoids inserting an existing pair, and was not executed. Product choice rows are prepared separately in `ccm-product-choice-insert.sql` per FR-036.
- [X] T040 Apply FR-042/FR-043: default missing create-request Rounding Value to zero; reject negative values in API validation; initialize the form to zero with `min=0`; add pure input-rule and mocked browser regression coverage. Authored but not run per owner instruction.
- [X] T041 Add the saved-record Add Claim Configuration icon immediately to the left of Back; navigate to the blank create route and reuse the existing unsaved-change guard in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-form.component.html` and `claim-configuration-form.component.ts`. Mocked browser coverage confirms cancel retains edits and discard opens a blank create form.
- [X] T042 Add the claim configuration Excel import page with a downloadable two-sheet workbook template, file-size/row-count checks, row preview, server preview/import calls, confirmation, and inserted/skipped/error summary in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configurations/claim-configuration-import.component.ts`, `.html`, `.css`, `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`, and the CCM list page. Uses the already-approved ExcelJS dependency; no package changes.
- [X] T043 Implement CCM and product-link import request/preview/result DTOs and server-side preview validation for required/format rules, approved active choices, references, duplicate workbook keys, and existing-row skips in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/ClaimConfigurationImport*.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationImportService.cs`. Preview resolves CCM references against the configured company and accepts link-only workbooks for existing CCMs.
- [X] T044 Add gated CCM import preview and confirm endpoints that revalidate and atomically insert eligible CCMs and product links, report separate inserted/skipped counts, enforce 1,000 combined rows and 5 MB, and do not overwrite existing records in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationsController.cs`, `ClaimConfigurationImportService.cs`, and `Program.cs`. Server enforces row limits; browser validates the original `.xlsx` size before parsing. Transaction and feature write-gate are in place.
- [X] T045 Add API and mocked Playwright coverage for the saved-record Add action, confirmation guard, CCM import preview/invalid rows/skips/atomic failure/result counts in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurations/ClaimConfigurationImportApiTests.cs` and `Spec-Driven-Development/tests/claim-config-e2e/claim-configuration-import.spec.ts`. Tests are authored but not run per owner direction recorded in this task list.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: Required Company Code config tests and implementation; no CCM story can write records without this value.
- **Phase 2 Foundational**: Depends on Phase 1 and completes the read-only schema/lookup review and approved database-first scaffolding. It blocks CCM writes if the global unique `CCM_CODE` rule is not database-enforced.
- **US1 (Phase 3)**: Begins after foundational mapping and schema verification; browse/list can be delivered before create/edit.
- **US2 (Phase 4)**: Depends on foundational setup and the CCM entity; provides the saved CCM record needed by US3 and the editable lifecycle surface used by US4.
- **US3 (Phase 5)**: Depends on US2 saved CCM details and the owner-approved product mapping in FR-036; seed `CCM_PRODUCT` rows before choice selection.
- **US4 (Phase 6)**: Depends on US2's CCM update flow; preserves associations created by US3 when US3 is included.
- **Polish (Phase 7)**: Depends on the stories selected for delivery and on resolved database gates.

### User Story Dependencies

- **US1 (P1)**: Depends on foundational CCM schema mapping. It can be tested independently with existing CCM records.
- **US2 (P1)**: Depends on foundational schema, Company Code configuration, and verified global CCM Code uniqueness.
- **US3 (P1)**: Depends on US2 and the owner-approved product mapping in FR-036. Product row count is dynamic; seed the choice list before linking products.
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

Both test files can be authored in parallel. Implement the source query, API, generated client, and UI after the owner-approved product mapping is recorded in FR-036.

---

## Implementation Strategy

### Recommended Minimum Useful Increment

Deliver US1, US2, and US3 together: the list lets employees find configurations, create/update makes them maintainable, and product associations connect the configuration to a policy's product. US1 alone is an early checkpoint but does not deliver the main product-to-CCM outcome. Add US4 lifecycle controls as the next increment.

### Incremental Delivery

1. Complete setup and database gates; stop if the global uniqueness guarantee needs an unapproved DDL change.
2. Implement US1, then validate list behavior against existing data.
3. Implement US2 and validate create/read/update with `ASRTEST` in an approved test schema.
4. Implement US3 with the owner-approved product mapping in FR-036; seed `CCM_PRODUCT` rows before validating choice, duplicate, paging and delete behavior.
5. Implement US4, then run the full cross-cutting checks and quickstart walkthrough.

## Notes

- `[P]` means a task can be completed in parallel without editing the same files or depending on unfinished work.
- Every story task has its story label and a concrete repository path.
- Preserve database-first generated entity boundaries. Do not add packages, DDL, data writes, or hand-edited generated client types without following project approval/convention rules.
- Transaction-time selection across multiple CCM links, missing mapping handling, inactive CCM transaction behavior, policy-specific rules, and payout calculation remain out of scope.
