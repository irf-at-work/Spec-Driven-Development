# Data Model: Claim Configuration Master

This document translates the owner-supplied Oracle column information and feature rules into the logical entities used by CCM. It does not assert unverified foreign keys, defaults, indexes, or database column metadata beyond the supplied structure.

## Claim Configuration — `BRM_CLM_CONFIG`

**Identity**: Database primary key `(CCM_COMP_CODE, CCM_CODE)`. Business rule: `CCM_CODE` is globally unique across Company Codes because the product mapping stores only CCM Code. Read-only Oracle review must confirm current enforcement; any needed DDL requires separate owner approval.

| Field | Oracle type/size | Required / rule |
|---|---|---|
| `CCM_COMP_CODE` | `VARCHAR2(12 BYTE)` | Required key. Supplied by application context; not entered or edited by employee. Fixed required configuration value `ASRTEST` until session company is available. |
| `CCM_CODE` | `VARCHAR2(12 BYTE)` | Required key; employee-entered; 1–12 letters, digits, or hyphens; saved uppercase; immutable; globally unique. |
| `CCM_NAME` | `VARCHAR2(100 BYTE)` | Required; UI label “Claim Config Name”; saved/displayed uppercase. |
| `CCM_SHORT_NAME` | `VARCHAR2(30 BYTE)` | Optional; UI label “Short Name”; saved/displayed uppercase. |
| `CCM_NAME_L2` | `VARCHAR2(100 BYTE)` | Optional second-language/Arabic field; display RTL; preserve text and spaces exactly. |
| `CCM_SHORT_NAME_L2` | `VARCHAR2(30 BYTE)` | Optional second-language/Arabic field; display RTL; preserve text and spaces exactly. |
| `CCM_MODULE` | `VARCHAR2(2 BYTE)` | Optional dropdown from active standard items; examples AV, MC, LI, LG; full list and `LI_TYPE` mapping need review. |
| `CCM_ACNT_POSTING_TYPE` | `VARCHAR2(1 BYTE)` | Optional dropdown; B Batch, O Online; source `LI_TYPE` needs review. |
| `CCM_ACNT_EXCH_RATE_TYPE` | `VARCHAR2(1 BYTE)` | Optional dropdown; A Average, S Selling, B Buying; source `LI_TYPE` needs review. |
| `CCM_ROUND_TYPE` | `VARCHAR2(2 BYTE)` | Optional dropdown; CL Ceiling, RD Round, NN None, NI Next Integer, FR Floor; source `LI_TYPE` needs review. |
| `CCM_ROUND_VALUE` | `NUMBER(8,5)` | Optional numeric value; `2.000` is an example. No additional range or interaction rule is established. |
| `CCM_APPL_CURR_TYPE` | `VARCHAR2(2 BYTE)` | Optional dropdown; 10 All, 20 Risk Currencies; source `LI_TYPE` needs review. |
| `CCM_DFLT_EST_CLO_REASON_CODE` | `VARCHAR2(12 BYTE)` | Optional dropdown; supplied codes 100–600; source `LI_TYPE` needs review. |
| `CCM_DFLT_RECV_DEDU_CODE` | `VARCHAR2(12 BYTE)` | Optional dropdown; source and choice list need review. |
| `CCM_PRNT_BEF_APPR_YN` | `VARCHAR2(1 BYTE)` | Optional Y/N flag; create-time default Y. |
| `CCM_RE_PRNT_YN` | `VARCHAR2(1 BYTE)` | Optional Y/N flag; create-time default Y. |
| `CCM_CLM_ACNT_DOC_GEN_YN` | `VARCHAR2(1 BYTE)` | Optional Y/N flag; create-time default Y. |
| `CCM_CLM_COINS_ACNT_DOC_GEN_YN` | `VARCHAR2(1 BYTE)` | Optional Y/N flag; create-time default Y. |
| `CCM_ACTIVE_YN` | `VARCHAR2(1 BYTE)` | Active/inactive lifecycle; use shared master-data convention Y/N, default active for a new record. Confirm deployed defaults during Oracle review. |
| `CCM_CR_BY`, `CCM_UP_BY` | `VARCHAR2(12 BYTE)` each | Creation/update audit usernames; current no-login master convention uses `admin`. |
| `CCM_CR_DT`, `CCM_UP_DT` | `DATE` each | Creation/update audit timestamps; current project convention uses GST. |

**Lifecycle**: Create active by default under the common master-data convention. Update settings without changing either key. Deactivate/reactivate by status while preserving all fields and product links. Permanent CCM deletion is not a user action in this feature.

## Product-to-CCM Association — `BRM_CCM_PROD`

| Field | Oracle type/size | Meaning |
|---|---|---|
| `CCMP_CCM_CODE` | `VARCHAR2(12 BYTE)` | CCM Code; links to the globally unique `CCM_CODE` business identifier. |
| `CCMP_CODE` | `VARCHAR2(12 BYTE)` | Product ID / Product Code. The UI examples use `LI_CODE`; confirm the authoritative source and physical data mapping. |
| `CCMP_CR_BY`, `CCMP_UP_BY` | `VARCHAR2(12 BYTE)` each | Creation/update audit usernames. |
| `CCMP_CR_DT`, `CCMP_UP_DT` | `DATE` each | Creation/update audit dates. |

**Identity**: Primary key `(CCMP_CCM_CODE, CCMP_CODE)` as supplied. A given product can be linked once to a given CCM. The relationship is many-to-many: one CCM may link to multiple products and one product may link to multiple CCMs.

**Operations**: Add an association from a saved CCM’s Available Products modal; remove only the association from its Delete action after confirmation. Association deletion does not remove the CCM or other product links.

## Product choice and display data

The requested option presentation is `LI_CODE - LI_TYPE - LI_DESC`; the linked row shows Product Code as `LI_CODE` and Product Name as `LI_TYPE - LI_DESC`. The checked-in source does not establish that these columns represent a product catalog. During read-only Oracle review, verify:

- authoritative table/view and columns for product code and name;
- whether the display strings map to the supplied `LI_CODE`, `LI_TYPE`, and `LI_DESC` values;
- whether inactive products are excluded;
- product count/volume, to decide whether dropdown lookup needs pagination or other navigation.

Do not treat product rows as `STD_LIST_ITEM` choices until this review confirms it.

## Validation and persistence notes

- Column BYTE lengths constrain Oracle storage; they are not automatically UI character limits, especially for multi-byte Arabic text.
- Validate dropdown codes server-side against their confirmed active `STD_LIST_ITEM` lists. The mapping for each CCM field remains a planning gate.
- Preserve Arabic values without case conversion or trimming. Apply uppercase normalization only to the specified English name fields and CCM Code.
- Do not infer field validation, nullability beyond listed required fields, or referential constraints from column types alone.
- Verify actual constraints, defaults, triggers, indexes, column nullability, and data before scaffold or implementation. No database changes are authorized by this plan.
