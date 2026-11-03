# Research: Premium Adjustment Master

## Decisions

### Decision: No new packages

**Decision**: Feature 002 proposes no new package. Everything it needs was installed for feature 001: Oracle.EntityFrameworkCore, NSwag.MSBuild, Angular Material/CDK, SweetAlert2 (through the shared notification service), `@fontsource/inter`, `@fontsource/noto-sans-arabic`, the Material Symbols icon font, Angular ESLint, Prettier, XUnit v3, the ASP.NET Core test host and Playwright Test.

**Rationale**: Constitution B4 requires owner approval before adding, updating or removing a package. Nothing is being added, so no approval is needed. Article 2 (simplicity) favours reuse over new tools.

**Alternatives considered**: None needed.

---

### Decision: Angular version

**Decision**: Angular 22 and TypeScript 6.0, as already declared in `sdd-ui/package.json`.

**Rationale**: Constitution v1.0.2 (B2, B8) was amended to Angular 22 on 29-Oct-2026 to match the existing UI project. Earlier drafts of this feature wrongly said Angular 21; no downgrade is needed.

**Alternatives considered**: Downgrading to Angular 21 was rejected because it would break the working feature 001 UI for no benefit.

---

### Decision: Oracle schema confirmation

**Decision**: With owner-approved read-only access, inspect the adjustment-code table and available dropdown types before implementation. This inspection was completed on 02-Nov-2026:
- `IIRIS_RD_DEVP.BRM_MISC_CODES` has primary key `(MC_CODE, MC_COMP_CODE, MC_TYPE)`, BYTE-semantics VARCHAR2 fields, nullable Active and audit columns, no defaults, no Active Y/N check, and no triggers. Details are in `data-model.md`.
- The configured `STD_LIST_ITEM` has active values in `CALC_TYPE` (4), `CHARGE_CAT` (2), `CHARGE_TYPE` (3) and `DISCOUNT_TYPE` (2). The owner confirmed Code Type=`CALC_TYPE`, Discount Type=`DISCOUNT_TYPE`, Charges Type=`CHARGE_TYPE`, and Charges Category=`CHARGE_CAT` on 02-Nov-2026.

**Rationale**: Constitution B8 says database changes are made to the tables and then scaffolded, with no EF migrations and no edits to scaffolded files. The read-only inspection does not authorize DDL. Because the adjustment fields use BYTE semantics, the owner must approve a resolution before full Arabic maximum-length persistence can be claimed.

**Alternatives considered**: None. Schema inspection is a prerequisite.

---

### Decision: Active flag as the soft delete

**Decision**: Every adjustment code has an Active setting, on by default and changeable while adding and editing, stored as `Y`/`N`, with a null counted as Active. Inactive codes stay in the list and stay openable. Permanent deletion stays as well, with confirmation.

**Rationale**: The owner decided on 29-Oct-2026 that the Active setting applies to every master page ("apply this to all specs and stories") and confirmed for feature 001 that permanent deletion stays alongside it. Feature 002's first draft listed soft delete as out of scope, which is no longer true.

**Alternatives considered**: Removing permanent deletion. Rejected because the owner kept it for feature 001, and one pattern across master screens is simpler for brokers.

---

### Decision: One unpaged options endpoint for the dropdowns

**Decision**: Return the four dropdown lists, active items only and ordered by description, from one read-only endpoint, `GET /api/premium-adjustment-options`, without paging. Each item is `{ code, description }`, the same shape feature 001 uses. The constitution C3 exception for it was recorded on 02-Nov-2026, like the one for `vehicle-model-options`.

C3 row, as recorded in the constitution on 02-Nov-2026 (owner-approved):

| Date | Article | Exception | Reason |
| ---- | ------- | --------- | ------ |
| 2026-11-02 | B8 (listing endpoints MUST be paged) | The read-only `GET /api/premium-adjustment-options` lookup returns the four `STD_LIST_ITEM` dropdown lists (Code Type, Discount Type, Charges Type, Charges Category) in one unpaged response (feature 002). | The lists are small, fixed lookups that fill dropdowns; paging them would add four requests, a loop through pages in the UI and paging controls with no benefit. Same reasoning as the feature 001 exception. |

**Rationale**: It is the simplest design (Article 2), matches feature 001, and keeps the UI to a single request.

**Alternatives considered**: Four paged lookup endpoints with the UI loading every page. This is compliant without an exception, but it adds four endpoints and page-loading code for lists that fit in one response. If the owner prefers it, the plan and contract revert to that design.

---

### Decision: Per-column filters instead of one search box

**Decision**: The list uses the same per-column filter control and server-side filter rules as the Vehicle Make Master (starts with, ends with, contains, equals, not equals; Status: equals or not equals). The shared filter code in the API is generalised so each list declares its own filterable columns (six here, against four in feature 001). The Code Type filter matches the Code Type description.

**Rationale**: Feature 001 replaced its search box with per-column filters on 30-Oct-2026. Using one pattern across master screens avoids two different ways of finding a record and avoids duplicate logic (Article 5). The owner confirmed this for 002 on 02-Nov-2026 (see the spec clarifications).

**Alternatives considered**: A single search box plus a Code Type dropdown filter (the first draft). Rejected for inconsistency with feature 001.

---

### Decision: Case-insensitive sorting

**Decision**: Sort keys are upper-cased in the database query, the same way the filters compare text. Ties are broken by a unique key so no record repeats or disappears between pages.

**Rationale**: Oracle compares text letter by letter by default, so "BMW" would sort before "Bentley". Feature 001 fixed this on 02-Nov-2026; 002 starts with the fix and an API test for it.

**Alternatives considered**: Sorting in the browser. Rejected because the list is paged and sorting must cover every record.

---

### Decision: Create answers 200, not 201

**Decision**: `POST` returns 200 with the saved record.

**Rationale**: Constitution B8 forbids `[ProducesResponseType]`, so the return type can only describe a 200 response, and the NSwag-generated Angular client treats any other success status as a failure. This is the same decision as feature 001. The first draft of the contract said 201.

**Alternatives considered**: Adding response attributes (forbidden by B8) or hand-editing the generated client (forbidden by B7).

---

### Decision: Reuse feature 001's look and feel

**Decision**: Icon buttons with tooltips and accessible names, the breadcrumb trail, the shared notification service, larger text with Inter and Noto Sans Arabic, and the unsaved-changes guard are reused from feature 001, not rebuilt. The open page receives the adjustment key through the navigation state, as the make page does.

**Rationale**: The owner asked on 02-Nov-2026 that this feature follow feature 001 as it now stands. Reuse keeps the screens consistent and honours Article 5 (no duplicated logic).

**Alternatives considered**: Building 002 first and aligning it later. Rejected because it would mean rewriting each screen twice.

---

### Decision: Test runner

**Decision**: The single runner `Spec-Driven-Development/test-all.ps1` already exists for feature 001. Extend it to run this feature's API tests, Angular tests, Playwright tests, the linters (`npm run lint`, `dotnet format --verify-no-changes`) and the production builds.

**Rationale**: Constitution Article 4 requires one documented command, and Article 5 requires an automatic formatter and linter.

**Alternatives considered**: A separate runner for 002. Rejected because the owner should have one command for everything.

---

## Open Items (need owner action)

1. ~~Approve the C3 exception for the unpaged options endpoint.~~ Done on 02-Nov-2026: the exception is recorded in the constitution (C3).
2. Confirm Oracle access and approve scaffolding of the adjustment-code table. Provide its table and column names, or run the scaffold command yourself and tell me when it is done.
3. A colleague is setting up `STD_LIST_ITEM` separately. Once that is done, confirm which list types fill Code Type, Discount Type, Charges Type and Charges Category.
4. Approve the creation of `docs/decisions/premium-adjustment-master.md` as the decision record (no approval needed beyond normal review).

No implementation, package change or database access was performed during this update.
