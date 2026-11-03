# Decision: Document Setup Master Persistence

**Date**: 2026-11-02  
**Status**: Accepted for implementation planning

## Context

Document Setup uses existing Oracle parent/child tables with no parent-child foreign key, no concurrency token, and no sequence for the numeric child primary key. The user requires the existing Codes Master Oracle connection and prohibits database schema changes, including adding a sequence.

## Decisions

1. Map `IIRIS_RD_DEVP.STD_DOCUMENT` and `IIRIS_RD_DEVP.STD_DOC_APPL_MODULE` from the supplied DDL using the existing `CodesMasterContext` and `CodesMasterOracle` connection.
2. Assign `DAMOD_UID` as `MAX(DAMOD_UID) + 1` in an Oracle transaction that serializes child inserts with an exclusive lock on the child table. Lock and verify the parent row first. Keep the locked operation short.
3. Protect parent-child integrity by locking the parent for child creation and parent deletion; reject parent deletion while children remain.
4. Protect updates/deletes from stale edits with an API version token checked against the row while locked; persist no version column.
5. Keep the API/OpenAPI contract authoritative and regenerate the existing Angular client. Do not add packages or hand-edit generated code.

## Alternatives considered

- **Add an Oracle sequence or schema constraint**: rejected because the user explicitly prohibited schema changes.
- **Unlocked `MAX + 1`**: rejected because concurrent creates can calculate the same primary key.
- **Random IDs**: rejected because the user selected max-plus-one.
- **Per-parent-only serialization**: rejected because `DAMOD_UID` is a global child-table primary key and different parents could allocate the same maximum.
- **`*_UP_DT` as the sole concurrency token**: rejected because Oracle `DATE` may not distinguish updates in the same second.

## Consequences

Child inserts are serialized across the table. The feature must keep the critical section short and test competing inserts. Before implementation, verify the scaffolded numeric mapping and current maximum fit the provider's representable range; stop and ask rather than truncate or alter DDL if they do not.
