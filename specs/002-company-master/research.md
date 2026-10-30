# Research: Company Master CRUD

## Existing company storage

**Decision**: Reuse `IIRIS_RD_DEVP.STD_COMPANY` through the existing `StdCompany` and `BrokerDataContext` mapping. Do not change schema or generated files.

**Rationale**: The repository already maps the table and declares `COMP_CODE` as its key. Relevant limits are code 12, name 100, short name 30, address lines 100 each, reference number 20, company in-charge 60, phone 20, email 100, and website 100 characters. Dates are Oracle `DATE`.

**Alternatives considered**: Adding a new company table or assistant field would change the existing schema, is out of scope, and would require separate owner approval.

## Assistant in-charge

**Decision**: Omit assistant in-charge from the API and UI.

**Rationale**: The existing table has no distinct assistant field; the owner explicitly requested omission. `COMP_INCHARGE_L2` represents a localized company in-charge value, not an assistant.

**Alternatives considered**: Adding a column requires separate database-change confirmation; misusing the localized field would misrepresent data.

## API shape and validation

**Decision**: Implement controller endpoints and DTOs first. Generate OpenAPI from the API definitions, then generate the Angular client from that OpenAPI output. Use the existing `PaginatedResult<T>` and `ProblemDetails` errors. Keep company code immutable after creation; duplicate code returns a field-associated conflict. Allow only known sort/filter columns and apply database filtering before paging.

**Rationale**: This follows B6/B8 and the existing shared pagination contract while honoring the user's API-first sequence and avoiding a manually maintained duplicate contract. An allowlist avoids accepting arbitrary sort expressions. Oracle's key remains authoritative for concurrent duplicate submissions.

**Alternatives considered**: Returning scaffolded entities would expose unrelated database columns and couple the public API to generated storage models; client-only validation would not protect API writes; manually authoring a separate OpenAPI contract is explicitly out of scope.

**Update conflict policy**: The most recently saved valid update wins, even when another update was committed after the editor loaded the company. Do not reject an update solely because its view is stale.

## List behavior and navigation state

**Decision**: Use route query parameters for page, sort, and individual column filters. Default to page 1, page size 10, and company name ascending; use a stable company-code tie-breaker. Use case-insensitive contains matching for text filters and exact matching for date filters.

**Rationale**: URL state restores naturally on navigation and browser history without adding storage infrastructure. Stable sorting prevents rows shifting between pages when sort values match.

**Alternatives considered**: A new client-side state library or durable browser storage would add dependencies and persistence beyond the same-session requirement.

## Delete behavior

**Decision**: Require a UI confirmation and permanently delete only when no company references prevent deletion. Do not cascade. Return a conflict response when referenced.

**Rationale**: This follows the user's confirmed deletion policy and the project's human-control rule. `STD_DEPARTMENT.DEPT_COMP_CODE` is a known company reference; preserve database integrity for other enforced references as well.

**Alternatives considered**: Cascading or soft deletion changes related records or schema semantics and was not requested.

## Shared services and generated client

**Decision**: Return typed API errors and display UI failures in the relevant components; no global exception handler or HTTP interceptor is required. Generate the Angular client from the OpenAPI output generated from the API; never author the contract manually or hand-write the client.

**Rationale**: The owner removed the shared handler and interceptor requirements from the constitution. The generator is pinned to npm wrapper 2.42.0 and CLI 7.26.0.

**Alternatives considered**: Implementing local error handlers or hand-writing the API client would duplicate shared behavior and violate project rules.

**Implementation**: Run `npm run generate-api-client` from `Spec-Driven-Development/sdd-ui` after API-generated OpenAPI is available. The toolchain was verified with JDK 11.

## Test safety

**Decision**: Use code-only xUnit tests with fake dependencies and Playwright/Vitest tests with mocked API responses. Tests must not connect to a database or change database data; use the existing test tooling and `scripts/test.ps1`.

**Rationale**: The owner explicitly restricted this feature's tests to code-side behavior, avoiding test schemas and all database changes.

**Alternatives considered**: Database-backed integration tests are excluded. Test doubles and API mocks keep validation isolated without adding test dependencies.
