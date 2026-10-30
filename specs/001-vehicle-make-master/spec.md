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

### Session 2026-10-29 (addendum: vehicle models)

- Q: Where do vehicle models appear? → A: On the Vehicle Makes page only, and only when a saved make is opened (read-only view or editing). They are never shown when a new make is being added.
- Q: How are models maintained? → A: ~~Inline on that page~~ **Superseded 30-Oct-2026 (see the last addendum below):** models are listed on the make's page, added and edited on their own pages, and deleted from the list with confirmation. Models are stored in the Oracle table `BRM_VEH_MODEL`, and each model belongs to one make through `VMOD_VMAK_CODE`.
- Q: What is the key of the models table? → A: `VMOD_VMAK_CODE` plus `VMOD_CODE` together are the primary key, and `VMOD_VMAK_CODE` is also a foreign key to the make. So the same Model Code can exist under different makes, but only once within a make.
- Q: How are the 12-character model fields (variant, type, body type, fuel type, cylinders, doors, driving type, body colour, category) filled in? → A: Every one of them is a dropdown whose choices come from the table `STD_LIST_ITEM`, selected by its `LI_TYPE`. The list types used are named in the data model so the owner can load the data.

### Session 2026-10-29 (addendum: Active flag as soft delete)

- Q: How are records soft deleted? → A: With an Active setting on the entry page. It is on (ticked) by default when a record is being added, and the user can turn it off while adding or while editing, and turn it on again later. It is stored as `Y` (on) or `N` (off). This replaces the earlier decision that the page would not read or write the active column, and it applies to every master page and every story that adds or edits a record: vehicle makes, vehicle models and premium adjustment codes.
- Q: What happens when a make that still has models is permanently deleted? → A: The system refuses deletion and tells the user to delete its models first.
- Q: Should permanent deletion remain available alongside the Active setting? → A: Yes. Keep permanent deletion for vehicle makes and models, with confirmation; Active remains the reversible way to retire and restore records.
- Q: Are the proposed vehicle-model field rules correct? → A: Yes. Engine capacity, seats, passengers, drivers, and make year are non-negative whole numbers; seats, passengers, and drivers are limited to 3 digits, make year to 4 digits, value is a non-negative AED amount, and weight and load capacity are text up to 100 characters.
- Q: Should model-field dropdown choices be paged? → A: No. Keep the small lookup dropdowns unpaged and record an exception under constitution C3 before implementation.

### Session 2026-10-30 (addendum: column filters, model pages and icon actions)

- Q: How is searching done on the lists? → A: The global search box is removed. Every visible data column of the makes list (Make Code, Make Name, Short Name, Status) and of the models list inside a make (Model Code, Model Name, Short Name, Status) has its own filter. The text columns offer an operator dropdown: starts with, ends with, contains, equal to, not equal to. Status is a choice of Active or Inactive, with equal to and not equal to only. The Actions column has no filter.
- Q: Do models get filters and sorting? → A: Models get column filters like makes. Sorting within models is still not included; models stay in Model Code order.
- Q: Where are models added and edited? → A: On their own pages, not in place on the make's page. This supersedes the "inline" answers above. The make's page still lists the make's models (display-only when editing is off) and still shows no models section for a new make.
- Q: How are the row and page actions shown? → A: As icons (add, open, edit, delete), each with a tooltip and an accessible name for screen readers, instead of words.
- Confirmed by the owner on 30-Oct-2026:
  - Filters combine (a record must match all of them), ignore upper or lower case, start with "contains", take effect shortly after typing stops, and return the list to page 1. A blank filter is ignored.
  - "Not equal to" also lists records whose value is empty (owner confirmed).
  - The model add and edit pages are reached from the make's page, and saving returns the user to that make. Adding, editing and deleting a model stay available only while the make's editing is switched on.
  - Leaving the make's page for a model page while the make has unsaved changes asks for confirmation first.
- Q: What is wrong with the readability? → A: The text is too small and the font is not good looking. The owner wants larger text and one clear, good-looking typeface used everywhere. Decision: Inter for English text and Noto Sans Arabic for Arabic text.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find and browse vehicle makes (Priority: P1)

As an insurance broker, I want one filterable, sortable list of vehicle makes so that I can find and consistently select a make for insurance records.

**Why this priority**: The list is the primary way brokers use and verify the master data.

**Independent Test**: Create enough vehicle makes to span multiple pages, then filter by column, sort, and navigate the list and open a make read-only.

**Acceptance Scenarios**:

1. **Given** there are vehicle makes, **When** the user opens the list, **Then** the list shows no more than 10 makes per page, initially sorts by Make Code, and provides page navigation.
2. **Given** matching makes exist on different pages, **When** the user filters a column (for example Make Name starts with "T"), **Then** matching results are found across all records, not only the current page, and filters on several columns together show only the makes that match all of them.
3. **Given** makes exist on different pages, **When** the user sorts by a column, **Then** the ordering applies across all records, not only the current page.
4. **Given** the list shows a vehicle make, **When** the user selects Open, **Then** that make opens in read-only view.
5. **Given** makes with Active on and off exist, **When** the user views the list, **Then** each row shows its Active status; inactive makes stay in the list and can still be opened.
6. **Given** the list is open, **When** it appears, **Then** there is no global search box; each data column offers its own filter, the text columns with an operator choice (starts with, ends with, contains, equal to, not equal to) and Status with Active or Inactive.
7. **Given** a filter matches nothing, **When** the results appear, **Then** an empty-results message is shown that does not imply records were deleted, and clearing the filter brings the full list back.

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
11. **Given** the add form is open, **When** it appears, **Then** Active is on by default; the user may turn it off before saving, and the saved make keeps the chosen status.

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
7. **Given** a make is open in read-only view, **When** its details are displayed, **Then** its Active status is shown but cannot be changed; **Given** editing is switched on, **When** the user turns Active off and saves, **Then** the make is soft deleted (it stays in the list, marked inactive), and turning Active on again and saving restores it.

### User Story 4 - Permanently delete a vehicle make (Priority: P2)

As an insurance broker, I want to permanently delete a make only after an explicit warning and confirmation so that accidental removal is avoided.

**Why this priority**: Removal is necessary for maintaining the list, but is less frequent and irreversible.

**Independent Test**: Request deletion of a make without models, cancel it and verify the record remains; confirm deletion and verify the record is removed. Then request deletion of a make with models and verify deletion is refused with instructions to remove the models first.

**Acceptance Scenarios**:

1. **Given** the user requests deletion of a make with no models, **When** the confirmation dialog appears, **Then** it states that deletion is permanent and cannot be undone.
2. **Given** the confirmation dialog is open, **When** the user cancels, **Then** the make remains unchanged.
3. **Given** the confirmation dialog is open, **When** the user confirms, **Then** the make is permanently removed and no restore action is offered.
4. **Given** a make still has one or more models, **When** the user requests permanent deletion, **Then** deletion is refused and the user is told to delete the models first.

### User Story 5 - Manage the models of a vehicle make (Priority: P2)

As an insurance broker, I want to see the models of a vehicle make on that make's page, and to add and change them on their own pages, so that I can keep a make and its models together.

**Why this priority**: Models belong to a make, so a make must exist first. A dedicated page gives the many model details room to be read and filled in comfortably.

**Independent Test**: Open a saved make, add a model on its own page, change it on its own page, and delete it from the list with confirmation; then open the add form for a new make and verify that no models section appears.

**Acceptance Scenarios**:

1. **Given** the add form for a new make is open, **When** the page is displayed, **Then** no models section is shown.
2. **Given** a saved make is opened read-only, **When** its details are displayed, **Then** a models section lists only that make's models, no more than 10 per page, initially sorted by Model Code, with page navigation and a filter on each data column (FR-030); the models are display-only and no add, edit or delete action is offered.
3. **Given** a make is open and editing is switched on, **When** the user selects the add-model action, **Then** the add-model page opens, showing which make the model will belong to (the user does not enter the Make Code again), and saving a valid model returns the user to the make's page where the model appears in the list.
4. **Given** editing is switched on, **When** the user selects edit on a model, **Then** the edit-model page opens with its Model Code locked, and saving valid changes updates the model and returns the user to the make's page.
5. **Given** a model page has unsaved changes, **When** the user cancels or tries to leave the page, **Then** they are asked whether to discard the changes; confirming discards them and cancelling keeps the page open and the changes.
6. **Given** editing is switched on, **When** the user requests deletion of a model, **Then** a dialog states that deletion is permanent and cannot be undone; confirming removes only that model and cancelling leaves it unchanged.
7. **Given** the user leaves Model Code blank, uses characters other than letters, digits or hyphens, or exceeds a field's limit, **When** they save, **Then** the field is identified and the model is not saved.
8. **Given** the Model Code already exists under the same make, **When** the user saves, **Then** the user is told that the code already exists for this make and nothing is saved.
9. **Given** a make has no models, **When** it is opened, **Then** an empty-state message is shown and, while editing is on, the add-model action is available.
10. **Given** a model is successfully created or changed, **When** it is saved, **Then** it is stamped with user `admin`.
11. **Given** the model page is open for adding or editing, **When** the user opens a dropdown (variant, type, body type, fuel type, cylinders, doors, driving type, body colour or category), **Then** it offers the active items of that dropdown's list type, shown by their English description; choosing one stores its code, and the dropdown may be left empty because every one of them is optional.
12. **Given** the add-model page opens, **When** it appears, **Then** Active is on by default and the user may turn it off before saving; **Given** a model is edited, **Then** its Active status can be turned off or on on the same page, and every model row in the list shows its Active status, with inactive models staying in the list.

## Edge Cases

- Filtering with no matches shows an empty-results state and does not imply that records were deleted.
- Changing filters or sort order while on a later page returns the user to a valid page of results.
- Make Code is required, cannot be null or empty, and must be unique.
- Leading or trailing whitespace and repeated spaces are removed from non-Arabic text fields. Arabic values, including all spacing, remain exactly as entered.
- Arabic Make Name, Short Name, and Remarks are limited to 100, 30, and 2000 characters respectively.
- Permanent deletion is irreversible. A make with models cannot be permanently deleted until its models are removed (FR-026); no other usage checks apply. Soft deletion and restoration are done by turning Active off or on (FR-027), not with a separate action.
- The same Model Code may be used under different makes; it must be unique only within its own make. The primary key of `BRM_VEH_MODEL` is `VMOD_VMAK_CODE` plus `VMOD_CODE`, and `VMOD_VMAK_CODE` is also a foreign key to the make (owner-confirmed 29-Oct-2026).
- Saving a model never saves or discards unsaved changes to the make's own details, and the reverse is also true.
- A model whose make has been deleted by someone else is reported as not found; no stack trace or raw server message is shown.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a list of vehicle makes with no more than 10 records per page, initially sorted by Make Code, and controls to move between pages.
- **FR-002**: The system MUST allow users to filter the vehicle makes list by column as described in FR-030, and to sort by Make Code, Make Name, and Short Name across all vehicle makes, not only the currently displayed page.
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
- **FR-016**: The system MUST show a models section only when a saved make is opened (read-only or editing) and MUST NOT show it when a new make is being added.
- **FR-017**: The models section MUST list only the models of the open make, with no more than 10 per page, initially sorted by Model Code ascending, with controls to move between pages. Sorting within models is not included; filtering is (FR-030).
- **FR-018**: The system MUST allow models to be added and edited on their own pages, reached from the make's page, and deleted from the models list with confirmation. These actions MUST be available only while editing of the make is switched on; in read-only view the models are display-only.
- **FR-019**: The system MUST require a non-null, non-empty Model Code of up to 12 characters containing only letters, digits, and hyphens; it MUST be saved in capitals, MUST be unique within its make, and MUST NOT change after creation.
- **FR-020**: The system MUST require a Model Name of up to 100 characters and a Short Name of up to 30 characters, and MUST apply the same text normalisation as for makes (FR-006). It MUST provide optional Remarks up to 2000 characters and optional Arabic Name (100), Arabic Short Name (30) and Arabic Remarks (2000), which MUST be shown right to left and preserved exactly, including spacing.
- **FR-021**: The system MUST allow the other model details listed in the data model (variant, type, weight, load capacity, body type, fuel type, engine capacity, cylinders, seats, passengers, drivers, doors, make year, driving type, body colour, value in AED and category) as optional values that respect their limits. Number fields MUST accept only valid numbers within their size. Variant, type, body type, fuel type, cylinders, doors, driving type, body colour and category MUST each be chosen from a dropdown filled from the standard list items of the matching list type (named in the data model), and the system MUST refuse a code that is not one of the active items of that type, even if the screen sent it.
- **FR-022**: Saving, discarding or deleting a model MUST NOT depend on the make's own unsaved changes. Cancelling or leaving a model page while it has unsaved changes MUST ask for confirmation before discarding them.
- **FR-023**: The system MUST request confirmation before deleting a model and state that deletion cannot be undone. Confirmed deletion MUST permanently remove only that model; cancelled deletion MUST leave it unchanged.
- **FR-024**: Every successfully created or changed model MUST be stamped with the user `admin`.
- **FR-025**: The system MUST tell the user when a Model Code already exists for the make and MUST NOT save the duplicate.
- **FR-026**: The system MUST refuse permanent deletion of a vehicle make that still has one or more models and MUST tell the user to delete its models first.
- **FR-027**: Every vehicle make MUST have an Active setting. It MUST be on by default when a make is added. The user MAY turn it off while adding or editing, and MAY turn it on again while editing. In read-only view it MUST be shown but not changeable. It is stored as `Y` or `N`. Turning it off MUST NOT remove the make, MUST NOT change its models, and MUST NOT make the make unreadable.
- **FR-028**: Every vehicle model MUST have the same Active setting, with the same default and behaviour, on its page (adding and editing). It is stored as `Y` or `N`, independently of the make's Active setting.
- **FR-029**: The list of makes and the list of models MUST show each record's Active status. Inactive records MUST stay in the list and MUST be openable.
- **FR-030**: The system MUST NOT offer a single global search box. Instead, every visible data column of the vehicle makes list and of the models list MUST have its own filter. Text columns MUST offer the operators starts with, ends with, contains (the default), equal to and not equal to; the Status column MUST offer Active or Inactive with equal to and not equal to. Filters MUST ignore upper and lower case, MUST combine so that a record must match all of them, MUST apply across all records and not only the current page, MUST return the list to page 1 when they change, and a blank filter MUST be ignored. Characters the user types MUST be treated as plain text, never as search patterns.
- **FR-031**: Row and page actions (add, open, edit, delete and going back) MUST be shown as icons, and each icon MUST have a tooltip that names the action and an accessible name for screen readers.
- **FR-032**: Text on every screen MUST be easy to read: body text MUST be at least 16px and table text at least 15px, with comfortable row spacing, Inter MUST be used for all English text and Noto Sans Arabic for Arabic text, and both MUST be available without an internet connection. [NEEDS CLARIFICATION: the sizes (16px and 15px) are proposed values for the owner to confirm.]

### Key Entities *(include if feature involves data)*

- **Vehicle Make**: A master record identifying a vehicle make, with Make Code, Make Name, Short Name, optional remarks and Arabic equivalents, an Active status (soft delete), and a record of the user who created or last changed it.
- **Vehicle Model**: A record that belongs to exactly one Vehicle Make. It has a Model Code (unique within its make), Model Name, Short Name, optional remarks and Arabic equivalents, optional technical and commercial details (such as fuel type, seats, make year and value), an Active status, and a record of the user who created or last changed it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Brokers can find a make by filtering any column across all records and can sort the full result set by a chosen column.
- **SC-002**: The list displays at most 10 records on each page and supports navigation through all matching records.
- **SC-003**: 100% of successful create and edit actions save values within the stated field limits and text rules; invalid or duplicate values are not saved.
- **SC-004**: Every deletion that is allowed to proceed requires explicit confirmation, and cancelling leaves the record unchanged. Permanent deletion of a make with models is refused.
- **SC-005**: Created and changed records show `admin` as the recorded user.
- **SC-006**: A broker can add and change a model on its own page and remove it from that make's models list, and 100% of model deletions require explicit confirmation. No models section ever appears while a new make is being added.
- **SC-007**: A broker can soft delete and restore a make or a model by turning Active off or on, in the add and edit views; Active is on by default when adding, and every list shows each record's Active status.

## Assumptions

- Repeated and leading/trailing spaces are normalized in non-Arabic fields. Arabic fields are preserved exactly, including their spacing.
- Filtering is available on every visible data column (FR-030). Sorting is available for Make Code, Make Name and Short Name and operates on the full set of vehicle makes; the initial list order is Make Code ascending.
- Permanent deletion remains available for vehicle makes and models alongside Active soft deletion. Active is the reversible way to retire and restore records; permanent deletion requires confirmation, and a make with models cannot be permanently deleted until its models are removed.
- Sign-in, permissions, usage checks against records other than a make's own models, and edit-conflict warnings are out of scope. Soft deletion and restoration are done with the Active flag (FR-027), not with a separate action.
- Model required fields mirror the make: Model Code, Model Name and Short Name. Every other model field is optional; Active is always saved as `Y` or `N`.
- Model numbers: engine capacity, seats, passengers, drivers and make year are whole numbers of zero or more (seats, passengers and drivers up to 3 digits; make year four digits); value is an amount in AED of zero or more. Weight and load capacity are free text up to 100 characters.
- Model changes save immediately, one model at a time, and do not wait for the make to be saved.
- Dropdown choices are the items of the list type whose `LI_ACTIVE_YN` is `Y`, ordered by English description. A model that already holds a code which has since been made inactive still shows that code and can be saved unchanged; the code is not offered to anyone choosing a new value. The Arabic description of an item is not shown on this page.
- Inactive makes and models stay visible in their lists, marked inactive. This feature has no filter that hides them except the Status filter the user chooses to apply (FR-030). It only stores and shows the flag; how other pages use it is outside this feature.
- Turning a make off does not change its models, and the reverse is also true.
- The model-field dropdown lists are small lookups loaded once when a model page is opened, so they are not paged. This owner-approved exception to the constitution's B8 paging rule MUST be recorded under C3 before implementation.
