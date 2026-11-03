# Research: Document Setup Master

## Decisions

### Reuse the existing Oracle database-first path

- **Decision**: Use `CodesMasterContext`, the configured `CodesMasterOracle` connection, Oracle.EntityFrameworkCore, and the existing schema `IIRIS_RD_DEVP`. Map the supplied `STD_DOCUMENT` and `STD_DOC_APPL_MODULE` DDL; do not add or alter database objects.
- **Rationale**: The user explicitly requires the existing connection and tables. This also follows the constitution's Oracle database-first and no-unapproved-DDL rules.
- **Alternatives considered**: A feature-specific connection string or context would duplicate configuration and violate the request. Migrations, new tables, a sequence, and a foreign key are prohibited.

### Serialize `MAX(DAMOD_UID) + 1` allocation

- **Decision**: Within a transaction on the existing context, serialize child inserts by taking an Oracle exclusive lock on `IIRIS_RD_DEVP.STD_DOC_APPL_MODULE`, calculate `COALESCE(MAX(DAMOD_UID), 0) + 1`, insert, and commit. Lock the target parent row first and verify it exists. Handle provider/database numeric overflow as an explicit failure; never wrap or truncate the key.
- **Rationale**: `DAMOD_UID` is a table-wide numeric primary key, the user selected max-plus-one, and there is no sequence or schema change available. A parent-row lock alone would not protect the global maximum when two different parents receive children concurrently. Serializing the table-wide allocation closes that race without adding a database object.
- **Alternatives considered**: Unlocked max-plus-one can assign the same key concurrently. A per-parent lock is insufficient for a global primary key. Random IDs were considered but not selected by the user. Creating a sequence or changing the table is not allowed.
- **Operational tradeoff**: Child creates are serialized across all parents. This is acceptable for local master-data CRUD; keep the locked transaction limited to parent validation, max lookup, insert, and commit. Do not make external calls or hold the lock while waiting for user interaction.
- **Numeric mapping guard**: Oracle `NUMBER` has no declared precision in the supplied DDL. Use the provider's scaffolded numeric type and check its representable range before addition and save. If current data exceeds the .NET/provider mapping, stop and request a decision; do not silently truncate or change the DDL. Serialize `DAMOD_UID` as a decimal string in JSON to avoid JavaScript integer precision loss.

### Preserve parent-child integrity and reject stale edits without schema tokens

- **Decision**: Use short Oracle transactions and row locks. Child create and parent delete lock the same parent row; create verifies it exists, and delete checks for children before removing it. Child update/delete lock the selected child row. For parent/child updates, compare an opaque API version token computed from the persisted row snapshot against the client's expected token while holding the row lock; return a safe `409 ProblemDetails` response on mismatch.
- **Rationale**: The DDL has no parent-child foreign key and no concurrency/version column. The plan must prevent orphan creation/deletion races and avoid overwriting a newer edit without adding schema.
- **Alternatives considered**: A foreign key/version column is prohibited. A client-only dirty check does not protect against a different user. Comparing `*_UP_DT` alone is not reliable because Oracle `DATE` precision may allow two updates in the same second.

### Keep the OpenAPI contract and generated client authoritative

- **Decision**: Define the feature HTTP contract in [contracts/document-setup-api.md](./contracts/document-setup-api.md) and add the feature paths/schemas to the repository's existing canonical OpenAPI source, `specs/001-codes-master/contracts/codes-master.openapi.yaml`, when implementing. Regenerate the Angular client with the existing `ng-openapi-gen` configuration.
- **Rationale**: The constitution requires OpenAPI to be the source of truth and prohibits hand-authored generated Angular models. The current generator consumes one canonical OpenAPI document.
- **Alternatives considered**: A parallel generated client/config duplicates shared result and error contracts and can drift. Handwritten frontend API models violate the constitution.

### Follow existing listing, form, audit, and error patterns

- **Decision**: Reuse the Codes Master per-column filter operators and AND semantics, pagination contract, Angular Material table/form patterns, SweetAlert feedback conventions, `ADMIN` audit actor, Oracle `SYSDATE`, and global `ProblemDetails` handling.
- **Rationale**: These patterns already exist in the repository and directly match the clarified requirements. Listing queries remain server-filtered and paginated; hardcoded Product/PCM/CCM option sets remain limited to the specified entries.
- **Alternatives considered**: New dependencies, client-side loading/filtering of all records, separate error presentation, or new audit conventions add complexity or conflict with project rules.

## Repository Evidence

- `SDD.API/SDD.API/Program.cs` configures one `CodesMasterContext` with `CodesMasterOracle`.
- `SDD.API/SDD.API/Controllers/CodesController.cs` uses typed controller returns, request validation, and `CancellationToken`.
- `SDD.API/SDD.API/Services/CodesRepository.cs` applies filters before paging and uses Oracle `SYSDATE`.
- `SDD.API/SDD.API/Middleware/ProblemDetailsExceptionHandler.cs` is the global safe error handler.
- `SDD.API/SDD.API/Contracts/PaginatedResult.cs` defines the required list response shape.
- `sdd-ui/ng-openapi-gen.json` generates the API client from the current canonical Codes Master OpenAPI source.
- `sdd-ui/src/app/features/codes-master/` contains the existing typed Angular forms, listing, column filters, feedback, and busy-state patterns.
- `sdd-ui/e2e/` contains Playwright browser tests; `SDD.API/SDD.API.Tests/` contains xUnit tests.
- No Document Setup entities, mappings, or DDL files were present in the checkout. The user supplied the authoritative DDL in the planning conversation; its columns and keys are mapped in [data-model.md](./data-model.md).
- Read-only scaffold against the existing configured Oracle connection confirmed `STD_DOCUMENT.DOC_CODE` maps to `string` and `STD_DOC_APPL_MODULE.DAMOD_UID` maps to `decimal`. A read-only `MAX(DAMOD_UID)` query returned no value (the child table was empty at verification time), so the initial `MAX + 1` is representable by the scaffolded type.

## Remaining Validation Before Implementation

- Verify Oracle exclusive table-lock behavior with the configured provider and exercise concurrent child inserts in API integration tests.
- No formal latency, availability, telemetry, or record-count target was supplied. The design therefore applies server-side paging and safe errors without inventing an SLA.
