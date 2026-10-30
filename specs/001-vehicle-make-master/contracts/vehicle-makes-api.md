# Vehicle Makes API Contract

This document describes the planned HTTP boundary. The runtime OpenAPI document emitted by ASP.NET Core remains the source of truth for generated clients. Keep API response shapes in declared return types; do not add Swagger response attributes or hand-maintained Angular models.

All routes are relative to `/api/vehicle-makes`. JSON names use camelCase. All non-success responses use `ProblemDetails`; exception handling is global and must not expose stack traces.

## List

`GET /api/vehicle-makes?page={page}&makeCode={text}&makeCodeOperator={operator}&makeName={text}&makeNameOperator={operator}&shortName={text}&shortNameOperator={operator}&active={true|false}&activeOperator={operator}&sortBy={sortBy}&sortDirection={sortDirection}`

- `page`: optional positive integer, default `1`.
- Column filters (they replace the former single `search` parameter, which no longer exists). Each filter is optional and has a value and an operator:
  - `makeCode`, `makeName` and `shortName` take text. Their `...Operator` is one of `startsWith`, `endsWith`, `contains`, `equals`, `notEquals`; default `contains` when omitted.
  - `active` takes `true` or `false`. `activeOperator` is `equals` or `notEquals`; default `equals`.
  - A filter whose value is blank (or missing) is ignored, even when its operator is present.
  - Matching ignores upper and lower case. The text is plain text: `%`, `_` and other pattern characters are matched literally, never as wildcards.
  - `notEquals` also returns records whose value is empty (owner decision, 30-Oct-2026).
  - All supplied filters must match (AND).
- `sortBy`: optional `makeCode`, `makeName`, or `shortName`; default `makeCode`.
- `sortDirection`: optional `asc` or `desc`; default `asc`.
- Page size is fixed at 10 for this workflow. Filtering and sorting apply to all records before pagination.
- `200 OK`: shared `PaginatedResult<VehicleMakeListItemDto>` with `items`, `page`, `pageSize`, and `totalCount`. Each item contains `makeCode`, `makeName`, `shortName`, and `active`.
- Invalid page, sort or operator values: `400 Bad Request` with ProblemDetails (errors keyed by parameter name, for example `makeNameOperator`).

## Get by Make Code

`GET /api/vehicle-makes/{makeCode}`

- `200 OK`: `VehicleMakeDto` with Make Code, English fields, optional Arabic fields, Active status, and audit usernames.
- No match: `404 Not Found` with ProblemDetails.

## Create

`POST /api/vehicle-makes`

Request `CreateVehicleMakeRequest`:

- Required `makeCode` (1-12 characters; letters, digits, and hyphens only).
- Required `makeName` (1-100 characters) and `shortName` (1-30 characters).
- Optional `remarks` (up to 2000 characters), `arabicMakeName` (up to 100), `arabicShortName` (up to 30), and `arabicRemarks` (up to 2000).
- `active`: optional boolean; defaults to `true` when omitted on create. Stored as `Y` or `N`.

Behavior: validate and normalize English fields and Make Code on the server; preserve Arabic strings exactly. Set created/changed username to `admin`.

- `200 OK`: the created `VehicleMakeDto`. This is `200` rather than `201 Created` on purpose: the return type can only describe a `200` response (no response attributes are allowed), and the generated Angular client treats any other success code as a failure. The saved record is in the body, so no separate resource location is needed.
- Invalid request: `400 Bad Request` with ProblemDetails (validation errors keyed by camelCase field name, e.g. `makeCode`).
- Duplicate Make Code: `409 Conflict` with ProblemDetails; the `makeCode` error reads "This make code already exists." Nothing is saved.

## Update

`PUT /api/vehicle-makes/{makeCode}`

Request `UpdateVehicleMakeRequest` contains the editable English fields, Remarks, optional Arabic fields, and `active`. It does not contain Make Code; code is immutable.

- `200 OK`: updated `VehicleMakeDto`; stamp last-changed username `admin`.
- Invalid request: `400 Bad Request` with ProblemDetails; do not update.
- No match: `404 Not Found` with ProblemDetails.

## Delete

`DELETE /api/vehicle-makes/{makeCode}`

- The client asks the user to confirm the permanent, irreversible action before making this request.
- `204 No Content`: record permanently removed.
- No match: `404 Not Found` with ProblemDetails.
- If one or more vehicle models belong to the make: `409 Conflict` with ProblemDetails explaining that the user must delete the models first. No data is removed.

## Vehicle Models

Models live under their make. The Make Code always comes from the route; it is never accepted in a request body, so a model cannot be moved to another make. All routes are relative to `/api/vehicle-makes/{makeCode}/models`. The shapes follow the same rules as above: return-type declared, camelCase, `ProblemDetails` for every failure, `200 OK` for create.

| Action | Route | Success | Failures |
|---|---|---|---|
| List | `GET ?page={page}&modelCode={text}&modelCodeOperator={operator}&modelName={text}&modelNameOperator={operator}&shortName={text}&shortNameOperator={operator}&active={true or false}&activeOperator={operator}` | `200` `PaginatedResult<VehicleModelDto>` (page size 10, ordered by `modelCode` ascending; column filters follow the same rules as the makes list; no sorting) | `400` bad page or operator, `404` make not found |
| Get one | `GET /{modelCode}` | `200` `VehicleModelDto` (used by the model edit page so it can load by key) | `404` make or model not found |
| Create | `POST` with `CreateVehicleModelRequest` | `200` created `VehicleModelDto` | `400` validation (keyed by field), `404` make not found, `409` code already exists for this make |
| Update | `PUT /{modelCode}` with `UpdateVehicleModelRequest` (no model code in the body) | `200` updated `VehicleModelDto` | `400`, `404` |
| Delete | `DELETE /{modelCode}` | `204` | `404` |

`VehicleModelDto` carries the make code, model code, English and Arabic name / short name / remarks, every optional detail from the data model, Active status, and audit usernames. Numbers are numbers (`value` is a decimal), not strings. The nine dropdown fields carry the item's code only; the screen shows the matching description from the dropdown options below. Create accepts an optional boolean `active` that defaults to `true`; update includes `active`. The database stores this flag as `Y` or `N`.

Validation and normalisation use the same server rules as makes (code format and capitals, English text normalisation, Arabic text untouched, maximum lengths). The create-model request validates `modelCode`; the update request does not. Each dropdown code that is newly selected must be an active item of its own list type, otherwise `400` with the error keyed by that field (for example `fuelType`). An empty value is allowed. On update, an existing inactive selection may be kept unchanged; the UI should show it as the current value without offering it as a new choice.

### Dropdown options

`GET /api/vehicle-model-options`

- `200 OK`: `VehicleModelOptionsDto`, one call that returns all nine lists, so the screen does not make nine requests. Each list is an array of `{ code, description }` containing the active `STD_LIST_ITEM` rows of one list type, ordered by description: `variants` (`VEH_VARIANT`), `types` (`VEH_TYPE`), `bodyTypes` (`VEH_BODY_TYPE`), `fuelTypes` (`VEH_FUEL_TYPE`), `cylinders` (`VEH_CYLINDER`), `doors` (`VEH_DOORS`), `drivingTypes` (`VEH_DRIVING_TYPE`), `bodyColours` (`VEH_BODY_COLOR`) and `categories` (`VEH_CATEGORY`).
- Read-only. The list types are fixed in the server, never taken from the request.
- Not paged: this is the owner-approved lookup exception in the spec. Record the exception under constitution C3 before implementation.

Model create/update/delete endpoints are independent of unsaved make changes. Deleting a make with models returns the `409` response described above. Verify that the Oracle make-model foreign key does not cascade deletes; the API must pre-check for models and map a concurrent foreign-key conflict to the same `409 ProblemDetails` response.

## Error Shape

Use standard `ProblemDetails` fields (`type`, `title`, `status`, `detail`, and optional `instance`/extensions). Do not expose raw exception details. Client-facing messages use British/Indian English, do not reveal raw server messages, and explain the next action where applicable.
