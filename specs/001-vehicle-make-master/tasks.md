---
description: "Implementation tasks for the Vehicle Make Master feature"
---

# Tasks: Vehicle Make Master

**Input**: Design documents from `specs/001-vehicle-make-master/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/vehicle-makes-api.md`, and `quickstart.md`

**Tests**: Required by constitution Articles 4 and B5. Add API and Playwright acceptance tests before or alongside implementation; tests against Oracle require an owner-approved test schema.

**Organization**: Tasks are grouped by user story and ordered by actual dependencies. Existing API/UI work is not assumed to satisfy the acceptance criteria until covered by the tasks and tests below.

**Change request 30-Oct-2026**: Column filters replace the global search, models move to their own pages, actions become icons with tooltips, notifications move to SweetAlert2, and the typography changes to Inter and Noto Sans Arabic. Where T010 to T014 mention "search" and T033 to T038 describe an "inline" model editor, Phase 9 (T044 to T060) supersedes that wording; the old tasks are not re-opened.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Tasks touch different files and can proceed in parallel once their listed prerequisites are met.
- **[Story]**: User-story label for work in a story phase only.
- Every task uses an unchecked checkbox, sequential ID, applicable labels, and an exact file path.

## Phase 1: Setup

**Purpose**: Verify implementation prerequisites and close decisions that block model persistence and lookup behavior.

- [ ] T001 Confirm the current package versions/licenses in `Spec-Driven-Development/SDD.API/SDD.API/SDD.API.csproj` and `Spec-Driven-Development/sdd-ui/package.json`; do not add, update, or remove packages without owner confirmation under constitution B4.
- [X] T002 Obtain owner-approved Oracle 19c read access and a dedicated test-schema/fixture data scope; verify the make/model keys, non-cascading model foreign key, `STD_LIST_ITEM` keys and data, active defaults/check constraints, audit timestamp behavior, and character-versus-byte limits; record verified facts or blockers in `specs/001-vehicle-make-master/data-model.md` without running DDL or changing database data.
- [X] T003 Record the approved exception for the single unpaged model-options lookup under constitution C3 in `.specify/memory/constitution.md`, naming B8, the fixed nine-list lookup, approval date, and rationale.
- [X] T004 Configure Playwright project paths and approved local API/UI origins in `Spec-Driven-Development/sdd-ui/playwright.config.ts`.
- [X] T005 Create or update the single stop-on-first-failure PowerShell runner at `Spec-Driven-Development/test-all.ps1` to run API tests, Angular tests, Playwright tests, formatting/lint checks, and production builds.

---

## Phase 2: Foundational

**Purpose**: Ensure shared generation, persistence mappings, and test infrastructure are ready. Oracle scaffolding is gated by T002; the options lookup implementation is additionally gated by T003.

- [X] T006 Verify and configure OpenAPI client generation from `Spec-Driven-Development/SDD.API/SDD.API/nswag.json` and `Spec-Driven-Development/SDD.API/SDD.API/SDD.API.csproj` into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts`; preserve generated-file ownership and do not hand-edit the client.
- [X] T007 After T002 confirms schema access and owner approval, scaffold the confirmed `BRM_VEH_MODEL` and `STD_LIST_ITEM` tables into `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Data/Scaffolded/SddDbContext.cs` and generated entity files; do not edit scaffolded files by hand or run migrations/DDL.
- [ ] T008 Add only non-scaffolded partial entity extensions, if required by the verified schema, in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Data/`; keep generated files unchanged.
- [ ] T009 Verify typed `PaginatedResult<T>`, global `ProblemDetails`/exception handling, timestamped privacy-safe logging, configuration validation, and Angular HTTP error handling in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Contracts/PaginatedResult.cs`, `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Program.cs`, `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Infrastructure/ProblemDetailsExceptionHandler.cs`, and `Spec-Driven-Development/sdd-ui/src/app/core/interceptors/api-error.interceptor.ts`; fix only gaps that block this feature.

**Checkpoint**: Shared error handling, generated-client workflow, and test commands are ready. Oracle-dependent tasks wait for T002; model dropdown options wait for T003.

---

## Phase 3: User Story 1 - Find and browse vehicle makes (Priority: P1) 🎯 MVP

**Goal**: Brokers can find makes across the full dataset, sort and page consistently, see Active status, and open a make read-only.

**Independent Test**: With more than 10 approved test makes, verify the default Make Code ascending order, Active status, full-set search/sort, paging, empty results, and read-only Open details.

### Tests for User Story 1

- [ ] T010 [P] [US1] Add API tests for page size 10, Make Code ascending default, full-set search and allow-listed sorting, total count, inactive-row visibility, and get-by-code behavior in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/VehicleMakeApiTests.cs` and `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/VehicleMakeListQueryTests.cs`.
- [ ] T011 [P] [US1] Add Playwright tests for list rendering, Active status, page navigation, empty results, search/sort across pages, and read-only Open in `Spec-Driven-Development/tests/vehicle-make-e2e/list-and-read.spec.ts`.

### Implementation for User Story 1

- [ ] T012 [US1] Ensure make list/detail DTOs and the server query expose Active status, search Make Code/Name/Short Name and allow-list sort fields across all records before paging at 10, defaulting to Make Code ascending, in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/DTOs/VehicleMakeListItemDto.cs`, `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/DTOs/VehicleMakeDto.cs`, `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeListQuery.cs`, and `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeService.cs`.
- [ ] T013 [US1] Ensure typed `GET /api/vehicle-makes` and `GET /api/vehicle-makes/{makeCode}` return the shared page shape and `ProblemDetails` for invalid query/not-found cases in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleMakesController.cs`.
- [ ] T014 [US1] Complete the standalone OnPush make list and read-only detail flow, including signal-based state, `inject()`, Material table/search/sort/page controls, empty state, visible Add/Delete controls, and immutable Make Code in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.html`, `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-form.component.ts`, and `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`.
- [ ] T015 [US1] Regenerate the list/read API client from the development OpenAPI document into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts` and resolve any generated-client type/build errors without editing generated output manually.

**Checkpoint**: User Story 1 passes its API and browser tests with list/read behavior independently verifiable.

---

## Phase 4: User Story 2 - Add a vehicle make (Priority: P1)

**Goal**: Brokers can add a validated make with optional English/Arabic details and choose its initial Active state.

**Independent Test**: Save a valid make and verify normalized values and `admin`; verify blank/invalid/overlength values and duplicate codes are rejected without persistence; verify Active defaults on and can be set off on creation.

### Tests for User Story 2

- [ ] T016 [P] [US2] Add API tests for required fields; Make Code length 1-12, letters/digits/hyphens only and capitals; Make Name 1-100; Short Name 1-30; Remarks up to 2000; Arabic fields up to 100/30/2000 preserved exactly; English word capitalization and extra-space normalization; duplicate rejection; Active default/selection; and `admin` audit values in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/VehicleMakeInputRulesTests.cs` and `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/VehicleMakeApiTests.cs`.
- [ ] T017 [P] [US2] Add Playwright tests for required/length messages, Additional Information, right-to-left Arabic preservation, Active default and override, successful creation, and duplicate-code rejection in `Spec-Driven-Development/tests/vehicle-make-e2e/create-vehicle-make.spec.ts`.

### Implementation for User Story 2

- [ ] T018 [US2] Ensure create validation and persistence enforce the exact Vehicle Make constraints in `specs/001-vehicle-make-master/data-model.md`: “Letters, digits, or hyphens only; save in capitals; unique; immutable after creation”; Make Name “100 characters”; Short Name “30 characters”; Remarks “2000 characters”; Arabic Make Name “100 characters”, Arabic Short Name “30 characters”, and Arabic Remarks “2000 characters”; preserve Arabic spacing, normalize non-Arabic text, default Active to on, and stamp `admin` in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeInputRules.cs`, `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeService.cs`, and `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/DTOs/CreateVehicleMakeRequest.cs`.
- [ ] T019 [US2] Ensure typed `POST /api/vehicle-makes` returns the saved DTO, field-keyed `400 ProblemDetails`, and duplicate-code `409 ProblemDetails` in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleMakesController.cs`.
- [ ] T020 [US2] Implement the standalone typed reactive add form with Make Code, English fields, collapsible Additional Information, Arabic RTL inputs, maximum-length feedback, Active initially on, save feedback, and list Add navigation in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-form.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-form.component.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.ts`.
- [ ] T021 [US2] Regenerate the create-request API types into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts` and verify the typed UI build.

**Checkpoint**: User Story 2 creates valid makes and rejects invalid or duplicate input through API and UI.

---

## Phase 5: User Story 3 - Open and edit a vehicle make (Priority: P1)

**Goal**: Brokers can review a make read-only, edit all fields except Make Code, save valid changes, and explicitly discard unsaved changes.

**Independent Test**: Open a saved make, verify read-only fields, edit and save valid values (including Active), then verify the discard prompt's cancel and confirm outcomes.

### Tests for User Story 3

- [ ] T022 [P] [US3] Add API tests for immutable Make Code, all update validation/normalization, invalid-update non-persistence, Active off/on behavior, and `admin` last-change audit values in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/VehicleMakeApiTests.cs`.
- [ ] T023 [P] [US3] Add Playwright tests for edit toggle, immutable Make Code, automatic Additional Information expansion, valid save, invalid feedback, Active restore/deactivate, and both discard-confirmation outcomes in `Spec-Driven-Development/tests/vehicle-make-e2e/edit-vehicle-make.spec.ts`.

### Implementation for User Story 3

- [ ] T024 [US3] Ensure `UpdateVehicleMakeRequest` excludes Make Code and includes editable English/Arabic fields and Active; validate and save updates with the User Story 2 rules and `admin` audit stamping in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/DTOs/UpdateVehicleMakeRequest.cs`, `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeInputRules.cs`, and `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeService.cs`.
- [ ] T025 [US3] Ensure typed `PUT /api/vehicle-makes/{makeCode}` returns `200`, field-keyed `400 ProblemDetails`, and `404 ProblemDetails` in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleMakesController.cs`.
- [ ] T026 [US3] Extend the form/detail UI with read-only-by-default fields, immutable Make Code, edit toggle, typed reactive validation, Active control, save/cancel flow, and confirmation before discarding unsaved changes in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-form.component.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-form.component.html`.
- [ ] T027 [US3] Regenerate the update API client into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts` and verify the typed UI build.

**Checkpoint**: User Story 3 updates a make without changing its code and safely handles discard.

---

## Phase 6: User Story 4 - Permanently delete a vehicle make (Priority: P2)

**Goal**: Brokers can permanently delete a make only after explicit confirmation, and cannot delete a make that still has models.

**Independent Test**: Cancel a deletion and verify no change; confirm deletion of a make without models; try deleting a make with models and verify a clear conflict and no data loss.

### Tests for User Story 4

- [ ] T028 [P] [US4] Add API tests for confirmed delete outcome, not-found `ProblemDetails`, make-with-models conflict response, and preservation of both parent and child rows after refusal in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/VehicleMakeApiTests.cs`.
- [ ] T029 [P] [US4] Add Playwright tests for cancellation, irreversible-warning confirmation, and the make-with-models refusal message in `Spec-Driven-Development/tests/vehicle-make-e2e/delete-vehicle-make.spec.ts`.

### Implementation for User Story 4

- [ ] T030 [US4] Guard permanent make deletion by checking for child models before removal and mapping a concurrent Oracle foreign-key violation to the same actionable `409 ProblemDetails`; preserve existing `404` and `204` behavior in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeService.cs` and `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleMakesController.cs`.
- [ ] T031 [US4] Add a Material confirmation dialog stating deletion is permanent and cannot be undone, wire it to the list Delete action, show the model-conflict response without exposing raw server text, and refresh the list after successful deletion in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.html`, and `Spec-Driven-Development/sdd-ui/src/app/shared/confirm-dialog/confirm-dialog.component.ts`.
- [ ] T032 [US4] Regenerate the delete API client into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts` and verify its `204` and conflict handling types.

**Checkpoint**: User Story 4 proves confirmation/cancellation and blocks parent deletion while any model exists.

---

## Phase 7: User Story 5 - Manage the models of a vehicle make (Priority: P2)

**Goal**: Brokers can page through, add, edit, soft-delete, restore, and permanently delete models inline on a saved make; new-make forms never show models.

**Independent Test**: Open a saved make, verify its own models are listed 10 per page in Model Code ascending order, add/edit/delete a model inline, verify unsaved-row confirmation and independent make changes, and confirm the new-make form has no models section.

### Tests for User Story 5

- [ ] T033 [P] [US5] Add API tests for make-scoped paging/order, composite-key uniqueness, duplicate errors, immutable Model Code, every required/optional model field and numeric constraint, `admin` auditing, Active default/independence, fixed-list dropdown validation, preservation of unchanged inactive selections, and model delete outcomes in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleModels/VehicleModelApiTests.cs`.
- [X] T034 [P] [US5] Add Playwright tests for read-only model listing, inline create/edit/delete, model-code locking, empty state, model-row discard confirmation, independent make/model saves, dropdown labels and selections, Active status, and no models on new-make forms in `Spec-Driven-Development/tests/vehicle-make-e2e/manage-vehicle-models.spec.ts`.

### Implementation for User Story 5

- [X] T035 [US5] Implement model DTOs and request validation using the exact rules in `specs/001-vehicle-make-master/data-model.md`: Model Code is required, “12 characters”, “Letters, digits, hyphens only; saved in capitals; unique within its make; immutable after creation”; Model Name “100 characters”; Short Name “30 characters”; Remarks “2000 characters”; Arabic fields “100 / 30 / 2000 characters” preserved exactly; the nine list-code fields are optional 12-character dropdowns; Weight and Load Capacity are optional 100-character text; Engine Capacity is a non-negative whole number; Make Year is a non-negative whole number up to 4 digits; Seats, Passengers, and Drivers are non-negative whole numbers up to 3 digits; Value is a non-negative AED decimal; Active is `Y` or `N`, defaults on, and is independent of make Active, in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/DTOs/VehicleModelDto.cs`, `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/DTOs/CreateVehicleModelRequest.cs`, `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/DTOs/UpdateVehicleModelRequest.cs`, and `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleModelInputRules.cs`.
- [X] T036 [US5] Implement make-scoped model paging (10 rows, Model Code ascending), create/update/delete with `admin` audit fields, `(VMOD_VMAK_CODE, VMOD_CODE)` uniqueness, fixed `STD_LIST_ITEM` type validation, inactive-current-value preservation, and safe Oracle constraint-error mapping in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleModelService.cs`.
- [X] T037 [US5] Implement typed nested model list/create/update/delete endpoints and the fixed read-only `GET /api/vehicle-model-options` response with active English descriptions ordered by description; return `ProblemDetails` for all errors and keep the options lookup unpaged only after T003 in `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleModelsController.cs`, `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleModelOptionsController.cs`, and `Spec-Driven-Development/Spec-Driven-Development/SDD.API/SDD.API/Program.cs`.
- [X] T038 [US5] Add the inline paged model list and typed reactive row editor with read-only display, empty state, model Active status, fixed dropdown options, immutable make/model keys, independent row saves, and discard/delete confirmation while hiding models for a new make in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-model-list.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-model-list.component.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-form.component.html`.
- [X] T039 [US5] Regenerate all model CRUD and options types into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts`; resolve OpenAPI/client/UI type errors without manual edits to generated output.

**Checkpoint**: User Story 5 implementation is in place. API coverage passes against the approved Oracle test schema; valid dropdown-selection and inactive-current-value acceptance remain blocked until the owner loads the approved lookup fixtures.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Close compliance, documentation, and end-to-end validation across all stories.

- [X] T040 [P] Update feature decision records with approved model-key, lookup, deletion, and C3-exception decisions in `docs/decisions/vehicle-make-master.md`.
- [X] T041 [P] Update the runnable prerequisites, commands, expected results, and complete five-story acceptance walkthrough in `specs/001-vehicle-make-master/quickstart.md` without including secrets.
- [X] T042 Verify formatter/linter configuration and single-runner coverage for API formatting/analyzers, Angular lint/format, API tests, Angular tests, Playwright, and production builds in `Spec-Driven-Development/sdd-ui/eslint.config.js`, `Spec-Driven-Development/sdd-ui/package.json`, and `Spec-Driven-Development/test-all.ps1`.
- [ ] T043 Run the complete test/build runner, fix failures, and record passing API, Angular, Playwright, formatting, lint, and build results in `Spec-Driven-Development/test-all.ps1` and `specs/001-vehicle-make-master/quickstart.md`.

> T043 remains open: available API, Angular, formatting, lint, and build checks pass, but fixture-dependent model dropdown acceptance and persisted Arabic maximum-length support cannot be completed without owner action.

---

## Phase 9: Change request 30-Oct-2026 (filters, model pages, icons, typography, notifications)

**Purpose**: Deliver FR-030 to FR-032 and the revised FR-018, FR-022 and FR-028 from the amended spec. Paths are relative to the repository root.

### Gate

- [ ] T044 Owner approves and manually installs the proposed packages under constitution B4 (`sweetalert2`, `@fontsource/inter`, `@fontsource/noto-sans-arabic` and one self-hosted Material icon-font package) in `Spec-Driven-Development/sdd-ui/package.json`; record each exact version and licence in `specs/001-vehicle-make-master/research.md` and `docs/decisions/vehicle-make-master.md`, including the B8 secondary-UI-library justification.

### Look and feel (FR-031, FR-032)

- [ ] T045 [P] Load Inter and Noto Sans Arabic from the installed packages (no network use), apply them app-wide and to Material through its typography settings, use Noto Sans Arabic for Arabic fields, and set body text to at least 16px, table text to at least 15px, with comfortable row spacing, in `Spec-Driven-Development/sdd-ui/src/styles.css`, `Spec-Driven-Development/sdd-ui/src/app/app.css` and `Spec-Driven-Development/sdd-ui/angular.json` if the package styles must be listed there.
- [ ] T046 [P] Load the self-hosted icon font and provide one icon-button pattern (icon, tooltip naming the action, accessible name) used for add, open, edit, delete and back in `Spec-Driven-Development/sdd-ui/src/styles.css` and `Spec-Driven-Development/sdd-ui/src/app/shared/icon-button/icon-button.component.ts`; replace the text buttons in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.html`, `vehicle-make-form.component.html` and `vehicle-model-list.component.html`.
- [ ] T047 One notification service wrapping SweetAlert2 for toasts and confirmations (plain text only, never its HTML option), then replace every `MatSnackBar` and confirm-dialog use, including the HTTP error interceptor and the unsaved-changes guard, with it; remove the old confirm dialog once nothing uses it, with unit tests, in `Spec-Driven-Development/sdd-ui/src/app/shared/notifications/notification.service.ts`, `Spec-Driven-Development/sdd-ui/src/app/core/interceptors/api-error.interceptor.ts`, `Spec-Driven-Development/sdd-ui/src/app/shared/unsaved-changes.guard.ts` and the vehicle-makes components.

### Column filters (User Story 1, FR-030)

- [ ] T048 [P] [US1] (written 30-Oct in `VehicleMakeListQueryTests.cs`, `VehicleMakeApiTests.cs`; tick once `dotnet test` is green) Add API tests for column filters: every operator on each text column, case-insensitivity, `%` and `_` matched literally, `notEquals` returning empty values, several filters combining with AND, blank filters ignored, an invalid operator returning `400`, filters applied before paging, and the removed `search` parameter no longer filtering, in `Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/VehicleMakeListQueryTests.cs` and `Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/VehicleMakeApiTests.cs`.
- [ ] T049 [P] [US1] Add Playwright tests for per-column filters and operator choice, Status filter, no global search box, empty results, clearing filters, and the list returning to page 1 when a filter changes, in `Spec-Driven-Development/tests/vehicle-make-e2e/list-and-read.spec.ts`.
- [ ] T050 [US1] (written 30-Oct in `ColumnFilters.cs`, `VehicleMakeListQuery.cs`, `VehicleMakeService.cs`, `VehicleMakesController.cs`; tick once tests pass) Replace `search` with the allow-listed per-column filters and operators (`startsWith`, `endsWith`, `contains`, `equals`, `notEquals`) for the makes list, escaping pattern characters and upper-casing both sides, in `Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeListQuery.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleMakesController.cs`.
- [ ] T051 [US5] (written 30-Oct in `VehicleModelListQuery.cs`, `VehicleModelService.cs`, `VehicleModelsController.cs`, `VehicleModelListQueryTests.cs`, `VehicleModelApiTests.cs`; tick once tests pass) Apply the same filters to the models list (no sorting), reusing the shared filter logic where the rules are identical, in `Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleModelService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleModelsController.cs`, with tests in `Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleModels/VehicleModelApiTests.cs`.
- [ ] T052 Regenerate the API client from the OpenAPI document into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts` and resolve type errors without hand edits.
- [ ] T053 [US1] Build one reusable column-filter control (operator dropdown plus text box; Active or Inactive choice for Status), wire it into the makes list and the models list, remove the global search box and its code, and reset to page 1 when a filter changes, in `Spec-Driven-Development/sdd-ui/src/app/shared/column-filter/column-filter.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.ts`, `vehicle-make-list.component.html`, `vehicle-model-list.component.ts` and `vehicle-model-list.component.html`.

### Model pages (User Story 5, revised FR-018, FR-022, FR-028)

- [ ] T054 [P] [US5] (written 30-Oct in `VehicleModelsController.cs`, `VehicleModelService.cs`, `VehicleModelApiTests.cs`; tick once tests pass) Add a get-one-model endpoint (`GET /api/vehicle-makes/{makeCode}/models/{modelCode}`) with API tests for success and the two not-found cases, in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleModelsController.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleModelService.cs` and `Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleModels/VehicleModelApiTests.cs`; regenerate the client afterwards (T052 again).
- [ ] T055 [P] [US5] Update the Playwright model tests for separate add and edit pages: opening from the icons, the make shown on the page, saving returning to the make with the model listed, discard confirmation on leaving, and delete from the list, in `Spec-Driven-Development/tests/vehicle-make-e2e/manage-vehicle-models.spec.ts`.
- [ ] T056 [US5] Move model add and edit out of the make page into one model form page (add and edit modes, Model Code locked on edit, dropdowns loaded when the page opens), keep the model list on the make page with Add and Edit visible only while make editing is on, and return to the make after saving, in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-model-form.component.ts`, `vehicle-model-form.component.html`, `vehicle-model-list.component.ts`, `vehicle-model-list.component.html`, `vehicle-make-form.component.html` and `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`.
- [ ] T057 [US5] Add the unsaved-changes confirmation for leaving the model page, and for leaving the make page for a model page while the make has unsaved changes, using the notification service, in `Spec-Driven-Development/sdd-ui/src/app/shared/unsaved-changes.guard.ts` and the make and model form components.

### Close-out

- [ ] T058 Update every Playwright test that finds buttons by visible text so it uses the icon buttons' accessible names, in `Spec-Driven-Development/tests/vehicle-make-e2e/`.
- [ ] T059 [P] Update `specs/001-vehicle-make-master/quickstart.md` (filters, model pages, new packages and how to install them) and `docs/decisions/vehicle-make-master.md` (SweetAlert2, typefaces, filter design, model pages).
- [ ] T060 Run the complete runner `Spec-Driven-Development/test-all.ps1`, fix failures, and record the results in `specs/001-vehicle-make-master/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 is a package-policy check; T002 gates Oracle inspection/scaffolding; T003 is a prerequisite only for model-options implementation; T004 and T005 establish browser and test-runner infrastructure.
- **Foundational (Phase 2)**: T006 and T009 prepare shared API/client behavior. T007-T008 require T002 and block model persistence work. They do not prevent make-only story work from starting.
- **User Stories**: US1 can start after shared API/client and test infrastructure. US2 follows US1 to use its Add action. US3 follows US2 to extend the same form. US4 needs US1 and the model mapping from T007 to enforce FR-026. US5 needs T002, T003, T007, and US1's saved-make detail route.
- **Polish (Phase 8)**: Depends on all selected stories and their tests; T043 runs last.
- **Change request (Phase 9)**: T044 (package approval and install by the owner) gates every task that uses SweetAlert2, the typefaces or the icon font (T045 to T047, T053, T056, T058). Filter work (T048 to T053) and model-page work (T054 to T057) are independent of each other. T060 runs last and supersedes T043 as the final full run.

### User Story Dependencies

- **US1 (P1)**: Independent after shared API/client and test setup.
- **US2 (P1)**: Uses the list Add action from US1.
- **US3 (P1)**: Extends US2's typed add form for edit/update.
- **US4 (P2)**: Uses US1's list Delete action and requires the child-model mapping; does not require full US5 model UI.
- **US5 (P2)**: Requires a saved-make detail route and approved model/list schema mappings; it does not depend on US2 or US3 for the model API, but the complete page integration uses their make form.

### Within Each User Story

- Write and run the story's API/browser tests before or alongside implementation.
- Complete API validation and service behavior before exposing the matching generated client.
- Generate clients only from OpenAPI; never edit generated files by hand.
- Complete the independent acceptance test before marking a story done.

### Parallel Opportunities

- T004 and T005 can run in parallel after the setup paths are confirmed.
- Within each story, its API test and Playwright test tasks can run in parallel because they use separate files.
- After shared setup, US1 server work can run separately from its Angular test work; integrate before the story checkpoint.
- US4 API deletion guard can proceed independently from the confirmation dialog after T007 and US1 are ready.
- In US5, DTO/input-rule work and Playwright test authoring can proceed in parallel; service/endpoints depend on model schema mappings, and UI integration depends on the generated API client.
- T040 and T041 can run in parallel because they update separate documentation files.

## Parallel Example: User Story 1

```text
Task: T010 API list/read tests in Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/VehicleMakeApiTests.cs and VehicleMakeListQueryTests.cs
Task: T011 Browser list/read tests in Spec-Driven-Development/tests/vehicle-make-e2e/list-and-read.spec.ts
```

## Implementation Strategy

### MVP First

1. Complete the required shared setup and test runner; defer Oracle-specific work until approved access is confirmed.
2. Complete **US1 only** for the MVP: browse, search, sort, page, and open make details read-only.
3. Validate US1 independently with more than 10 approved makes and its API/browser tests.
4. Add US2 create, US3 edit, and US4 safe permanent deletion as separately tested increments.
5. Add US5 inline model maintenance only after the C3 exception and Oracle schema gates are complete.

### Incremental Delivery

- US1 delivers a browsable, searchable, sortable make list and read-only details.
- US2 adds validated make creation.
- US3 adds controlled make editing and Active restore/deactivation.
- US4 adds confirmed permanent make deletion with child-model protection.
- US5 adds paged, inline vehicle-model CRUD and fixed lookup dropdowns.
- Run the complete test runner and quickstart acceptance walkthrough before declaring the feature complete.
