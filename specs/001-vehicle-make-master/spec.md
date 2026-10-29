# Feature Specification: Vehicle Make Master

**Feature Branch**: `[001-vehicle-make-master]`

**Created**: 29-Oct-2026

**Status**: Draft

**Input**: User description: Vehicle Make Master page for insurance brokers.

## Clarifications

### Session 2026-10-29

- Q: Must Make Code be required as well as unique? → A: Yes. Make Code is required, cannot be null or empty, and must be unique.
- Q: What should the list use for its initial sort order? → A: Make Code.
- Q: Should the Arabic Make Name, Short Name, and Remarks use the same maximum lengths as their English counterparts? → A: Yes; 100, 30, and 2000 characters respectively.
- Q: Should Arabic fields preserve all spacing exactly, or should leading or repeated spaces be normalized? → A: Preserve Arabic text exactly, including all spacing.
- Q: Which user story owns the add and delete journeys so each story can be independently tested? → A: Add belongs to User Story 2; permanent delete belongs to User Story 4. User Story 1 covers list browsing, search, sorting, paging, and read-only Open.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find and browse vehicle makes (Priority: P1)

As an insurance broker, I want one searchable, sortable list of vehicle makes so that I can find and consistently select a make for insurance records.

**Why this priority**: The list is the primary way brokers use and verify the master data.

**Independent Test**: Create enough vehicle makes to span multiple pages, then search, sort, and navigate the list and open a make read-only.

**Acceptance Scenarios**:

1. **Given** there are vehicle makes, **When** the user opens the list, **Then** the list shows no more than 10 makes per page, initially sorts by Make Code, and provides page navigation.
2. **Given** matching makes exist on different pages, **When** the user searches, **Then** matching results are found across all records, not only the current page.
3. **Given** makes exist on different pages, **When** the user sorts by a column, **Then** the ordering applies across all records, not only the current page.
4. **Given** the list shows a vehicle make, **When** the user selects Open, **Then** that make opens in read-only view.

### User Story 2 - Add a vehicle make (Priority: P1)

As an insurance broker, I want to add a vehicle make with consistent English and optional Arabic details so that later insurance records can use trusted make names.

**Why this priority**: Adding the approved master records establishes the trusted list.

**Independent Test**: Enter a valid new make, save it, and verify the normalized values appear in the list; then attempt to save a duplicate code and verify no duplicate is created.

**Acceptance Scenarios**:

1. **Given** the add form is open, **When** the user enters a Make Name and Short Name within their limits and saves, **Then** the make is saved and appears in the list.
2. **Given** the list is open, **When** the user selects the add action, **Then** the add form opens.
3. **Given** the user leaves Make Code blank, **When** they save, **Then** the user is told that Make Code is required and the make is not saved.
4. **Given** the user enters a Make Code, **When** they save, **Then** the code may contain only letters, digits, or hyphens, is no longer than 12 characters, and is saved in capitals.
5. **Given** the user enters an English name or short name, **When** they save, **Then** each word starts with a capital letter, words entered entirely in capitals retain their casing, and extra spaces are removed.
6. **Given** the user opens Additional Information, **When** they enter Remarks or Arabic name, short name, or remarks, **Then** each value is optional, respects its field limit, and Arabic text is displayed right to left without being altered.
7. **Given** the entered Make Code already exists, **When** the user saves, **Then** the user is told that the code already exists and no record is saved.
8. **Given** a required field is empty or a value is invalid, **When** the user attempts to save, **Then** the field is identified and the record is not saved.
9. **Given** a field reaches its maximum length, **When** the user enters text, **Then** a message states the maximum character count and the value cannot exceed that limit.
10. **Given** a make is successfully created, **When** its record is saved, **Then** it is stamped with user `admin`.

### User Story 3 - Open and edit a vehicle make (Priority: P1)

As an insurance broker, I want to inspect a make and explicitly switch to editing it so that I can correct its details without changing its code.

**Why this priority**: Accurate master details need a controlled way to be reviewed and maintained.

**Independent Test**: Open a saved make, verify it is read-only, edit and save a field, then make an unsaved change and turn editing off to verify discard confirmation.

**Acceptance Scenarios**:

1. **Given** a saved make is opened, **When** its details are displayed, **Then** every field is read-only and the Make Code cannot be changed.
2. **Given** a make is open, **When** the user switches editing on, **Then** every field except Make Code becomes editable.
3. **Given** a make contains any Additional Information value, **When** the user opens it, **Then** the Additional Information section is expanded automatically.
4. **Given** the user has unsaved changes while editing, **When** they switch editing off, **Then** they are asked whether to discard the changes; confirming discards them and cancelling keeps editing and changes.
5. **Given** the user saves valid edits, **When** the save completes, **Then** the changes are stored with the same validation and text rules as creation and the record is stamped with user `admin`.
6. **Given** the user attempts to save invalid edits, **When** validation runs, **Then** the invalid fields are identified and the changes are not saved.

### User Story 4 - Permanently delete a vehicle make (Priority: P2)

As an insurance broker, I want to permanently delete a make only after an explicit warning and confirmation so that accidental removal is avoided.

**Why this priority**: Removal is necessary for maintaining the list, but is less frequent and irreversible.

**Independent Test**: Request deletion, cancel it and verify the record remains; request deletion again, confirm the warning, and verify the record is removed.

**Acceptance Scenarios**:

1. **Given** the user requests deletion, **When** the confirmation dialog appears, **Then** it states that deletion is permanent and cannot be undone.
2. **Given** the confirmation dialog is open, **When** the user cancels, **Then** the make remains unchanged.
3. **Given** the confirmation dialog is open, **When** the user confirms, **Then** the make is permanently removed and no restore action is offered.

## Edge Cases

- Searching with no matches shows an empty-results state and does not imply that records were deleted.
- Changing search criteria or sort order while on a later page returns the user to a valid page of results.
- Make Code is required, cannot be null or empty, and must be unique.
- Leading or trailing whitespace and repeated spaces are removed from non-Arabic text fields. Arabic values, including all spacing, remain exactly as entered.
- Arabic Make Name, Short Name, and Remarks are limited to 100, 30, and 2000 characters respectively.
- Deletion is permanent; no soft-delete, restore, or checks for use by other records are included.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a list of vehicle makes with no more than 10 records per page, initially sorted by Make Code, and controls to move between pages.
- **FR-002**: The system MUST allow users to search by Make Code, Make Name, and Short Name, and sort by each of those columns across all vehicle makes, not only the currently displayed page.
- **FR-003**: The system MUST provide an action to open each vehicle make and an action to begin adding a new one.
- **FR-004**: The system MUST require a non-null, non-empty Make Code of up to 12 characters containing only letters, digits, and hyphens; it MUST be saved in capitals and MUST be unique.
- **FR-005**: The system MUST require a Make Name of up to 100 characters and a Short Name of up to 30 characters.
- **FR-006**: The system MUST save English names and short names with the first letter of each word capitalized, except words entered entirely in capitals, which MUST retain their casing. It MUST remove extra spaces from non-Arabic text fields.
- **FR-007**: The system MUST provide a collapsible Additional Information section with optional Remarks up to 2000 characters, Arabic Make Name up to 100 characters, Arabic Short Name up to 30 characters, and Arabic Remarks up to 2000 characters. Arabic values MUST be shown right to left and MUST NOT be altered, including their spacing.
- **FR-008**: The system MUST show a maximum-character message when a field reaches its limit and MUST prevent a value from exceeding the limit. The limit MUST also be enforced when data is saved.
- **FR-009**: The system MUST tell the user when the required Make Code already exists and MUST NOT save the duplicate.
- **FR-010**: Opening a vehicle make MUST show it read-only. An edit control MUST make every field except Make Code editable.
- **FR-011**: The Additional Information section MUST open automatically when at least one of its fields contains data.
- **FR-012**: When the user turns editing off with unsaved changes, the system MUST ask for confirmation before discarding them. Confirming MUST discard the changes; cancelling MUST preserve them and keep editing enabled.
- **FR-013**: The system MUST request confirmation before deletion and state that deletion cannot be undone. Confirmed deletion MUST permanently remove the record; cancelled deletion MUST leave it unchanged.
- **FR-014**: Every successfully created or changed vehicle make MUST be stamped with the user `admin`.
- **FR-015**: Invalid values and missing required values MUST be clearly identified, and invalid changes MUST NOT be saved.

### Key Entities *(include if feature involves data)*

- **Vehicle Make**: A master record identifying a vehicle make, with Make Code, Make Name, Short Name, optional remarks and Arabic equivalents, and a record of the user who created or last changed it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Brokers can find a make by searching across all records and can sort the full result set by a chosen column.
- **SC-002**: The list displays at most 10 records on each page and supports navigation through all matching records.
- **SC-003**: 100% of successful create and edit actions save values within the stated field limits and text rules; invalid or duplicate values are not saved.
- **SC-004**: 100% of deletion attempts require explicit confirmation, and cancelling leaves the make unchanged.
- **SC-005**: Created and changed records show `admin` as the recorded user.

## Assumptions

- Repeated and leading/trailing spaces are normalized in non-Arabic fields. Arabic fields are preserved exactly, including their spacing.
- Search matches Make Code, Make Name, and Short Name. Sorting is available for those same columns and operates on the full set of vehicle makes; the initial list order is Make Code ascending.
- Sign-in, permissions, soft deletion, restoration, usage checks against other records, and edit-conflict warnings are out of scope.
