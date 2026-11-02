# Tasks: List Item Master

**Input**: Design documents from `specs/005-list-item-master/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/list-item-api.md`, `quickstart.md`

**Tests**: Automated tests are required by the feature specification and project constitution. Use code-only xUnit tests and Playwright/Vitest tests with mocked APIs; never connect test runs to Oracle or write real master data.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation. Every task has an exact path or command location.

## Phase 1: Setup

**Purpose**: Reuse the existing .NET API, Angular workspace, and pre-approved dependencies; no project or package initialisation is needed.

No setup tasks: both projects, shared dashboard, pagination, list-item scaffold, test frameworks, and API client generator already exist.

---

## Phase 2: Foundational - Verify the existing scaffold

**Purpose**: Confirm the existing `STD_LIST_ITEM` representation before implementing any feature behaviour. This is a blocking prerequisite for all user stories.

- [X] T001 Extend `Spec-Driven-Development/SDD.API/SDD.API.Tests/Data/BrokerDataContextModelTests.cs` with model-only assertions for `STD_LIST_ITEM`, key properties `LiType` and `LiCode`, and the exact field limits from `specs/005-list-item-master/data-model.md`; assert the model uses schema `IIRIS_RD_DEVP` and do not open a database connection.
- [X] T002 Run `dotnet test .\Spec-Driven-Development\SDD.API\SDD.API.Tests\SDD.API.Tests.csproj --filter FullyQualifiedName~BrokerDataContextModelTests` from the repository root and confirm the strengthened scaffold assertions pass before beginning feature implementation.

**Checkpoint**: The existing database-first model is verified; do not change DDL, migrations, or generated entity/context files.

---

## Phase 3: User Story 1 - Find and view list item configurations (Priority: P1) 🎯 MVP

**Goal**: Replace the Listing Master placeholder with a paginated, sortable, filterable list and read-only details page; preserve Company Master navigation and restore listing state.

**Independent Test**: With mocked API data, select List Item Master and find/open a configuration; verify list fields, details and history; change page/filter/sort, navigate away and return; confirm Company Master still opens unchanged.

### Tests for User Story 1

- [X] T003 [P] [US1] Add code-only read/list service tests in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/ListItemServiceReadTests.cs` covering default page size 10, filtering before paging, allow-listed sorting, deterministic type/code tie-breaks, detail mapping, and missing records.
- [X] T004 [P] [US1] Add mocked-API browser journey tests in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/ListItemListAndDetailsE2ETests.cs` for listing, filtering/sorting/paging, opening details, history, state restoration, and unchanged Company Master navigation.
- [X] T005 [P] [US1] Add Angular component tests in `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/listing-master-page.spec.ts` for loading the list, displaying empty/error states, and applying query-backed filter, sort, and page changes using mocked API responses.

### Implementation for User Story 1

- [X] T006 [P] [US1] Create `Spec-Driven-Development/SDD.API/SDD.API/Contracts/ListItemListItemDto.cs` with the six visible values `liType`, `liCode`, `description`, `shortDescription`, `value`, and `activeYn`, plus response-only `createdBy` and `lastUpdatedBy`.
- [X] T007 [P] [US1] Create `Spec-Driven-Development/SDD.API/SDD.API/Contracts/ListItemDto.cs` with `liType`, `liCode`, `description`, `descriptionL2`, `shortDescription`, `shortDescriptionL2`, `value`, `activeYn`, `flex01`, `flex02`, `createdBy`, `createdAt`, `lastUpdatedBy`, and `lastUpdatedAt`.
- [X] T008 [US1] Create `Spec-Driven-Development/SDD.API/SDD.API/Contracts/ListItemFilterOperator.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Contracts/ListItemListQuery.cs` with the shared text operators and the page, page-size, sort, and per-column filter inputs defined in `specs/005-list-item-master/contracts/list-item-api.md`.
- [X] T009 [US1] Add `Spec-Driven-Development/SDD.API/SDD.API/Services/IListItemRepository.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/ListItemRepository.cs` as the code-testable persistence boundary over the existing `BrokerDataContext.StdListItems`; do not modify scaffolded files or introduce database tests.
- [X] T010 [US1] Implement list and detail read operations in `Spec-Driven-Development/SDD.API/SDD.API/Services/ListItemService.cs`, applying allow-listed filters and sorting before counting/paging, default page size 10, stable `(LI_TYPE, LI_CODE)` ordering, DTO mapping, and `CancellationToken` propagation.
- [X] T011 [US1] Create `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ListItemController.cs` with typed `GET /api/list-items` and `GET /api/list-items/{liType}/{liCode}` actions and typed validation/not-found responses as defined in `specs/005-list-item-master/contracts/list-item-api.md`.
- [X] T012 [US1] Register `IListItemRepository`/`ListItemRepository` and `ListItemService` in `Spec-Driven-Development/SDD.API/SDD.API/Program.cs` without changing Company Master registrations or global error handling.
- [X] T013 [US1] Build the API and capture generated OpenAPI at `Spec-Driven-Development/SDD.API/SDD.API/openapi.json`, then run `npm run generate-api-client` from `Spec-Driven-Development/sdd-ui` to generate list/detail client types in `Spec-Driven-Development/sdd-ui/src/app/api/generated/`; do not hand-edit generated files.
- [X] T014 [US1] Replace the placeholder in `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/listing-master-page.ts`, `listing-master-page.html`, and `listing-master-page.css` with the paginated, sortable, filterable table, six specified data columns, keyboard-accessible history action, empty state, and actionable load errors using generated API types and the shared filter control.
- [X] T015 [US1] Add or update routes in `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts` and query-state handling in `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/listing-master-page.ts` so the existing `listing-master` route remains the listing, detail navigation restores page/filter/sort state, and the existing Company Master routes remain unchanged.
- [X] T016 [US1] Create read-only configuration details in `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.ts`, `list-item-details-page.html`, and `list-item-details-page.css`, displaying every business value and available audit history with loading, not-found, and operation-error states.

**Checkpoint**: With a mocked API, users can list and inspect configurations, restore list state, and still navigate to the existing Company Master.

---

## Phase 4: User Story 2 - Create and edit a list item configuration (Priority: P1)

**Goal**: Create configurations and edit mutable values in place on the existing details page, with API-authoritative validation, immutable identity, audit fields, and last-write-wins updates.

**Independent Test**: With mocked API data, create a valid configuration, verify it can be opened, enter edit mode on that details page, save a change and separately cancel an edit; confirm invalid and duplicate values are rejected and failures preserve entered values.

### Tests for User Story 2

- [X] T017 [P] [US2] Add code-only write and validation tests in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/ListItemServiceWriteTests.cs` for required composite identity, duplicate identity including concurrent-key conflict, field limits, Y/N active values, `Admin`/UTC audit values, immutable type/code, and last-write-wins updates.
- [X] T018 [P] [US2] Add mocked-API creation and in-place edit journeys in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/ListItemAddEditE2ETests.cs`, proving create, duplicate feedback, successful save, cancel, identity immutability, validation errors, and form-value retention on failure.
- [X] T019 [P] [US2] Add component tests in `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.spec.ts` for same-page view/edit transitions, read-only identity, typed validation, save/cancel behavior, and API errors using mocked services.

### Implementation for User Story 2

- [X] T020 [P] [US2] Create `Spec-Driven-Development/SDD.API/SDD.API/Contracts/CreateListItemRequest.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Contracts/UpdateListItemRequest.cs`; create requires `liType` and `liCode`, update omits both identity fields, and neither request accepts audit fields.
- [X] T021 [US2] Extend `Spec-Driven-Development/SDD.API/SDD.API/Services/ListItemService.cs` with create/update validation and persistence, preserving `LI_TYPE`/`LI_CODE` and unrelated stored values on update; enforce the data-model constraints exactly: `LI_TYPE` 20 characters, `LI_CODE` 12 characters, primary and alternate descriptions 100 characters each, primary and alternate short descriptions 30 characters each, `LI_VALUE` 100 characters, `LI_ACTIVE_YN` 1 character (`Y` or `N`), and `LI_FLEX_01`/`LI_FLEX_02` 100 characters each. Default omitted active status to `Y`, set audit identities to `Admin`, timestamps to UTC, and accept the latest valid save.
- [X] T022 [US2] Add typed `POST /api/list-items` and `PUT /api/list-items/{liType}/{liCode}` actions to `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ListItemController.cs`, returning typed created/conflict/validation/not-found responses and propagating cancellation.
- [X] T023 [US2] Regenerate `Spec-Driven-Development/SDD.API/SDD.API/openapi.json` from the completed API and rerun `npm run generate-api-client` from `Spec-Driven-Development/sdd-ui` so `Spec-Driven-Development/sdd-ui/src/app/api/generated/` includes the create/update operations and request models; do not edit generated files by hand.
- [X] T024 [US2] Add a typed reactive form in `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-form.ts`, `list-item-form.html`, and `list-item-form.css` with length limits from `specs/005-list-item-master/data-model.md`, required type/code on create, Y/N active status, all editable business fields, and field-level errors.
- [X] T025 [US2] Extend `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.ts` and `list-item-details-page.html` to enter edit mode on the same details page, keep type/code read-only, save or cancel without opening a separate edit page, retain values after API errors, and show audit timestamps in GST as DD-MM-YYYY.
- [X] T026 [US2] Add the create route and page in `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts` and `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-create-page.ts`/`.html`, submit through the generated client, show field/duplicate errors, and navigate to the new details view only after a successful save.

**Checkpoint**: A user can create and edit a configuration without leaving its details page; key fields cannot be changed and failures are clearly surfaced.

---

## Phase 5: User Story 3 - Remove an obsolete list item configuration (Priority: P2)

**Goal**: Permanently remove a configuration only after explicit user confirmation, without cascading or hiding database reference conflicts.

**Independent Test**: With mocked API responses, cancel and confirm removal in separate attempts; verify cancellation retains the item, successful removal returns to the list, and a reference conflict leaves it intact with an explanation.

### Tests for User Story 3

- [X] T027 [P] [US3] Add code-only delete tests in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/ListItemServiceDeleteTests.cs` for missing items, successful removal, and database-reported reference conflicts without a database connection.
- [X] T028 [P] [US3] Add mocked-API delete journeys in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/ListItemDeleteE2ETests.cs` for confirmation, cancellation, successful removal, and conflict feedback.
- [X] T029 [P] [US3] Add deletion interaction tests in `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-delete.spec.ts` for confirm/cancel, pending state, success navigation, and reference-conflict errors using mocked services.

### Implementation for User Story 3

- [X] T030 [US3] Extend `Spec-Driven-Development/SDD.API/SDD.API/Services/ListItemService.cs` with cancellation-aware deletion; do not cascade, return not-found for a missing composite key, and translate database-reported foreign-key/reference failures into a typed conflict while preserving the record.
- [X] T031 [US3] Add typed `DELETE /api/list-items/{liType}/{liCode}` to `Spec-Driven-Development/SDD.API/SDD.API/Controllers/ListItemController.cs`, returning no content only after successful deletion and typed not-found/conflict responses otherwise.
- [X] T032 [US3] Regenerate `Spec-Driven-Development/SDD.API/SDD.API/openapi.json` and the Angular API client under `Spec-Driven-Development/sdd-ui/src/app/api/generated/` after adding deletion; use the existing pinned generator command from `Spec-Driven-Development/sdd-ui`.
- [X] T033 [US3] Add a user-confirmed delete action to `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.ts` and `.html`; cancel without changes, show pending/error/success states, and return to the listing only after successful deletion.

**Checkpoint**: Removal requires confirmation, preserves the item on cancellation or reference conflict, and reports failures without showing success.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Verify the full feature, generated client, unchanged Company Master behavior, documentation, and test-data safety.

- [X] T034 Run `.\scripts\test.ps1` from the repository root and resolve feature-caused build, xUnit, Playwright, or Vitest failures without connecting tests to Oracle or changing database data.
- [X] T035 Follow `specs/005-list-item-master/quickstart.md` through scaffold-model verification, OpenAPI/client generation, and mocked UI checks; confirm Company Master routes and the existing scaffold remain unchanged.
- [X] T036 Review `specs/005-list-item-master/contracts/list-item-api.md`, `data-model.md`, and `quickstart.md` against the generated API signatures and implementation; update those exact documents if the generated contract or runnable steps differ.

**Validation note**: The final Release build and all 57 API unit tests passed; the full Angular suite passed (57 tests), and the feature-specific Playwright journeys plus dashboard navigation passed (7 tests). The full repository script also ran, but 6 unrelated Company Master Playwright tests failed on existing accordion selectors, alert strictness, and company query-state expectations; Company Master source and routes were not changed.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No work is required; the current solution, Angular workspace, scaffold, and dependencies are already present.
- **Foundational (Phase 2)**: Verify the model-only scaffold assertions before any user-story implementation; blocks all stories.
- **User Stories (Phases 3-5)**: Each requires the foundational check. US2 and US3 also reuse the US1 listing/detail/API baseline. Continue in priority order because their API client generation and details-page work touch shared files.
- **Polish (Phase 6)**: Depends on all selected user stories and final OpenAPI/client generation.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; delivers the list and read-only details foundation and is the MVP.
- **US2 (P1)**: Starts after US1; extends the same DTO/service/controller, generated client, route set, and details page to add creation and in-place editing.
- **US3 (P2)**: Starts after US1; adds removal to the same API controller/service and details page. It does not depend on edit behavior, but the shared files mean its implementation should be sequenced after US2 or coordinated carefully.

### Within Each User Story

- Write the story's xUnit, Playwright, and Vitest tests before implementing its behavior.
- Keep contract DTOs and API service/controller work ahead of OpenAPI and client generation.
- Generate the typed Angular client only from the API-generated OpenAPI document; do not hand-edit generated files.
- Complete the UI integration before validating the story independently.

### Parallel Opportunities

- T003, T004, and T005 are independent test files within US1 and can be authored in parallel after the scaffold gate.
- T006 and T007 are independent DTO files; they can be authored in parallel.
- T017, T018, and T019 are independent test files within US2.
- T020 request DTO files and US2 test authoring touch separate files; after tests are written, the request models can be developed in parallel with unrelated UI form-file scaffolding.
- T027, T028, and T029 are independent test files within US3.
- Avoid parallel edits to `ListItemService.cs`, `ListItemController.cs`, `app.routes.ts`, the generated API directory, or the List Item details page; each is intentionally extended across stories.

### Parallel Example: User Story 1

```text
After T002 passes, work on these independent test files in parallel:
- T003: ListItemServiceReadTests.cs
- T004: ListItemListAndDetailsE2ETests.cs
- T005: listing-master-page.spec.ts

After test cases are specified, create independent DTO files in parallel:
- T006: ListItemListItemDto.cs
- T007: ListItemDto.cs
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001-T002 to verify the existing scaffold without database access or schema changes.
2. Complete Phase 3 (US1) to expose a paginated list and read-only details, preserve Company Master navigation, and retain listing query state.
3. Run US1 xUnit, Playwright, and Vitest tests with fakes/mocks; stop and validate this increment independently.
4. Demo the list/details workflow before proceeding to create/edit or delete.

### Incremental Delivery

1. Foundation verified → no database or package changes.
2. Add US1 → validate the list and details as the MVP.
3. Add US2 → validate create and in-place edit without breaking US1.
4. Add US3 → validate confirmed removal and reference-conflict feedback without breaking prior stories.
5. Run the full repository test script and quickstart at the end.

---

## Notes

- Every task uses the required `- [ ] Tnnn [P?] [USn?] Description with path` format; setup/foundational/polish tasks intentionally omit story labels.
- `[P]` is used only for tasks that can work in separate files without depending on unfinished implementation.
- Do not add packages, edit generated scaffold code, change database definitions, use test database connections, or write real master data.
- Commit only after the relevant tests pass, following project workflow.
