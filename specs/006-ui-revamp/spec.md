# Feature Specification: Premium Insurance Brokerage UI Revamp

**Feature Branch**: `006-ui-revamp`

**Created**: 2026-11-03

**Status**: Draft

**Input**: User description: "Create a comprehensive UI/UX revamp specification for the existing Insurance Broker Management application based on the attached test.md requirements. Analyse the current application first. Use a premium financial platform direction with restrained glassmorphism. Do not implement the revamp or change application source code."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Work in a cohesive brokerage platform (Priority: P1)

An insurance broker opens the application and uses its existing navigation and master-data pages. The shared visual language makes the application feel like one professional financial-services product without adding screens or changing where existing navigation leads.

**Why this priority**: The shared shell is present across the routed application and sets the visual context for every subsequent task.

**Independent Test**: Visit the dashboard, Company Master, and List Item Master at desktop, tablet, and mobile widths; compare navigation, page headings, spacing, colours, controls, and focus states.

**Acceptance Scenarios**:

1. **Given** the user opens the application, **When** the dashboard route loads, **Then** the existing Broker Portal header and Masters navigation remain available and no new dashboard content or invented feature is introduced.
2. **Given** the user navigates between existing master pages, **When** each page renders, **Then** its typography, colours, page spacing, actions, and controls follow the same design system.
3. **Given** the user opens the Masters menu, **When** they choose Company Master or List Item Master, **Then** the existing destination and navigation behaviour are unchanged.

### User Story 2 - Find and open a company (Priority: P1)

An insurance broker scans, filters, sorts, and pages through Company Master, then opens a company record using the familiar table and its row actions.

**Why this priority**: Company Master is the primary entry point to company information and must remain efficient for daily use while receiving the most visible table refinement.

**Independent Test**: Open Company Master, verify every current data column and filter, use sorting and pagination, apply and clear each supported text-filter operator, resize columns, horizontally scroll, and open a company.

**Acceptance Scenarios**:

1. **Given** the company list has loaded, **When** the user scans it, **Then** the existing 11 data columns remain present: company name, short name, primary address, incorporation date, reference number, licence issue date, licence expiry date, company in charge, phone, email, and website.
2. **Given** the user filters a text column, **When** they choose Starts with, Ends with, Contains, Doesn't contain, Equals to, or Not equals to, **Then** results continue to follow that operator and the existing query-state behaviour.
3. **Given** the user scrolls the wide table horizontally, **When** they reach any horizontal position, **Then** the Actions column remains at the trailing edge and usable.
4. **Given** the user sorts, paginates, or opens a row, **When** the action completes, **Then** the existing sort, page, URL query state, row navigation, and return-to-list behaviour remain intact.

### User Story 3 - Review and maintain a company and its structure (Priority: P1)

An insurance broker reviews a company’s details and audit history, edits or deletes the company using existing controls, and manages its divisions and departments without losing information or orientation.

**Why this priority**: Company details contain high-value operational information and the nested division/department workflows; better hierarchy must not disrupt these existing tasks.

**Independent Test**: Open a company with multiple divisions and departments, review all company fields and audit entries, expand and collapse divisions, enter and cancel edit mode, and exercise the existing division and department dialogs.

**Acceptance Scenarios**:

1. **Given** a company record is open, **When** the user reviews it, **Then** all existing company information remains available, logically grouped, and distinguishable from section headings and secondary values.
2. **Given** the user switches a company between view and edit, **When** the mode changes, **Then** fields stay in the same order and visual positions, current values are retained, and the existing validation and save/cancel behaviour remain unchanged.
3. **Given** the company has audit values, **When** the user reviews Audit history, **Then** the existing created-by/created-date and last-updated-by/last-updated-date pairs are easy to scan, dates remain in GST, and no audit events are fabricated.
4. **Given** the company has multiple divisions, **When** the user expands a division, **Then** the division information, edit controls, and its departments listing remain clearly grouped and usable without hiding sibling divisions or essential actions.
5. **Given** a division has no departments or cannot be deleted while departments remain assigned, **When** the user views the corresponding state, **Then** the existing empty or explanatory message and available actions remain visible and understandable.

### User Story 4 - Create a company or manage a list item (Priority: P2)

An insurance broker creates a company through the existing company setup steps or creates and edits a List Item Master record using the same visual language as the rest of the application.

**Why this priority**: These are existing workflows that complete the master-data experience, and consistent forms reduce avoidable errors without changing business rules.

**Independent Test**: Open Add company and progress through its existing setup steps; separately open List Item Master, filter and page its table, and open the existing create and edit forms.

**Acceptance Scenarios**:

1. **Given** the user opens Add company, **When** they enter basic details and continue through division and department setup, **Then** the existing step order, fields, validation, save actions, and navigation remain unchanged.
2. **Given** the user opens a company or list-item form, **When** they enter invalid or valid values, **Then** existing field requirements, validation messages, server errors, and submission behaviour remain unchanged and are visually clear.
3. **Given** the user views List Item Master, **When** they use its filters, active-status selection, sorting, pagination, history tooltip, or row navigation, **Then** each existing control remains available and behaves as before.

### Edge Cases

- At 320-pixel viewport width, page content and controls remain readable; a wide data table may scroll within its own bounded region rather than forcing the whole page to overflow horizontally.
- A company table with zero rows, no matching filters, or a load error communicates the correct existing empty/error state without the table or paginator becoming visually confused.
- A long company name, address, email, or remarks value wraps or truncates in a way that does not obscure the value or cause unrelated columns and controls to overlap.
- Narrow or resized company columns remain operable; the Actions column and its accessible labels/tooltips remain reachable.
- A company with no optional values shows the existing empty-value treatment without placeholder content being mistaken for saved data.
- Several divisions with long names, expanded panels, and department tables remain distinguishable on tablet and mobile widths.
- Dialogs that approach the viewport edge remain scrollable, dismissible through their existing controls, and usable with keyboard focus.
- Error, loading, saving, disabled, active, and inactive states remain distinguishable without relying on colour alone.
- Reduced-motion preferences do not make transitions necessary to understand state or complete an action.

## Requirements *(mandatory)*

### Current UI Architecture and Component Analysis

The specification is based on the existing application under `Spec-Driven-Development/sdd-ui`; no source files are to be changed as part of writing this specification.

- The application has a shared `DashboardLayout` with a sticky Broker Portal toolbar, a Masters menu, and a routed content area. The menu currently links to Company Master and List Item Master.
- The root dashboard route currently renders an empty page component; the visible application shell remains the home experience. This specification does not add dashboard widgets or invent dashboard functionality.
- Existing routes cover the dashboard, Company Master listing, company creation, company details and edit mode, List Item Master listing, and list-item creation and details/edit. Unknown routes return to the dashboard.
- Global visual styles and colour variables are defined in `sdd-ui/src/styles.css`; the current application uses a light, cream-toned surface with teal and amber accents and a sans-serif font stack. Individual page and shared-component styles are maintained in separate plain CSS files.
- The Company Master listing uses an Angular Material table with 11 data columns, sortable headers, a dedicated text-filter row, resizable columns, a trailing sticky Actions column, and pagination. The three date columns are sortable but do not have filters. Existing text filters use six operators.
- Company details share a company-field component for identity, address, licensing, and contact information. The page also displays audit fields, expandable division panels, division editing, departments tables, and existing create/assign/delete dialogs. Company creation already has Basic details, Division, and Department steps.
- List Item Master has its own sortable/filterable table, active-status filter, pagination, history tooltip, and shared create/edit form. Its current fields include list type/code, descriptions, value, active status, and two flexible values.
- Current templates already use Angular Material controls, responsive CSS grids, accessible labels in many controls, and explicit loading/error/empty states. The refresh should improve consistency and presentation while preserving those established patterns and behaviours.
- The supplied `test.md` was available; no separate screenshot files were supplied. Existing templates and styles, rather than screenshots, were used to establish the current-state baseline.

### Functional Requirements

#### Global Design System

- **FR-001**: All existing routed screens MUST follow one premium financial-services visual language: professional, restrained, light-themed, and recognisably tailored to an insurance brokerage rather than a generic administration template.
- **FR-002**: The global palette MUST use the following design tokens as its baseline:

  | Token | Value | Intended use |
  |-------|-------|--------------|
  | `--color-primary` | `#172B4D` | Primary actions, key headings, selected navigation |
  | `--color-secondary` | `#475569` | Secondary labels, supporting content |
  | `--color-accent` | `#C49A50` | Sparse highlights, active indicators, selected accents |
  | `--color-page` | `#F8FAFC` | Main page background |
  | `--color-surface` | `#FFFFFF` | Data, form, dialog, and card surfaces |
  | `--color-text` | `#172033` | Primary readable text |
  | `--color-muted` | `#475569` | Secondary readable text |
  | `--color-border` | `#E5E7EB` | Subtle control and container boundaries |
  | `--color-focus` | `#2563EB` | Clearly visible keyboard focus |
  | `--color-success` | `#166534` | Success status and feedback |
  | `--color-warning` | `#92400E` | Warning status and feedback |
  | `--color-info` | `#1D4ED8` | Informational status and feedback |
  | `--color-error` | `#B42318` | Error and destructive feedback |

- **FR-003**: The design system MUST define and consistently apply tokens for spacing, page width, corner radii, elevation, focus treatment, and motion; page-specific exceptions MUST NOT create competing visual systems.
- **FR-004**: The default appearance MUST remain light. Gold MUST be a sparing accent and MUST NOT be used as small text on a light background. Semantic states MUST use a readable label or icon as well as colour.
- **FR-005**: Typography MUST use a modern sans-serif hierarchy. Inter is preferred; Roboto, IBM Plex Sans, and the existing system sans-serif fallbacks are acceptable. Page titles, section headings, card headings, field labels, body text, table headers/values, and secondary information MUST have distinct, consistent size and weight roles.
- **FR-006**: Glassmorphism MUST be selective: restrained translucency, blur, layered shadow, or subtle gradient may distinguish broad navigation or non-data surfaces. Tables, form fields, validation messages, dialog content, and other information-dense regions MUST use solid or nearly solid surfaces with legible text.
- **FR-007**: Glass effects MUST NOT be required to understand an action or state. Text and controls layered over translucent surfaces MUST maintain the required contrast in all supported states.

#### Shared Layout and Reusable Components

- **FR-008**: The existing top navigation, Broker Portal brand link, Masters menu, and page routing MUST be retained. Styling may refine their spacing, proportions, border, surface, active/focus states, and mobile presentation, but MUST NOT add new destinations or remove existing ones.
- **FR-009**: Existing page content MUST use a consistent responsive container, page-title/action alignment, spacing rhythm, contextual back-navigation or breadcrumbs, and section-heading hierarchy. Navigation context MUST use existing routes and MUST NOT imply new screens.
- **FR-010**: Reusable cards and containers MUST use a consistent restrained border, radius, elevation, and padding. Company details MUST avoid giving every individual field a separate prominent bordered box.
- **FR-011**: Primary, secondary, outlined, text, icon-only, disabled, hover, focus, and destructive buttons MUST have consistent visual treatments. Icon-only controls MUST retain an accessible name; tooltips MUST clarify rather than replace that name.
- **FR-012**: Shared form fields, selects, date pickers, autocomplete controls where already present, and validation feedback MUST use consistent labels, dimensions, spacing, focus, error, disabled, and required states. Existing labels, validators, and form semantics MUST be preserved.
- **FR-013**: Existing loading, empty, error, saving, active/inactive, success, warning, information, and destructive states MUST be styled consistently, use an appropriate readable label or icon, and retain their current meaning and operation.
- **FR-014**: Existing dialogs and overlays MUST use consistent dimensions, spacing, surface, shadow, and backdrop treatment. A subtle backdrop blur MAY be used when it improves separation without reducing readability or responsiveness. Their current triggers, content, close/cancel actions, and outcomes MUST remain unchanged.

#### Tables and Forms

- **FR-015**: All existing data tables MUST use a consistent professional treatment with readable headers, restrained separators, comfortable row spacing, clear hover/focus feedback, and pagination that is visually distinct from surrounding content.
- **FR-016**: Existing sorting, filtering, filter operators, filter clearing, column resizing where present, sticky action columns, pagination, URL query state, tooltips, and row navigation MUST remain available and continue to operate with their existing rules.
- **FR-017**: Dense tables and forms MUST remain on solid or near-solid backgrounds; hover, selected, focused, error, and disabled states MUST be visually distinct without reducing the legibility of data.
- **FR-018**: Company and list-item forms MUST preserve their current field sets, field order, required/optional status, date handling, validation, error feedback, and submission outcomes. Company create, view, and edit forms MUST present corresponding fields in the same order and grouping wherever those fields overlap.
- **FR-019**: Company Master date columns MUST remain sortable and MUST continue to have no filter controls. Existing filterable text columns and their supported operators MUST not be removed or silently altered.

#### Screen-by-Screen Requirements

- **FR-020 — Company Master listing**: Preserve all 11 existing data columns, their current meanings, sorting, text filters, pagination, and row navigation. Refine the table header and filter row, row hover/focus, pagination, Add company action, and history/action icon treatment. Keep Actions as the final data column and visible at the trailing edge while horizontally scrolling. Keep column resizing usable and do not hide business data to simulate a responsive layout.
- **FR-021 — Company details**: Preserve every displayed company field and existing edit, save, cancel, delete, loading, and error behaviour. Improve the page heading and actions, group read-only company values by their existing categories, use whitespace and typographic hierarchy instead of individual field boxes, and keep the same field order and positions between view and edit.
- **FR-022 — Company audit history**: Preserve Created by, Created date (GST), Last updated by, and Last updated date (GST). Present each actor/date pair as a clear, compact audit entry; retain GST date formatting; do not imply additional audit events or alter their values.
- **FR-023 — Divisions and departments**: Retain the existing expandable division-card approach and all existing division fields and actions. Improve the expansion header, identity/action hierarchy, expanded-content grouping, and departments listing. Maintain the relationship between each division and its departments, and preserve existing empty states and department assignment behaviour when a company has many divisions or departments.
- **FR-024 — Company create/setup**: Preserve the existing Basic details, Division, and Department steps and all fields, step navigation, add/remove operations, validation, save-and-exit/save-and-continue outcomes, and cancellation behaviour. Give the progress indicator, setup panels, division cards, and action rows the shared form and card styling.
- **FR-025 — List Item Master listing**: Apply shared table, filter, active/inactive, action, and pagination styling while preserving the existing list type, list code, description, short description, value, active status, sorting, filters, page state, history tooltip, and row navigation.
- **FR-026 — List-item create and details/edit**: Apply the shared page, form, detail, audit, and action styling to the existing create and detail/edit views. Preserve all current list-item fields, values, immutable edit fields, validation, errors, audit values, and save/cancel/delete behaviour.
- **FR-027 — Dashboard**: Keep the current dashboard content area empty unless separate requirements authorise dashboard content. The shared shell and navigation remain visible and styled.

#### Responsive Design and Accessibility

- **FR-028**: Existing screens MUST remain usable at viewport widths from 320 px through 1920 px, including mobile (up to 600 px), tablet (601–1024 px), and desktop (over 1024 px) layouts. Page headings, action groups, navigation, form grids, cards, dialogs, tables, and pagination MUST adapt without overlap or loss of access to controls.
- **FR-029**: At narrow widths, forms and detail groups MUST reduce columns progressively to one column when required. Wide tables MAY scroll within their own labelled table region; table content and the trailing sticky Actions column MUST remain accessible.
- **FR-030**: Text contrast MUST meet WCAG 2.2 AA: at least 4.5:1 for normal text and 3:1 for large text. Meaningful control boundaries, focus indicators, and non-text state indicators MUST meet at least 3:1 contrast against adjacent colours.
- **FR-031**: All actions and interactive table features MUST remain keyboard operable with a visible focus indicator, logical focus order, descriptive accessible names, and semantic headings, table headers, and dialog labels. Pointer-only resizing MUST retain its existing keyboard resizing support.
- **FR-032**: Colour MUST NOT be the sole indicator of status, validation, selection, or focus. Reduced-motion settings MUST be respected, and no animation may be needed to understand state or complete a task.
- **FR-033**: User-facing text MUST remain in British English; displayed dates MUST continue to use the project's GST and DD-MM-YYYY conventions.

#### Scope and Technical Constraints

- **FR-034**: The work defined by this feature MUST be limited to visual presentation and user experience. It MUST NOT change business logic, API integrations, backend services, data models, routing, form submission behaviour, validation rules, permissions, or existing functionality.
- **FR-035**: Any UI proposal that would require a functional change MUST be identified separately with its user benefit and reason; it MUST NOT be treated as approved by this specification.
- **FR-036**: The existing Angular 21, Angular Material, and plain CSS stack MUST be retained. Existing Material controls SHOULD be used and styled consistently; shared CSS custom properties SHOULD centralise the tokens in FR-002 and FR-003.
- **FR-037**: Bootstrap, Tailwind CSS, other component libraries, and unnecessary dependencies MUST NOT be introduced. No new screen, route, business workflow, or dashboard feature is in scope.

### Key Entities *(include if feature involves data)*

- **Company**: The existing broker-company record whose current identity, address, licensing, contact, and audit information is listed, viewed, created, or edited.
- **Division**: An existing subdivision belonging to a company, displayed as an expandable panel with its existing details and operations.
- **Department**: An existing department displayed and assigned within a division, with current create, assign, and removal behaviour preserved.
- **List item**: An existing master-data record with list type/code, descriptions, value, active state, flexible values, and audit information.
- **Table view state**: Existing filters, operators, sort order, page, page size, and resizable column widths used while browsing a master-data listing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All existing routes listed in the current-architecture section can be opened and used with their current navigation destinations and primary actions intact after the visual refresh.
- **SC-002**: Acceptance checks find 100% of the existing Company Master and List Item Master data columns, filters, sort controls, page controls, and record actions still available; no existing data column is hidden at mobile widths.
- **SC-003**: In all six company text-filter operator checks, matching and clearing results follow the current operator and query-state rules; date columns remain unfiltered.
- **SC-004**: In every horizontal-scroll check, the company Actions column stays visible at the table's trailing edge, and each currently resizable column can still be resized using its supported pointer and keyboard controls.
- **SC-005**: In every company view/edit/create comparison, overlapping fields retain their existing order and grouping; view-to-edit retains values and all existing validation and save/cancel outcomes.
- **SC-006**: At 320 px, 768 px, 1024 px, and 1440 px viewport widths, no page-level horizontal overflow, clipped primary action, overlapping control, or inaccessible dialog content is present; only bounded wide-table regions may scroll horizontally.
- **SC-007**: Contrast measurements meet WCAG 2.2 AA thresholds for all normal/large text and meaningful controls, and all visible focus indicators are distinguishable from adjacent surfaces.
- **SC-008**: In a task-based review with five representative insurance-broker users, at least four users can locate a company, open its details, and identify its audit information without assistance; at least four rate visual consistency and readability as 4 or 5 on a five-point scale.
- **SC-009**: Reviewers can identify loading, error, empty, disabled, active/inactive, success, warning, and destructive states without relying on colour alone.

## Assumptions

- This is a visual and interaction-presentation refresh of an existing functional application, not a new product or a change to its business workflows.
- The existing route list and source templates represent the complete UI scope to be restyled for this phase. No screens beyond those already present are to be invented.
- The current dashboard content area is intentionally empty; the requested revamp concerns the shared shell and existing screens, not adding dashboard information.
- Column width changes need only retain the current runtime behaviour; durable user-specific persistence is not required by the supplied requirements.
- Inter is preferred, but the specification does not require adding a font package or a network font dependency; an available system sans-serif fallback is acceptable.
- Existing GST dates, British English labels, roles/permissions, API contracts, validation rules, and data are authoritative and remain unchanged.
- The user supplied `test.md` requirements but no screenshot assets. Current source templates and styles are the available reference for the existing UI.
- Implementation details, source-code edits, and any functional change are deferred to later planning and implementation; this deliverable is the specification only.
