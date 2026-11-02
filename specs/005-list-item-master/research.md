# Research: List Item Master

## Existing table and scaffold-first ordering

**Decision**: Start by verifying and reusing the existing database-first `IIRIS_RD_DEVP.STD_LIST_ITEM` mapping and `StdListItem` entity. Do not res scaffold, edit generated files, or change the table.

**Rationale**: The shared dashboard foundation already contains the entity and model mapping. The existing context maps `STD_LIST_ITEM` with the composite key `(LI_TYPE, LI_CODE)` and defines all persisted fields and lengths. This meets the user's scaffold-first requirement without a second scaffold run or an unapproved database operation.

**Alternatives considered**: Running reverse engineering again could overwrite shared generated files and conflicts with the instruction to scaffold only once. Adding/changing a table, migration, or mapping is outside scope and requires database-change approval.

## Field set and validation

**Decision**: Treat the current scaffold as the authoritative source for field names and lengths. Expose all non-audit business fields, including the two flexible values; require type and code on creation, keep both immutable thereafter, and set active status to Y for new records unless the user chooses otherwise.

**Rationale**: `STD_LIST_ITEM` currently defines `LI_TYPE` (20), `LI_CODE` (12), primary and alternate descriptions (100 each), short descriptions (30 each), value (100), active status (1), two flexible values (100 each), and audit fields. This avoids inventing business columns and preserves the existing record definition.

**Alternatives considered**: Exposing only the listing columns would prevent users from viewing and maintaining the other defined values. Accepting client-supplied audit fields would violate the constitution's audit rule.

## API and client integration

**Decision**: Follow the Company Master controller/service/DTO pattern, reuse `PaginatedResult<T>`, generate OpenAPI from the endpoint signatures, and generate the Angular client with the repository's pinned OpenAPI Generator command.

**Rationale**: This follows the constitution and existing architecture, provides typed API responses, and avoids hand-maintained or duplicated public contracts.

**Alternatives considered**: Returning scaffolded entities exposes storage-specific types and audit write fields. Hand-authoring OpenAPI or the Angular client duplicates generated artifacts and violates project rules.

## Listing, identity, and navigation

**Decision**: Use a page size of 10, allow-listed filters and sorting on visible data columns, database filtering before paging, and composite-key tie-breaks. Store page, filter, and sort state in listing route query parameters. Use the existing Listing Master destination as the list route and add a same-page details/edit route and a create route.

**Rationale**: This reuses the established Company Master list pattern and the shared filter control, allows state restoration during same-session navigation, and keeps list item edit mode within the details page.

**Alternatives considered**: Client-side filtering/paging would load the whole master and behave differently from Company Master. A new menu destination would duplicate the existing Listing Master entry.

## Update and delete behavior

**Decision**: Use last-write-wins updates, enforce duplicate type/code identity using both an existence check and the database key, require user confirmation before permanent removal, and return a conflict when the database rejects deletion because of a reference.

**Rationale**: This follows the spec and Company Master precedent. The currently scaffolded application model contains no mapped tables or relationships referencing `STD_LIST_ITEM`, so the API must not invent reference tables or silently bypass a constraint; Oracle's integrity result is the available authority for references outside the mapped scope.

**Alternatives considered**: Optimistic concurrency rejection is not required by the spec. Cascading deletion or soft deletion changes database semantics and is not requested.

## Testing and error handling

**Decision**: Add code-only xUnit tests with fakes and Playwright/Vitest user-flow tests with mocked API responses. Keep failures visible in the API result and relevant UI page.

**Rationale**: This matches the established test architecture and the constitution's prohibition against using development data. Existing shared table, form, and filter behavior should be reused rather than copied.

**Alternatives considered**: Database-backed tests could alter real master data and are not permitted. A new global error-handling service or dependency is unnecessary for this feature.
