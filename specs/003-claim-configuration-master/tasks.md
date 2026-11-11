---
description: "CCM implementation tasks grouped by independently verifiable user story"
---

# Tasks: Claim Configuration Master (CCM)

**Input**: Approved feature design in `/specs/003-claim-configuration-master/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/claim-configuration-api.md`, and `quickstart.md`

**Organization**: Tasks are grouped by user story. Automated tests are included because the specification explicitly requires xUnit, Angular, Playwright, and regression testing. Write the tests before implementing the behavior and verify that new tests fail first.

## Phase 1: Setup

**Purpose**: Verify the existing database metadata that the feature design intentionally does not assume.

- [X] T001 Implement live Oracle column-metadata validation for BYTE/CHAR length semantics and nullability for `IIRIS_RD_DEVP.BRM_CLM_CONFIG`, `BRM_CCM_PROD`, and `STD_LIST_ITEM`; do not assume semantics or change database objects/data. Runtime verification confirmed that `CCM_CODE` and `CCM_NAME` are NOT NULL and the FR-012 optional parent columns are nullable in the configured development schema.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Map the existing database objects and establish the canonical generated API surface before story-specific work.

- [X] T002 Map every supplied `BRM_CLM_CONFIG` column and its existing key in `Spec-Driven-Development/SDD.API/SDD.API/Data/BRM_CLM_CONFIG.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Data/CodesMasterContext.Partial.cs`: `CCM_COMP_CODE VARCHAR2(12) NOT NULL`, `CCM_CODE VARCHAR2(12) NOT NULL`, `CCM_NAME VARCHAR2(100) NOT NULL`, `CCM_SHORT_NAME VARCHAR2(30)`, `CCM_NAME_L2 VARCHAR2(100)`, `CCM_SHORT_NAME_L2 VARCHAR2(30)`, `CCM_MODULE VARCHAR2(2)`, `CCM_ACNT_POSTING_TYPE VARCHAR2(1)`, `CCM_ACNT_EXCH_RATE_TYPE VARCHAR2(1)`, `CCM_ROUND_TYPE VARCHAR2(2)`, `CCM_ROUND_VALUE NUMBER(8,5)`, `CCM_APPL_CURR_TYPE VARCHAR2(2)`, `CCM_DFLT_EST_CLO_REASON_CODE VARCHAR2(12)`, `CCM_DFLT_RECV_DEDU_CODE VARCHAR2(12)`, `CCM_PRNT_BEF_APPR_YN VARCHAR2(1)`, `CCM_RE_PRNT_YN VARCHAR2(1)`, `CCM_CLM_ACNT_DOC_GEN_YN VARCHAR2(1)`, `CCM_CLM_COINS_ACNT_DOC_GEN_YN VARCHAR2(1)`, `CCM_ACTIVE_YN VARCHAR2(1)`, `CCM_CR_BY VARCHAR2(12)`, `CCM_CR_DT DATE`, `CCM_UP_BY VARCHAR2(12)`, and `CCM_UP_DT DATE`; configure primary key `(CCM_COMP_CODE, CCM_CODE)` and preserve the existing unique index on `CCM_CODE`.
- [X] T003 Map `BRM_CCM_PROD` and `STD_LIST_ITEM` in `Spec-Driven-Development/SDD.API/SDD.API/Data/BRM_CCM_PROD.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Data/STD_LIST_ITEM.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Data/CodesMasterContext.Partial.cs`: child primary key `(CCMP_CCM_CODE, CCMP_CODE)`; `CCMP_CCM_CODE VARCHAR2(12) NOT NULL`, `CCMP_CODE VARCHAR2(12) NOT NULL`, `CCMP_CR_BY VARCHAR2(12)`, `CCMP_CR_DT DATE`, `CCMP_UP_BY VARCHAR2(12)`, `CCMP_UP_DT DATE`; lookup columns `LI_TYPE VARCHAR2(20)`, `LI_CODE VARCHAR2(12)`, `LI_DESC VARCHAR2(100)`, `LI_DESC_L2 VARCHAR2(100)`, `LI_SHORT_DESC VARCHAR2(30)`, `LI_SHORT_DESC_L2 VARCHAR2(30)`, `LI_VALUE VARCHAR2(100)`, `LI_ACTIVE_YN VARCHAR2(1)`, `LI_CR_BY VARCHAR2(12)`, `LI_CR_DT DATE`, `LI_UP_BY VARCHAR2(12)`, `LI_UP_DT DATE`, `LI_FLEX_01 VARCHAR2(100)`, and `LI_FLEX_02 VARCHAR2(100)`; do not add a database relationship or schema object.
- [X] T004 Add all parent, child, lookup, filter, pagination, version-token, and ProblemDetails schemas and operations from `specs/003-claim-configuration-master/contracts/claim-configuration-api.md` to the canonical OpenAPI input `specs/001-codes-master/contracts/codes-master.openapi.yaml`.
- [X] T005 Regenerate, do not hand-edit, the Angular CCM API client under `Spec-Driven-Development/sdd-ui/src/app/api/generated/` using `npm run generate:api` from `Spec-Driven-Development/sdd-ui`.

**Checkpoint**: Existing tables are mapped, actual Oracle length semantics are documented, and typed generated client operations are available. No database objects or data have been changed.

---

## Phase 3: User Story 1 — Find a claim configuration (Priority: P1)

**Goal**: Provide a navigable CCM list with server-side filtering, sorting, pagination, and guarded parent deletion.

**Independent Test**: With CCM rows available, open Master > Claim Configuration Master; verify all four columns, filter operators and AND/case-insensitive results, sort order, page sizes, empty/error states, and that deletion succeeds only for a parent without child mappings.

### Tests for User Story 1

- [ ] T006 [P] [US1] Add xUnit tests for CCM list filters, sort order, paging defaults/allowed page sizes, empty/error results, and parent deletion blocked by children in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurationListingTests.cs`; run them and confirm the new behavior tests fail before implementation.
- [ ] T007 [P] [US1] Add Angular tests for CCM list columns, filter/page state, loading/empty/error states, sort, and delete feedback in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configurations-list-page.spec.ts`; confirm they fail before implementation.
- [ ] T008 [P] [US1] Add Playwright coverage for navigation, filtered server-side paging, empty/error states, and parent deletion confirmation/child guard in `Spec-Driven-Development/sdd-ui/e2e/claim-configuration-list.spec.ts`; confirm it fails before implementation.

### Implementation for User Story 1

- [X] T009 [P] [US1] Define typed list filters, filter operators, sort columns/directions, paginated summary response, and parent-delete result contracts in `Spec-Driven-Development/SDD.API/SDD.API/Contracts/ClaimConfigurationContracts.cs`, matching the exact filter operators and `items`, `page`, `pageSize`, `totalCount` response in `specs/003-claim-configuration-master/contracts/claim-configuration-api.md`.
- [X] T010 [US1] Implement CCM server-side count, case-insensitive AND filters, sort-before-page, stable `CCM_CODE` tie-breaker, and allowed page sizes in `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationQuery.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationsRepository.cs`.
- [X] T011 [US1] Implement parent listing and guarded deletion in `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationsRepository.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationsService.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationsController.cs`; list `CCM001` and `ASRTEST` with company code in each summary, resolve key-based operations by globally unique `CCM_CODE`, reject deletion while any `BRM_CCM_PROD` row exists, and serialize the child check/delete with child creation.
- [X] T012 [US1] Implement typed CCM list/delete calls and filter/sort query mapping in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/services/claim-configuration-api.service.ts` using only generated client types.
- [X] T013 [US1] Implement the responsive CCM listing columns Claim Config Code, Claim Config Name, Short Name, Module Name, and Actions with the shared filter control, server-side page navigation, sorting, and distinct loading/empty/error states in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configurations-list-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configurations-list-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configurations-list-page.css`.
- [X] T014 [US1] Add the Claim Configuration Master navigation item and list route, top-right Add affordance, and parent Delete confirmation/action feedback in `Spec-Driven-Development/sdd-ui/src/app/navigation/master-navigation.ts`, `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`, and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/services/claim-configuration-feedback.service.ts`.

**Checkpoint**: Listing and guarded parent deletion pass US1 tests without relying on client-side filtering or pagination.

---

## Phase 4: User Story 2 — Create or edit a claim configuration (Priority: P1)

**Goal**: Create and maintain parent records with exact validation, audit, lookup, reset, and stale-edit behavior.

**Independent Test**: Create a valid CCM record, verify `CCM001`, persisted lookup codes, N/Y defaults, and `ADMIN`/`SYSDATE` creation audit; edit and reset it; then submit a stale edit and confirm that the newer database values remain unchanged.

### Tests for User Story 2

- [ ] T015 [P] [US2] Add xUnit tests for parent required fields, Oracle length semantics, `NUMBER(8,5)` boundaries, toggle validation/defaults, active lookup validation, company code, duplicate code, audit fields, and stale-update rejection in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurationCrudTests.cs`; confirm new tests fail before implementation.
- [ ] T016 [P] [US2] Add Angular tests for typed parent Add/Edit forms, only Claim Config Code and Claim Config Name being required, nullable optional-field serialization, lookup loading/errors, N/N/N/N/Y defaults, reset behavior, disabled repeated submission, retained inactive values, and stale-save feedback in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configuration-detail-page.spec.ts`; confirm they fail before implementation.
- [ ] T017 [P] [US2] Add Playwright Add/Edit coverage for required/length/numeric errors, lookup selection, More defaults, reset, successful save with only Claim Config Code and Claim Config Name, Add navigation from Edit to a fresh Add page, and stale-edit reload feedback in `Spec-Driven-Development/sdd-ui/e2e/claim-configuration-edit.spec.ts`; confirm it fails before implementation.

### Implementation for User Story 2

- [X] T018 [P] [US2] Define the parent write/update/record DTOs and lookup option contracts in `Spec-Driven-Development/SDD.API/SDD.API/Contracts/ClaimConfigurationContracts.cs`; preserve `CCM_CODE VARCHAR2(12) NOT NULL`, `CCM_NAME VARCHAR2(100) NOT NULL`, `CCM_SHORT_NAME VARCHAR2(30)`, `CCM_NAME_L2 VARCHAR2(100)`, `CCM_SHORT_NAME_L2 VARCHAR2(30)`, lookup fields `CCM_MODULE VARCHAR2(2)`, `CCM_ACNT_POSTING_TYPE VARCHAR2(1)`, `CCM_ACNT_EXCH_RATE_TYPE VARCHAR2(1)`, `CCM_ROUND_TYPE VARCHAR2(2)`, `CCM_APPL_CURR_TYPE VARCHAR2(2)`, `CCM_DFLT_EST_CLO_REASON_CODE VARCHAR2(12)`, `CCM_DFLT_RECV_DEDU_CODE VARCHAR2(12)`, `CCM_ROUND_VALUE NUMBER(8,5)`, all four toggle columns `VARCHAR2(1)`, and server-managed company/audit fields.
- [X] T019 [US2] Implement authoritative parent field/lookup/numeric validation and conversion in `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationValidator.cs`; require only `CCM_CODE` and `CCM_NAME`, enforce actual Oracle length semantics, allow nonnegative rounding values up to `999.99999` with at most five fractional digits, reject non-Y/N toggles, and allow an inactive lookup only when its saved value is unchanged on edit.
- [X] T020 [US2] Implement active-only CCM lookup retrieval using `STD_LIST_ITEM.LI_TYPE`, `LI_CODE`, `LI_DESC`, and `LI_ACTIVE_YN = 'Y'` in `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationsRepository.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationsService.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationsController.cs`; support the seven parent lookup types `CCM_MODULE`, `CCM_POST_TYPE`, `CCM_EXCH_RATE`, `CCM_ROUND_TYPE`, `CCM_CURR_TYPE`, `CCM_CLO_REASON`, and `CCM_DFLT_RECV_DEDU`, plus child product lookup `CCM_PRODUCT`, and do not accept a selected-code override.
- [X] T021 [US2] Implement parent Get/Create/Update persistence in `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationsRepository.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationsService.cs`; create with `CCM_COMP_CODE = 'CCM001'`, resolve existing records by globally unique `CCM_CODE` while preserving their stored company code, set `CCM_CR_BY = 'ADMIN'` and `CCM_CR_DT = SYSDATE` with NULL update audit on insert, set update audit to ADMIN/SYSDATE while preserving creation audit, return saved lookup descriptions including inactive stored values, and reject mismatched expected versions without overwriting.
- [X] T022 [US2] Implement typed parent and lookup HTTP endpoints with safe validation/duplicate/stale ProblemDetails and register the CCM services in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationsController.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Program.cs`.
- [X] T023 [P] [US2] Implement a typed Angular lookup-options service for the exact six parent `LI_TYPE` values and active options in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/services/claim-configuration-options.service.ts`.
- [X] T024 [US2] Implement the typed reactive parent form and parent detail Add/Edit page in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/forms/claim-configuration-form.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configuration-detail-page.ts`; include every field in FR-009/FR-010/FR-011, exact database bounds, only Claim Config Code and Claim Config Name as required fields, Y/N toggle mapping/defaults, collapsed More, Add-before-Back actions in Add and Edit modes, fresh Add navigation from Edit, Add-mode form reset, centered Save/Reset, and company-code exclusion.
- [X] T025 [US2] Add parent Add/Edit routes, saved-record lookup-label rendering, reset/error/stale-version handling, and refresh-safe navigation in `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configuration-detail-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/services/claim-configuration-api.service.ts`.

**Checkpoint**: Parent Add/Edit and lookups satisfy API and UI tests, preserve audit history, and reject stale edits.

---

## Phase 5: User Story 3 — Manage applicable products (Priority: P1)

**Goal**: Add, edit, list, and delete product mappings for a saved CCM parent with composite-key duplicate protection and audit/version safety.

**Independent Test**: On a saved parent, add a product, verify its code and lookup description, reject a duplicate, edit the mapping without losing creation audit, reject a stale edit, and confirm/cancel child deletion.

### Tests for User Story 3

- [ ] T026 [P] [US3] Add xUnit tests for child parent association, composite-key duplicate/concurrent insertion, `VARCHAR2(12)` keys, lookup eligibility, ADMIN/SYSDATE audits, key-changing edit, stale version rejection, and single-row delete in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ApplicableProductsTests.cs`; confirm new tests fail before implementation.
- [ ] T027 [P] [US3] Add Angular tests for Applicable Products listing, product modal Add/Edit/Reset, duplicate detection, refresh, confirmation, and operation/lookup errors in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/components/applicable-products-section.spec.ts`; confirm they fail before implementation.
- [ ] T028 [P] [US3] Add Playwright coverage for product Add, duplicate rejection, Edit, stale edit, Delete confirmation/cancellation, refreshed product name, and parent-delete blocking in `Spec-Driven-Development/sdd-ui/e2e/claim-configuration-products.spec.ts`; confirm it fails before implementation.

### Implementation for User Story 3

- [X] T029 [P] [US3] Define Applicable Product write/update/summary/record DTOs in `Spec-Driven-Development/SDD.API/SDD.API/Contracts/ClaimConfigurationContracts.cs`; enforce `CCMP_CCM_CODE VARCHAR2(12) NOT NULL` and `CCMP_CODE VARCHAR2(12) NOT NULL`, composite key `(CCMP_CCM_CODE, CCMP_CODE)`, and server-managed `CCMP_CR_BY VARCHAR2(12)`, `CCMP_CR_DT DATE`, `CCMP_UP_BY VARCHAR2(12)`, and `CCMP_UP_DT DATE`.
- [X] T030 [US3] Implement child list/create/get/update/delete persistence in `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationsRepository.cs`; scope by parent, resolve `LI_DESC` for `LI_TYPE = 'CCM_PRODUCT'`, lock the parent against deletion during insert, reject duplicate composite keys including concurrent attempts, update changed product keys atomically, preserve creation audit, set ADMIN/SYSDATE update audit, reject stale versions, and delete only the selected child.
- [X] T031 [US3] Implement parent-scoped Applicable Products service/controller operations and register dependencies in `Spec-Driven-Development/SDD.API/SDD.API/Services/ClaimConfigurationsService.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ClaimConfigurationsController.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Program.cs`; return the specified 201/200/204 and safe 400/404/409 ProblemDetails outcomes.
- [X] T032 [P] [US3] Implement the Applicable Products child table with Product Code, Product Name, top-right Add, and per-row Edit/Delete actions in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configuration-detail-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configuration-detail-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configuration-detail-page.css`.
- [X] T033 [US3] Implement the Add/Edit product modal with active `CCM_PRODUCT` options, saved inactive-value retention, Save/Reset behavior, parent-scoped duplicate checks, operation guards, and refreshed child listing in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/components/applicable-product-dialog.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/components/applicable-product-dialog.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configuration-detail-page.html`.
- [X] T034 [US3] Implement child Delete confirmation and actionable lookup, stale-version, duplicate, save, delete, and refresh feedback in `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/services/claim-configuration-feedback.service.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/claim-configuration/pages/claim-configuration-detail-page.ts`.

**Checkpoint**: Child mappings can be independently created, edited, listed, and deleted without duplicate pairs, audit loss, or stale overwrites.

- [X] T039 Update Dflt Recovery Code for Dedl to use `CCM_DFLT_RECV_DEDU` and Applicable Products to use `CCM_PRODUCT` across API lookup validation/description resolution, the Angular lookup service/dialog, and canonical OpenAPI; regenerate the Angular client and add lookup regression coverage.
- [X] T040 Add Product Code and Product Name filters to the Applicable Products child listing using the shared six-operator control, case-insensitive AND filtering over loaded rows, and empty/reset states; replace row Edit/Delete glyphs with Codes Master SVG symbols and match its neutral row colors.
- [X] T041 Verify the exact recovery/product lookup types, child filter behaviors, and action icons with API/Angular/Playwright tests and the Angular build.
- [X] T042 Add company code to the CCM listing data and displayed/filterable/sortable columns; retrieve both `CCM001` and `ASRTEST`, preserve the company code for existing-record operations, update OpenAPI-generated UI contracts and specifications, and verify via API, Angular, and Playwright tests.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature, including existing-master regressions, without adding unrelated behavior.

- [ ] T035 [P] Verify all CCM tests cover every parent/child database mapping and validation rule in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurationListingTests.cs`, `Spec-Driven-Development/SDD.API/SDD.API.Tests/ClaimConfigurationCrudTests.cs`, and `Spec-Driven-Development/SDD.API/SDD.API.Tests/ApplicableProductsTests.cs`; add only missing acceptance coverage.
- [ ] T036 [P] Verify all CCM user journeys, keyboard-operable controls, visible errors, and responsive states in `Spec-Driven-Development/sdd-ui/e2e/claim-configuration-list.spec.ts`, `Spec-Driven-Development/sdd-ui/e2e/claim-configuration-edit.spec.ts`, and `Spec-Driven-Development/sdd-ui/e2e/claim-configuration-products.spec.ts`; add only missing acceptance coverage.
- [ ] T037 Run the existing Codes Master and Document Setup regression suites and record/fix only CCM-caused regressions in `Spec-Driven-Development/SDD.API/SDD.API.Tests/` and `Spec-Driven-Development/sdd-ui/e2e/`.
- [ ] T038 Run the complete validation steps in `specs/003-claim-configuration-master/quickstart.md`, including the .NET tests, Angular tests/build, and Playwright suite; resolve CCM failures in their owning source/test files.
- [X] T039 Confirm the final implementation changes no database objects, introduces no package/dependency or connection changes, and keeps generated API files generator-owned in `specs/001-codes-master/contracts/codes-master.openapi.yaml` and `Spec-Driven-Development/sdd-ui/src/app/api/generated/`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 verifies actual Oracle metadata and blocks implementation until the database length semantics are known.
- **Foundational (Phase 2)**: T002 and T004 follow T001; T003 follows T002 because both update the same context partial; T005 follows T004. All four tasks must finish before the user stories.
- **User Stories (Phases 3–5)**: Depend on the completed foundation. US2 follows US1 because the parent detail routes extend the listing/navigation route file. US3 follows US2 because mappings are managed on a saved parent's detail page.
- **Polish (Phase 6)**: Depends on all three stories.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2. Establishes the CCM listing/navigation, server-side list behavior, and guarded parent deletion.
- **US2 (P1)**: Starts after US1. Adds parent creation/editing and the lookup-backed detail page. The listing route/navigation from US1 is reused.
- **US3 (P1)**: Starts after US2. Adds child product management within the saved parent's detail page.

### Within Each User Story

- Write and run the story's API, Angular, and end-to-end tests before implementation; verify that new tests fail for the missing behavior.
- Implement contracts/models before services, repositories, controllers, and UI integration.
- Run the story's targeted tests before moving to the next story.

### Parallel Opportunities

- T002 and T004 can run in parallel after T001 because they change separate entity/context and OpenAPI files. T003 follows T002 because both update `CodesMasterContext.Partial.cs`; T005 follows T004.
- In each story, the listed API, Angular, and Playwright test files can be authored in parallel before implementation.
- T009's contract work and separate list UI test setup can proceed in parallel; similarly T018 and T023 touch separate API/UI files.
- T029 and T032 touch separate API/UI files and can proceed in parallel after US2 is complete.
- Different user stories are not scheduled in parallel because their routes, saved parent flow, and detail-page integration have explicit dependencies.

## Implementation Strategy

### MVP First (User Story 1)

1. Complete T001–T005.
2. Complete T006–T014.
3. Validate CCM navigation, server-side filtering/paging, listing states, and guarded parent deletion independently.

### Incremental Delivery

1. Complete Setup and Foundational tasks; verify no DDL or data changes.
2. Deliver US1 listing and guarded deletion.
3. Deliver US2 parent Add/Edit and exact active lookup behavior.
4. Deliver US3 child mapping Add/Edit/Delete.
5. Run the full quickstart and Codes Master/Document Setup regression suites.

## Notes

- Every task uses the required checkbox, sequential ID, optional `[P]`, required user-story label for story work, and explicit repository-relative file path.
- `[P]` is used only where work can proceed in separate files without an incomplete-task dependency.
- Tasks quoting Oracle constraints must use the exact column types, nullability, keys, and numeric limits recorded in `data-model.md`.
- No tasks create, alter, or drop database objects or modify unrelated Codes Master/Document Setup behavior.
