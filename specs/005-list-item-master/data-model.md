# Data Model: List Item Master

## List item configuration

The application reuses the database-first `StdListItem` mapping for `IIRIS_RD_DEVP.STD_LIST_ITEM`. Do not edit the generated entity/context or change the database table. Public request/response DTOs expose business fields and read-only audit information; create/update requests never accept audit values.

| Public field | Existing column/property | Required | Maximum length / format |
|---|---|---:|---|
| `liType` | `LI_TYPE` / `LiType` | Create only | 20 characters; part of composite key |
| `liCode` | `LI_CODE` / `LiCode` | Create only | 12 characters; part of composite key |
| `description` | `LI_DESC` / `LiDesc` | No | 100 characters |
| `descriptionL2` | `LI_DESC_L2` / `LiDescL2` | No | 100 characters |
| `shortDescription` | `LI_SHORT_DESC` / `LiShortDesc` | No | 30 characters |
| `shortDescriptionL2` | `LI_SHORT_DESC_L2` / `LiShortDescL2` | No | 30 characters |
| `value` | `LI_VALUE` / `LiValue` | No | 100 characters |
| `activeYn` | `LI_ACTIVE_YN` / `LiActiveYn` | No | 1 character; `Y` or `N` for new or changed values |
| `flex01` | `LI_FLEX_01` / `LiFlex01` | No | 100 characters |
| `flex02` | `LI_FLEX_02` / `LiFlex02` | No | 100 characters |
| `createdBy` | `LI_CR_BY` / `LiCrBy` | System set | 12 characters; `Admin` |
| `createdAt` | `LI_CR_DT` / `LiCrDt` | System set | UTC timestamp |
| `lastUpdatedBy` | `LI_UP_BY` / `LiUpBy` | System set | 12 characters; `Admin` |
| `lastUpdatedAt` | `LI_UP_DT` / `LiUpDt` | System set | UTC timestamp |

All fields except the composite key are nullable in the existing scaffold. Type and code are required by the create workflow. Field limits and nullability must be checked against the scaffold before implementation; do not infer or add database constraints.

## Relationships and removal

- The primary key is `(LI_TYPE, LI_CODE)`.
- The currently scaffolded `BrokerDataContext` has no mapped relationship to `STD_LIST_ITEM`.
- Do not cascade delete or invent reference tables. Attempt deletion only after user confirmation; if Oracle reports a referencing constraint, retain the record and return a conflict explanation.

## List item list state

List state consists of a one-based page number, page size (default 10), sort field/direction, and optional per-column filters for type, code, description, short description, value, and active status. The action column is not sortable or filterable. Preserve this state in route query parameters during navigation.

## Validation and display

- Type and code are required on create, jointly identify a configuration, and cannot be changed after creation.
- Validate the current scaffold's maximum lengths in the UI for usability and again in the API as the authority.
- Treat active status as `Y` (active) or `N` (inactive); a status change does not remove a record.
- Set created/updated identities to `Admin` and timestamps to UTC in the API. Do not accept audit values from clients.
- Display audit timestamps in GST using DD-MM-YYYY, per the project convention.
- On update, change only explicitly supported business values and audit fields so other persisted values are not overwritten accidentally.
- Concurrent valid updates use last-write-wins.
