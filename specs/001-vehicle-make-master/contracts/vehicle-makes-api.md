# Vehicle Makes API Contract

This document describes the planned HTTP boundary. The runtime OpenAPI document emitted by ASP.NET Core remains the source of truth for generated clients. Keep API response shapes in declared return types; do not add Swagger response attributes or hand-maintained Angular models.

All routes are relative to `/api/vehicle-makes`. JSON names use camelCase. All non-success responses use `ProblemDetails`; exception handling is global and must not expose stack traces.

## List

`GET /api/vehicle-makes?page={page}&search={search}&sortBy={sortBy}&sortDirection={sortDirection}`

- `page`: optional positive integer, default `1`.
- `search`: optional text matched across Make Code, Make Name, and Short Name.
- `sortBy`: optional `makeCode`, `makeName`, or `shortName`; default `makeCode`.
- `sortDirection`: optional `asc` or `desc`; default `asc`.
- Page size is fixed at 10 for this workflow. Search and sorting apply to all records before pagination.
- `200 OK`: shared `PaginatedResult<VehicleMakeListItemDto>` with `items`, `page`, `pageSize`, and `totalCount`. Each item contains `makeCode`, `makeName`, and `shortName`.
- Invalid page or sort values: `400 Bad Request` with ProblemDetails.

## Get by Make Code

`GET /api/vehicle-makes/{makeCode}`

- `200 OK`: `VehicleMakeDto` with Make Code, English fields, optional Arabic fields, and audit usernames.
- No match: `404 Not Found` with ProblemDetails.

## Create

`POST /api/vehicle-makes`

Request `CreateVehicleMakeRequest`:

- Required `makeCode` (1-12 characters; letters, digits, and hyphens only).
- Required `makeName` (1-100 characters) and `shortName` (1-30 characters).
- Optional `remarks` (up to 2000 characters), `arabicMakeName` (up to 100), `arabicShortName` (up to 30), and `arabicRemarks` (up to 2000).

Behavior: validate and normalize English fields and Make Code on the server; preserve Arabic strings exactly. Set created/changed username to `admin`.

- `200 OK`: the created `VehicleMakeDto`. This is `200` rather than `201 Created` on purpose: the return type can only describe a `200` response (no response attributes are allowed), and the generated Angular client treats any other success code as a failure. The saved record is in the body, so no separate resource location is needed.
- Invalid request: `400 Bad Request` with ProblemDetails (validation errors keyed by camelCase field name, e.g. `makeCode`).
- Duplicate Make Code: `409 Conflict` with ProblemDetails; the `makeCode` error reads "This make code already exists." Nothing is saved.

## Update

`PUT /api/vehicle-makes/{makeCode}`

Request `UpdateVehicleMakeRequest` contains the editable English fields, Remarks, and optional Arabic fields. It does not contain Make Code; code is immutable.

- `200 OK`: updated `VehicleMakeDto`; stamp last-changed username `admin`.
- Invalid request: `400 Bad Request` with ProblemDetails; do not update.
- No match: `404 Not Found` with ProblemDetails.

## Delete

`DELETE /api/vehicle-makes/{makeCode}`

- The client asks the user to confirm the permanent, irreversible action before making this request.
- `204 No Content`: record permanently removed.
- No match: `404 Not Found` with ProblemDetails.

## Error Shape

Use standard `ProblemDetails` fields (`type`, `title`, `status`, `detail`, and optional `instance`/extensions). Do not expose raw exception details. Client-facing messages use British/Indian English, do not reveal raw server messages, and explain the next action where applicable.
