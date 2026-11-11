# Claim Configuration Master API Contract

This contract describes the CCM operations to add to the existing API. All routes use the current `CodesMasterOracle` connection, existing controller/service/repository conventions, cancellation tokens, and ProblemDetails error responses. The canonical Angular generator input remains `specs/001-codes-master/contracts/codes-master.openapi.yaml`; add these operations and schemas there during implementation, then regenerate the client with the configured `ng-openapi-gen` command. Do not edit generated files by hand.

## Parent operations

| Method and path | Purpose | Success result |
|---|---|---|
| `GET /api/claim-configurations` | List parent records for company codes `CCM001` and `ASRTEST` with company-code/data filters, sort, and server-side paging | `200 PaginatedResult<ClaimConfigurationSummary>` |
| `POST /api/claim-configurations` | Create a parent with fixed server-side company code `CCM001` | `201 ClaimConfigurationRecord` |
| `GET /api/claim-configurations/{ccmCode}` | Retrieve a parent by database-wide unique `CCM_CODE` | `200 ClaimConfigurationRecord` |
| `PUT /api/claim-configurations/{ccmCode}` | Update a parent without changing its code or company identity; requires its expected version | `200 ClaimConfigurationRecord` |
| `DELETE /api/claim-configurations/{ccmCode}` | Delete a parent only when no product mappings exist | `204` |

The list query accepts `page` (default 1), `pageSize` (default 10; allowed 10, 15, 20, 50), `sortBy`, and `sortDirection`. Supported sort columns are code, name, short name, and module name. Default sorting is code ascending; `CCM_CODE` is the stable tie-breaker.

Filter query parameters are paired operator/value fields for `ccmCode`, `ccmName`, `shortName`, and `moduleName`. Operators are `StartsWith`, `EndsWith`, `Contains`, `DoesNotContain`, `EqualTo`, and `NotEqualTo`. All comparisons ignore case; filters combine with AND and are applied before sorting and pagination. Module name filters and sort use `LI_DESC` for lookup type `CCM_MODULE`.

## Product mapping operations

| Method and path | Purpose | Success result |
|---|---|---|
| `GET /api/claim-configurations/{ccmCode}/products` | List product mappings for the selected parent | `200 IReadOnlyList<ApplicableProductSummary>` |
| `POST /api/claim-configurations/{ccmCode}/products` | Add one product mapping to the selected parent | `201 ApplicableProductRecord` |
| `GET /api/claim-configurations/{ccmCode}/products/{ccmpCode}` | Retrieve one mapping under its parent | `200 ApplicableProductRecord` |
| `PUT /api/claim-configurations/{ccmCode}/products/{ccmpCode}` | Change the product code for the identified mapping; requires its expected version | `200 ApplicableProductRecord` |
| `DELETE /api/claim-configurations/{ccmCode}/products/{ccmpCode}` | Delete only the selected mapping | `204` |

The child-list response is a simple collection. The UI filters the loaded collection by Product Code and Product Name using the existing six operators, case-insensitive matching, and AND combination; child pagination is not required. `ProductName` is resolved from `STD_LIST_ITEM.LI_DESC` for `LI_TYPE = 'CCM_PRODUCT'`.

Child create, edit, and delete operations verify that the parent exists and scope every child lookup/mutation to the route `ccmCode`. The child identity is `(CCMP_CCM_CODE, CCMP_CODE)`. An edit submits the selected new product code and checks the resulting composite key for duplicates before updating. Parent deletion checks for any mappings and returns conflict rather than cascading.

## Lookup operation

| Method and path | Purpose | Success result |
|---|---|---|
| `GET /api/claim-configurations/lookups/{liType}` | Return lookup options for an allowed CCM lookup type | `200 IReadOnlyList<ClaimConfigurationLookupOption>` |

The endpoint accepts only these exact `liType` values: `CCM_MODULE`, `CCM_POST_TYPE`, `CCM_EXCH_RATE`, `CCM_ROUND_TYPE`, `CCM_CURR_TYPE`, `CCM_CLO_REASON`, `CCM_DFLT_RECV_DEDU`, and `CCM_PRODUCT`. It selects `LI_CODE` and `LI_DESC` from `STD_LIST_ITEM`, returning only rows where `LI_ACTIVE_YN = 'Y'`. It does not accept a selected-code override.

## Request and response shapes

### Parent write request

`ClaimConfigurationWrite` includes `ccmCode`, `ccmName`, `ccmShortName`, `nameInArabic`, `shortNameInArabic`, `module`, `postingType`, `exchangeRateType`, `roundingType`, nullable `roundingValue`, `applicableCurrencies`, `defaultEstimateCloseReasonCode`, `defaultRecoveryCodeForDedl`, `printBeforeApprovalYn`, `rePrintAllowedYn`, `claimAccountDocumentGenerationYn`, `sharingClaimsAccountDocumentGenerationYn`, and `activeYn`.

`ccmCode` and `ccmName` are required. No company code, audit property, or key-changing field is accepted. Toggle values are represented as `Y`/`N` strings; Add defaults are N for the four ordinary toggles and Y for Active. `roundingValue` must be between 0 and 999.99999 with no more than five fractional digits. Parent update requests include an `expectedVersion` token from the record read for editing.

### Parent responses

- `ClaimConfigurationSummary`: `ccmCompCode`, `ccmCode`, `ccmName`, `ccmShortName`, `moduleName`, `createdBy`, `createdDate`, `updatedBy`, `updatedDate`.
- `ClaimConfigurationRecord`: all editable parent business fields, each saved dropdown field's display description (including inactive saved options), its immutable `ccmCode`, and opaque `version` token. The fixed company code and audit values remain server-managed.
- Listing: the shared `PaginatedResult<T>` shape (`items`, `page`, `pageSize`, `totalCount`).

### Product mapping write request and responses

- `ApplicableProductWrite`: `productCode` only. The parent code is taken from the route.
- `ApplicableProductSummary`: `productCode`, `productName`.
- `ApplicableProductRecord`: `productCode`, `productName` (including for an inactive saved product), route/identity values, and an opaque `version` token needed to target/update the current mapping.
- `ClaimConfigurationLookupOption`: `code` (`LI_CODE`) and `description` (`LI_DESC`).

An update may retain an inactive lookup value already stored on that record only if the submitted value is unchanged; any changed lookup value must be active and supplied by the lookup operation. Product update requests include `expectedVersion` from the mapping read for editing. A mismatch returns `409 ProblemDetails` instructing the user to reload; it must not overwrite newer data. Creation/update audit fields and company code are not accepted from clients. Persistence sets audit values per the feature specification.

## Errors and status codes

| Status | Use |
|---|---|
| `400` | Required/length/numeric/toggle/lookup/filter/page validation; ProblemDetails or ValidationProblemDetails |
| `404` | Requested parent, lookup-scoped child, or child mapping does not exist |
| `409` | Duplicate parent code, duplicate child key, parent deletion blocked by children, or other existing-record conflict |
| `500` | Existing global exception handling returns safe ProblemDetails without exception details |

All failures must be actionable, logged by existing middleware/service conventions, and must not be represented as success-shaped empty data.
