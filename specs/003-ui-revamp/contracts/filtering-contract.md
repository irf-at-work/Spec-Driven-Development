# Filtering Contract

## Shared Angular filter control

The shared control is an accessible, standalone Angular component that uses the project's standalone/OnPush/signal conventions. It has no company-specific dependencies.

### Inputs

- Accessible field label.
- Current text value.
- Current operator, defaulting to `Contains`.

### User-visible choices

- Starts with
- Ends with
- Contains
- Doesn't contain
- Equals to
- Not equals to
- Clear filter

### Outputs

- A typed change event containing the current text value and selected operator.
- A clear event that empties the value and restores the default `Contains` operator.

The parent listing owns route navigation and API requests. Changing either the text or operator updates the route state, resets the page to one, and refreshes the server-filtered results. The control does not debounce or persist state independently; the URL-backed page state supplies its current inputs.

## Company list API query

`GET /api/companies` retains its existing paging, sorting, and text-value query parameter names. Each filterable text value has a paired `{field}Operator` query parameter. For example:

| Text value parameter | Operator parameter |
|---|---|
| `companyName` | `companyNameOperator` |
| `shortName` | `shortNameOperator` |
| `primaryAddress` | `primaryAddressOperator` |
| `referenceNumber` | `referenceNumberOperator` |
| `companyInCharge` | `companyInChargeOperator` |
| `phone` | `phoneOperator` |
| `email` | `emailOperator` |
| `website` | `websiteOperator` |

The operator values are `StartsWith`, `EndsWith`, `Contains`, `DoesNotContain`, `Equals`, and `NotEquals`, matching the typed API enum. If omitted, the operator is `Contains`. An empty or whitespace-only value means no filter, regardless of the supplied operator. Unsupported operator values return the API's existing validation-problem response. Existing date fields remain sortable and visible; no date filter parameters are added.

All active filters are applied server-side before the matching-record count and page are calculated. Different columns combine with AND. String comparisons are trimmed and case-insensitive. Blank search terms do not filter; null column values do not match an active filter, including a negative operator. Primary-address comparisons use the same comma-separated value shown in the table, omitting empty address parts.

## URL state

The default `Contains` operator is omitted from the URL. Clearing a filter removes both parameters; changing a filter resets the page to one. Page, page size, sort, filter values, and operators continue to be preserved while navigating from the list to a company and back.
