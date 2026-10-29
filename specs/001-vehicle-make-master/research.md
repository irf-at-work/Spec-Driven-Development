# Research: Vehicle Make Master

**Date**: 29-Oct-2026
**Inputs**: `spec.md`, `.specify/memory/constitution.md`, existing API/UI project files, and the current repository manifests. Package compatibility and licenses were checked when the existing dependencies were selected.

## Decisions

### Add formatter and linter checks

- **Decision**: Use the existing Prettier 3.8.1 for Angular/TypeScript/HTML/JSON formatting, the .NET SDK's built-in `dotnet format` for C# formatting, and the installed Angular ESLint 22.6.0 builder for Angular/TypeScript linting. Run formatter verification and lint from the single test runner.
- **Rationale**: The constitution requires automatic formatting and linting. Prettier already exists in the UI package, `dotnet format` is included with the .NET SDK, and `angular.json` already configures the Angular ESLint lint target.
- **Alternatives considered**: Use Angular compilation as linting. Rejected because compilation does not check code-quality rules. Add a separate C# formatter dependency. Rejected because the .NET SDK already provides `dotnet format`.
- **Existing dependencies**: Angular ESLint 22.6.0 and Prettier 3.8.1 are present. No additional formatter or linter package is proposed. Sources: [Angular ESLint 22.6.0](https://www.npmjs.com/package/angular-eslint/v/22.6.0), [Prettier](https://www.npmjs.com/package/prettier/v/3.8.1), [.NET format](https://learn.microsoft.com/dotnet/core/tools/dotnet-format).

### Log errors and significant actions safely

- **Decision**: Log timestamped create/update/delete successes and failures with action, record key, and error category. Do not log secrets, names, remarks, or unnecessary personal data. Keep client error responses as `ProblemDetails` without stack traces.
- **Rationale**: Constitution Article 8 requires errors not to fail silently and significant actions to be timestamped while protecting sensitive information.
- **Alternatives considered**: Log only successful CRUD actions. Rejected because it leaves failures unobservable and does not meet Article 8.

### Record significant technical decisions

- **Decision**: Record significant choices for this feature in `docs/decisions/vehicle-make-master.md` (including selected option, alternatives, and rationale), without changing the existing authorization-scope decision.
- **Rationale**: Constitution Article 11 requires significant technical decisions to be recorded in `docs/decisions/`.
- **Alternatives considered**: Keep decisions only in feature research. Rejected because the constitution names a repository-wide decision-record location.

### Use the existing ASP.NET Core OpenAPI surface

- **Decision**: Keep the API's existing `Microsoft.AspNetCore.OpenApi` setup as the OpenAPI source. Express response types through controller method return types; do not add controller/action Swagger attributes or XML docs. Generate the Angular client from this document and never edit generated files by hand.
- **Rationale**: `SDD.API/SDD.API/Program.cs` already registers and maps OpenAPI in Development. This is the shortest path that follows constitution B7.
- **Alternatives considered**: Add Swashbuckle and hand-authored API models. Rejected because the existing API already emits OpenAPI and duplicate handwritten client models violate B7.
- **Existing generator**: `NSwag.MSBuild` 14.7.1 (MIT) is already referenced by the API project and configured in `SDD.API/SDD.API/nswag.json`. Use it to generate typed TypeScript clients from OpenAPI; do not add another generator or hand-author duplicate API models. Source: [NuGet package](https://www.nuget.org/packages/NSwag.MSBuild).

### Use Oracle EF Core Database-First

- **Decision**: Use the constitution-mandated Oracle 19c provider and reverse-scaffold the approved existing schema. Keep generated entities unedited; add behavior only through partial classes. Do not use EF migrations. Do not run scaffold commands until the owner approves access and any database/schema changes.
- **Rationale**: The repository now has the Oracle provider, a database-first context, and a scaffolded make entity. The model and standard-list mappings are not yet present. The constitution mandates Oracle EF Core Database-First for any additional tables.
- **Alternatives considered**: Handwrite persistence or use migrations. Both conflict with the required provider/database-first rules; migrations are expressly forbidden.
- **Existing packages**: `Oracle.EntityFrameworkCore` 10.23.26400 targets .NET 10. Its license is Oracle Free Distribution, Hosting, and Use Terms, not MIT/Apache; it grants development/testing and business-operation use subject to terms. `Microsoft.EntityFrameworkCore.Design` 10.0.14 and `dotnet-ef` 10.0.14 (both MIT) support database scaffolding. Package presence does not authorize any schema operation; verify the provider terms and owner-approved database access before new scaffolding. Sources: [Oracle provider](https://www.nuget.org/packages/Oracle.EntityFrameworkCore/10.23.26400), [provider license](https://www.nuget.org/packages/Oracle.EntityFrameworkCore/10.23.26400/License), [EF Design](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Design/10.0.14), [dotnet-ef](https://www.nuget.org/packages/dotnet-ef/10.0.14).

### Keep the Angular 22 UI (constitution amended)

**Existing pinned UI dependencies**: `@angular/material` 22.2.5, `@angular/cdk` 22.2.5 (MIT), and `angular-eslint` 22.6.0 are in the current UI manifest. Sources: [Material 22.2.5](https://www.npmjs.com/package/@angular/material/v/22.2.5), [CDK 22.2.5](https://www.npmjs.com/package/@angular/cdk/v/22.2.5), [Angular ESLint 22.6.0](https://www.npmjs.com/package/angular-eslint/v/22.6.0).

- **Decision**: Keep the existing Angular 22.2 / TypeScript 6.0 UI project. The constitution was amended to v1.0.2 (Angular 22) instead of downgrading the project. No framework package change is needed.
- **Rationale**: `sdd-ui/package.json` already declares Angular 22.2 and TypeScript 6.0. Amending the constitution is simpler (Article 2) than downgrading a working scaffold, and avoids rework in the generated project.
- **Alternatives considered**: Downgrade to Angular 21 to match the earlier constitution wording. Rejected because it adds risk and rework for no benefit.
- **UI dependency rationale**: Angular Material is the constitution-mandated component library, and CDK supplies its accessibility and interaction primitives. Keep the existing Angular 22-compatible versions; no additional UI package is proposed. Source: [Angular compatibility](https://angular.dev/reference/versions).

### Add the required API and browser test infrastructure

**Existing test dependencies**: `xunit.v3` 4.0.2 (Apache-2.0), `Microsoft.NET.Test.Sdk` 18.11.0 (MIT), `Microsoft.AspNetCore.Mvc.Testing` 10.0.14 (MIT), and `@playwright/test` 1.64.1 (Apache-2.0) are in the current project manifests.

- **Decision**: Use xUnit v3 for API/unit tests, ASP.NET Core's test host for HTTP-level tests, and Playwright Test for end-to-end browser coverage. No feature behavior can be considered complete without both API and browser tests.
- **Rationale**: Constitution B2/B5 names xUnit and Playwright. The repository has an XUnit API test project and Playwright Test dependency; extend the API tests and complete the Playwright configuration and feature browser tests.
- **Alternatives considered**: Rely only on Angular component tests or manual checks. Rejected because neither proves API behavior nor the complete user journeys.
- **Dependency rationale**: The test host is needed to exercise actual ASP.NET Core endpoints without requiring a second production service. Playwright drives the browser for end-to-end acceptance flows. No additional testing package is proposed. Sources: [xUnit v3](https://www.nuget.org/packages/xunit.v3/4.0.2), [Test SDK](https://www.nuget.org/packages/Microsoft.NET.Test.Sdk/18.11.0), [ASP.NET test host](https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.Testing/10.0.14), [Playwright](https://www.npmjs.com/package/@playwright/test).

### Keep pagination, search, and sorting on the server

- **Decision**: Use the existing shared `PaginatedResult<T>` API response type. Apply validated make search and allow-listed sorting to the full database query before `Skip`/`Take`; page makes and a make's models at 10 rows, with Make Code and Model Code ascending defaults respectively. The fixed lookup-options response is the one approved unpaged lookup exception.
- **Rationale**: The spec explicitly requires make search/sort across all records and paged model browsing; client-side operations on the visible page would produce incorrect results. The constitution requires `PaginatedResult<T>` with `items`, `page`, `pageSize`, and `totalCount` for listing endpoints.
- **Alternatives considered**: Load all make/model records and filter/sort in Angular. Rejected because it breaks the page-size contract. Paging each of the nine small fixed lookup lists was also rejected by the owner; record the explicit exception under C3 before implementation.

### Keep storage and identity decisions within owner-approved schema

- **Decision**: Model Make Code as the immutable, required, unique business key in the API and logical data model. Map it to the existing database key only after inspection. If the schema lacks the required not-null/unique enforcement, obtain explicit owner approval before proposing DDL.
- **Rationale**: The spec makes Make Code required and unique, but the schema and existing primary-key design are unknown. The constitution requires approval for all database changes.
- **Alternatives considered**: Assume a table name, surrogate key, sequence, or DDL definition. Rejected because none is evidenced by the repository or approved schema.

### Require one documented test command

- **Decision**: Add a simple PowerShell root runner during implementation after the Playwright configuration is complete. It will run API tests, Angular unit tests, Playwright tests, formatting/lint checks, and builds, and stop on the first failure.
- **Rationale**: Constitution Article 4 requires one documented test command; no common runner exists in the starter repository.
- **Alternatives considered**: Ask the owner to run unrelated commands manually. Rejected because that does not meet the single-command rule.

## Approval and Implementation Gates

1. The current manifests contain the packages needed for this design; no package change is proposed. Obtain owner confirmation under B4 before any later package addition, update, or removal.
2. Angular version is resolved: the constitution now says Angular 22 (v1.0.2), matching the existing project. No downgrade.
3. Confirm Oracle provider license acceptance and Oracle 19c schema access before new scaffolding or database integration work.
4. Owner approval is required before any DDL or database inserts, updates, or deletes. No database changes were made as part of this planning update.
5. Before implementation, formally record the owner-approved unpaged model-options lookup exception under constitution C3.

## Unresolved Technical Questions

- The owner has described make table `BRM_VEH_MAKE`, model table `BRM_VEH_MODEL`, and lookup table `STD_LIST_ITEM` (see `data-model.md`). Verify live keys, the model foreign key's non-cascading delete rule, active defaults/check constraints, character-versus-byte length semantics, audit timestamp behavior, the `LI_TYPE`/`LI_CODE` key, and that lookup descriptions are available before scaffolding or integration tests. Any missing required database rule must be escalated for owner-approved DDL; do not infer or change schema.
- Confirm which Oracle connection profile may be used for approved scaffolding and integration tests. Secrets must be supplied through user-secrets or environment variables and must not enter source control.

## Vehicle Model Design Decisions

- **Decision**: Treat `Vehicle Model` as a child of `Vehicle Make`, keyed by `(VMOD_VMAK_CODE, VMOD_CODE)`. Use nested CRUD routes so the make code is supplied by the URL and cannot be changed in the model form. Model edits save independently from make edits.
- **Rationale**: This follows the owner-confirmed Oracle composite key and the spec's inline, per-row save behavior. A model's code is unique only within its make.
- **Alternatives considered**: A global model-code key or accepting the make code in the request body. Rejected because these conflict with the confirmed table key and could allow a model to move between makes.
- **Decision**: Refuse permanent make deletion while any model exists. Verify that Oracle enforces a non-cascading foreign key; pre-check for child models for a clear response and map a concurrent foreign-key conflict to `409 ProblemDetails`.
- **Rationale**: This is the clarified spec behavior and prevents accidental child-data loss.
- **Alternatives considered**: Cascade-delete children or leave a raw Oracle constraint error. Rejected because cascade risks data loss and raw database errors violate the API error contract.
- **Decision**: Load the nine fixed, active list types from `STD_LIST_ITEM` in one read-only, unpaged options response, ordered by English description. Reject newly selected codes that are inactive or belong to another list type; allow an existing inactive code to remain unchanged during an edit.
- **Rationale**: The spec defines these fields as optional dropdowns and confirms unpaged lookup behavior. One fixed endpoint avoids repeated requests and prevents callers from selecting arbitrary list types.
- **Alternatives considered**: Nine separate endpoints, caller-supplied list types, or paged options. Rejected because they add calls/configurable surface or conflict with the owner-approved lookup behavior. Record the B8 exception under C3 before implementation.
