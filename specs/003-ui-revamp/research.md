# Research: Dashboard and Company UI Revamp

## Existing application structure

**Decision**: Extend the existing Angular application and .NET API. Use the existing Angular Material, Angular CDK, OpenAPI Generator, xUnit, Playwright, and Vitest dependencies; add or change no packages.

**Rationale**: The repository already uses Angular 21 standalone components, `OnPush`, signals, `inject()`, Angular Material controls, generated API clients, and an aggregate `scripts/test.ps1` runner. The feature requires presentation and list-filter behavior, not a new technology stack.

**Evidence**: `.specify/memory/constitution.md` B2, B4-B8; `Spec-Driven-Development/sdd-ui/package.json`; `src/app/pages/company-master/company-master-page.ts`; `Spec-Driven-Development/SDD.API/SDD.API/Controllers/CompanyController.cs`.

**Alternatives considered**: Adding a filter library or a new state-management package was rejected because existing dependencies and route query parameters cover the required behavior, and package changes require owner confirmation.

## Reusable filter control

**Decision**: Add one standalone shared filter control with typed signal inputs for the field label and current filter state, and a typed output for filter changes or clearing. It owns the text field, six operator choices, and clear action, but does not know company fields, navigate, or call the API. Company Master supplies the label/value/operator and handles its output. The same control can be reused by subsequent list filters.

**Rationale**: The current filter markup is duplicated by column in `company-master-page.html`; one control centralizes labels, operator choices, accessibility, and clear behavior. Keeping route/API state in the page preserves the current separation between presentation and list navigation.

**Alternatives considered**: Repeating Material controls in every column was rejected because it duplicates behavior and makes future changes inconsistent. Putting API and route logic inside the control was rejected because it couples a reusable control to one listing.

## Filter semantics and API contract

**Decision**: Use case-insensitive matching for all six text operators, trim the search term, ignore blank search values, treat null column values as non-matches for active filters, and default an omitted operator to `contains`. Support text filters for company name, short name, primary address, reference number, company in charge, phone, email, and website. Date columns remain visible and sortable but are not filterable in this stage. Apply all active filters before counting and paging, and combine different column filters with AND. Preserve the existing value query parameter names and add a paired operator query parameter for each filterable text field. Retain active values and operators in route query parameters; reset to page one when a filter changes. Clearing a filter removes its value and operator from the URL and restores the default operator.

**Rationale**: The current API already performs case-insensitive contains filtering on the server before paging, and the UI already restores field values from route query parameters. The user's clarification explicitly excludes date filters at this stage. Preserving existing value parameter names keeps the transition straightforward while exposing the selected operator through the generated client.

**Alternatives considered**: Client-side filtering after pagination was rejected because it would produce incomplete results and incorrect totals. Date filtering with text operators was rejected per the user's clarification. Treating every operation as `contains` was rejected because it would not meet the requested operator choices.

## Filtered field representation

**Decision**: Apply primary-address operators to the same comma-separated, empty-part-omitting address shown in the company table. Keep the predicate in the server-side query before paging and cover each operation with code-only service tests.

**Rationale**: The existing API composes the visible primary address from up to three address fields. Applying an operator to the visible value makes the result match what users see rather than an unrelated individual address field.

**Alternatives considered**: Matching any address part independently was rejected because `equals`, `not equals`, starts-with, and ends-with could disagree with the displayed composite value. Filtering only the current page in the browser was rejected because it would return incomplete results.

## Table presentation and resizing

**Decision**: Keep Angular Material's table and paginator, placing the actions column last and sticky at the right edge. Provide an accessible resize handle for every column using the existing Angular component code and local state; do not persist widths beyond the current table session. Keep the table container and paginator visibly enclosed, and keep loading state from inserting/removing a message above the table.

**Rationale**: This retains the existing sorted, paginated table and avoids introducing dependencies or persistence requirements. A keyboard-operable resize handle keeps resizing available beyond pointer-only use.

**Alternatives considered**: Replacing the table/paginator library was rejected because the existing Material controls support the current listing. Adding persistent preferences or a new grid package was rejected as out of scope and requiring additional complexity or approval.

## Consistent company form presentation

**Decision**: Use one shared company-field presentation for create, view, and edit states. The field order and grouping stay fixed while controls switch between read-only and editable states; new records use the same presentation with empty values. Keep existing company validation and immutable-field rules.

**Rationale**: The current add/edit form and details view are separate templates with different field groupings. Sharing the field layout directly supports the requirement that positions and values do not change between modes.

**Alternatives considered**: Styling separate forms independently was rejected because their structure could drift and fields would jump when the details view changes modes.

## Verification

**Decision**: Extend the existing Vitest component/unit tests, API xUnit service/controller tests, and Playwright journeys. Use fakes and mocked API responses; do not connect to Oracle or write test data. Run the existing `scripts/test.ps1` aggregate command.

**Rationale**: This follows the constitution's test technologies and database safety rules while verifying the shared component, server-side matching, URLs, dashboard, table interactions, and form state.

**Alternatives considered**: Database-backed UI tests were rejected because the project forbids development-database writes and the existing E2E fixture is designed for mocked responses.
