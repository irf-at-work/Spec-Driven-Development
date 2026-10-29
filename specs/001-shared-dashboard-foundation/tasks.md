# Tasks: Shared Dashboard Foundation

**Input**: Design documents from `specs/001-shared-dashboard-foundation/`

**Prerequisites**: `plan.md` and `spec.md` (required); `research.md`, `data-model.md`, `contracts/`, and `quickstart.md` (available)

**Tests**: Required by the project constitution: xUnit unit tests, Playwright for .NET end-to-end tests for each user story, Angular Vitest tests, and one documented test command.

**Organization**: Tasks are grouped by user story so the dashboard, shared presentation, pagination contract, and database reverse-engineering work can be verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other marked tasks because it edits separate files and has no unmet task dependency.
- **[Story]**: User-story label matching `spec.md`.
- Every task names the file or directory it creates, changes, or validates.

## Phase 1: Setup

**Purpose**: Align approved toolchains and establish the test projects and single test entry point.

- [x] T001 Obtain package-change approval and record the pinned versions and licences for Angular 21/Material, Oracle EF Core 10/design tooling, and required test dependencies in `docs/decisions/shared-dashboard-dependencies.md`; align `Spec-Driven-Development/sdd-ui/package.json`, `Spec-Driven-Development/sdd-ui/package-lock.json`, `Spec-Driven-Development/SDD.API/SDD.API/SDD.API.csproj`, and `Spec-Driven-Development/SDD.API/dotnet-tools.json`.
- [x] T002 [P] Create the backend unit-test project `Spec-Driven-Development/SDD.API/SDD.API.Tests/SDD.API.Tests.csproj`, reference `Spec-Driven-Development/SDD.API/SDD.API/SDD.API.csproj`, and add it to `Spec-Driven-Development/SDD.API/SDD.API.slnx`.
- [x] T003 [P] Create the Playwright/xUnit end-to-end test project `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/SDD.API.E2E.Tests.csproj`, reference only approved pinned test dependencies, and add it to `Spec-Driven-Development/SDD.API/SDD.API.slnx`.
- [x] T004 Create `scripts/test.ps1` to build and run the API unit, Playwright end-to-end, and Angular Vitest suites from the repository root, returning a non-zero exit code on any failure and installing Chromium if required.

## Phase 2: Foundational

**Purpose**: Verify the selected baseline and establish a reliable starting point before story implementation.

- [x] T005 Restore and build the .NET solution `Spec-Driven-Development/SDD.API/SDD.API.slnx` and build the Angular application in `Spec-Driven-Development/sdd-ui` after T001–T004; record any baseline failures in `specs/001-shared-dashboard-foundation/quickstart.md` without fixing unrelated issues.

**Checkpoint**: Approved, compatible toolchains and test projects are ready; user stories can proceed in the order below. Database access remains gated separately in US4.

## Phase 3: User Story 1 - Navigate the shared dashboard (Priority: P1) 🎯 MVP

**Goal**: Provide a common dashboard shell with a floating header and exactly two Masters destinations.

**Independent Test**: Launch the UI and use the header to open Company Master and Listing Master; verify there is one Masters menu with exactly those two entries and each selection changes to its corresponding route.

### Tests for User Story 1

- [x] T006 [P] [US1] Add Playwright end-to-end coverage for the visible Masters header, the exact two menu entries, and route selection in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/DashboardNavigationTests.cs`.
- [x] T007 [P] [US1] Add Angular component tests for the shared layout, menu labels, and routed content outlet in `Spec-Driven-Development/sdd-ui/src/app/app.spec.ts`.

### Implementation for User Story 1

- [x] T008 [US1] Create a standalone OnPush shared layout with a floating header, one accessible Masters dropdown, and a routed-content outlet in `Spec-Driven-Development/sdd-ui/src/app/layout/dashboard-layout.ts`, `Spec-Driven-Development/sdd-ui/src/app/layout/dashboard-layout.html`, and `Spec-Driven-Development/sdd-ui/src/app/layout/dashboard-layout.css`.
- [x] T009 [US1] Add the dashboard, Company Master, and Listing Master placeholder components and child routes, with the two exact menu destinations, in `Spec-Driven-Development/sdd-ui/src/app/pages/dashboard/dashboard-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/listing-master-page.ts`, and `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`.
- [x] T010 [US1] Integrate the shared layout and router into the root Angular application in `Spec-Driven-Development/sdd-ui/src/app/app.ts` and `Spec-Driven-Development/sdd-ui/src/app/app.html`, replacing the starter greeting without adding further top-level navigation.

**Checkpoint**: The dashboard shell and both placeholder destinations work independently of database scaffolding and pagination implementation.

## Phase 4: User Story 2 - Work with consistent shared presentation (Priority: P2)

**Goal**: Give repeated tables and input fields consistent shared styles in a professional blue-based interface that remains usable at narrow widths.

**Independent Test**: Inspect shared table and input examples and verify common visual tokens, legible labels, and usable controls at desktop and narrow viewport sizes.

### Tests for User Story 2

- [x] T011 [P] [US2] Add Playwright checks for responsive header/control layout and consistent computed styles on table and input examples in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/SharedPresentationTests.cs`.
- [x] T012 [P] [US2] Add Angular Vitest assertions for shared theme and reusable control classes in `Spec-Driven-Development/sdd-ui/src/app/shared-presentation.spec.ts`.

### Implementation for User Story 2

- [x] T013 [US2] Define reusable blue palette tokens and shared table, input, and form-control styles in `Spec-Driven-Development/sdd-ui/src/styles.css`; limit global selectors to styles genuinely reused across pages.
- [x] T014 [US2] Refine the shared header and content layout for responsive spacing, visible focus, and no label/control overlap in `Spec-Driven-Development/sdd-ui/src/app/layout/dashboard-layout.css`.
- [x] T015 [US2] Add and render a small shared-style example fixture with a representative table and input, without adding master CRUD fields or data, in `Spec-Driven-Development/sdd-ui/src/app/shared-presentation-example.ts`, `Spec-Driven-Development/sdd-ui/src/app/shared-presentation-example.html`, `Spec-Driven-Development/sdd-ui/src/app/pages/dashboard/dashboard-page.ts`, and `Spec-Driven-Development/sdd-ui/src/app/pages/dashboard/dashboard-page.html`.

**Checkpoint**: Shared presentation can be inspected and tested without implementing either master page's data-management workflow.

## Phase 5: User Story 3 - Receive consistent paginated results (Priority: P2)

**Goal**: Provide one reusable, inheritable generic response type whose serialized shape is `items`, `page`, `pageSize`, and `totalCount`, with a default page size of 10.

**Independent Test**: Construct and serialize results with items, an empty page, and an out-of-range page; verify JSON names, page metadata, total count, and the default page size without requiring a production listing endpoint or changing database data.

### Tests for User Story 3

- [x] T016 [P] [US3] Add xUnit tests for `PaginatedResult<T>` inheritance, the default page size of 10, explicit page metadata, empty items, and JSON field names in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Common/PaginatedResultTests.cs`.
- [x] T017 [P] [US3] Add a Playwright .NET end-to-end contract test using a test-only in-memory API fixture, not a production route or Oracle database, to verify serialized pagination metadata and empty/out-of-range results in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/PaginatedResultContractTests.cs` and `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/Fixtures/PaginatedResultTestHost.cs`.

### Implementation for User Story 3

- [x] T018 [US3] Implement the public inheritable generic `PaginatedResult<T>` response type with `Items`, one-based `Page`, `PageSize` defaulting to 10, and `TotalCount` in `Spec-Driven-Development/SDD.API/SDD.API/Common/PaginatedResult.cs`; keep list-query execution and database entities out of this type.
- [x] T019 [US3] Verify the response model serializes to the required contract and document the test result in `specs/001-shared-dashboard-foundation/contracts/paginated-result.schema.json` and `specs/001-shared-dashboard-foundation/quickstart.md`; do not add listing endpoints in this feature.

**Checkpoint**: The shared response contract is reusable and independently testable; future listing endpoints can supply filtered totals and page items without duplicating the response shape.

## Phase 6: User Story 4 - Use the existing master-data definitions (Priority: P2)

**Goal**: Make application representations of `STD_COMPANY`, `STD_DEPARTMENT`, and `STD_LIST_ITEM` match their current Oracle definitions without editing generated classes or changing the database.

**Independent Test**: Compare the generated EF model mappings for the three named tables with Oracle metadata using a read-only test configuration, and verify the dashboard remains available with the generated context registered.

The named scaffolding owner E0212 has authorised the read-only scaffold. The user confirmed the credential pasted into chat was rotated. `ConnectionStrings__BrokerConnection` is configured in the Windows user environment, and tracked settings contain no credential. Use `BrokerConnection` as the connection name; never print or copy its value.

### Tests for User Story 4

- [x] T020 [P] [US4] Add xUnit tests that inspect the generated EF model and assert mappings exist for exactly `STD_COMPANY`, `STD_DEPARTMENT`, and `STD_LIST_ITEM` in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Data/BrokerDataContextModelTests.cs`; use a dedicated test schema for any database access and perform no writes.
- [x] T021 [P] [US4] Add a Playwright end-to-end smoke test that launches the UI and API with the test configuration and verifies the dashboard remains usable after the generated context is registered, without exposing a production metadata endpoint, in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/DatabaseScaffoldSmokeTests.cs`.

### Implementation for User Story 4

- [x] T022 [US4] Before reverse engineering, confirm the named scaffolding owner, verify `ConnectionStrings__BrokerConnection` is supplied through an approved environment-variable or operating-system credential source, and remove any real credential from tracked settings without printing it in `Spec-Driven-Development/SDD.API/SDD.API/appsettings.json`.
- [x] T023 [US4] Run EF Core 10 reverse engineering from `Spec-Driven-Development/SDD.API/SDD.API` using `Name=ConnectionStrings:BrokerConnection`, only `--table STD_COMPANY --table STD_DEPARTMENT --table STD_LIST_ITEM`, `--context BrokerDataContext`, `--context-dir Data`, `--output-dir Data\Entities`, and `--no-onconfiguring`; do not specify `--schema` or `--force`, do not apply DDL/data changes, and review the generated files under `Spec-Driven-Development/SDD.API/SDD.API/Data/`.
- [x] T024 [US4] Register the generated `BrokerDataContext` with the API dependency-injection container using the configured connection key in `Spec-Driven-Development/SDD.API/SDD.API/Program.cs`, without adding migrations or editing files under `Spec-Driven-Development/SDD.API/SDD.API/Data/`.

**Checkpoint**: The three requested tables are represented from Oracle metadata, generated classes remain unmodified, and no production data or schema has been changed.

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature, keep project guidance accurate, and preserve boundaries for the separate master-page work.

- [x] T025 Run `scripts/test.ps1` and resolve feature-related build, xUnit, Playwright, and Vitest failures; leave unrelated baseline failures documented in `specs/001-shared-dashboard-foundation/quickstart.md`.
- [x] T026 Validate every runnable scenario in `specs/001-shared-dashboard-foundation/quickstart.md` and update it with verified local commands and expected results, including the read-only scaffold scenario.
- [x] T027 Confirm the shared API exception handler, global Angular HTTP error interceptor, and constitution-compliant script runner are tracked as separate prerequisites before either master-page feature in `specs/001-shared-dashboard-foundation/plan.md`; do not add EF migrations.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately. T001 is a human approval gate for package changes; T002 and T003 can proceed in parallel where their required pinned test packages are already approved. T004 follows test-project setup.
- **Foundational (Phase 2)**: Depends on Setup completion and successful dependency restoration; blocks story implementation.
- **US1 (Phase 3)**: Depends on Phase 2; no dependency on another user story.
- **US2 (Phase 4)**: Depends on Phase 2 and the shared shell from US1 for final layout integration; reusable style work can be implemented independently.
- **US3 (Phase 5)**: Depends on Phase 2; independent of the dashboard stories.
- **US4 (Phase 6)**: Depends on Phase 2 and completion of T022's credential/owner gate before T023. No dependency on US1–US3 for scaffold generation; T024 follows T023.
- **Polish (Phase 7)**: Depends on all selected stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; no story dependency. Suggested first MVP increment.
- **US2 (P2)**: Starts after Phase 2; integrates final responsive shell styling with US1.
- **US3 (P2)**: Starts after Phase 2; independent generic response contract; does not add listing endpoints.
- **US4 (P2)**: Starts after Phase 2; independent of UI and pagination; requires an assigned database-scaffolding owner and safe read-only Oracle access.

### Within Each User Story

- Add automated tests before or alongside implementation, and keep tests scoped to the story's acceptance criteria.
- Complete each story's tests and implementation before treating its checkpoint as passed.
- Generated EF files are scaffold-owned; customizations must not edit them.

### Parallel Opportunities

- **Setup**: T002 and T003 affect different project files and can proceed in parallel after required dependency approvals; T004 follows both.
- **US1**: T006 and T007 can be written in parallel; the layout and route implementation tasks then proceed in dependency order.
- **US2**: T011 and T012 can be written in parallel; global theme work and responsive shell refinements touch different style/test files after the US1 shell exists.
- **US3**: T016 and T017 can be written in parallel; T018 follows, then contract validation.
- **US4**: T020 and T021 can be written in parallel as test scaffolding; T022 is a mandatory gate before T023; T024 follows generated context creation.
- **Across stories**: US3 and US4 can proceed independently from US1/US2 after Phase 2, subject to package approvals and the US4 database gate.

## Parallel Examples

### User Story 1

```text
Task: T006 Playwright dashboard navigation test in Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/DashboardNavigationTests.cs
Task: T007 Angular layout test in Spec-Driven-Development/sdd-ui/src/app/app.spec.ts
```

### User Story 2

```text
Task: T011 Playwright responsive/shared-style test in Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/SharedPresentationTests.cs
Task: T012 Angular shared-style test in Spec-Driven-Development/sdd-ui/src/app/shared-presentation.spec.ts
```

### User Story 3

```text
Task: T016 xUnit pagination model test in Spec-Driven-Development/SDD.API/SDD.API.Tests/Common/PaginatedResultTests.cs
Task: T017 Playwright pagination contract test in Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/PaginatedResultContractTests.cs
```

### User Story 4

```text
Task: T020 EF model mapping test in Spec-Driven-Development/SDD.API/SDD.API.Tests/Data/BrokerDataContextModelTests.cs
Task: T021 Playwright application smoke test in Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/DatabaseScaffoldSmokeTests.cs
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and resolve the package-approval gate.
2. Complete Phase 2 and verify both applications build.
3. Complete Phase 3 (US1).
4. Run the independent dashboard navigation tests and demonstrate both menu destinations.

### Incremental Delivery

1. Add US1 for the common dashboard and verify navigation.
2. Add US2 for shared blue theme and responsive table/input presentation.
3. Add US3 for the shared pagination result and JSON contract.
4. Add US4 after confirming the database owner and safe credential source; reverse-engineer only the three named tables.
5. Run `scripts/test.ps1` and follow `specs/001-shared-dashboard-foundation/quickstart.md`.

### Future Master-Page Prerequisites

Before separate Company Master or Listing Master implementation begins, complete and reuse the constitution's global API exception handler and Angular HTTP error interceptor, and confirm a script runner that does not introduce EF migrations. These are deliberately not implemented as extra scope in the current feature.
