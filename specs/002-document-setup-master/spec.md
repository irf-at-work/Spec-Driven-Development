# Feature Specification: Document Setup Master

**Feature Branch**: `002-document-setup-master`

**Created**: 2026-11-02

**Status**: Planning complete — ready for task breakdown

**Input**: User-provided Document Setup Master requirements.

## Clarifications

### Session 2026-11-02

- **Q1 — Stored values and child identity**: Doc Setup For choices come from Codes Master rows whose `CODE_TYPE` is `DOC_SETUP_FOR`; the current File Upload and Doc Print entries store `101` and `102`. The UI displays each code followed by its description, and the selected code is persisted. Parent and child data use `IIRIS_RD_DEVP.STD_DOCUMENT` and `IIRIS_RD_DEVP.STD_DOC_APPL_MODULE` through the Oracle connection already used by Codes Master. The provided DDL confirms `DOC_CODE` is the parent primary key, `DAMOD_UID` is a `NUMBER` child primary key, and `DAMOD_DOC_CODE` associates a child with its parent without a database foreign key. The application generates each child `DAMOD_UID` as `MAX(DAMOD_UID) + 1` within a serialized insert operation. No database sequence, table structure change, or parent-child constraint is to be added; the application must keep each child associated with its selected parent.
- **Q2 — Required parent fields**: Doc Code and Doc Setup For are required. Doc Name and Doc Description are optional.
- **Q3 — Fixed Asset ranges and duplicates**: All six range fields are optional. No From/To ordering validation is required. Multiple entries with the same Applicable For value are allowed for a document.
- Q: How should users filter the parent and child listings? → A: Use per-column filters for Doc Code, Doc Name, and Setup For on the parent listing and Applicable For on the child listing; support starts with, ends with, contains, does not contain, equal, and not equal, ignore case, and combine active filters with AND.
- Q: What accessibility behavior should the new Document Setup screens support? → A: Follow existing application conventions; require keyboard-operable controls, clear labels, visible focus, and announced validation and status messages.
- Q: What should happen if another user changes or removes a parent or child record while it is being edited? → A: Reject the stale save without overwriting newer data and show a clear message asking the user to reload.
- Q: Which values should the child Applicable Module listing show for each configuration? → A: Show Applicable For, all six range values, Mandatory Y/N, Active Y/N, and Actions; show `ALL` when no range code is selected.
- Q: What should happen if a user clicks Save or Delete repeatedly while the first operation is still processing? → A: Disable the action until completion, prevent duplicate submissions, and show progress feedback.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Find and review document setups (Priority: P1)

As an application user, I can open Document Setup from Masters and review existing document configurations so that I can find the document I need to manage.

**Why this priority**: Users need to locate a parent document before creating or maintaining its applicable-module configurations.

**Independent Test**: Open Masters > Document Setup and verify the listing, search, empty state, error state, and row actions.

**Acceptance Scenarios**:

1. **Given** the Masters navigation is expanded, **When** the user selects Document Setup, **Then** the Document Setup listing is displayed.
2. **Given** document records exist, **When** the listing loads, **Then** it displays Doc Code, Doc Name, Description, Setup For, Active Y/N, and Actions.
3. **Given** the listing is displayed, **When** the user searches using a supported field, **Then** only matching records are displayed.
4. **Given** no records exist, **When** the listing loads, **Then** a clear empty state is displayed.
5. **Given** records cannot be retrieved, **When** the listing loads, **Then** a clear error state is displayed instead of an empty successful result.
6. **Given** a document row is displayed, **When** the user selects Edit or Delete, **Then** the selected document is acted on and deletion requires confirmation.

### User Story 2 - Create a document setup (Priority: P1)

As an application user, I can create a document setup on a dedicated page so that the document can later be configured for applicable modules.

**Why this priority**: A parent document is required before any applicable-module configuration can be managed.

**Independent Test**: Open Add from the listing, enter valid document details, save, and verify that the document appears in the listing.

**Acceptance Scenarios**:

1. **Given** the listing is open, **When** the user selects Add, **Then** a separate blank parent-document form opens.
2. **Given** the parent form is open, **When** the user expands More, **Then** the Arabic name, Arabic description, and Active Y/N fields become visible.
3. **Given** valid required values are entered, **When** the user selects Save, **Then** the document is created, success feedback is shown, and the user returns to the listing.
4. **Given** required values are missing, **When** the user selects Save, **Then** the missing fields are identified and no document is created.
5. **Given** the user changes values, **When** the user selects Reset, **Then** the form returns to its initial blank state and default values.
6. **Given** the parent Add page is open, **When** the user selects the visible Add Applicable Module button, **Then** a separate child form page opens with Applicable For choices and the conditional fixed-asset range fields available from Codes Master.
7. **Given** a child form is open from the parent Add page, **When** the user saves a valid child, **Then** the child is staged and displayed in the Add page child listing while the entered parent values remain intact.
8. **Given** a parent and staged Applicable Modules are saved from the Add page, **When** creation succeeds, **Then** a success message is shown while the user remains on the Add page and the child listing shows the saved rows.
9. **Given** parent creation succeeds but an Applicable Module cannot be saved, **When** the user retries, **Then** the already-created parent is not submitted again and already-saved children are not duplicated.
10. **Given** either the Add or Edit page has no Applicable Modules, **When** the child listing is displayed, **Then** the empty-state message is centered and the Add Applicable Module button remains visible at the right side of the list header.

### User Story 3 - Maintain a document and its applicable modules (Priority: P1)

As an application user, I can edit a document and manage its applicable-module configurations so that each configuration remains associated with the right document.

**Why this priority**: Maintaining the parent and its child configurations is the main purpose of Document Setup.

**Independent Test**: Open an existing document, verify its saved values and child records, then add, edit, and save a child configuration and verify it remains under that document.

**Acceptance Scenarios**:

1. **Given** a document exists, **When** the user selects Edit, **Then** the parent form displays its saved values and associated child records.
2. **Given** the parent Edit page is open, **When** the user selects Add, **Then** a new child applicable-module form opens without creating another parent document.
3. **Given** the child form is open and Applicable For is not a fixed-asset type, **When** the form is displayed, **Then** only Applicable For, Mandatory Y/N, and Active Y/N are shown.
4. **Given** the child form is open and Applicable For is a fixed-asset type from Codes Master, **When** the form is displayed, **Then** Product From/To, PCM From/To, CCM From/To, Mandatory Y/N, and Active Y/N are shown.
5. **Given** a child record is edited, **When** its form opens, **Then** the saved Applicable For and values are loaded and the existing record remains the one being updated.
6. **Given** a child configuration is saved, **When** the user returns to the parent Edit page, **Then** the child appears in the selected document's child listing.
7. **Given** a child record is selected for deletion, **When** the user confirms deletion, **Then** only that child record is removed.
8. **Given** a parent or child form has unsaved changes, **When** the user attempts to leave without saving, **Then** the application asks for confirmation.

### User Story 4 - Delete a document setup (Priority: P2)

As an application user, I can deliberately confirm removal of a document setup and understand when it cannot be removed.

**Why this priority**: Users need to remove obsolete configuration, while protection against accidental loss and orphaned child configurations is essential.

**Independent Test**: Request deletion of a document with and without child configurations, confirm or cancel, and verify the resulting state and messages.

**Acceptance Scenarios**:

1. **Given** a document is listed, **When** the user selects Delete, **Then** a confirmation identifies the selected document.
2. **Given** the user cancels deletion, **When** the confirmation closes, **Then** the document and its children remain unchanged.
3. **Given** the user confirms deletion of a document with no child configurations, **When** deletion succeeds, **Then** the document is removed and success feedback is shown.
4. **Given** child configurations exist, **When** the user attempts to delete their parent, **Then** the application prevents removal and explains that the children must be handled first.

### Edge Cases

- The listing or an individual record cannot be loaded.
- A document or child record is changed or removed by another user between loading and saving; the stale save is rejected and the user is asked to reload.
- Required values are blank or exceed the supported field limits.
- A fixed-asset range has only one endpoint selected or has its From value after its To value.
- A parent has multiple child configurations, including more than one for the same Applicable For value.
- The user changes Applicable For from ASSET to ASR after entering range values.
- A child identifier cannot be generated or the selected parent cannot be associated.
- A delete operation fails because child records or another data constraint prevents it.
- The user navigates away while a parent or child form contains unsaved values.
- The user submits the same action repeatedly while it is in progress; the action is disabled until completion, duplicate submissions are prevented, and progress feedback is shown.

## Requirements _(mandatory)_

### Functional Requirements

#### Navigation and parent listing

- **FR-001**: The application MUST provide a Document Setup item under the Masters navigation section.
- **FR-002**: Selecting Document Setup MUST open a listing of existing document setups.
- **FR-003**: The listing MUST show Doc Code, Doc Name, Description, Setup For, Active Y/N, and Actions.
- **FR-004**: The listing MUST provide search/filter controls and an Add action.
- **FR-005**: The listing MUST provide Edit and Delete actions for each document and clearly distinguish empty, loading, and retrieval-error states.
- **FR-006**: The parent listing MUST provide per-column filters for Doc Code, Doc Name, and Setup For; the child listing MUST provide a per-column filter for Applicable For. Each filter MUST support starts with, ends with, contains, does not contain, equal, and not equal matching, ignore case, and apply all active filters before paging results. Multiple active filters MUST be combined so each must match.
- **FR-007**: The listing MUST provide pagination with a default page size of 10 and selectable page sizes of 10, 15, 20, and 50.

#### Parent document forms

- **FR-008**: The Add page MUST open as a separate blank parent form and MUST NOT contain the child applicable-module listing.
- **FR-009**: The parent form MUST provide Doc Code, Doc Name, Doc Description, Doc Setup, Flex 1, and Flex 2 fields.
- **FR-010**: Doc Setup For MUST be a required selection populated from Codes Master rows with `CODE_TYPE = DOC_SETUP_FOR`. Each option MUST display its code followed by its Code Description, and the selected code MUST be persisted. The current File Upload and Doc Print codes are `101` and `102`.
- **FR-011**: The More section MUST be collapsed by default and MUST contain Name in Arabic, Description in Arabic, and Active Y/N.
- **FR-012**: Active Y/N MUST default to Y for a new parent document.
- **FR-013**: Doc Code and Doc Setup For MUST be required. Doc Name and Doc Description MUST be optional. Parent validation MUST enforce supported field limits.
- **FR-014**: Saving a valid parent MUST persist its values, show success feedback, and return the user to the listing. A failed operation MUST show a useful error without reporting success.
- **FR-015**: Reset MUST restore an Add form to its initial blank values and an Edit form to the originally loaded values.
- **FR-016**: On the parent Edit page, Back MUST return to the listing. Add MUST begin creation of a child applicable-module configuration, not another parent.

#### Applicable-module configurations

- **FR-017**: The parent Edit page MUST display the selected document's associated child configurations in a listing with Applicable For, Product From/To, PCM From/To, CCM From/To, Mandatory Y/N, Active Y/N, and Actions. Range cells MUST show `ALL` when no range code applies or is selected.
- **FR-018**: Each child MUST remain associated with its parent document through creation, retrieval, update, and deletion.
- **FR-019**: Applicable For MUST be required and load its choices from Codes Master rows whose code type is `APPLICABLE_FOR`; the UI MUST display each code with its description and persist the selected code.
- **FR-020**: For non-fixed-asset Applicable For choices, the child form MUST show Applicable For, Mandatory Y/N, and Active Y/N only; product, PCM, and CCM range fields MUST NOT be shown.
- **FR-021**: When the selected Applicable For code or description identifies a fixed-asset type, the child form MUST show Applicable For, Product From/To, PCM From/To, CCM From/To, Mandatory Y/N, and Active Y/N.
- **FR-022**: Product options MUST load from Codes Master rows whose code type is `PRODUCT`; the UI MUST display each code with its description and persist the selected code or `ALL` when no code is selected.
- **FR-023**: PCM options MUST load from Codes Master rows whose code type is `PCM`; the UI MUST display each code with its description and persist the selected code or `ALL` when no code is selected.
- **FR-024**: CCM options MUST load from Codes Master rows whose code type is `CCM`; the UI MUST display each code with its description and persist the selected code or `ALL` when no code is selected.
- **FR-025**: Range dropdowns MUST display `ALL` and each code with its description. From and To fields of a range MUST use the same options. The complete master datasets MUST NOT be loaded as part of this feature.
- **FR-026**: A new child MUST default Mandatory Y/N to N and Active Y/N to Y.
- **FR-027**: All six ASSET range fields MUST be optional. The application MUST NOT reject a range based on From/To ordering. A document MAY have multiple child entries with the same Applicable For value.
- **FR-028**: A child form MUST provide Save, Reset, and Back. Back MUST return to the parent Edit page.
- **FR-029**: Child Edit MUST load the existing Applicable For and saved values, show the corresponding conditional fields, preserve the child's identity, and update that same child.
- **FR-030**: Child listing actions MUST provide Edit and Delete. Delete MUST require explicit confirmation and MUST remove only the selected child.
- **FR-031**: When Applicable For changes from ASSET to ASR, hidden range values MUST be saved as `ALL` to represent an Assured Master configuration with no range restriction.

#### Audit, navigation, and errors

- **FR-032**: Parent and child creation and update audit values MUST follow the existing Codes Master convention: ADMIN for the actor and the system date for the event date. Creation audit values MUST remain unchanged by updates.
- **FR-033**: Dates shown to users MUST use Gulf Standard Time and the format DD-MMM-YYYY.
- **FR-034**: Back navigation or another action that leaves a dirty form MUST request confirmation before discarding unsaved changes.
- **FR-035**: Failed operations MUST show a clear, actionable message without exposing internal exception details or presenting a failed operation as successful.
- **FR-036**: Parent deletion MUST NOT cascade to child configurations. If children exist, deletion MUST be blocked with a clear explanation.
- **FR-037**: Parent and child data MUST use `IIRIS_RD_DEVP.STD_DOCUMENT` and `IIRIS_RD_DEVP.STD_DOC_APPL_MODULE` through the Oracle connection already used by Codes Master. `DOC_CODE` is the parent primary key; `DAMOD_UID` is the `NUMBER` child primary key; and `DAMOD_DOC_CODE` associates each child with its parent. The application MUST assign each child `DAMOD_UID` as `MAX(DAMOD_UID) + 1` within a serialized insert operation to preserve uniqueness. The application MUST preserve the parent-child association. No database sequence, table structure change, or parent-child database constraint may be added.
- **FR-038**: All interactive controls MUST be keyboard-operable, form fields MUST have clear labels, keyboard focus MUST be visible, and validation and status messages MUST be available to assistive technology, following existing application conventions.
- **FR-039**: Before updating a parent or child, the application MUST verify that the record still exists and has not changed since it was loaded for editing. If it was removed or changed, the application MUST reject the stale save without overwriting data and show a clear message asking the user to reload.
- **FR-040**: While a parent or child Save or Delete operation is in progress, the action MUST be disabled, duplicate submissions MUST be prevented, and progress feedback MUST be shown. The action MUST become available again when the operation completes.
- **FR-041**: Parent and child listing data columns MUST be sortable in ascending and descending order; sorting MUST be applied on the server before pagination and retain a stable tie-breaker.
- **FR-042**: Optional listing values MUST render as blank when absent; explicitly stored `ALL` values MUST remain visible.

### Scope Boundaries

Included: parent document listing and CRUD, child applicable-module listing and CRUD, conditional fields, filtering, validation, audit display, reset, navigation, and user-facing error handling.

Excluded: creating or changing database structures or field definitions, integrating dropdowns with master-data services, implementing document upload or printing workflows, adding authentication, and changing unrelated master modules.

### Key Entities

- **Document Setup**: A parent configuration identified by a document code, with document names and descriptions, setup type, optional flex values, active state, and creation/update audit details.
- **Applicable Module Configuration**: A child configuration owned by one Document Setup, specifying whether the document applies to an Assured Master or Fixed Asset, optional range selections, mandatory and active states, and audit details.
- **Range Option**: A selectable code and human-readable description used by Product, PCM, or CCM From/To fields.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can reach the Document Setup listing and start a parent creation flow in no more than two navigation selections.
- **SC-002**: In all tested valid parent and child save flows, reopening the record displays the saved values and the correct parent-child association.
- **SC-003**: In 100% of tested ASR and ASSET form states, only the fields specified for the selected Applicable For value are visible.
- **SC-004**: In 100% of tested invalid submissions, the user receives a clear validation message and no invalid record is saved.
- **SC-005**: In all tested cancellation and deletion flows, cancelling leaves the data unchanged, and deletion never removes child records through parent cascading.
- **SC-006**: Users can complete the primary listing, parent add/edit, and child add/edit tasks without encountering an unhandled error or an ambiguous success state.
- **SC-007**: All Document Setup flows can be completed using a keyboard, and form labels, visible focus, and validation/status messages are available to assistive technology.
- **SC-008**: In all tested stale parent and child edit submissions, changed or removed records are not overwritten and the user is asked to reload.
- **SC-009**: In all tested repeated-click cases during parent and child saves or deletes, only one operation is submitted and progress feedback is shown until completion.

## Assumptions

- The feature operates on the existing parent and child document configuration records; it does not create database tables or change existing column definitions.
- Parent and child records are stored in the existing `IIRIS_RD_DEVP.STD_DOCUMENT` and `IIRIS_RD_DEVP.STD_DOC_APPL_MODULE` tables using the Codes Master Oracle connection; the provided DDL defines their columns, field limits, and primary keys.
- File Upload and Doc Print persist as `101` and `102`, respectively.
- Child `DAMOD_UID` values are generated by the application as `MAX(DAMOD_UID) + 1` within a serialized insert; no database sequence is used or created.
- Doc Code and Doc Setup For are required; Doc Name and Doc Description are optional.
- Fixed Asset ranges are optional, have no From/To ordering validation, and may be repeated for the same Applicable For value.
- The application has no authentication requirement for this feature.
- Existing project conventions for clear error feedback, paginated listings, and audit actor/date values are reused.
- Parent listing filters are Doc Code, Doc Name, and Setup For; the child listing filter is Applicable For. Each filter supports starts with, ends with, contains, does not contain, equal, and not equal matching; matching ignores case and multiple active filters are combined with AND before paging.
- Fixed Asset range selections are optional, and no From/To ordering rule is applied.
- Hidden range values are saved as `ALL` when Applicable For changes from ASSET to ASR.
- Parent deletion is blocked while child configurations exist; no cascading deletion is performed.
- Unsaved changes are confirmed before navigation away from Add, Edit, or child forms.
- The known hardcoded Product, PCM, and CCM options are the complete option sets for the initial release.
- Dates are presented in Gulf Standard Time using DD-MMM-YYYY.
