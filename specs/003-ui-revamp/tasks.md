# Tasks: Dashboard and Company UI Revamp

**Input**: Design documents from `specs/003-ui-revamp/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/filtering-contract.md`, and `quickstart.md`

**Organization**: Tasks are grouped by the three independently testable user stories. Write the story tests before implementing its behavior.

## Phase 1: Setup

**Purpose**: Establish a test baseline using the existing projects and tools. No project scaffolding or package changes are needed.

- [x] T001 Run the existing baseline test command in `scripts/test.ps1`; record any pre-existing failures without making unrelated changes. Baseline: .NET build succeeded, 31 tests passed, and one Vitest test failed because it expects the standalone “Loading companies” text that this feature removes; NU1902/NU1903 warnings report the existing `System.Security.Cryptography.Pkcs` 8.0.1 dependency.

---

## Phase 2: Foundational Shared Theme

**Purpose**: Establish the approved shared palette before story-specific pages are refreshed.

- [x] T002 Add a Playwright assertion for the specified warm-neutral, deep-teal, and restrained-amber palette in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/DashboardNavigationTests.cs`. The assertion failed against the original blue page token as expected.
- [x] T003 Apply the palette to global design tokens and shared navigation surfaces in `Spec-Driven-Development/sdd-ui/src/styles.css` and `Spec-Driven-Development/sdd-ui/src/app/layout/dashboard-layout.css`. The focused palette/navigation Playwright test passes.

**Checkpoint**: Shared palette is in place; each user story can now use it independently.

---

## Phase 3: User Story 1 - Use a refreshed dashboard (Priority: P1) - MVP

**Goal**: Keep the application shell and navigation while removing all sample dashboard content.

**Independent Test**: Load `/` in Playwright and verify that the main content area is empty, the navigation header remains visible, and the shared palette is applied.

### Tests for User Story 1

- [x] T004 [P] [US1] Add a Vitest test that the dashboard page renders no sample content in `Spec-Driven-Development/sdd-ui/src/app/pages/dashboard/dashboard-page.spec.ts`. The test failed on the existing sample dashboard content as expected.
- [x] T005 [P] [US1] Extend the initial dashboard Playwright journey to assert an empty content area and visible header in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/DashboardNavigationTests.cs`. The assertion failed on the existing sample content as expected.

### Implementation for User Story 1

- [x] T006 [US1] Remove the sample dashboard text and presentation demo from `Spec-Driven-Development/sdd-ui/src/app/pages/dashboard/dashboard-page.html` and `Spec-Driven-Development/sdd-ui/src/app/pages/dashboard/dashboard-page.ts`.
- [x] T007 [US1] Remove the now-unused presentation demo files `Spec-Driven-Development/sdd-ui/src/app/shared-presentation-example.ts`, `Spec-Driven-Development/sdd-ui/src/app/shared-presentation-example.html`, and `Spec-Driven-Development/sdd-ui/src/app/shared-presentation.spec.ts`.

**Checkpoint**: The dashboard is empty on initial load while the application shell and navigation remain usable.

---

## Phase 4: User Story 2 - Find companies in a clear, flexible table (Priority: P1)

**Goal**: Provide a reusable filter control and consistent operator behavior for all eight filterable company text columns; improve table layout, resizing, and action access.

**Independent Test**: With mocked company responses, apply each of the six operators, clear filters, verify URL state and pagination, scroll and resize the table, and confirm dates remain visible/sortable without filters. Use service tests to verify server-side matching before pagination.

### Tests for User Story 2

- [x] T008 [P] [US2] Add code-only service tests for all six operators, case-insensitive matching, trimmed and blank terms, null column values, combined filters, composed primary addresses, and pagination in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/CompanyServiceReadTests.cs`.
- [x] T009 [P] [US2] Add a controller contract test that verifies operator query parameters are passed to the list query in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Controllers/CompanyControllerTests.cs`.
- [x] T010 [P] [US2] Add component tests for the six operator choices, typed change events, clear behavior, and accessible labels in `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.spec.ts`.
- [x] T011 [P] [US2] Extend list-page tests for operator/value URL state, clearing, page reset, and absent date filters in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts`.
- [x] T012 [P] [US2] Extend the mocked Playwright list journey to cover all operators, clear behavior, date-column controls, action-column visibility, and adjustable widths in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyListAndDetailsE2ETests.cs`.

### Implementation for User Story 2

- [x] T013 [US2] Add the typed `CompanyFilterOperator` enum with `StartsWith`, `EndsWith`, `Contains`, `DoesNotContain`, `Equals`, and `NotEquals` in `Spec-Driven-Development/SDD.API/SDD.API/Contracts/CompanyFilterOperator.cs`.
- [x] T014 [US2] Add an optional operator property for each filterable text field to `Spec-Driven-Development/SDD.API/SDD.API/Contracts/CompanyListQuery.cs`; leave date fields without filter properties.
- [x] T015 [P] [US2] Add paired operator query parameters for the eight text columns and map them into `CompanyListQuery` in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CompanyController.cs`.
- [x] T016 [P] [US2] Validate operators and apply case-insensitive text predicates, null handling, and composed-address matching before counting/paging in `Spec-Driven-Development/SDD.API/SDD.API/Services/CompanyService.cs`. Service tests pass for each operator, address matching, blank terms, and null behavior; enum binding provides invalid-value rejection.
- [x] T017 [US2] Regenerate the typed Angular API client from the updated API OpenAPI output into `Spec-Driven-Development/sdd-ui/src/app/api/generated/` using the existing `generate-api-client` workflow; do not hand-edit generated files. Regenerated using the installed JDK 11.
- [x] T018 [P] [US2] Create the presentation-only shared filter control with signal inputs, typed change/clear outputs, the six operator choices, and accessible labels in `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.ts`, `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.html`, and `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.css`.
- [x] T019 [US2] Integrate the shared control and operator query state for all eight text columns, remove date filter controls, and preserve route state in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.ts` and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html`.
- [x] T020 [US2] Place Actions last and sticky, remove layout-shifting loading text, and refine table and pagination boundaries in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html` and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css`.
- [x] T021 [US2] Add pointer- and keyboard-operable column resize handles for every company-table column in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css`.

**Checkpoint**: All eight text filters use the common control, API results obey the selected operator before pagination, and the company table remains usable while filtering, scrolling, and resizing.

---

## Phase 5: User Story 3 - View, create, and edit companies in a consistent form (Priority: P1)

**Goal**: Keep company fields in the same positions and retain their values when switching between view and edit; make add use the same field layout.

**Independent Test**: Use mocked company data to compare add/view/edit field order and grouping, switch between view and edit, and verify values remain in place and unchanged when editing is cancelled.

### Tests for User Story 3

- [x] T022 [P] [US3] Add shared-field component tests for stable field order, read-only/editable modes, and retained values in `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.spec.ts`.
- [x] T023 [P] [US3] Extend mocked Playwright add/edit journeys to compare field order and positions across add, view, and edit, and verify retained values on edit/cancel in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyAddEditE2ETests.cs`.

### Implementation for User Story 3

- [x] T024 [US3] Create a reusable company-fields presentation component that keeps field order/grouping constant and switches between read-only and editable controls in `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.ts`, `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.html`, and `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.css`.
- [x] T025 [P] [US3] Use the shared company-fields component for the add form while preserving existing validation and create behavior in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts`, `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html`, and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.css`.
- [x] T026 [P] [US3] Use the same company-fields component for details and edit mode, retaining values and existing company rules in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css`.

**Checkpoint**: Add, view, and edit present fields in the same order and grouping; switching modes does not move or discard values.

---

## Phase 6: Polish and Cross-Cutting Validation

**Purpose**: Keep the design and decision records aligned, format the changes, and validate the full feature.

- [x] T027 [P] Update the manual filter, resize, dashboard, and form validation walkthrough in `specs/003-ui-revamp/quickstart.md` to reflect the completed UI.
- [x] T028 [P] Change the reusable-filter decision status from proposed to accepted after implementation in `docs/decisions/reusable-company-filters.md`.
- [x] T029 Format changed C# files with scoped `dotnet format whitespace` and changed Angular files with Prettier; scoped verification passed. The solution-wide formatter reports an unrelated existing whitespace issue in `Data/Entities/StdCompany.cs`, which was left unchanged.
- [x] T030 Run the aggregate test suite in `scripts/test.ps1` and the Angular production build with `npm --prefix Spec-Driven-Development/sdd-ui run build`; both passed.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No source changes; record the existing test baseline.
- **Foundational (Phase 2)**: Depends on T001; establishes shared palette tokens before story work.
- **User stories (Phases 3-5)**: Depend on T003. Each story can then be developed and tested independently, subject to the dependencies below.
- **Polish (Phase 6)**: Depends on completion of all three user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after T003; no dependency on US2 or US3.
- **US2 (P1)**: Starts after T003; API model/controller/service tasks and the shared filter-control task can proceed in parallel after their tests. Page integration waits for both the generated client (T017) and shared component (T018).
- **US3 (P1)**: Starts after T003; the add and details integrations can proceed in parallel after the shared fields component (T024). No dependency on US1 or US2 implementation.

### Parallel Opportunities

- **US1**: T004 and T005 can run in parallel because they use separate test files. T006 follows both tests; T007 follows T006 because it deletes the referenced demo.
- **US2**: T008-T012 are separate test files and can be authored in parallel. T015 and T016 can run in parallel after T014. T018 can run in parallel with the API work after T010. T019 waits for both T017 and T018, then T020 and T021 proceed in sequence.
- **US3**: T022 and T023 can run in parallel. After T024, T025 and T026 touch separate page files and can run in parallel.
- **Across stories**: Once T003 is complete, the dashboard, company table/API, and company form stories can be assigned to separate workers; integrate through the shared palette and existing test runner.

## Parallel Examples

### User Story 2

```text
After T008-T012 tests are authored:
- API work: T013 -> T014 -> T015 and T016 in parallel -> T017
- UI control: T018 can proceed in parallel with API work
- Page/table: T019 -> T020 -> T021 after T017 and T018
```

### User Story 3

```text
After T022-T023 tests are authored:
- T024 creates the shared company-fields component
- T025 and T026 can proceed in parallel after T024
```

## Implementation Strategy

### MVP First

1. Run T001 and complete the shared theme foundation T002-T003.
2. Complete User Story 1 (T004-T007) and validate the empty dashboard and retained navigation independently.
3. Continue to the table/filter story (T008-T021) and then the consistent forms story (T022-T026).
4. Complete formatting and the aggregate validation tasks (T027-T030).

### Incremental Delivery

- Deliver the empty dashboard and shared palette first as a usable visual shell.
- Deliver the reusable filter control and server-side operator behavior as a separate Company Master increment.
- Deliver the shared add/view/edit field layout as an independently testable form increment.
- Finish with full test/build validation and updated quickstart/decision documentation.

## Notes

- `[P]` marks tasks that can run concurrently without editing the same files or depending on incomplete tasks.
- `[US1]`, `[US2]`, and `[US3]` map to user stories in `specs/003-ui-revamp/spec.md`.
- All automated tests use API mocks or code-only fakes; do not connect to or modify Oracle data.
- Do not add, update, or remove packages without owner confirmation.
