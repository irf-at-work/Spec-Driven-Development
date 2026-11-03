# Premium Adjustment Master Decisions

**Status**: Implemented. The adjustment-code schema was inspected read-only and the four dropdown mappings were confirmed. Automated Oracle-backed CRUD validation remains blocked until the approved test-schema connection is available.
**Date**: 02-Nov-2026

## Add No New Packages

**Decision**: Feature 002 adds, updates and removes no package. It reuses everything installed for feature 001: Oracle.EntityFrameworkCore, NSwag.MSBuild, Angular Material and CDK, SweetAlert2 (only through the shared notification service), `@fontsource/inter`, `@fontsource/noto-sans-arabic`, the Material Symbols icon font, Angular ESLint, Prettier, XUnit, Vitest and Playwright.

**Alternatives considered**: None needed.

**Rationale**: Constitution B4 requires owner approval for any package change. Checked on 02-Nov-2026 (task T003): the installed versions already cover the feature, so no approval is needed.

## Use the Active Flag as the Soft Delete, Alongside Permanent Delete

**Decision**: Every adjustment code has an Active setting stored as `Y` or `N`. It is on by default when adding, can be turned off while adding or editing and on again while editing, and is shown but not changeable in read-only view. A row with no flag counts as Active. Inactive codes stay in the list and can be opened. Permanent deletion stays, with confirmation that it cannot be undone.

**Alternatives considered**: Removing permanent deletion, or a separate deactivate action.

**Rationale**: Owner decision of 29-Oct-2026 that the Active setting applies to every master page, and the decision for feature 001 that permanent deletion stays. One pattern across master screens is simpler for brokers. The earlier draft that put soft delete out of scope no longer applies.

## Use Per-Column Filters Instead of a Search Box

**Decision**: The list has a filter on every data column (Code Type, Code, Company Code, Name, Short Name, Status) and no global search box. Text columns offer starts with, ends with, contains (default), equal to and not equal to; Status offers Active or Inactive with equal to and not equal to. Filters ignore case, combine with AND, treat typed text as plain text, ignore a blank value, and "not equal to" also lists empty values. The shared filter code in the API is generalised so each list declares its own filterable columns (six here, four in feature 001).

**Alternatives considered**: A single search box plus a Code Type dropdown filter (the first draft).

**Rationale**: Feature 001 replaced its search box with per-column filters on 30-Oct-2026; the owner confirmed the same for 002 on 02-Nov-2026. One way of finding a record across master screens avoids duplicated logic (Article 5). Feature 001's tests must keep passing unchanged after the generalisation.

## Filter and Sort by Code Type Description

**Decision**: The Code Type filter and sort use the Code Type description, so the list query joins `STD_LIST_ITEM` on `(LI_TYPE, LI_CODE)`. A record whose Code Type has no matching item shows its code instead of a description.

**Alternatives considered**: Filtering on the stored code only.

**Rationale**: Brokers recognise descriptions, not codes. The join keeps filtering and sorting in the database, ahead of paging.

## Sort Without Regard to Case and Finish with a Unique Tie-Break

**Decision**: Sort keys are upper-cased in the database query. Sorting is allowed only on Code Type, Code, Company Code, Name and Short Name, and always ends with a unique tie-break (Code Type, Code, Company Code). The initial order is Code Type description then Code, ascending.

**Alternatives considered**: Sorting in the browser, or case-sensitive database sorting.

**Rationale**: Oracle's default text sort would place "BMW" before "Bentley", and the list is paged, so sorting must cover every record. The tie-break stops rows repeating or disappearing between pages. This repeats the fix made for feature 001 on 02-Nov-2026, with an API test from the start.

## Serve the Four Dropdowns from One Unpaged Options Lookup (Constitution C3 Exception)

**Decision**: `GET /api/premium-adjustment-options` returns the Code Type, Discount Type, Charges Type and Charges Category lists in one response (`codeTypes`, `discountTypes`, `chargesTypes`, `chargesCategories`, each `{ code, description }`). Only active items are returned, ordered by description. The list types are fixed on the server and never taken from the request. The lookup is read-only; this feature never writes `STD_LIST_ITEM`. The exception to B8 is recorded in constitution C3 (02-Nov-2026, owner-approved).

**Alternatives considered**: Four paged lookup endpoints with the UI loading every page. If the owner prefers it, the plan and contract revert to that design.

**Rationale**: The lists are small fixed lookups. One request is simpler and matches feature 001's `vehicle-model-options`. The owner confirmed the mappings on 02-Nov-2026: Code Type=`CALC_TYPE`, Discount Type=`DISCOUNT_TYPE`, Charges Type=`CHARGE_TYPE`, and Charges Category=`CHARGE_CAT`. A read-only development smoke check returned 4, 2, 3 and 2 active options respectively.

## Check Classification Codes on the Server

**Decision**: The API refuses a Code Type, Discount Type, Charges Type or Charges Category that is not an active item of its own list, even if the screen sent it. On update, a code the record already holds is accepted even if it has since become inactive, but a newly chosen code must be active. A record saved earlier without Discount Type, Charges Type or Charges Category must have all three chosen before it can be saved again.

**Alternatives considered**: Relying on database foreign keys.

**Rationale**: `STD_LIST_ITEM` has a two-column key, so the adjustment table is not expected to have foreign keys to it. Server-side checks protect the data whichever client calls the API. Keeping an already-held inactive choice lets old records be edited without forcing a change.

## Normalise at the API Boundary and Treat a Duplicate as the Database's Last Word

**Decision**: The API enforces requiredness, allowed characters, limits, capitals, word capitalisation and extra-space removal, and preserves Arabic text and spacing exactly. A duplicate Code Type + Code + Company Code is refused with `409`, and an Oracle `ORA-00001` from two simultaneous saves maps to the same answer. Angular validation is a convenience, not the authority.

**Alternatives considered**: Angular form validation alone, or checking for duplicates only before saving.

**Rationale**: Follows the input-validation rule and feature 001. The database key is the final guard when two people save the same combination at once.

## Answer Create with 200, Not 201

**Decision**: `POST /api/premium-adjustments` returns `200 OK` with the saved record.

**Alternatives considered**: `201 Created`, which needs response attributes (forbidden by B8) or a hand-edited generated client (forbidden by B7).

**Rationale**: The return type can only describe a `200` response, and the generated Angular client treats other success codes as failures. Same decision as feature 001.

## Reuse Feature 001's Look and Feel

**Decision**: Reuse the shared column filter, icon buttons with tooltips and accessible names, breadcrumb trail, notification service, unsaved-changes guard, limited text field and validators. Use Inter and Noto Sans Arabic. The open page receives the three-part key through navigation state, not the address bar, as feature 001 does for makes.

**Alternatives considered**: Building 002 first and aligning it later.

**Rationale**: The owner asked on 02-Nov-2026 that this feature follow feature 001 as it now stands. Reuse keeps screens consistent and honours Article 5.

## Known Limitation: Byte-Length Columns

**Decision**: Do not claim full persisted Arabic maximum-length support until the owner resolves it. Read-only inspection verified that all `BRM_MISC_CODES` `VARCHAR2` columns use BYTE semantics; Arabic text that fits the API character limit can exceed a column's byte limit. No DDL is run as part of this feature.

**Alternatives considered**: Changing column semantics.

**Rationale**: Schema changes need explicit owner approval (constitution B8). API validation enforces the specified character counts, but maximum-length Arabic persistence is not guaranteed and must remain reported as blocked rather than passed.
