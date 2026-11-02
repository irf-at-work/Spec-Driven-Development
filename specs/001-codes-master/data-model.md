# Codes Master Data Model

**Feature**: [spec.md](spec.md)  
**Source of truth**: Existing Oracle `IIRIS_RD_DEVP.STD_CODES`; no schema changes.

## Entity: Code Record

Represents one code value of one type. Identity is the composite pair `(CC_CODE, CC_TYPE)`.

| Application field | Oracle column | Type/limit | Required / behavior |
|---|---|---|---|
| Code | `CC_CODE` | `VARCHAR2(12 BYTE)` | Required; part of composite key |
| Code Type | `CC_TYPE` | `VARCHAR2(20 BYTE)` | Required; part of composite key |
| Company Code | `CC_COMP_CODE` | `VARCHAR2(12 BYTE)` | Required; derived directly from Code |
| Code Description | `CC_DESC` | `VARCHAR2(100 BYTE)` | Optional |
| Short Description | `CC_SHORT_DESC` | `VARCHAR2(30 BYTE)` | Optional |
| Long Description | `CC_LONG_DESC` | `VARCHAR2(2000 BYTE)` | Optional |
| Value 1 | `CC_VALUE1` | `VARCHAR2(100 BYTE)` | Optional |
| Value 2 | `CC_VALUE2` | `VARCHAR2(100 BYTE)` | Optional |
| Flex 1 | `CC_FLEX_01` | `VARCHAR2(60 BYTE)` | Optional |
| Flex 2 | `CC_FLEX_02` | `VARCHAR2(2000 BYTE)` | Optional |
| Desc In Arabic | `CC_DESC_L2` | `VARCHAR2(100 BYTE)` | Optional |
| Short Desc In Arabic | `CC_SHORT_DESC_L2` | `VARCHAR2(30 BYTE)` | Optional |
| Long Description In Arabic | `CC_LONG_DESC_L2` | `VARCHAR2(2000 BYTE)` | Optional |
| Active Y/N | `CC_ACTIVE_YN` | `VARCHAR2(1 BYTE)` | Optional; Add defaults the UI toggle on and submits `Y`/`N`; Edit preserves the stored value unless the toggle changes |
| Created By | `CC_CR_BY` | `VARCHAR2(12 BYTE)` | New rows store `ADMIN`; not user-editable |
| Created Date | `CC_CR_DT` | Oracle `DATE` | New rows use Oracle `SYSDATE`; not user-editable |
| Updated By | `CC_UP_BY` | `VARCHAR2(12 BYTE)` | NULL on creation and after ordinary edits |
| Updated Date | `CC_UP_DT` | Oracle `DATE` | NULL on creation and after ordinary edits |

All optional columns may be NULL. No additional uniqueness, foreign-key, or cascade behavior is introduced. Oracle BYTE semantics are authoritative; validation must not assume a one-character/one-byte relationship.

## Relationships

No relationships are established by the supplied table definition or approved feature requirements. The feature must not invent foreign keys or cascade behavior.

## Validation and Integrity

- Validate required Code and Code Type values.
- Validate all string values against the respective Oracle byte limits, using target-database character-set semantics before persistence and preserving Oracle constraints as the final guard.
- Do not silently truncate values.
- A record is uniquely identified only by the pair `(CC_CODE, CC_TYPE)`.
- Reject duplicate composite keys without modifying the existing row.
- Set Company Code from Code; it is not an independent form input.
- On creation, set `CC_CR_BY` to `ADMIN`, set `CC_CR_DT` using Oracle `SYSDATE`, and leave update audit values NULL.
- On update, preserve both creation audit values and keep both update audit values NULL.

## State Transitions

```text
Not present -- successful create --> Present (created audit set; update audit NULL)
Present     -- successful update -> Present (identity and creation audit preserved)
Present     -- confirmed delete --> Not present
```

Validation failures, duplicate keys, missing rows, and database errors do not transition the stored record to a successful new state.

## Listing Filter Query

Filters are transient query inputs and are not stored in `STD_CODES`. Each supported field pairs one operator with one text value:

| Listing field | Oracle column |
|---|---|
| Code | `CC_CODE` |
| Code Description | `CC_DESC` |
| Type | `CC_TYPE` |
| Value 1 | `CC_VALUE1` |
| Value 2 | `CC_VALUE2` |

Supported operators are Starts With, Ends With, Contains, Does Not Contain, Equal To, and Not Equal To; No Filter omits the field's query pair. Matching ignores letter case. Multiple field filters combine using AND, and filtering occurs before the result count and pagination are calculated.
