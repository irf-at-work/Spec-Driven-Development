# Feature Specification: Company Master CRUD

**Feature Branch**: `002-company-master`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "Add, edit, delete, view and list companies through the Company Master, with validated fields, audit history, and a persistent, filterable table."

## Clarifications

### Session 2026-10-29

- Q: If two people edit the same company, should the system reject the later save when the record has changed since it was opened? → A: No. The latest valid save wins, even if another edit was committed after the user opened the record.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find and view companies (Priority: P1)

An insurance broker reviews companies in a table and opens a company to see its details.

**Why this priority**: The list and details view are the entry points for managing company records.

**Independent Test**: Open Company Master, filter and sort the company table, then open a row and verify its details.

**Acceptance Scenarios**:

1. **Given** companies exist, **When** the user opens Company Master, **Then** they see a paginated table with action, company name, short name, primary address, incorporation date, reference number, licence issue and expiry dates, company in-charge, phone, email, and website.
2. **Given** a company row is visible, **When** the user selects it, **Then** its details view opens.
3. **Given** a data column, **When** the user sorts or filters it, **Then** the table reflects that selection.
4. **Given** the user changes page, filter, or sort state and opens another screen, **When** they return to the list, **Then** the prior state is restored.
5. **Given** the user hovers over or focuses the history icon, **When** its information appears, **Then** it identifies who created and last updated the company.

### User Story 2 - Create and update a company (Priority: P1)

An insurance broker creates a company record or edits its details while keeping its company code and name unchanged after creation.

**Why this priority**: Accurate company records are the central purpose of Company Master.

**Independent Test**: Create a company with valid details, then edit its non-identity fields and verify the saved values.

**Acceptance Scenarios**:

1. **Given** the user is creating a company, **When** they enter a company name, **Then** the short name is filled with the first 30 characters and can be changed.
2. **Given** a company code already exists, **When** the user tries to create another company with that code, **Then** the record is not saved and the code field shows an error.
3. **Given** the user submits a valid new company, **When** it is saved, **Then** it appears in the company list and details view.
4. **Given** the user opens a company and selects Edit, **When** edit mode begins, **Then** company code and company name remain read-only while other fields can be changed.
5. **Given** a user enters invalid or over-length values, **When** the values change or the form is submitted, **Then** each affected field is highlighted and the page moves to the first invalid field.
6. **Given** a date field is editable, **When** the user selects a date or types a valid date, **Then** the value is accepted.
7. **Given** two users edit the same company, **When** both submit valid changes, **Then** the most recently saved values are retained.

### User Story 3 - Delete a company (Priority: P2)

An insurance broker removes an obsolete company after confirming the action.

**Why this priority**: Removing obsolete records keeps the master list useful, while confirmation prevents accidental loss.

**Independent Test**: Request deletion, cancel it and confirm the record remains; repeat and confirm deletion.

**Acceptance Scenarios**:

1. **Given** a company exists, **When** the user requests deletion, **Then** they must confirm before it is removed.
2. **Given** the user cancels the confirmation, **When** the action ends, **Then** the company remains unchanged.
3. **Given** a company is referenced by other records, **When** deletion is attempted, **Then** it is not deleted and the user is told why.

### Edge Cases

- Empty address lines are omitted from the displayed primary address; remaining address lines are joined with commas.
- Empty results and pages beyond the last result show a clear empty state and retain valid pagination and filter state.
- Duplicate company codes are rejected even if two users submit the same code at nearly the same time.
- If a save, update, delete, or list operation fails, the user sees a clear error and is not shown a success state.
- Date text that cannot be interpreted as a valid date is rejected with an error on that field.
- When multiple valid edits are submitted, the latest saved values replace earlier values; the system does not reject a save only because the company changed since it was opened.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide company list, details, create, update, and delete operations through the user interface and corresponding application interface.
- **FR-002**: The company form MUST include company code, company name, short name, three address fields, incorporation date, reference number, licence issue date, licence expiry date, company in-charge, phone, email, and website.
- **FR-003**: Company code and company name MUST be required for creation and MUST NOT be changeable after creation. Other fields are optional unless required by the existing company record definition.
- **FR-004**: On creation, the short name MUST default to the first 30 characters of the company name and remain editable.
- **FR-005**: The system MUST reject a duplicate company code on creation without saving the record.
- **FR-006**: The form MUST validate entered field lengths as the user types, using each field's defined maximum length.
- **FR-007**: Date fields MUST allow both date-picker selection and typing of a valid date.
- **FR-008**: Validation errors MUST be shown on their respective fields, and the view MUST scroll to the first invalid field.
- **FR-009**: The company list MUST be a paginated table with sortable data columns and a filter for each data column.
- **FR-010**: The table MUST include an action column, company name, short name, primary address, incorporation date, reference number, licence issue date, licence expiry date, company in-charge, phone, email, and website.
- **FR-011**: The primary address MUST join the three address fields with commas, omitting empty fields.
- **FR-012**: The action column MUST include a history icon that reveals created-by and last-updated-by information on hover or keyboard focus.
- **FR-013**: Page, filter, and sort state MUST be restored when the user leaves the list and returns during the same browser session.
- **FR-014**: The user MUST confirm a delete request before a company is permanently removed. Companies referenced by other records MUST NOT be deleted, and the user MUST receive an explanation.
- **FR-015**: Errors from company operations MUST be communicated clearly without indicating that an unsuccessful operation succeeded.
- **FR-016**: The system MUST accept a valid company update even if another update was saved after the user opened the record; the most recently saved values MUST remain.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can find and open a company from the list in no more than three interactions, excluding text entry.
- **SC-002**: All required-field, duplicate-code, and length validation scenarios identify the affected field and prevent invalid records from being saved.
- **SC-003**: In all tested leave-and-return journeys within one browser session, the company list restores the prior page, sort, and filters.
- **SC-004**: Users can complete each valid create, edit, and confirmed-delete scenario, and can distinguish an operation failure from success.
- **SC-005**: The list displays every specified column, and the history icon makes both required audit values available.

## Assumptions

- Company Master is one feature specification covering its UI and corresponding application operations; it is not split into separate API and UI specs.
- Only company code and company name are required; other fields may be left blank unless the existing company record definition requires otherwise.
- Field maximum lengths follow the existing company record definition.
- The short name is prefilled on creation but remains editable, since only company code and name were specified as immutable.
- Assistant in-charge is omitted from the screen and API at the user's direction because the existing company table has no separate assistant field.
- Deletion is permanent after confirmation; related records are never deleted automatically, and a referenced company cannot be deleted.
- List state is retained for navigation within the same browser session, not across browser sessions.
- Concurrent valid company updates use last-write-wins; the system does not reject a save based solely on a stale record view.
