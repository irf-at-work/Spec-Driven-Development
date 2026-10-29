# Feature Specification: Premium Adjustment Master

**Feature Branch**: `[002-premium-adjustment-master]`

**Created**: 29-Oct-2026

**Status**: Draft

**Input**: User description: Premium Adjustment Master page for insurance brokers.

WHY: Brokers need one trusted list of the discounts, loadings and excess additions that can be applied to a policy premium, so that policies use consistent codes and descriptions.

WHAT:
1. List page: shows adjustment codes in pages of 10 across all types. The user can filter by Code Type, search, sort by column and move between pages. Each row shows its Active status and has Open and Delete actions. There is a button to add a new adjustment code. Filtering, searching and sorting work across all records, not just the visible page.

2. Add an adjustment code: the user chooses a Code Type and enters a Code and a Company Code. Both are up to 12 characters, letters, digits and hyphens only, saved in capitals. The user also enters a Name (required, up to 100 characters) and a Short Name (required, up to 30 characters), and chooses a Discount Type, a Charges Type and a Charges Category. All three choices are required for every Code Type. Active is Yes by default and can be changed to No. In a collapsible "Additional Information" section the user may enter Remarks (up to 2000 characters) and Arabic versions of the name, short name and remarks (all optional, shown right to left). A code is unique by the combination of Code Type, Code and Company Code. If the combination already exists, the user is told it already exists and nothing is saved.

3. Dropdown choices: Code Type, Discount Type, Charges Type and Charges Category each show the active items of their own standard list, by description.

4. Open and edit: opening a record shows it read-only. An Edit toggle makes every field editable except Code Type, Code and Company Code. The Additional Information section opens automatically when it contains data. Records saved earlier without a Discount Type, Charges Type or Charges Category must have them chosen before they can be saved again. Turning the toggle off with unsaved changes asks the user to confirm discarding them.

5. Delete: permanent removal, only after the user confirms in a dialog that says the deletion cannot be undone.

6. Text rules (same as the Vehicle Make Master): English names and short names are saved with a capital first letter on each word, except words typed entirely in capitals, which are kept as typed. Arabic text is never altered. Extra spaces are removed. When a field reaches its maximum length, a message such as "Maximum 100 characters" is shown. The same rules are enforced when the data is saved.

7. Records created or changed are stamped with the user "admin" for now.

OUT OF SCOPE: sign-in and permissions, soft delete or restore, checks for codes used by other records, edit-conflict warnings between users.

## Clarifications

### Session 2026-10-29

- Q: Are the Discount Type, Charges Type, and Charges Category dropdown options the same for every Code Type, or do they vary by Code Type? → A: Same options for all Code Types - dropdowns are independent lists

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find and browse adjustment codes (Priority: P1)

As an insurance broker, I want one searchable, sortable list of adjustment codes so that I can find and consistently select the right discount, loading, or excess addition for insurance records.

**Why this priority**: The list is the primary way brokers use and verify the master data.

**Independent Test**: Create enough adjustment codes to span multiple pages, then search, sort, and navigate the list and verify the matching results and row actions.

**Acceptance Scenarios**:

1. **Given** there are adjustment codes, **When** the user opens the list, **Then** the list shows no more than 10 codes per page, initially sorts by Code Type then Code, and provides page navigation.
2. **Given** matching codes exist on different pages, **When** the user searches, **Then** matching results are found across all records, not only the current page.
3. **Given** codes exist on different pages, **When** the user sorts by a column, **Then** the ordering applies across all records, not only the current page.
4. **Given** the list shows an adjustment code, **When** the user selects Open, **Then** that code opens in read-only view.
5. **Given** the list shows an adjustment code, **When** the user selects Delete, **Then** the user is asked to confirm permanent deletion before the record is removed.
6. **Given** the list is open, **When** the user selects the add action, **Then** the user can begin entering a new adjustment code.

### User Story 2 - Add an adjustment code (Priority: P1)

As an insurance broker, I want to add an adjustment code with consistent English and optional Arabic details so that later insurance records can use trusted adjustment codes.

**Why this priority**: Adding the approved master records establishes the trusted list.

**Independent Test**: Enter a valid new adjustment code, save it, and verify the normalized values appear in the list; then attempt to save a duplicate combination and verify no duplicate is created.

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

### User Story 3 - Open and edit an adjustment code (Priority: P1)

As an insurance broker, I want to inspect an adjustment code and explicitly switch to editing it so that I can correct its details without changing its code.

**Why this priority**: Accurate master details need a controlled way to be reviewed and maintained.

**Independent Test**: Open a saved adjustment code, verify it is read-only, edit and save a field, then make an unsaved change and turn editing off to verify discard confirmation.

**Acceptance Scenarios**:

1. **Given** a saved adjustment code is opened, **When** its details are displayed, **Then** every field is read-only and Code Type, Code, and Company Code cannot be changed.
2. **Given** an adjustment code is open, **When** the user switches editing on, **Then** every field except Code Type, Code, and Company Code becomes editable.
3. **Given** an adjustment code contains any Additional Information value, **When** the user opens it, **Then** the Additional Information section is expanded automatically.
4. **Given** the user has unsaved changes while editing, **When** they switch editing off, **Then** they are asked whether to discard the changes; confirming discards them and cancelling keeps editing and changes.
5. **Given** the user saves valid edits, **When** the save completes, **Then** the changes are stored with the same validation and text rules as creation and the record is stamped with user `admin`.
6. **Given** the user attempts to save invalid edits, **When** validation runs, **Then** the invalid fields are identified and the changes are not saved.
7. **Given** an adjustment code was saved earlier without Discount Type, Charges Type, or Charges Category, **When** the user edits and saves it, **Then** the user must choose all three before the save succeeds.

### User Story 4 - Permanently delete an adjustment code (Priority: P2)

As an insurance broker, I want to permanently delete an adjustment code only after an explicit warning and confirmation so that accidental removal is avoided.

**Why this priority**: Removal is necessary for maintaining the list, but is less frequent and irreversible.

**Independent Test**: Request deletion, cancel it and verify the record remains; request deletion again, confirm the warning, and verify the record is removed.

**Acceptance Scenarios**:

1. **Given** the user requests deletion, **When** the confirmation dialog appears, **Then** it states that deletion is permanent and cannot be undone.
2. **Given** the confirmation dialog is open, **When** the user cancels, **Then** the adjustment code remains unchanged.
3. **Given** the confirmation dialog is open, **When** the user confirms, **Then** the adjustment code is permanently removed and no restore action is offered.

## Edge Cases

- Searching with no matches shows an empty-results state and does not imply that records were deleted.
- Changing search criteria or sort order while on a later page returns the user to a valid page of results.
- Code is required, cannot be null or empty, and must be unique within its Code Type and Company Code combination.
- Company Code is required, cannot be null or empty.
- Leading or trailing whitespace and repeated spaces are removed from non-Arabic text fields. Arabic values, including all spacing, remain exactly as entered.
- Arabic Name, Short Name, and Remarks are limited to 100, 30, and 2000 characters respectively.
- Deletion is permanent; no soft-delete, restore, or checks for use by other records are included.
- Active defaults to Yes and can be changed to No.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a list of adjustment codes with no more than 10 records per page, initially sorted by Code Type then Code, and controls to move between pages.
- **FR-002**: The system MUST allow users to filter by Code Type, search by Code Type, Code, Company Code, Name, and Short Name, and sort by each of those columns across all adjustment codes, not only the currently displayed page.
- **FR-003**: The system MUST provide an action to open each adjustment code and an action to begin adding a new one.
- **FR-004**: The system MUST require a non-null, non-empty Code of up to 12 characters containing only letters, digits, and hyphens, saved in capitals.
- **FR-005**: The system MUST require a non-null, non-empty Company Code of up to 12 characters containing only letters, digits, and hyphens, saved in capitals.
- **FR-006**: The system MUST require a Name of up to 100 characters and a Short Name of up to 30 characters.
- **FR-007**: The system MUST require a Code Type, Discount Type, Charges Type, and Charges Category for every adjustment code.
- **FR-008**: The system MUST save English names and short names with the first letter of each word capitalized, except words entered entirely in capitals, which MUST retain their casing. It MUST remove extra spaces from non-Arabic text fields.
- **FR-009**: The system MUST provide a collapsible Additional Information section with optional Remarks up to 2000 characters, Arabic Name up to 100 characters, Arabic Short Name up to 30 characters, and Arabic Remarks up to 2000 characters. Arabic values MUST be shown right to left and MUST NOT be altered, including their spacing.
- **FR-010**: The system MUST show a maximum-character message when a field reaches its limit and MUST prevent a value from exceeding the limit. The limit MUST also be enforced when data is saved.
- **FR-011**: The system MUST tell the user when the Code Type, Code, and Company Code combination already exists and MUST NOT save the duplicate.
- **FR-012**: Opening an adjustment code MUST show it read-only. An edit control MUST make every field except Code Type, Code, and Company Code editable.
- **FR-013**: The Additional Information section MUST open automatically when at least one of its fields contains data.
- **FR-014**: When the user turns editing off with unsaved changes, the system MUST ask for confirmation before discarding them. Confirming MUST discard the changes; cancelling MUST preserve them and keep editing enabled.
- **FR-015**: The system MUST request confirmation before deletion and state that deletion cannot be undone. Confirmed deletion MUST permanently remove the record; cancelled deletion MUST leave it unchanged.
- **FR-016**: Every successfully created or changed adjustment code MUST be stamped with the user `admin`.
- **FR-017**: Invalid values and missing required values MUST be clearly identified, and invalid changes MUST NOT be saved.
- **FR-018**: Code Type, Discount Type, Charges Type, and Charges Category dropdowns MUST each show the active items of their own standard list, ordered by description.

### Key Entities *(include if feature involves data)*

- **Adjustment Code**: A master record identifying a discount, loading, or excess addition that can be applied to a policy premium, with Code Type, Code, Company Code, Name, Short Name, Discount Type, Charges Type, Charges Category, Active status, optional remarks and Arabic equivalents, and a record of the user who created or last changed it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Brokers can find an adjustment code by searching across all records and can sort the full result set by a chosen column.
- **SC-002**: The list displays at most 10 records on each page and supports navigation through all matching records.
- **SC-003**: 100% of successful create and edit actions save values within the stated field limits and text rules; invalid or duplicate values are not saved.
- **SC-004**: 100% of deletion attempts require explicit confirmation, and cancelling leaves the adjustment code unchanged.
- **SC-005**: Created and changed records show `admin` as the recorded user.

## Assumptions

- Code and Company Code are required fields, each up to 12 characters containing only letters, digits, and hyphens, saved in capitals.
- Search matches Code Type, Code, Company Code, Name, and Short Name. Sorting is available for those same columns and operates on the full set of adjustment codes; the initial list order is Code Type ascending then Code ascending.
- Code Type, Discount Type, Charges Type, and Charges Category are all required for every adjustment code.
- Discount Type, Charges Type, and Charges Category dropdown options are the same for all Code Types; they do not vary based on the selected Code Type.
- Active defaults to Yes and can be changed to No.
- Sign-in, permissions, soft deletion, restoration, usage checks against other records, and edit-conflict warnings are out of scope.