# Tasks: Codes Master

**Input**: Design documents from `specs/001-codes-master/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: Automated API and UI tests are included because the project constitution requires automated tests for every feature.

**Organization**: Tasks are grouped by the four independently verifiable user stories in the feature specification.

## Phase 1: Setup

**Purpose**: Clear approval and environment prerequisites before package or database work.

- [X] T001 Obtain owner approval for the dependency proposal in `specs/001-codes-master/research.md`, including Oracle.EntityFrameworkCore and its license, EF design-time scaffolding, Angular 21 alignment from Angular 22.2, Angular Material/CDK, OpenAPI client generation, xUnit, and Playwright; record the decision before package changes.
- [X] T002 Using authorized read-only access only, verify Oracle connectivity, `IIRIS_RD_DEVP.STD_CODES` metadata, database character set, and server clock/time zone; record verified facts without credentials in `specs/001-codes-master/research.md`.
- [X] T003 Use .NET User Secrets for `ConnectionStrings:CodesMasterOracle` and add a placeholder-only, credential-free example configuration in `Spec-Driven-Development/SDD.API/SDD.API/appsettings.example.json`.
- [X] T004 Configure approved API and UI test tooling and add their project/configuration files in `Spec-Driven-Development/SDD.API/SDD.API.Tests/` and `Spec-Driven-Development/sdd-ui/`; do not change production package manifests until T001 is approved.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish database-first access, safe API behavior, and shared UI/API foundations required by all stories.

- [X] T005 Add the owner-approved Oracle.EntityFrameworkCore package and scaffold only the existing `IIRIS_RD_DEVP.STD_CODES` table database-first into `Spec-Driven-Development/SDD.API/SDD.API/Data/`; do not run DDL, migrations, inserts, or edits to generated files.
- [X] T006 Configure the database-first context and secret-backed Oracle connection in `Spec-Driven-Development/SDD.API/SDD.API/Program.cs` and `Spec-Driven-Development/SDD.API/SDD.API/appsettings.example.json`; validate required configuration at startup without logging secret values.
- [X] T007 Implement global exception handling, safe `ProblemDetails` responses, and significant-action logging without credentials in `Spec-Driven-Development/SDD.API/SDD.API/Middleware/ProblemDetailsExceptionHandler.cs` and register it in `Spec-Driven-Development/SDD.API/SDD.API/Program.cs`.
- [X] T008 Define the constitution-required shared `PaginatedResult<T>` response with `items`, `page`, `pageSize`, and `totalCount` in `Spec-Driven-Development/SDD.API/SDD.API/Contracts/PaginatedResult.cs`.
- [X] T009 Configure the approved OpenAPI-to-Angular-client generation workflow and generated-output location `Spec-Driven-Development/sdd-ui/src/app/api/generated/`; ensure generated client files are not hand-edited.
- [X] T010 Establish the standalone Angular feature route and shared application structure for Master navigation in `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`, `Spec-Driven-Development/sdd-ui/src/app/app.html`, and `Spec-Driven-Development/sdd-ui/src/app/navigation/`.

**Checkpoint**: Complete approvals, authorized read-only preflight, and shared foundations before starting story implementation.

---

## Phase 3: User Story 1 - Browse codes (Priority: P1)

**Goal**: Navigate to Codes Master and review a paginated listing, its empty/error states, and record-specific creation audit values.

**Independent Test**: Open Master > Codes Master and verify the specified columns, ten-record default page, empty state, retrieval error, and actual creation audit values through mouse and keyboard interaction.

### Tests for User Story 1

- [X] T011 [P] [US1] Add API tests for page defaults, page boundaries, empty results, retrieval errors, and selected listing fields in `Spec-Driven-Development/SDD.API/SDD.API.Tests/CodesControllerListTests.cs`.
- [X] T012 [P] [US1] Add Playwright tests for Master navigation, listing columns, pagination, empty/error states, and keyboard-accessible creation audit details in `Spec-Driven-Development/sdd-ui/e2e/codes-master-list.spec.ts`.

### Implementation for User Story 1

- [X] T013 [US1] Define typed list and record response DTOs, mapping `CC_CODE`, `CC_TYPE`, `CC_COMP_CODE`, `CC_DESC`, `CC_VALUE1`, `CC_VALUE2`, `CC_CR_BY`, and `CC_CR_DT`, in `Spec-Driven-Development/SDD.API/SDD.API/Contracts/CodeRecordResponse.cs`.
- [X] T014 [US1] Implement the paginated Codes Master list operation using the existing composite identity and default page size 10 in `Spec-Driven-Development/SDD.API/SDD.API/Services/CodesService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CodesController.cs`.
- [X] T015 [US1] Add Master > Codes Master navigation and dedicated listing route in `Spec-Driven-Development/sdd-ui/src/app/navigation/master-navigation.ts` and `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`.
- [X] T016 [US1] Implement the listing page with Code, Code Description, Type, Value 1, Value 2, and Actions in that order, Add at top-right, and Edit/Delete row actions in `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/codes-list-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/codes-list-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/codes-list-page.css`.
- [X] T017 [US1] Connect the listing to the generated API client and implement pagination, distinct empty/loading/error states, and success feedback display in `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/services/codes-api.service.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/codes-list-page.ts`.
- [X] T018 [US1] Add a record-specific read-only creation audit tooltip with actual stored values, clear NULL presentation, keyboard focus, touch access, and GST `DD-MMM-YYYY` display in `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/components/creation-audit-details.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/components/creation-audit-details.html`.
- [X] T019 [US1] Generate the Angular API client from the implemented list contract into `Spec-Driven-Development/sdd-ui/src/app/api/generated/` and verify the generated listing response uses `items`, `page`, `pageSize`, and `totalCount`.

**Checkpoint**: User Story 1 is independently usable; do not report an API failure as an empty result.

---

## Phase 4: User Story 2 - Add a code (Priority: P1)

**Goal**: Create a record on a dedicated page with required validation, safe duplicate handling, and database-owned creation audit.

**Independent Test**: Save an approved test record and verify its composite key, derived Company Code, creation audit values, NULL update audit values, and listing feedback; verify duplicate and invalid inputs do not change existing data.

### Tests for User Story 2

- [X] T020 [P] [US2] Add API tests for missing required fields, Oracle byte-limit boundaries, duplicate composite keys, same Code with a different Type, derived Company Code, `ADMIN`, Oracle `SYSDATE`, NULL update audit values, and failed-insert preservation in `Spec-Driven-Development/SDD.API/SDD.API.Tests/CodesControllerCreateTests.cs`.
- [X] T021 [P] [US2] Add Playwright tests for the dedicated Add page, exact field order/labels, More toggle value preservation, required/length errors, duplicate feedback, guarded repeated submission, and success navigation in `Spec-Driven-Development/sdd-ui/e2e/codes-master-add.spec.ts`.

### Implementation for User Story 2

- [X] T022 [US2] Define the create request DTO with required `CC_CODE` (`VARCHAR2(12 BYTE)`) and `CC_TYPE` (`VARCHAR2(20 BYTE)`), optional `CC_DESC` (100 bytes), `CC_SHORT_DESC` (30 bytes), `CC_LONG_DESC` (2000 bytes), `CC_VALUE1` (100 bytes), `CC_VALUE2` (100 bytes), `CC_FLEX_01` (60 bytes), `CC_FLEX_02` (2000 bytes), `CC_DESC_L2` (100 bytes), `CC_SHORT_DESC_L2` (30 bytes), `CC_LONG_DESC_L2` (2000 bytes), and `CC_ACTIVE_YN` (1 byte) in `Spec-Driven-Development/SDD.API/SDD.API/Contracts/CodeWriteRequest.cs`.
- [X] T023 [US2] Implement server-side required and target-Oracle-byte validation for every field in `Spec-Driven-Development/SDD.API/SDD.API/Services/CodesFieldValidator.cs`; use the verified database character set and preserve the specified limits: 12, 20, 100, 30, 2000, 100, 100, 60, 2000, 100, 30, 2000, and 1 bytes respectively.
- [X] T024 [US2] Implement create persistence using `(CC_CODE, CC_TYPE)` as the duplicate key, derive `CC_COMP_CODE` from `CC_CODE`, set `CC_CR_BY` to `ADMIN`, generate `CC_CR_DT` with Oracle `SYSDATE`, leave `CC_UP_BY` and `CC_UP_DT` NULL, and map duplicate/constraint failures safely in `Spec-Driven-Development/SDD.API/SDD.API/Services/CodesService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CodesController.cs`.
- [X] T025 [US2] Add the dedicated Add Codes Master page and typed form with exact labels/order, Code and Code Type required, no Company Code or audit inputs, and More hidden by default in `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/code-add-page.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/code-add-page.html`, and `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/code-add-page.css`.
- [X] T026 [US2] Implement Add, Save, Cancel, and Back behavior so header Add and Save submit the same form once, pending submissions are guarded, and unsaved changes require confirmation in `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/code-add-page.ts`.
- [X] T027 [US2] Connect the Add form to the generated API client, display field-level byte/required/duplicate errors without raw server details, and return to the listing with success feedback only after a successful create in `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/code-add-page.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/services/codes-api.service.ts`.
- [X] T028 [US2] Regenerate the Angular client from the create endpoint contract into `Spec-Driven-Development/sdd-ui/src/app/api/generated/` and verify server-controlled Company Code and audit fields are not writable request properties.

**Checkpoint**: User Story 2 creates records safely without changing existing records on failure.

---

## Phase 5: User Story 3 - Edit a code (Priority: P1)

**Goal**: Edit an existing code on a dedicated page without changing its composite key or original creation audit values.

**Independent Test**: Load a record by both key fields, change an optional value, save, and verify only that row changed while its original key and creation audit values are preserved and update audit fields remain NULL.

### Tests for User Story 3

- [X] T029 [P] [US3] Add API tests for composite-key lookup/update, missing records, immutable identity, byte validation, preserved creation audit, NULL update audit, and failed-update data preservation in `Spec-Driven-Development/SDD.API/SDD.API.Tests/CodesControllerUpdateTests.cs`.
- [X] T030 [P] [US3] Add Playwright tests for dedicated Edit navigation, populated fields, immutable Code/Code Type, More value preservation, Cancel/Back confirmation, failure feedback, and successful return to listing in `Spec-Driven-Development/sdd-ui/e2e/codes-master-edit.spec.ts`.

### Implementation for User Story 3

- [X] T031 [US3] Implement single-record retrieval and update using both `CC_CODE` and `CC_TYPE`, immutable key matching, existing field mappings/byte limits, preserved `CC_CR_BY` and `CC_CR_DT`, NULL `CC_UP_BY` and `CC_UP_DT`, and safe missing/update errors in `Spec-Driven-Development/SDD.API/SDD.API/Services/CodesService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CodesController.cs`.
- [X] T032 [US3] Add the dedicated Edit Codes Master route and page that loads every stored field, prevents key changes, reuses the Add field order and More section, and formats the same GST date convention in `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`, `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/code-edit-page.ts`, and `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/code-edit-page.html`.
- [X] T033 [US3] Implement Edit Save, Cancel, and Back behavior with pending-submit protection, unsaved-change confirmation, composite-key API calls, safe errors, and success-only return to the listing in `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/code-edit-page.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/services/codes-api.service.ts`.
- [X] T034 [US3] Regenerate the Angular client from the read/update endpoint contracts into `Spec-Driven-Development/sdd-ui/src/app/api/generated/` and verify both key fields are required for retrieval and update.

**Checkpoint**: User Story 3 updates the originally selected composite-key record only.

---

## Phase 6: User Story 4 - Delete a code (Priority: P2)

**Goal**: Delete only the selected composite-key record after explicit user confirmation.

**Independent Test**: Cancel a deletion and verify the record remains; confirm deletion in an approved test-data environment and verify only the selected `(CC_CODE, CC_TYPE)` record is removed.

### Tests for User Story 4

- [X] T035 [P] [US4] Add API tests for composite-key deletion, missing rows, database constraint rejection, and no success-shaped response on failure in `Spec-Driven-Development/SDD.API/SDD.API.Tests/CodesControllerDeleteTests.cs`.
- [X] T036 [P] [US4] Add Playwright tests for confirmation text containing both key fields, cancellation, successful deletion feedback, and constraint/error feedback in `Spec-Driven-Development/sdd-ui/e2e/codes-master-delete.spec.ts`.

### Implementation for User Story 4

- [X] T037 [US4] Implement deletion strictly by `CC_CODE` and `CC_TYPE`, with missing-row and constraint-error handling and no cascade behavior in `Spec-Driven-Development/SDD.API/SDD.API/Services/CodesService.cs` and `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CodesController.cs`.
- [X] T038 [US4] Implement explicit Delete confirmation identifying both key values, cancel-without-change, pending-operation protection, success-only row removal, and clear feedback in `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/codes-list-page.ts` and `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/pages/codes-list-page.html`.
- [X] T039 [US4] Regenerate the Angular client from the delete endpoint contract into `Spec-Driven-Development/sdd-ui/src/app/api/generated/` and verify deletion requires both composite-key values.

**Checkpoint**: User Story 4 cannot delete a row until the user confirms, and it cannot identify a row by Code alone.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete feature, project governance, and user-facing documentation.

- [X] T040 [P] Verify all user-visible Codes Master labels, validation messages, success/error messages, and date displays follow British/Indian English and GST `DD-MMM-YYYY` in `Spec-Driven-Development/sdd-ui/src/app/features/codes-master/`.
- [X] T041 Verify the API contract, generated Angular client, shared pagination response, and all error responses remain aligned with `specs/001-codes-master/contracts/codes-master.openapi.yaml` and `Spec-Driven-Development/sdd-ui/src/app/api/generated/`.
- [X] T042 Verify the feature makes no schema changes, migrations, seed writes, or credential commits and that generated database/client files are not hand-edited in `Spec-Driven-Development/SDD.API/SDD.API/` and `Spec-Driven-Development/sdd-ui/src/app/api/generated/`.
- [X] T043 Run the API test suite and Playwright acceptance suite from `specs/001-codes-master/quickstart.md`; resolve failures and record the final commands/results in `specs/001-codes-master/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately. T001 approval is required before changing package manifests; T002 read-only checks require authorized access.
- **T002/T005 sequencing**: Add the approved Oracle provider as the prerequisite portion of T005, then perform T002's read-only connectivity and metadata checks before scaffolding. Keep T005 unchecked until scaffolding is complete and verified.
- **Foundational (Phase 2)**: Depends on Setup. All stories require safe database configuration, API error handling, shared pagination, client generation, and application routing.
- **User Stories (Phase 3+)**: Start after the foundation and any explicitly noted story dependency.
- **Polish (Phase 7)**: Depends on all four stories selected for delivery.

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2. Establishes navigation/listing, the shared API client service, and user feedback surface.
- **US2 (P1)**: Depends on Phase 2 and the listing/feedback surface from US1 for successful return-to-listing behavior.
- **US3 (P1)**: Depends on Phase 2 and the US1 listing's Edit action and shared feedback surface.
- **US4 (P2)**: Depends on Phase 2 and the US1 listing's Delete action and refresh behavior.

### Within Each User Story

- Add or update tests before or alongside implementation; xUnit and Playwright are constitutional requirements.
- API DTO and service work precedes the endpoint/client regeneration that consumes its shape.
- UI forms and listing pages consume only the generated client.
- Database-derived values and field limits remain governed by the verified Oracle metadata and the contract/data model.

### Parallel Opportunities

- Setup T002 (authorized read-only database preflight) may run alongside dependency approval T001; T003 secret-store choice depends on owner approval for the mechanism.
- In US1, T011 and T012 can be authored in parallel; the independent navigation/page layout can be developed once foundation is ready.
- In US2, T020 and T021 can be authored in parallel. API request validation and the separate Add page can proceed in parallel after the shared contract/foundation is stable.
- In US3, T029 and T030 can be authored in parallel. API retrieval/update work and the Edit page can proceed in parallel after US1.
- In US4, T035 and T036 can be authored in parallel. API deletion and confirmation UI can proceed in parallel after US1.
- Different user stories can proceed in parallel after Phase 2, but US2–US4 share the CodesService, API controller, generated client, and listing feedback surface; coordinate changes to those files to avoid conflicts.

## Parallel Examples

### User Story 1

```text
T011 API list tests: SDD.API/SDD.API.Tests/CodesControllerListTests.cs
T012 UI listing tests: sdd-ui/e2e/codes-master-list.spec.ts
```

### User Story 2

```text
T020 API create tests: SDD.API/SDD.API.Tests/CodesControllerCreateTests.cs
T021 UI add tests: sdd-ui/e2e/codes-master-add.spec.ts
```

### User Story 3

```text
T029 API update tests: SDD.API/SDD.API.Tests/CodesControllerUpdateTests.cs
T030 UI edit tests: sdd-ui/e2e/codes-master-edit.spec.ts
```

### User Story 4

```text
T035 API delete tests: SDD.API/SDD.API.Tests/CodesControllerDeleteTests.cs
T036 UI delete tests: sdd-ui/e2e/codes-master-delete.spec.ts
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 approvals and non-mutating Oracle preflight.
2. Complete Phase 2 shared database/API/UI foundations.
3. Implement and independently validate the listing, navigation, empty/error states, pagination, and accessible creation audit display in US1.
4. Stop for owner review before proceeding to database-changing user stories.

### Incremental Delivery

1. Deliver US1 listing and audit display.
2. Deliver US2 create flow and verify creation audit rules against an approved test-data environment.
3. Deliver US3 composite-key-safe edit and audit preservation.
4. Deliver US4 confirmation-protected delete.
5. Run the complete quickstart and acceptance suite before feature completion.

### Safe Data Validation

Use isolated/approved test data only. Do not insert, update, or delete shared Oracle records without explicit authorization. Never use credentials in source files or shell history.

## Notes

- Every task uses the required unchecked checklist, sequential ID, applicable parallel/story labels, and at least one concrete file path.
- `[P]` appears only where the task can be performed independently on distinct files.
- No migration, DDL, schema edit, or unauthorised database mutation is planned.
- Package and test-tool changes are gated by owner approval in T001.
