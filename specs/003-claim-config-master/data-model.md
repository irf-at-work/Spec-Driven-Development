# Data Model: Claim Configuration Master

This document translates the owner-supplied Oracle column information, the read-only Oracle review pasted by the owner on 2026-11-09, and feature rules into CCM entities. The review inspected metadata only; it did not read or change business rows.

## Claim Configuration — `BRM_CLM_CONFIG`

**Identity**: The screenshots supplied by the owner on 2026-11-10 show primary key `PK_BRM_CLM_CONFIG` on `(CCM_COMP_CODE, CCM_CODE)`. They also show `SYS_C00132035` as a Check constraint enforcing `CCM_CODE IS NOT NULL`, not a single-column unique key. Later owner-pasted metadata confirms `IIRIS_RD_DEVP.UX_BRM_CLM_CONFIG_CCM_CODE` is a `VALID`, `UNIQUE` index on `BRM_CLM_CONFIG`, with only `CCM_CODE` at position 1. T004 is passed. The attempted `CREATE INDEX` returned ORA-00955 because the required index already exists; do not rerun the DDL.

| Field | Oracle type/size | Oracle nullable | Oracle default seen in review | Required / rule |
|---|---|---|---|---|
| `CCM_COMP_CODE` | `VARCHAR2(12)` | N | none shown | Required key. Supplied by application context; not entered or edited by employee. Fixed required configuration value `ASRTEST` until session company is available. |
| `CCM_CODE` | `VARCHAR2(12)` | N | none shown | Required key; employee-entered; 1–12 letters, digits, or hyphens; saved uppercase; immutable; global uniqueness is enforced by the verified unique index `UX_BRM_CLM_CONFIG_CCM_CODE`. |
| `CCM_NAME` | `VARCHAR2(100)` | N | none shown | Required; UI label “Claim Config Name”; saved/displayed uppercase. |
| `CCM_SHORT_NAME` | `VARCHAR2(30)` | Y | none shown | Optional; UI label “Short Name”; saved/displayed uppercase. |
| `CCM_NAME_L2` | `VARCHAR2(100)` | Y | none shown | Optional second-language/Arabic field; display RTL; preserve text and spaces exactly. |
| `CCM_SHORT_NAME_L2` | `VARCHAR2(30)` | Y | none shown | Optional second-language/Arabic field; display RTL; preserve text and spaces exactly. |
| `CCM_MODULE` | `VARCHAR2(2)` | Y | none shown | Optional dropdown; values/source `LI_TYPE` remain unverified. |
| `CCM_ACNT_POSTING_TYPE` | `VARCHAR2(1)` | Y | none shown | Optional dropdown; values/source `LI_TYPE` remain unverified. |
| `CCM_ACNT_EXCH_RATE_TYPE` | `VARCHAR2(1)` | Y | none shown | Optional dropdown; values/source `LI_TYPE` remain unverified. |
| `CCM_ROUND_TYPE` | `VARCHAR2(2)` | Y | none shown | Optional dropdown; values/source `LI_TYPE` remain unverified. |
| `CCM_ROUND_VALUE` | `NUMBER(8,5)` | Y | none shown | Optional numeric value; the database has no default expression. Application create default and confirmed non-negative validation are specified separately in FR-042/FR-043; storage capacity does not define those user-facing rules. |
| `CCM_APPL_CURR_TYPE` | `VARCHAR2(2)` | Y | none shown | Optional dropdown; values/source `LI_TYPE` remain unverified. |
| `CCM_DFLT_EST_CLO_REASON_CODE` | `VARCHAR2(12)` | Y | none shown | Optional dropdown; codes/source `LI_TYPE` remain unverified. |
| `CCM_DFLT_RECV_DEDU_CODE` | `VARCHAR2(12)` | Y | none shown | Optional dropdown labeled “Recovery Code for Deduction”; owner supplied approved choices 100 (Excess) and 200 (Nil), mapped to `CCM_DFLT_RECV_DEDU`. Insert script is prepared but rows are not yet confirmed inserted. |
| `CCM_PRNT_BEF_APPR_YN` | `VARCHAR2(1)` | Y | none shown | Optional Y/N flag; create-time default N is an application rule, not a confirmed column default. |
| `CCM_RE_PRNT_YN` | `VARCHAR2(1)` | Y | none shown | Optional Y/N flag; create-time default N is an application rule, not a confirmed column default. |
| `CCM_CLM_ACNT_DOC_GEN_YN` | `VARCHAR2(1)` | Y | none shown | Optional Y/N flag; create-time default Y is an application rule, not a confirmed column default. |
| `CCM_CLM_COINS_ACNT_DOC_GEN_YN` | `VARCHAR2(1)` | Y | none shown | Optional Y/N flag; create-time default Y is an application rule, not a confirmed column default. |
| `CCM_ACTIVE_YN` | `VARCHAR2(1)` | Y | none shown | Active/inactive lifecycle; Y/N and default-active are application rules, not confirmed column defaults. |
| `CCM_CR_BY`, `CCM_UP_BY` | `VARCHAR2(12)` each | Y | none shown | Creation/update audit usernames; implementation must explicitly set and test audit values per the shared convention. |
| `CCM_CR_DT`, `CCM_UP_DT` | `DATE` each | Y | none shown | Creation/update audit timestamps; implementation must explicitly set and test audit values per the shared convention. |

Oracle reports `CHAR_USED = B` and matching `CHAR_LENGTH`/`DATA_LENGTH` for character columns in the latest read-only output, confirming BYTE semantics. These are storage limits, not confirmation of user-facing character-count validation. Confirmed UI/business validation remains only what the feature requirements specify; do not infer it from storage lengths or nullability. All 23 CCM columns were present in the report; none showed a default expression.

**Lifecycle**: Create active by default under the common master-data convention. Update settings without changing either key. Deactivate/reactivate by status while preserving all fields and product links. Permanent CCM deletion is not a user action in this feature.

## Product-to-CCM Association — `BRM_CCM_PROD`

| Field | Oracle type/size | Oracle nullable / default seen | Meaning |
|---|---|---|---|
| `CCMP_CCM_CODE` | `VARCHAR2(12)` | N / none shown | CCM Code; links to the globally unique `CCM_CODE` business identifier. |
| `CCMP_CODE` | `VARCHAR2(12)` | N / none shown | Product ID / Product Code. Authoritative source and physical product mapping remain unresolved. |
| `CCMP_CR_BY`, `CCMP_UP_BY` | `VARCHAR2(12)` each | Y / none shown | Creation/update audit usernames. |
| `CCMP_CR_DT`, `CCMP_UP_DT` | `DATE` each | Y / none shown | Creation/update audit dates. |

**Identity**: The owner's screenshot confirms primary key `PK_BRM_CCM_PROD` on `(CCMP_CCM_CODE, CCMP_CODE)`. The separate `C` constraints on each column are `IS NOT NULL` checks; they are not single-column unique keys. This pair key permits one product link per CCM/product pair. The relationship is many-to-many: one CCM may link to multiple products and one product may link to multiple CCMs.

**Operations**: Add an association from a saved CCM’s Available Products modal; remove only the association from its Delete action after confirmation. Association deletion does not remove the CCM or other product links.

## Product choice and display data

**Owner-approved mapping**: Product choices are stored as rows in the existing `STD_LIST_ITEM` table with dedicated `LI_TYPE = 'CCM_PRODUCT'`. `LI_CODE` maps to Product Code / `BRM_CCM_PROD.CCMP_CODE`; `LI_DESC` maps to Product Description; `LI_ACTIVE_YN = 'Y'` marks a choice available for new links. The dropdown label is `LI_CODE - LI_TYPE - LI_DESC`; linked rows show `LI_CODE` as Product Code and `LI_TYPE - LI_DESC` as Product Name. The owner explicitly directed using `STD_LIST_ITEM` because no product master is available. This is an application/data convention and does not add a table, column, or constraint.

The pasted lookup output did not establish any product rows or an eligible count, and the implementation agent has not queried Oracle. The paginated endpoint reports the current count dynamically. The list will remain empty until the owner seeds `CCM_PRODUCT` rows with [ccm-product-choice-insert.sql](ccm-product-choice-insert.sql). The number of rows is not assumed.

## CCM setting lookup mapping status

The owner approved these proposed `LI_TYPE` names for the supplied CCM choices when requesting the seed SQL file. The mapping does not establish that the lists are complete or that the corresponding rows have been inserted. The four Module values are examples only. The owner later supplied recovery-deduction codes and descriptions; the mapping follows the CCM field name as `CCM_DFLT_RECV_DEDU`.

| CCM field | Approved proposed `LI_TYPE` | Seed values in proposal | Status |
|---|---|---|---|
| `CCM_MODULE` | `CCM_MODULE` | AV, MC, LI, LG | Incomplete: module examples only |
| `CCM_ACNT_POSTING_TYPE` | `CCM_POST_TYPE` | B, O | Values supplied |
| `CCM_ACNT_EXCH_RATE_TYPE` | `CCM_EXCH_RATE` | A, S, B | Values supplied |
| `CCM_ROUND_TYPE` | `CCM_ROUND_TYPE` | CL, RD, NN, NI, FR | Values supplied |
| `CCM_APPL_CURR_TYPE` | `CCM_CURR_TYPE` | 10, 20 | Values supplied |
| `CCM_DFLT_EST_CLO_REASON_CODE` | `CCM_CLO_REASON` | 100, 200, 300, 400, 500, 600 | Values supplied |
| `CCM_DFLT_RECV_DEDU_CODE` | `CCM_DFLT_RECV_DEDU` | 100 (Excess), 200 (Nil) | Owner supplied; insert script prepared, row insertion pending |

The read-only review output contained no rows for these CCM-specific types. The owner subsequently reported that the original six supplied choice sets were inserted using the seed file; that insertion has not been independently re-queried. The new recovery-deduction choices are in [ccm-recovery-deduction-insert.sql](ccm-recovery-deduction-insert.sql); the implementation agent did not execute it.

## Validation and persistence notes

- Column BYTE lengths constrain Oracle storage; they are not automatically UI character limits, especially for multi-byte Arabic text.
- Validate dropdown codes server-side against their confirmed active `STD_LIST_ITEM` lists. The recovery-deduction mapping and choice values are owner supplied; insertion remains pending.
- Preserve Arabic values without case conversion or trimming. Apply uppercase normalization only to the specified English name fields and CCM Code.
- Do not infer field validation, nullability beyond listed required fields, or referential constraints from column types alone.
- Verify actual constraints, defaults, triggers, indexes, column nullability, and data before scaffold or implementation. No database changes are authorized by this plan.
