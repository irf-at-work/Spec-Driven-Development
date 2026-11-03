# Document Setup API Contract

This feature adds typed REST operations to the existing ASP.NET Core API. All requests use the existing `CodesMasterOracle` connection. The shared `PaginatedResult<T>` response is used for listing endpoints; non-success responses use the existing `application/problem+json` `ProblemDetails` contract. All operations accept cancellation.

## OpenAPI and generated client

The repository's canonical OpenAPI input is `specs/001-codes-master/contracts/codes-master.openapi.yaml`, consumed by `sdd-ui/ng-openapi-gen.json`. Add the endpoints and schemas described here to that canonical document during implementation, regenerate the Angular client, and do not hand-edit generated files. Keep response shapes in C# return types and do not add Swagger response attributes.

## Parent document operations

| Method and path                         | Purpose                                                                                                                                                        | Result                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `GET /api/document-setups`              | List parents; query parameters `page`, `pageSize`, `sortBy`, `sortDirection`, and per-column filter operator/value pairs. | `200 PaginatedResult<DocumentSetupSummary>`                                            |
| `GET /api/document-setups/{docCode}`    | Retrieve a parent by primary key.                                                                                                                              | `200 DocumentSetupRecord`; `404 ProblemDetails` if absent.                             |
| `POST /api/document-setups`             | Create a parent.                                                                                                                                               | `201 DocumentSetupRecord`; validation/duplicate errors are `400`/`409 ProblemDetails`. |
| `PUT /api/document-setups/{docCode}`    | Update the parent without changing its key; require its expected version token.                                                                                | `200 DocumentSetupRecord`; stale/missing record is `409`/`404 ProblemDetails`.         |
| `DELETE /api/document-setups/{docCode}` | Delete only if no child rows exist; require its expected version token.                                                                                        | `204`; children/stale record are `409 ProblemDetails`; absent record is `404`.         |

Parent list filters are case-insensitive, support `StartsWith`, `EndsWith`, `Contains`, `DoesNotContain`, `EqualTo`, and `NotEqualTo`, and combine with AND before paging. Each operator/value pair is validated together. Sorting is server-side and happens before paging; sortable columns are Doc Code, Doc Name, Description, Setup For, and Active Y/N. The default sort is Doc Code ascending, with Doc Code as a stable tie-breaker. The default page size is 10; allowed sizes are 10, 15, 20, and 50.

## Applicable Module operations

| Method and path                                                       | Purpose                                                                                                     | Result                                                                             |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `GET /api/document-setups/{docCode}/applicable-modules`               | List children for one parent; support `page`, `pageSize`, `sortBy`, `sortDirection`, and applicable-for filter parameters. | `200 PaginatedResult<ApplicableModuleSummary>`                                     |
| `GET /api/document-setups/{docCode}/applicable-modules/{damodUid}`    | Retrieve one child after verifying its parent association.                                                  | `200 ApplicableModuleRecord`; otherwise `404`.                                     |
| `POST /api/document-setups/{docCode}/applicable-modules`              | Create a child; the server allocates `DAMOD_UID` using serialized max-plus-one.                             | `201 ApplicableModuleRecord`; validation/association errors are `400`/`404`/`409`. |
| `PUT /api/document-setups/{docCode}/applicable-modules/{damodUid}`    | Update that child without changing its identity or parent; require expected version.                        | `200 ApplicableModuleRecord`; stale/missing record is `409`/`404`.                 |
| `DELETE /api/document-setups/{docCode}/applicable-modules/{damodUid}` | Delete only the selected child; require expected version.                                                   | `204`; stale/missing record is `409`/`404`.                                        |

Child list filters have the same operators, case-insensitive matching, AND semantics, allowed page sizes, and default page size. Sorting is server-side and happens before paging; sortable columns are Applicable For, all range fields, Mandatory, and Active. The default sort is Applicable For ascending, with numeric `DAMOD_UID` as a stable tie-breaker.

Both listings leave optional cells blank when their value is absent; the explicit `ALL` value remains visible.

## Shapes and rules

- Parent write fields: `docCode`, `docName`, `nameInArabic`, `docDescription`, `descriptionInArabic`, `docSetupFor`, `flex1`, `flex2`, and `activeYn`. `docCode` and `docSetupFor` are required. `docSetupFor` must be a code from Codes Master with `codeType = "DOC_SETUP_FOR"`; the UI displays its code and description, while the API stores the code string in the existing `VARCHAR2` column. Current entries include `"101"` (File Upload) and `"102"` (Doc Print).
- Parent update requests include `expectedVersion` in the JSON body; parent delete requests include it as a required query parameter.
- Child write fields: `applicableFor`, `productFrom`, `productTo`, `pcmFrom`, `pcmTo`, `ccmFrom`, `ccmTo`, `mandatoryYn`, and `activeYn`. `applicableFor` is required and comes from Codes Master entries with `codeType = "APPLICABLE_FOR"`; the UI displays its code and description while the API stores the code string. Fixed-asset applicable types display the range fields. Product range fields use Codes Master entries with `codeType = "PRODUCT"`, PCM fields use `codeType = "PCM"`, and CCM fields use `codeType = "CCM"`; dropdowns display `ALL` plus each code and description. If no range code is selected, the UI stores `ALL`; selected codes are stored as entered. Module tables display selected descriptions and `ALL` without a code.
- Child update requests include `expectedVersion` in the JSON body; child delete requests include it as a required query parameter.
- Record responses include server-managed creation/update audit fields and an opaque `version` value derived from the persisted row. Updates and deletes must supply the version they loaded. A mismatch returns `409` and tells the user to reload.
- `damodUid` is represented as a decimal string in JSON, preserving the Oracle numeric key exactly across JavaScript clients.
- Parent summary fields: `docCode`, `docName`, `docDescription`, `docSetupFor`, `activeYn`, and `version`.
- Child summary fields: `damodUid`, `applicableFor`, all six range fields, `mandatoryYn`, `activeYn`, and `version`. For Assured Master (`ASR`), all six range fields contain `ALL`.
- Create/update audit actors are `ADMIN`. Creation dates use Oracle `SYSDATE`; update dates use Oracle `SYSDATE`; creation values remain unchanged on update.
- Validation and operation failures use safe, actionable `ProblemDetails` and never expose exception details. Use `400` for invalid fields, `404` for absent records, and `409` for duplicate keys, stale versions, or parent deletion while children exist.
- The UI displays dates in GST as DD-MMM-YYYY and does not apply browser-local timezone conversion.
