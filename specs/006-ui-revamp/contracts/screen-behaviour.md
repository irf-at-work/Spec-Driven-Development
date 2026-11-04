# Existing Screen and Interaction Contract

## Purpose and Scope

This is the UI preservation contract for the visual refresh. It records existing destinations and interaction invariants to verify while styling changes are made. It does not define or modify an API, data model, permission, or business workflow.

## Existing Routes

| Route | Existing screen/behavior |
|-------|--------------------------|
| `/` | Shared application shell with empty dashboard content |
| `/company-master` | Company listing |
| `/company-master/new` | Company creation and company-structure setup |
| `/company-master/:companyCode` | Company details, audit history, divisions, and departments |
| `/company-master/:companyCode/edit` | Company details opened in edit mode |
| `/listing-master` | List Item Master listing |
| `/listing-master/new` | Create list item |
| `/listing-master/:liType/:liCode` | List item details and existing edit/delete interactions |
| Unknown route | Redirects to `/` |

The shared Masters menu links to Company Master and List Item Master. Route paths, parameters, query parameters, and destinations remain unchanged.

## Interaction Invariants

### Shared shell

- Broker Portal remains a home link.
- Masters menu remains keyboard accessible and retains its two existing destinations.
- Routed content remains displayed within the shared layout.

### Company listing

- All 11 current data columns remain available.
- Sortable headers remain sortable.
- Existing text columns retain the six filter operators and clear action.
- Date columns remain sortable and unfiltered.
- Pagination and query state remain unchanged.
- Column resize remains available by pointer and keyboard.
- The Actions column remains last and sticky at the trailing edge.
- Clicking a row opens the same company; action controls do not trigger unintended row navigation.

### Company details and setup

- Company values, audit pairs, and dates remain unchanged.
- View/edit mode retains values, field order, and validation.
- Edit/save/cancel/delete operations remain unchanged.
- Company create steps and their existing save/navigation outcomes remain unchanged.
- Division expansion, editing, adding, deleting, department listing, and department assignments retain their existing behavior and states.
- Existing loading, empty, validation, error, and blocked-operation messages remain available.

### List Item Master

- Existing columns, filters, operators, active-status selection, sorting, pagination, row navigation, and history tooltip remain available.
- Create/details/edit/delete behavior, immutable fields, audit values, validation, and error states remain unchanged.

## Accessibility and Responsive Invariants

- Preserve semantic headings, table header associations, dialog roles/labels, button names, and filter labels.
- Keep every existing interaction keyboard accessible with visible focus.
- Do not use colour as the sole indicator of focus, validation, or status.
- At viewport widths from 320 px through 1920 px, keep page actions and controls available. Wide tables may scroll only within their bounded table regions.
- The table's sticky action area and filter controls remain legible during horizontal/vertical scrolling.
- Reduced-motion preferences and a solid fallback for optional glass effects do not change meaning or access.

## Explicitly Out of Contract

- New routes or screens.
- Dashboard widgets or content.
- API/backend, model, persistence, permission, validation, or business-rule changes.
- Changed submission, sorting, filtering, pagination, or navigation behavior.
- New front-end packages or component libraries.
