# Tasks: Division and Department Master

**Input**: Design documents from `/specs/004-division-department-master/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/company-division-department-api.md`, and `quickstart.md`

**Tests**: Required by the project constitution: xUnit service tests, Playwright coverage for each user story, and Vitest coverage for Angular behavior. Automated tests must not connect to Oracle or modify database data.

**Organization**: Tasks are grouped by user story so the guided creation flow, company structure review, and structure editing can be implemented and verified as separate increments after the shared database scaffold prerequisite.

## Phase 1: Setup

**Purpose**: Verify the current solution and test entry point before feature work. Do not alter unrelated work.

- [X] T001 Run the existing baseline validation command `.\scripts\test.ps1` from the repository root and record any pre-existing failures before modifying `Spec-Driven-Development/SDD.API` or `Spec-Driven-Development/sdd-ui`; baseline build and 31 unit tests passed, while 2 of 12 Playwright E2E tests failed in company history/list-state assertions.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Scaffold and safely integrate the existing division table before any feature API or UI work.

**⚠️ CRITICAL**: User-story implementation MUST NOT begin until these tasks complete. The scaffold is read-only. If `STD_DIVISION` is missing or inaccessible, stop and request database-owner direction; do not create or alter database objects.

- [X] T002 From `Spec-Driven-Development/SDD.API/SDD.API`, scaffold only existing `STD_DIVISION` with `dotnet ef dbcontext scaffold "Name=ConnectionStrings:BrokerConnection" Oracle.EntityFrameworkCore --table STD_DIVISION --context StdDivisionScaffoldContext --context-dir Data\ScaffoldReview --output-dir Data\ScaffoldReview\Entities --no-onconfiguring` and no `--force`; inspect the generated key, company reference, field limits, and nullability. If the table is missing or inaccessible, stop without creating or changing database objects. Completed read-only scaffold: composite key `(DIVN_COMP_CODE, DIVN_CODE)`, company code 12 chars, name 100 chars, short name 30 chars, and mapped audit/contact/address fields.
- [X] T003 Integrate the scaffolded `StdDivision` entity at `Spec-Driven-Development/SDD.API/SDD.API/Data/Entities/StdDivision.cs` and expose its `DbSet` and model configuration through a new partial context file `Spec-Driven-Development/SDD.API/SDD.API/Data/BrokerDataContext.Division.cs`, implementing the existing partial model-configuration hook; leave generated `BrokerDataContext.cs` and the generated `StdDivision.cs` unedited.
- [X] T004 Add code-only model coverage for the integrated division mapping in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Data/BrokerDataContextModelTests.cs`, verifying the database table/key/column mapping against the isolated scaffold output without connecting to Oracle.

**Checkpoint**: The existing `STD_DIVISION` mapping is integrated and verified; no feature API or UI work has started before the scaffold.

---

## Phase 3: User Story 1 - Create a company with divisions and departments (Priority: P1) 🎯 MVP

**Goal**: Create a company and persist each guided step immediately as the user saves or advances; create divisions and assign new departments to one or more company divisions.

**Independent Test**: Through the company add flow, save Basic Details and verify persistence before the Division step appears; save divisions and verify persistence before the Department step appears; save department assignments and verify the completed structure on company details. Simulate a failed save and verify the user stays on that step with entered values available for retry.

### Tests for User Story 1

- [X] T005 [P] [US1] Add code-only service tests for company-scoped division creation, multi-division department assignment, immediate current-step persistence, validation failures, and retry-safe results in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/CompanyStructureServiceTests.cs`; verify the tests fail before implementation.
- [X] T006 [P] [US1] Add mocked-API Playwright coverage for Basic Details → Division → Department, proving company data is saved before leaving Basic Details, division data is saved before leaving Division, Department Save persists before opening company details, and failed saves do not advance or clear entered values in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyStructureAddE2ETests.cs`; verify the tests fail before implementation.
- [X] T007 [P] [US1] Add Vitest cases for the three-step progress state, bottom action behavior, step-local Reset, save-before-navigation, and preserving the current form after API failure in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts`; verify the tests fail before implementation.

### Implementation for User Story 1

- [X] T008 [P] [US1] Add typed create/update/response contracts for division records and company-scoped department assignments, including selected division codes, in `Spec-Driven-Development/SDD.API/SDD.API/Contracts/DivisionDtos.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Contracts/DepartmentDtos.cs`; use only fields and limits available from the generated division mapping and existing `StdDepartment`.
- [X] T009 [US1] Add `ICompanyStructureRepository` and its EF-backed implementation in `Spec-Driven-Development/SDD.API/SDD.API/Services/ICompanyStructureRepository.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Data/CompanyStructureRepository.cs` to read/write companies, divisions, and department assignment rows using the integrated context mapping.
- [X] T010 [US1] Implement company ownership checks, division creation, department creation for each selected division, current-step persistence, and validation in `Spec-Driven-Development/SDD.API/SDD.API/Services/CompanyStructureService.cs`; enforce verbatim data-model rules: “The company and every selected division must exist, and each division must belong to the same company,” “Adding a department to several divisions creates one assignment row per selected division,” and “When rows with the same company and department code exist for multiple divisions, their shared descriptive fields must be consistent.”
- [X] T011 [US1] Add typed company-scoped create endpoints for divisions and department assignments in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CompanyStructureController.cs`; propagate `CancellationToken`, return typed validation/not-found/conflict responses, and never return success when persistence fails.
- [X] T012 [US1] Build the API, generate its OpenAPI document from the controller return types, and regenerate the typed Angular client with `npm --prefix .\Spec-Driven-Development\sdd-ui run generate-api-client`; verify generated operations are available under `Spec-Driven-Development/sdd-ui/src/app/api/generated` and do not edit generated files by hand.
- [X] T013 [US1] Update `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts` to persist Basic Details immediately for Save, Save and Exit, and Save & Add Division, and persist the Division and Department steps before navigation; keep the user on the current step and retain values when its save fails.
- [X] T014 [US1] Update `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html` and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.css` with the Basic Details, Division, and Department progress indicator, division-entry cards, required bottom actions, multi-select company-division assignment control, and step-local Reset behavior; meet FR-025 by matching existing Company Master visual patterns and reusing theme variables, card borders/radii, spacing, typography, and action styling.

**Checkpoint**: User Story 1 can be demonstrated independently, including persisted saves before every step transition and a recoverable failed-save path.

---

## Phase 4: User Story 2 - Review company divisions and departments (Priority: P1)

**Goal**: Preserve the existing company details and display each division with its details and associated departments.

**Independent Test**: Open a company with multiple divisions and department assignments; verify all company details remain visible, each division has a named collapsible card, and an expanded card shows its associated departments. Verify the empty state when no divisions exist.

### Tests for User Story 2

- [X] T015 [P] [US2] Add code-only tests for loading divisions and their department assignments by company and division in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/CompanyStructureReadTests.cs`; verify foreign-company records are excluded and the tests fail before implementation.
- [X] T016 [P] [US2] Add mocked-API Playwright tests for retained company details, division cards, expanded department tables, collapse behavior, and the no-divisions empty state in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyStructureDetailsE2ETests.cs`; verify the tests fail before implementation.
- [X] T017 [P] [US2] Add Vitest coverage for company structure loading, card expansion/collapse, department rows, and empty-state rendering in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts`; verify the tests fail before implementation.

### Implementation for User Story 2

- [X] T018 [US2] Add company-scoped read operations for divisions and their department assignments to `Spec-Driven-Development/SDD.API/SDD.API/Services/CompanyStructureService.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Data/CompanyStructureRepository.cs`, and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CompanyStructureController.cs`; expose distinct logical departments only within the requested company.
- [X] T019 [US2] Regenerate the API OpenAPI document and typed Angular client after adding the company-structure read operations; use `npm --prefix .\Spec-Driven-Development\sdd-ui run generate-api-client` and leave generated client files untouched by hand.
- [X] T020 [US2] Update `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts` to load and present generated division and department response types for the selected company while preserving the existing company detail behavior.
- [X] T021 [US2] Update `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css` to add the Divisions header, named collapsible division cards, expanded detail/department tables, and an explicit empty state without removing current company details; meet FR-025 using the existing details-panel, section, card, spacing, and typography conventions.

**Checkpoint**: User Story 2 can be tested independently with mocked API responses and does not require the edit workflow from User Story 3.

---

## Phase 5: User Story 3 - Edit the company structure (Priority: P1)

**Goal**: Edit division details in place, create or link departments, and remove one department assignment without affecting other divisions.

**Independent Test**: Edit a division, create a new department and link an existing company department through separate popups, remove one assignment, and verify other assignments remain. Confirm deletion warnings and verify a division with unresolved department assignments cannot be deleted.

### Tests for User Story 3

- [X] T022 [P] [US3] Add code-only service tests for division updates/deletion, linking existing department assignments, duplicate prevention, and assignment removal; assert that “Removing an assignment from one division leaves other assignments intact” and “Removing the final division assignment is blocked” in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/CompanyStructureEditTests.cs`; verify the tests fail before implementation.
- [X] T023 [P] [US3] Add mocked-API Playwright tests for in-place division editing, Add New Department, Add Existing Departments, delete confirmation/cancellation, sticky department action column, and preserving other assignments after a removal in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyStructureEditE2ETests.cs`; verify the tests fail before implementation.
- [X] T024 [P] [US3] Add Vitest coverage for division edit state, department entry/selection popups, duplicate selection prevention, and per-division association removal in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts`; verify the tests fail before implementation.

### Implementation for User Story 3

- [X] T025 [US3] Implement division update/delete guards, existing-department linking, and single-assignment removal in `Spec-Driven-Development/SDD.API/SDD.API/Services/CompanyStructureService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Data/CompanyStructureRepository.cs`; enforce the data-model rules “Adding an existing department creates only missing target assignments,” “Removing the final division assignment is blocked,” and “Removing an assignment from one division leaves other assignments intact.”
- [X] T026 [US3] Add typed update/delete/link/remove endpoints and relationship conflict responses in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CompanyStructureController.cs`; require valid company/division ownership and propagate `CancellationToken`.
- [X] T027 [US3] Regenerate OpenAPI and the Angular API client after the division-edit and department-assignment endpoints are added; run `npm --prefix .\Spec-Driven-Development\sdd-ui run generate-api-client` and do not hand-edit generated files.
- [X] T028 [US3] Implement in-place division editing, save/cancel state, Add New Department and Add Existing Departments popup state, and association deletion confirmation in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts`; use generated API types and preserve unsaved input when a request fails.
- [X] T029 [US3] Add the division edit fields, sticky final department action column, Add New Department/Add Existing Departments controls, and accessible department popups to `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css`.

**Checkpoint**: User Story 3 can be tested independently against mocked API responses and preserves all unaffected division-department assignments.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the integrated feature against the documented scenarios and project-wide quality gates.

- [X] T030 Run `.\scripts\test.ps1` from the repository root after all stories are integrated, resolve failures caused by this feature, and verify the save-before-navigation scenarios from `specs/004-division-department-master/quickstart.md`. The API build and 46 unit tests pass; all 10 focused structure/add/edit browser tests pass. The full browser suite passes 17/19; its two failures are the same company-history/list-state assertions recorded in the baseline (T001). Save-before-navigation and failed-save recovery are verified by the focused E2E tests.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 establishes the baseline and must complete before changes.
- **Foundational (Phase 2)**: T002 → T003 → T004. The `STD_DIVISION` scaffold and mapping verification block every user story.
- **User Stories (Phases 3–5)**: US1 follows the foundation. US2 builds after US1 because the shared API/client and Company Master add/view paths are extended in sequence. US3 follows US2 because it edits the division cards and department tables added there.
- **Polish (Phase 6)**: T030 depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2. Delivers the MVP creation flow; each step is persisted before any save-triggered transition.
- **User Story 2 (P1)**: Starts after US1 to reuse the generated API client and integrated company structure responses; independently testable with mocked responses.
- **User Story 3 (P1)**: Starts after US2 because it extends the division cards and department tables with in-place editing; independently testable with mocked responses.

### Parallel Opportunities

- T005, T006, and T007 can be authored in parallel because they use separate API, Playwright, and Vitest files.
- T008 can run in parallel with the US1 test authoring tasks; T009 depends on the integrated scaffold, and T010 depends on T008 and T009.
- T015, T016, and T017 can be authored in parallel because they use separate test files.
- T022, T023, and T024 can be authored in parallel because they use separate test files.
- Within each story, API implementation and UI implementation are sequential across the generated OpenAPI/client boundary; do not start UI calls against missing generated methods.

## Parallel Example: User Story 1

```text
Task: T005 API service tests in SDD.API/SDD.API.Tests/Services/CompanyStructureServiceTests.cs
Task: T006 Playwright add-flow tests in SDD.API/SDD.API.E2E.Tests/CompanyStructureAddE2ETests.cs
Task: T007 Vitest add-flow tests in sdd-ui/src/app/pages/company-master/company-form.spec.ts
```

## Parallel Example: User Story 2

```text
Task: T015 API read tests in SDD.API/SDD.API.Tests/Services/CompanyStructureReadTests.cs
Task: T016 Playwright details tests in SDD.API/SDD.API.E2E.Tests/CompanyStructureDetailsE2ETests.cs
Task: T017 Vitest details tests in sdd-ui/src/app/pages/company-master/company-details-page.spec.ts
```

## Parallel Example: User Story 3

```text
Task: T022 API edit tests in SDD.API/SDD.API.Tests/Services/CompanyStructureEditTests.cs
Task: T023 Playwright edit tests in SDD.API/SDD.API.E2E.Tests/CompanyStructureEditE2ETests.cs
Task: T024 Vitest edit tests in sdd-ui/src/app/pages/company-master/company-details-page.spec.ts
```

## Implementation Strategy

### MVP First (User Story 1)

1. Run the existing baseline test command.
2. Scaffold and integrate `STD_DIVISION` without changing database objects; stop if the table is unavailable.
3. Implement and test User Story 1, including immediate persistence before every save-triggered transition and recovery from save failure.
4. Validate User Story 1 independently with mocked API responses before proceeding.

### Incremental Delivery

1. Complete setup and the scaffold foundation.
2. Deliver US1: company/division/department creation with per-step persistence.
3. Deliver US2: review the persisted structure in company details.
4. Deliver US3: edit divisions and maintain department associations.
5. Run the full validation command and all quickstart scenarios.
