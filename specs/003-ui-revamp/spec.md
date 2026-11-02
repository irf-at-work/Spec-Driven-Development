# Feature Specification: Dashboard and Company UI Revamp

**Feature Branch**: `003-ui-revamp`

**Created**: 2026-10-30

**Status**: Draft

**Input**: User description: "Revamp the UI with a modern, attractive, distinctive colour scheme and improve the tables and forms. Remove the sample 'Dashobard' text from the initial dashboard. In Company Master, remove the 'Master data' subheading and the loading text above the table; move the action column to the end and keep it visible while scrolling; allow column widths to be adjusted; replace the filter with a text field, an operator dropdown (starts with, ends with, contains, doesn't contain, equals to, not equals to) and a clear-filter button; improve the company add, view and edit layouts so fields keep their positions and values when moving between view and edit, and make add resemble view and edit; refine the table and pagination borders."

## Clarifications

### Session 2026-10-30

- Q: Which colour direction should replace the existing blue-based palette? → A: Use a refined warm-neutral palette with deep teal accents and restrained amber highlights, maintaining clear text and control contrast.
- Q: Should date columns be filterable in this stage? → A: No; date filters are not needed at this stage.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use a refreshed dashboard (Priority: P1)

An insurance broker opens the application and sees a polished, consistent interface without sample dashboard content distracting from the application shell.

**Why this priority**: The dashboard is the first screen users see and establishes the visual style for the rest of the application.

**Independent Test**: Load the application and inspect the dashboard shell and initial content area.

**Acceptance Scenarios**:

1. **Given** the application is opened, **When** the dashboard loads, **Then** the sample “Dashobard” text and other sample dashboard content are absent and the main content area is empty.
2. **Given** the dashboard and shared controls are displayed, **When** the user views them, **Then** they use a cohesive, modern, attractive colour scheme and a distinctive visual style for tables and forms.

---

### User Story 2 - Find companies in a clear, flexible table (Priority: P1)

An insurance broker scans and filters the Company Master list, adjusts its columns, and keeps row actions accessible while navigating the table.

**Why this priority**: The company list is the main entry point for company records, and its layout and filtering directly affect everyday use.

**Independent Test**: Open Company Master, inspect the table and pagination, resize columns, scroll horizontally, and try each filter operator and clear action.

**Acceptance Scenarios**:

1. **Given** Company Master is open, **When** the list is displayed, **Then** the “Master data” subheading and separate loading text above the table are absent, and the table does not shift vertically when data loads.
2. **Given** the company table is displayed, **When** the user scrolls horizontally, **Then** the action column is the final column and remains visible.
3. **Given** the company table is displayed, **When** the user adjusts a column width, **Then** that column visibly changes width without obscuring its contents or neighbouring controls.
4. **Given** a filterable company text column, **When** the user enters text and selects an operator, **Then** matching results follow the selected starts with, ends with, contains, doesn't contain, equals to, or not equals to rule.
5. **Given** a filter is active, **When** the user selects clear filter, **Then** that filter's text and operator are cleared and the unfiltered results are restored.
6. **Given** the company list and pagination are displayed, **When** the user views their edges, **Then** both have clear, consistent borders that distinguish them from surrounding content.

---

### User Story 3 - View, create, and edit companies in a consistent form (Priority: P1)

An insurance broker views an existing company, switches to editing without losing the position or value of any field, or opens a new-company form that follows the same layout.

**Why this priority**: Company creation and maintenance are core Company Master tasks; consistent field placement makes these tasks easier to understand and complete.

**Independent Test**: Open an existing company, switch between view and edit, verify each field stays in place and retains its value, then open the add-company form and compare its layout.

**Acceptance Scenarios**:

1. **Given** a company details view is open, **When** the user switches to edit mode, **Then** the fields remain in the same positions and their existing values are retained while editable fields become editable.
2. **Given** a company is in edit mode, **When** the user returns to view mode without changing the saved record, **Then** the same fields remain in the same positions and display the saved values.
3. **Given** the user opens the add-company form, **When** they compare it with the view and edit forms, **Then** fields use the same order, grouping, and layout, with empty values ready for entry.
4. **Given** the user is viewing, adding, or editing a company, **When** they inspect the form, **Then** its visual treatment is clear, polished, and consistent with the refreshed application style.

### Edge Cases

- When the company list has no results, the empty state and pagination remain clearly separated and usable without loading text causing a layout shift.
- When a user filters a column with no matches, the empty result is shown; clearing that filter restores the appropriate list.
- When a filter is active on a company field with an empty value, that row does not match; an empty search term applies no filter.
- When a user resizes a column near its minimum or maximum usable width, the table remains usable and its action column stays visible during horizontal scrolling.
- When a company has empty optional fields, switching between view and edit preserves the same field positions and does not invent values.
- When entering edit mode is cancelled, the current saved company values remain unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The initial dashboard MUST show the application shell with an empty main content area and MUST NOT show the sample “Dashobard” text or other sample dashboard content.
- **FR-002**: The dashboard and Company Master MUST use a cohesive, modern, attractive warm-neutral colour scheme with deep teal accents and restrained amber highlights, and a distinctive, non-generic visual treatment for tables and forms. Text and controls MUST remain clearly distinguishable from their backgrounds.
- **FR-003**: The Company Master page MUST NOT display the “Master data” subheading.
- **FR-004**: The company table MUST NOT display a separate loading text above it; loading data MUST NOT cause the table to jump vertically.
- **FR-005**: The company table MUST place its action column last and keep it visible during horizontal scrolling.
- **FR-006**: Users MUST be able to adjust the width of each company table column.
- **FR-007**: Each filterable company text-column filter MUST use a shared filter component that provides a text field, an operator dropdown with starts with, ends with, contains, doesn't contain, equals to, and not equals to, and a clear-filter button.
- **FR-008**: Applying a filter MUST match the column value according to the selected operator and entered text; clearing the filter MUST remove that column's filter and restore the corresponding results.
- **FR-009**: The company table and its pagination MUST have clear, consistent borders that visually define their boundaries.
- **FR-010**: Company view and edit modes MUST use the same field positions and order; switching from view to edit MUST retain the displayed field values and make the fields editable according to the existing company rules.
- **FR-011**: The add-company form MUST use the same field positions, order, grouping, and visual layout as the company view and edit forms, with empty values for a new record.
- **FR-012**: This feature MUST preserve existing Company Master data operations, field validation, and navigation behaviour except where explicitly changed by these requirements.
- **FR-013**: Company date columns MUST remain visible and sortable but MUST NOT have filter controls in this stage.

## Key Entities *(include if feature involves data)*

- **Company**: The existing company record displayed, filtered, created, or edited through Company Master; its data fields and business rules remain defined by the Company Master feature.
- **Company table state**: The visible company list and its active column filter and adjustable column widths during use.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In all initial-load acceptance checks, the dashboard shows no sample “Dashobard” content and the main content area is empty.
- **SC-002**: All six specified filter operators return results matching their stated rules, and clearing a filter restores the unfiltered list in every acceptance check.
- **SC-003**: In all horizontal-scroll acceptance checks, the action column is last and remains visible; each company column can be resized without making its controls unusable.
- **SC-004**: In all view-to-edit acceptance checks, every field remains in the same position and retains its value; add, view, and edit use the same field order and grouping.
- **SC-005**: In all table presentation acceptance checks, the table and pagination boundaries are visibly distinguishable, with no vertical jump caused by a separate loading message.

## Assumptions

- Existing Company Master business rules, fields, data, sorting, pagination, and navigation remain unchanged except for the explicitly requested presentation and filtering changes.
- Column width changes and active filters need only remain in effect while the user is working with the current table; long-term persistence was not requested.
- The dashboard remains an application shell and navigation entry point; “keep that empty” refers to the main dashboard content area, not removing the header or navigation.
- The application’s existing supported display sizes remain in scope; this feature does not introduce new device support requirements.
