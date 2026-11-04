# Tasks: Premium Insurance Brokerage UI Revamp

**Input**: Design documents from `specs/006-ui-revamp/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/screen-behaviour.md](./contracts/screen-behaviour.md), [quickstart.md](./quickstart.md)

**Tests**: Automated test tasks are included because the project constitution requires acceptance tests. Use the existing Vitest component suite and Playwright/.NET/xUnit suite; do not add dependencies or change application behavior.

**Organization**: Tasks are ordered by prerequisites and then by user story from `spec.md`. All UI tasks are presentation-only. Preserve existing handlers, bindings, route state, labels, validation, and data.

## Phase 1: Setup

**Purpose**: Capture a working baseline before visual changes.

- [X] T001 Capture the Vitest/build baseline and run the isolated `DashboardNavigationTests`; record outcomes in `specs/006-ui-revamp/plan.md`. Defer unmocked database scenarios until test-database isolation is verified.

---

## Phase 2: Foundational

**Purpose**: Establish shared visual tokens that every user story relies on.

**⚠️ CRITICAL**: Complete the global visual foundation before implementing screen-specific styling.

- [X] T002 Define the palette, typography roles, spacing, page-width, radius, elevation, focus, motion, and Angular Material system tokens in `Spec-Driven-Development/sdd-ui/src/styles.css`; retain a light default, the specified navy/slate/gold palette, WCAG contrast, reduced-motion support, and readable fallbacks without adding dependencies.

**Checkpoint**: Shared CSS tokens are available and the application builds with no route, API, form, or data changes.

---

## Phase 3: User Story 1 - Work in a cohesive brokerage platform (Priority: P1) 🎯 MVP

**Goal**: Establish consistent presentation in the shared shell and preserve current home and menu navigation.

**Independent Test**: Visit `/`, Company Master, and List Item Master at desktop, tablet, and mobile widths; verify the empty dashboard content, brand link, Masters menu destinations, typography, spacing, visible focus, and absence of page-level horizontal overflow.

### Tests for User Story 1

- [X] T003 [P] [US1] Extend shared-shell and navigation assertions in `Spec-Driven-Development/sdd-ui/src/app/app.spec.ts` to verify the existing Broker Portal link, Masters destinations, and routed outlet remain available.
- [X] T004 [P] [US1] Extend dashboard navigation acceptance coverage in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/DashboardNavigationTests.cs` to verify the existing destinations and empty dashboard content at desktop and narrow viewport widths.

### Implementation for User Story 1

- [X] T005 [US1] Refine the shared toolbar, brand, Masters menu, sticky header, content container, responsive spacing, focus states, and optional non-data glass surface in `Spec-Driven-Development/sdd-ui/src/app/layout/dashboard-layout.css`; preserve all existing links, menu triggers, route outlet, keyboard operation, and glass-free fallback.

**Checkpoint**: The shared shell is visually cohesive and its current menu and routing work independently of the other story-specific styling.

---

## Phase 4: User Story 2 - Find and open a company (Priority: P1)

**Goal**: Refine the Company Master table and shared text filters without changing the table's information or interaction behavior.

**Independent Test**: Open Company Master and verify its 11 columns, all supported text-filter operators and clear action, date-column sort/no-filter behavior, sorting, pagination, URL state, pointer/keyboard resize, row navigation, and sticky trailing Actions column, including bounded horizontal scrolling.

### Tests for User Story 2

- [X] T006 [P] [US2] Extend company-list component assertions in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts` to cover all existing columns, date filter absence, filter controls, pagination, resizable columns, and the trailing sticky Actions column.
- [X] T007 [P] [US2] Extend company-list browser acceptance coverage in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyListAndDetailsE2ETests.cs` to verify filters/operators, sorting, pagination, horizontal scrolling, row navigation, and action-column reachability at desktop and mobile widths.

### Implementation for User Story 2

- [X] T008 [P] [US2] Restyle the Company Master heading, table container, header/filter rows, data rows, hover/focus state, resize handle, sticky Actions column, empty/error state, and paginator in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css`; preserve all table dimensions needed for scrolling and every existing binding.
- [X] T009 [P] [US2] Restyle the shared filter input, operator control, focus treatment, and clear button in `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.css`; preserve the native select hit area, six operator values, accessible labels, and clear/change event behavior.

**Checkpoint**: The company listing remains fully usable with all columns and controls while presenting the shared visual system.

---

## Phase 5: User Story 3 - Review and maintain a company and its structure (Priority: P1)

**Goal**: Improve the visual hierarchy of company details, audit history, divisions, and departments while retaining current company and structure operations.

**Independent Test**: Open a company containing multiple divisions and departments; inspect all company fields and audit values; switch view/edit modes; expand/collapse divisions; and exercise existing save, cancel, delete, assignment, empty, and dialog states.

### Tests for User Story 3

- [X] T010 [P] [US3] Extend company details component assertions in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts` to verify field order/value retention, audit pairs, expandable division content, department tables, and existing dialogs remain present.
- [X] T011 [P] [US3] Extend company structure browser acceptance coverage in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyStructureDetailsE2ETests.cs` to verify multiple divisions, department visibility, empty/explanatory states, and existing structure actions at desktop and narrow viewport widths.

### Implementation for User Story 3

- [X] T012 [US3] Refine the company details presentation markup in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` to improve grouping of company values and actor/date audit pairs while preserving each field, binding, route link, action, dialog, and expansion state.
- [X] T013 [US3] Restyle the company details header/actions, shared details surface, audit grouping, division expansion headers, department tables, and dialogs in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css`; keep dense information opaque and retain existing responsive and scroll behavior.
- [X] T014 [US3] Refine view/read-only field grouping and form-field spacing in `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.css`; use whitespace and hierarchy instead of prominent individual field boxes while preserving the shared field grid and mobile breakpoints.

**Checkpoint**: Company details and hierarchy are easier to scan; all existing company, division, and department actions and state transitions still work.

---

## Phase 6: User Story 4 - Create a company or manage a list item (Priority: P2)

**Goal**: Extend the shared visual system to company setup and all List Item Master screens.

**Independent Test**: Complete the existing company setup steps and inspect their validation/save outcomes; use List Item Master filters, status selection, sorting, pagination, and navigation; then exercise existing list-item create/edit/details behavior.

### Tests for User Story 4

- [X] T015 [P] [US4] Extend company setup assertions in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts` to verify the existing Basic details, Division, and Department steps, field order, validation, and save/cancel actions remain intact.
- [X] T016 [P] [US4] Extend list-item listing assertions in `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/listing-master-page.spec.ts` to verify current columns, filters, active-status selection, sorting, pagination, history tooltip, and row navigation remain available.
- [X] T017 [P] [US4] Extend list-item form and details assertions in `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-create-page.spec.ts` and `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.spec.ts` to verify existing fields, immutable edit values, validation, audit display, and save/cancel behavior remain unchanged.
- [X] T018 [P] [US4] Extend company setup browser acceptance coverage in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyAddEditE2ETests.cs` to verify setup steps, responsive field/action layout, validation, and current save/navigation outcomes.
- [X] T019 [P] [US4] Extend list-item browser acceptance coverage in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/ListItemAddEditE2ETests.cs` and `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/ListItemListAndDetailsE2ETests.cs` to verify listing, create/edit behavior, record navigation, and responsive presentation without changing API or form rules.

### Implementation for User Story 4

- [X] T020 [P] [US4] Restyle the company setup progress indicator, setup panels, division cards, structure fields, and action rows in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.css`; preserve current breakpoints, step states, form layout, and all actions.
- [X] T021 [P] [US4] Apply the shared table, filter-row, status, row, action, empty/error, and pagination styling to `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/listing-master-page.css`; preserve scrolling, sorting, query state, row navigation, and existing controls.
- [X] T022 [P] [US4] Apply the shared premium form styling to `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-form.css`; preserve field order, immutable-field appearance, validation/error placement, and button behavior.
- [X] T023 [P] [US4] Apply shared page-heading, details, audit, action, and responsive treatments to `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.css` and `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-create-page.css`; preserve existing detail data and route/form behavior.

**Checkpoint**: Company creation and all List Item Master screens share the design system and retain existing user journeys.

---

## Phase 7: Polish & Cross-Cutting Validation

**Purpose**: Verify the full application remains accessible, responsive, and behaviorally unchanged.

- [X] T024 [P] Review and update the viewport, keyboard, contrast, reduced-motion, solid-glass-fallback, and screen-navigation procedures in `specs/006-ui-revamp/quickstart.md` to match the implemented UI while retaining the four viewport widths and all current route/interaction checks.
- [X] T025 Run the complete Vitest suite and production build using `Spec-Driven-Development/sdd-ui/package.json`; fix only regressions caused by this visual refresh and record final results in `specs/006-ui-revamp/plan.md`.
- [X] T026 Run the existing Playwright acceptance scenarios whose UI API requests are route-mocked; verify preserved journeys pass and record the result in `specs/006-ui-revamp/plan.md`. Exclude unmocked database scenarios until isolation of the local Oracle `FREEPDB1` fixture is confirmed.
- [X] T027 Validate all existing screens at 320 px, 768 px, 1024 px, and 1440 px, keyboard-only navigation, WCAG 2.2 AA contrast, reduced motion, and glass-effect fallback; fix any clipped or obscured UI in `Spec-Driven-Development/sdd-ui/src/styles.css`, `Spec-Driven-Development/sdd-ui/src/app/layout/dashboard-layout.css`, and the affected page/shared component CSS files under `Spec-Driven-Development/sdd-ui/src/app/`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No prerequisite; baseline validation and documentation recording.
- **Foundational (Phase 2)**: Depends on Setup; shared design tokens block all screen styling.
- **User Stories (Phases 3–6)**: Depend on the foundational token task. Stories are grouped for traceability and can be implemented in parallel after the foundation when separate contributors can avoid shared-file conflicts.
- **Polish (Phase 7)**: Depends on all desired stories being complete.

### User Story Dependencies

- **US1 (P1)**: Depends on the foundation; independent of other screen stories.
- **US2 (P1)**: Depends on the foundation; independent of US1 after shared tokens exist.
- **US3 (P1)**: Depends on the foundation; independent of US1 and US2 after shared tokens exist.
- **US4 (P2)**: Depends on the foundation; independent of US1–US3 after shared tokens exist.
- Cross-story integration requires checking global Material tokens and shared filter/company-field styles across all routes.

### Within Each User Story

- Add or update the story's targeted automated acceptance assertions before applying visual changes.
- Keep each UI task focused on its named stylesheet/template and do not change event wiring or business behavior.
- Run the independent test criteria at the story checkpoint before treating that story as complete.

### Parallel Opportunities

- After T002, US1–US4 can proceed in parallel if shared styles are not edited concurrently.
- Within US1, T003 and T004 can run in parallel; T005 follows those checks.
- Within US2, T006 and T007 can run in parallel; T008 and T009 are separate CSS files and can proceed independently after baseline checks.
- Within US3, T010 and T011 can run in parallel; T012–T014 touch separate files but should be reviewed together for consistent field/audit hierarchy.
- Within US4, T015–T019 touch distinct test files and can run in parallel; T020–T023 touch separate CSS files and can proceed in parallel after tests.
- T024 can run alongside T025 and T026 once story styling is complete. T027 is the final cross-screen review and any resulting CSS fixes must pass the full validation again.

### Parallel Example: User Story 2

```text
After T002:
Task: T006 company-list component preservation assertions in company-master-page.spec.ts
Task: T007 company-list browser acceptance checks in CompanyListAndDetailsE2ETests.cs

After those checks:
Task: T008 Company Master table presentation in company-master-page.css
Task: T009 shared filter presentation in filter-control.css
```

## Implementation Strategy

### MVP First (User Story 1)

1. Run baseline validation (T001).
2. Establish the shared design tokens (T002).
3. Implement and independently verify the shared shell/navigation refresh (T003–T005).
4. Stop and validate that the dashboard stays empty and the existing menu destinations work before starting other screens.

### Incremental Delivery

1. Complete Setup and Foundation.
2. Deliver US1 shared shell and design language.
3. Deliver US2 Company Master listing.
4. Deliver US3 company details, audit history, divisions, and departments.
5. Deliver US4 company setup and List Item Master screens.
6. Run cross-cutting browser, build, interaction, accessibility, and responsive checks.

### Completion Criteria

- All stories meet their independent test criteria.
- All existing frontend tests, build, and the required Playwright journeys pass.
- No routes, APIs, forms, validation rules, data, permissions, or business behavior changed.
- The final responsive/accessibility review finds no clipped, obscured, or unusable control.
