# Research: Division and Department Master

## Database-first scaffold and the missing division mapping

**Decision**: The first implementation action is a read-only reverse-engineering pass for the existing `STD_DIVISION` table. Scaffold it into an isolated output/context so the existing generated `BrokerDataContext` and entities cannot be overwritten. Review the generated key, company reference, and field limits before integrating the mapping. If the table is absent or inaccessible, stop and refer the issue to the database owner; do not create or alter database objects.

**Rationale**: The constitution requires Oracle database-first mappings, forbids hand-editing generated files, requires confirmation before database changes, and assigns one owner to database scripts and scaffolding. The existing scaffold procedure uses `dotnet ef dbcontext scaffold` with table filters and a named connection. Reverse engineering reads metadata and does not change application data.

**Alternatives considered**:

- Scaffolding with `--force` into the current context was rejected because it can overwrite generated context/entity files and is not necessary to inspect the missing table.
- Hand-writing a `StdDivision` class or guessing its columns was rejected because it would bypass the database-first source of truth.
- Creating `STD_DIVISION` when it is absent was rejected because DDL needs database-owner approval and is outside this planning task.

## Existing department storage and multi-division assignment

**Decision**: Reuse the existing `STD_DEPARTMENT` rows as division assignments. Its generated key is `(DEPT_COMP_CODE, DEPT_DIVN_CODE, DEPT_CODE)`, so treat `(DEPT_COMP_CODE, DEPT_CODE)` as a logical department identity within a company and each distinct `DEPT_DIVN_CODE` row as an assignment. A create or link operation adds only missing assignments; removing an assignment removes only its row. Require shared department details for the logical identity to remain consistent across assignments.

**Rationale**: This preserves the database-first table and its current primary key while implementing the required ability to associate one logical department code with multiple divisions. It avoids introducing an unapproved schema change or another join table.

**Alternatives considered**:

- Creating a normalized department master and a separate many-to-many association table would be a clearer new schema, but it requires DDL and data migration, both of which need owner approval and are not assumed here.
- Treating each division row as an unrelated department would not support the specification's existing-department selection and cross-division identity.

## API shape and generated Angular client

**Decision**: Add company-scoped controller routes with typed request/response DTOs and service/repository operations, following the existing company API. Generate OpenAPI from the API's declared return types and regenerate the Angular client with the existing `generate-api-client` npm script.

**Rationale**: This follows the project's controller/DTO convention, avoids duplicated handwritten API models, preserves typed client generation, and keeps departments scoped to the owning company.

**Alternatives considered**:

- Hand-authoring an OpenAPI file or Angular API client was rejected because the API-generated OpenAPI document is the contract source of truth.
- Global error infrastructure was rejected; current project guidance calls for errors to be surfaced at the relevant API/UI operation.

## UI integration

**Decision**: Extend the existing Company Master add and details experiences rather than introducing standalone division or department navigation. Keep creation steps in the order Basic Details → Division → Department; show company-scoped departments in the required association selector.

**Rationale**: This directly matches the user's navigation and ownership model and reuses existing company routes, styling, and component conventions.

**Alternatives considered**:

- Separate top-level master pages were rejected because the request places divisions and departments under company add/details and did not ask for independent navigation.

## Testing and data safety

**Decision**: Use service-level xUnit tests with fakes, Playwright tests with mocked API responses, and Vitest for Angular behavior. Do not connect automated test suites to Oracle or write to application data.

**Rationale**: This reuses the established project test stack while respecting the constitution's test-data safety rules and preventing tests from affecting development records.

**Alternatives considered**:

- Oracle-backed integration tests were rejected because this plan does not have approval to mutate database data and the existing feature plans favour code-side fakes and mocked responses.
