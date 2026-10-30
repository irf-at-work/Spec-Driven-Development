# Vehicle Make Master Decisions

**Status**: Approved for implementation. Oracle schema facts were verified read-only in the approved test schema. Vehicle-model lookup fixtures remain owner-managed and are not currently loaded.
**Date**: 29-Oct-2026

## Use the Existing ASP.NET Core OpenAPI Document

**Decision**: Keep ASP.NET Core OpenAPI as the API contract source and generate the Angular client from it. Express response shapes through controller return types and do not hand-edit generated client files.

**Alternatives considered**: Add another API description stack or maintain handwritten Angular API models.

**Rationale**: The API already emits OpenAPI in Development. A generated client avoids duplicated request/response definitions and follows the project constitution.

## Use Oracle Database-First Scaffolding

**Decision**: Use the approved existing Oracle 19c schema with Oracle.EntityFrameworkCore Database-First scaffolding. Do not use EF migrations or edit scaffolded files; extend entities through partial classes. Obtain approval before any schema/data change.

**Alternatives considered**: Invent schema, handwrite persistence mappings, or use EF migrations.

**Rationale**: The project constitution mandates Oracle Database-First and explicitly prohibits migrations and unapproved database changes. Read-only inspection verified `BRM_VEH_MAKE`, `BRM_VEH_MODEL`, `STD_LIST_ITEM`, their keys, the non-cascading model foreign key, audit columns, and field-length semantics; verified facts and the Arabic byte-length limitation are recorded in `specs/001-vehicle-make-master/data-model.md`.

## Keep the Model Key Composite and Route-Owned

**Decision**: A model is identified by `(VMOD_VMAK_CODE, VMOD_CODE)`. The make code comes only from the saved make's route, the model code is immutable after creation, and the Oracle foreign key prevents deleting a make while models remain (`DELETE_RULE = NO ACTION`).

**Alternatives considered**: Use a generated model identifier, allow models to move between makes, or cascade-delete child rows.

**Rationale**: The approved schema already defines the composite primary key and non-cascading foreign key. Keeping both keys in the nested API route matches the physical identity and prevents ambiguous cross-make updates or deletes.

## Apply Search and Sorting Before Pagination

**Decision**: Filter and sort the full vehicle-make result set in the API/database query, then return 10 rows through the shared `PaginatedResult<T>`. Initially sort Make Code ascending and allow only Make Code, Make Name, and Short Name as sort columns.

**Alternatives considered**: Load all records and filter/sort only the visible page in Angular.

**Rationale**: Client-side page-only operations would return incomplete or incorrect results and would not satisfy the shared pagination contract.

## Normalize at the API Boundary

**Decision**: Enforce make and model requiredness, key rules, allowed characters, uniqueness, capitalization, and field limits in the API. Normalize English text when saving and preserve Arabic characters and spacing exactly. Treat UI validation as user assistance, not as the authoritative check.

**Alternatives considered**: Rely on Angular form validation alone.

**Rationale**: API validation protects data regardless of which client submits the request and follows the project's input-validation rule.

## Use Angular Material and Required Automated Tests

**Decision**: Use Angular Material 22.2.5 and Angular ESLint schematics 22.6.0 with the existing Angular 22.2 / TypeScript 6.0 project, XUnit for API tests, and Playwright for end-to-end acceptance tests. Run formatting, lint, builds, API tests, and browser tests through one documented PowerShell command.

**Alternatives considered**: Native controls only, manual testing only, or separate undocumented test commands.

**Rationale**: Angular Material, Angular 22, XUnit, and Playwright are project constraints; automated acceptance coverage and a single test command are constitution requirements. Package additions require owner approval. Prettier is already present; Angular ESLint is a proposed MIT-licensed addition, and `dotnet format`/analyzer checks are provided by the .NET SDK.

## Retire Records with an Active Flag, Not a Separate Action

**Decision**: Makes and models have independent Active settings stored as `Y` or `N` in `VMAK_ACTIVE_YN` / `VMOD_ACTIVE_YN`. A new record is Active by default; a row with no flag counts as Active. An update request that does not mention `active` leaves the status unchanged. Inactive records stay in the list and can be opened.

**Alternatives considered**: Leave the column to a database default (the earlier design), or hide inactive rows with a filter.

**Rationale**: Owner decision of 29-Oct-2026 (spec FR-027 to FR-029). The make schema has a `Y` default; the model schema does not. Writing the selected flag explicitly means the API does not depend on either default or on an audit trigger, and a model's status never changes with its make.

## Refuse Make Deletion While Models Exist

**Decision**: Before deleting a make, the API counts its models and answers `409` with a plain-English message keyed `makeCode` when any exist. A concurrent Oracle `ORA-02292` (child record found) maps to the same answer. Models are permanently deleted individually; make deletion never cascades.

**Alternatives considered**: Rely on the database foreign key alone, or cascade-delete the models.

**Rationale**: Spec FR-026. The verified foreign key is non-cascading (`NO ACTION`); the API returns a clear conflict instead of exposing a raw database error or silently deleting child data.

## Unpaged Model-Options Lookup (Constitution C3 Exception)

**Decision**: `GET /api/vehicle-model-options` returns the nine fixed dropdown lists in one unpaged response: `VEH_VARIANT`, `VEH_TYPE`, `VEH_BODY_TYPE`, `VEH_FUEL_TYPE`, `VEH_CYLINDER`, `VEH_DOORS`, `VEH_DRIVING_TYPE`, `VEH_BODY_COLOR`, and `VEH_CATEGORY`. Only active items are returned, ordered by English description and then code. The exception to B8 is recorded in constitution C3 (29-Oct-2026).

**Alternatives considered**: Nine separate endpoints, caller-chosen list types, or paged options.

**Rationale**: Small fixed lookups; the owner chose the unpaged behaviour in the spec clarifications. The approved test schema currently has no vehicle-model list types or fixture rows. The owner will load them separately; this feature performs no writes to `STD_LIST_ITEM`.
