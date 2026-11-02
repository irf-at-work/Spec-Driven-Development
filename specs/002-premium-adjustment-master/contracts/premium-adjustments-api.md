# Premium Adjustments API Contract

This document describes the planned HTTP boundary. The runtime OpenAPI document emitted by ASP.NET Core remains the source of truth for generated clients. Keep API response shapes in declared return types; do not add Swagger response attributes or hand-maintained Angular models.

All routes are relative to `/api/premium-adjustments`, except the options lookup. JSON names use camelCase. All non-success responses use `ProblemDetails`; exception handling is global and must not expose stack traces. The shapes and rules follow feature 001's contract (`specs/001-vehicle-make-master/contracts/vehicle-makes-api.md`).

## List Adjustment Codes

`GET /api/premium-adjustments?page={page}&codeType={text}&codeTypeOperator={operator}&code={text}&codeOperator={operator}&companyCode={text}&companyCodeOperator={operator}&name={text}&nameOperator={operator}&shortName={text}&shortNameOperator={operator}&active={true|false}&activeOperator={operator}&sortBy={sortBy}&sortDirection={sortDirection}&pageSize={10|25|50}`

- `page`: optional positive integer, default `1`.
- `pageSize`: optional integer, one of `10`, `25`, or `50`; default `10`.
- Column filters (there is no single `search` parameter, and no separate Code Type filter apart from these). Each filter is optional and has a value and an operator:
  - `codeType`, `code`, `companyCode`, `name` and `shortName` take text. `codeType` matches the Code Type description. Their `...Operator` is one of `startsWith`, `endsWith`, `contains`, `equals`, `notEquals`; default `contains` when omitted.
  - `active` takes `true` or `false`. `activeOperator` is `equals` or `notEquals`; default `equals`. A record with no flag counts as active.
  - A filter whose value is blank (or missing) is ignored, even when its operator is present.
  - Matching ignores upper and lower case. The text is plain text: `%`, `_` and other pattern characters are matched literally, never as wildcards.
  - `notEquals` also returns records whose value is empty.
  - All supplied filters must match (AND).
- `sortBy`: optional `codeType`, `code`, `companyCode`, `name`, or `shortName`; default `codeType`. Sorting ignores upper and lower case and ends with a unique tie-break (Code Type, Code, Company Code).
- `sortDirection`: optional `asc` or `desc`; default `asc`.
- Initial ordering is Code Type description ascending, then Code ascending.
- Page size is fixed at 10; clients cannot request a different size. Filtering and sorting apply to all records before pagination.
- `200 OK`: shared `PaginatedResult<AdjustmentCodeListItemDto>` with `items`, `page`, `pageSize`, and `totalCount`. Each item contains `codeType`, `codeTypeDescription`, `code`, `companyCode`, `name`, `shortName`, and `active`.
- Invalid page, sort or operator values: `400 Bad Request` with ProblemDetails (errors keyed by parameter name, for example `nameOperator`).

## Get by Composite Key

`GET /api/premium-adjustments/{codeType}/{code}/{companyCode}`

- `200 OK`: `AdjustmentCodeDto` with all fields including English fields, optional Arabic fields, audit usernames, and Active status.
- No match: `404 Not Found` with ProblemDetails.

## Create Adjustment Code

`POST /api/premium-adjustments`

Request `CreateAdjustmentCodeRequest`:

- Required `codeType` (an active item of the Code Type standard list).
- Required `code` (1-12 characters; letters, digits, and hyphens only).
- Required `companyCode` (1-12 characters; letters, digits, and hyphens only).
- Required `name` (1-100 characters) and `shortName` (1-30 characters).
- Required `discountType`, `chargesType`, and `chargesCategory` (each an active item of its own standard list).
- Optional `remarks` (up to 2000 characters), `arabicName` (up to 100), `arabicShortName` (up to 30), and `arabicRemarks` (up to 2000).
- `active`: optional boolean; defaults to `true` when omitted on create. Stored as `Y` or `N`.

Behaviour: validate and normalise English fields and Code/Company Code on the server; preserve Arabic strings exactly. Set created/changed username to `admin`. Reject a duplicate Code Type + Code + Company Code combination.

- `200 OK`: the created `AdjustmentCodeDto`. This is `200` rather than `201 Created` on purpose: the return type can only describe a `200` response (no response attributes are allowed), and the generated Angular client treats any other success code as a failure. The saved record is in the body, so no separate resource location is needed.
- Invalid request: `400 Bad Request` with ProblemDetails (validation errors keyed by camelCase field name, for example `code`).
- Duplicate combination: `409 Conflict` with ProblemDetails; the `code` error reads "This code type, code and company code combination already exists." Nothing is saved.

## Update Adjustment Code

`PUT /api/premium-adjustments/{codeType}/{code}/{companyCode}`

Request `UpdateAdjustmentCodeRequest` contains the editable fields (Name, Short Name, Discount Type, Charges Type, Charges Category, Active, Remarks, Arabic fields). It does not contain Code Type, Code, or Company Code; those are immutable.

Records saved earlier without Discount Type, Charges Type, or Charges Category must have all three chosen before the update can succeed. A classification code the record already holds is accepted even if it has since become inactive; a newly chosen code must be active.

- `200 OK`: updated `AdjustmentCodeDto`; stamp last-changed username `admin`.
- Invalid request: `400 Bad Request` with ProblemDetails identifying the invalid or missing fields (for example `discountType`); do not update.
- No match: `404 Not Found` with ProblemDetails.

## Delete Adjustment Code

`DELETE /api/premium-adjustments/{codeType}/{code}/{companyCode}`

- The client asks the user to confirm the permanent, irreversible action before making this request. Turning Active off (an update) is the reversible alternative.
- `204 No Content`: record permanently removed.
- No match: `404 Not Found` with ProblemDetails.

## Dropdown Options

`GET /api/premium-adjustment-options`

- `200 OK`: `PremiumAdjustmentOptionsDto`, one call that returns all four lists, so the screen does not make four requests. Each list is an array of `{ code, description }` (the same `LookupOptionDto` shape feature 001 uses) containing the active `STD_LIST_ITEM` rows of one list type, ordered by description: `codeTypes`, `discountTypes`, `chargesTypes` and `chargesCategories`. Options are independent of the chosen Code Type.
- Read-only. The list types are fixed in the server, never taken from the request: `codeTypes` uses `CALC_TYPE`, `discountTypes` uses `DISCOUNT_TYPE`, `chargesTypes` uses `CHARGE_TYPE`, and `chargesCategories` uses `CHARGE_CAT` (owner-confirmed 02-Nov-2026; see the data model).
- Not paged: this is an exception to constitution B8, recorded under C3 on 02-Nov-2026 with the owner's approval, like feature 001's `vehicle-model-options`.
- If a list type has no active items, its array is empty.

## Error Shape

Use standard `ProblemDetails` fields (`type`, `title`, `status`, `detail`, and optional `instance`/extensions). Do not expose raw exception details. Client-facing messages use British/Indian English, do not reveal raw server messages, and explain the next action where applicable.
