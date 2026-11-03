# Data Model: Document Setup Master

The application maps these existing Oracle 19c tables in schema `IIRIS_RD_DEVP`; it does not create or alter them. Column lengths below are Oracle database-encoded byte limits from the DDL supplied by the user.

## Document Setup (parent)

**Table**: `IIRIS_RD_DEVP.STD_DOCUMENT`  
**Identity**: `DOC_CODE` primary key; `VARCHAR2(12 BYTE)`  
**Relationship**: One parent has zero or more Applicable Module rows. The database has no foreign key; the application verifies and preserves the relationship.

| Business field        | Oracle column   | Type / limit          | Required/default      | Rule                                                                                                                                                                                                      |
| --------------------- | --------------- | --------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Doc Code              | `DOC_CODE`      | `VARCHAR2(12 BYTE)`   | Required; primary key | Identity is immutable on update.                                                                                                                                                                          |
| Doc Name              | `DOC_NAME`      | `VARCHAR2(100 BYTE)`  | Optional              |                                                                                                                                                                                                           |
| Name in Arabic        | `DOC_NAME_L2`   | `VARCHAR2(100 BYTE)`  | Optional              | Shown in the collapsed More section.                                                                                                                                                                      |
| Doc Description       | `DOC_DESC`      | `VARCHAR2(2000 BYTE)` | Optional              |                                                                                                                                                                                                           |
| Description in Arabic | `DOC_DESC_L2`   | `VARCHAR2(2000 BYTE)` | Optional              | Shown in the collapsed More section.                                                                                                                                                                      |
| Doc Setup For         | `DOC_SETUP_FOR` | `VARCHAR2(12 BYTE)`   | Required              | Must match a Codes Master `CC_CODE` whose `CC_TYPE` is `DOC_SETUP_FOR`. The UI displays code and description; the API stores the code. Current entries include `101` = File Upload and `102` = Doc Print. |
| Active Y/N            | `DOC_ACTIVE_YN` | `VARCHAR2(1 BYTE)`    | `Y` for new record    |                                                                                                                                                                                                           |
| Flex 1                | `DOC_FLEX_01`   | `VARCHAR2(60 BYTE)`   | Optional              |                                                                                                                                                                                                           |
| Flex 2                | `DOC_FLEX_02`   | `VARCHAR2(60 BYTE)`   | Optional              |                                                                                                                                                                                                           |
| Created By            | `DOC_CR_BY`     | `VARCHAR2(12 BYTE)`   | API-managed           | Set to `ADMIN`; preserve on update.                                                                                                                                                                       |
| Created Date          | `DOC_CR_DT`     | `DATE`                | API-managed           | Oracle `SYSDATE`; display DD-MMM-YYYY in GST.                                                                                                                                                             |
| Updated By            | `DOC_UP_BY`     | `VARCHAR2(12 BYTE)`   | Null until update     | Set to `ADMIN` on update.                                                                                                                                                                                 |
| Updated Date          | `DOC_UP_DT`     | `DATE`                | Null until update     | Oracle `SYSDATE` on update.                                                                                                                                                                               |

The supplied DDL defines no database defaults. The application supplies new-record defaults and audit values.

## Applicable Module Configuration (child)

**Table**: `IIRIS_RD_DEVP.STD_DOC_APPL_MODULE`  
**Identity**: `DAMOD_UID` primary key; Oracle `NUMBER` with no declared precision/scale  
**Parent key**: `DAMOD_DOC_CODE` references `STD_DOCUMENT.DOC_CODE` by application convention only; no FK exists.

| Business field  | Oracle column        | Type / limit        | Required/default   | Rule                                                                                         |
| --------------- | -------------------- | ------------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| Child identity  | `DAMOD_UID`          | `NUMBER`            | API-generated      | Calculate `MAX(DAMOD_UID) + 1` inside a serialized insert transaction. Never use a sequence. |
| Parent Doc Code | `DAMOD_DOC_CODE`     | `VARCHAR2(12 BYTE)` | Required           | Must identify the locked, existing parent.                                                   |
| Applicable For  | `DAMOD_APPL_FOR`     | `VARCHAR2(12 BYTE)` | Required           | `ASR` or `ASSET`; duplicates for one parent are allowed.                                     |
| Product From    | `DAMOD_PROD_CODE_FM` | `VARCHAR2(12 BYTE)` | Optional           | ASSET form only.                                                                             |
| Product To      | `DAMOD_PROD_CODE_TO` | `VARCHAR2(12 BYTE)` | Optional           | ASSET form only.                                                                             |
| PCM From        | `DAMOD_PCM_CODE_FM`  | `VARCHAR2(12 BYTE)` | Optional           | ASSET form only.                                                                             |
| PCM To          | `DAMOD_PCM_CODE_TO`  | `VARCHAR2(12 BYTE)` | Optional           | ASSET form only.                                                                             |
| CCM From        | `DAMOD_CCM_CODE_FM`  | `VARCHAR2(12 BYTE)` | Optional           | ASSET form only.                                                                             |
| CCM To          | `DAMOD_CCM_CODE_TO`  | `VARCHAR2(12 BYTE)` | Optional           | ASSET form only.                                                                             |
| Mandatory Y/N   | `DAMOD_DOC_MAND_YN`  | `VARCHAR2(1 BYTE)`  | `N` for new record |                                                                                              |
| Active Y/N      | `DAMOD_ACTIVE_YN`    | `VARCHAR2(1 BYTE)`  | `Y` for new record |                                                                                              |
| Created By      | `DAMOD_CR_BY`        | `VARCHAR2(12 BYTE)` | API-managed        | Set to `ADMIN`; preserve on update.                                                          |
| Created Date    | `DAMOD_CR_DT`        | `DATE`              | API-managed        | Oracle `SYSDATE`; display DD-MMM-YYYY in GST.                                                |
| Updated By      | `DAMOD_UP_BY`        | `VARCHAR2(12 BYTE)` | Null until update  | Set to `ADMIN` on update.                                                                    |
| Updated Date    | `DAMOD_UP_DT`        | `DATE`              | Null until update  | Oracle `SYSDATE` on update.                                                                  |

Assured Master (`ASR`) has no range restriction; store `ALL` in each range column when changing an ASSET row to ASR. For ASSET, each unselected range is also stored as `ALL`, and there is no From/To ordering validation. Child edits preserve `DAMOD_UID`; child delete targets only that identity.

The application must verify current `DAMOD_UID` values fit the numeric type generated by the installed Oracle EF provider before implementing max-plus-one. If not, stop and request a decision rather than truncate values or alter the table.

## Range Options

These are UI options only; they are not loaded from a master-data service and do not add database entities.

| Range   | Code and display description                  |
| ------- | --------------------------------------------- |
| Product | `1001` — PERSONAL LINES - MOTOR COMPREHENSIVE |
| Product | `1002` — PERSONAL LINES - MOTOR THIRD PARTY   |
| Product | `2001` — FIRE & LIGHTNING                     |
| PCM     | `101` — MOTOR PERSONAL LINES                  |
| PCM     | `201` — PROPERTY                              |
| PCM     | `301` — MARINE OPEN POLICY                    |
| CCM     | `101` — MOTOR DIRECT                          |
| CCM     | `201` — PROPERTY                              |
| CCM     | `601` — PACKAGE POLICY                        |

From and To for each range use the same options. Persist only the code.

## State and Validation

- New parent: `DOC_ACTIVE_YN = Y`; require non-empty Doc Code and Doc Setup For.
- New child: `DAMOD_DOC_MAND_YN = N`; `DAMOD_ACTIVE_YN = Y`; require an existing parent and Applicable For.
- New child ID: one serialized `MAX(DAMOD_UID) + 1` allocation/insertion transaction across the child table.
- ASSET → ASR: store `ALL` in all six range columns before persistence.
- Parent deletion: lock and verify parent; reject with conflict while any child exists.
- Parent/child update: validate the client's opaque version against the locked persisted row; reject stale updates with conflict.
- Request handling: enforce DDL byte limits server-side, even when the UI also validates; use client validation for UX.
- Audit: creation/update values are API-managed; update operations never replace creation audit values.
- Oracle `DATE` values are preserved as stored calendar values for display in GST as DD-MMM-YYYY; do not apply a browser-local timezone shift.
