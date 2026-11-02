# Feature Specification: Division and Department Master

**Feature Branch**: `004-division-department-master`

**Created**: 2026-11-02

**Status**: Draft

**Input**: User description: "Add division and department master data to Company Master. A company has one or more location-based divisions, and each division has one or more functional departments such as Finance or IT. Extend company creation with Basic Details, Division, and Department steps; add division cards and department associations to company details; and support editing, adding, and removing divisions and departments. Save each page's details immediately when Save or a save-and-navigation action is selected; do not defer persistence until all three pages are complete."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a company with divisions and departments (Priority: P1)

An insurance broker creates a company and, without losing the company details, continues through guided steps to add its location-based divisions and associate functional departments with one or more of those divisions.

**Why this priority**: The company-to-division-to-department structure is the core value of this feature and enables complete company records from the outset.

**Independent Test**: Create a company, add at least one division, add a department assigned to one or more of that company's divisions, and verify all information on the company details page.

**Acceptance Scenarios**:

1. **Given** the user starts adding a company, **When** the Basic Details step is displayed, **Then** a three-step progress indicator identifies Basic Details as current and shows Division and Department as the following steps.
2. **Given** the user has entered valid company details, **When** they select Save, **Then** those details are persisted immediately and the existing post-save flow is followed.
3. **Given** the user has entered valid company details, **When** they select Save and Exit, **Then** those details are persisted before the user leaves the add flow for the company details view.
4. **Given** the user has entered valid company details, **When** they select Save & Add Division, **Then** those details are persisted before the Division step opens for that company.
5. **Given** the user is on the Division step, **When** they add a division, **Then** an open division card appears for entering its details, and the user can collapse or remove that card after confirming the removal.
6. **Given** the user has entered valid division details, **When** they select Save and Exit, **Then** those division details are persisted before the company details view opens.
7. **Given** the user has entered valid division details, **When** they select Save & Add Department, **Then** those division details are persisted before the Department step opens.
8. **Given** the user is adding a department, **When** they open its division selector, **Then** they can select one or more divisions belonging to the current company, and no division from another company is available.
9. **Given** the user resets an add step, **When** the reset is confirmed or applied, **Then** the unsaved fields and cards on that step are cleared without deleting previously saved company data.
10. **Given** feature implementation is about to begin, **When** work starts, **Then** the missing `std_division` class is scaffolded before any other feature implementation.
11. **Given** a save action fails on any add step, **When** the save result is returned, **Then** the user remains on that step, sees an actionable error, and can retry without losing entered values; data successfully saved on earlier steps remains persisted.

### User Story 2 - Review company divisions and departments (Priority: P1)

An insurance broker opens a company and reviews its existing details together with the divisions and the departments associated with each division.

**Why this priority**: Users need to understand the full organisational structure while retaining the existing company details view.

**Independent Test**: Open a company with multiple divisions and associated departments and verify each division card and its department table.

**Acceptance Scenarios**:

1. **Given** a company has divisions, **When** the user opens its details, **Then** the existing company details remain visible and a Divisions section shows one card per division.
2. **Given** a division card is displayed, **When** the user expands it, **Then** its division details and a table of departments associated with that division are shown.
3. **Given** a division card is displayed, **When** the user collapses it, **Then** its details and department table are hidden while the division name remains visible as the card header.
4. **Given** a company has no divisions, **When** the user opens its details, **Then** the Divisions section displays a clear empty state.

### User Story 3 - Edit the company structure (Priority: P1)

An insurance broker edits a division, adds a new department or links an existing department, and removes a department association without changing other divisions' associations.

**Why this priority**: Organisational structures change over time, and users must be able to maintain them without recreating the company.

**Independent Test**: Edit a division in place, add a new department through the entry popup, link an existing department through its selection popup, and remove one department association; verify the resulting division and department information.

**Acceptance Scenarios**:

1. **Given** the user selects Edit on a division card, **When** edit mode begins, **Then** the division's basic details become editable in place and its department table has a sticky final action column with a delete icon for each department association.
2. **Given** a division is in edit mode, **When** the user selects Add New Department below its table, **Then** a popup opens to enter new department details and associate the department with the current division.
3. **Given** a division is in edit mode, **When** the user selects Add Existing Departments below its table, **Then** a popup allows the user to select existing departments belonging to the same company and associate them with the current division.
4. **Given** a department is associated with more than one division, **When** the user removes it from one division's table, **Then** the association with that division is removed and its associations with other divisions remain.
5. **Given** the user requests deletion of a division, **When** the confirmation is shown, **Then** it explains the effect and the division is removed only after confirmation; a division with department associations cannot be removed until those associations are resolved.
6. **Given** the user cancels a division or department-association removal confirmation, **When** the action ends, **Then** the division or association remains unchanged.

### Edge Cases

- The user attempts to save a company without the required company details; existing company validation prevents the save and identifies the fields that need correction.
- The user attempts to continue to Department without at least one saved division; the system explains that a division is required before a department can be assigned.
- The user attempts to save a department without selecting a division; the system prevents the save and identifies the missing assignment.
- A company, division, or department save fails; the user sees an actionable error, entered unsaved information is not presented as saved, and the user can retry.
- The user selects a save-and-continue or save-and-exit action; the current step is persisted before navigation, and the user never advances on an unsuccessful save.
- The user attempts to remove a department's final division assignment; the system prevents the department from being left without an assigned division and explains how to resolve the relationship.
- A selected existing department is already associated with the division; the system prevents duplicate association.
- The user closes a popup or navigates away with unsaved edits; the system does not report those edits as saved.
- A division has associated departments when deletion is requested; the system prevents deletion until those associations have been resolved.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST represent a completed company structure as a company with one or more divisions, each division belonging to one company and having one or more departments, and each department belonging to one or more divisions within the same company.
- **FR-002**: The system MUST provide a three-step company creation flow in this order: Basic Details, Division, Department, and MUST identify the current step in a progress indicator.
- **FR-003**: The Basic Details step MUST retain the existing company fields and validation and provide Reset, Save, Save and Exit, and Save & Add Division actions at the bottom of the page.
- **FR-004**: Reset MUST clear unsaved inputs and division cards on the current add step without removing previously saved records.
- **FR-005**: Save on Basic Details MUST follow the existing company-save flow. Save and Exit MUST save the company and leave the add flow for its details view. Save & Add Division MUST save the company and open its Division step.
- **FR-006**: The Division step MUST provide an Add New Division action at the top left that creates an open card for entering division details.
- **FR-007**: Each division entry card MUST provide collapse and delete actions; deleting an entry MUST require confirmation.
- **FR-008**: The Division step MUST provide Reset, Save and Exit, and Save & Add Department actions at the bottom. Save and Exit MUST save valid divisions and open the company details view; Save & Add Department MUST save valid divisions and open the Department step. Save and Exit MAY leave divisions without departments so the user can complete the structure later from company details.
- **FR-009**: The Department step MUST provide a multiselect division selector limited to divisions belonging to the current company and MUST require at least one division assignment for each saved department.
- **FR-010**: The Department step MUST provide Reset and Save actions at the bottom of the page; the duplicate Reset action listed in the request is omitted.
- **FR-011**: Save on the Department step MUST save each department and its selected division associations and open the company details view with the saved structure.
- **FR-012**: The company details view MUST retain all current company details and add a Divisions section containing a card for each division, with the division name as its header.
- **FR-013**: Each division details card MUST provide collapse, edit, and delete actions. Deletion MUST require confirmation and MUST be prevented while department associations remain unresolved.
- **FR-014**: An expanded division card MUST show the division's details and a table of departments associated with that division.
- **FR-015**: Editing a division MUST make its basic details editable in place and display a sticky final action column in its department table with an action to remove a department association.
- **FR-016**: The division edit view MUST provide Add New Department and Add Existing Departments actions below the department table.
- **FR-017**: Add New Department MUST open a popup to enter department details and associate the department with the current division.
- **FR-018**: Add Existing Departments MUST open a popup to select existing departments belonging to the same company and associate the selected departments with the current division.
- **FR-019**: Removing a department from a division MUST remove only that division's association; it MUST NOT remove the department or its associations with other divisions.
- **FR-020**: The system MUST prevent duplicate department associations within a division and provide a clear explanation.
- **FR-021**: The system MUST communicate company, division, and department validation or save failures clearly, preserve unsaved user input where possible, and never indicate success for an unsuccessful operation.
- **FR-022**: Before any other feature implementation begins, the missing `std_division` class MUST be scaffolded as the prerequisite for division work.
- **FR-023**: Save, Save and Exit, Save & Add Division, Save & Add Department, and Department Save MUST each persist all valid data entered on the current step before navigating or exiting; persistence MUST NOT be deferred until all three steps are complete.
- **FR-024**: If the current step's save fails, the system MUST remain on that step, preserve entered values where possible, show an actionable error, and allow retry. Successfully saved data from earlier steps MUST remain persisted.
- **FR-025**: The new creation steps and company details cards MUST follow the existing Company Master visual conventions for layout, spacing, colours, typography, and controls so the feature appears consistent with the rest of the application.

### Key Entities *(include if feature involves data)*

- **Company**: The existing company record, which owns one or more divisions.
- **Division**: A location-based unit belonging to one company, with its own details and department associations.
- **Department**: A functional area such as Finance or IT, belonging to one or more divisions within the same company.
- **Division–Department association**: The relationship connecting a department to a division; removing one association does not remove the department or its other associations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of tested valid guided journeys, users can complete all three company-creation steps and see the company, divisions, and department assignments on the company details page without re-entering saved information.
- **SC-002**: In 100% of tested invalid journeys, missing required company details, attempts to continue to Department without a saved division, missing department division assignments, and duplicate associations are prevented and clearly identified to the user.
- **SC-003**: In 100% of tested creation-flow screens, users can identify the active step from the progress indicator.
- **SC-004**: In 100% of tested division-edit journeys, changes to one department association do not alter that department's associations with other divisions.
- **SC-005**: In 100% of tested deletion journeys, cancellations leave records unchanged, and confirmed deletion does not proceed while unresolved department associations remain.
- **SC-006**: Users can review a company's existing details and its division/department structure in one details view.
- **SC-007**: At least 90% of first-time users in a usability test can complete the guided company, division, and department setup without assistance.
- **SC-008**: In 100% of tested save-and-continue and save-and-exit journeys, current-step data is persisted before navigation, and a failed save does not advance the user.

## Assumptions

- Division and department management is performed within a company's create and details flows; standalone division or department listing pages are not included in this feature.
- Departments are scoped to a company and may be associated with multiple divisions of that company; a department cannot be assigned across companies.
- A completed structure has at least one division, and each department is associated with at least one division. Division setup may be saved before departments are added because the user can exit the wizard and complete the structure later from company details.
- Each step is persisted independently when its Save or save-and-navigation action is selected; the wizard is not a single deferred transaction spanning all three steps.
- The requested `std_division` class is currently absent. Scaffolding that class is the first implementation prerequisite; no database or code changes are part of this specification step.
- Existing company details, fields, and validation remain unchanged except for the creation actions and the added division/department information.
- The Department step uses Reset and Save; the duplicated Reset action is omitted as confirmed by the user.
