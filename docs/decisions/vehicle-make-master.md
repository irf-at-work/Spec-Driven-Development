# Vehicle Make Master Decisions

**Status**: Proposed; package and Oracle schema gates remain subject to owner approval.
**Date**: 29-Oct-2026

## Use the Existing ASP.NET Core OpenAPI Document

**Decision**: Keep ASP.NET Core OpenAPI as the API contract source and generate the Angular client from it. Express response shapes through controller return types and do not hand-edit generated client files.

**Alternatives considered**: Add another API description stack or maintain handwritten Angular API models.

**Rationale**: The API already emits OpenAPI in Development. A generated client avoids duplicated request/response definitions and follows the project constitution.

## Use Oracle Database-First Scaffolding

**Decision**: Use the approved existing Oracle 19c schema with Oracle.EntityFrameworkCore Database-First scaffolding. Do not use EF migrations or edit scaffolded files; extend entities through partial classes. Obtain approval before any schema/data change.

**Alternatives considered**: Invent schema, handwrite persistence mappings, or use EF migrations.

**Rationale**: The project constitution mandates Oracle Database-First and explicitly prohibits migrations and unapproved database changes. Physical table/key/audit mappings remain pending schema inspection.

## Apply Search and Sorting Before Pagination

**Decision**: Filter and sort the full vehicle-make result set in the API/database query, then return 10 rows through the shared `PaginatedResult<T>`. Initially sort Make Code ascending and allow only Make Code, Make Name, and Short Name as sort columns.

**Alternatives considered**: Load all records and filter/sort only the visible page in Angular.

**Rationale**: Client-side page-only operations would return incomplete or incorrect results and would not satisfy the shared pagination contract.

## Normalize at the API Boundary

**Decision**: Enforce Make Code uniqueness, requiredness, allowed characters, capitalization, and all field limits in the API. Normalize English text when saving and preserve Arabic characters and spacing exactly. Treat UI validation as user assistance, not as the authoritative check.

**Alternatives considered**: Rely on Angular form validation alone.

**Rationale**: API validation protects data regardless of which client submits the request and follows the project's input-validation rule.

## Use Angular Material and Required Automated Tests

**Decision**: Use Angular Material 22.2.5 and Angular ESLint schematics 22.6.0 with the existing Angular 22.2 / TypeScript 6.0 project, XUnit for API tests, and Playwright for end-to-end acceptance tests. Run formatting, lint, builds, API tests, and browser tests through one documented PowerShell command.

**Alternatives considered**: Native controls only, manual testing only, or separate undocumented test commands.

**Rationale**: Angular Material, Angular 22, XUnit, and Playwright are project constraints; automated acceptance coverage and a single test command are constitution requirements. Package additions require owner approval. Prettier is already present; Angular ESLint is a proposed MIT-licensed addition, and `dotnet format`/analyzer checks are provided by the .NET SDK.

## Retire Records with an Active Flag, Not a Separate Action

**Decision**: Every make (and later every model) has an Active setting stored as `Y` or `N` in `VMAK_ACTIVE_YN` / `VMOD_ACTIVE_YN`. A new record is Active by default; a row with no flag counts as Active. An update request that does not mention `active` leaves the status unchanged. Inactive records stay in the list and can be opened.

**Alternatives considered**: Leave the column to a database default (the earlier design), or hide inactive rows with a filter.

**Rationale**: Owner decision of 29-Oct-2026 (spec FR-027 to FR-029). Writing the flag explicitly means the page no longer depends on an unverified database default or trigger, so the earlier "database-supplied" override in the hand-written part of the data context was removed.

## Refuse Make Deletion While Models Exist

**Decision**: Before deleting a make, the API counts its models and answers `409` with a plain-English message keyed `makeCode` when any exist. A concurrent Oracle `ORA-02292` (child record found) maps to the same answer. Until `BRM_VEH_MODEL` is scaffolded (tasks T002 and T007), the count uses one parameterised read-only query; replace it with a normal query on the scaffolded entity afterwards.

**Alternatives considered**: Rely on the database foreign key alone, or cascade-delete the models.

**Rationale**: Spec FR-026. The foreign key alone would give a raw database error, and a cascade would silently remove child data if the live schema turns out to cascade, which is still to be verified.

## Unpaged Model-Options Lookup (Constitution C3 Exception)

**Decision**: `GET /api/vehicle-model-options` returns the nine fixed dropdown lists in one unpaged response. The exception to B8 is recorded in constitution C3 (29-Oct-2026).

**Alternatives considered**: Nine separate endpoints, caller-chosen list types, or paged options.

**Rationale**: Small fixed lookups; the owner chose the unpaged behaviour in the spec clarifications.
