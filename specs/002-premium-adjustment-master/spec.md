# Feature Specification: Premium Adjustment Master

**Feature Branch**: `[002-premium-adjustment-master]`

**Created**: 29-Oct-2026

**Revised**: 02-Nov-2026 (rewritten to follow feature 001 as it now stands: Active flag as soft delete, per-column filters, icon actions, typography, breadcrumbs, shared notification style)

**Status**: Draft — the adjustment-code table is inspected; implementation remains blocked pending confirmation of the four standard-list mappings and an owner-approved resolution for Arabic storage under BYTE semantics.

**Input**: User description: Premium Adjustment Master page for insurance brokers.

WHY: Brokers need one trusted list of the discounts, loadings and excess additions that can be applied to a policy premium, so that policies use consistent codes and descriptions.

WHAT:
1. List page: shows adjustment codes in pages of 10 across all types. There is no global search box. Every visible data column (Code Type, Code, Company Code, Name, Short Name and Status) has its own filter. The text columns offer starts with, ends with, contains, equal to and not equal to; Status is a choice of Active or Inactive with equal to and not equal to. The user can also sort by column and move between pages. Each row shows its Active status and has icon actions to open and to delete it. An icon action adds a new adjustment code. Filtering and sorting work across all records, not just the visible page.

2. Add an adjustment code: the user chooses a Code Type and enters a Code and a Company Code. Both are up to 12 characters, letters, digits and hyphens only, saved in capitals. The user also enters a Name (required, up to 100 characters) and a Short Name (required, up to 30 characters), and chooses a Discount Type, a Charges Type and a Charges Category. All three choices are required for every Code Type. An Active setting is on by default and the user can turn it off. In a collapsible "Additional Information" section the user may enter Remarks (up to 2000 characters) and Arabic versions of the name, short name and remarks (all optional, shown right to left). A code is unique by the combination of Code Type, Code and Company Code. If the combination already exists, the user is told it already exists and nothing is saved.

3. Dropdown choices: Code Type, Discount Type, Charges Type and Charges Category each show the active items of their own standard list, by description.

4. Open and edit: opening a record enters edit mode immediately. Every field except Code Type, Code and Company Code is editable; no separate Edit control is shown. Active is one of the editable fields: turning it off and saving soft deletes the record, and turning it on again restores it. The Additional Information section opens automatically when it contains data. Records saved earlier without a Discount Type, Charges Type or Charges Category must have them chosen before they can be saved again. Leaving with unsaved changes asks the user to confirm discarding them.

5. Delete: permanent removal, only after the user confirms in a dialog that says the deletion cannot be undone. Turning Active off is the reversible alternative.

6. Text rules (same as the Vehicle Make Master): English names and short names are saved with a capital first letter on each word, except words typed entirely in capitals, which are kept as typed. Arabic text is never altered. Extra spaces are removed. When a field reaches its maximum length, a message such as "Maximum 100 characters" is shown. The same rules are enforced when the data is saved.

7. Records created or changed are stamped with the user "admin" for now.

8. Look and feel (same as the Vehicle Make Master): actions are icons that each have a tooltip and a name for screen readers; text is large and clear (Inter for English, Noto Sans Arabic for Arabic); every page has a breadcrumb trail; messages and confirmations use one consistent style; leaving a form that has unsaved changes asks the user first.

OUT OF SCOPE: sign-in and permissions, checks for codes used by other records, edit-conflict warnings between users.

## Clarifications

### Session 2026-10-29

- Q: Are the Discount Type, Charges Type, and Charges Category dropdown options the same for every Code Type, or do they vary by Code Type? → A: Same options for all Code Types - dropdowns are independent lists

### Session 2026-11-02

- Q: Should the list use one search box or per-column filters? → A: Per-column filters with operators, the same pattern as the Vehicle Make Master (feature 001). The Code Type filter matches the Code Type description.
- Q: How do blank and "not equals" filters behave? → A: A blank filter is ignored. "Not equals" also lists records whose value is empty. Filters and sorting ignore upper and lower case. (Same as feature 001.)

### Session 2026-11-02 (aligned with feature 001)

- The list filters, icon actions, typography, breadcrumb, shared notification style, and unsaved-changes confirmation follow feature 001.
- Active is the reversible way to retire and restore a record; permanent deletion remains available only with confirmation. These are stated once in the feature behavior and requirements above.
- The Premium Adjustments list provides an Excel `.xlsx` template/import. Its `IMPORT` sheet includes code type, code, company code, descriptions, classification lookup codes, optional remarks/Arabic text and active flag. Preview validates fields and active lookup values; duplicate keys in the workbook block import, existing database keys are skipped, and new rows are inserted atomically after confirmation (maximum 1,000 rows and 5 MB).
- When a saved adjustment code is open for editing, show an Add Adjustment Code icon immediately to the left of the Back icon, matching the saved-record form action in feature 001. Selecting it starts a blank add form; unsaved changes must be confirmed before leaving.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find and browse adjustment codes (Priority: P1)

As an insurance broker, I want one filterable, sortable list of adjustment codes so that I can find and consistently select the right discount, loading, or excess addition for insurance records.

**Why this priority**: The list is the primary way brokers use and verify the master data.

**Independent Test**: Create enough adjustment codes to span multiple pages, then filter, sort, and navigate the list and verify the matching results and row actions.

**Acceptance Scenarios**:

1. **Given** there are adjustment codes, **When** the user opens the list, **Then** the list initially shows 10 codes per page, offers page sizes of 10, 25, and 50, initially sorts by Code Type then Code, and provides page navigation.
2. **Given** the list is open, **When** it appears, **Then** there is no global search box; each data column offers its own filter, the text columns with an operator choice (starts with, ends with, contains, equal to, not equal to) and Status with Active or Inactive.
3. **Given** matching codes exist on different pages, **When** the user filters a column (for example Name starts with "F"), **Then** matching results are found across all records, not only the current page, and filters on several columns together show only the codes that match all of them.
4. **Given** the user is on a later page, **When** they change a filter or the sort order, **Then** the list returns to page 1.
5. **Given** a filter matches nothing, **When** the results appear, **Then** an empty-results message is shown that does not imply records were deleted, and clearing the filter brings the full list back.
6. **Given** codes exist on different pages, **When** the user sorts by a column, **Then** the ordering applies across all records, not only the current page, and ignores upper and lower case.
7. **Given** codes with Active on and off exist, **When** the user views the list, **Then** each row shows its Active status; inactive codes stay in the list and can still be opened.
8. **Given** the list shows an adjustment code, **When** the user selects the open icon, **Then** that code opens in edit mode with Code Type, Code and Company Code locked.
9. **Given** the list shows an adjustment code, **When** the user selects the delete icon, **Then** the user is asked to confirm permanent deletion before the record is removed.
10. **Given** the list is open, **When** the user selects the add icon, **Then** the user can begin entering a new adjustment code.
11. **Given** a saved adjustment code is open for editing, **When** the user selects the Add Adjustment Code icon immediately to the left of Back, **Then** a blank add form opens; if the current record has unsaved changes, the user is asked whether to discard them first.

### User Story 2 - Add an adjustment code (Priority: P1)

As an insurance broker, I want to add an adjustment code with consistent English and optional Arabic details so that later insurance records can use trusted adjustment codes.

**Why this priority**: Adding the approved master records establishes the trusted list.

**Independent Test**: Enter a valid new adjustment code, save it, and verify the normalised values appear in the list; then attempt to save a duplicate combination and verify no duplicate is created.

**Acceptance Scenarios**:

1. **Given** the add form is open, **When** the user enters a Code, Company Code, Name, Short Name within their limits, chooses Code Type, Discount Type, Charges Type, and Charges Category, and saves, **Then** the adjustment code is saved and appears in the list.
2. **Given** the user leaves Code blank, **When** they save, **Then** the user is told that Code is required and the adjustment code is not saved.
3. **Given** the user leaves Company Code blank, **When** they save, **Then** the user is told that Company Code is required and the adjustment code is not saved.
4. **Given** the user enters a Code or Company Code, **When** they save, **Then** the value may contain only letters, digits, or hyphens, is no longer than 12 characters, and is saved in capitals.
5. **Given** the user enters an English name or short name, **When** they save, **Then** each word starts with a capital letter, words entered entirely in capitals retain their casing, and extra spaces are removed.
6. **Given** the user opens Additional Information, **When** they enter Remarks or Arabic name, short name, or remarks, **Then** each value is optional, respects its field limit, and Arabic text is displayed right to left without being altered.
7. **Given** the entered Code Type, Code, and Company Code combination already exists, **When** the user saves, **Then** the user is told that the combination already exists and no record is saved.
8. **Given** a required field is empty or a value is invalid, **When** the user attempts to save, **Then** the field is identified and the record is not saved.
9. **Given** a field reaches its maximum length, **When** the user enters text, **Then** a message states the maximum character count and the value cannot exceed that limit.
10. **Given** an adjustment code is successfully created, **When** its record is saved, **Then** it is stamped with user `admin`.
11. **Given** the add form is open, **When** it appears, **Then** Active is on by default; the user may turn it off before saving, and the saved code keeps the chosen status.
12. **Given** the add form has unsaved changes, **When** the user selects Back, follows a breadcrumb link, or uses the browser's back button, **Then** they are asked whether to discard the changes; confirming leaves the page and cancelling keeps the form and its changes.

### User Story 3 - Open and edit an adjustment code (Priority: P1)

As an insurance broker, I want to edit an adjustment code as soon as I open it so that I can correct its details without changing its key.

**Why this priority**: Accurate master details need a controlled way to be reviewed and maintained.

**Independent Test**: Open a saved adjustment code, verify its editable fields are enabled and its key fields are locked, save a change, then make an unsaved change and leave the page to verify discard confirmation.

**Acceptance Scenarios**:

1. **Given** a saved adjustment code is opened, **When** its details are displayed, **Then** every field except Code Type, Code, and Company Code is editable, and those three key fields cannot be changed.
3. **Given** an adjustment code contains any Additional Information value, **When** the user opens it, **Then** the Additional Information section is expanded automatically.
4. **Given** the user has unsaved changes, **When** they leave the adjustment-code page, **Then** they are asked whether to discard the changes; confirming discards them and cancelling keeps the page and changes.
5. **Given** the user saves valid edits, **When** the save completes, **Then** the changes are stored with the same validation and text rules as creation and the record is stamped with user `admin`.
6. **Given** the user attempts to save invalid edits, **When** validation runs, **Then** the invalid fields are identified and the changes are not saved.
7. **Given** an adjustment code was saved earlier without Discount Type, Charges Type, or Charges Category, **When** the user edits and saves it, **Then** the user must choose all three before the save succeeds.
8. **Given** an adjustment code is open, **When** its details are displayed, **Then** its Active status is editable; turning Active off and saving soft deletes the code (it stays in the list, marked inactive), and turning Active on again and saving restores it.
9. **Given** the open form has unsaved changes, **When** the user selects Back, follows a breadcrumb link, or uses the browser's back button, **Then** they are asked whether to discard the changes before leaving.
10. **Given** an adjustment code is open for editing, **When** the user selects Add Adjustment Code, **Then** a blank add form opens without changing the current record; if the current record has unsaved changes, navigation waits for discard confirmation.

### User Story 4 - Permanently delete an adjustment code (Priority: P2)

As an insurance broker, I want to permanently delete an adjustment code only after an explicit warning and confirmation so that accidental removal is avoided.

**Why this priority**: Removal is necessary for maintaining the list, but is less frequent and irreversible. Brokers who only want to retire a code can turn Active off instead.

**Independent Test**: Request deletion, cancel it and verify the record remains; request deletion again, confirm the warning, and verify the record is removed.

**Acceptance Scenarios**:

1. **Given** the user requests deletion, **When** the confirmation dialog appears, **Then** it states that deletion is permanent and cannot be undone.
2. **Given** the confirmation dialog is open, **When** the user cancels, **Then** the adjustment code remains unchanged.
3. **Given** the confirmation dialog is open, **When** the user confirms, **Then** the adjustment code is permanently removed and no restore action is offered.

### User Story 5 - Import adjustment codes from Excel (Priority: P2)

As a master-data administrator, I want to import adjustment codes from an Excel workbook so that I can migrate or maintain many approved codes without entering them one at a time.

**Independent Test**: Download the template, upload valid and invalid rows including duplicate workbook and existing database keys, review the preview, correct or remove invalid rows, confirm the import, and verify the inserted and skipped counts.

**Acceptance Scenarios**:

1. **Given** the user opens the Premium Adjustments list, **When** they choose Import or Download Template, **Then** the system provides an `.xlsx` template with an `IMPORT` sheet and columns for Code Type, Code, Company Code, Name, Short Name, Discount Type, Charges Type, Charges Category, Remarks, Arabic Name, Arabic Short Name, Arabic Remarks, and Active.
2. **Given** the user uploads an `.xlsx` workbook up to 5 MB containing at most 1,000 data rows, **When** it is parsed, **Then** a preview shows row-level validation results before any database writes occur.
3. **Given** a row has missing or invalid required fields, an over-limit value, an invalid or inactive lookup choice, or a duplicate `(Code Type, Code, Company Code)` key within the workbook, **When** the preview is shown, **Then** that row is identified and the import cannot proceed while invalid rows remain.
4. **Given** a valid key already exists in the database, **When** the preview is shown, **Then** that row is marked skipped and the existing record is not changed.
5. **Given** all remaining rows are valid or skipped, **When** the user confirms import, **Then** new records are revalidated by the server and inserted atomically, and a summary reports inserted and skipped counts.
6. **Given** the user cancels the import or a row/database error occurs, **When** the operation ends, **Then** no partial import is committed.

## Edge Cases

- Filtering with no matches shows an empty-results state and does not imply that records were deleted.
- Changing filter criteria or sort order while on a later page returns the user to the first page of results.
- A filter left blank is ignored, even when an operator is chosen. "Not equal to" also lists records whose value is empty. Characters the user types in a filter are plain text, never search patterns.
- Code is required, cannot be null or empty, and must be unique within its Code Type and Company Code combination.
- Company Code is required, cannot be null or empty.
- Leading or trailing whitespace and repeated spaces are removed from non-Arabic text fields. Arabic values, including all spacing, remain exactly as entered.
- Arabic Name, Short Name, and Remarks are limited to 100, 30, and 2000 characters respectively.
- An inactive adjustment code stays in the list and can be opened and edited. This feature has no filter that hides inactive codes except the Status filter the user chooses to apply.
- A record that someone else deleted while it was open is reported as not found; no stack trace or raw server message is shown.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a list of adjustment codes with page sizes of 10, 25, and 50 records, defaulting to 10, initially sorted by Code Type then Code, and controls to move between pages.
- **FR-002**: The system MUST NOT offer a single global search box. Instead, every visible data column of the list (Code Type by description, Code, Company Code, Name, Short Name and Status) MUST have its own filter. Text columns MUST offer the operators starts with, ends with, contains (the default), equal to and not equal to; the Status column MUST offer Active or Inactive with equal to and not equal to. Filters MUST ignore upper and lower case, MUST combine so that a record must match all of them, MUST apply across all records before paging, MUST update 500 ms after typing stops, MUST return the list to page 1 when they change, and a blank filter MUST be ignored. "Not equal to" MUST also list records whose value is empty. Characters the user types MUST be treated as plain text, never as search patterns. The system MUST also allow users to sort by Code Type, Code, Company Code, Name and Short Name across all adjustment codes, ignoring upper and lower case.
- **FR-003**: The system MUST provide an action to open each adjustment code and an action to begin adding a new one.
- **FR-004**: The system MUST require a non-null, non-empty Code of up to 12 characters containing only letters, digits, and hyphens, saved in capitals.
- **FR-005**: The system MUST require a non-null, non-empty Company Code of up to 12 characters containing only letters, digits, and hyphens, saved in capitals.
- **FR-006**: The system MUST require a Name of up to 100 characters and a Short Name of up to 30 characters.
- **FR-007**: The system MUST require a Code Type, Discount Type, Charges Type, and Charges Category for every adjustment code.
- **FR-008**: The system MUST save English names and short names with the first letter of each word capitalised, except words entered entirely in capitals, which MUST retain their casing. It MUST remove extra spaces from non-Arabic text fields.
- **FR-009**: The system MUST provide a collapsible Additional Information section with optional Remarks up to 2000 characters, Arabic Name up to 100 characters, Arabic Short Name up to 30 characters, and Arabic Remarks up to 2000 characters. Arabic values MUST be shown right to left and MUST NOT be altered, including their spacing.
- **FR-010**: The system MUST show a maximum-character message when a field reaches its limit and MUST prevent a value from exceeding the limit. The limit MUST also be enforced when data is saved.
- **FR-011**: The system MUST tell the user when the Code Type, Code, and Company Code combination already exists and MUST NOT save the duplicate.
- **FR-012**: Opening an adjustment code MUST enter edit mode immediately. Every field except Code Type, Code, and Company Code MUST be editable, and no separate Edit control MUST be shown.
- **FR-013**: The Additional Information section MUST open automatically when at least one of its fields contains data.
- **FR-014**: When the user leaves an opened adjustment-code page with unsaved changes, the system MUST ask for confirmation before discarding them. Confirming MUST discard the changes; cancelling MUST keep the page open with its changes.
- **FR-015**: The system MUST request confirmation before deletion and state that deletion cannot be undone. Confirmed deletion MUST permanently remove the record; cancelled deletion MUST leave it unchanged.
- **FR-016**: Every successfully created or changed adjustment code MUST be stamped with the user `admin`.
- **FR-017**: Invalid values and missing required values MUST be clearly identified, and invalid changes MUST NOT be saved.
- **FR-018**: Code Type, Discount Type, Charges Type, and Charges Category dropdowns MUST each show the active items of their own standard list, ordered by description. Each stored choice MUST be the item's code, and the system MUST refuse a code that is not an active item of the right list, even if the screen sent it. An adjustment code that already holds a choice which has since become inactive MUST still show it and MAY be saved with it unchanged; it MUST NOT be offered to anyone choosing a new value.
- **FR-019**: Every adjustment code MUST have an Active setting. It MUST be on by default when a code is added. The user MAY turn it off while adding or while an opened code is being edited, and MAY turn it on again while editing. It is stored as `Y` or `N`. Turning it off MUST NOT remove the code and MUST NOT make it unreadable.
- **FR-020**: The list MUST show each record's Active status, and inactive records MUST stay in the list and MUST be openable.
- **FR-021**: Row and page actions (add, open, delete and going back) MUST be shown as icons, and each icon MUST have a tooltip that names the action and an accessible name for screen readers.
- **FR-022**: Text on every screen MUST be easy to read and MUST follow feature 001's typography rule (FR-032 of that spec): the same minimum sizes, Inter for all English text and Noto Sans Arabic for Arabic text, both available without an internet connection.
- **FR-023**: Every page MUST show the same breadcrumb trail as feature 001 (FR-033 of that spec), reading Master Data › Premium Adjustments › the open code › the current page. Each step except the current page MUST be a link, the current page MUST be marked as such for screen readers, and following a link while a form has unsaved changes MUST ask for confirmation first.
- **FR-024**: Leaving the adjustment-code form (Back, a breadcrumb link, or the browser's back button) while it has unsaved changes MUST ask for confirmation before the changes are discarded.
- **FR-025**: Success and failure messages, and every confirmation, MUST use the one shared notification style used by feature 001, written in plain English with the next step where one exists.
- **FR-026**: A saved adjustment-code form MUST show an Add Adjustment Code icon immediately to the left of the Back icon, matching feature 001's saved-record form action. Selecting it MUST open a blank add form; pending changes MUST be guarded by the existing unsaved-change confirmation, and cancelling MUST retain the current form and its changes.
- **FR-027**: The Premium Adjustments list MUST provide an `.xlsx` template and import workflow with an `IMPORT` sheet containing Code Type, Code, Company Code, Name, Short Name, Discount Type, Charges Type, Charges Category, optional Remarks and Arabic fields, and Active. The import MUST accept at most 1,000 data rows and a 5 MB workbook.
- **FR-028**: Before adjustment-code import, the system MUST preview and validate all rows using the normal create rules, including active lookup choices and duplicate `(Code Type, Code, Company Code)` keys within the workbook. Invalid rows MUST block import; existing database keys MUST be skipped without being overwritten.
- **FR-029**: The server MUST revalidate uploaded rows and insert all eligible new adjustment codes in one transaction only after explicit confirmation. Cancellation or any failure MUST leave no partial import, and the result MUST report inserted and skipped counts.

### Key Entities *(include if feature involves data)*

- **Adjustment Code**: A master record identifying a discount, loading, or excess addition that can be applied to a policy premium, with Code Type, Code, Company Code, Name, Short Name, Discount Type, Charges Type, Charges Category, an Active status (soft delete), optional remarks and Arabic equivalents, and a record of the user who created or last changed it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Brokers can find an adjustment code by filtering any column across all records and can sort the full result set by a chosen column.
- **SC-002**: The list supports page sizes of 10, 25, and 50 records, defaults to 10, and supports navigation through all matching records.
- **SC-003**: 100% of successful create and edit actions save values within the stated field limits and text rules; invalid or duplicate values are not saved.
- **SC-004**: 100% of deletion attempts require explicit confirmation, and cancelling leaves the adjustment code unchanged.
- **SC-005**: Created and changed records show `admin` as the recorded user.
- **SC-006**: A broker can soft delete and restore an adjustment code by turning Active off or on, in the add and edit views; Active is on by default when adding, and the list shows each record's Active status.
- **SC-007**: Every icon action has a tooltip and an accessible name, and leaving a form with unsaved changes never loses them without a confirmation.
- **SC-008**: From a saved adjustment-code form, the Add icon immediately left of Back opens a blank add form, and unsaved changes are retained unless the user confirms discarding them.
- **SC-009**: An administrator can preview an Excel workbook of up to 1,000 rows and 5 MB, correct invalid rows, and confirm an atomic import of new adjustment codes without overwriting existing records.

## Assumptions

- Code and Company Code are required fields, each up to 12 characters containing only letters, digits, and hyphens, saved in capitals.
- Filters apply to Code Type (by description), Code, Company Code, Name, Short Name and Status. Sorting is available for the first five and operates on the full set of adjustment codes; the initial list order is Code Type ascending then Code ascending.
- Code Type, Discount Type, Charges Type, and Charges Category are all required for every adjustment code.
- Discount Type, Charges Type, and Charges Category dropdown options are the same for all Code Types; they do not vary based on the selected Code Type.
- Sign-in, permissions, usage checks against other records, and edit-conflict warnings are out of scope.
- Inactive adjustment codes stay visible in the list, marked inactive. This feature only stores and shows the flag; how other pages use it is outside this feature.
- The four dropdown lists are small lookups loaded once when the form is opened, so they are not paged. Like feature 001's lookup, this is an exception to the constitution's B8 paging rule. It was approved by the owner and recorded under C3 on 02-Nov-2026.
- The owner confirmed the `STD_LIST_ITEM.LI_TYPE` mappings: Code Type uses `CALC_TYPE`, Discount Type uses `DISCOUNT_TYPE`, Charges Type uses `CHARGE_TYPE`, and Charges Category uses `CHARGE_CAT`.
- The inspected adjustment-code fields use BYTE semantics. Maximum Arabic character counts may exceed the available bytes; resolve persistence with the owner before claiming full support or changing the schema.
- Shared master-data list, form, and API conventions are recorded in [Master Data Common Ground Rules](../master-data-common.md). This feature's explicit requirements and recorded lookup exception remain feature-specific.
