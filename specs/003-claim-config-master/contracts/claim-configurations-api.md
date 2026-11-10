# Claim Configurations API Contract

This is the planned HTTP boundary for CCM. ASP.NET Core's declared action return types remain the OpenAPI source used to generate Angular client types. JSON names use camelCase. All non-success responses use `ProblemDetails`; exception details and stack traces are never returned. Async operations accept and propagate `CancellationToken`.

Shared filtering, sorting, pagination, error, and response behavior follows [Master Data Common Ground Rules](../../../master-data-common.md). Routes below are proposals for implementation and should be aligned with established controller conventions.

## List CCM configurations

`GET /api/claim-configurations?page={page}&pageSize={pageSize}&ccmCode={text}&ccmCodeOperator={operator}&name={text}&nameOperator={operator}&shortName={text}&shortNameOperator={operator}&module={text}&moduleOperator={operator}&active={true|false}&activeOperator={operator}&sortBy={field}&sortDirection={asc|desc}`

- Filter and sort fields follow FR-025–FR-027: CCM Code, Claim Config Name, Short Name, Module Name, and Status; Company Code is never returned for display by the frontend, and there is no global search.
- `page` defaults to 1; API `pageSize` defaults to 10 and supports 10, 25, and 50.
- Return `PaginatedResult<ClaimConfigurationListItemDto>` (`items`, `page`, `pageSize`, `totalCount`), including the module code for display-name resolution. Initial order is CCM Code ascending.
- Invalid page, filter operator, sort field, or direction returns `400 ProblemDetails`.

## Read a CCM

`GET /api/claim-configurations/{ccmCode}`

- `200 OK`: full `ClaimConfigurationDto`, including settings, active state and audit values.
- The API derives Company Code from the logged-in user's company; in the current no-identity test environment it uses configured `ASRTEST`. The caller does not choose Company Code in the route.
- No matching composite key: `404 ProblemDetails`.

## Create a CCM

`POST /api/claim-configurations`

`CreateClaimConfigurationRequest` contains `ccmCode`, `name`, and optional fields/settings. It does not accept `companyCode`; the API obtains that from the existing session context, or from the required fixed Company Code application setting `ASRTEST` while authentication is out of scope.

- `200 OK`: saved `ClaimConfigurationDto`.
- Invalid required field, format, flag, or lookup code: `400 ProblemDetails` with field errors.
- Existing global CCM Code: `409 ProblemDetails`; nothing is saved.
- The API stamps audit values using current project conventions (`admin`, GST).

## Update a CCM

`PUT /api/claim-configurations/{ccmCode}`

`UpdateClaimConfigurationRequest` contains editable values only. It omits both key fields. Company Code and CCM Code cannot be changed. Active/inactive status is maintained through this update.

The API derives Company Code from the logged-in user's company when user identity is available. In the current no-identity test environment, it uses configured `ASRTEST`; callers cannot select another Company Code in the route or request body.

- `200 OK`: updated `ClaimConfigurationDto`.
- Invalid request: `400 ProblemDetails`; no update occurs.
- No matching CCM: `404 ProblemDetails`.

## Delete a CCM

`DELETE /api/claim-configurations/{ccmCode}`

- The UI obtains explicit confirmation before sending this request.
- `204 No Content`: only the selected CCM record is deleted.
- `404 ProblemDetails`: no matching CCM exists.
- `409 ProblemDetails`: at least one `BRM_CCM_PROD` row references the CCM Code. The API leaves the CCM and all association rows unchanged; it never cascades or deletes associated products.
- Writes remain disabled unless the configured write gate is enabled.

## List products associated with a CCM

`GET /api/claim-configurations/{ccmCode}/products?page={page}&pageSize={pageSize}`

- `200 OK`: `PaginatedResult<AssociatedProductDto>`.
- The Applicable Products UI requests `pageSize=5` initially; this endpoint accepts five for that table. The API's shared default remains 10 when no size is supplied. Other shared page sizes remain available.
- Each item contains `productCode`, `productType`, and `description` mapped from `LI_CODE`, `LI_TYPE`, and `LI_DESC`; product-name display is `LI_TYPE - LI_DESC`. If a choice row is later removed, the association remains visible with an unavailable-choice label.
- No CCM match returns `404 ProblemDetails`.

## Add a product association

`POST /api/claim-configurations/{ccmCode}/products`

Request: `{ "productCode": "..." }`.

- `204 No Content`: association created; the API stamps the association creation and update user/date audit fields.
- Existing product/CCM pair: `409 ProblemDetails`; no duplicate association is created.
- Inactive or missing `CCM_PRODUCT` choice: `400 ProblemDetails`.
- Missing CCM: `404 ProblemDetails`.

## Remove a product association

`DELETE /api/claim-configurations/{ccmCode}/products/{productCode}`

- The UI obtains confirmation before sending this request.
- `204 No Content`: only this association is removed.
- No matching association: `404 ProblemDetails`.

## Retrieve CCM links for a product

`GET /api/products/{productCode}/claim-configurations?page={page}&pageSize={pageSize}`

- `200 OK`: paginated linked CCM references/details so a product's associations can be retrieved by product ID.
- This endpoint exposes stored associations and does not select a CCM or define transaction behavior when multiple links exist.
- Product route ownership and exact DTO can be aligned with the eventual product feature during implementation planning.

## Lookup choices — implementation gate

The CCM settings require active `STD_LIST_ITEM` choices (FR-020) and remain gated on their own confirmed mappings. The owner has approved product choices from `STD_LIST_ITEM` with `LI_TYPE = 'CCM_PRODUCT'`; `LI_CODE` is product code, `LI_DESC` is description, and only `LI_ACTIVE_YN = 'Y'` rows are offered (FR-036). The product-choice count is calculated at request time; pagination does not assume a fixed list size.

Every lookup-choice and product-choice listing endpoint MUST return the shared `PaginatedResult<T>` (`items`, `page`, `pageSize`, `totalCount`) with default page size 10, as required by constitution B8 and FR-037. Use a field/list-type selector for CCM choices so each dropdown can retrieve its own pages. The product-choice endpoint returns pages of available products; the modal lets employees retrieve subsequent pages. Do not introduce an unpaged endpoint based on an assumed small result set.

Proposed routes:

- `GET /api/claim-configuration-options/{field}?page={page}&pageSize={pageSize}` returns `PaginatedResult<LookupChoiceDto>` for the confirmed CCM field/list mapping. Only active choices are returned for new selections.
- `GET /api/claim-configurations/available-products?page={page}&pageSize={pageSize}` returns `PaginatedResult<AvailableProductDto>` from active `CCM_PRODUCT` rows in `STD_LIST_ITEM`. `AvailableProductDto` maps `LI_CODE`, `LI_TYPE`, and `LI_DESC` to productCode, productType, and description.

When a CCM currently stores a lookup value that is now inactive, its detail response retains that value. While editing, the UI displays it as the current value if unchanged, but the paginated choices endpoint offers active entries only for new selections.

## Database uniqueness gate

The owner-approved rule requires global uniqueness of `CCM_CODE`, but the supplied primary key is composite. Oracle metadata review must verify a unique index/constraint that guarantees global uniqueness. A service-side pre-check alone is not race-safe. If no database guarantee exists, stop and request approval for a schema change before implementing CCM create/update writes.
