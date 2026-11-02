# Implementation Plan: Premium Adjustment Master

**Branch**: `002-premium-adjustment-master` | **Date**: 29-Oct-2026 (revised 02-Nov-2026: rewritten to follow feature 001 as it now stands; Active flag as soft delete, per-column filters, icon actions, typography, breadcrumbs, shared notification style) | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-premium-adjustment-master/spec.md`

## Summary

Provide brokers with one trusted master list for premium discounts, loadings, and excess additions. In plain English: the Angular page sends typed requests to the .NET API; the API checks the values, tidies the English text, keeps Arabic text exactly as typed, and reads or writes the approved Oracle tables. The list has a filter under each column heading (starts with, ends with, contains, equals, not equals; Status: equals or not equals) and sortable columns, exactly like the Vehicle Make Master, with no global search box. Filtering and sorting happen in the database across all matching records before the page of 10 is cut out. Brokers can add, view, edit, deactivate/reactivate (the Active setting is the soft delete) and permanently delete adjustment codes. The four dropdowns (Code Type, Discount Type, Charges Type, Charges Category) are filled from one small read-only "options" call. Screens reuse feature 001's shared pieces: icon buttons with tooltips, column filter, breadcrumb trail, notification service and unsaved-changes guard. The API's OpenAPI description is the source for the generated Angular client.

## Technical Context

**Language/Version**: C# / .NET 10; Angular 22 / TypeScript 6.0 (as declared in the UI project and in constitution v1.0.2)

**Primary Dependencies**: All already installed by feature 001: ASP.NET Core OpenAPI, Oracle.EntityFrameworkCore, NSwag.MSBuild, Angular Material/CDK, SweetAlert2 (used only through the shared notification service), `@fontsource/inter`, `@fontsource/noto-sans-arabic`, the Material Symbols icon font, Angular ESLint, Prettier, XUnit v3, ASP.NET Core test host and Playwright Test. **No new package is proposed.** Any future package change still needs owner approval under constitution B4.

**Storage**: Oracle 19c, Database-First. `STD_LIST_ITEM` is already scaffolded and inspected (key `(LI_TYPE, LI_CODE)`). Owner-approved read-only inspection identified `IIRIS_RD_DEVP.BRM_MISC_CODES`, with the physical mapping, composite primary key, nullable Active/audit fields, no defaults/triggers, and BYTE semantics recorded in `data-model.md`. No migrations; no DDL or data change without owner approval.

**Testing**: XUnit API tests against the approved Oracle test schema (`SDD.API.Tests`), Angular tests (`ng test`), and Playwright end-to-end tests in `tests/premium-adjustment-e2e`. All run from the existing single runner `Spec-Driven-Development/test-all.ps1`, which is extended for this feature.

**Target Platform**: Local machine; .NET 10 API, Angular browser UI, Oracle 19c

**Project Type**: Web application with an ASP.NET Core API and Angular UI

**Performance Goals**: No latency, throughput or record-count target is specified. Queries filter and sort the full matching set in the database before returning 10 records.

**Constraints**: Unique key is Code Type + Code + Company Code. Per-column filters with an allow-list of operators (Status: equals or not equals only), case-insensitive, combined with AND, typed text treated as plain text, a blank filter ignored, and "not equals" also listing empty values (same as 001). The Code Type filter and sort use the Code Type description. Sorting uses an allow-list (Code Type, Code, Company Code, Name, Short Name), is case-insensitive, and ends with a unique tie-break so pages never repeat or lose a row. The list returns the shared `PaginatedResult<T>` with page size 10. Dropdown options come from one unpaged read-only endpoint, which needs the constitution C3 exception below. New and updated records require Discount Type, Charges Type and Charges Category; a code the record already holds is accepted even if it has become inactive. The Active setting is stored as `Y`/`N`, is on by default, and a null counts as Active. Non-success responses use `ProblemDetails`. Create answers 200 with the saved record (not 201), because B8 forbids response attributes and the generated client treats other success codes as failures (the same decision as 001). Every async backend method accepts and passes on a `CancellationToken` (B5). Authentication and permissions are out of scope (B9); the controllers follow the same pattern as feature 001. The user-visible text follows feature 001's typography, icon and breadcrumb rules.

**Scale/Scope**: One adjustment-code master workflow (list, add, open/edit, deactivate, delete) and four read-only standard-list dropdowns. List page size is 10. No volume or concurrency target is specified.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Spec is user-focused, prioritised, and each story has testable acceptance scenarios (Article 1).
- [x] Scope is limited to adjustment-code CRUD (with Active as the soft delete) and read-only retrieval of the four standard lists; no lookup maintenance, no speculative features (Article 2).
- [x] This plan and the quickstart explain the design in plain English and give owner-verifiable steps (Article 3).
- [x] Tests: XUnit, Angular and Playwright coverage for every acceptance scenario; one documented command; bug fixes start with a failing test (Article 4, B5).
- [x] Formatter and linter gates: `npm run lint` and Prettier for Angular/TypeScript, `dotnet format` for C#; both run by the test runner (Article 5).
- [x] Settings live in configuration, with start-up checks already in place (connection string, CORS, audit user) (Article 6).
- [x] No secrets in code or documents; connection string from user-secrets or environment variable; example settings file exists (Article 7, B2, B4).
- [x] Timestamped success and failure logging that holds no secrets or unnecessary personal data; failures never silent; user messages in plain English with a next step (Article 8, B8).
- [x] Permanent deletion needs explicit confirmation (Article 9).
- [x] Small commits on the feature branch `002-premium-adjustment-master`; main stays working (Article 10).
- [x] A technical decision record is planned: `docs/decisions/premium-adjustment-master.md` (Article 11).
- [x] British/Indian English in all user-facing text; dates DD-MMM-YYYY in GST; money not applicable (B3).
- [x] No new package proposed (B4). Everything the feature needs was installed and approved for feature 001.
- [x] New behaviour has unit tests; `CancellationToken` is accepted and passed on by every async backend method (B5).
- [x] Controllers, DTOs and typed return values; global `ProblemDetails`; no stack traces; no `[ProducesResponseType]`, `[Produces]`, `[Consumes]`, Swagger attributes or XML comments on controllers (B6, B8). Authorization follows the feature 001 pattern, and sign-in is out of scope (B9).
- [x] Angular: standalone, `OnPush`, signals, `inject()`, signal `input()`/`output()`, `@if`/`@for` with `track`, typed reactive forms, Angular Material, one global HTTP error interceptor, generated API types only, and no `any`, non-null assertions, or casts to silence the compiler (B7, B8). Messages and confirmations go through the shared notification service and never call SweetAlert2 directly, and never with raw HTML.
- [x] Persistence is Oracle Database-First: scaffolded files are never edited, extensions use partial classes, no migrations (B8).
- [x] The Angular version matches the constitution (Angular 22); no downgrade is needed.
- [x] **Implementation gate: schema and mappings.** T001's owner-approved read-only inspection and T002's four owner-confirmed `LI_TYPE` mappings are recorded in `data-model.md`. The adjustment columns use BYTE semantics, so Arabic maximum-character persistence remains limited; no schema change is authorized by inspection.
- [x] **Implementation gate: constitution C3 exception.** Recorded in the constitution (C3) on 02-Nov-2026, with the owner's approval, for the single unpaged `GET /api/premium-adjustment-options` lookup. It is the same kind of exception as feature 001's `vehicle-model-options`.

**Gate result**: The design follows the constitution and the C3 exception is recorded. The adjustment schema and list mappings are verified. The BYTE-semantics Arabic persistence limitation remains documented; no packages or database objects were changed.

## Project Structure

### Documentation (this feature)

```text
specs/002-premium-adjustment-master/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/requirements.md
└── contracts/premium-adjustments-api.md
docs/decisions/premium-adjustment-master.md   # significant technical decisions (Article 11)
```

### Source Code (repository root)

```text
Spec-Driven-Development/
├── SDD.API/SDD.API/
│   ├── Controllers/PremiumAdjustmentsController.cs
│   ├── Controllers/PremiumAdjustmentOptionsController.cs
│   ├── DTOs/PremiumAdjustment*.cs and AdjustmentCode*.cs
│   ├── Services/PremiumAdjustmentService.cs
│   ├── Services/PremiumAdjustmentListQuery.cs     # filters and sorting for this list
│   ├── Services/PremiumAdjustmentInputRules.cs    # validation and text tidying
│   ├── Services/ColumnFilters.cs                  # existing; generalised so makes, models and adjustments share it
│   └── Data/Scaffolded/                           # database-first entities; generated files stay untouched
├── SDD.API/SDD.API.Tests/PremiumAdjustments/      # XUnit tests (extends the existing project)
├── sdd-ui/src/app/features/premium-adjustments/   # list, and one form for add and open/edit
├── sdd-ui/src/app/shared/                         # existing column filter, icon button, breadcrumb, notification service, unsaved-changes guard, limited text field, validators
├── sdd-ui/src/app/generated/                      # generated API client; never hand-edit
└── tests/premium-adjustment-e2e/                  # Playwright tests
```

**Structure Decision**: Extend the existing API and UI projects and their test infrastructure. Keep adjustment CRUD and the read-only options in two small controllers, with validation, tidying, filtering and sorting in services. Reuse the shared column-filter control, icon button, breadcrumb, notification service, unsaved-changes guard and validators from feature 001 rather than copying them (Article 5: no duplicated logic). Feature 001's filter code currently assumes exactly four filters (code, name, short name, status). It is generalised so that a list can declare its own filterable columns (this list has six), and feature 001's tests must keep passing unchanged. The list uses an allow-list for both operators and sortable columns, so nothing a caller types is ever used as a column name. The adjustment key (three parts) travels to the open page in the navigation state, not the address bar, as feature 001 does for makes. No repository layer is added.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| B8 requires listings to be paged; the four dropdown lists are returned unpaged in one call (owner-approved; recorded under C3 on 02-Nov-2026). | The lists are small, fixed lookups that fill dropdowns. One response avoids four requests and a loop through pages in the UI. | Paging each list adds API and UI complexity with no benefit for a dropdown, and it would differ from feature 001 for no reason. |
| B8 names Angular Material as the primary UI library; SweetAlert2 is used for notifications and confirmations (owner preference, recorded for feature 001 on 30-Oct-2026). | One consistent notification and confirmation style across the app. | Nothing new is added by this feature; it reuses the shared service. Restyling Material dialogs would create two styles. |

## Post-Design Constitution Check

The Phase 1 data model and API contract keep the composite business key, shared pagination for the list, `ProblemDetails` errors, generated Angular types, Database-First scaffolding, active-only read-only options, the Active flag as a reversible soft delete next to confirmed permanent deletion, formatter and linter gates, logging, a decision record, and automated tests. No new constitution conflict was introduced. The C3 exception is now recorded. The Oracle schema and list-type mapping gate remains open; do not begin implementation until it is resolved.
