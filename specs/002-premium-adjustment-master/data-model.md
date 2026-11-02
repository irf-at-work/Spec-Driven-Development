# Data Model: Premium Adjustment Master

## Scope

One logical master entity (Adjustment Code), plus four read-only standard-list lookups that fill its dropdowns. There are no relationships to other entities in this feature beyond the lookup references. The adjustment-code table was inspected read-only on 02-Nov-2026 after owner approval. Do not issue DDL, seed data, or edit scaffolded files as part of this design.

## Verification Gate Status

- **Adjustment-code table**: `IIRIS_RD_DEVP.BRM_MISC_CODES` matches the feature fields and was inspected read-only. Its primary key is `(MC_CODE, MC_COMP_CODE, MC_TYPE)`, enforcing uniqueness of the Code + Company Code + Code Type combination. These three columns are `NOT NULL`; their VARCHAR2 lengths are 12 bytes.
- **`STD_LIST_ITEM`**: the provided Oracle column listing confirms `LI_TYPE VARCHAR2(20)` and `LI_CODE VARCHAR2(12)` are `NOT NULL`; `LI_DESC` and the other listed columns are nullable. It also lists `LI_DESC`/`LI_DESC_L2` as `VARCHAR2(100)`, `LI_SHORT_DESC`/`LI_SHORT_DESC_L2` as `VARCHAR2(30)`, `LI_VALUE`/`LI_FLEX_01`/`LI_FLEX_02` as `VARCHAR2(100)`, `LI_ACTIVE_YN VARCHAR2(1)`, and audit columns `LI_CR_BY`, `LI_CR_DT`, `LI_UP_BY`, `LI_UP_DT`. The listing does not show constraints or explicit BYTE/CHAR length semantics. The prior feature 001 inspection records primary key `(LI_TYPE, LI_CODE)`; verify the live constraint if this feature's implementation depends on it.
- Read-only inspection of the configured `STD_LIST_ITEM` found active options in `CALC_TYPE` (4), `CHARGE_CAT` (2), `CHARGE_TYPE` (3) and `DISCOUNT_TYPE` (2). The owner confirmed the mapping on 02-Nov-2026: Code Type uses `CALC_TYPE`, Discount Type uses `DISCOUNT_TYPE`, Charges Type uses `CHARGE_TYPE`, and Charges Category uses `CHARGE_CAT`.
- All `VARCHAR2` columns in `BRM_MISC_CODES` use BYTE semantics. The Arabic fields are 100, 30 and 2000 bytes, not characters. API/UI character limits can be enforced, but persistence of the maximum number of Arabic characters is not guaranteed. No schema change was made; owner approval and a schema resolution are needed before claiming full persisted Arabic-length support.
- No column in `BRM_MISC_CODES` has a database default. `MC_ACTIVE_YN` is nullable and has no Y/N check constraint; null is treated as Active and create must explicitly save the selected value. Audit columns are nullable, and no triggers exist, so the API must stamp audit values and dates.

## Physical Table: `BRM_MISC_CODES`

| Logical field | Oracle column | Type and verified limit |
|---|---|---|
| Code Type | `MC_TYPE` | `VARCHAR2(12 BYTE)`, not null |
| Code | `MC_CODE` | `VARCHAR2(12 BYTE)`, not null |
| Company Code | `MC_COMP_CODE` | `VARCHAR2(12 BYTE)`, not null |
| Name | `MC_DESC` | `VARCHAR2(100 BYTE)`, nullable |
| Short Name | `MC_SHORT_DESC` | `VARCHAR2(30 BYTE)`, nullable |
| Remarks | `MC_LONG_DESC` | `VARCHAR2(2000 BYTE)`, nullable |
| Arabic Name | `MC_DESC_L2` | `VARCHAR2(100 BYTE)`, nullable |
| Arabic Short Name | `MC_SHORT_DESC_L2` | `VARCHAR2(30 BYTE)`, nullable |
| Arabic Remarks | `MC_LONG_DESC_L2` | `VARCHAR2(2000 BYTE)`, nullable |
| Discount Type | `MC_DISC_TYPE` | `VARCHAR2(12 BYTE)`, nullable |
| Charges Type | `MC_CHG_TYPE` | `VARCHAR2(12 BYTE)`, nullable |
| Charges Category | `MC_CHG_CATEG` | `VARCHAR2(12 BYTE)`, nullable |
| Active | `MC_ACTIVE_YN` | `VARCHAR2(1 BYTE)`, nullable |
| Created By / Date | `MC_CR_BY` / `MC_CR_DT` | `VARCHAR2(12 BYTE)` / `DATE`, nullable |
| Last Changed By / Date | `MC_UP_BY` / `MC_UP_DT` | `VARCHAR2(12 BYTE)` / `DATE`, nullable |
| Unused by this feature | `MC_FLEX_01` | `VARCHAR2(60 BYTE)`, nullable |

The primary key constraint is `PK_BRM_MISC_CODES` over `(MC_CODE, MC_COMP_CODE, MC_TYPE)`. Inspection found no other unique constraint, no defaults, no Active Y/N check, and no table triggers.

## Entity: Adjustment Code

| Field | Logical type | Required | Limit | Rules |
|---|---|---:|---:|---|
| Code Type | String | Yes | Schema-defined | Item code from the Code Type standard list; active items only for a new choice; part of the composite uniqueness key; immutable after creation. |
| Code | String | Yes | 12 characters | Letters, digits, or hyphens only; save in capitals; part of the composite uniqueness key; immutable after creation. Used as part of the API route key. |
| Company Code | String | Yes | 12 characters | Letters, digits, or hyphens only; save in capitals; part of the composite uniqueness key; immutable after creation. |
| Name | String | Yes | 100 characters | Trim/collapse extra spaces; capitalise the first letter of each word, preserving any word entered entirely in capitals. |
| Short Name | String | Yes | 30 characters | Same normalisation as Name. |
| Discount Type | String | Yes | Schema-defined | Item code from the Discount Type standard list; active items only for a new choice; ordered by description. |
| Charges Type | String | Yes | Schema-defined | Item code from the Charges Type standard list; same rules. |
| Charges Category | String | Yes | Schema-defined | Item code from the Charges Category standard list; same rules. |
| Active | Boolean | Yes | N/A | On by default when adding. The user can turn it off while adding or editing, and on again while editing. This is the soft delete. Shown but not changeable in read-only view. Stored as `Y` or `N`. |
| Remarks | String | No | 2000 characters | Optional; normalise extra spaces as other non-Arabic text. |
| Arabic Name | String | No | 100 characters | Display right to left; preserve text and spacing exactly. |
| Arabic Short Name | String | No | 30 characters | Display right to left; preserve text and spacing exactly. |
| Arabic Remarks | String | No | 2000 characters | Display right to left; preserve text and spacing exactly. |
| Created By | String | Yes | Schema-defined | Set to `admin` on create, if represented by the existing schema. |
| Last Changed By | String | Yes | Schema-defined | Set to `admin` on create and every successful edit, if represented by the existing schema. |

Records saved before this feature may have no Discount Type, Charges Type or Charges Category, and a null Active flag. A null Active flag is treated as Active. Records missing any of the three classifications must have them chosen before they can be saved again.

## Entities: Standard Lists (read-only)

All four are read from `STD_LIST_ITEM`, each selected by its `LI_TYPE`. The API only reads this table; it never writes it.

| Dropdown | List type (`LI_TYPE`) | Status |
|---|---|---|
| Code Type | `CALC_TYPE` | Owner-confirmed 02-Nov-2026 |
| Discount Type | `DISCOUNT_TYPE` | Owner-confirmed 02-Nov-2026 |
| Charges Type | `CHARGE_TYPE` | Owner-confirmed 02-Nov-2026 |
| Charges Category | `CHARGE_CAT` | Owner-confirmed 02-Nov-2026 |

| Logical field | Column | Use on this page |
|---|---|---|
| List type | `LI_TYPE` | Selects which dropdown the row belongs to. Only the four approved types may be requested, so a caller cannot read other list types through this page. |
| Item code | `LI_CODE` | The value stored on the adjustment code. |
| Description | `LI_DESC` | The text shown in the dropdown, the text the Code Type filter matches, and the ordering key. |
| Active flag | `LI_ACTIVE_YN` | Only `Y` items are offered for a new choice. |
| Other columns | `LI_DESC_L2`, `LI_SHORT_DESC`, `LI_SHORT_DESC_L2`, `LI_VALUE`, `LI_FLEX_01`, `LI_FLEX_02`, audit columns | Not used on this page. |

## Schema Mapping Notes

- The API must reject null/empty Code and Company Code, invalid characters, and duplicate Code Type + Code + Company Code combinations even if the UI has already validated them. `BRM_MISC_CODES` enforces not-null and uniqueness through its three-column primary key. A unique-constraint violation from Oracle (ORA-00001) must map to the same duplicate-combination response, because the database key is the final guard against two simultaneous saves.
- Do not assume Code is the Oracle primary key. Use the existing primary key and map the business key (Code Type + Code + Company Code) after scaffolding. If no suitable key or audit fields exist, stop and request an approved schema decision before changing the database.
- Scaffolded entities and context are generated from the database. Never edit scaffolded files directly; add any required extension behaviour using partial classes.
- Logical lengths are character limits from the spec, but inspected adjustment-code VARCHAR2 fields use BYTE semantics. Resolve the Arabic persistence limitation with the owner before changing the schema; no DDL is authorized by this inspection.
- The active column is `MC_ACTIVE_YN`: `Y` when Active is on, `N` when off. It has no default or Y/N check constraint and is nullable; null on an older row counts as Active.
- No triggers exist on `BRM_MISC_CODES`; the API stamps created and changed dates in GST and sets both usernames to `admin`.
- The four dropdown columns are not expected to have database foreign keys to `STD_LIST_ITEM` (its key is two columns). The API therefore checks every submitted code against the active items of the right list type. On update, a code the record already holds is accepted even if it has since become inactive.
- The Code Type filter and the Code Type sort use the Code Type description, so the list query joins the standard list on `(LI_TYPE, LI_CODE)`. A record whose Code Type has no matching list item shows its code instead of a description.

## Lifecycle

1. **Created**: Validated fields are normalised where applicable, saved with the chosen Active value (on by default), and stamped with `admin`.
2. **Viewed**: Details are read-only by default; existing Additional Information expands when any of its fields has data. Active is shown but not changeable.
3. **Edited**: Code Type, Code, and Company Code stay immutable. Other fields, including Active, are validated and normalised on save, and the changed-by value is stamped `admin`. Records saved earlier without Discount Type, Charges Type, or Charges Category must have all three chosen before they can be saved again.
4. **Deactivated and restored (soft delete)**: Turning Active off while editing and saving marks the record inactive. It stays in the list and can be opened. Turning Active on again and saving restores it.
5. **Permanently deleted**: A user confirms the irreversible warning in the UI; the API permanently removes the record. No restore state exists after permanent deletion.

## Query Behaviour

- Filter each of Code Type (by description), Code, Company Code, Name, Short Name and Status by column. Text filters use the operators starts with, ends with, contains (default), equals and not equals; Status uses equals and not equals with Active or Inactive. There is no global search. Filters ignore upper and lower case, treat typed characters as plain text, must all match, ignore a blank value, and run over the complete set before pagination. "Not equals" also returns records whose value is empty. A null Active flag counts as Active.
- Sort only by Code Type description, Code, Company Code, Name, or Short Name, ignoring upper and lower case. The initial order is Code Type description ascending then Code ascending. Every sort ends with a unique tie-break (Code Type, Code, Company Code) so no row repeats or disappears between pages. Sorting runs over the complete filtered set before pagination.
- Return `items`, `page`, `pageSize`, and `totalCount`; page size is 10. Each list item includes the Active status, and inactive records are not filtered out unless the user applies the Status filter.
- Dropdown options: return the active items of the four fixed standard lists in one read-only response, ordered by description. This lookup is intentionally unpaged; the owner-approved constitution C3 exception was recorded on 02-Nov-2026.
