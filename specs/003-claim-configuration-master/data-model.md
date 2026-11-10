# CCM Data Model

All records are persisted to existing Oracle objects in schema `IIRIS_RD_DEVP`. No objects are created, altered, or dropped. The connected development schema metadata was verified on 2026-11-10: `CCM_CODE` and `CCM_NAME` are NOT NULL, while all optional parent columns listed below are nullable. Parent creation audit actor/date values are `ADMIN`/`SYSDATE`; updates preserve creation audit values and write `ADMIN`/`SYSDATE` to update audit columns. Child mappings follow the same audit lifecycle.

## Claim Configuration — `BRM_CLM_CONFIG`

**Identity**: Primary key `(CCM_COMP_CODE, CCM_CODE)`; unique index on `CCM_CODE`.

**Application rule**: `CCM_COMP_CODE` is the server-fixed literal `CCM001`. It is not a form field or request field.

| Field | Oracle column | Type | Required by form/table | Source/default |
|---|---|---|---|---|
| Company code | `CCM_COMP_CODE` | `VARCHAR2(12)` | Table NOT NULL | Fixed `CCM001` |
| Claim Config Code | `CCM_CODE` | `VARCHAR2(12)` | Table NOT NULL; form required | User input; unique index |
| Claims Config Name | `CCM_NAME` | `VARCHAR2(100)` | Table NOT NULL; form required | User input |
| Short Name | `CCM_SHORT_NAME` | `VARCHAR2(30)` | Optional | User input |
| Name in Arabic | `CCM_NAME_L2` | `VARCHAR2(100)` | Optional | User input |
| Short Name in Arabic | `CCM_SHORT_NAME_L2` | `VARCHAR2(30)` | Optional | User input |
| Module Name | `CCM_MODULE` | `VARCHAR2(2)` | Optional | Lookup `LI_TYPE = CCM_MODULE`; value `LI_CODE` |
| Posting Type | `CCM_ACNT_POSTING_TYPE` | `VARCHAR2(1)` | Optional | Lookup `LI_TYPE = CCM_POST_TYPE`; value `LI_CODE` |
| Exchange Rate Type | `CCM_ACNT_EXCH_RATE_TYPE` | `VARCHAR2(1)` | Optional | Lookup `LI_TYPE = CCM_EXCH_RATE`; value `LI_CODE` |
| Rounding Type | `CCM_ROUND_TYPE` | `VARCHAR2(2)` | Optional | Lookup `LI_TYPE = CCM_ROUND_TYPE`; value `LI_CODE` |
| Rounding Value | `CCM_ROUND_VALUE` | `NUMBER(8,5)` | Optional | Numeric input; up to 5 fractional digits, magnitude ≤ 999.99999 |
| Applicable Currencies | `CCM_APPL_CURR_TYPE` | `VARCHAR2(2)` | Optional | Lookup `LI_TYPE = CCM_CURR_TYPE`; value `LI_CODE` |
| Dflt Estimate Close Reason | `CCM_DFLT_EST_CLO_REASON_CODE` | `VARCHAR2(12)` | Optional | Lookup `LI_TYPE = CCM_CLO_REASON`; value `LI_CODE` |
| Dflt Recovery Code for Dedl | `CCM_DFLT_RECV_DEDU_CODE` | `VARCHAR2(12)` | Optional | Lookup `LI_TYPE = CCM_DFLT_RECV_DEDU`; value `LI_CODE` |
| Print Before Approval Y/N | `CCM_PRNT_BEF_APPR_YN` | `VARCHAR2(1)` | Optional | Toggle; `N` default; persist `Y`/`N` |
| RePrint Allowed Y/N | `CCM_RE_PRNT_YN` | `VARCHAR2(1)` | Optional | Toggle; `N` default; persist `Y`/`N` |
| Claim A/c Doc Gen Y/N | `CCM_CLM_ACNT_DOC_GEN_YN` | `VARCHAR2(1)` | Optional | Toggle; `N` default; persist `Y`/`N` |
| Sharing Clms A/c Doc Gen Y/N | `CCM_CLM_COINS_ACNT_DOC_GEN_YN` | `VARCHAR2(1)` | Optional | Toggle; `N` default; persist `Y`/`N` |
| Active Y/N | `CCM_ACTIVE_YN` | `VARCHAR2(1)` | Optional | More section; `Y` default; persist `Y`/`N` |
| Created By | `CCM_CR_BY` | `VARCHAR2(12)` | Server-managed | `ADMIN` on insert |
| Created Date | `CCM_CR_DT` | `DATE` | Server-managed | Oracle `SYSDATE` on insert |
| Updated By | `CCM_UP_BY` | `VARCHAR2(12)` | Server-managed | `NULL` on insert; `ADMIN` on update |
| Updated Date | `CCM_UP_DT` | `DATE` | Server-managed | `NULL` on insert; Oracle `SYSDATE` on update |

### Validation and state

- `CCM_CODE` and `CCM_NAME` are required and must fit the actual existing column length semantics.
- The application reads each target column's `CHAR_USED`, `DATA_LENGTH`, and `CHAR_LENGTH` from Oracle metadata and validates candidate values with Oracle `LENGTHB` or `LENGTH` as appropriate; it must not guess BYTE/CHAR semantics.
- `CCM_CODE` uniqueness is enforced across the unique index, not only within a single page or company-code filter.
- All nullable string inputs must not be silently truncated. Validate lookup values against the target column width as well as against the lookup source.
- `CCM_ROUND_VALUE` may be null; when present it must be numeric, have at most five fractional digits, and fit `NUMBER(8,5)` without rounding.
- Every toggle request must resolve to `Y` or `N`. Add form defaults are N for the four standard toggles and Y for Active.
- Edit preserves `CCM_COMP_CODE`, `CCM_CODE`, and original creation audit values.
- Parent responses used for editing include an opaque version derived from the loaded values. An update submits that expected version; a mismatch is rejected without changing the current row.
- Delete is allowed only if no child records exist; confirmation is required.
- For an inactive lookup currently stored on a parent, show its existing code and description when editing, but do not offer it as a new selection.

## Applicable Product Mapping — `BRM_CCM_PROD`

**Identity**: Composite primary key `(CCMP_CCM_CODE, CCMP_CODE)`.

**Relationship**: `CCMP_CCM_CODE` stores the parent `CCM_CODE`. No database foreign key is specified; application operations must verify the association and enforce parent-deletion rules.

| Field | Oracle column | Type | Required | Source/default |
|---|---|---|---|---|
| Parent CCM Code | `CCMP_CCM_CODE` | `VARCHAR2(12)` | Table NOT NULL | Current parent CCM code |
| Product Code | `CCMP_CODE` | `VARCHAR2(12)` | Table NOT NULL | Lookup `LI_TYPE = CCM_PRODUCT`, value `LI_CODE` |
| Created By | `CCMP_CR_BY` | `VARCHAR2(12)` | Server-managed | `ADMIN` on insert |
| Created Date | `CCMP_CR_DT` | `DATE` | Server-managed | Oracle `SYSDATE` on insert |
| Updated By | `CCMP_UP_BY` | `VARCHAR2(12)` | Server-managed | `NULL` on insert; `ADMIN` on update |
| Updated Date | `CCMP_UP_DT` | `DATE` | Server-managed | `NULL` on insert; Oracle `SYSDATE` on update |

### Validation and state

- Both key values must fit their existing column lengths.
- The selected code must be present in the `CCM_PRODUCT` lookup.
- Duplicate `(CCMP_CCM_CODE, CCMP_CODE)` pairs are rejected by frontend validation and backend persistence. Concurrent attempts must return a conflict without adding a duplicate.
- Edit loads the original composite key. A changed product code updates that selected row, rejects any duplicate target pair, preserves creation audit, and updates update-audit values.
- Child responses used for editing include an opaque version derived from the loaded values. An update submits that expected version; a mismatch is rejected without changing the current row.
- Delete confirmation identifies the selected mapping; only that mapping is removed.
- For an inactive product currently stored on a mapping, show its existing code and description when editing, but do not offer it as a new selection.
- Parent deletion and child creation serialize on the parent row so a child cannot be inserted after an unguarded child check and parent removal.

## Standard List Item — `STD_LIST_ITEM`

The table already exists and has the following owner-supplied columns:

| Column | Type |
|---|---|
| `LI_TYPE` | `VARCHAR2(20)` |
| `LI_CODE` | `VARCHAR2(12)` |
| `LI_DESC` | `VARCHAR2(100)` |
| `LI_DESC_L2` | `VARCHAR2(100)` |
| `LI_SHORT_DESC` | `VARCHAR2(30)` |
| `LI_SHORT_DESC_L2` | `VARCHAR2(30)` |
| `LI_VALUE` | `VARCHAR2(100)` |
| `LI_ACTIVE_YN` | `VARCHAR2(1)` |
| `LI_CR_BY` | `VARCHAR2(12)` |
| `LI_CR_DT` | `DATE` |
| `LI_UP_BY` | `VARCHAR2(12)` |
| `LI_UP_DT` | `DATE` |
| `LI_FLEX_01` | `VARCHAR2(100)` |
| `LI_FLEX_02` | `VARCHAR2(100)` |

For each CCM dropdown, filter by the exact specified `LI_TYPE`, use `LI_CODE` as the stored value, and display `LI_DESC`. New choices include only rows where `LI_ACTIVE_YN = 'Y'`. Parent and child read responses provide the saved lookup display text needed to show an inactive current value without making it a new choice. An unchanged inactive value is accepted on update; changing it requires an active value. Listing read models resolve the stored code's description even if its lookup row is inactive.

| Form field | `LI_TYPE` |
|---|---|
| Module Name | `CCM_MODULE` |
| Posting Type | `CCM_POST_TYPE` |
| Exchange Rate Type | `CCM_EXCH_RATE` |
| Rounding Type | `CCM_ROUND_TYPE` |
| Applicable Currencies | `CCM_CURR_TYPE` |
| Dflt Estimate Close Reason | `CCM_CLO_REASON` |
| Dflt Recovery Code for Dedl | `CCM_DFLT_RECV_DEDU` |
| Applicable Products — Product Code | `CCM_PRODUCT` |

## Listing read models

- **Parent row**: Claim Config Code, Claims Config Name, Short Name, Module Name, and action identifiers. Display Module Name from the matching module lookup description; filter and sort on the displayed name. Use `CCM_CODE` as a stable tie-breaker.
- **Child row**: Product Code from `CCMP_CODE`, Product Name from the matching product lookup description, and the composite key needed for Edit/Delete. No product description is stored in the child table.
- **Parent list**: Filter by CCM code, name, short name, and module name. Apply all active case-insensitive filters with AND, sort, then page. Default page 1, size 10; supported sizes 10, 15, 20, and 50.
- **Child list**: Show mappings belonging to the selected parent. Product Code and Product Name filters use the existing six operators, case-insensitive matching, and AND combination over the loaded child rows. No child pagination is required.
