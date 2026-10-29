# Feature Specification: Shared Dashboard Foundation

**Feature Branch**: `001-shared-dashboard-foundation`

**Created**: 2026-10-29

**Status**: Draft

**Input**: User description: "Initially, scaffold the database tables; create a shared pagination result as specified in the constitution; and make a common dashboard with a floating header containing only one dropdown-style menu named Masters with Company Master and Listing Master values, a modern professional blue-based design, and shared styles for repeated elements such as tables and input fields."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate the shared dashboard (Priority: P1)

An insurance broker opens the application and uses a consistent dashboard to reach the Company Master or Listing Master area.

**Why this priority**: The shared dashboard is the common entry point for the master-data work planned for the MVP.

**Independent Test**: Open the dashboard, inspect its header and menu, and verify that both master destinations can be selected.

**Acceptance Scenarios**:

1. **Given** the user opens the application, **When** the dashboard appears, **Then** a floating header is visible with one dropdown menu named Masters.
2. **Given** the user opens Masters, **When** the menu expands, **Then** it contains Company Master and Listing Master and no other menu values.
3. **Given** the user selects either master menu value, **When** navigation completes, **Then** the corresponding master area is opened.

### User Story 2 - Work with consistent shared presentation (Priority: P2)

An insurance broker views common tables and input fields in a clear, professional interface with blue as its base colour.

**Why this priority**: Reusable presentation makes the initial master-data experience consistent and easier to use.

**Independent Test**: Inspect a representative table and input field in the dashboard experience and confirm that repeated controls share the same visual treatment.

**Acceptance Scenarios**:

1. **Given** a page displays a table and input fields, **When** the user views them, **Then** repeated elements use consistent shared styles and a professional blue-based colour palette.
2. **Given** the user views the dashboard at supported screen sizes, **When** the header and shared controls are displayed, **Then** their labels and controls remain legible and usable.

### User Story 3 - Receive consistent paginated results (Priority: P2)

An insurance broker views a long list of records in manageable pages and can understand the current page and the total number of matching records.

**Why this priority**: Consistent pagination supports the listing experiences and prevents each list from presenting paging information differently.

**Independent Test**: Request a list across multiple pages and verify each response carries its records, current page, page size, and total record count, with a default page size of 10.

**Acceptance Scenarios**:

1. **Given** a list contains more records than fit on one page, **When** the user requests a page, **Then** the result includes the records for that page, page number, page size, and total matching record count.
2. **Given** a list request does not specify a page size, **When** results are returned, **Then** the page size is 10.
3. **Given** a request selects a page beyond the available records, **When** the result is returned, **Then** it contains no records and still reports the requested page, page size, and total matching record count.

### User Story 4 - Use the existing master-data definitions (Priority: P2)

The project owner makes the existing Company, Department, and List Item table definitions available to the application without changing their approved structure.

**Why this priority**: The requested master-data areas depend on application representations that remain aligned with the established database definitions.

**Independent Test**: Compare the three named tables as represented in the application with their existing database definitions.

**Acceptance Scenarios**:

1. **Given** the existing database contains `STD_COMPANY`, `STD_DEPARTMENT`, and `STD_LIST_ITEM`, **When** the application uses these tables, **Then** their existing definitions are represented without changing the tables.
2. **Given** one of the named tables is inspected, **When** its representation in the application is checked, **Then** it matches the existing definition.

### Edge Cases

- When the Masters dropdown is open and the user selects an item, the selected destination must open and the menu must not introduce additional destinations.
- When a paginated list is empty, the result must report zero total records and no items while retaining valid page metadata.
- When a requested page is beyond the available records, the response must still contain the total count and requested paging metadata.
- If an existing database table cannot be represented, the failure must be visible to the project owner and must not be reported as a successful preparation.
- At narrow screen widths, the header and shared controls must remain usable without obscuring their labels.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST provide a common dashboard entry point for the initial master-data experience.
- **FR-002**: The dashboard MUST display a floating header containing exactly one dropdown-style menu named Masters.
- **FR-003**: The Masters menu MUST contain exactly Company Master and Listing Master.
- **FR-004**: Selecting Company Master or Listing Master MUST open the corresponding master area.
- **FR-005**: The dashboard and shared controls MUST use a modern, professional visual design based on shades of blue.
- **FR-006**: Repeated interface elements, including tables and input fields, MUST have consistent shared visual styles.
- **FR-007**: The system MUST provide one reusable generic paginated-result contract containing `items`, `page`, `pageSize`, and `totalCount`.
- **FR-008**: Paginated list results MUST use a default page size of 10 when the caller does not specify a page size.
- **FR-009**: Paginated list results MUST report the requested page, effective page size, and total matching record count, including when a page has no items.
- **FR-010**: The application MUST make the existing `STD_COMPANY`, `STD_DEPARTMENT`, and `STD_LIST_ITEM` tables available according to their current database definitions, without changing those definitions.
- **FR-011**: The Company Master and Listing Master menu entries MUST remain the only master destinations in this shared-dashboard feature; each master page's data-management scope is defined in its own feature specification.

### Key Entities *(include if feature involves data)*

- **Master data table**: An existing database table used for master data. This feature covers `STD_COMPANY`, `STD_DEPARTMENT`, and `STD_LIST_ITEM`.
- **Paginated result**: A page of matching records together with the page number, effective page size, and total number of matching records.
- **Master destination**: A named area reached from the Masters menu, initially Company Master or Listing Master.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a navigation check, users can open either of the two master destinations from the dashboard in no more than two selections.
- **SC-002**: All dashboard instances show exactly one Masters dropdown with exactly two entries: Company Master and Listing Master.
- **SC-003**: All paginated list results provide the four agreed paging values, and requests without a page size return 10 records per page when at least 10 records remain.
- **SC-004**: Reviewers find no inconsistent styles among the shared table and input-field examples used in the initial master experience.
- **SC-005**: Every database table included in the initial scope matches its approved definition for fields and relationships.

## Assumptions

- The application is an MVP for insurance brokers, and the initial scope is master data, as described by the project constitution.
- Company Master and Listing Master are the two initial navigation destinations. Their full page behaviour and CRUD workflows are outside this shared-foundation feature and require their own specifications.
- The three named database tables already exist, and their current definitions are authoritative; this feature does not redesign or alter their schema.
- Pagination metadata uses the shared contract and default page size established by the project constitution.
- The interface follows the project's British English language convention.
