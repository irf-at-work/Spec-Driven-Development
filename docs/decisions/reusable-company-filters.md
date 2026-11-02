# Reusable Company Filter Controls

**Status**: Accepted and implemented by `003-ui-revamp`.

## Decision

Provide one shared, presentation-only Angular filter control for filterable company text columns. Each field sends its text and selected operator in the existing company-list query, with a paired operator parameter. The Company Master page owns URL state and API requests; the API performs case-insensitive matching before pagination. Date columns remain sortable but are not filterable in this stage.

## Rationale

A shared control prevents duplicated filter markup and ensures consistent operator choices and clear behavior. Keeping query and request ownership in the page keeps the control reusable. Server-side matching preserves correct result totals and pagination.

## Alternatives considered

- Duplicate controls per table column: rejected because behavior and accessibility can drift.
- Filter only the current browser page: rejected because results and totals would be incomplete.
- Add date filtering or persist column widths: rejected as out of scope for this stage.
- Add a filter or grid package: rejected because existing Angular Material and project code are sufficient and package changes require approval.
