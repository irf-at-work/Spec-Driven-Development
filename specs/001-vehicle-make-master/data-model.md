# Data Model: Vehicle Make Master

## Scope

Two logical entities are needed: Vehicle Make, and Vehicle Model, which belongs to a make (see below). The physical table for makes is Oracle `BRM_VEH_make`, as described by the owner on 29-Oct-2026 (see Physical Mapping below). Do not issue DDL, seed data, or edit scaffolded files as part of this design.

## Verification Gate Status

The owner approved read-only inspection and the dedicated test-schema/fixture scope. Metadata was inspected using the configured Oracle session (`IIRIS_RD_DEVP`); no DDL or database-data changes were run. The make/model keys, non-cascading foreign key, list-item key, active-flag constraints, audit triggers, and declared column lengths were verified.

The configured `STD_LIST_ITEM` table currently has no vehicle-model list types or fixtures. Its `LI_TYPE VARCHAR2(20 BYTE)` supports the proposed names; the owner confirmed the approved list types and fixtures will be loaded separately. No lookup data was changed. All inspected `VARCHAR2` fields use byte semantics, which cannot guarantee the specified character limits for Arabic text; owner-approved schema resolution is needed before full character-limit support can be claimed.

## Entity: Vehicle Make

| Field | Logical type | Required | Limit | Rules |
|---|---|---:|---:|---|
| Make Code | String | Yes | 12 characters | Letters, digits, or hyphens only; save in capitals; unique; immutable after creation. Used as the API route key. |
| Make Name | String | Yes | 100 characters | Trim/collapse extra spaces; capitalize the first letter of each word, preserving any word entered entirely in capitals. |
| Short Name | String | Yes | 30 characters | Same normalization as Make Name. |
| Remarks | String | No | 2000 characters | Optional; normalize extra spaces as other non-Arabic text. |
| Arabic Make Name | String | No | 100 characters | Display right to left; preserve text and spacing exactly. |
| Arabic Short Name | String | No | 30 characters | Display right to left; preserve text and spacing exactly. |
| Arabic Remarks | String | No | 2000 characters | Display right to left; preserve text and spacing exactly. |
| Active | Boolean | Yes | N/A | On by default when adding. The user can turn it off while adding or editing, and on again while editing. This is the soft delete. Shown but not changeable in read-only view. |
| Created By | String | Yes | Existing schema-defined | Set to `admin` on create, if represented by the existing schema. |
| Last Changed By | String | Yes | Existing schema-defined | Set to `admin` on create and every successful edit, if represented by the existing schema. |

### Schema Mapping Notes

- The API must reject null/empty Make Code and duplicate codes even if the UI has already validated them. The approved Oracle schema should enforce not-null and uniqueness as well; propose a schema change only if inspection finds that enforcement absent, and obtain owner approval before DDL.
- **`VMAK_CODE` is the primary key** (owner-confirmed). It is `VARCHAR2(12) NOT NULL` and is entered by the user, not generated. A duplicate code is rejected by the API (409) and the database primary key is the final guard against two simultaneous saves; a unique-constraint violation from Oracle (ORA-00001) must map to the same duplicate-code response.
- Live metadata confirms `VMAK_CODE` is the primary key.
- `VMAK_NAME` is nullable in the database, but the application requires it (and `VMAK_SHORT_NAME`). The API is the authority for required fields.
- Scaffolded entities and context are generated from the database. Never edit scaffolded files directly; add any required extension behavior using partial classes.
- All make `VARCHAR2` columns use byte semantics (`CHAR_USED = B`); their byte lengths match the listed lengths, so multi-byte text can hit the database limit before reaching the specified character limit. Do not claim full character-limit support without owner-approved schema resolution.

### Physical Mapping: Oracle `BRM_VEH_make`

| Logical field | Column | Oracle type | Null? | Notes |
|---|---|---|---|---|
| Make Code | `VMAK_CODE` | VARCHAR2(12) | NOT NULL | Primary key; user-entered; stored in capitals |
| Make Name | `VMAK_NAME` | VARCHAR2(100) | Nullable | Required by the application |
| Short Name | `VMAK_SHORT_NAME` | VARCHAR2(30) | Nullable | Required by the application |
| Remarks | `VMAK_REMARKS` | VARCHAR2(2000) | Nullable | Optional |
| Arabic Make Name | `VMAK_NAME_L2` | VARCHAR2(100) | Nullable | Optional |
| Arabic Short Name | `VMAK_SHORT_NAME_L2` | VARCHAR2(30) | Nullable | Optional |
| Arabic Remarks | `VMAK_REMARKS_L2` | VARCHAR2(2000) | Nullable | Optional |
| Active | `VMAK_ACTIVE_YN` | VARCHAR2(1) | Nullable | `Y` when Active is on, `N` when off (soft delete). Owner decision 29-Oct-2026, replacing the earlier decision that this page would not touch it. The API always writes the value the user chose and treats a null on an older row as Active. Live scaffolding reports a `Y` default; no Y/N check constraint was found. |
| Created By | `VMAK_CR_BY` | VARCHAR2(12) | Nullable | `admin` for now |
| Created Date | `VMAK_CR_DT` | DATE | Nullable | No database trigger was found; the API must stamp it in GST. |
| Last Changed By | `VMAK_UP_BY` | VARCHAR2(12) | Nullable | `admin` for now |
| Last Changed Date | `VMAK_UP_DT` | DATE | Nullable | No database trigger was found; the API must stamp it in GST. |

## Entity: Vehicle Model (child of Vehicle Make)

A Vehicle Model belongs to exactly one Vehicle Make and is maintained inline on that make's page (spec User Story 5). Physical table: Oracle `BRM_VEH_MODEL`, as described by the owner on 29-Oct-2026. The owner approved schema inspection and scaffolding (constitution B8); scaffolded files are generated from the database and never edited by hand.

### Rules

| Field | Required | Limit / type | Rules |
|---|---:|---|---|
| Make Code | Yes | 12 characters | Taken from the open make (route), never typed on the model row. |
| Model Code | Yes | 12 characters | Letters, digits, hyphens only; saved in capitals; unique within its make; immutable after creation. Used as the API route key under the make. |
| Model Name | Yes | 100 characters | Same normalisation as Make Name. |
| Short Name | Yes | 30 characters | Same normalisation as Make Short Name. |
| Remarks | No | 2000 characters | Same normalisation as Make Remarks. |
| Arabic Name / Short Name / Remarks | No | 100 / 30 / 2000 characters | Right to left; preserved exactly, including spacing. |
| Variant, Type, Body Type, Fuel Type, Cylinders, Doors, Driving Type, Body Colour, Category | No | 12 characters each | Each is a dropdown of the active `STD_LIST_ITEM` rows for its own list type (table below). The stored value is the item's `LI_CODE`. The API refuses a code that is not an active item of that type. |
| Weight, Load Capacity | No | 100 characters each | Free text. |
| Engine Capacity (CC) | No | Whole number | Zero or more. |
| Make Year | No | Whole number, up to 4 digits | Zero or more. |
| Seats, Passengers, Drivers | No | Whole number, up to 3 digits | Zero or more. |
| Value (AED) | No | Decimal | Zero or more; held as `decimal` in C# (constitution B4). |
| Active | Yes | `Y` or `N` | On by default when adding; the user can turn it off or on while adding or editing the model's row. Independent of the make's Active flag. |
| Created By / Last Changed By | Yes | Schema-defined | `admin` on create and on every successful change. |

### Physical Mapping: Oracle `BRM_VEH_MODEL`

| Logical field | Column | Oracle type | Null? | Notes |
|---|---|---|---|---|
| Make Code | `VMOD_VMAK_CODE` | VARCHAR2(12) | NOT NULL | Part of the primary key; foreign key to `BRM_VEH_MAKE.VMAK_CODE` (owner-confirmed 29-Oct-2026). |
| Model Code | `VMOD_CODE` | VARCHAR2(12) | NOT NULL | Part of the primary key together with `VMOD_VMAK_CODE` (owner-confirmed 29-Oct-2026). |
| Model Name | `VMOD_NAME` | VARCHAR2(100) | Nullable | Required by the application |
| Short Name | `VMOD_SHORT_NAME` | VARCHAR2(30) | Nullable | Required by the application |
| Remarks | `VMOD_REMARKS` | VARCHAR2(2000) | Nullable | Optional |
| Arabic Name | `VMOD_NAME_L2` | VARCHAR2(100) | Nullable | Optional |
| Arabic Short Name | `VMOD_SHORT_NAME_L2` | VARCHAR2(30) | Nullable | Optional |
| Arabic Remarks | `VMOD_REMARKS_L2` | VARCHAR2(2000) | Nullable | Optional |
| Variant | `VMOD_VARIANT` | VARCHAR2(12) | Nullable | Dropdown, list type `VEH_VARIANT` |
| Type | `VMOD_TYPE` | VARCHAR2(12) | Nullable | Dropdown, list type `VEH_TYPE` |
| Weight | `VMOD_WEIGHT` | VARCHAR2(100) | Nullable | Free text |
| Load Capacity | `VMOD_LOAD_CAPACITY` | VARCHAR2(100) | Nullable | Free text |
| Body Type | `VMOD_BODY_TYPE` | VARCHAR2(12) | Nullable | Dropdown, list type `VEH_BODY_TYPE` |
| Fuel Type | `VMOD_FUEL_TYPE` | VARCHAR2(12) | Nullable | Dropdown, list type `VEH_FUEL_TYPE` |
| Engine Capacity (CC) | `VMOD_CC` | NUMBER | Nullable | Whole number |
| Cylinders | `VMOD_CYLINDER` | VARCHAR2(12) | Nullable | Dropdown, list type `VEH_CYLINDER` |
| Seats | `VMOD_NO_SEATS` | NUMBER(3) | Nullable | Whole number, up to 3 digits |
| Passengers | `VMOD_NO_PASS` | NUMBER(3) | Nullable | Whole number, up to 3 digits |
| Drivers | `VMOD_NO_DRVR` | NUMBER(3) | Nullable | Whole number, up to 3 digits |
| Doors | `VMOD_DOORS` | VARCHAR2(12) | Nullable | Dropdown, list type `VEH_DOORS` |
| Make Year | `VMOD_MAKE_YEAR` | NUMBER | Nullable | Whole number |
| Driving Type | `VMOD_DRIVING_TYPE` | VARCHAR2(12) | Nullable | Dropdown, list type `VEH_DRIVING_TYPE` |
| Body Colour | `VMOD_BODY_COLOR` | VARCHAR2(12) | Nullable | Dropdown, list type `VEH_BODY_COLOR` |
| Value (AED) | `VMOD_VALUE_LC` | NUMBER | Nullable | Decimal; local currency is AED |
| Active | `VMOD_ACTIVE_YN` | VARCHAR2(1) | Nullable | `Y` when Active is on, `N` when off (soft delete), as for the make. A null on an older row is treated as Active. Live metadata shows no default or Y/N check constraint. |
| Category | `VMOD_CATG_CODE` | VARCHAR2(12) | Nullable | Dropdown, list type `VEH_CATEGORY` |
| Created By | `VMOD_CR_BY` | VARCHAR2(12) | Nullable | `admin` for now |
| Created Date | `VMOD_CR_DT` | DATE | Nullable | No database trigger was found; the API must stamp it in GST. |
| Last Changed By | `VMOD_UP_BY` | VARCHAR2(12) | Nullable | `admin` for now |
| Last Changed Date | `VMOD_UP_DT` | DATE | Nullable | No database trigger was found; the API must stamp it in GST. |

All model `VARCHAR2` columns use byte semantics. The database byte limits do not guarantee the stated character limits for multi-byte text.

### Dropdown list types (Oracle `STD_LIST_ITEM`)

The nine dropdowns read the table `STD_LIST_ITEM`. Each is selected by its `LI_TYPE`. The names below were proposed before live verification. The configured table has `LI_TYPE VARCHAR2(20 BYTE)`, so the proposed names fit; the owner must still provide the actual list-type mappings and fixture data.

| Model field | `LI_TYPE` to load | Example `LI_CODE` / `LI_DESC` the owner might add |
|---|---|---|
| Variant | `VEH_VARIANT` | `STD` / Standard |
| Type | `VEH_TYPE` | `SEDAN` / Sedan |
| Body Type | `VEH_BODY_TYPE` | `SUV` / Sports Utility Vehicle |
| Fuel Type | `VEH_FUEL_TYPE` | `PETROL` / Petrol |
| Cylinders | `VEH_CYLINDER` | `4` / 4 Cylinders |
| Doors | `VEH_DOORS` | `4` / 4 Doors |
| Driving Type | `VEH_DRIVING_TYPE` | `AWD` / All-Wheel Drive |
| Body Colour | `VEH_BODY_COLOR` | `WHITE` / White |
| Category | `VEH_CATEGORY` | `PRIVATE` / Private |

The examples are only illustrations of the shape of the data. Nothing is inserted by this feature (constitution B8: the owner approves and performs any data load). Live inspection found only `CALC_TYPE` (4 active items), `CHARGE_CAT` (2), `CHARGE_TYPE` (3), and `DISCOUNT_TYPE` (2); none of the nine vehicle types or their fixtures are present.

| Logical field | Column | Oracle type | Null? | Use on this page |
|---|---|---|---|---|
| List type | `LI_TYPE` | VARCHAR2(20 BYTE) | NOT NULL | Selects which dropdown the row belongs to; proposed names fit. |
| Item code | `LI_CODE` | VARCHAR2(12) | NOT NULL | The value stored in the model's column |
| Description | `LI_DESC` | VARCHAR2(100) | Nullable | The text shown in the dropdown; ordering key |
| Arabic description | `LI_DESC_L2` | VARCHAR2(100) | Nullable | Not used on this page |
| Short description, Arabic short description, value, flex columns | `LI_SHORT_DESC`, `LI_SHORT_DESC_L2`, `LI_VALUE`, `LI_FLEX_01`, `LI_FLEX_02` | VARCHAR2 | Nullable | Not used on this page |
| Active flag | `LI_ACTIVE_YN` | VARCHAR2(1) | Nullable | Only `Y` items are offered for a new choice |
| Audit columns | `LI_CR_BY`, `LI_CR_DT`, `LI_UP_BY`, `LI_UP_DT` | VARCHAR2 / DATE | Nullable | Not used; this page only reads the table |

The API only reads `STD_LIST_ITEM`; it never writes it. Only the nine approved types may be requested, so a caller cannot read other list types through this page. Live metadata confirms `(LI_TYPE, LI_CODE)` is the primary key; `LI_DESC` is nullable, and only rows with `LI_ACTIVE_YN = 'Y'` are offered.

### Schema Mapping Notes

- Live constraints confirm the model composite primary key `(VMOD_VMAK_CODE, VMOD_CODE)` and the enabled make foreign key with `DELETE_RULE = NO ACTION`.
- The nine code-style model columns are not expected to have database foreign keys to `STD_LIST_ITEM` (its key is two columns). The API therefore checks every submitted code against the active items of the right list type.
- The API must reject a null or empty Model Code and a duplicate code within the make, and map Oracle ORA-00001 (unique violation) to the same duplicate response as for makes.
- The API checks for child models before deleting a make and returns an actionable `409 ProblemDetails` response when any exist. The non-cascading foreign key remains the final guard against a concurrent child insert; map Oracle ORA-02292 to the same conflict response, never to a raw database message.
- A model whose make does not exist must be reported as not found; the API never accepts a Make Code from the request body.
- The required dropdown list types and fixtures are absent from the configured schema; see the verification blocker above. This feature reads the table only and must not insert or update lookup rows.

## Lifecycle

1. **Created**: Validated fields are normalized where applicable, saved, and stamped with `admin`.
2. **Viewed**: Details are read-only by default; existing Additional Information expands when any of its fields has data.
3. **Edited**: Make Code stays immutable. Other fields are validated and normalized on save, and the changed-by value is stamped `admin`.
4. **Deactivated and restored (soft delete)**: Turning Active off while editing and saving marks the record inactive. It stays in the list and can be opened. Turning Active on again and saving restores it. A make's models are not changed when the make is turned off.
5. **Permanently deleted**: A user confirms the irreversible warning in the UI; the API permanently removes the selected model or a make with no models. A make that still has models cannot be deleted until its models are removed. No restore state exists after permanent deletion.

## Query Behavior

- Search only Make Code, Make Name, and Short Name; search the complete set before pagination.
- Sort only Make Code, Make Name, and Short Name; initial order is Make Code ascending. Apply sorting to the complete filtered set before pagination.
- Return `items`, `page`, `pageSize`, and `totalCount`; page size is 10.
- Models of a make: return only the rows whose `VMOD_VMAK_CODE` equals the open make's code, ordered by Model Code ascending, paged at 10, using the same `PaginatedResult` shape. No search or sort options.
- Both the make list items and the model rows include their Active status. Inactive records are not filtered out of either list.
- Dropdown options: return the active `STD_LIST_ITEM` choices for the nine fixed list types, ordered by English description. This lookup is intentionally unpaged under the owner-approved spec decision; record the required constitution C3 exception before implementation.
