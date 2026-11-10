---
description: "Implementation tasks for the Premium Adjustment Master feature"
---

# Tasks: Premium Adjustment Master

**Input**: Design documents from `specs/002-premium-adjustment-master/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/premium-adjustments-api.md`, and `quickstart.md`

**Tests**: Required by constitution Articles 4 and B5. Add API and Playwright acceptance tests before or alongside implementation; tests against Oracle need the owner-approved test schema (`SDD_TEST_ORACLE_CONNECTION`), and every test row uses a code beginning `ZT`.

**Organization**: Tasks are grouped by user story and ordered by real dependencies. This feature follows feature 001 as it now stands, so the shared column filter, icon button, breadcrumb, notification service, unsaved-changes guard and validators are reused, not rebuilt.

**Gate**: T001's owner-approved, read-only inspection identified `IIRIS_RD_DEVP.BRM_MISC_CODES` and recorded its schema in `data-model.md`. The owner confirmed T002 mappings: `CALC_TYPE`, `DISCOUNT_TYPE`, `CHARGE_TYPE`, and `CHARGE_CAT`. No DDL or data changes are authorized. The BYTE-semantics Arabic storage limitation remains explicit; do not claim Arabic maximum-length persistence.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Tasks touch different files and can proceed in parallel once their prerequisites are met.
- **[Story]**: User-story label for work in a story phase only.
- Paths are relative to the repository root.

## Phase 1: Setup and gates

**Purpose**: Close the open decisions that block persistence and the dropdowns.

- [X] T001 Obtain owner-approved Oracle 19c access, then inspect the adjustment-code table read-only: table name, primary key, whether Code Type + Code + Company Code is unique, column lengths (characters versus bytes), not-null columns, defaults, the active column and any Y/N check constraint, audit columns and any triggers that fill them. Record verified facts or blockers in `specs/002-premium-adjustment-master/data-model.md`. Stop if the table does not exist; run no DDL and change no data. **Checked 02-Nov-2026:** read-only inspection identified `IIRIS_RD_DEVP.BRM_MISC_CODES`; its three-part primary key enforces the composite uniqueness, key columns are not null, VARCHAR2 lengths use BYTE semantics, there are no defaults or triggers, and `MC_ACTIVE_YN` is nullable without a Y/N check. Column details and the Arabic storage limitation are recorded in `data-model.md`.
- [X] T002 Using the configured `STD_LIST_ITEM` data, confirm with the owner which `LI_TYPE` fills Code Type, Discount Type, Charges Type and Charges Category. The owner said the previously supplied `PRM_*` values were wrong. Configured data contains active items in `CALC_TYPE`, `CHARGE_CAT`, `CHARGE_TYPE` and `DISCOUNT_TYPE`; confirm the correct mapping for each. Record confirmed values in `specs/002-premium-adjustment-master/data-model.md` and `specs/002-premium-adjustment-master/contracts/premium-adjustments-api.md`, then remove the `[NEEDS CLARIFICATION]` marker. **Checked 02-Nov-2026:** Code Type=`CALC_TYPE`, Discount Type=`DISCOUNT_TYPE`, Charges Type=`CHARGE_TYPE`, Charges Category=`CHARGE_CAT`.
- [X] T003 [P] Confirm current package versions in `Spec-Driven-Development/SDD.API/SDD.API/SDD.API.csproj` and `Spec-Driven-Development/sdd-ui/package.json` and that no new package is needed (constitution B4). Add, update or remove nothing without owner confirmation. **Checked 02-Nov-2026, no new package needed.** API: .NET 10; Microsoft.AspNetCore.OpenApi 10.0.14, Microsoft.EntityFrameworkCore.Design 10.0.14, NSwag.MSBuild 14.7.1, Oracle.EntityFrameworkCore 10.23.26400, System.Security.Cryptography.Pkcs 10.0.14. UI: Angular 22.2 (Material and CDK 22.2.5), TypeScript ~6.0.2, sweetalert2 11.26.25, @fontsource/inter 5.3.0, @fontsource/noto-sans-arabic 5.3.0, @fontsource/material-symbols-outlined 5.3.9, angular-eslint 22.6.0, prettier ^3.8.1, @playwright/test 1.64.1, vitest ^5.0.0. The scripts `lint`, `format:check`, `test` and `e2e` already exist. No package was added, updated or removed.
- [X] T004 [P] Create the decision record `docs/decisions/premium-adjustment-master.md` (Article 11) covering: no new packages, Active as soft delete next to permanent delete, per-column filters, the unpaged options endpoint and its C3 exception (recorded 02-Nov-2026), case-insensitive sorting with a unique tie-break, and create answering 200.
- [X] T005 [P] Add the `tests/premium-adjustment-e2e` project path and local API/UI origins to `Spec-Driven-Development/sdd-ui/playwright.config.ts`, and extend the single stop-on-first-failure runner `Spec-Driven-Development/test-all.ps1` to run this feature's API tests, Angular tests, Playwright tests, formatting and lint checks, and production builds. **Checked 02-Nov-2026:** Playwright now discovers tests under `tests/` (including both feature directories), and `SDD_API_URL`/`SDD_UI_URL` are configurable. The existing runner already runs the full API test project, Angular tests, Playwright, formatting, lint and production builds, so no runner change was needed.

---

## Phase 2: Foundational

**Purpose**: Shared pieces every story needs. Scaffolding waits for T001 and T002.

- [X] T006 After T001 and owner approval, scaffold the adjustment-code table (and re-scaffold `STD_LIST_ITEM` only if T002 shows a change) into `Spec-Driven-Development/SDD.API/SDD.API/Data/Scaffolded/`; never edit generated files and run no migrations. **Checked 02-Nov-2026:** `BrmMiscCode.cs` was generated read-only from `IIRIS_RD_DEVP.BRM_MISC_CODES`; no migration or database change was run.
- [X] T007 Add non-scaffolded partial entity extensions only if the verified schema needs them (for example mapping the three-part business key and the Active `Y`/`N` flag) in `Spec-Driven-Development/SDD.API/SDD.API/Data/`. **Checked 02-Nov-2026:** the custom `SddDbContext.Partial.cs` wires the generated entity using the inspected three-column primary key and column definitions; no separate entity extension was needed.
- [X] T008 [P] Add API tests for the generalised column filter: a list can declare its own filterable columns (six here), every operator, case-insensitivity, `%` and `_` matched literally, `notEquals` returning empty values, blank filters ignored, an invalid operator returning `400`; feature 001's existing tests must still pass unchanged. Put them in `Spec-Driven-Development/SDD.API/SDD.API.Tests/PremiumAdjustments/ColumnFiltersGeneralisedTests.cs`. **Checked 02-Nov-2026:** 15 generalized-filter unit tests pass; the API `400` test is included but requires the approved Oracle test connection to execute.
- [X] T009 Generalise `Spec-Driven-Development/SDD.API/SDD.API/Services/ColumnFilters.cs` so each list declares its own filterable columns instead of assuming four; keep the makes and models lists working and run feature 001's tests to prove nothing changed. **Checked 02-Nov-2026:** the declared-column map supports variable text fields, with the original makes/models API retained; 48 existing list-query tests pass.
- [X] T010 [P] Verify the shared UI pieces from feature 001 can be reused as they are (column filter with Active or Inactive choice, icon button with tooltip and accessible name, breadcrumb, notification service, unsaved-changes guard, limited text field with maximum-length message, code validators) in `Spec-Driven-Development/sdd-ui/src/app/shared/`; fix only gaps that block this feature, and do not call SweetAlert2 directly. **Checked 02-Nov-2026:** the shared filter offers the required text/status operators, and the icon, breadcrumb, notification, guard, limited field and `notBlank` validator are reusable. Existing make/model code formats match; feature-specific length rules remain subject to T001. No shared UI changes were needed.
- [X] T011 [P] Verify the shared `PaginatedResult<T>`, global `ProblemDetails` handling, privacy-safe logging and the Angular HTTP error interceptor need no change for this feature (`Spec-Driven-Development/SDD.API/SDD.API/Contracts/PaginatedResult.cs`, `Spec-Driven-Development/SDD.API/SDD.API/Infrastructure/ProblemDetailsExceptionHandler.cs`, `Spec-Driven-Development/sdd-ui/src/app/core/interceptors/api-error.interceptor.ts`). **Checked 02-Nov-2026:** the page envelope is generic; server exceptions return fixed, stack-free `ProblemDetails` while the server logger records the exception and request context; the interceptor displays fixed client messages and routes field errors to forms without showing raw server details. The shared pieces need no feature-specific changes.

**Checkpoint**: The filter code serves lists of different widths, shared UI pieces are confirmed, and (after T001, T002 and T006) the database mapping exists.

---

## Phase 3: User Story 1 - Find and browse adjustment codes (Priority: P1) 🎯 MVP

**Goal**: Brokers can filter every column, sort, page and open or delete a row, and see each code's Active status.

**Independent Test**: With more than 10 test codes, check default order (Code Type description then Code), page size 10, filters across all pages, sorting ignoring case, Active status, empty results and the row icons.

### Tests for User Story 1

- [X] T012 [P] [US1] Add API tests for page size 10, default order, filters on all six columns (Code Type matching its description, Status equals and not equals, null Active counted as active), several filters combined with AND, filters and sorting applied before paging, case-insensitive sorting (for example "BMW" versus "Bentley"), the unique tie-break leaving no repeated or lost row between pages, inactive rows still listed, and `400` for a bad page, operator or sort, in `Spec-Driven-Development/SDD.API/SDD.API.Tests/PremiumAdjustments/PremiumAdjustmentListQueryTests.cs` and `Spec-Driven-Development/SDD.API/SDD.API.Tests/PremiumAdjustments/PremiumAdjustmentApiTests.cs`. **Checked 02-Nov-2026:** 17 query tests pass; the read-only local Oracle list smoke test returns the fixed page shape, and invalid page/operator requests return 400. Oracle-backed automated tests still require `SDD_TEST_ORACLE_CONNECTION`.
- [X] T013 [P] [US1] Add Playwright tests for list rendering, no global search box, a filter on every column and operator, Status filter, return to page 1 when a filter or sort changes, empty-results message, clearing filters, Active status per row, icon tooltips and accessible names, breadcrumb, and read-only Open in `tests/premium-adjustment-e2e/list-and-read.spec.ts`. **Checked 02-Nov-2026:** all three browser tests pass with a mocked API; list filters, status operators, paging/sort reset, empty/clear states, breadcrumbs, row status and read-only open are covered.

### Implementation for User Story 1

- [X] T014 [US1] Create the list and detail DTOs (`codeType`, `codeTypeDescription`, `code`, `companyCode`, `name`, `shortName`, `active`; the detail adds the remaining fields and audit usernames) in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/AdjustmentCodeListItemDto.cs` and `Spec-Driven-Development/SDD.API/SDD.API/DTOs/AdjustmentCodeDto.cs`.
- [X] T015 [US1] Implement the list query: join the standard list on `(LI_TYPE, LI_CODE)` so the Code Type filter and sort use its description (showing the code when no item matches), apply the allow-listed filters and operators, upper-case sort keys, allow-list sort columns, end with a unique tie-break (Code Type, Code, Company Code), and cut pages of 10 only after filtering and sorting, in `Spec-Driven-Development/SDD.API/SDD.API/Services/PremiumAdjustmentListQuery.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/PremiumAdjustmentService.cs`. **Checked 02-Nov-2026:** Oracle query translation was smoke-tested read-only, including the joined description, filters, status and sort.
- [X] T016 [US1] Implement typed `GET /api/premium-adjustments` and `GET /api/premium-adjustments/{codeType}/{code}/{companyCode}` returning the shared page shape, `404` and `400` as `ProblemDetails`, passing the `CancellationToken` on, in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/PremiumAdjustmentsController.cs`.
- [X] T017 [US1] Regenerate the API client with NSwag into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts` and fix any type errors without hand edits.
- [X] T018 [US1] Build the standalone OnPush list page: Material table, the shared column filter on all six columns (operator choice, Status as Active or Inactive), sortable columns, paging, empty state, Active status per row, icon actions (add, open, delete) with tooltips and accessible names, breadcrumb (Master Data › Premium Adjustments), and the key passed to the open page in navigation state, in `Spec-Driven-Development/sdd-ui/src/app/features/premium-adjustments/premium-adjustment-list.component.ts`, `premium-adjustment-list.component.html` and `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`. **Checked 02-Nov-2026:** list, create, open/edit and delete actions are wired; browser coverage passes.

**Checkpoint**: List, filtering, sorting, create, open/edit and permanent delete workflows are implemented. Oracle-backed persistence acceptance still requires the approved test-schema connection.

---

## Phase 4: User Story 2 - Add an adjustment code (Priority: P1)

**Goal**: Brokers can add a validated code with optional Arabic details and choose its initial Active state.

**Independent Test**: Save a valid code and check the normalised values and `admin`; check blank, invalid, over-length and duplicate input is refused without saving; check Active defaults on.

### Tests for User Story 2

- [X] T019 [P] [US2] Add API tests for required fields; Code and Company Code 1 to 12 characters, letters, digits and hyphens only, saved in capitals; Name 1 to 100 and Short Name 1 to 30; Remarks up to 2000; Arabic fields up to 100, 30 and 2000 preserved exactly; English capitalisation and extra-space removal; each classification refused unless it is an active item of its own list (even if the screen sent it); duplicate combination returning `409`, including an Oracle ORA-00001 from two simultaneous saves; Active default and choice; `admin` audit values; and the options endpoint (four lists, active only, ordered by description, empty array when a list has no items), in `Spec-Driven-Development/SDD.API/SDD.API.Tests/PremiumAdjustments/PremiumAdjustmentInputRulesTests.cs`, `PremiumAdjustmentApiTests.cs` and `PremiumAdjustmentOptionsApiTests.cs`. **Checked 02-Nov-2026:** API input/query unit tests pass; API CRUD acceptance tests compile but require the approved `SDD_TEST_ORACLE_CONNECTION` to execute.
- [X] T020 [P] [US2] Add Playwright tests for required and maximum-length messages, Additional Information, right-to-left Arabic preserved, the three classification dropdowns, Active on by default and switched off, successful creation, duplicate message, and the unsaved-changes prompt for Back, a breadcrumb link and the browser back button (confirm and cancel), in `tests/premium-adjustment-e2e/create-adjustment-code.spec.ts`. **Checked 02-Nov-2026:** all four create-flow browser tests pass with a mocked API.

### Implementation for User Story 2

- [X] T021 [US2] Implement create and update request DTOs and the shared input rules (validation, capitals, word capitalisation that keeps all-capital words, extra-space removal, Arabic untouched, limits enforced on save, `admin` stamping, Active stored as `Y` or `N`, default on) in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/CreateAdjustmentCodeRequest.cs`, `Spec-Driven-Development/SDD.API/SDD.API/DTOs/UpdateAdjustmentCodeRequest.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/PremiumAdjustmentInputRules.cs`.
- [X] T022 [US2] After T002, implement the fixed read-only lookup: `PremiumAdjustmentOptionsDto` with `codeTypes`, `discountTypes`, `chargesTypes` and `chargesCategories` (each `{ code, description }`, active items, ordered by description, list types fixed on the server and never taken from the request), unpaged under the recorded C3 exception, in `Spec-Driven-Development/SDD.API/SDD.API/DTOs/PremiumAdjustmentOptionsDto.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/PremiumAdjustmentOptionsController.cs`. **Checked 02-Nov-2026:** read-only API smoke check returned the four lists with active counts 4, 2, 3 and 2.
- [X] T023 [US2] Implement create in the service: refuse a classification code that is not an active item of the right list, refuse a duplicate Code Type + Code + Company Code, map ORA-00001 to the same duplicate response, stamp `admin` and the GST created and changed dates (only if T001 found no trigger), in `Spec-Driven-Development/SDD.API/SDD.API/Services/PremiumAdjustmentService.cs`.
- [X] T024 [US2] Implement typed `POST /api/premium-adjustments` returning `200` with the saved record, field-keyed `400` and a `409` reading "This code type, code and company code combination already exists.", in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/PremiumAdjustmentsController.cs`.
- [X] T025 [US2] Regenerate the API client (create request and options types) into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts` and verify the UI build. **Checked 02-Nov-2026:** NSwag client regenerated; production UI build passes.
- [X] T026 [US2] Build the standalone typed reactive add form: Code Type, Code, Company Code, Name, Short Name, the three classification dropdowns loaded once from the options call, Active on by default, collapsible Additional Information with Arabic fields shown right to left in Noto Sans Arabic, maximum-length messages, field-level errors, shared notifications for success and failure, breadcrumb, a back icon, and the unsaved-changes guard on Back, breadcrumb links and the browser back button, in `Spec-Driven-Development/sdd-ui/src/app/features/premium-adjustments/premium-adjustment-form.component.ts`, `premium-adjustment-form.component.html` and `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`. **Checked 02-Nov-2026:** create form and guard pass the create-flow browser tests.

**Checkpoint**: User Story 2 creates valid codes and refuses invalid or duplicate input in the API and the UI.

---

## Phase 5: User Story 3 - Open and edit an adjustment code (Priority: P1)

**Goal**: Brokers can review a code read-only, edit everything except its three key fields, save valid changes (including Active), and confirm before discarding.

**Independent Test**: Open a saved code, check it is read-only, edit and save, turn Active off and on again, then check both outcomes of the discard prompt.

### Tests for User Story 3

- [X] T027 [P] [US3] Add API tests for immutable Code Type, Code and Company Code; update validation and normalisation; invalid update not saved; a record with no Discount Type, Charges Type or Charges Category needing all three before it saves; a classification the record already holds being accepted after it became inactive while a newly chosen inactive one is refused; Active off and on again; null Active counted as active; `admin` last-changed stamp; and `404` for a missing record, in `Spec-Driven-Development/SDD.API/SDD.API.Tests/PremiumAdjustments/PremiumAdjustmentApiTests.cs`. **Checked 02-Nov-2026:** Oracle-backed tests compile; execution awaits the approved test-schema connection.
- [X] T028 [P] [US3] Add Playwright tests for read-only open with Active shown but fixed, the edit toggle, locked key fields, Additional Information opening automatically when it holds data, valid save, invalid feedback, a legacy record needing the three classifications, deactivate and restore, a held inactive classification still shown, both outcomes of the discard prompt when switching editing off, and the unsaved-changes prompt for Back, breadcrumb and browser back, in `tests/premium-adjustment-e2e/edit-adjustment-code.spec.ts`. **Checked 02-Nov-2026:** both edit-flow browser tests pass with a mocked API.

### Implementation for User Story 3

- [X] T029 [US3] Implement update in the service with the User Story 2 rules, the held-classification exception, Active stored as `Y` or `N`, and the `admin` last-changed stamp, in `Spec-Driven-Development/SDD.API/SDD.API/Services/PremiumAdjustmentService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Services/PremiumAdjustmentInputRules.cs`.
- [X] T030 [US3] Implement typed `PUT /api/premium-adjustments/{codeType}/{code}/{companyCode}` returning `200`, field-keyed `400` and `404`, in `Spec-Driven-Development/SDD.API/SDD.API/Controllers/PremiumAdjustmentsController.cs`.
- [X] T031 [US3] Regenerate the API client (update request) into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts` and verify the UI build.
- [X] T032 [US3] Extend the form: read-only by default with Active shown but fixed, the edit toggle, key fields locked on edit, Active editable, Additional Information opening automatically when it holds data, a held inactive classification still shown but not offered for new choices, the classification-required rule for legacy records, a confirmation through the notification service before switching editing off with unsaved changes (cancel keeps editing), and the guard on Back, breadcrumb and the browser back button, in `Spec-Driven-Development/sdd-ui/src/app/features/premium-adjustments/premium-adjustment-form.component.ts` and `premium-adjustment-form.component.html`. The breadcrumb reads Master Data › Premium Adjustments › the open code. **Checked 02-Nov-2026:** read-only, edit, validation and discard flows pass browser tests.

**Checkpoint**: User Story 3 updates a code without changing its key and handles discard safely.

---

## Phase 6: User Story 4 - Permanently delete an adjustment code (Priority: P2)

**Goal**: Brokers can permanently delete a code only after confirming a dialog that says it cannot be undone.

**Independent Test**: Cancel a deletion and check nothing changed; confirm one and check the record is gone with no restore offered.

### Tests for User Story 4

- [X] T033 [P] [US4] Add API tests for confirmed delete returning `204`, a missing record returning `404` as `ProblemDetails`, and other rows left untouched, in `Spec-Driven-Development/SDD.API/SDD.API.Tests/PremiumAdjustments/PremiumAdjustmentApiTests.cs`. **Checked 02-Nov-2026:** Oracle-backed tests compile; execution awaits the approved test-schema connection.
- [X] T034 [P] [US4] Add Playwright tests for cancelling, confirming the irreversible warning, the record disappearing from the list, and a record deleted elsewhere being reported as not found without a raw server message, in `tests/premium-adjustment-e2e/delete-adjustment-code.spec.ts`. **Checked 02-Nov-2026:** both delete-flow browser tests pass with a mocked API.

### Implementation for User Story 4

- [X] T035 [US4] Implement permanent delete in the service and typed `DELETE /api/premium-adjustments/{codeType}/{code}/{companyCode}` returning `204` or `404`, in `Spec-Driven-Development/SDD.API/SDD.API/Services/PremiumAdjustmentService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/PremiumAdjustmentsController.cs`.
- [X] T036 [US4] Regenerate the API client (delete) into `Spec-Driven-Development/sdd-ui/src/app/generated/api-client.ts` and check its `204` handling.
- [X] T037 [US4] Wire the list's delete icon to a confirmation through the notification service stating that deletion is permanent and cannot be undone, then refresh the list and show a plain-English success or not-found message, in `Spec-Driven-Development/sdd-ui/src/app/features/premium-adjustments/premium-adjustment-list.component.ts` and `premium-adjustment-list.component.html`. **Checked 02-Nov-2026:** confirmation/cancellation, successful deletion, and safe not-found handling pass browser coverage.

**Checkpoint**: User Story 4 proves confirmation and cancellation and removes only the chosen record.

---

## Phase 7: Polish and cross-cutting concerns

- [X] T038 [P] Verify text sizes and fonts on every screen (Inter for English, Noto Sans Arabic for Arabic, available offline, minimum sizes from feature 001) and that every icon has a tooltip and an accessible name, in `Spec-Driven-Development/sdd-ui/src/app/features/premium-adjustments/`. **Checked 02-Nov-2026:** shared global fonts load locally, body and headings meet the existing minimum sizes, Arabic fields use RTL, and feature icon actions expose tooltips and accessible names; browser accessibility assertions pass.
- [X] T039 [P] Update `docs/decisions/premium-adjustment-master.md` and `specs/002-premium-adjustment-master/quickstart.md` with the confirmed schema facts, list types, byte-versus-character findings and any blockers; include no secrets. **Checked 02-Nov-2026:** both documents record the verified schema/mappings and outstanding Oracle/Arabic limitations.
- [X] T040 Verify formatter and linter configuration and single-runner coverage (`dotnet format` whitespace and analyzers, `npm run lint`, `npm run format:check`, API tests, Angular tests, Playwright, production builds) in `Spec-Driven-Development/test-all.ps1`. **Checked 02-Nov-2026:** runner coverage verified; C# format/analyzers, Angular lint/build/tests, focused API tests and feature browser tests pass. Repository-wide Prettier check still flags 12 existing feature-001/shared files.
- [ ] T041 Run the complete runner `Spec-Driven-Development/test-all.ps1`, fix failures, walk through `specs/002-premium-adjustment-master/quickstart.md`, and record the results there. Report fixture-dependent dropdown acceptance and persisted Arabic maximum-length support as blocked, not passed, if the lists or the byte-semantics issue are unresolved. **Blocked 02-Nov-2026:** attempted the runner; it stopped before validation because `SDD_TEST_ORACLE_CONNECTION` is unavailable. Read-only API smoke checks and local/mock suites are recorded in `quickstart.md`; Oracle-backed CRUD and manual write acceptance remain unverified.
- [X] T042 [US3] Add the saved-record Add Adjustment Code icon immediately to the left of Back, navigate to the blank create route, and use the existing unsaved-change guard. Add mocked browser coverage for keeping edits after cancelling and opening a blank form after confirming discard in `Spec-Driven-Development/sdd-ui/src/app/features/premium-adjustments/premium-adjustment-form.component.html`, `premium-adjustment-form.component.ts`, and `Spec-Driven-Development/tests/premium-adjustment-e2e/edit-adjustment-code.spec.ts`. No API or database changes.

---

## Dependencies and execution order

- **Phase 1**: T001 and T002 are owner-dependent gates. T003 to T005 can proceed now.
- **Phase 2**: T006 needs T001 (and T002 if `STD_LIST_ITEM` changed) and owner approval. T007 follows T006. T008 and T009 are independent of Oracle and can start straight away. T010 and T011 are checks.
- **US1**: needs T006 to T009 for the API, and T010 for the UI. T017 follows T014 to T016; T018 follows T017.
- **US2**: needs US1's list and Add action, and T002 for the options lookup (T022). T023 needs T021 and T022. T026 needs T025.
- **US3**: extends US2's form and service.
- **US4**: needs US1's list and Delete action; its API work does not depend on US2 or US3.
- **Phase 7**: after the selected stories; T041 runs last.

### Parallel opportunities

- T003, T004 and T005 are independent.
- T008 can be written while T001 and T002 wait on the owner.
- Within each story, the API test and Playwright test tasks use separate files and can run together.
- US4's API work can run in parallel with US3 once US1 is done.

## Implementation strategy

1. Do the owner-independent setup now (T003 to T005, T008, T009, T010, T011).
2. Resolve T001 and T002 with the owner, then scaffold (T006, T007).
3. Deliver **US1 only** as the MVP and validate it with more than 10 test codes.
4. Add US2 (create), US3 (edit and Active) and US4 (delete) as separately tested increments.
5. Finish with Phase 7 and the full runner.
