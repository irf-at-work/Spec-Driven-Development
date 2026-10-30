# Feature Specification: Codes Master

**Feature Branch**: `sdd.muktha`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "Create the Codes Master feature specification for navigation, listing, add, edit, delete, audit details, and use of the existing Oracle STD_CODES data source."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse codes (Priority: P1)

As an application user, I can open Codes Master from the Master navigation and review existing code records and their creation details.

**Why this priority**: Users need to find and identify reference codes before they can manage them.

**Independent Test**: Open Master > Codes Master and verify the listing, record-specific creation details, empty state, and retrieval-error state.

**Acceptance Scenarios**:

1. **Given** the Master navigation is available, **When** the user selects Codes Master, **Then** the Codes Master listing opens.
2. **Given** code records exist, **When** the listing loads, **Then** it shows Code, Code Description, Type, Value 1, Value 2, and Actions in that order.
3. **Given** a listed record, **When** the user hovers over or focuses its audit target, **Then** the actual creation audit values for that record are shown.
4. **Given** no code records are available, **When** the listing loads, **Then** an understandable empty state is shown.
5. **Given** records cannot be retrieved, **When** the listing loads, **Then** an understandable error is shown and the failure is not presented as an empty successful result.

---

### User Story 2 - Add a code (Priority: P1)

As an application user, I can enter a code and its details on a dedicated page and save it as a new record.

**Why this priority**: Creating reference codes is a core Master-data task.

**Independent Test**: Open Add from the listing, complete the required fields, save, and verify that the persisted record appears in the listing with its creation audit details.

**Acceptance Scenarios**:

1. **Given** the listing is open, **When** the user selects Add, **Then** a separate Add Codes Master page opens, not a modal.
2. **Given** the Add page is open, **When** the user submits without Code or Code Type, **Then** field-level required errors are shown and no record is created.
3. **Given** valid, non-duplicate input, **When** the user saves, **Then** the record is created, success feedback is shown, and the user returns to the listing.
4. **Given** the Code and Code Type combination already exists, **When** the user saves, **Then** a clear duplicate-record message is shown and the existing record remains unchanged.
5. **Given** the Code matches an existing record but Code Type differs, **When** the user saves, **Then** the combination is not treated as a duplicate solely because Code matches.

---

### User Story 3 - Edit a code (Priority: P1)

As an application user, I can open an existing code on a dedicated page, review its stored values, and save changes without changing the identity or creation history of the record.

**Why this priority**: Users need to maintain reference data while preserving its identity and audit history.

**Independent Test**: Edit one record identified by Code and Code Type, save a changed descriptive value, and verify the same record is updated while its creation audit values remain unchanged.

**Acceptance Scenarios**:

1. **Given** a record is listed, **When** the user selects Edit, **Then** a separate Edit Codes Master page opens with the values for that Code and Code Type.
2. **Given** the edit page is open, **When** the user saves valid changes, **Then** the identified record is updated and the user returns to the listing with success feedback.
3. **Given** the record no longer exists, **When** the user attempts to edit it, **Then** a clear missing-record message is shown and no other record is changed.
4. **Given** an edit is submitted, **When** the operation completes, **Then** the original creation audit values are preserved and both update audit values remain NULL.

---

### User Story 4 - Delete a code (Priority: P2)

As an application user, I can deliberately confirm deletion of a selected code record and see whether the operation succeeded.

**Why this priority**: Removing obsolete reference data is necessary, while explicit confirmation protects against accidental loss.

**Independent Test**: Select Delete for a record, verify the confirmation identifies it by Code and Code Type, then confirm or cancel and verify the appropriate result.

**Acceptance Scenarios**:

1. **Given** a record is listed, **When** the user selects Delete, **Then** the user is asked to confirm before deletion and the record is identified by both Code and Code Type.
2. **Given** the user confirms deletion and it succeeds, **When** the operation completes, **Then** the record is removed from the listing and success feedback is shown.
3. **Given** the user cancels the confirmation, **When** the confirmation closes, **Then** the record remains unchanged.
4. **Given** deletion fails or is prevented by a database constraint, **When** the operation completes, **Then** an understandable error is shown and the record is not reported as deleted.

### Edge Cases

- A Code or other field exceeds its Oracle byte-length limit, including input with multi-byte characters.
- A duplicate Code and Code Type pair is submitted, or a Code is reused with a different Type.
- A record disappears between listing and edit or delete.
- A record contains NULL optional fields or NULL creation audit values.
- A record retrieval, insert, update, or delete operation fails.
- A user attempts to leave an Add or Edit page with unsaved changes.
- A user activates Add or Save repeatedly while a save is in progress.
- A deletion is rejected by an existing database constraint.
- The listing contains more records than fit on one page.

## Requirements *(mandatory)*

### Functional Requirements

#### Navigation and listing

- **FR-001**: The application MUST provide a `Master` navigation section containing a `Codes Master` item.
- **FR-002**: Selecting `Codes Master` MUST open a page headed `Codes Master`.
- **FR-003**: The listing MUST show the columns in this order: Code (`CC_CODE`), Code Description (`CC_DESC`), Type (`CC_TYPE`), Value 1 (`CC_VALUE1`), Value 2 (`CC_VALUE2`), and Actions.
- **FR-004**: The listing MUST place its `Add` button in the top-right corner and provide `Edit` and `Delete` actions for every record.
- **FR-005**: The listing MUST provide pagination with a default page size of 10 records. It MUST NOT add search, filtering, or sorting.
- **FR-006**: The listing MUST distinguish a successful empty result from a retrieval failure and display understandable user feedback for each.
- **FR-007**: After a successful add, edit, or delete, the user MUST return to the listing and receive a success message. An unsuccessful operation MUST NOT be reported as successful.
- **FR-008**: User-facing messages MUST use British/Indian English, explain the issue in plain language, and avoid credentials, connection strings, raw SQL, stack traces, and other sensitive implementation details.

#### Data source and identity

- **FR-009**: Codes Master MUST use the existing `IIRIS_RD_DEVP.STD_CODES` table as its authoritative data source; it MUST NOT create or use a replacement data table.
- **FR-010**: The feature MUST preserve the existing table schema and composite primary key `(CC_CODE, CC_TYPE)`. It MUST NOT introduce schema changes, additional uniqueness constraints, foreign-key relationships, or cascade-deletion rules.
- **FR-011**: The application MUST treat the combination of Code and Code Type as the unique record identity for retrieval, update, and deletion. The same Code with a different Type MUST remain a distinct key combination.
- **FR-012**: The application Company Code value MUST be derived from Code (`CC_CODE`) and stored in `CC_COMP_CODE`. No separate Company Code input, login-derived value, or unrelated hardcoded Company Code may be introduced.
- **FR-013**: Code, Code Type, and derived Company Code MUST satisfy the existing required-column constraints; Code and Company Code MUST each fit the 12-byte `VARCHAR2` limit, and Code Type MUST fit the 20-byte limit. No additional required fields may be asserted without an approved requirement.
- **FR-014**: The feature MUST use the supplied non-secret database endpoint details: service alias `ABSVDEVP`, schema/database user `IIRIS_RD_DEVP`, host `ABSVDBS`, TCP port `1521`, service name `absvdevp`, and dedicated server mode. The supplied connection descriptor has not been verified from the application environment. Passwords and other credentials MUST NOT appear in this specification or source-controlled configuration.

#### Add and edit pages

- **FR-015**: Selecting `Add` MUST open a dedicated Add Codes Master page, not a modal. Selecting `Edit` MUST open a dedicated Edit Codes Master page, not a modal.
- **FR-016**: The Add and Edit forms MUST present these fields in the following order and with the exact labels and maximum Oracle byte lengths:

  | Order | Label | Column | Maximum length |
  |---|---|---|---:|
  | 1 | Code | `CC_CODE` | 12 bytes |
  | 2 | Code Type | `CC_TYPE` | 20 bytes |
  | 3 | Code Description | `CC_DESC` | 100 bytes |
  | 4 | Short Description | `CC_SHORT_DESC` | 30 bytes |
  | 5 | Long Description | `CC_LONG_DESC` | 2000 bytes |
  | 6 | Value 1 | `CC_VALUE1` | 100 bytes |
  | 7 | Value 2 | `CC_VALUE2` | 100 bytes |
  | 8 | Flex 1 | `CC_FLEX_01` | 60 bytes |
  | 9 | Flex 2 | `CC_FLEX_02` | 2000 bytes |

- **FR-017**: Code and Code Type MUST be mandatory. The application MUST NOT assume that Code Type is a dropdown or derive its options from an unapproved source.
- **FR-018**: The forms MUST provide a `More` control, collapsed by default, that reveals these additional fields in order: Desc In Arabic (`CC_DESC_L2`, 100 bytes), Short Desc In Arabic (`CC_SHORT_DESC_L2`, 30 bytes), Long Description In Arabic (`CC_LONG_DESC_L2`, 2000 bytes), and Active Y/N (`CC_ACTIVE_YN`, 1 byte). Expanding or collapsing the section MUST preserve entered values.
- **FR-019**: All entered values MUST be validated against their database byte-length limits before persistence. Validation MUST account for Oracle `VARCHAR2(... BYTE)` semantics, MUST provide clear field-level errors, and MUST NOT silently truncate values.
- **FR-020**: The application MUST NOT assume allowed values, mandatory status, or a default for Active Y/N beyond the existing one-byte column limit.
- **FR-021**: Add and Edit pages MUST provide `Save`, `Cancel`, and `Back` actions. On Add, the page-header `Add` button and `Save` MUST perform the same form submission; only one submission may be in progress at a time. `Cancel` and `Back` MUST return to the listing, with a confirmation before discarding unsaved changes.
- **FR-022**: The Edit page MUST retrieve a record by both `CC_CODE` and `CC_TYPE`, populate all fields from stored values, and preserve the selected record identity. Code and Code Type MUST NOT be changeable during an edit in a way that could update a different record.
- **FR-023**: Missing records and database retrieval, insert, and update errors MUST result in clear user feedback. Failed operations MUST leave existing data unchanged and MUST NOT be presented as successful.
- **FR-024**: Repeated activation of Add or Save while a submission is pending MUST NOT create duplicate submissions.

#### Creation and update audit

- **FR-025**: Each new record MUST store the literal `ADMIN` in `CC_CR_BY` and use Oracle `SYSDATE` for `CC_CR_DT`. Neither field may be editable or supplied from a browser timestamp, session, request parameter, or authenticated user.
- **FR-026**: Ordinary edits MUST preserve the original stored `CC_CR_BY` and `CC_CR_DT` values.
- **FR-027**: `CC_UP_BY` and `CC_UP_DT` MUST be NULL on newly created records and remain NULL after edits. Update audit tracking is out of scope until authentication integration and its requirements are approved.
- **FR-028**: The listing MUST offer a record-specific, read-only way to view the actual stored creation audit values: Created By (`CC_CR_BY`) and Created Date (`CC_CR_DT`). A shared column heading alone is insufficient.
- **FR-029**: The audit details MUST be available on hover and through an equivalent keyboard-focus or touch interaction. NULL values MUST be represented clearly as not recorded; the tooltip MUST NOT expose unrelated audit information.
- **FR-030**: Creation dates MUST follow the project's GST `DD-MMM-YYYY` display convention. Because Oracle `DATE` stores no time-zone offset, the UI MUST preserve the stored calendar date unchanged and MUST NOT apply a time-zone conversion.

#### Integrity, deletion, and scope

- **FR-031**: A duplicate `(CC_CODE, CC_TYPE)` insert MUST produce a clear duplicate-record message and MUST leave the existing record unchanged. Reuse of Code with a different Type MUST NOT by itself be treated as a duplicate.
- **FR-032**: Deletion MUST require explicit confirmation and identify the selected record using both key fields. A cancelled deletion MUST leave the record unchanged. A failed or constraint-rejected deletion MUST show an error and MUST NOT be reported as successful.
- **FR-033**: Authentication and login behavior are outside this feature. The feature MUST NOT introduce login or authentication requirements.
- **FR-034**: The feature MUST follow the project constitution, which remains unchanged. It MUST NOT store database credentials in the specification or source-controlled application configuration.

### Acceptance Criteria

- **AC-001**: Given the Master navigation is visible, when the user selects Codes Master, then the Codes Master listing is displayed.
- **AC-002**: Given records are listed, when the listing is displayed, then its columns and row actions match FR-003 and FR-004 in the specified order.
- **AC-003**: Given the listing is open, when Add is selected, then a dedicated Add Codes Master page opens and the listing's Add button is top-right.
- **AC-004**: Given the Add page is displayed, when its fields are reviewed, then labels, order, and maximum byte lengths match FR-016 and FR-018; More starts collapsed and preserves values when toggled.
- **AC-005**: Given an Add form is submitted without Code or Code Type, when validation runs, then field-level errors appear and no record is created.
- **AC-006**: Given a field exceeds its Oracle byte limit, when it is submitted, then the value is rejected without silent truncation.
- **AC-007**: Given Code and Code Type satisfy validation and the key is unused, when the record is saved, then Company Code is derived from Code, the record is stored, creation audit values follow FR-025, update audit values are NULL, and the user returns to the listing with success feedback.
- **AC-008**: Given a composite key already exists, when an Add is attempted, then the duplicate is reported and the existing record remains unchanged; a matching Code with a different Type is not rejected solely for the Code match.
- **AC-009**: Given a listing row is edited, when the edit page opens, then the record is retrieved by both key fields, all specified values are populated, and its key cannot be changed to target another record.
- **AC-010**: Given valid edits are saved, when the update succeeds, then the same record is updated, its creation audit values are preserved, update audit values remain NULL, and the user returns to the listing with success feedback.
- **AC-011**: Given the selected record is missing or retrieval fails, when Edit is opened, then a clear error is shown and no different record is loaded or changed.
- **AC-012**: Given a user selects Delete, when the confirmation is shown, then both key fields identify the record; cancelling leaves it unchanged and confirming deletes only that composite-key record.
- **AC-013**: Given deletion fails or is blocked by a database constraint, when the operation completes, then the record is not reported as deleted and an understandable error is displayed.
- **AC-014**: Given a listing has no records, when it loads, then an empty state is shown; given retrieval fails, then an error state distinct from the empty state is shown.
- **AC-015**: Given more than 10 records are available, when the listing is used, then the user can navigate the paginated results with a default page size of 10 and no added search, filtering, or sorting.
- **AC-016**: Given a user activates Add or Save repeatedly while a save is pending, when the form is submitted, then only one submission occurs.
- **AC-017**: Given a form has unsaved changes, when Cancel or Back is selected, then the user is asked to confirm before the changes are discarded.
- **AC-018**: Given a record has creation audit values, when its row audit target is hovered over, keyboard-focused, or activated on a touch device, then actual stored Created By and Created Date values are shown; NULL values are clearly identified as not recorded.
- **AC-019**: Given a stored creation date is displayed, then its calendar date is preserved without time-zone conversion and formatted as `DD-MMM-YYYY` under the project GST display convention.
- **AC-020**: Given any database or validation operation fails, when feedback is displayed, then it explains the issue in plain language without exposing credentials, connection strings, raw SQL, or stack traces.
- **AC-021**: Given the feature is planned or implemented, when it is checked against project governance, then the existing table and schema remain unchanged, credentials remain absent from source-controlled files, and no authentication feature is introduced.

### Key Entities *(include if feature involves data)*

- **Code record**: A reference-data record containing a Code, Code Type, Company Code derived from Code, descriptions, values, flexible fields, active value, and creation/update audit fields. Its identity is the `(CC_CODE, CC_TYPE)` pair.
- **Creation audit details**: The stored creator and creation date associated with one code record; displayed as read-only, record-specific information.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the defined navigation, listing, add, edit, and delete acceptance scenarios produce their stated user-visible outcomes.
- **SC-002**: 100% of required-field and maximum-byte-length boundary checks reject invalid input before it is silently stored or truncated.
- **SC-003**: 100% of successful create and edit checks preserve the required composite identity and audit-field behavior.
- **SC-004**: At least 90% of representative users can complete a basic add or edit task on their first attempt without assistance.
- **SC-005**: Every unsuccessful retrieval or data change is distinguishable to the user from a successful result, and no user-facing error exposes a credential or raw technical diagnostic.

## Assumptions

- The supplied Oracle endpoint details are intended for this feature, but their connectivity from the application environment has not been verified.
- The existing `STD_CODES` table and its supplied column definitions are authoritative; no database modification is approved or required by this specification.
- No approved Codes Master specification or database configuration documentation was found in the repository. Where the request explicitly leaves behavior unspecified, this specification does not assert an allowed-value list, extra required field, or database default.
- Existing optional fields may contain NULL values. The user interface displays missing creation audit values as `Not recorded`.
- Users are not authenticated in this feature phase; `ADMIN` is the specified creation actor and update audit fields remain NULL.
- The page-header Add and form Save controls are two entry points to one guarded form submission, as specified in FR-021 and FR-024.
