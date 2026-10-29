# Data Model: Shared Dashboard Foundation

## Existing Oracle tables

The database remains the source of truth for these definitions. EF Core reverse engineering will generate their application representations; this plan does not invent or alter columns, constraints, keys, or relationships.

| Table            | Purpose in this feature         | Fields, keys, and relationships                          |
| ---------------- | ------------------------------- | -------------------------------------------------------- |
| `STD_COMPANY`    | Existing company master data    | Derived from the current Oracle table during scaffolding |
| `STD_DEPARTMENT` | Existing department master data | Derived from the current Oracle table during scaffolding |
| `STD_LIST_ITEM`  | Existing shared list-item data  | Derived from the current Oracle table during scaffolding |

The generated `BrokerDataContext` maps exactly these tables under the `IIRIS_RD_DEVP` schema. The scaffold output consists of `Data/BrokerDataContext.cs` and one generated entity for each table under `Data/Entities/`. The generated context has no `OnConfiguring` override or embedded connection configuration.

Generated entity and context files are owned by the scaffold process and must not be hand-edited. Any later application-only extension must use partial classes or other constitution-compliant extension points. This feature performs no database writes.

## Paginated result

### `PaginatedResult<T>`

A shared, inheritable generic response type. `T` is the response DTO type for an item; it is not an EF-generated database entity.

| JSON field   | Meaning                              | Rule                                                      |
| ------------ | ------------------------------------ | --------------------------------------------------------- |
| `items`      | Records in the current page          | Array of `T`; empty when the selected page has no records |
| `page`       | Current page number                  | One-based page index                                      |
| `pageSize`   | Effective number of records per page | Defaults to 10 when the list request omits a page size    |
| `totalCount` | Number of matching records           | Count after filtering and before pagination               |

The serialized field names must match the shared API contract. Do not add other paging fields in this feature.

## Navigation entities

| Concept            | Meaning                                                            |
| ------------------ | ------------------------------------------------------------------ |
| Dashboard shell    | Shared application frame with the floating header and Masters menu |
| Masters menu entry | One of exactly two destinations: Company Master or Listing Master  |

The two destination pages are placeholders for navigation only; their fields and CRUD behavior belong to their own specifications.
