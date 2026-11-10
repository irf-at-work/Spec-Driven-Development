# Feature Specification: Claim Configuration Master (CCM)

**Feature Branch**: `003-claim-configuration-master`

**Created**: 2026-11-10

**Status**: Approved for planning

**Input**: User-provided Claim Configuration Master requirements.

## Feature Overview

Claim Configuration Master lets application users create, find, and maintain claim configuration records and associate each record with applicable products. It provides a dedicated parent listing and detail form, lookup-backed fields, and a child product-mapping list.

**Business purpose**: Keep claim configuration and product applicability data together so users can reliably manage the configuration available to downstream claim processes.

## Clarifications

### Session 2026-11-10

- Q: Should CCM dropdowns include inactive `STD_LIST_ITEM` rows, or only rows where `LI_ACTIVE_YN = 'Y'`? → A: Show only active rows for new selections; retain and display an already-saved inactive value when editing.
- Q: If another user changes a parent or product mapping after you open it for editing, should CCM reject your save and ask you to reload, or allow your save to overwrite their changes? → A: Reject the stale save without overwriting newer values; tell the user to reload.
- Q: Which fields should be mandatory, and how should optional CCM values be persisted given current Oracle nullability? → A: Only Claim Config Code and Claim Config Name are mandatory. Persist blank optional values as NULL; the connected development schema already permits NULL for the specified optional columns, so no DDL change is needed.
- Q: Which lookup types should supply Dflt Recovery Code for Dedl and Applicable Products, and what filtering should the child list provide? → A: Use `CCM_DFLT_RECV_DEDU` for Dflt Recovery Code for Dedl and `CCM_PRODUCT` for Applicable Products. Add the existing six operators as filters for Product Code and Product Name.

## Scope

### Included

- CCM navigation, listing, filtering, sorting, and server-side pagination.
- Add, edit, and guarded deletion of parent CCM records.
- Lookup-backed parent fields sourced from `IIRIS_RD_DEVP.STD_LIST_ITEM` using the exact supplied `LI_TYPE` values.
- Y/N toggles, collapsed More section, validation, and reset behavior.
- Applicable Products child listing with add, edit, and delete operations.
- Parent and child persistence to the existing tables and Oracle connection.
- Duplicate validation, audit values, user-facing errors, and automated regression coverage.

### Excluded

- Creating, altering, or dropping database objects. The connected development schema already permits NULL in the approved optional parent columns.
- Changing Codes Master or Document Setup behavior.
- Introducing another database connection, framework, dependency, authentication mechanism, or authorization policy.
- Changing the existing authorization middleware or application configuration.
- Inferring or substituting lookup types or database columns not supplied in this specification.

### Existing project conventions

This feature must comply with the [project constitution](../../.specify/memory/constitution.md). It follows the existing Codes Master and Document Setup conventions: Angular standalone components with OnPush, signals and typed reactive forms; a .NET controller/service/repository API using the existing Oracle context; server-side listing filters and pagination; shared pagination and table styling; and generated Angular API types from the OpenAPI definition.

The existing Codes Master listing filters all database records before paging, combines active filters with AND, ignores text case, and offers Starts With, Ends With, Contains, Does Not Contain, Equal To, and Not Equal To operators. The listing defaults to 10 records per page and offers 10, 15, 20, and 50. Existing project conventions use `PaginatedResult<T>` and ProblemDetails for non-success API responses.

Inspection found no populated `STD_LIST_ITEM` lookup implementation in the current source tree. The owner confirmed that `LI_CODE` supplies lookup values and `LI_DESC` supplies their displayed descriptions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Find a claim configuration (Priority: P1)

As an application user, I can open Claim Configuration Master and find a configuration using its identifying details.

**Why this priority**: Users need to locate the correct configuration before they can inspect or maintain it.

**Independent Test**: Open the CCM listing and verify its columns, filters, sorting, pagination, empty state, retrieval-error state, and Add/Edit navigation.

**Acceptance Scenarios**:

1. **Given** Master navigation is available, **When** the user selects Claim Configuration Master, **Then** the CCM listing opens.
2. **Given** CCM records exist, **When** the listing loads, **Then** it shows Claim Config Code, Claim Config Name, Short Name, Module Name, and the conventional row actions.
3. **Given** the user applies one or more column filters, **When** results load, **Then** matching is case-insensitive, all active filters are combined with AND, and filtering occurs before pagination.
4. **Given** more records match than fit on one page, **When** the user changes page or page size, **Then** the requested server-side page is shown and the total matching record count is retained.
5. **Given** no CCM records match, **When** the listing loads, **Then** a clear empty or no-results state is shown.
6. **Given** records cannot be retrieved, **When** the listing loads, **Then** an error is shown instead of presenting the failure as an empty successful result.
7. **Given** a listed record exists, **When** the user selects Edit, **Then** its CCM detail page opens with the stored values.
8. **Given** a parent with no Applicable Products mappings is listed, **When** the user confirms Delete, **Then** that parent is deleted.
9. **Given** a parent with Applicable Products mappings is listed, **When** the user attempts Delete, **Then** deletion is rejected and the parent remains.

### User Story 2 — Create or edit a claim configuration (Priority: P1)

As an application user, I can enter or update a claim configuration on a dedicated detail page so that claim settings and audit history are stored consistently.

**Why this priority**: Maintaining a valid parent configuration is necessary before associating products with it.

**Independent Test**: Create a valid CCM record, verify its persisted values and creation audit, then edit it and verify its identity and creation audit remain unchanged.

**Acceptance Scenarios**:

1. **Given** the listing is open, **When** the user selects Add, **Then** a separate Add page opens and the company code is not shown.
2. **Given** the Add form is open, **When** the user expands More, **Then** Name in Arabic, Short Name in Arabic, and Active Y/N appear; More is collapsed initially.
3. **Given** a required field is empty or a value exceeds a database limit, **When** the user saves, **Then** the invalid field is identified and no parent record is created.
4. **Given** valid, non-duplicate parent values, **When** the user saves, **Then** the parent is persisted, success feedback is shown, and the Applicable Products section is displayed on the same detail page.
5. **Given** a saved CCM record is opened for edit, **When** the page loads, **Then** all stored values are populated and its company code and record identity are not editable.
6. **Given** an edit is valid, **When** the user saves, **Then** the same parent is updated, the original creation audit values are preserved, and update audit values are recorded.
7. **Given** the user changes form values, **When** the user selects Reset, **Then** Add restores its initial blank/default values and Edit restores its originally loaded values.
8. **Given** a CCM code already exists, **When** the user attempts to add another record with that code, **Then** a clear duplicate message is shown and the existing record is unchanged.
9. **Given** a parent save fails, **When** the operation completes, **Then** the page shows an actionable error and does not present the save as successful.

### User Story 3 — Manage applicable products (Priority: P1)

As an application user, I can add, edit, and delete products on a saved claim configuration so that its applicable products remain accurate.

**Why this priority**: Product applicability is a core part of the CCM record's business meaning.

**Independent Test**: Save a parent, add a product through the modal, and verify that the product code and corresponding name/description appear in the child listing and remain associated with that parent.

**Acceptance Scenarios**:

1. **Given** a parent CCM record has been successfully saved, **When** its detail page is displayed, **Then** the Applicable Products child section is shown.
2. **Given** the child section is displayed, **When** the user selects Add, **Then** a modal opens with a Product Code dropdown, Save, and Reset.
3. **Given** lookup data is available, **When** the Product Code dropdown opens, **Then** it loads from `STD_LIST_ITEM` with `LI_TYPE = 'CCM_PRODUCT'`.
4. **Given** a product is selected and not already mapped to this CCM, **When** the user saves the modal, **Then** the child mapping is inserted and the refreshed listing shows its code and corresponding description/name.
5. **Given** the same product is already mapped to this CCM, **When** the user attempts another insert, **Then** frontend and backend validation reject the duplicate and the existing mapping remains unchanged.
6. **Given** the Add Product modal contains a selection, **When** the user selects Reset, **Then** the selection is cleared.
7. **Given** product lookup or child persistence fails, **When** the operation completes, **Then** an actionable error is shown and the child listing is not reported as successfully updated.
8. **Given** a child mapping is listed, **When** the user selects Edit, **Then** the edit modal opens with its product selected and saving a valid selection updates that mapping.
9. **Given** a child mapping is listed, **When** the user cancels its Delete confirmation, **Then** the mapping remains unchanged.
10. **Given** a child mapping is listed, **When** the user confirms its Delete action, **Then** only that mapping is removed.

### Edge Cases

- A CCM code conflicts with the existing unique index, including a concurrent insert.
- A required name is empty or whitespace-only.
- Any string exceeds its declared Oracle column length, including multi-byte input where the column uses byte semantics.
- A rounding value is not numeric, exceeds the `NUMBER(8,5)` representable range, or has more fractional precision than allowed.
- A persisted Y/N value is NULL or is neither Y nor N.
- A lookup has no matching rows, contains a NULL display value, or cannot be loaded.
- A lookup value selected in an open form is no longer available when the record is saved.
- The same child product is added more than once, including concurrent attempts.
- A parent is not yet persisted when the user reaches the Applicable Products section.
- A parent or child record is not found during an edit or child insert.
- A parent or child changes after it is loaded for editing and before its update is submitted.
- Repeated Save activation occurs while a request is in progress.
- A listing filter has no matches, is cleared, or is combined with other filters.
- A child listing refresh fails after a successful insert; the user must be told the save succeeded but the refreshed list could not be loaded.

## Requirements *(mandatory)*

### Functional Requirements

#### Navigation and parent listing

- **FR-001**: The application MUST provide a Claim Configuration Master entry using the existing Master navigation and page-navigation conventions.
- **FR-002**: The CCM listing MUST display these data columns in order: Claim Config Code, Claim Config Name, Short Name, and Module Name. It MUST use the existing Codes Master table styling and responsive behavior and provide the conventional Actions column.
- **FR-003**: The listing MUST provide a top-right Add button and Edit and Delete actions for each parent using the existing navigation and confirmation conventions.
- **FR-004**: The listing MUST provide server-side filtering for Claim Config Code, Claim Config Name, Short Name, and Module Name. Each filter MUST support Starts With, Ends With, Contains, Does Not Contain, Equal To, and Not Equal To; matching MUST ignore case and combine active filters with AND across the complete dataset before pagination.
- **FR-005**: The listing MUST follow the existing Codes Master sorting convention for displayed data columns, applying sort before pagination with a stable tie-breaker.
- **FR-006**: The listing MUST use server-side pagination, default to 10 records per page, and offer page sizes 10, 15, 20, and 50 with the existing pagination controls.
- **FR-007**: The listing MUST distinguish loading, empty/no-results, and retrieval-error states and MUST provide clear user feedback for failed operations.

#### Parent Add/Edit page

- **FR-008**: Add MUST navigate to a separate detail page, not a modal. Edit MUST open the selected CCM on a separate detail page.
- **FR-009**: The Add/Edit form MUST present fields in the following order. The displayed field labels are the user-provided labels; database limits are the declared column lengths.

  | Order | Field label | Database column | Input / lookup | Database limit |
  |---:|---|---|---|---:|
  | 1 | Claim Config Code | `CCM_CODE` | User input | `VARCHAR2(12)` |
  | 2 | Claims Config Name | `CCM_NAME` | User input | `VARCHAR2(100)` |
  | 3 | Short Name | `CCM_SHORT_NAME` | User input | `VARCHAR2(30)` |
  | 4 | Module Name | `CCM_MODULE` | Dropdown; `LI_TYPE = 'CCM_MODULE'` | `VARCHAR2(2)` |
  | 5 | Posting Type | `CCM_ACNT_POSTING_TYPE` | Dropdown; `LI_TYPE = 'CCM_POST_TYPE'` | `VARCHAR2(1)` |
  | 6 | Exchange Rate Type | `CCM_ACNT_EXCH_RATE_TYPE` | Dropdown; `LI_TYPE = 'CCM_EXCH_RATE'` | `VARCHAR2(1)` |
  | 7 | Rounding Type | `CCM_ROUND_TYPE` | Dropdown; `LI_TYPE = 'CCM_ROUND_TYPE'` | `VARCHAR2(2)` |
  | 8 | Rounding Value | `CCM_ROUND_VALUE` | Numeric input | `NUMBER(8,5)` |
  | 9 | Applicable Currencies | `CCM_APPL_CURR_TYPE` | Dropdown; `LI_TYPE = 'CCM_CURR_TYPE'` | `VARCHAR2(2)` |
  | 10 | Dflt Estimate Close Reason | `CCM_DFLT_EST_CLO_REASON_CODE` | Dropdown; `LI_TYPE = 'CCM_CLO_REASON'` | `VARCHAR2(12)` |
  | 11 | Dflt Recovery Code for Dedl | `CCM_DFLT_RECV_DEDU_CODE` | Dropdown; `LI_TYPE = 'CCM_DFLT_RECV_DEDU'` | `VARCHAR2(12)` |

- **FR-010**: The form MUST provide Y/N toggle fields with these database mappings and Add defaults:

  | Field label | Database column | Stored values | Add default |
  |---|---|---|---|
  | Print Before Approval Y/N | `CCM_PRNT_BEF_APPR_YN` | `Y` / `N` | `N` |
  | RePrint Allowed Y/N | `CCM_RE_PRNT_YN` | `Y` / `N` | `N` |
  | Claim A/c Doc Gen Y/N | `CCM_CLM_ACNT_DOC_GEN_YN` | `Y` / `N` | `N` |
  | Sharing Clms A/c Doc Gen Y/N | `CCM_CLM_COINS_ACNT_DOC_GEN_YN` | `Y` / `N` | `N` |

- **FR-011**: The form MUST provide a collapsed-by-default More section containing Name in Arabic (`CCM_NAME_L2`, `VARCHAR2(100)`), Short Name in Arabic (`CCM_SHORT_NAME_L2`, `VARCHAR2(30)`), and Active Y/N (`CCM_ACTIVE_YN`, `VARCHAR2(1)`). Active Y/N MUST default to Y for a new record.
- **FR-012**: Only `CCM_CODE` and `CCM_NAME` are required inputs. Blank values for `CCM_SHORT_NAME`, `CCM_NAME_L2`, `CCM_SHORT_NAME_L2`, `CCM_MODULE`, `CCM_ACNT_POSTING_TYPE`, `CCM_ACNT_EXCH_RATE_TYPE`, `CCM_ROUND_TYPE`, `CCM_ROUND_VALUE`, `CCM_APPL_CURR_TYPE`, `CCM_DFLT_EST_CLO_REASON_CODE`, and `CCM_DFLT_RECV_DEDU_CODE` MUST persist as NULL. These columns are nullable in the verified development schema; no DDL change is required. Toggles retain their Y/N defaults.
- **FR-013**: String input MUST be validated against its corresponding Oracle column limit before persistence. Validation MUST use the actual column length semantics, MUST identify the affected field, and MUST NOT silently truncate.
- **FR-014**: `CCM_ROUND_VALUE` MUST accept only a numeric value representable by Oracle `NUMBER(8,5)`: no more than five fractional digits and an absolute value no greater than `999.99999`. Input MUST be rejected with a field-level message rather than silently rounded. No additional business range or sign restriction is assumed.
- **FR-015**: Every toggle MUST persist only `Y` or `N`. On Add, the four toggles in FR-010 MUST default to N and Active Y/N MUST default to Y. Edit MUST show each persisted state. Reset MUST restore the initial values on Add and the originally loaded values on Edit.
- **FR-016**: The detail page MUST show Add and Back actions at the top-right, with Add immediately to the left of Back, and Save and Reset actions centered at the bottom of the form. In Edit mode, Add MUST open a fresh Add page. In Add mode, Add MUST clear the current form and restore its initial defaults. Repeated Save activation MUST NOT submit duplicate requests. A failed operation MUST leave the saved record unchanged and show actionable feedback.
- **FR-017**: The company code MUST be the literal `CCM001` for every applicable parent database operation. It MUST NOT be displayed, accepted from user input, or derived from another source.
- **FR-018**: Parent retrieval, update, and other key-based operations MUST use the fixed company code and `CCM_CODE`. Edit MUST preserve record identity. The unique `CCM_CODE` index MUST be enforced; a duplicate insert MUST produce a clear conflict message without changing an existing record.
- **FR-019**: After a parent Add save succeeds, the Applicable Products child section MUST appear on the same detail page. Parent success feedback MUST be distinct from child lookup or child persistence failures.
- **FR-020**: The page MUST follow existing form validation, user feedback, unsaved-change, keyboard, focus, and responsive-layout conventions. Lookup and persistence errors MUST be visible and MUST NOT be converted to successful empty results.

#### Lookups

- **FR-021**: Every dropdown MUST load its available values from the existing `IIRIS_RD_DEVP.STD_LIST_ITEM` table using only the exact `LI_TYPE` listed in FR-009 and FR-023. `LI_CODE` MUST provide the lookup value and `LI_DESC` MUST provide its user-facing description/name. New selections MUST be limited to rows where `LI_ACTIVE_YN = 'Y'`. When editing a record whose saved lookup value is inactive, the form MUST retain and display that existing value without offering it as a new selection.
- **FR-022**: Lookup failures MUST be presented as errors, not as successful empty option lists. An Add form MUST submit only active lookup values supplied for its applicable lookup. An Edit form MUST retain an inactive value already stored on that record if unchanged; changing it requires selecting an active lookup value.
- **FR-023**: The Applicable Products Product Code dropdown MUST load from `STD_LIST_ITEM` with `LI_TYPE = 'CCM_PRODUCT'`. The Dflt Recovery Code for Dedl dropdown MUST load with `LI_TYPE = 'CCM_DFLT_RECV_DEDU'`. Both types MUST be used exactly as supplied by the owner. The child listing MUST show the selected code and its corresponding description/name.

#### Applicable Products child records

- **FR-024**: The Applicable Products section MUST appear only after a parent has been successfully saved. It MUST list Product Code and Product Name, provide an Add button at the top-right of the child section, provide Edit and Delete actions for each mapping using the same icons as Codes Master, and provide column filters for Product Code and Product Name with the existing six filter operators. Child filters MUST apply case-insensitively with AND semantics to the loaded child mappings; no child pagination is required.
- **FR-025**: Selecting Add or Edit MUST open a modal containing a Product Code dropdown, Save, and Reset. Add Reset MUST clear the modal selection; Edit Reset MUST restore the originally selected product. Edit MUST load the selected mapping's product and update that mapping. Save MUST be disabled or guarded while a request is in progress.
- **FR-026**: A child mapping MUST associate the selected `CCMP_CODE` with the current parent `CCMP_CCM_CODE`. After successful insertion or update, the child listing MUST refresh and show the selected code and lookup description/name.
- **FR-027**: The combination `(CCMP_CCM_CODE, CCMP_CODE)` MUST be treated as the child identity. The frontend and backend MUST both reject a duplicate product mapping for the same CCM, including concurrent attempts. A failed duplicate insert MUST leave existing data unchanged.
- **FR-028**: Parent and child key values MUST fit their declared `VARCHAR2(12)` columns. No database object or constraint may be created or changed by this feature.
- **FR-028a**: Child Delete MUST require explicit confirmation identifying the parent and selected product mapping. Confirming MUST delete only that mapping; cancelling MUST leave it unchanged.

#### Audit, API, and persistence

- **FR-029**: Parent inserts MUST set `CCM_CR_BY = 'ADMIN'` and `CCM_CR_DT = SYSDATE`; `CCM_UP_BY` and `CCM_UP_DT` MUST be NULL on insert.
- **FR-030**: Parent updates MUST set `CCM_UP_BY = 'ADMIN'` and `CCM_UP_DT = SYSDATE`, preserving the originally stored `CCM_CR_BY` and `CCM_CR_DT`.
- **FR-031**: Child inserts MUST set `CCMP_CR_BY = 'ADMIN'` and `CCMP_CR_DT = SYSDATE`; `CCMP_UP_BY` and `CCMP_UP_DT` MUST be NULL on insert.
- **FR-032**: Child updates MUST set `CCMP_UP_BY = 'ADMIN'` and `CCMP_UP_DT = SYSDATE`, preserving the original child creation audit values.
- **FR-033**: All audit values MUST be assigned by persistence operations, not accepted from the UI or based on a browser clock. Database dates MUST use Oracle `SYSDATE`.
- **FR-034**: The API MUST follow the existing controller, service, repository, validation, shared Oracle-context, and authorization middleware patterns. Database input MUST be parameterized and use the application's existing Oracle connection.
- **FR-035**: Listing responses MUST use the project's shared paginated response shape (`items`, `page`, `pageSize`, `totalCount`). Non-success API responses MUST follow the project's ProblemDetails convention; errors MUST not expose stack traces or raw internal exception details.
- **FR-036**: The OpenAPI definition MUST be the source of truth for the Angular client. Generated API client files MUST be regenerated using the existing `ng-openapi-gen` process and MUST NOT be edited manually.
- **FR-037**: Parent persistence MUST use `IIRIS_RD_DEVP.BRM_CLM_CONFIG`; child persistence MUST use `IIRIS_RD_DEVP.BRM_CCM_PROD`. Existing tables MUST NOT be created, altered, or dropped. The development schema's existing nullability satisfies FR-012.
- **FR-038**: The feature MUST preserve existing authorization middleware and application configuration and MUST NOT add authentication or authorization dependencies.

#### Delete and edit scope requiring owner decision

- **FR-039**: Parent Delete MUST require explicit confirmation. It MUST be rejected with a clear explanation while any Applicable Products mappings exist; it MUST delete the parent only when no mappings exist. Cancelling confirmation MUST leave the parent unchanged.
- **FR-040**: Child Edit MUST preserve the creation audit fields and update the update-audit fields as specified in FR-032. If the selected product is changed, the resulting `(CCMP_CCM_CODE, CCMP_CODE)` MUST remain unique; a duplicate target mapping MUST be rejected without changing either mapping.
- **FR-041**: Before updating a parent or child mapping, the application MUST verify that it has not changed since it was loaded for editing. A stale save MUST be rejected without overwriting newer data and MUST show a clear message asking the user to reload.

### Field-Level Database Mapping

#### Parent table — `IIRIS_RD_DEVP.BRM_CLM_CONFIG`

Primary key: `(CCM_COMP_CODE, CCM_CODE)`. Unique index: `CCM_CODE`.

| Database column | Oracle type | Nullability | Source / behavior |
|---|---|---|---|
| `CCM_COMP_CODE` | `VARCHAR2(12)` | NOT NULL | Fixed literal `CCM001`; never shown in the UI |
| `CCM_CODE` | `VARCHAR2(12)` | NOT NULL | Claim Config Code user input; unique index applies |
| `CCM_NAME` | `VARCHAR2(100)` | NOT NULL | Claims Config Name user input |
| `CCM_SHORT_NAME` | `VARCHAR2(30)` | Nullable | Short Name user input |
| `CCM_NAME_L2` | `VARCHAR2(100)` | Nullable | Name in Arabic; More section |
| `CCM_SHORT_NAME_L2` | `VARCHAR2(30)` | Nullable | Short Name in Arabic; More section |
| `CCM_MODULE` | `VARCHAR2(2)` | Nullable | Module Name lookup value |
| `CCM_ACNT_POSTING_TYPE` | `VARCHAR2(1)` | Nullable | Posting Type lookup value |
| `CCM_ACNT_EXCH_RATE_TYPE` | `VARCHAR2(1)` | Nullable | Exchange Rate Type lookup value |
| `CCM_ROUND_TYPE` | `VARCHAR2(2)` | Nullable | Rounding Type lookup value |
| `CCM_ROUND_VALUE` | `NUMBER(8,5)` | Nullable | Rounding Value numeric input |
| `CCM_APPL_CURR_TYPE` | `VARCHAR2(2)` | Nullable | Applicable Currencies lookup value |
| `CCM_DFLT_EST_CLO_REASON_CODE` | `VARCHAR2(12)` | Nullable | Dflt Estimate Close Reason lookup value |
| `CCM_DFLT_RECV_DEDU_CODE` | `VARCHAR2(12)` | Nullable | Dflt Recovery Code for Dedl lookup value |
| `CCM_PRNT_BEF_APPR_YN` | `VARCHAR2(1)` | Nullable | Print Before Approval Y/N |
| `CCM_RE_PRNT_YN` | `VARCHAR2(1)` | Nullable | RePrint Allowed Y/N |
| `CCM_CLM_ACNT_DOC_GEN_YN` | `VARCHAR2(1)` | Nullable | Claim A/c Doc Gen Y/N |
| `CCM_CLM_COINS_ACNT_DOC_GEN_YN` | `VARCHAR2(1)` | Nullable | Sharing Clms A/c Doc Gen Y/N |
| `CCM_ACTIVE_YN` | `VARCHAR2(1)` | Nullable | Active Y/N; defaults to Y on Add |
| `CCM_CR_BY` | `VARCHAR2(12)` | Nullable | `ADMIN` on insert |
| `CCM_CR_DT` | `DATE` | Nullable | Oracle `SYSDATE` on insert |
| `CCM_UP_BY` | `VARCHAR2(12)` | Nullable | NULL on insert; `ADMIN` on update |
| `CCM_UP_DT` | `DATE` | Nullable | NULL on insert; Oracle `SYSDATE` on update |

#### Child table — `IIRIS_RD_DEVP.BRM_CCM_PROD`

Primary key: `(CCMP_CCM_CODE, CCMP_CODE)`. `CCMP_CCM_CODE` associates a child with the parent's `CCM_CODE`; `CCMP_CODE` stores the selected product code.

| Database column | Oracle type | Nullability | Source / behavior |
|---|---|---|---|
| `CCMP_CCM_CODE` | `VARCHAR2(12)` | NOT NULL | Current parent CCM code |
| `CCMP_CODE` | `VARCHAR2(12)` | NOT NULL | Selected Product Code from `LI_TYPE = 'CCM_PRODUCT'` |
| `CCMP_CR_BY` | `VARCHAR2(12)` | Nullable | `ADMIN` on insert |
| `CCMP_CR_DT` | `DATE` | Nullable | Oracle `SYSDATE` on insert |
| `CCMP_UP_BY` | `VARCHAR2(12)` | Nullable | NULL on insert; `ADMIN` on update |
| `CCMP_UP_DT` | `DATE` | Nullable | NULL on insert; Oracle `SYSDATE` on update |

### Lookup Mapping

All rows are sourced from `IIRIS_RD_DEVP.STD_LIST_ITEM`. The mapping below preserves the user-provided types exactly.

| Form field | Stored database column | `LI_TYPE` |
|---|---|---|
| Module Name | `CCM_MODULE` | `CCM_MODULE` |
| Posting Type | `CCM_ACNT_POSTING_TYPE` | `CCM_POST_TYPE` |
| Exchange Rate Type | `CCM_ACNT_EXCH_RATE_TYPE` | `CCM_EXCH_RATE` |
| Rounding Type | `CCM_ROUND_TYPE` | `CCM_ROUND_TYPE` |
| Applicable Currencies | `CCM_APPL_CURR_TYPE` | `CCM_CURR_TYPE` |
| Dflt Estimate Close Reason | `CCM_DFLT_EST_CLO_REASON_CODE` | `CCM_CLO_REASON` |
| Dflt Recovery Code for Dedl | `CCM_DFLT_RECV_DEDU_CODE` | `CCM_DFLT_RECV_DEDU` |
| Applicable Products — Product Code | `CCMP_CODE` | `CCM_PRODUCT` |

For each applicable `LI_TYPE`, `STD_LIST_ITEM.LI_CODE` is the option value persisted by the form and `STD_LIST_ITEM.LI_DESC` is its displayed description.

### Acceptance Criteria

- **AC-001**: Given Master navigation is available, when the user selects Claim Configuration Master, then the listing displays the four required CCM columns and conventional actions.
- **AC-002**: Given the listing is open, when the user filters by one or more data columns, then all filters use the existing six operators, ignore case, combine with AND, and apply before server-side pagination.
- **AC-003**: Given the listing is open, when the user pages or changes page size, then the default is 10 and the choices are 10, 15, 20, and 50.
- **AC-004**: Given a user selects Add, when the Add page opens, then it is separate from the listing and does not show company code as a field.
- **AC-005**: Given a user expands More, when the section opens, then Arabic name, Arabic short name, and Active Y/N are displayed; Active defaults to Y on Add.
- **AC-005a**: Given a new parent form is opened, then Print Before Approval, RePrint Allowed, Claim A/c Doc Gen, and Sharing Clms A/c Doc Gen default to N.
- **AC-006**: Given CCM Code or Claim Config Name is missing, when Save is selected, then a field-level required error appears and no parent is persisted; every other input may be left blank.
- **AC-007**: Given string or numeric input exceeds the database constraints, when Save is selected, then the field is rejected without silent truncation or rounding.
- **AC-008**: Given all supplied lookup types, when their dropdowns load, then the selected lookup source uses the exact listed `LI_TYPE` and lookup failures are reported.
- **AC-009**: Given a valid, unique Add form, when Save succeeds, then the parent uses company code `CCM001`, audit values `ADMIN`/`SYSDATE`, and the Applicable Products section appears on the same detail page.
- **AC-010**: Given a CCM code conflicts with the unique index, when Add is attempted, then the existing record is unchanged and a clear duplicate message appears.
- **AC-011**: Given an Edit form is opened, when valid changes are saved, then the selected record identity and original creation audit values are preserved and update audit values are `ADMIN`/`SYSDATE`.
- **AC-012**: Given a user changes form values and selects Reset, then Add restores initial values/defaults and Edit restores the original loaded values.
- **AC-013**: Given the child section is displayed, when Add is selected, then a modal opens with Product Code, Save, and Reset and its product options use `LI_TYPE = 'CCM_PRODUCT'`.
- **AC-014**: Given a valid product mapping is saved, when insertion succeeds, then its code and lookup name/description appear in the refreshed list and the mapping belongs to the selected parent.
- **AC-015**: Given a duplicate product mapping is submitted, when frontend or backend validation detects it, then no duplicate row is created and a clear error is shown.
- **AC-016**: Given parent or child persistence fails, when the operation completes, then the user sees actionable feedback and no failed operation is reported as successful.
- **AC-017**: Given the feature is delivered, when Codes Master and Document Setup regression tests run, then their existing behavior remains unchanged.
- **AC-018**: Given a child mapping is edited, when the user saves a valid product selection, then only that mapping is updated, the listing refreshes, and creation audit values remain unchanged.
- **AC-019**: Given a parent has product mappings, when Delete is attempted, then the parent remains and a clear explanation is shown.
- **AC-020**: Given a parent has no product mappings, when Delete is confirmed, then the parent is deleted; cancelling confirmation leaves it unchanged.
- **AC-021**: Given a child mapping is deleted, when Delete is confirmed, then only that mapping is removed; cancelling confirmation leaves it unchanged.
- **AC-022**: Given a parent changes after it was loaded for editing, when the user saves stale values, then the update is rejected, newer data is preserved, and the user is asked to reload.
- **AC-023**: Given a product mapping changes after it was loaded for editing, when the user saves stale values, then the update is rejected, newer data is preserved, and the user is asked to reload.
- **AC-024**: Given the user enters only Claim Config Code and Claim Config Name, when Save succeeds, then all blank optional values are stored as NULL and the saved record is displayed.
- **AC-025**: Given the user is editing a CCM record, when the Add action immediately before Back is selected, then a separate fresh Add page opens with default values.
- **AC-026**: Given the user is on the CCM Add page with entered values, when the header Add action is selected, then the form is cleared and all initial defaults are restored.
- **AC-027**: Given the user opens a saved CCM with Applicable Products, when they filter by Product Code and/or Product Name, then the loaded child rows match all case-insensitive filters using the existing six operators, and row actions use the Codes Master edit and delete icons.

### Validation and Testing Requirements

- Required-field tests proving only `CCM_CODE` and `CCM_NAME` are required, and nullable-field tests for the approved optional parent columns.
- Database length tests for all mapped string fields, including actual Oracle length semantics and no silent truncation.
- `NUMBER(8,5)` boundary, scale, invalid numeric, and representability tests.
- Toggle mapping tests proving UI states persist as `Y` or `N` and Active defaults to `Y`.
- Duplicate parent code tests, including backend conflict handling.
- Duplicate product mapping tests in frontend and backend, including the composite child key.
- Lookup success, empty-result, and error tests for every exact `LI_TYPE`, including `CCM_DFLT_RECV_DEDU` and `CCM_PRODUCT`.
- Lookup tests MUST prove inactive rows are unavailable for new selections and a saved inactive value remains visible during edit.
- Parent insert, retrieval, update, duplicate, and guarded-delete behavior tests; child insert, retrieval, update, duplicate, and delete behavior tests.
- Stale parent and child update tests proving concurrent changes are rejected without overwriting the newer values.
- Audit tests for ADMIN and database `SYSDATE` on parent and child inserts/updates, including preservation of creation values and NULL update values on insert.
- Listing tests for all filters, case-insensitive matching, AND combination, sorting, page sizes, and server-side pagination.
- Applicable Products filter tests for both columns, all six operators, case-insensitive matching, AND combination, and reset/empty results.
- Angular tests for forms, modal reset, validation, and operation states; API tests following existing xUnit conventions; end-to-end coverage following existing Playwright conventions.
- Regression tests for Codes Master and Document Setup.

### Error Handling

- Lookup, listing, create, update, and child-insert failures MUST be visible and actionable; no failure may appear as a successful empty result.
- Duplicate parent and child requests MUST be rejected without changing existing data.
- Validation errors MUST identify affected fields; server-side validation remains authoritative.
- API errors MUST follow the existing ProblemDetails convention and MUST NOT expose stack traces or raw internal exception details.
- The UI MUST follow the existing global HTTP error-handling and feedback conventions rather than showing raw server messages.

### Non-Functional Requirements

- Preserve the current Angular, .NET, Oracle, authorization, and OpenAPI-generation architecture; add no framework or dependency.
- Use the existing Oracle connection and parameterized database operations.
- Keep all page and modal controls keyboard-operable, visibly focused, labelled, and consistent with existing responsive layouts.
- Keep errors and status feedback understandable and accessible.
- Maintain Codes Master and Document Setup behavior; the CCM feature MUST NOT modify their functionality.
- No database objects or schema changes are allowed.

### Key Entities

- **Claim Configuration**: Parent record identified by `(CCM_COMP_CODE, CCM_CODE)`, with `CCM_COMP_CODE` fixed to `CCM001` and `CCM_CODE` additionally subject to a unique index.
- **Applicable Product Mapping**: Child record linking a parent CCM code to a selected product code, identified by `(CCMP_CCM_CODE, CCMP_CODE)`.
- **Standard List Item**: Existing lookup row selected by `LI_TYPE`, with `LI_CODE` as the option value and `LI_DESC` as its display description.

### Success Criteria

- **SC-001**: Users can find CCM records through any supported column filter and receive only records satisfying every active filter.
- **SC-002**: Users can navigate the entire filtered result set using the existing page sizes, with filtering applied before paging.
- **SC-003**: Every valid parent Add or Edit operation persists the exact submitted values, uses the fixed company code, and records the required audit values.
- **SC-004**: Parent and child create, edit, and delete operations affect only the selected records; duplicate parent codes and parent/product pairs are never persisted, and parent deletion is blocked while children exist.
- **SC-005**: Lookup and persistence failures are distinguishable from empty successful results and are communicated without exposing internal exception details.
- **SC-006**: Existing Codes Master and Document Setup regression suites pass without behavior changes.

## Assumptions

- The existing Codes Master conventions are authoritative for filter operators, case handling, combined-filter logic, sorting, pagination defaults, page sizes, and visual behavior.
- The user-provided column definitions and key/index declarations are authoritative; no additional database constraints or columns are assumed.
- No extra business restriction is applied to Rounding Value beyond the representable Oracle `NUMBER(8,5)` limits.
- All four Y/N toggle values are stored as literal `Y` or `N` and default to N on Add; Active Y/N defaults to Y.
- A child record can only be added after its parent has been successfully persisted.
- Dflt Recovery Code for Dedl uses `LI_TYPE = 'CCM_DFLT_RECV_DEDU'`, and Applicable Products uses `LI_TYPE = 'CCM_PRODUCT'`, as supplied by the owner.
- Changing a child product code during Edit updates the selected mapping's key; duplicate target keys are rejected.
- Parent deletion is allowed only after all child mappings have been deleted. Child deletion requires explicit confirmation.
- The project constitution and current Codes Master and Document Setup specifications are the conventions to follow; this feature does not amend them.

## Clarifications Resolved Before Planning

- **Lookup option mapping**: `STD_LIST_ITEM.LI_CODE` supplies dropdown values and `STD_LIST_ITEM.LI_DESC` supplies displayed descriptions.
- **Toggle defaults**: Print Before Approval, RePrint Allowed, Claim A/c Doc Gen, and Sharing Clms A/c Doc Gen default to N; Active Y/N defaults to Y.
- **Child operations**: Applicable Product mappings support Add, Edit, and Delete. Editing changes the selected mapping and its product code, subject to composite-key duplicate validation.
- **Parent deletion**: Parent deletion is allowed only when no Applicable Products mappings exist; deletion requires confirmation.
