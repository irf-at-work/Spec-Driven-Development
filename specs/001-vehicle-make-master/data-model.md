# Data Model: Vehicle Make Master

## Scope

One logical master entity is needed. There are no relationships to other entities in this feature. The physical table is Oracle `BRM_VEH_make`, as described by the owner on 29-Oct-2026 (see Physical Mapping below). Constraints, defaults and length semantics still need to be confirmed against the live schema. Do not issue DDL, seed data, or edit scaffolded files as part of this design.

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
| Created By | String | Yes | Existing schema-defined | Set to `admin` on create, if represented by the existing schema. |
| Last Changed By | String | Yes | Existing schema-defined | Set to `admin` on create and every successful edit, if represented by the existing schema. |

### Schema Mapping Notes

- The API must reject null/empty Make Code and duplicate codes even if the UI has already validated them. The approved Oracle schema should enforce not-null and uniqueness as well; propose a schema change only if inspection finds that enforcement absent, and obtain owner approval before DDL.
- **`VMAK_CODE` is the primary key** (owner-confirmed). It is `VARCHAR2(12) NOT NULL` and is entered by the user, not generated. A duplicate code is rejected by the API (409) and the database primary key is the final guard against two simultaneous saves; a unique-constraint violation from Oracle (ORA-00001) must map to the same duplicate-code response.
- Confirm in the live schema that the primary-key constraint exists (query `user_constraints` for `BRM_VEH_MAKE`). Propose DDL only if it is absent, and obtain owner approval first.
- `VMAK_NAME` is nullable in the database, but the application requires it (and `VMAK_SHORT_NAME`). The API is the authority for required fields.
- Scaffolded entities and context are generated from the database. Never edit scaffolded files directly; add any required extension behavior using partial classes.
- Logical lengths are character limits from the spec. Verify Oracle column semantics (byte versus character length) against actual database definitions before mapping.

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
| (not used by this feature) | `VMAK_ACTIVE_YN` | VARCHAR2(1) | Nullable | Owner decision: this page neither reads nor writes it; it is handled on the database side and is for a future soft-delete page. To verify: whether the database supplies a default or trigger. |
| Created By | `VMAK_CR_BY` | VARCHAR2(12) | Nullable | `admin` for now |
| Created Date | `VMAK_CR_DT` | DATE | Nullable | Who sets it (application in GST, or database) is to be confirmed |
| Last Changed By | `VMAK_UP_BY` | VARCHAR2(12) | Nullable | `admin` for now |
| Last Changed Date | `VMAK_UP_DT` | DATE | Nullable | As above |

## Lifecycle

1. **Created**: Validated fields are normalized where applicable, saved, and stamped with `admin`.
2. **Viewed**: Details are read-only by default; existing Additional Information expands when any of its fields has data.
3. **Edited**: Make Code stays immutable. Other fields are validated and normalized on save, and the changed-by value is stamped `admin`.
4. **Deleted**: A user confirms the irreversible warning in the UI; the API permanently removes the record. No restore state exists.

## Query Behavior

- Search only Make Code, Make Name, and Short Name; search the complete set before pagination.
- Sort only Make Code, Make Name, and Short Name; initial order is Make Code ascending. Apply sorting to the complete filtered set before pagination.
- Return `items`, `page`, `pageSize`, and `totalCount`; page size is 10.
