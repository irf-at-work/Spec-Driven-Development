# Data Model: Dashboard and Company UI Revamp

This feature does not change stored company data or database schema. It adds view state for filtering and column resizing.

## Company table filter state

| Field | Type | Default | Description |
|---|---|---|---|
| `value` | String | Empty | Text entered for one filterable company column. Blank values do not filter. |
| `operator` | `StartsWith`, `EndsWith`, `Contains`, `DoesNotContain`, `Equals`, `NotEquals` | `Contains` | Case-insensitive comparison applied to the trimmed filter value. |
| `column` | Existing filterable text-column key | None | One of company name, short name, primary address, reference number, company in charge, phone, email, or website. |

Different active column filters are combined with AND. Blank search values apply no filter; null company-field values do not match an active filter. Clearing one filter removes its value and operator from the active URL state and resets the page to one. The existing page, page-size, and sort state remains unchanged. Date columns remain visible and sortable, with no filter state.

## Shared filter control

The reusable control is presentation-only. It receives a label, the current value, and the current operator, then emits a typed change or clear event. It does not own company data, API calls, pagination, sorting, or route state.

## Column sizing state

Column widths are transient UI state for the current table session. Each company table column has a user-adjustable width. Widths are not added to the API, database, or durable preferences.
