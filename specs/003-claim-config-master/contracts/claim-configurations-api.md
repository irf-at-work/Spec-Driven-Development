# Claim Configurations API Contract

This is the planned HTTP boundary for CCM. ASP.NET Core's declared action return types remain the OpenAPI source used to generate Angular client types. JSON names use camelCase. All non-success responses use `ProblemDetails`; exception details and stack traces are never returned. Async operations accept and propagate `CancellationToken`.

Shared filtering, sorting, pagination, error, and response behavior follows [Master Data Common Ground Rules](../../../master-data-common.md). Routes below are proposals for implementation and should be aligned with established controller conventions.

## List CCM configurations

`GET /api/claim-configurations?page={page}&pageSize={pageSize}&companyCode={text}&companyCodeOperator={operator}&ccmCode={text}&ccmCodeOperator={operator}&name={text}&nameOperator={operator}&shortName={text}&shortNameOperator={operator}&active={true|false}&activeOperator={operator}&sortBy={field}&sortDirection={asc|desc}`

- Filter and sort fields follow FR-025–FR-027: Company Code, CCM Code, Claim Config Name, Short Name, and Status; no global search.
- `page` defaults to 1; API `pageSize` defaults to 10 and supports 10, 25, and 50.
- Return `PaginatedResult<ClaimConfigurationListItemDto>` (`items`, `page`, `pageSize`, `totalCount`). Initial order is Company Code ascending then CCM Code ascending.
- Invalid page, filter operator, sort field, or direction returns `400 ProblemDetails`.

## Read a CCM

`GET /api/claim-configurations/{companyCode}/{ccmCode}`

- `200 OK`: full `ClaimConfigurationDto`, including settings, active state and audit values.
- No matching composite key: `404 ProblemDetails`.

## Create a CCM

`POST /api/claim-configurations`

`CreateClaimConfigurationRequest` contains `ccmCode`, `name`, and optional fields/settings. It does not accept `companyCode`; the API obtains that from the existing session context, or from the required fixed Company Code application setting `ASRTEST` while authentication is out of scope.

- `200 OK`: saved `ClaimConfigurationDto`.
- Invalid required field, format, flag, or lookup code: `400 ProblemDetails` with field errors.
- Existing global CCM Code: `409 ProblemDetails`; nothing is saved.
- The API stamps audit values using current project conventions (`admin`, GST).

## Update a CCM

`PUT /api/claim-configurations/{companyCode}/{ccmCode}`

`UpdateClaimConfigurationRequest` contains editable values only. It omits both key fields. Company Code and CCM Code cannot be changed. Active/inactive status is maintained through this update; a separate permanent CCM delete route is not defined.

- `200 OK`: updated `ClaimConfigurationDto`.
- Invalid request: `400 ProblemDetails`; no update occurs.
- No matching CCM: `404 ProblemDetails`.

## List products associated with a CCM

`GET /api/claim-configurations/{companyCode}/{ccmCode}/products?page={page}&pageSize={pageSize}`

- `200 OK`: `PaginatedResult<AssociatedProductDto>`.
- The Applicable Products UI requests `pageSize=5` initially. The API's shared default remains 10 when no size is supplied.
- Each item contains `productCode` and `productName` in the specified display forms (`LI_CODE`, `LI_TYPE - LI_DESC`) plus the association key needed for removal.
- No CCM match returns `404 ProblemDetails`.

## Add a product association

`POST /api/claim-configurations/{companyCode}/{ccmCode}/products`

Request: `{ "productCode": "..." }`.

- `200 OK`: saved `AssociatedProductDto`.
- Existing product/CCM pair: `409 ProblemDetails`; no duplicate association is created.
- Invalid or unavailable product choice: `400 ProblemDetails` (final availability validation depends on verified product source).
- Missing CCM: `404 ProblemDetails`.

## Remove a product association

`DELETE /api/claim-configurations/{companyCode}/{ccmCode}/products/{productCode}`

- The UI obtains confirmation before sending this request.
- `204 No Content`: only this association is removed.
- No matching association: `404 ProblemDetails`.

## Retrieve CCM links for a product

`GET /api/products/{productCode}/claim-configurations?page={page}&pageSize={pageSize}`

- `200 OK`: paginated linked CCM references/details so a product's associations can be retrieved by product ID.
- This endpoint exposes stored associations and does not select a CCM or define transaction behavior when multiple links exist.
- Product route ownership and exact DTO can be aligned with the eventual product feature during implementation planning.

## Lookup choices — implementation gate

The CCM settings require active `STD_LIST_ITEM` choices (FR-020), and the Add modal requires product choices labelled `LI_CODE - LI_TYPE - LI_DESC` (FR-031). The repository does not establish the relevant `LI_TYPE` mappings or authoritative product source. Before fixing the lookup contract, perform the read-only Oracle review identified in [research.md](../research.md). If the product choices are not a small, bounded set, determine the appropriate paginated selection interaction before implementation; do not ship an unpaged large lookup by assumption.

Once verified, prefer one typed, read-only lookup response for the confirmed CCM lists when their sizes justify the existing options-endpoint convention. Product options may be a separate lookup because their source and volume are not yet known.

## Database uniqueness gate

The owner-approved rule requires global uniqueness of `CCM_CODE`, but the supplied primary key is composite. Oracle metadata review must verify a unique index/constraint that guarantees global uniqueness. A service-side pre-check alone is not race-safe. If no database guarantee exists, stop and request approval for a schema change before implementing CCM create/update writes.
