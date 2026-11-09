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

1. **Given** CCM records exist, **When** an employee opens the list, **Then** it shows 10 records by default, offers page sizes of 10, 25, and 50, initially sorts by Company Code then CCM Code, and provides page navigation.
2. **Given** the CCM list is open, **When** it appears, **Then** there is no global search box; every visible data column (Company Code, CCM Code, Claim Config Name, Short Name, and Status) has its own filter, while the Actions column has none.
3. **Given** a text-column filter is used, **When** the employee selects an operator, **Then** the available operators are starts with, ends with, contains (default), equals, and not equals. Status offers Active or Inactive with equals and not equals.
4. **Given** matching records exist across pages, **When** the employee applies filters, **Then** all filters combine, ignore letter case, match typed characters literally, and apply to the full result set before paging. A blank filter is ignored, and not equals also includes records with an empty value.
5. **Given** the employee changes a filter or sort order, **When** the change is applied (filters refresh 500 ms after typing stops), **Then** the list returns to page 1 and reflects the updated full result set.
6. **Given** records span multiple pages, **When** the employee sorts by Company Code, CCM Code, Claim Config Name, or Short Name, **Then** the full filtered result set is sorted without regard to letter case, with Company Code and CCM Code as deterministic tie-breakers.
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
9. **Given** an existing CCM has a setting whose lookup value is now inactive, **When** the employee edits the CCM without changing that setting, **Then** the current value remains displayed and is saved unchanged, while new choices contain active values only.

### User Story 3 - Associate products with CCM configurations (Priority: P1)

As a master-data employee, I want to maintain the Applicable Products for a saved CCM from its view or edit page so that a claim opened for a policy can be associated with the setup belonging to that policy's product.

**Why this priority**: The product-to-CCM link is the relationship claim processing uses to identify applicable configuration data.

**Independent Test**: Create a CCM, add products in its Applicable Products section, verify the product code and name rows, remove an association, and verify duplicate product codes are not linked twice.

**Acceptance Scenarios**:

1. **Given** an employee has saved or opened a CCM, **When** the CCM page is shown, **Then** an Applicable Products section appears at the bottom with an Add button and a table containing Product Code, Product Name, and Action columns.
2. **Given** the Applicable Products section is open, **When** the employee selects Add, **Then** a modal titled “Available Products” opens with one required “Product Code” dropdown whose options display `LI_CODE - LI_TYPE - LI_DESC`.
3. **Given** the employee selects a product and saves the modal, **When** the association is saved, **Then** its row appears in the table with Product Code shown as `LI_CODE`, Product Name shown as `LI_TYPE - LI_DESC`, and a Delete button in the Action column.
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

## Clarifications

### Session 2026-11-09

- Q: Should the CCM feature follow the UI and API conventions of the Vehicle Make Master and Premium Adjustment Master? → A: Yes. Reuse the same UI and API conventions as those two features.
- Q: Which CCM settings should use dropdown choices from existing master lists? → A: All code/type settings use dropdowns. The source list for each setting still needs to be identified.
- Q: Should the dropdowns use active entries from `STD_LIST_ITEM`, with the specific list type for each field confirmed separately? → A: Yes. Use active `STD_LIST_ITEM` entries; the specific list type for each field remains to be confirmed.
- Q: How should an existing inactive dropdown value behave during edit? → A: Keep and display the current inactive value when it has not changed, but do not offer it for new selections.
- Q: Which page-size behavior should the CCM list API use? → A: Default to 10 and allow 10, 25, or 50.
- Q: Should the dropdown field-to-`LI_TYPE` mappings be left for read-only lookup-data review during planning? → A: Yes. Confirm them during planning before implementation.
- Q: How should the specification handle field rules that have not yet been provided? → A: Provide per-field rules where known. The supplied dropdown codes and descriptions are recorded below; unspecified business validation is not inferred.
- Q: Do A (Average), S (Selling), and B (Buying) belong to Accounting Exchange-Rate Type? → A: Yes. They are Accounting Exchange-Rate Type choices (`CCM_ACNT_EXCH_RATE_TYPE`).
- Q: What values should the print, reprint, and claim accounting document flags accept? → A: They accept `Y` or `N`; their create-time default is `Y`.
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

- **Deferred for planning — Lookup source mappings**: Read-only lookup-data review must identify which `STD_LIST_ITEM.LI_TYPE` supplies each CCM code/type setting before implementation.
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
- **FR-002**: The system MUST identify a CCM by the combination of company code and CCM code, MUST prevent duplicate composite keys, and MUST enforce CCM Code uniqueness across all Company Codes. Because `BRM_CCM_PROD` identifies configurations using CCM Code only, planning MUST verify that the database can enforce this global uniqueness rule.
- **FR-003**: The system MUST require employees to enter CCM Code and Claim Config Name when creating a CCM. When user identity is available, the system MUST derive Company Code from the logged-in user's company and MUST NOT ask employees to enter it. In the current test environment, where no user identity exists, the application MUST use the fixed configured Company Code `ASRTEST`.
- **FR-004**: The system MUST prevent either company code or CCM code from being changed after the CCM is created. See FR-029 for how these keys are supplied and formatted.
- **FR-005**: The system MUST maintain the following CCM data fields with the supplied database types and limits: company code (`VARCHAR2(12 BYTE)`), CCM code (`VARCHAR2(12 BYTE)`), CCM name (`VARCHAR2(100 BYTE)`), short name (`VARCHAR2(30 BYTE)`), second-language name (`VARCHAR2(100 BYTE)`), second-language short name (`VARCHAR2(30 BYTE)`), module (`VARCHAR2(2 BYTE)`), accounting posting type (`VARCHAR2(1 BYTE)`), accounting exchange-rate type (`VARCHAR2(1 BYTE)`), rounding type (`VARCHAR2(2 BYTE)`), rounding value (`NUMBER(8,5)`), applicable currency type (`VARCHAR2(2 BYTE)`), default estimated closure reason code (`VARCHAR2(12 BYTE)`), default recovery deduction code (`VARCHAR2(12 BYTE)`), print-before-approval flag (`VARCHAR2(1 BYTE)`), reprint flag (`VARCHAR2(1 BYTE)`), claim accounting document generation flag (`VARCHAR2(1 BYTE)`), claim coinsurance accounting document generation flag (`VARCHAR2(1 BYTE)`), active status (`VARCHAR2(1 BYTE)`), and creation/update user (`VARCHAR2(12 BYTE)`) and date (`DATE`) audit fields.
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
- **FR-019**: The CCM API MUST follow the established API conventions of the Vehicle Make Master and Premium Adjustment Master, including paginated list results, consistent validation and error responses, and server-side validation. CCM-specific data and behavior MUST follow this specification.
- **FR-020**: The module, accounting posting type, accounting exchange-rate type, rounding type, applicable currency type, default estimated closure reason code, and default recovery deduction code MUST be selected from dropdown choices containing active entries from `STD_LIST_ITEM`. Each dropdown item MUST show its code and description; the selected code is stored. Each field MUST use its confirmed `LI_TYPE`; the field-to-list-type mapping MUST be confirmed through read-only lookup-data review during planning, before implementation. When editing a CCM whose current value is now inactive, the UI MUST retain and display that value if unchanged, but MUST NOT offer it as a new selection. Dropdown pagination follows FR-037. Company code and CCM code identify the CCM and are not setting dropdowns.
- **FR-021**: The CCM list MUST be paged, default to 10 records per page, and allow page sizes of 10, 25, or 50 records, following the Vehicle Make list convention.
- **FR-022**: The print-before-approval, reprint, claim accounting document generation, and claim coinsurance accounting document generation flags MUST accept only `Y` or `N`. Each flag MUST default to `Y` when a CCM is created.
- **FR-023**: `CCM_ROUND_VALUE` MUST be maintained as a numeric value within the supplied `NUMBER(8,5)` column capacity. The example `2.000` is valid. No additional business range or interaction rule with the rounding type is specified.
- **FR-024**: The UI MUST label `CCM_NAME` as “Claim Config Name” and `CCM_SHORT_NAME` as “Short Name”. The system MUST convert both values to uppercase regardless of input casing and MUST display and save them in uppercase.
- **FR-025**: The CCM list MUST NOT offer a global search box. Each visible data column (Company Code, CCM Code, Claim Config Name, Short Name, Status) MUST have its own filter; the Actions column MUST NOT have a filter. Text filters MUST offer starts with, ends with, contains (default), equals, and not equals. Status MUST offer Active or Inactive with equals and not equals.
- **FR-026**: CCM filters MUST ignore letter case, combine so a record must match all supplied filters, apply across all records before pagination, treat typed characters literally, ignore blank filter values, include empty values for not equals, and update 500 ms after typing stops. Changing a filter or sort MUST return the list to page 1.
- **FR-027**: The CCM list MUST allow sorting by Company Code, CCM Code, Claim Config Name, and Short Name across all filtered records, ignoring letter case. Initial order MUST be Company Code ascending then CCM Code ascending, and ties MUST resolve consistently by Company Code then CCM Code.
- **FR-028**: `CCM_NAME_L2` and `CCM_SHORT_NAME_L2` MUST be displayed right-to-left and preserved exactly, including their spacing; the system MUST NOT uppercase or otherwise normalize these values.
- **FR-029**: Employee-entered CCM Code MUST contain 1–12 letters, digits, or hyphens and MUST be saved in uppercase. Company Code MUST be supplied by the application context, not entered or edited by the employee, as specified in FR-003. Key immutability is specified in FR-004 and global CCM Code uniqueness in FR-002.
- **FR-030**: After a CCM is saved, its view and edit page MUST show an Applicable Products section at the bottom of the page with an Add button and a table with Product Code, Product Name, and Action columns.
- **FR-031**: The Add action MUST open a modal titled “Available Products” containing one required dropdown labeled “Product Code”. Each option MUST display `LI_CODE - LI_TYPE - LI_DESC`. Product choices MUST be retrieved through the paginated endpoint in FR-037, and employees MUST be able to retrieve choices on subsequent pages.
- **FR-032**: Each saved product association MUST appear in the Applicable Products table with Product Code displayed as `LI_CODE`, Product Name displayed as `LI_TYPE - LI_DESC`, and a Delete button in the Action column.
- **FR-033**: The Applicable Products UI MUST communicate duplicate-link rejection and show no duplicate row; the normative uniqueness and rejection rule is FR-008.
- **FR-034**: The Delete action MUST remove only the selected product-to-CCM association after employee confirmation; it MUST NOT delete the CCM or other product associations.
- **FR-035**: The Applicable Products table MUST show five associations per page initially and provide pagination when more rows exist. This page size applies only to the linked-products table, not the product choices in the Add modal. No other page-size options are specified.
- **FR-036**: The product choice source and the applicable `LI_TYPE` values for product code/name display MUST be confirmed through read-only lookup-data review during planning; this specification does not infer the source from the example field names.
- **FR-037**: The CCM lookup-choice endpoints and available-product choice endpoint MUST return the shared `PaginatedResult<T>` response with `items`, `page`, `pageSize`, and `totalCount`; the default page size MUST be 10.

The following code-description pairs are confirmed for dropdowns:

| Field | Code | Description |
|---|---|---|
| Module Name (`CCM_MODULE`) | `AV` | Aviation |
| Module Name (`CCM_MODULE`) | `MC` | Marine Cargo |
| Module Name (`CCM_MODULE`) | `LI` | Life |
| Module Name (`CCM_MODULE`) | `LG` | Life Group |
| Accounting Posting Type (`CCM_ACNT_POSTING_TYPE`) | `B` | Batch |
| Accounting Posting Type (`CCM_ACNT_POSTING_TYPE`) | `O` | Online |
| Accounting Exchange-Rate Type (`CCM_ACNT_EXCH_RATE_TYPE`) | `A` | Average |
| Accounting Exchange-Rate Type (`CCM_ACNT_EXCH_RATE_TYPE`) | `S` | Selling |
| Accounting Exchange-Rate Type (`CCM_ACNT_EXCH_RATE_TYPE`) | `B` | Buying |
| Rounding Type (`CCM_ROUND_TYPE`) | `CL` | Ceiling |
| Rounding Type (`CCM_ROUND_TYPE`) | `RD` | Round |
| Rounding Type (`CCM_ROUND_TYPE`) | `NN` | None |
| Rounding Type (`CCM_ROUND_TYPE`) | `NI` | Next Integer |
| Rounding Type (`CCM_ROUND_TYPE`) | `FR` | Floor |
| Applicable Currency Type (`CCM_APPL_CURR_TYPE`) | `10` | All |
| Applicable Currency Type (`CCM_APPL_CURR_TYPE`) | `20` | Risk Currencies |
| Default Estimated Closure Reason (`CCM_DFLT_EST_CLO_REASON_CODE`) | `100` | Claim closed successfully |
| Default Estimated Closure Reason (`CCM_DFLT_EST_CLO_REASON_CODE`) | `200` | Additional payment requested |
| Default Estimated Closure Reason (`CCM_DFLT_EST_CLO_REASON_CODE`) | `300` | Wrongly closed by mistake |
| Default Estimated Closure Reason (`CCM_DFLT_EST_CLO_REASON_CODE`) | `400` | Duplicated Claim Entry |
| Default Estimated Closure Reason (`CCM_DFLT_EST_CLO_REASON_CODE`) | `500` | Claim Closed unsuccessfully |
| Default Estimated Closure Reason (`CCM_DFLT_EST_CLO_REASON_CODE`) | `600` | Others |
| Print-before-approval (`CCM_PRNT_BEF_APPR_YN`), reprint (`CCM_RE_PRNT_YN`), claim accounting document generation (`CCM_CLM_ACNT_DOC_GEN_YN`), and claim coinsurance accounting document generation (`CCM_CLM_COINS_ACNT_DOC_GEN_YN`) flags | `Y` | Yes (create-time default) |
| Print-before-approval, reprint, and both claim accounting document generation flags | `N` | No |

Claim Config Name and Short Name values are stored and displayed in uppercase, regardless of the case entered by the user.

The module choices above are examples and not a complete list. Full active choice lists are supplied by `STD_LIST_ITEM`.

### Key Entities *(include if data involved)*

- **Claim Configuration (CCM)**: A configuration identified by company code and CCM code, containing the claim setup fields, supplied column sizes/types, active status and audit information in FR-005. The supplied `VARCHAR2` sizes use BYTE semantics and do not establish equivalent character limits for multi-byte text.
- **Product**: An existing product identified by product ID. Products may be associated with multiple CCM configurations.
- **Product-to-CCM Association**: A link between one product ID and one globally unique CCM code, with creation and update audit information. Each product/CCM pair is unique.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Employees can create, view and update CCM configurations while preserving both primary-key fields after creation.
- **SC-002**: 100% of duplicate CCM Codes are rejected across all Company Codes without creating a second CCM.
- **SC-003**: Employees can maintain distinct product-to-CCM links in both directions, with duplicate pairs rejected.
- **SC-004**: For any product ID with stored links, the associated CCM code or codes can be identified and each code resolves to its CCM configuration.
- **SC-005**: Employees can deactivate and reactivate a CCM without losing its settings or product associations.
- **SC-006**: For each confirmed dropdown choice, the employee sees its code and description, and the selected code is the value stored for the CCM field.
- **SC-007**: 100% of saved and displayed Claim Config Name and Short Name values are uppercase, regardless of input casing.
- **SC-008**: Employees can filter every visible CCM data column and sort the full filtered result set, with no global search box and with page sizes of 10, 25, and 50.
- **SC-009**: 100% of saved second-language name and short-name values retain their original text and spacing, and are displayed right-to-left.
- **SC-010**: 100% of employee-entered CCM Codes meet the stated format and casing rules; Company Code is assigned from application context, and neither key changes after creation.
- **SC-011**: Employees can view the Product Code, Product Name, and Delete action for every linked product in the Applicable Products table, with five rows per page initially.
- **SC-012**: Duplicate product links are rejected, and deleting a link removes only that association while retaining the CCM and all other links.

## Assumptions

- The CCM database primary key is `(company code, CCM code)`. Company Code is sourced from application context (session company when available; configured fixed value `ASRTEST` until login/session support exists), while employees enter CCM Code.
- The product-to-CCM pair is unique, as stated by the known mapping-table primary key `(CCM code, product ID)`; the relationship is many-to-many.
- The field names in the known database structure are represented in stakeholder language in the requirements; they do not, by themselves, establish field validation or dropdown behavior.
- Supplied column sizes are Oracle BYTE lengths where shown. They are storage constraints, not user-facing character limits; text validation and multi-byte storage behavior require confirmation before claiming character-length guarantees.
- All listed code/type setting fields are dropdowns from active `STD_LIST_ITEM` entries, per the owner's clarifications. Their individual `LI_TYPE` mappings must be confirmed by read-only lookup-data review during planning.
- Product rows and dropdown labels use the supplied examples `LI_CODE` and `LI_TYPE - LI_DESC`; the backing product list and its exact active-item rules remain to be confirmed during planning.
- Creation and update user/date audit data are recorded for both CCM records and product associations. The user identity source and audit date display rules are not specified here.
- Deactivation/reactivation is in scope. Permanent deletion is not specified as a user capability for this feature.
- The UI and API follow the conventions established by the vehicle-make and premium-adjustment master features; this does not supply unresolved CCM field rules or dropdown mappings.
- Common UI and API ground rules for master-data features are maintained in [Master Data Common Ground Rules](../master-data-common.md). This specification defines CCM-specific fields and behavior.
- Authentication and permissions follow the project constitution and are not specified as part of this feature.
