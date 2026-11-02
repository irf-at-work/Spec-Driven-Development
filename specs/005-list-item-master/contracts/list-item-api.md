# List Item API Contract

This document defines the planned public API behavior for List Item Master. The API implementation is the source for OpenAPI; generate the API document from the typed endpoints and generate the Angular client from that document. Do not hand-author OpenAPI or client models.

## Shared response conventions

- List responses use the existing `PaginatedResult<T>` shape: `items`, `page`, `pageSize`, and `totalCount`. The default page size is 10.
- Successful creates return the created resource and its canonical location. Reads and updates return a typed list item DTO. Successful deletes return no content.
- Validation failures identify affected fields. Duplicate identities and database-reported reference conflicts return typed conflict/problem responses. Missing records return a typed not-found response.
- Async operations accept and propagate cancellation.
- Audit fields are response-only and are set by the service, not supplied by create/update requests.

## Operations

| Method | Path | Purpose | Success |
|---|---|---|---|
| `GET` | `/api/list-items` | Filter, sort, and page configurations | `PaginatedResult<ListItemListItemDto>` |
| `GET` | `/api/list-items/{liType}/{liCode}` | Read a configuration | `ListItemDto` |
| `POST` | `/api/list-items` | Create a configuration | `ListItemDto` and resource location |
| `PUT` | `/api/list-items/{liType}/{liCode}` | Update mutable fields without changing identity | `ListItemDto` |
| `DELETE` | `/api/list-items/{liType}/{liCode}` | Remove after user confirmation | No content |

Path segments are URL-escaped by clients. The type and code path values are both required to address a configuration.

## List query

| Parameter | Type | Default / allowed values |
|---|---|---|
| `page` | integer | 1-based; default `1` |
| `pageSize` | integer | default `10` |
| `sortBy` | string | Allow-listed data columns; default `liType` |
| `sortDirection` | string | `asc` or `desc`; default `asc` |
| `liType` / `liTypeOperator` | string / enum | Optional filter; existing text operators |
| `liCode` / `liCodeOperator` | string / enum | Optional filter; existing text operators |
| `description` / `descriptionOperator` | string / enum | Optional filter; existing text operators |
| `shortDescription` / `shortDescriptionOperator` | string / enum | Optional filter; existing text operators |
| `value` / `valueOperator` | string / enum | Optional filter; existing text operators |
| `activeYn` | string | Optional exact `Y`/`N` filter |

The text operator values follow the shared filter behavior: `StartsWith`, `EndsWith`, `Contains`, `DoesNotContain`, `Equals`, and `NotEquals`. Unknown sort fields, directions, operators, invalid page values, and invalid page sizes are rejected with field-associated validation errors. The service applies filtering before counting and paging; ties are ordered deterministically by type and code.

The list item row DTO contains the six visible data values (`liType`, `liCode`, `description`, `shortDescription`, `value`, `activeYn`) and `createdBy`/`lastUpdatedBy` for the history action.

## Detail and write DTOs

- `ListItemDto` contains the key, all business values (`description`, `descriptionL2`, `shortDescription`, `shortDescriptionL2`, `value`, `activeYn`, `flex01`, `flex02`), and read-only audit values (`createdBy`, `createdAt`, `lastUpdatedBy`, `lastUpdatedAt`).
- `CreateListItemRequest` contains `liType`, `liCode`, and all editable business values. Type/code are required; all values are validated against the existing table field limits. A new active status defaults to `Y` when omitted.
- `UpdateListItemRequest` contains mutable business values only. It cannot change type/code or supply audit values. The last valid save wins.
- Create rejects a duplicate `(liType, liCode)` identity without saving. Delete does not cascade; a database-reported reference conflict leaves the record intact.

The generated OpenAPI document must express the concrete response/error types in endpoint signatures. Do not add Swagger attributes or XML documentation comments to controllers/actions contrary to project rules.
