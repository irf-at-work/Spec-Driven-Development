# Feature Specification: Claim Configuration Master (CCM)

**Feature Branch**: `[003-claim-config-master]`

**Created**: 09-Nov-2026

**Status**: Draft — master data and product associations are defined; transaction-time selection and exception behavior are deferred

**Input**: User description: Maintain Claim Configuration Master data and its many-to-many association with products so claim processing can use the configuration associated with a policy's product.

**Consumer example**: John is processing a life insurance claim. The policy identifies the life insurance product. The product's CCM association lets the claim process locate the claim setup configured for that product, such as its accounting and document-generation settings. John should work with the configuration associated with the policy's product, rather than an unrelated product's setup. This example explains the purpose of the product association; it does not define how a transaction chooses when the product has multiple CCM links.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find and browse CCM configurations (Priority: P1)

As a master-data employee, I want to filter and sort the CCM list so that I can find the relevant configuration without scanning unrelated records.

**Why this priority**: Employees need to find the correct configuration quickly while maintaining a product's claim setup.

**Independent Test**: Add enough CCM records to span multiple pages, then filter and sort by list columns and verify matching records across the full result set.

**Acceptance Scenarios**:

1. **Given** CCM records exist, **When** an employee opens the list, **Then** it shows 10 records by default, offers page sizes of 10, 25, and 50, initially sorts by CCM Code, and provides page navigation.
2. **Given** the CCM list is open, **When** it appears, **Then** there is no global search box or Company Code display; every visible data column (CCM Code, Claim Config Name, Short Name, Module Name, and Status) has its own filter, while the Actions column has none.
3. **Given** a text-column filter is used, **When** the employee selects an operator, **Then** the available operators are starts with, ends with, contains (default), equals, and not equals. Status offers Active or Inactive with equals and not equals.
4. **Given** matching records exist across pages, **When** the employee applies filters, **Then** all filters combine, ignore letter case, match typed characters literally, and apply to the full result set before paging. A blank filter is ignored, and not equals also includes records with an empty value.
5. **Given** the employee changes a filter or sort order, **When** the change is applied (filters refresh 500 ms after typing stops), **Then** the list returns to page 1 and reflects the updated full result set.
6. **Given** records span multiple pages, **When** the employee sorts by CCM Code, Claim Config Name, Short Name, or Module Name, **Then** the full filtered result set is sorted without regard to letter case, with Company Code and CCM Code as deterministic tie-breakers.
7. **Given** active and inactive CCM records exist, **When** the list is viewed, **Then** both remain visible with their status shown unless a Status filter excludes one.

### User Story 2 - Maintain claim configurations (Priority: P1)

As a master-data employee, I want to create, view and update a claim configuration so that each product can be associated with the claim setup intended for it.

**Why this priority**: Product associations are useful only when the corresponding claim configurations can be maintained and kept current.

**Independent Test**: Create a configuration with its required identity and name, open it, update an editable setting, and verify the saved values.

**Acceptance Scenarios**:

1. **Given** an employee creates a CCM, **When** they provide CCM code and Claim Config Name, **Then** the record is saved using the Company Code supplied by the application context if the CCM code is not already in use.
2. **Given** a CCM has been saved, **When** an employee opens it, **Then** the stored configuration and its product associations are shown.
3. **Given** a saved CCM is open, **When** an employee updates its settings and saves, **Then** the updated settings are shown on reopening.
4. **Given** a CCM code is already used under any company code, **When** an employee tries to create another CCM with that code, **Then** the duplicate CCM code is rejected and no second record is created.
5. **Given** a CCM is open for update, **When** the employee views or edits it, **Then** Company Code is supplied by the application context and is not an employee-editable field.
6. **Given** a CCM has second-language name values, **When** the employee views or edits it, **Then** those values are shown right-to-left and their text and spacing remain unchanged when saved.
7. **Given** a CCM is open for update, **When** the employee attempts to change its CCM code, **Then** the CCM code remains unchanged.
8. **Given** an employee enters a CCM Code, **When** they save the new CCM, **Then** the code is limited to 1–12 letters, digits, or hyphens and is saved in uppercase; Company Code is supplied by the application context.
9. **Given** an existing CCM has a setting whose choice is now inactive, **When** the employee edits the CCM without changing that setting, **Then** the current value remains displayed and is saved unchanged, while new choices contain active values only.
10. **Given** a CCM save fails validation, **When** the form is submitted, **Then** the affected fields are identified with correction guidance and the entered values remain available for correction.
11. **Given** a CCM is created or updated, **When** the saved record is retrieved, **Then** its creation and update user/date audit values are retained according to the project audit convention.
12. **Given** an employee starts a new CCM, **When** the form opens or a create request omits Rounding Value, **Then** Rounding Value defaults to zero (`0.00000` at the field's five-decimal scale).
13. **Given** an employee enters a negative Rounding Value, **When** they submit the form or API request, **Then** the value is rejected and a field-level correction message is shown.
14. **Given** a saved CCM is open for editing, **When** the employee selects the Add Claim Configuration icon immediately to the left of Back, **Then** a blank create form opens without changing the current CCM; if the current CCM has unsaved changes, the employee is asked whether to discard them first.

### User Story 3 - Associate products with CCM configurations (Priority: P1)

As a master-data employee, I want to maintain the Applicable Products for a saved CCM from its view or edit page so that a claim opened for a policy can be associated with the setup belonging to that policy's product.

**Why this priority**: The product-to-CCM link is the relationship claim processing uses to identify applicable configuration data.

**Independent Test**: Create a CCM, add products in its Applicable Products section, verify the product code and name rows, remove an association, and verify duplicate product codes are not linked twice.

**Acceptance Scenarios**:

1. **Given** an employee has saved or opened a CCM, **When** the CCM page is shown, **Then** an Applicable Products section appears at the bottom with an Add button and a table containing Product Code, Product Name, and Action columns.
2. **Given** the Applicable Products section is open, **When** the employee selects Add, **Then** a modal titled “Available Products” opens with one required “Product Code” dropdown whose options show product code, type, and description in that order.
3. **Given** the employee selects a product and saves the modal, **When** the association is saved, **Then** its row appears in the table with the product code, type and description-based product name, and a Delete button in the Action column.
4. **Given** a product code is already associated with the CCM, **When** the employee attempts to add that code again, **Then** the duplicate is rejected and only one association remains.
5. **Given** a product association is shown in the table, **When** the employee chooses its Delete action and confirms, **Then** that product-to-CCM association is removed while the CCM and other product associations remain.
6. **Given** more than five product associations exist, **When** the Applicable Products table is viewed, **Then** it initially shows five rows per page and provides pagination; this page size does not apply to the product choices in the Add modal.
7. **Given** a CCM may serve multiple products, **When** an employee links another product to it, **Then** both product associations are retained.
8. **Given** a product may use multiple CCM configurations, **When** an employee links another CCM to it, **Then** both CCM associations are retained.
9. **Given** a product ID is provided, **When** its CCM associations are retrieved, **Then** the linked CCM code or codes and corresponding configuration records can be identified. This specification does not define claim transaction behavior or choose between multiple associated configurations.
10. **Given** an employee has selected a product in the Available Products modal and has not saved the association, **When** they try to close the modal, **Then** the system asks for confirmation; choosing to cancel the close keeps the modal open with the selected product, while confirming the close discards the unsaved selection.
11. **Given** available products span multiple pages, **When** an employee opens or pages through the Product Code dropdown, **Then** they can retrieve choices across the full result set using pagination, with 10 choices per page by default.

### User Story 4 - Activate or deactivate configurations (Priority: P2)

As a master-data employee, I want to deactivate and reactivate a CCM so that its availability can be managed without losing its configuration or product links.

**Why this priority**: The master needs a reversible way to manage configuration availability while preserving historical setup and associations.

**Independent Test**: Deactivate a saved CCM, verify it is marked inactive and retained, then reactivate it and verify its status.

**Acceptance Scenarios**:

1. **Given** a CCM is active, **When** the employee deactivates it and saves, **Then** the CCM remains stored and is marked inactive.
2. **Given** a CCM is inactive, **When** the employee activates it and saves, **Then** it is marked active again.
3. **Given** a CCM is deactivated, **When** its product associations are viewed, **Then** those associations remain stored; transaction behavior for an inactive CCM is outside this feature.

### User Story 5 - Import claim configurations from Excel (Priority: P2)

As a master-data employee, I want to import claim configurations and their product associations from an Excel workbook so that migration or initial setup can load many records without entering them one at a time.

**Independent Test**: Download the template, upload valid CCM rows and product links with invalid and duplicate examples, inspect the preview, confirm the import, and verify inserted/skipped counts and links.

**Acceptance Scenarios**:

1. **Given** the employee opens the CCM list, **When** they choose Import or Download Template, **Then** the system provides an `.xlsx` template with a `CCM` sheet for CCM fields and an optional `PRODUCT_LINKS` sheet containing CCM Code and Product Code columns; Company Code is not imported and is supplied by application context.
2. **Given** the employee uploads an `.xlsx` workbook up to 5 MB containing at most 1,000 total data rows across both sheets, **When** it is parsed, **Then** a preview reports row-level validation for both sheets before any database writes occur.
3. **Given** a CCM row has a missing required field, invalid code, negative rounding value, over-limit value, invalid choice code, or duplicate CCM Code within the workbook, **When** the preview is shown, **Then** the row is identified as invalid and import cannot proceed while invalid rows remain.
4. **Given** a CCM Code already exists in the database, **When** its row is previewed, **Then** it is marked skipped and the existing CCM is not updated; valid product-link rows referencing that existing CCM can still be imported.
5. **Given** a product-link row references a CCM not present in the database or the workbook, a product not present in the approved active product choices, or a duplicate `(CCM Code, Product Code)` within the workbook, **When** the preview is shown, **Then** the row is identified and the import cannot proceed while invalid rows remain.
6. **Given** a valid product link already exists, **When** the preview is shown, **Then** it is marked skipped and the existing association is unchanged.
7. **Given** the preview has no invalid rows, **When** the employee confirms import, **Then** the server revalidates the workbook and inserts new CCMs and links atomically, and a summary reports inserted and skipped CCM and link counts.
8. **Given** the employee cancels import or a validation/database error occurs, **When** the operation ends, **Then** no partial CCM or product-link import is committed.

## Clarifications

### Session 2026-11-09

- Q: Should the CCM feature follow the interaction conventions of the Vehicle Make Master and Premium Adjustment Master? → A: Yes. Reuse their established master-data interaction conventions.
- Q: Which CCM settings should use dropdown choices from existing master lists? → A: All code/type settings use dropdowns. The source and field mapping for each setting still need to be confirmed.
- Q: Should dropdowns use active entries from the approved choice sources? → A: Yes. Use active choices; confirm the source and field mapping during read-only planning review.
- Q: How should an existing inactive dropdown value behave during edit? → A: Keep and display the current inactive value when it has not changed, but do not offer it for new selections.
- Q: Which page sizes should the CCM list offer? → A: Default to 10 and allow 10, 25, or 50.
- Q: Should the setting-to-choice mappings be left for read-only lookup-data review during planning? → A: Yes. Confirm them during planning before implementation.
- Q: How should the specification handle field rules that have not yet been provided? → A: Provide per-field rules where known. The supplied dropdown codes and descriptions are recorded below; unspecified business validation is not inferred.
- Q: Do A (Average), S (Selling), and B (Buying) belong to Accounting Exchange-Rate Type? → A: Yes. They are Accounting Exchange-Rate Type choices (`CCM_ACNT_EXCH_RATE_TYPE`).
- Q: What values and defaults apply to print-before-approval, reprint, and the accounting document flags? → A: They accept `Y` or `N`; Print Before Approval Yn and RePrint Allowed default to `N`; both accounting-document flags default to `Y`.
- Q: What numeric behavior does `CCM_ROUND_VALUE` control? → A: It is a numeric value, for example `2.000`.
- Q: Are any fields besides company code, CCM code, and CCM name mandatory? → A: No. Those are the only required database fields; the employee supplies CCM Code and Claim Config Name, while Company Code is assigned from application context. All other configuration fields are optional.
- Q: Should `CCM_NAME` and `CCM_SHORT_NAME` use the same English text normalization as the other two master features? → A: They must be uppercase regardless of whether the user enters lowercase, mixed case, or uppercase text.
- Q: Should `CCM_NAME_L2` and `CCM_SHORT_NAME_L2` be treated as Arabic fields—shown right-to-left and preserved exactly as entered? → A: Yes. Show them right-to-left and preserve their text and spacing exactly.
- Q: Should `CCM_CODE`, like `CCM_COMP_CODE`, be locked after a CCM is created? → A: Yes. Both key fields are immutable after creation.
- Q: Should employees type Company Code on the CCM form, or select it from an existing company list? → A: Superseded by the clarified application-context rule below.
- Q: Should Company Code and CCM Code follow the Premium Adjustment key rule: 1–12 letters, digits, or hyphens, saved in uppercase? → A: The employee-entered CCM Code follows the 1–12 character rule and is saved in uppercase. Company Code is supplied by application context and is not entered on the form.
- Q: Can the same CCM Code be used under different Company Codes? → A: No. CCM Code is globally unique across all Company Codes so a product mapping can identify one configuration.
- Q: Where does Company Code come from when an employee creates or maintains a CCM? → A: Derive it from the logged-in user's company when login/session identity is available. This test environment has no user identity, so use the fixed configured Company Code `ASRTEST`; do not ask the employee to enter it.
- Q: How should the employee maintain a CCM's product associations? → A: On a saved CCM's view or edit page, use an Applicable Products section at the bottom, with an Add button, a three-column product table, and an Available Products modal with one required product dropdown. Show five table rows per page initially; do not allow duplicate product codes.
- Q: Does the initial five-item page size apply to the linked-products table, the available-products choices, or both? → A: The linked-products table only.
- Q: What should happen if an employee closes the Available Products modal after selecting a product but before saving? → A: Ask for confirmation; cancelling the close keeps the modal open and retains the selection, while confirming discards the unsaved selection.

- **Deferred for planning — Choice source mappings**: Read-only data review must identify the approved choice source and field mapping for each CCM setting before implementation.
- Transaction behavior for missing product mappings, inactive CCMs, and multiple linked CCMs is explicitly deferred to the later transaction discussion; this feature does not resolve those cases.

## Edge Cases

- A CCM Code already exists under any Company Code; the second create must be rejected.
- The same product-to-CCM association is submitted more than once; only one association may exist for that pair.
- One CCM is linked to multiple products, and one product is linked to multiple CCMs; all distinct links must be retained.
- Company Code is supplied by application context and cannot be edited on the CCM form.
- An employee tries to close the Available Products modal after selecting a product but before saving; prompt for confirmation and retain the selected product if the employee cancels closing.
- An employee attempts to add a product code already linked to the same CCM; the duplicate association must be rejected.
- More than five product associations exist; the Applicable Products table must paginate from an initial page size of five.
- A product has no CCM link, or linked CCM data is inactive; this feature stores the relevant master data and links but does not define claim transaction behavior for these cases.
- A user leaves a form with unsaved changes; the user is asked to confirm before changes are discarded.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow an employee to create, view and update CCM records.
- **FR-002**: The system MUST identify a CCM by the combination of company code and CCM code and MUST prevent duplicate composite keys. Global CCM Code uniqueness is specified by FR-038.
- **FR-003**: The system MUST require employees to enter CCM Code and Claim Config Name when creating a CCM. When user identity is available, the system MUST derive Company Code from the logged-in user's company and MUST NOT ask employees to enter it. In the current test environment, where no user identity exists, the application MUST use the fixed configured Company Code `ASRTEST`.
- **FR-004**: The system MUST prevent either company code or CCM code from being changed after the CCM is created. See FR-029 for how these keys are supplied and formatted.
- **FR-005**: The system MUST maintain the CCM identity, names, optional configuration settings, active status, and creation/update audit information described in the CCM data model. Field names and supplied storage types and capacities are recorded in `data-model.md` and MUST NOT by themselves be treated as user-facing validation rules.
- **FR-006**: The system MUST allow maintenance of the additional CCM fields listed in FR-005 as optional fields. Field-specific limits and validation MUST follow confirmed rules in this specification; column types and sizes constrain storage but MUST NOT be used alone to infer user-facing validation. Lookup-type mappings are a planning review gate.
- **FR-007**: The system MUST allow an employee to create, view and remove a product-to-CCM association as part of master-data maintenance.
- **FR-008**: Each product-to-CCM association MUST be unique by product ID and CCM code; duplicate associations MUST be rejected. This is the normative duplicate-link rule; see FR-033 for the UI behavior.
- **FR-009**: A CCM MUST be linkable to one or more products, and a product MUST be linkable to one or more CCM configurations.
- **FR-010**: The system MUST retain creation and update user/date audit information for CCM records and product associations.
- **FR-011**: The system MUST allow an employee to deactivate and reactivate a CCM while retaining its data and product associations.
- **FR-012**: The CCM list MUST identify active and inactive configurations, and users MUST be able to view inactive configurations.
- **FR-013**: The system MUST make a product's CCM associations retrievable by product ID, with each linked CCM code identifying its corresponding CCM configuration. Selecting among multiple links is outside this feature.
- **FR-014**: The system MUST NOT define claim behavior for a missing product mapping, an inactive CCM, or selection among multiple linked CCMs; those rules are deferred to the transaction discussion.
- **FR-015**: The system MUST ask the user to confirm before discarding unsaved changes from a CCM form or the Available Products modal. If the employee cancels closing the modal, it MUST remain open with the selected product retained; if they confirm, it MUST close and discard the unsaved selection.
- **FR-016**: The feature MUST NOT implement policy-specific claim rules, claim transaction behavior, or payout calculation.
- **FR-017**: The system MUST validate required fields and values according to confirmed rules. Where no business rule is defined, the system MUST NOT infer one from field names alone.
- **FR-018**: The CCM list and maintenance interactions MUST follow the established UI conventions of the Vehicle Make Master and Premium Adjustment Master, including paged lists, column-based filtering, consistent notifications, breadcrumbs, accessible action labels, and unsaved-change confirmation.
- **FR-019**: When a user submits invalid information, the system MUST identify the affected field and explain how to correct it. When a save fails, the system MUST show a clear message and keep entered values available for correction or retry.
- **FR-020**: The module, accounting posting type, accounting exchange-rate type, rounding type, applicable currency type, default estimated closure reason code, and default recovery deduction code MUST be selected from approved active choices. Each choice MUST show its code and description, and the selected code MUST be saved. The source and field mapping for each choice MUST be confirmed by read-only review before implementation. When editing a CCM whose current choice is no longer active, the UI MUST retain and display that choice if unchanged, but MUST NOT offer it for a new selection. Choice pagination follows FR-037. Company Code and CCM Code identify the CCM and are not setting choices.
- **FR-021**: The CCM list MUST be paged, default to 10 records per page, and allow page sizes of 10, 25, or 50 records, following the Vehicle Make list convention.
- **FR-022**: The print-before-approval, reprint, claim accounting document generation, and claim coinsurance accounting document generation flags MUST accept only `Y` or `N` and MUST be presented as checkboxes. Print-before-approval and reprint MUST default to `N`; the two accounting document generation flags MUST default to `Y` when a CCM is created.
- **FR-023**: Rounding Value MUST accept numeric values, including `2.000`; its create default is specified in FR-042 and its allowed range is specified in FR-043. Storage capacity is documented in `data-model.md` and does not define user-facing validation.
- **FR-024**: The UI MUST label `CCM_NAME` as “Claim Config Name” and `CCM_SHORT_NAME` as “Short Name”. The system MUST convert both values to uppercase regardless of input casing and MUST display and save them in uppercase.
- **FR-025**: The CCM list MUST NOT offer a global search box or display Company Code. Each visible data column (CCM Code, Claim Config Name, Short Name, Module Name, Status) MUST have its own filter; the Actions column MUST NOT have a filter. Text filters MUST offer starts with, ends with, contains (default), equals, and not equals. Status MUST offer Active or Inactive with equals and not equals.
- **FR-026**: CCM filters MUST ignore letter case, combine so a record must match all supplied filters, apply across all records before pagination, treat typed characters literally, ignore blank filter values, include empty values for not equals, and update 500 ms after typing stops. Changing a filter or sort MUST return the list to page 1.
- **FR-027**: The CCM list MUST allow sorting by CCM Code, Claim Config Name, Short Name, and Module Name across all filtered records, ignoring letter case. Initial order MUST be CCM Code ascending; ties MUST resolve consistently by Company Code then CCM Code.
- **FR-028**: `CCM_NAME_L2` and `CCM_SHORT_NAME_L2` MUST be displayed right-to-left and preserved exactly, including their spacing; the system MUST NOT uppercase or otherwise normalize these values.
- **FR-029**: Employee-entered CCM Code MUST contain 1–12 letters, digits, or hyphens and MUST be saved in uppercase. Company Code MUST be supplied by the application context, not entered or edited by the employee, as specified in FR-003. Key immutability is specified in FR-004 and global CCM Code uniqueness in FR-038.
- **FR-030**: After a CCM is saved, its view and edit page MUST show an Applicable Products section at the bottom of the page with an Add button and a table with Product Code, Product Name, and Action columns. The Add action is available when CCM writes are enabled; available choices are read from active `STD_LIST_ITEM` rows of type `CCM_PRODUCT` as defined in FR-036.
- **FR-031**: The Add action MUST open a modal titled “Available Products” containing one required dropdown labeled “Product Code”. Each option MUST show the product code, type, and description in that order. Choice pagination follows FR-037.
- **FR-032**: Each saved product association MUST appear in the Applicable Products table with its product code, product name formed from its type and description, and a Delete button in the Action column.
- **FR-033**: The Applicable Products UI MUST communicate duplicate-link rejection and show no duplicate row; the normative uniqueness and rejection rule is FR-008.
- **FR-034**: The Delete action MUST remove only the selected product-to-CCM association after employee confirmation; it MUST NOT delete the CCM or other product associations.
- **FR-035**: The Applicable Products table MUST show five associations per page initially and provide pagination when more rows exist. This page size applies only to the linked-products table, not the product choices in the Add modal. No other page-size options are specified.
- **FR-036**: Product choices MUST come from `STD_LIST_ITEM` rows where `LI_TYPE = 'CCM_PRODUCT'`, `LI_CODE` is the product code, `LI_DESC` is the product description, and `LI_ACTIVE_YN = 'Y'`; this mapping is the owner's approved replacement for a product master. The eligible row count is data-dependent and MUST be returned by the paginated query; an empty list means product choices must be seeded before a product can be linked. The seven CCM setting-choice source and active code-description sets remain subject to read-only review; missing or conflicting choices MUST remain unresolved and block only their dependent implementation. Record evidence and unresolved decisions in `research.md` and `data-model.md`.
- **FR-037**: The CCM setting-choice control and Available Products choice control MUST each show 10 choices per page initially and let employees retrieve choices on subsequent pages until the full available result set can be reached.
- **FR-038**: The system MUST enforce global uniqueness of CCM Code across Company Codes because the association identifies a configuration by CCM Code. The existing valid unique index on `BRM_CLM_CONFIG(CCM_CODE)` enforces this rule; evidence is recorded in `data-model.md`.
- **FR-039**: Selecting the list's open/eye action for a saved CCM MUST open the established CCM maintenance form in an editable state, where the employee can review and update the record and save changes. The Active field MUST use the established slide-toggle control. Arabic name fields MUST use the established right-to-left text-field presentation and preservation rule in FR-028. This is the CCM-specific view/edit behavior referenced by FR-018.
- **FR-040**: CCM create, view, and edit forms MUST NOT display Company Code or a company name to the employee. The list-screen rule is specified by FR-025; Company Code remains supplied by application context under FR-003 and stored as part of the record identity.
- **FR-041**: The employee MUST confirm before deleting a CCM. The system MUST delete only the selected CCM record and MUST reject deletion while any product association references its CCM Code; it MUST NOT cascade-delete or modify product association rows. This guard is independent of the product-link deletion rule in FR-034.
- **FR-042**: A new CCM MUST default Rounding Value to numeric zero (`0.00000` at the field's five-decimal scale), including when a create API request omits the value.
- **FR-043**: Rounding Value MUST NOT be negative. The form MUST set the numeric input minimum to zero, and the API MUST reject negative values with a `roundingValue` field error.
- **FR-044**: A saved CCM's editable form MUST show an Add Claim Configuration icon immediately to the left of the Back icon, matching feature 001's saved-record form action. Selecting it MUST open a blank create form; pending changes MUST be guarded by the existing unsaved-change confirmation, and cancelling MUST retain the current form and its changes.
- **FR-045**: The CCM list MUST provide an `.xlsx` template and import workflow with a `CCM` sheet for CCM records and an optional `PRODUCT_LINKS` sheet for product associations. Company Code MUST be assigned from application context. The import MUST support at most 1,000 total data rows across both sheets and a 5 MB workbook.
- **FR-046**: Before CCM import, the system MUST preview and validate all rows, including required fields, CCM code format and global uniqueness, non-negative Rounding Value, approved active setting choices, and duplicate CCM codes within the workbook. Invalid rows MUST block import; existing CCM codes MUST be skipped without being overwritten.
- **FR-047**: Before product-link import, the system MUST validate that each CCM is existing or included as a valid new row, each product is an approved active product choice, and each `(CCM Code, Product Code)` pair is unique. Existing links MUST be skipped without changes; duplicate links within the workbook and invalid references MUST block import.
- **FR-048**: The server MUST revalidate all uploaded data and insert all eligible new CCMs and product links in one transaction only after explicit confirmation. Cancellation or any failure MUST leave no partial import, and the result MUST report inserted and skipped counts separately for CCMs and links.

The following code-description pairs are confirmed for setting choices:

| Field | Code | Description |
|---|---|---|
| Module Name | `AV` | Aviation |
| Module Name | `MC` | Marine Cargo |
| Module Name | `LI` | Life |
| Module Name | `LG` | Life Group |
| Accounting Posting Type | `B` | Batch |
| Accounting Posting Type | `O` | Online |
| Accounting Exchange-Rate Type | `A` | Average |
| Accounting Exchange-Rate Type | `S` | Selling |
| Accounting Exchange-Rate Type | `B` | Buying |
| Rounding Type | `CL` | Ceiling |
| Rounding Type | `RD` | Round |
| Rounding Type | `NN` | None |
| Rounding Type | `NI` | Next Integer |
| Rounding Type | `FR` | Floor |
| Applicable Currency Type | `10` | All |
| Applicable Currency Type | `20` | Risk Currencies |
| Default Estimated Closure Reason | `100` | Claim closed successfully |
| Default Estimated Closure Reason | `200` | Additional payment requested |
| Default Estimated Closure Reason | `300` | Wrongly closed by mistake |
| Default Estimated Closure Reason | `400` | Duplicated Claim Entry |
| Default Estimated Closure Reason | `500` | Claim Closed unsuccessfully |
| Default Estimated Closure Reason | `600` | Others |
| Print-before-approval and reprint | `N` | No (create-time default) |
| Claim accounting document generation and claim coinsurance accounting document generation | `Y` | Yes (create-time default) |
| All four flags | `Y` or `N` | Yes or No |

Claim Config Name and Short Name values are stored and displayed in uppercase, regardless of the case entered by the user.

The module choices above are examples and not a complete list. The full active choice lists and their field mappings must be confirmed by read-only review before implementation.

### Key Entities *(include if data involved)*

- **Claim Configuration (CCM)**: A configuration identified by company code and CCM code, containing the claim setup fields, active status, and audit information in FR-005. Its physical column definitions and storage capacities are recorded in `data-model.md`.
- **Product**: An existing product identified by product ID. Products may be associated with multiple CCM configurations.
- **Product-to-CCM Association**: A link between one product ID and one globally unique CCM code, with creation and update audit information. Each product/CCM pair is unique.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All create, view, and update acceptance scenarios pass, and neither identity field changes after creation.
- **SC-002**: Every tested duplicate CCM Code across different Company Codes is rejected, and the persisted CCM count for that code remains one.
- **SC-003**: Every tested distinct product/CCM pair can be linked in both directions, and every tested duplicate pair is rejected.
- **SC-004**: For every tested product ID with stored links, retrieval returns each linked CCM Code and each returned code resolves to its configuration.
- **SC-005**: After each tested deactivate/reactivate cycle, the CCM settings and all associated product links remain unchanged.
- **SC-006**: For every confirmed setting choice, its code and description are displayed, the selected code is saved, and employees can reach all choices across pages of 10.
- **SC-007**: 100% of saved and displayed Claim Config Name and Short Name values are uppercase, regardless of input casing.
- **SC-008**: All specified list acceptance scenarios pass: each visible data column is filterable, supported sort orders apply to the full filtered result set, no global search box is shown, and page sizes 10, 25, and 50 are available.
- **SC-009**: 100% of saved second-language name and short-name values retain their original text and spacing, and are displayed right-to-left.
- **SC-010**: 100% of employee-entered CCM Codes meet the stated format and casing rules; Company Code is assigned from application context, and neither key changes after creation.
- **SC-011**: Traversing all Applicable Products pages exposes every linked product exactly once with its Product Code, Product Name, and Delete action; the initial page contains five rows.
- **SC-012**: Duplicate product links are rejected, and deleting a link removes only that association while retaining the CCM and all other links.
- **SC-013**: Before choice implementation starts, the review record covers 100% of the seven setting-choice fields and the product choice source; each record includes source, display fields, active rule, and the required code-description choices. If any required source, choice, or product count is not confirmed, the related implementation remains blocked and the unresolved item is recorded.
- **SC-014**: For every created or updated CCM and product association in the acceptance tests, all applicable creation and update user/date audit fields contain the expected values; creation values remain unchanged on update and update values reflect the latest change.
- **SC-015**: All 32 acceptance scenarios across the four user stories pass verification.
- **SC-016**: The eye action opens the editable CCM form; its Arabic fields render right-to-left, Active uses the standard slide toggle, and no company code or company name appears on any CCM screen.
- **SC-017**: Deleting a CCM requires confirmation, removes only that CCM when no product link references it, and leaves linked product rows untouched when deletion is blocked.

## Assumptions

- The CCM database primary key is `(company code, CCM code)`. Company Code is sourced from application context (session company when available; configured fixed value `ASRTEST` until login/session support exists), while employees enter CCM Code.
- The product-to-CCM pair is unique, as stated by the known mapping-table primary key `(CCM code, product ID)`; the relationship is many-to-many.
- The field names in the known database structure are represented in stakeholder language in the requirements; they do not, by themselves, establish field validation or dropdown behavior.
- Supplied storage capacities are recorded in `data-model.md`; they are not user-facing character limits. Do not infer text validation from capacity, and confirm multi-byte behavior before claiming character-length guarantees.
- All listed code/type setting fields are dropdowns from active approved choices, per the owner's clarifications. Their individual sources and field mappings must be confirmed by read-only review during planning.
- Product choices use the owner-approved `STD_LIST_ITEM` mapping in FR-036. `CCM_PRODUCT` is a dedicated list type; product codes/descriptions must be seeded there. The current row count has not been independently queried. Dropdown labels show code, type, and description; linked rows show code and type/description as product name.
- Creation and update user/date audit data are recorded for both CCM records and product associations. The user identity source and audit date display rules are not specified here.
- Deactivation/reactivation is in scope. Permanent deletion is allowed only when the CCM has no product associations; product links are never deleted as a side effect.
- The employee experience follows conventions established by the vehicle-make and premium-adjustment master features; this does not supply unresolved CCM field rules or choice mappings.
- Authentication and permissions follow the project constitution and are not specified as part of this feature.
