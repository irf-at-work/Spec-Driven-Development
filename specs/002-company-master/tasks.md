# Tasks: Company Master CRUD

**Input**: Design documents from `specs/002-company-master/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`

**Ordering constraint**: Complete all API tasks and generate OpenAPI from the running API before beginning any Company Master UI work. Never hand-author the OpenAPI document.

## Phase 1: Setup

**Purpose**: Verify existing projects and database-first source of truth before feature work.

- [X] T001 [P] Verified company fields, key, and maximum lengths against `Spec-Driven-Development/SDD.API/SDD.API/Data/Entities/StdCompany.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Data/BrokerDataContext.cs`; no scaffolded files or database changes made.
- [X] T002 [P] Verified existing xUnit, Playwright, Vitest projects and the single test command in `Spec-Driven-Development/SDD.API/SDD.API.Tests/`, `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/`, `Spec-Driven-Development/sdd-ui/`, and `scripts/test.ps1`; no test packages were needed.

## Phase 2: Foundational Tooling

**Purpose**: Record test-safety and generated-client tooling prerequisites.

- [X] T005 REMOVED: The migration/script-runner requirement was removed from the constitution; no runner work is required for this feature.
- [X] T006 UPDATED: Keep tests code-only. Do not connect tests to Oracle or change database data; use unit-test doubles and mocked API responses instead of a test schema.
- [X] T007 Pinned the latest compatible OpenAPI Generator toolchain: npm wrapper `@openapitools/openapi-generator-cli` 2.42.0, generator 7.26.0, and the `generate-api-client` script in `Spec-Driven-Development/sdd-ui/package.json`. Verified generator execution with JDK 11.

**Checkpoint**: T005-T007 are resolved. No database DDL, EF migrations, or test database connections/writes are permitted.

## Phase 3: User Story 1 API - Find and view companies (Priority: P1)

**Goal**: Provide the read API for company listing and details, including the shared paging shape, audit values, filters, and sorting.

**Independent Test**: Code-only service tests with a fake data source verify company details and a paginated, filtered, sorted list, including empty and out-of-range pages.

### Tests

- [X] T008 [US1] Added code-only xUnit service tests using a fake data source for company details, list filtering, stable sorting, primary-address composition, page size 10, total counts, and empty/out-of-range pages in `Spec-Driven-Development/SDD.API/SDD.API.Tests/Services/CompanyServiceReadTests.cs`; no database connection.

### API implementation

- [X] T009 [US1] Added typed company response DTOs in `Spec-Driven-Development/SDD.API/SDD.API/Contracts/`; only specified company fields are exposed, with the company code included for row navigation and no assistant-in-charge or unrelated database columns.
- [X] T010 [US1] Implemented list and details queries in `Spec-Driven-Development/SDD.API/SDD.API/Services/CompanyService.cs`; sorting and filtering are allow-listed, applied before paging, defaults are page 1/page size 10, company code breaks sort ties, primary address omits empty parts, and scaffolded entities are not exposed.
- [X] T011 [US1] Added typed `GET /api/companies` and `GET /api/companies/{companyCode}` actions in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CompanyController.cs`; business/query mapping delegates to `CompanyService`, cancellation is propagated, and response unions declare documented shapes without Swagger attributes.
- [X] T012 [US1] Registered `CompanyService` and its repository in `Spec-Driven-Development/SDD.API/SDD.API/Program.cs`; API and service tests build successfully.

**Checkpoint**: The read API and code-only service tests pass without any Company Master UI changes or database access.

## Phase 4: User Story 2 API - Create and update a company (Priority: P1)

**Goal**: Provide create and update operations with authoritative validation, immutable identity fields, audit values, and last-write-wins updates.

**Independent Test**: Code-only service tests with a fake data source verify valid creation, invalid/duplicate rejection, mutable-field updates, and last-write-wins behavior without database access.

### Tests

- [X] T013 [US2] Added code-only xUnit service tests using a fake data source for required fields, specified maximum lengths, duplicate-code rejection, editable short-name defaulting, audit values, immutable company code/name, preservation of unexposed columns, and last-write-wins updates; no database connection.

### API implementation

- [X] T014 [US2] Added create/update request DTOs with create-only required code/name, immutable fields excluded from update, and all specified max lengths/date-only fields.
- [X] T015 [US2] Implemented create/update business rules in `CompanyService`; duplicate codes fail, missing short names default from the first 30 name characters, audit fields use `Admin`/UTC, unexposed fields are preserved, and later valid updates win.
- [X] T016 [US2] Added typed `POST /api/companies` and `PUT /api/companies/{companyCode}` actions; the service handles business logic and the controller returns typed validation/conflict/not-found responses with cancellation propagation.

**Checkpoint**: Create/update API behavior and service tests pass; the Company Master UI has not started.

## Phase 5: User Story 3 API - Delete a company (Priority: P2)

**Goal**: Provide safe permanent deletion that refuses referenced companies and never cascades related data.

**Independent Test**: Code-only service tests with a fake data source verify deletion of unreferenced companies and conflict behavior for referenced companies without database access.

### Tests

- [X] T017 [US3] Added code-only xUnit service tests using a fake data source for successful deletion, missing companies, deletion blocked by `STD_DEPARTMENT.DEPT_COMP_CODE`, and no related-data cascade; no database connection.

### API implementation

- [X] T018 [US3] Implemented permanent delete and reference checks in `CompanyService`; known department references block deletion and database-enforced Oracle reference violations return a conflict.
- [X] T019 [US3] Added `DELETE /api/companies/{companyCode}`; delegates to `CompanyService`, propagates cancellation, and returns success/not-found/conflict without cascading.

**Checkpoint**: All API operations are complete and independently tested before any Company Master UI implementation.

## Phase 6: API Contract Handoff

**Purpose**: Generate the API description and typed Angular client from the completed API before starting UI work.

- [X] T020 Generated `openapi.json` from the running API; verified five operations, typed requests/responses, pagination, and expected error responses. No manual OpenAPI contract was written.
- [X] T021 Generated the typed Angular API client into `Spec-Driven-Development/sdd-ui/src/app/api/generated/` using the pinned generator; generated files were not hand-edited.
- [X] T022 Ran Company API xUnit tests and verified the generated OpenAPI and client are current before beginning Company Master UI work.

**Checkpoint**: API implementation, API-generated OpenAPI, and generated typed client are complete before the UI phases begin.

## Phase 7: User Story 1 UI - Find and view companies (Priority: P1)

**Goal**: Display company list and details, with column filters, sorting, pagination, retained navigation state, and audit history.

**Independent Test**: Use the UI to filter and sort companies, change page, open a company, return to the list, and inspect its history icon using mouse and keyboard.

### Tests

- [X] T023 [P] [US1] Add Vitest coverage for list rendering, filters, sorting, page navigation, retained query-parameter state, and empty results in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts`.
- [X] T024 [P] [US1] Add Playwright UI coverage for list columns, list filters/sorting/pagination, state restoration, details navigation, and created/updated history in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyListAndDetailsE2ETests.cs`; mock API responses and do not connect to a database.

### UI implementation

- [X] T025 [US1] Add a company-details route in `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts` and implement details loading with the generated API client in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts`.
- [X] T026 [US1] Replace the Company Master placeholder with a standalone OnPush table using the generated client in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.ts` and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html`; show all specified data columns and the action/history column.
- [X] T027 [US1] Implement per-data-column filters, allow-listed sortable columns, page-size-10 pagination, and route-query synchronization in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.ts`; retain the page, sort, and filter state when navigating to and from details.
- [X] T028 [US1] Render `primaryAddress` and the created-by/last-updated-by history tooltip in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html` and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html`; ensure the history action is keyboard-focusable and its details are available on focus as well as hover.

**Checkpoint**: The read/list UI passes its Vitest and Playwright acceptance scenarios using only generated API types.

## Phase 8: User Story 2 UI - Create and update a company (Priority: P1)

**Goal**: Add and edit company records with real-time validation, date entry, immutable identity, and API error feedback.

**Independent Test**: Create a valid company; verify required, duplicate, and length validation; open it, edit mutable fields, and verify code/name remain read-only.

### Tests

- [X] T029 [P] [US2] Add Vitest coverage for typed-form validation, first-invalid-field focus/scroll, short-name prefill, date typing/selection, immutable identity, and save-error states in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts`.
- [X] T030 [P] [US2] Add Playwright UI coverage for valid company creation, duplicate code, real-time field lengths, short-name prefill/editing, date picker and typing, edit mode, immutable code/name, API errors, and last-write-wins in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyAddEditE2ETests.cs`; mock API responses and do not connect to a database.

### UI implementation

- [X] T031 [US2] Implement a standalone OnPush typed reactive company form in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts` and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html`, using generated API types, Angular Material date pickers, and the specified maximum lengths: code 12, name 100, short name 30, each address 100, reference number 20, company in-charge 60, phone 20, email 100, and website 100.
- [X] T032 [US2] Implement create-mode short-name defaulting from the first 30 characters while allowing edits, and make company code/name read-only in edit mode, in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts`.
- [X] T033 [US2] Add create/edit routes and invoke the generated API client from `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts` and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts`; show field-specific server validation, focus and scroll to the first invalid field, and display other API failures clearly in the form.
- [X] T034 [US2] Apply project date display and accessible en-GB labels/errors to `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html`; verify valid date picker selections and typed dates serialize as date-only values.

**Checkpoint**: Create/edit UI passes the story's Vitest and Playwright scenarios with the API already complete.

## Phase 9: User Story 3 UI - Delete a company (Priority: P2)

**Goal**: Provide confirmed deletion with a clear explanation when references prevent removal.

**Independent Test**: Cancel a delete and verify the company remains; confirm deletion of an unreferenced test company; attempt to delete a referenced test company and verify no data is removed.

### Tests

- [X] T035 [P] [US3] Add Vitest coverage for delete confirmation, cancel behavior, delete success, and conflict feedback in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-delete.spec.ts`.
- [X] T036 [P] [US3] Add Playwright UI coverage for cancelled deletion, confirmed deletion of an unreferenced company, and blocked deletion of a referenced company in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyDeleteE2ETests.cs`; mock API responses and do not connect to a database.

### UI implementation

- [X] T037 [US3] Add a delete action and explicit confirmation dialog to `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts` and `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html`; cancel must make no API call.
- [X] T038 [US3] Invoke the generated delete operation and display shared `ProblemDetails` reference conflicts without success-shaped fallbacks in `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts`.

**Checkpoint**: Delete UI passes all confirmation, cancellation, success, and reference-conflict scenarios.

## Phase 10: Polish and Cross-Cutting Validation

**Purpose**: Verify integrated behavior, documentation, and repository-wide quality gates.

- [X] T039 [P] Update `specs/002-company-master/quickstart.md` with the actual API-first, OpenAPI-generation, client-generation, and run/test commands used during implementation.
- [X] T040 Run `scripts/test.ps1` and resolve all .NET, xUnit, Playwright, and Vitest failures without changing unrelated work or connecting tests to a database.
- [X] T041 Verify the generated OpenAPI and Angular client are current, no generated EF/client files were hand-edited, no manual OpenAPI contract exists, no new dependency was added without approval, and user-facing text follows British English in `Spec-Driven-Development/SDD.API/` and `Spec-Driven-Development/sdd-ui/`.
- [X] T042 Verify all CRUD acceptance scenarios through code-only unit tests and mocked API responses; confirm tests make no database connections or changes using `specs/002-company-master/quickstart.md`.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Independent repository inspection.
- **Foundational (Phase 2)**: Depends on Setup. T005-T007 are resolved.
- **API stories (Phases 3-5)**: Execute in order US1 API → US2 API → US3 API. The service and controller files are shared across these phases.
- **API Contract Handoff (Phase 6)**: Depends on all API stories; generates OpenAPI from the API and then generates the typed client. This must finish before any UI work.
- **UI stories (Phases 7-9)**: Execute in order US1 UI → US2 UI → US3 UI. Each UI phase uses the already generated client and completed API.
- **Polish (Phase 10)**: Depends on all desired stories and contract generation.

### User Story Dependencies

- **US1 - Find and view companies (P1)**: API work follows foundational tasks; its UI waits for all API stories and generated client.
- **US2 - Create and update a company (P1)**: API work follows US1 API because it extends the shared service and DTOs; its UI follows US1 UI and the API handoff.
- **US3 - Delete a company (P2)**: API work follows the shared service setup; its UI follows the API handoff and is scheduled after create/edit UI.

### Parallel Opportunities

- T001 and T002 inspect separate existing projects.
- Code-only tests use fakes and mocked API responses; no database fixture, connection, or write is permitted.
- Within each UI story, its Vitest and Playwright test files can be authored in parallel before that story's implementation.
- Do not parallelize API and UI implementation: API, generated OpenAPI, and generated client are explicit prerequisites for all UI tasks.
- Do not parallelize edits to `CompanyService.cs`, `CompanyController.cs`, `Program.cs`, or the same UI component files across tasks.

## Parallel Examples

### API prerequisite checks

```text
Task T005: Removed; the constitution no longer requires a migration/script runner
Task T007: Pin and verify the OpenAPI Generator in Spec-Driven-Development/sdd-ui/package.json
```

### User Story 1 UI tests

```text
Task T023: Vitest list component tests in Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts
Task T024: Playwright list/details tests in Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests/CompanyListAndDetailsE2ETests.cs
```

## Implementation Strategy

### MVP

1. Complete setup and available tooling prerequisites.
2. Complete and test all API stories: list/details, create/update, and delete.
3. Generate OpenAPI from the completed API and generate the typed client.
4. Implement and independently test the US1 listing/details UI as the first user-visible MVP.

### Incremental delivery

1. Deliver API US1, US2, and US3 in order; run xUnit service tests after each API phase.
2. Generate and validate OpenAPI and the typed client only after API endpoints are complete.
3. Deliver UI US1, then US2, then US3; run each story's Vitest and Playwright scenarios.
4. Run `scripts/test.ps1` and verify that the code-only tests do not connect to or modify a database.
