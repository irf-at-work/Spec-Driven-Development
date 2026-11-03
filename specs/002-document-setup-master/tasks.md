# Tasks: Document Setup Master

**Input**: Design documents from `specs/002-document-setup-master/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/document-setup-api.md`, and `quickstart.md`

**Tests**: Automated API and UI tests are required by the project constitution and measurable outcomes. Write story tests before the corresponding implementation.

**Organization**: Tasks are grouped by user story so each increment can be implemented and validated. Every task includes the intended file path.

## Phase 1: Setup

**Purpose**: Prepare the working branch and verify existing database prerequisites without changing the database.

- [X] T001 Create/switch to branch `002-document-setup-master` without discarding existing worktree changes, then update the feature branch/status metadata in `specs/002-document-setup-master/spec.md`.
- [X] T002 Using the existing `CodesMasterOracle` configuration, perform read-only checks of `IIRIS_RD_DEVP.STD_DOCUMENT` and `IIRIS_RD_DEVP.STD_DOC_APPL_MODULE`, confirm the DDL in `specs/002-document-setup-master/data-model.md`, and record the current `DAMOD_UID` numeric range/provider mapping in `specs/002-document-setup-master/research.md`; stop and request a decision if max-plus-one cannot be represented safely.

## Phase 2: Foundational

**Purpose**: Establish safe database mappings and shared API contracts that block all user stories.

- [X] T003 [P] Add EF model metadata tests in `Spec-Driven-Development/SDD.API/SDD.API.Tests/DocumentSetupModelMappingTests.cs` for schema `IIRIS_RD_DEVP`, exact table names, parent key `DOC_CODE`, child key `DAMOD_UID`, all DDL column names and byte limits, and absence of an invented foreign key or database sequence.
- [X] T004 [P] Define typed parent/child request and response contracts in `Spec-Driven-Development/SDD.API/SDD.API/Contracts/DocumentSetupContracts.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Contracts/ApplicableModuleContracts.cs`, preserving the DDL limits verbatim: `DOC_CODE VARCHAR2(12 BYTE)`, `DOC_NAME/DOC_NAME_L2 VARCHAR2(100 BYTE)`, `DOC_DESC/DOC_DESC_L2 VARCHAR2(2000 BYTE)`, `DOC_SETUP_FOR VARCHAR2(12 BYTE)`, `DOC_FLEX_01/DOC_FLEX_02 VARCHAR2(60 BYTE)`, `DAMOD_UID NUMBER`, `DAMOD_DOC_CODE/DAMOD_APPL_FOR/DAMOD_*_CODE_* VARCHAR2(12 BYTE)`, and all Y/N fields and audit actors `VARCHAR2(1 BYTE)`/`VARCHAR2(12 BYTE)` as defined in `specs/002-document-setup-master/data-model.md`.
- [X] T005 [P] Add xUnit tests in `Spec-Driven-Development/SDD.API/SDD.API.Tests/DocumentSetupVersionTests.cs` proving that the opaque version token changes when any persisted parent or child field changes and is stable for an unchanged row snapshot.
- [X] T006 Scaffold only `STD_DOCUMENT` and `STD_DOC_APPL_MODULE` into a temporary output using the configured Oracle provider, then add the database-first entity definitions at `Spec-Driven-Development/SDD.API/SDD.API/Data/STD_DOCUMENT.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Data/STD_DOC_APPL_MODULE.cs`, extend `Spec-Driven-Development/SDD.API/SDD.API/Data/CodesMasterContext.Partial.cs` with DbSets and mappings, and implement `Spec-Driven-Development/SDD.API/SDD.API/Services/DocumentSetupVersion.cs`; satisfy `DocumentSetupModelMappingTests.cs` and `DocumentSetupVersionTests.cs`, do not overwrite scaffolded Codes Master files, run migrations, or change database objects.
- [X] T007 Add all documented Document Setup endpoints and schemas to `specs/001-codes-master/contracts/codes-master.openapi.yaml` and regenerate—not hand-edit—the Angular client under `Spec-Driven-Development/sdd-ui/src/app/api/generated` using `Spec-Driven-Development/sdd-ui/ng-openapi-gen.json`; preserve the existing shared `PaginatedResult<T>` and `ProblemDetails` contracts.

**Checkpoint**: Database mappings, shared request/response types, version tokens, and generated API types are ready; no schema or package change has been made.

## Phase 3: User Story 1 - Find and review document setups (Priority: P1)

**Goal**: Navigate to a paginated, searchable Document Setup list with accurate row actions and clear loading, empty, and error states.

**Independent Test**: Navigate Masters > Document Setup against a stubbed paginated response; verify columns, per-column filters, pagination, loading/empty/error states, and that each row's Edit/Delete controls target the selected document.

### Tests for User Story 1

- [X] T008 [P] [US1] Add API tests in `Spec-Driven-Development/SDD.API/SDD.API.Tests/DocumentSetupsControllerListTests.cs` for default page size 10, selectable sizes 10/15/20/50, each supported filter operator, case-insensitive AND filtering before pagination, invalid operator/value pairs, stable ordering, and retrieval errors.
- [X] T009 [P] [US1] Add Playwright tests in `Spec-Driven-Development/sdd-ui/e2e/document-setup-list.spec.ts` for Masters navigation, required columns, filter controls/operators, paging, row action identity, loading, empty, and retrieval-error states.

### Implementation for User Story 1

- [X] T010 [US1] Implement parent listing filters and paginated repository queries in `Spec-Driven-Development/SDD.API/SDD.API/Services/DocumentSetupsRepository.cs`; filter only Doc Code, Doc Name, and Setup For using the six specified operators, ignore case, combine filters with AND, filter before paging, and order by `DOC_CODE`.
- [X] T011 [US1] Implement list validation and mapping to the shared `PaginatedResult<DocumentSetupSummary>` in `Spec-Driven-Development/SDD.API/SDD.API/Services/DocumentSetupsService.cs`, enforcing the default page size 10 and allowed sizes 10, 15, 20, and 50.
- [X] T012 [US1] Add `GET /api/document-setups` with typed return values and paired operator/value validation in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/DocumentSetupsController.cs`; propagate `CancellationToken` and use the existing safe exception handler.
- [X] T013 [US1] Implement typed listing/filter calls through the generated client in `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/services/document-setup-api.service.ts`; do not hand-write API model types.
- [X] T014 [US1] Build the standalone OnPush Document Setup listing, table, column filters, pagination, and accessible loading/empty/error states in `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setups-list-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setups-list-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setups-list-page.css`.
- [X] T015 [US1] Register the lazy listing route in `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts` and add a keyboard-operable Document Setup link under Masters in `Spec-Driven-Development/sdd-ui/src/app/app.html` and `Spec-Driven-Development/sdd-ui/src/app/app.ts`; make row actions carry the selected `docCode`.
- [X] T016 [US1] Run the focused API list tests and `npm run test:e2e -- e2e\document-setup-list.spec.ts` from `Spec-Driven-Development/sdd-ui`; fix failures in `Spec-Driven-Development/SDD.API/SDD.API.Tests/DocumentSetupsControllerListTests.cs` and `Spec-Driven-Development/sdd-ui/e2e/document-setup-list.spec.ts`.

**Checkpoint**: Parent listing and navigation satisfy the independent test; add/edit/delete destinations are completed in their respective story phases.

## Phase 4: User Story 2 - Create a document setup (Priority: P1)

**Goal**: Create a parent document from a dedicated blank form, validate required values, and return to the listing on success.

**Independent Test**: Open Add from the listing, create a valid parent, and verify it appears with persisted values; test missing required values, DDL field limits, More-section fields, defaults, and Reset without saving invalid data.

### Tests for User Story 2

- [X] T017 [P] [US2] Add API tests in `Spec-Driven-Development/SDD.API/SDD.API.Tests/DocumentSetupsControllerCreateTests.cs` for required Doc Code/Doc Setup For, exact DDL byte limits, duplicate `DOC_CODE`, validation of `DOC_SETUP_FOR` code membership, Oracle `SYSDATE` audit values, `ADMIN` creator, and safe `ProblemDetails`.
- [X] T018 [P] [US2] Add Playwright tests in `Spec-Driven-Development/sdd-ui/e2e/document-setup-add.spec.ts` for a dedicated blank Add page, required-field validation, loading and displaying Code/Code Description from `DOC_SETUP_FOR`, More-section visibility, Active default Y, Reset, busy-state duplicate-submit prevention, success feedback, and return to the listing.

### Implementation for User Story 2

- [X] T019 [US2] Implement server-side parent validation in `Spec-Driven-Development/SDD.API/SDD.API/Services/DocumentSetupValidator.cs`: require Doc Code and Doc Setup For; enforce `DOC_CODE VARCHAR2(12 BYTE)`, `DOC_SETUP_FOR VARCHAR2(12 BYTE)`, `DOC_NAME/DOC_NAME_L2 VARCHAR2(100 BYTE)`, `DOC_DESC/DOC_DESC_L2 VARCHAR2(2000 BYTE)`, and `DOC_FLEX_01/DOC_FLEX_02 VARCHAR2(60 BYTE)`; treat Doc Name and Doc Description as optional.
- [X] T020 [US2] Implement parent creation and duplicate handling in `Spec-Driven-Development/SDD.API/SDD.API/Services/DocumentSetupsService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/DocumentSetupsRepository.cs`; persist a validated `DOC_SETUP_FOR` Codes Master value, default `DOC_ACTIVE_YN` to `Y`, set `DOC_CR_BY` to `ADMIN`, obtain `DOC_CR_DT` from Oracle `SYSDATE`, and log only safe operation context.
- [X] T021 [US2] Add typed `POST /api/document-setups` returning `201` and the created record in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/DocumentSetupsController.cs`; surface validation and duplicate-code failures through the existing `ProblemDetails` behavior.
- [X] T022 [US2] Implement the typed parent reactive form, dedicated Add route, Save/Reset/Back behavior, required-field SweetAlert feedback, in-progress state, and accessible labels in `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/forms/document-setup-form.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setup-add-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setup-add-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setup-add-page.css`.
- [X] T023 [US2] Add the Add route and listing Add link in `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setups-list-page.html`; submit only through generated request types in `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/services/document-setup-api.service.ts`.
- [X] T024 [US2] Run the focused parent-create API tests and `npm run test:e2e -- e2e\document-setup-add.spec.ts` from `Spec-Driven-Development/sdd-ui`; fix failures in `Spec-Driven-Development/SDD.API/SDD.API.Tests/DocumentSetupsControllerCreateTests.cs` and `Spec-Driven-Development/sdd-ui/e2e/document-setup-add.spec.ts`.

**Checkpoint**: A valid parent can be created and found in the listing; invalid submissions do not persist.

## Phase 5: User Story 3 - Maintain a document and its applicable modules (Priority: P1)

**Goal**: Edit existing parent details and create, review, edit, and delete its associated ASR/ASSET child configurations without changing identity or losing association.

**Independent Test**: Open a saved parent, edit and reset it, add ASR and ASSET children, verify the exact conditional fields and all six displayed ranges, edit a child without changing its identity, clear ranges when changing ASSET to ASR, and verify stale changes are rejected.

### Tests for User Story 3

- [X] T025 [P] [US3] Add API tests in `Spec-Driven-Development/SDD.API/SDD.API.Tests/DocumentSetupsControllerUpdateTests.cs` for parent get/update, immutable `DOC_CODE`, update audit `ADMIN`/`SYSDATE`, preserved creation audit, changed/missing version conflicts, and reload guidance.
- [X] T026 [P] [US3] Add API tests in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ApplicableModulesControllerTests.cs` for child CRUD, parent association, ASR/ASSET validation, all optional ranges, duplicate Applicable For entries, exact option codes, unchanged `DAMOD_UID` on update, audit behavior, and ASSET-to-ASR range clearing.
- [X] T027 [P] [US3] Add an Oracle-backed concurrent child-create test using the existing `CodesMasterOracle` configuration in `Spec-Driven-Development/SDD.API/SDD.API.Tests/ApplicableModulesOracleConcurrencyTests.cs`; verify unique `MAX(DAMOD_UID) + 1` IDs across simultaneous inserts and skip only when the existing connection is unavailable.
- [X] T028 [P] [US3] Add Playwright tests in `Spec-Driven-Development/sdd-ui/e2e/document-setup-edit.spec.ts` for parent Edit/Reset, child Add/Edit/Delete, exact ASR/ASSET conditional fields, visible range columns, unsaved-change confirmation, keyboard access, progress feedback, and stale-save reload messaging.

### Implementation for User Story 3

- [X] T029 [US3] Implement parent GET/update and row-locked snapshot-version checks in `Spec-Driven-Development/SDD.API/SDD.API/Services/DocumentSetupsRepository.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/DocumentSetupsService.cs`; keep `DOC_CODE` immutable, preserve `DOC_CR_BY`/`DOC_CR_DT`, set `DOC_UP_BY` to `ADMIN`, and set `DOC_UP_DT` using Oracle `SYSDATE`.
- [X] T030 [US3] Add typed parent GET and PUT routes with not-found and stale-version `ProblemDetails` in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/DocumentSetupsController.cs`; propagate `CancellationToken` and return the new opaque row version after update.
- [X] T031 [US3] Implement child repository CRUD and filtered paging in `Spec-Driven-Development/SDD.API/SDD.API/Services/ApplicableModulesRepository.cs`; create IDs as `MAX(DAMOD_UID) + 1` under an Oracle transaction with an exclusive lock on `IIRIS_RD_DEVP.STD_DOC_APPL_MODULE`, lock/verify the parent first, and never truncate the Oracle `NUMBER`.
- [X] T032 [US3] Implement child validation, mapping, audit, and stale-version behavior in `Spec-Driven-Development/SDD.API/SDD.API/Services/ApplicableModulesService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/ApplicableModuleValidator.cs`; require Applicable For `ASR` or `ASSET`, enforce every `DAMOD_*_CODE_* VARCHAR2(12 BYTE)` limit, keep all six ranges optional, allow duplicate Applicable For rows, default Mandatory N/Active Y, clear ranges for ASR, and preserve creation audit values.
- [X] T033 [US3] Add typed child GET/list/POST/PUT/DELETE routes under `/api/document-setups/{docCode}/applicable-modules` in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ApplicableModulesController.cs`; verify child-parent identity on every operation, use `DAMOD_UID` as a decimal string in JSON, and return safe `ProblemDetails`.
- [X] T034 [US3] Implement the typed parent Edit page and child table in `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setup-edit-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setup-edit-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setup-edit-page.css`; show Applicable For, all six range columns, Mandatory, Active, audit values, and actions, leaving ASR range cells blank.
- [X] T035 [US3] Implement the child Add/Edit form, conditional ASR/ASSET controls, hardcoded Product/PCM/CCM options, range clearing, Save/Reset/Back, dirty-form confirmation, and busy-state disabling in `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/applicable-module-form-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/applicable-module-form-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/forms/applicable-module-form.ts`.
- [X] T036 [US3] Add parent Edit and child Add/Edit lazy routes and typed generated-client operations in `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/services/document-setup-api.service.ts`; use `damodUid` strings without unsafe numeric conversion.
- [X] T037 [US3] Run the focused parent/child xUnit tests and `npm run test:e2e -- e2e\document-setup-edit.spec.ts` from `Spec-Driven-Development/sdd-ui`; run `ApplicableModulesOracleConcurrencyTests` against the existing configured Oracle connection and fix failures in the corresponding test files.

**Checkpoint**: Parent edits and child CRUD are independently verified, preserve associations and audit values, and reject stale edits.

## Phase 6: User Story 4 - Delete a document setup (Priority: P2)

**Goal**: Confirm parent deletion, block it while child rows exist, and never cascade child deletion.

**Independent Test**: Confirm and cancel deletion of a parent with no children; verify cancellation preserves data and confirmed deletion succeeds. With children present, verify the parent is retained and a safe explanatory conflict is shown.

### Tests for User Story 4

- [X] T038 [P] [US4] Add API tests in `Spec-Driven-Development/SDD.API/SDD.API.Tests/DocumentSetupsControllerDeleteTests.cs` for missing parents, expected-version mismatch, serialized parent locking, child-existence conflict, deletion of a child-free parent, and no cascade.
- [X] T039 [P] [US4] Add Playwright tests in `Spec-Driven-Development/sdd-ui/e2e/document-setup-delete.spec.ts` for confirmation content, cancel preserving the parent, child-blocked deletion feedback, successful deletion, and disabling repeated Delete actions while in progress.

### Implementation for User Story 4

- [X] T040 [US4] Implement parent deletion in `Spec-Driven-Development/SDD.API/SDD.API/Services/DocumentSetupsRepository.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/DocumentSetupsService.cs`; lock and verify the parent/version, check for children in the same transaction, return conflict while any child exists, and delete only the parent when child-free.
- [X] T041 [US4] Add typed `DELETE /api/document-setups/{docCode}` with expected-version validation, `204` success, and safe `404`/`409 ProblemDetails` responses in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/DocumentSetupsController.cs`.
- [X] T042 [US4] Wire the listing Delete action to a confirmation identifying Doc Code, prevent repeat submissions, display actionable child-blocked errors, refresh the correct page after success, and cover accessible status messages in `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setups-list-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setups-list-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/services/document-setup-feedback.service.ts`.
- [X] T043 [US4] Run the focused parent-delete API tests and `npm run test:e2e -- e2e\document-setup-delete.spec.ts` from `Spec-Driven-Development/sdd-ui`; fix failures in `Spec-Driven-Development/SDD.API/SDD.API.Tests/DocumentSetupsControllerDeleteTests.cs` and `Spec-Driven-Development/sdd-ui/e2e/document-setup-delete.spec.ts`.

**Checkpoint**: Parent deletion requires confirmation, is blocked by children, and never removes children.

## Add-page Applicable Module creation

- [X] T047 Extend the parent Add page to stage Applicable Module rows with the same ASR/ASSET fields and defaults as Edit, create the parent before its children, avoid duplicate parent/child submissions on retry, and navigate to Edit when child records were requested.
- [X] T048 Add Playwright coverage proving staged child values are posted and then loaded in the new parent's Edit page; update the feature specification and quickstart guidance.

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify usability, operational safety, documentation, and full-project validation.

- [X] T044 [P] Review `Spec-Driven-Development/SDD.API/SDD.API/Controllers/DocumentSetupsController.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ApplicableModulesController.cs`, `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setups-list-page.html`, `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/document-setup-edit-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/pages/applicable-module-form-page.html` for keyboard operation, associated labels, visible focus, announced errors/status, British/Indian English, strict typing, and no raw exception details.
- [X] T045 [P] Update `specs/002-document-setup-master/quickstart.md` with final runnable API, Angular, xUnit, Oracle concurrency, and focused Playwright commands and expected results.
- [X] T046 Run the complete API test suite, Angular production build, and all Document Setup Playwright tests using `specs/002-document-setup-master/quickstart.md`; resolve regressions only in `Spec-Driven-Development/SDD.API/SDD.API.Tests/` tests, `Spec-Driven-Development/SDD.API/SDD.API/` implementation files, and `Spec-Driven-Development/sdd-ui/e2e/` and `Spec-Driven-Development/sdd-ui/src/app/features/document-setup/` files.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No code dependencies; T002 is a read-only database safety gate.
- **Foundational (Phase 2)**: Depends on Setup. The verified entity mapping, typed contracts, version helper, and generated OpenAPI client block all stories.
- **User Stories (Phase 3+)**: Depend on the completed foundation.
- **Polish (Phase 7)**: Depends on all four stories.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2. Establishes navigation and parent listing; its filters and paging are independently testable.
- **User Story 2 (P1)**: Starts after Phase 2 and uses the listing navigation from US1 to open the form; implementation of parent creation does not depend on child CRUD.
- **User Story 3 (P1)**: Depends on US2 for an integrated saved-parent flow and provides parent Edit plus child CRUD; API tests may use seeded parent fixtures.
- **User Story 4 (P2)**: Depends on US1 listing actions and is easiest to demonstrate after US2/US3 can create parents and children; deletion API can be tested independently with seeded rows.

### Within Each User Story

- Write and run the story's tests before implementation; verify they fail for the missing feature.
- Implement database/repository behavior before services and endpoints; implement API client/UI only against generated OpenAPI types.
- Run the focused API and browser tests at each story checkpoint.
- Do not begin feature implementation if T002 finds an unsupported `DAMOD_UID` maximum or database/schema mismatch; request a decision instead.

### Dependency Graph

```text
T001, T002
  └── T003, T004, T005
        └── T006, T007
              ├── US1: T008/T009 → T010–T016
              └── US2: T017/T018 → T019–T024 (integrated navigation also uses US1)
                    └── US3: T025–T028 → T029–T037
                          └── US4: T038/T039 → T040–T043
                                └── Polish: T044–T046
```

## Parallel Execution Examples

### Foundational

```text
T004 [P] Define typed API request/response contracts in the Contracts files.
T005 [P] Write version-token tests in DocumentSetupVersionTests.cs.
```

### User Story 1

```text
T008 [P] Write API listing tests in DocumentSetupsControllerListTests.cs.
T009 [P] Write listing/navigation tests in document-setup-list.spec.ts.
```

### User Story 2

```text
T017 [P] Write parent-create API tests in DocumentSetupsControllerCreateTests.cs.
T018 [P] Write parent-add browser tests in document-setup-add.spec.ts.
```

### User Story 3

```text
T025 [P] Write parent update API tests in DocumentSetupsControllerUpdateTests.cs.
T026 [P] Write child CRUD API tests in ApplicableModulesControllerTests.cs.
T027 [P] Write Oracle concurrency test in ApplicableModulesOracleConcurrencyTests.cs.
T028 [P] Write parent/child browser tests in document-setup-edit.spec.ts.
```

### User Story 4

```text
T038 [P] Write parent-delete API tests in DocumentSetupsControllerDeleteTests.cs.
T039 [P] Write deletion browser tests in document-setup-delete.spec.ts.
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases, including the read-only schema/UID gate.
2. Complete **User Story 1 only** to deliver Masters navigation and a working, paginated/filterable parent listing.
3. Stop and validate the listing independently using its xUnit and Playwright tests.

### Incremental Delivery

1. Add User Story 2 to create parent documents.
2. Add User Story 3 to edit parents and manage child configurations.
3. Add User Story 4 to safely delete child-free parents.
4. Complete polish and run the documented full validation.

Each phase has a focused test checkpoint; schema changes and new packages remain out of scope.

- [X] T049 Update the parent Add page to show a child listing with a visible Add button, open the child form on a separate route, and preserve the parent draft and staged children across navigation; cover the complete flow with Playwright.

- [X] T050 Keep the parent Add page open after successful saves with SweetAlert feedback, preserve/list persisted child rows, align the child Add button to the right, and centre the empty state in both Add and Edit.
