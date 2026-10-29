# Premium Adjustments API Contract

This document describes the planned HTTP boundary. The runtime OpenAPI document emitted by ASP.NET Core remains the source of truth for generated clients. Keep API response shapes in declared return types; do not add Swagger response attributes or hand-maintained Angular models.

All routes are relative to `/api/premium-adjustments`. JSON names use camelCase. All non-success responses use `ProblemDetails`; exception handling is global and must not expose stack traces.

## List Adjustment Codes

`GET /api/premium-adjustments?page={page}&codeType={codeType}&search={search}&sortBy={sortBy}&sortDirection={sortDirection}`

- `page`: optional positive integer, default `1`.
- Page size is fixed at 10; clients cannot request a different size.
- `codeType`: optional filter by Code Type.
- `search`: optional text matched across Code Type description, Code, Company Code, Name, and Short Name.
- `sortBy`: optional `codeType`, `code`, `companyCode`, `name`, or `shortName`; default `codeType`.
- `sortDirection`: optional `asc` or `desc`; default `asc`.
- Initial ordering is Code Type description ascending, then Code ascending.
- Filtering, searching, and sorting apply to all records before pagination.
- `200 OK`: shared `PaginatedResult<AdjustmentCodeListItemDto>` with `items`, `page`, `pageSize`, and `totalCount`. Each item contains `codeType`, `codeTypeDescription`, `code`, `companyCode`, `name`, `shortName`, and `active`.
- Invalid page, Code Type, or sort values: `400 Bad Request` with ProblemDetails.

## Get by Composite Key

`GET /api/premium-adjustments/{codeType}/{code}/{companyCode}`

- `200 OK`: `AdjustmentCodeDto` with all fields including English fields, optional Arabic fields, audit usernames, and Active status.
- No match: `404 Not Found` with ProblemDetails.

## Create Adjustment Code

`POST /api/premium-adjustments`

Request `CreateAdjustmentCodeRequest`:

- Required `codeType` (references active Code Type standard list).
- Required `code` (1-12 characters; letters, digits, and hyphens only).
- Required `companyCode` (1-12 characters; letters, digits, and hyphens only).
- Required `name` (1-100 characters) and `shortName` (1-30 characters).
- Required `discountType`, `chargesType`, and `chargesCategory` (each references active standard list).
- Optional `remarks` (up to 2000 characters), `arabicName` (up to 100), `arabicShortName` (up to 30), and `arabicRemarks` (up to 2000).
- `active` defaults to `true`; can be set to `false`.

Behavior: validate and normalize English fields and Code/Company Code on the server; preserve Arabic strings exactly. Set created/changed username to `admin`. Reject duplicate Code Type + Code + Company Code combination.

- `201 Created`: created `AdjustmentCodeDto` and resource location.
- Invalid request: `400 Bad Request` with ProblemDetails.
- Duplicate combination: `409 Conflict` with a clear duplicate-combination ProblemDetails response; do not save.

## Update Adjustment Code

`PUT /api/premium-adjustments/{codeType}/{code}/{companyCode}`

Request `UpdateAdjustmentCodeRequest` contains the editable fields (Name, Short Name, Discount Type, Charges Type, Charges Category, Active, Remarks, Arabic fields). It does not contain Code Type, Code, or Company Code; those are immutable.

Records saved earlier without Discount Type, Charges Type, or Charges Category must have all three chosen before the update can succeed.

- `200 OK`: updated `AdjustmentCodeDto`; stamp last-changed username `admin`.
- Invalid request: `400 Bad Request` with ProblemDetails; do not update.
- No match: `404 Not Found` with ProblemDetails.
- Missing required Discount Type / Charges Type / Charges Category: `400 Bad Request` with ProblemDetails identifying the missing fields.

## Delete Adjustment Code

`DELETE /api/premium-adjustments/{codeType}/{code}/{companyCode}`

- The client asks the user to confirm the permanent, irreversible action before making this request.
- `204 No Content`: record permanently removed.
- No match: `404 Not Found` with ProblemDetails.

## Standard List Dropdowns

`GET /api/premium-adjustments/lookups/code-types?page={page}`
`GET /api/premium-adjustments/lookups/discount-types?page={page}`
`GET /api/premium-adjustments/lookups/charges-types?page={page}`
`GET /api/premium-adjustments/lookups/charges-categories?page={page}`

- Each route returns only active rows from its own existing standard list, ordered by description. Options are independent of Code Type.
- `page`: optional positive integer, default `1`.
- `200 OK`: shared `PaginatedResult<PremiumAdjustmentLookupDto>` with `items`, `page`, `pageSize`, and `totalCount`. Each item has `value` and `description`. Page size is fixed at 10.
- The UI loads successive pages until it has all active choices.
- No matches: `items` is an empty array and `totalCount` is `0`.

## Error Shape

Use standard `ProblemDetails` fields (`type`, `title`, `status`, `detail`, and optional `instance`/extensions). Do not expose raw exception details. Client-facing messages use British/Indian English, do not reveal raw server messages, and explain the next action where applicable.