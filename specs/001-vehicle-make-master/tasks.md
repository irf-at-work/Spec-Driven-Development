# Tasks: Vehicle Make Master

**Input**: Design documents from `specs/001-vehicle-make-master/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, and `quickstart.md`

**Tests**: Required by the project constitution. Add API and browser tests before or alongside implementation; do not treat manual checks as a substitute.

**Organization**: Tasks are grouped by user story so each feature slice can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Tasks can run in parallel because they touch different files and have no dependency on unfinished work.
- **[Story]**: User-story label for work in a story phase.
- Every task names the file or path it changes.

## Phase 1: Setup

**Purpose**: Resolve owner-approval blockers and prepare the approved project/test dependencies.

- [ ] T001 Obtain owner decisions for package proposals, Angular ESLint, and Oracle provider license; record accepted/rejected proposals in `specs/001-vehicle-make-master/research.md` before changing any package.
- [ ] T002 Obtain approval for Oracle 19c schema access and a dedicated test schema/fixture DML scope; verify the `BRM_VEH_make` description in `specs/001-vehicle-make-master/data-model.md` against the live schema (primary-key constraint on `VMAK_CODE`, column defaults or triggers including `VMAK_ACTIVE_YN`, character-versus-byte length semantics, and who sets `VMAK_CR_DT`/`VMAK_UP_DT`) without changing database objects or data. If a required constraint is absent, stop and request an owner-approved schema resolution; do not scaffold or write records until resolved.
- [ ] T003 [P] After T001 approval, keep the existing Angular 22.2 / TypeScript 6.0 framework packages unchanged and add Angular Material/CDK 22.2.5 (MIT), Angular ESLint schematics 22.6.0 (MIT), and Playwright Test 1.64.1 in `Spec-Driven-Development/sdd-ui/package.json` and `Spec-Driven-Development/sdd-ui/package-lock.json`.
- [x] T004 [P] After T001 approval, add Oracle.EntityFrameworkCore 10.23.26400, Microsoft.EntityFrameworkCore.Design 10.0.14, and NSwag.MSBuild 14.7.1 to `Spec-Driven-Development/SDD.API/SDD.API/SDD.API.csproj`.
- [x] T005 [P] After T001 approval, create the XUnit API test project with xunit.v3 4.0.2, Microsoft.NET.Test.Sdk 18.11.0, and Microsoft.AspNetCore.Mvc.Testing 10.0.14 in `Spec-Driven-Development/SDD.API/SDD.API.Tests/SDD.API.Tests.csproj` and add it to `Spec-Driven-Development/SDD.API/SDD.API.slnx`.
- [ ] T006 After T003, configure Playwright's browser/test paths and local API/UI origins in `Spec-Driven-Development/sdd-ui/playwright.config.ts`.
- [ ] T007 After T005 and T006, create the single PowerShell test/build runner at `Spec-Driven-Development/test-all.ps1`; make it stop on first failure and run API tests, Angular tests, Playwright tests, and production builds.

## Phase 2: Foundational

**Purpose**: Establish approved persistence, shared API behavior, generated types, and global error handling. These tasks block all user stories.

- [x] T008 After T002 and T004, reverse-scaffold only the owner-approved Oracle 19c tables into `Spec-Driven-Development/SDD.API/SDD.API/Data/Scaffolded/`; do not run migrations, alter schema/data, or edit generated files.
- [x] T009 Create the shared page response type with `items`, `page`, `pageSize`, and `totalCount` in `Spec-Driven-Development/SDD.API/SDD.API/Contracts/PaginatedResult.cs`.
- [x] T010 Configure global `ProblemDetails` responses and exception handling without stack traces, and log failures with timestamp, action/context, and error category while excluding secrets and unnecessary personal data in `Spec-Driven-Development/SDD.API/SDD.API/Program.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Infrastructure/ProblemDetailsExceptionHandler.cs`.
- [x] T011 Add the global HTTP error interceptor that converts API failures to plain British/Indian English next-step messages in `Spec-Driven-Development/sdd-ui/src/app/core/interceptors/api-error.interceptor.ts`.
- [x] T012 Add an example API settings file with placeholder-only Oracle connection configuration and validate required configuration at startup in `Spec-Driven-Development/SDD.API/SDD.API/appsettings.Example.json` and `Spec-Driven-Development/SDD.API/SDD.API/Program.cs`; keep real credentials in user-secrets or environment variables.
- [ ] T013 After T004 and T009, configure NSwag to generate the typed Angular client from the API OpenAPI document into `Spec-Driven-Development/sdd-ui/src/app/generated/`; keep generated files out of manual edits.

**Checkpoint**: Do not start user-story implementation until required approvals, approved schema scaffolding, shared pagination, ProblemDetails handling, generated-client setup, and test infrastructure are ready.

## Phase 3: User Story 1 - Find and browse vehicle makes (Priority: P1)

**Goal**: Brokers can browse, search, sort, page through all makes, and open a make read-only.

**Independent Test**: With more than 10 approved test records, verify Make Code ascending initial order, full-set search/sort, page navigation, empty results, and read-only Open details.

### Tests for User Story 1

- [ ] T014 [P] [US1] (written in `VehicleMakeApiTests.cs` and `VehicleMakeListQueryTests.cs`; tick once run green against the test schema) Add API tests for page size, initial Make Code ordering, global search/sort, valid sort allow-list, total count, and get-by-code behavior in `Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/ListAndReadVehicleMakesTests.cs`.
- [ ] T015 [P] [US1] Add Playwright tests for list rendering, pagination, empty results, search/sort across pages, and Open action in `Spec-Driven-Development/tests/vehicle-make-e2e/list-and-read.spec.ts`.

### Implementation for User Story 1

- [x] T016 [US1] Create `VehicleMakeListItemDto` and `VehicleMakeDto` using the approved scaffolded entity mapping in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/VehicleMakeListItemDto.cs` and `Spec-Driven-Development/SDD.API/SDD.API/DTOs/VehicleMakeDto.cs`.
- [x] T017 [US1] Implement server-side Make Code/Name/Short Name search, allow-listed sorting, Make Code ascending default order, page size 10, and get-by-code query in `Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeService.cs`.
- [x] T018 [US1] Add typed `GET /api/vehicle-makes` and `GET /api/vehicle-makes/{makeCode}` actions returning `PaginatedResult<VehicleMakeListItemDto>` and `VehicleMakeDto` in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleMakesController.cs`.
- [ ] T019 [US1] Generate the list/read TypeScript client from the updated OpenAPI document into `Spec-Driven-Development/sdd-ui/src/app/generated/`.
- [ ] T020 [US1] Build the standalone OnPush vehicle-make list with signals, `inject()`, Material table, search, sort, page controls, Open action, empty-results state, and visible Add/Delete action controls (wire Add behavior in US2 and Delete behavior in US4) in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.css`.
- [ ] T021 [US1] Build the read-only detail route with immutable Make Code and auto-expanded Additional Information when any optional value exists in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-detail.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-detail.component.html`, `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-detail.component.css`, and `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`.
- [ ] T022 [US1] Add focused Angular tests for list loading, paging, searching, sorting, empty results, and read-only detail display in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.spec.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-detail.component.spec.ts`.

**Checkpoint**: User Story 1 can be demonstrated independently with real approved test-schema records.

## Phase 4: User Story 2 - Add a vehicle make (Priority: P1)

**Goal**: Brokers can create valid makes with normalized English and unchanged optional Arabic details.

**Independent Test**: Create a valid make, verify it appears in the list with `admin` audit stamp, then verify blank/invalid/overlength values and duplicate Make Code are rejected without saving.

### Tests for User Story 2

- [ ] T023 [P] [US2] (written in `VehicleMakeApiTests.cs` and `VehicleMakeInputRulesTests.cs`; tick once run green) Add API tests for required fields, 12/100/30/2000 limits, allowed Make Code characters, code capitalization, English normalization, exact Arabic preservation, duplicate detection, and `admin` stamping in `Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/CreateVehicleMakeTests.cs`.
- [ ] T024 [P] [US2] Add Playwright tests for required/length messages, Additional Information expansion, RTL Arabic fields, create success, and duplicate-code rejection in `Spec-Driven-Development/tests/vehicle-make-e2e/create-vehicle-make.spec.ts`.

### Implementation for User Story 2

- [x] T025 [US2] Create the typed `CreateVehicleMakeRequest` and server-side validation/normalization for required unique Make Code, names, remarks, Arabic values, limits, and `admin` stamping in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/CreateVehicleMakeRequest.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeService.cs`.
- [x] T026 [US2] Add typed `POST /api/vehicle-makes` returning `200 OK` with the saved make (not `201`; see the contract), `400 ProblemDetails` for invalid fields, and `409 ProblemDetails` for duplicate Make Code in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleMakesController.cs`.
- [ ] T027 [US2] Generate the create-request API types into `Spec-Driven-Development/sdd-ui/src/app/generated/` from OpenAPI; do not hand-edit generated files.
- [ ] T028 [US2] Build the standalone typed reactive add form with Make Code, English fields, collapsible Additional Information, RTL Arabic inputs, max-length messages, client validation, and save feedback in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-form.component.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-form.component.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-form.component.css`; connect the list Add action in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.ts`.

**Checkpoint**: User Story 2 creates a valid make through the UI and API, and invalid or duplicate values never persist.

## Phase 5: User Story 3 - Open and edit a vehicle make (Priority: P1)

**Goal**: Brokers can switch an existing make from read-only to edit mode without changing Make Code and can discard unsaved changes explicitly.

**Independent Test**: Open a saved make, verify read-only mode, edit and save a field, then confirm canceling a discard prompt preserves changes while confirming restores saved values.

### Tests for User Story 3

- [ ] T029 [P] [US3] (written in `VehicleMakeApiTests.cs`; tick once run green) Add API tests that Make Code is immutable, updates validate and normalize every editable field, invalid updates do not persist, and `admin` is stamped on change in `Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/UpdateVehicleMakeTests.cs`.
- [ ] T030 [P] [US3] Add Playwright tests for edit toggle, immutable Make Code, automatic Additional Information expansion, save, and both discard-confirmation outcomes in `Spec-Driven-Development/tests/vehicle-make-e2e/edit-vehicle-make.spec.ts`.

### Implementation for User Story 3

- [x] T031 [US3] Create `UpdateVehicleMakeRequest` excluding Make Code and implement server-side validation, normalization, persistence, and `admin` audit stamping for editable fields in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/UpdateVehicleMakeRequest.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeService.cs`.
- [x] T032 [US3] Add typed `PUT /api/vehicle-makes/{makeCode}` with `200`, `400 ProblemDetails`, and `404 ProblemDetails` responses in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleMakesController.cs`.
- [ ] T033 [US3] Generate the update-request API types into `Spec-Driven-Development/sdd-ui/src/app/generated/` from OpenAPI; do not hand-edit generated files.
- [ ] T034 [US3] Extend the detail/form UI with edit toggle, immutable Make Code, typed reactive validation, automatic Additional Information expansion, save/cancel behavior, and a discard-confirmation dialog in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-detail.component.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-form.component.ts`.

**Checkpoint**: User Story 3 saves valid edits and confirms discard without changing Make Code.

## Phase 6: User Story 4 - Permanently delete a vehicle make (Priority: P2)

**Goal**: Brokers can permanently delete a make only after confirming an irreversible warning.

**Independent Test**: Cancel a deletion and verify the record remains; confirm another deletion and verify the record is permanently absent.

### Tests for User Story 4

- [ ] T035 [P] [US4] (written in `VehicleMakeApiTests.cs`; tick once run green) Add API tests for successful hard delete, no-content response, and not-found ProblemDetails in `Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/DeleteVehicleMakeTests.cs`.
- [ ] T036 [P] [US4] Add Playwright tests that canceling preserves the row and confirming the irreversible warning removes it in `Spec-Driven-Development/tests/vehicle-make-e2e/delete-vehicle-make.spec.ts`.

### Implementation for User Story 4

- [x] T037 [US4] Implement permanent deletion by Make Code in the service and typed `DELETE /api/vehicle-makes/{makeCode}` returning `204` or `404 ProblemDetails` in `Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/VehicleMakesController.cs`.
- [ ] T038 [US4] Generate the delete API client method into `Spec-Driven-Development/sdd-ui/src/app/generated/` from OpenAPI; do not hand-edit generated files.
- [ ] T039 [US4] Add a Material confirmation dialog stating deletion is permanent and cannot be undone, wire it to the list Delete action, and refresh the list after confirmed deletion in `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-delete-dialog.component.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/vehicle-makes/vehicle-make-list.component.ts`.

**Checkpoint**: User Story 4 proves both cancel and confirm behavior end to end.

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature, keep the owner guide accurate, and close quality gates.

- [x] T040 Add timestamped structured logs for successful and failed create, update, and delete actions with action/context and error category; exclude secrets, names, remarks, and unnecessary personal data in `Spec-Driven-Development/SDD.API/SDD.API/Services/VehicleMakeService.cs`.
- [ ] T041 Update the quickstart with the actual approved local connection setup, one-command test runner, expected results, and manual acceptance steps in `specs/001-vehicle-make-master/quickstart.md` without recording secrets.
- [ ] T042 Review implemented technical choices against `docs/decisions/vehicle-make-master.md` and record only approved deviations there; do not change the authorization-scope decision in this task.
- [ ] T043 After T001 approval, configure Angular ESLint (Angular 22 release line) and the existing Prettier 3.8.1 scripts/configuration in `Spec-Driven-Development/sdd-ui/eslint.config.js`, `Spec-Driven-Development/sdd-ui/.prettierrc.json`, `Spec-Driven-Development/sdd-ui/package.json`, and `Spec-Driven-Development/.editorconfig`; add `dotnet format whitespace --verify-no-changes`, `dotnet format analyzers --verify-no-changes`, and Angular lint/format checks to `Spec-Driven-Development/test-all.ps1`.
- [ ] T044 Run `Spec-Driven-Development/test-all.ps1` after all implementation and formatting/lint tasks, fix failures, and record passing API, Angular, Playwright, format, lint, and build results in `specs/001-vehicle-make-master/quickstart.md`.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 and T002 must be completed first. Package changes in T003-T005 are blocked until T001 is approved; T006 depends on T003, and T007 depends on T005 and T006. Database inspection/scaffolding is blocked until T002 authorizes access and resolves any missing audit fields.
- **Foundational (Phase 2)**: Depends on required setup approvals and packages; blocks all user stories.
- **User stories (Phases 3-6)**: Depend on the foundation. US2 follows US1 because its Add action is launched from the list; US3 follows US2 because it reuses the typed form; US4 follows US1 because it wires the list Delete action.
- **Polish (Phase 7)**: Depends on all four user stories. T043 also requires T001 package approval and T003; T044 runs only after T040-T043 and all story work are complete.

### User Story Dependencies

- **US1 (P1)**: After foundation; no dependency on other user stories.
- **US2 (P1)**: After US1 list route and generated client exist; adds the form and create workflow.
- **US3 (P1)**: After US2's shared typed form; extends it for edit/update.
- **US4 (P2)**: After US1's list Delete action; can be developed in parallel with US2/US3 if assigned separately, but final integration waits for the list component.

### Parallel Opportunities

- T003, T004, and T005 can run in parallel after T001 because they edit frontend package files, the API project, and the test project/solution respectively.
- T014 and T015 can run in parallel; they add API and browser tests in separate files.
- T023 and T024 can run in parallel; they add API and browser tests in separate files.
- T029 and T030 can run in parallel; they add API and browser tests in separate files.
- T035 and T036 can run in parallel; they add API and browser tests in separate files.
- Within each story, keep tests ahead of the implementation tasks they verify. Do not edit the same Angular package/lock files from parallel tasks.

## Parallel Example: User Story 1

```text
Task: T014 API list/read tests in Spec-Driven-Development/SDD.API/SDD.API.Tests/VehicleMakes/ListAndReadVehicleMakesTests.cs
Task: T015 Playwright list/read tests in Spec-Driven-Development/tests/vehicle-make-e2e/list-and-read.spec.ts
```

## Implementation Strategy

### MVP First

1. Complete setup approvals and the foundational phase.
2. Implement US1 to demonstrate the list, global search/sort, paging, and read-only Open flow.
3. Add US2 for the create workflow; US1 + US2 is the recommended first broker-usable release because it supports both finding and adding makes.
4. Add US3 edit and US4 permanent delete as separate tested increments.
5. Run the single test runner and the quickstart acceptance walkthrough before declaring completion.

### Incremental Delivery

- Setup + foundation establishes approved Oracle access, generated API types, shared pagination, and global errors.
- US1 delivers a browsable, searchable, sortable list and read-only details.
- US2 adds validated create behavior.
- US3 adds read/edit/discard behavior.
- US4 adds confirmed hard deletion.
- Each user-story phase adds its own API and Playwright tests before implementation.
