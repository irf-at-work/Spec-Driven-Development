# Feature Specification: List Item Master

**Feature Branch**: `005-list-item-master`

**Created**: 2026-11-02

**Status**: Draft

**Owner**: Irfan

**Input**: User description: "Create a List Item Master using the existing `STD_LIST_ITEM` table. Scaffold it before any other feature work. Selecting Company Master from Masters must continue to open the existing Company Master. Replace the current List Item Master page with a listing table. Each list item configuration must have a view page with edit mode integrated into that same page, following the Company Master view."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find and view list item configurations (Priority: P1)

An insurance broker opens List Item Master, finds a configuration in a table, and opens its details.

**Why this priority**: The listing and details view are the entry points for maintaining list item configurations.

**Independent Test**: Select List Item Master from Masters, locate a configuration in the table, and open it to verify its details.

**Acceptance Scenarios**:

1. **Given** List Item Master feature implementation is about to begin, **When** work starts, **Then** the application's representation of `STD_LIST_ITEM` is scaffolded and checked against the existing table definition before any other feature behaviour is implemented.
2. **Given** the user opens Masters, **When** they select List Item Master, **Then** the current master content is replaced by the List Item Master listing table.
3. **Given** the user selects Company Master from Masters, **When** navigation completes, **Then** the existing Company Master opens unchanged.
4. **Given** list item configurations exist, **When** the user opens List Item Master, **Then** a paginated, sortable, filterable table shows each configuration's type, code, description, short description, value, active status, and an action for viewing it.
5. **Given** a configuration appears in the table, **When** the user selects its view action, **Then** its details open in a view page.
6. **Given** the user changes page, filter, or sort state and opens another screen, **When** they return to the listing during the same browser session, **Then** the prior state is restored.
7. **Given** a configuration has creation or update history, **When** the user hovers over or focuses its history action, **Then** the available created-by and last-updated-by information is shown.

### User Story 2 - Create and edit a list item configuration (Priority: P1)

An insurance broker creates a configuration or opens an existing configuration and edits it without leaving its details page.

**Why this priority**: The master is useful only when users can maintain accurate configuration values.

**Independent Test**: Create a configuration, open its details, enter edit mode on that page, save a valid change, and verify the updated values.

**Acceptance Scenarios**:

1. **Given** the user starts creating a configuration, **When** they enter its type, code, descriptions, optional value, active status, and any other business fields defined for the existing record, **Then** the form accepts valid values and identifies invalid values on their fields.
2. **Given** a configuration with the same type and code already exists, **When** the user submits another configuration with that identity, **Then** it is not saved and the user is told which identity conflicts.
3. **Given** the user submits a valid new configuration, **When** it is saved, **Then** it appears in the listing and can be opened in its details view.
4. **Given** the user is viewing a configuration, **When** they select Edit, **Then** editable fields become editable in place on the same page and the type and code remain read-only.
5. **Given** the user changes valid values in edit mode, **When** they save, **Then** the details and listing show the saved values without navigating to a separate edit page.
6. **Given** the user changes values in edit mode, **When** they cancel, **Then** unsaved changes are discarded and the previously saved values remain visible.
7. **Given** two users submit valid changes to the same configuration, **When** both saves complete, **Then** the most recently saved values are retained.

### User Story 3 - Remove an obsolete list item configuration (Priority: P2)

An insurance broker removes an obsolete configuration after confirming the action.

**Why this priority**: Removing obsolete entries keeps the master accurate, while a confirmation and reference checks help prevent accidental loss.

**Independent Test**: Request removal of an unreferenced configuration, cancel and confirm the request in separate attempts, and verify the resulting records.

**Acceptance Scenarios**:

1. **Given** a configuration exists, **When** the user requests its removal, **Then** they must confirm before it is permanently removed.
2. **Given** the user cancels the confirmation, **When** the action ends, **Then** the configuration remains unchanged.
3. **Given** a configuration is referenced by other records, **When** removal is attempted, **Then** it is not removed and the user is told why.

### Edge Cases

- When the listing has no matches, it shows a clear empty state and retains valid paging and filter state.
- When a requested page is beyond the last page, the listing shows no records without losing the total match count or current filters.
- A type-and-code identity is considered duplicate even when two users submit the same identity at nearly the same time.
- If a list, view, create, update, or removal operation fails, the user sees an actionable error and is not shown a success state.
- Invalid or over-length values are rejected using the limits of the existing list item definition, and the affected fields are identified.
- The user can distinguish an inactive configuration from a removed one; changing active status does not remove a record.
- A save failure leaves the user on the current page with entered values available for correction or retry.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Before any List Item Master feature behaviour is implemented, the application's representation of the existing `STD_LIST_ITEM` table MUST be scaffolded and checked against its current definition. The existing table definition MUST NOT be changed by this feature.
- **FR-002**: The Masters menu MUST provide access to List Item Master, and selecting it MUST replace the current master content with the List Item Master listing.
- **FR-003**: Selecting Company Master from Masters MUST continue to open the existing Company Master without changing its behaviour.
- **FR-004**: The List Item Master listing MUST be a paginated table with sortable data columns and a filter for each data column.
- **FR-005**: The listing MUST show an action, type, code, description, short description, value, active status, and the corresponding values for every existing configuration.
- **FR-006**: Each configuration MUST have a details view. Selecting Edit MUST enter edit mode within that same details page; the system MUST NOT require a separate edit page.
- **FR-007**: The details and edit form MUST represent the business fields in the existing list item definition, including the primary and alternate-language descriptions, short descriptions, optional value, active status, and any defined additional business values. Creation and update audit fields MUST be available as history information.
- **FR-008**: Type and code MUST be required for a new configuration, MUST jointly identify it, and MUST NOT be changeable after creation.
- **FR-009**: The system MUST reject a duplicate type-and-code identity on creation without saving the new configuration.
- **FR-010**: The system MUST validate values against the existing record definition's allowed lengths and formats, show errors on affected fields, and prevent invalid values from being saved.
- **FR-011**: Users MUST be able to create, view, update, and remove list item configurations.
- **FR-012**: The user MUST confirm a removal before a configuration is permanently removed. Configurations referenced by other records MUST NOT be removed, and the user MUST receive an explanation.
- **FR-013**: Users MUST be able to change a configuration's active status without removing it.
- **FR-014**: Page, filter, and sort state MUST be restored when the user leaves the listing and returns during the same browser session.
- **FR-015**: The listing's history action MUST make available created-by and last-updated-by information on hover or keyboard focus.
- **FR-016**: A valid update MUST be accepted even if another update was saved after the configuration was opened; the most recently saved values MUST remain.
- **FR-017**: Errors from list item operations MUST be communicated clearly without indicating that an unsuccessful operation succeeded.

### Key Entities *(include if feature involves data)*

- **List item configuration**: A reusable master-data entry identified jointly by its type and code. It has primary and alternate-language descriptions, optional short descriptions and value, an active status, and any additional business values defined by the existing record.
- **Configuration history**: The available information about who created and last updated a list item configuration.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can reach either List Item Master or the existing Company Master from the Masters menu in no more than two selections.
- **SC-002**: Users can find and open a listed configuration in no more than three interactions, excluding text entry.
- **SC-003**: In all tested same-session leave-and-return journeys, the listing restores its prior page, sort, and filters.
- **SC-004**: Every defined valid create, edit, and confirmed-removal acceptance scenario completes successfully, and every defined invalid-input, duplicate-identity, referenced-removal, or operation-failure scenario prevents the change and provides clear feedback.
- **SC-005**: In every tested view-and-edit journey, users can inspect a configuration and save or cancel edits without opening a separate edit page.
- **SC-006**: The listing displays all specified columns, and the history action exposes both created-by and last-updated-by information when available.

## Assumptions

- “Structured in the same way as Company Master” means the List Item Master includes list, view, create, update, and confirmed removal workflows, with a paginated and filterable listing and audit history.
- The existing `STD_LIST_ITEM` definition is the authority for field lengths, required values, and any additional business fields; this feature does not alter that definition.
- Type and code jointly identify a configuration, consistent with the existing record identity.
- Removal is permanent after confirmation; referenced configurations cannot be removed. Inactivation remains available as a separate status change.
- List state is retained for navigation within the same browser session, not across browser sessions.
- Concurrent valid updates use last-write-wins.
- The existing Masters menu and Company Master remain available and retain their current behaviour.
