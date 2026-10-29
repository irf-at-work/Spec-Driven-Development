# Data Model: Premium Adjustment Master

## Scope

One logical master entity is needed, plus four read-only standard-list lookup entities. There are no relationships to other entities in this feature beyond the lookup references. This is a logical model only; the physical Oracle schema is unknown and must be inspected after the owner approves database access. Do not issue DDL, seed data, or edit scaffolded files as part of this design.

## Entity: Adjustment Code

| Field | Logical type | Required | Limit | Rules |
|---|---|---:|---:|---|
| Code Type | String | Yes | Schema-defined | References Code Type standard list; active items only; part of composite uniqueness key. |
| Code | String | Yes | 12 characters | Letters, digits, or hyphens only; save in capitals; part of composite uniqueness key; immutable after creation. Used as part of the API route key. |
| Company Code | String | Yes | 12 characters | Letters, digits, or hyphens only; save in capitals; part of composite uniqueness key. |
| Name | String | Yes | 100 characters | Trim/collapse extra spaces; capitalize the first letter of each word, preserving any word entered entirely in capitals. |
| Short Name | String | Yes | 30 characters | Same normalization as Name. |
| Discount Type | String | Yes | Schema-defined | References Discount Type standard list; active items only; ordered by description. |
| Charges Type | String | Yes | Schema-defined | References Charges Type standard list; active items only; ordered by description. |
| Charges Category | String | Yes | Schema-defined | References Charges Category standard list; active items only; ordered by description. |
| Active | Boolean | Yes | N/A | Defaults to Yes; can be changed to No. |
| Remarks | String | No | 2000 characters | Optional; normalize extra spaces as other non-Arabic text. |
| Arabic Name | String | No | 100 characters | Display right to left; preserve text and spacing exactly. |
| Arabic Short Name | String | No | 30 characters | Display right to left; preserve text and spacing exactly. |
| Arabic Remarks | String | No | 2000 characters | Display right to left; preserve text and spacing exactly. |
| Created By | String | Yes | Schema-defined | Set to `admin` on create, if represented by the existing schema. |
| Last Changed By | String | Yes | Schema-defined | Set to `admin` on create and every successful edit, if represented by the existing schema. |

## Entities: Standard Lists (read-only)

| Entity | Logical type | Required | Limit | Rules |
|---|---|---:|---:|---|
| Code Type | String | Yes | Schema-defined | Active items only; ordered by description. |
| Discount Type | String | Yes | Schema-defined | Active items only; ordered by description. |
| Charges Type | String | Yes | Schema-defined | Active items only; ordered by description. |
| Charges Category | String | Yes | Schema-defined | Active items only; ordered by description. |

## Schema Mapping Notes

- The API must reject null/empty Code and Company Code, invalid characters, and duplicate Code Type + Code + Company Code combinations even if the UI has already validated them. The approved Oracle schema should enforce not-null and uniqueness as well; propose a schema change only if inspection finds that enforcement absent, and obtain owner approval before DDL.
- Do not assume Code is the Oracle primary key. Use the existing primary key and map the business key (Code Type + Code + Company Code) after scaffolding. If no suitable key or audit fields exist, stop and request an approved schema decision before changing the database.
- Scaffolded entities and context are generated from the database. Never edit scaffolded files directly; add any required extension behavior using partial classes.
- Logical lengths are character limits from the spec. Verify Oracle column semantics (byte versus character length) against actual database definitions before mapping.

## Lifecycle

1. **Created**: Validated fields are normalized where applicable, saved, and stamped with `admin`.
2. **Viewed**: Details are read-only by default; existing Additional Information expands when any of its fields has data.
3. **Edited**: Code Type, Code, and Company Code stay immutable. Other fields are validated and normalized on save, and the changed-by value is stamped `admin`. Records saved earlier without Discount Type, Charges Type, or Charges Category must have all three chosen before they can be saved again.
4. **Deleted**: A user confirms the irreversible warning in the UI; the API permanently removes the record. No restore state exists.

## Query Behavior

- Filter by Code Type; search across Code Type description, Code, Company Code, Name, and Short Name; search the complete set before pagination.
- Sort by Code Type description, Code, Company Code, Name, or Short Name; initial order is Code Type description ascending then Code ascending. Apply sorting to the complete filtered set before pagination.
- Return `items`, `page`, `pageSize`, and `totalCount`; page size is 10.
- Dropdown endpoints return active items of each standard list, ordered by description, inside shared `PaginatedResult<T>` envelopes with page size 10. The UI loads all pages so every active choice is available.