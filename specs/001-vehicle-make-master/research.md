# Research: Vehicle Make Master

**Date**: 29-Oct-2026
**Inputs**: `spec.md`, `.specify/memory/constitution.md`, existing API/UI project files, official package metadata and compatibility references.

## Decisions

### Add formatter and linter checks

- **Decision**: Use the existing Prettier 3.8.1 for Angular/TypeScript/HTML/JSON formatting, the .NET SDK's built-in `dotnet format` for C# formatting, and Angular ESLint schematics 22.6.0 for Angular/TypeScript linting. Pin frontend dependencies through exact package versions and the committed npm lockfile. Run formatter verification and lint from the single test runner.
- **Rationale**: The constitution requires automatic formatting and linting. Prettier already exists in the UI package, and `dotnet format` is included with the .NET SDK. The repo has no Angular lint configuration; `@angular-eslint/schematics` provides Angular-aware ESLint configuration for the matching Angular major line.
- **Alternatives considered**: Use Angular compilation as linting. Rejected because compilation does not check code-quality rules. Add a separate C# formatter dependency. Rejected because the .NET SDK already provides `dotnet format`.
- **Package proposal**: `@angular-eslint/schematics` 22.6.0 (MIT) configures ESLint for Angular; standard Angular tooling lacks lint rules/configuration. Prettier 3.8.1 (MIT) is already installed. Obtain owner approval before adding Angular ESLint. Sources: [Angular ESLint schematics 22.6.0](https://www.npmjs.com/package/@angular-eslint/schematics/v/22.6.0), [Prettier](https://www.npmjs.com/package/prettier/v/3.8.1), [.NET format](https://learn.microsoft.com/dotnet/core/tools/dotnet-format).

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
- **Generator proposal**: `NSwag.MSBuild` 14.7.1, MIT license. It generates typed TypeScript clients from OpenAPI; the platform has no existing client generator, and browser `fetch` alone does not generate types. Request owner approval before adding the package. Source: [NuGet package](https://www.nuget.org/packages/NSwag.MSBuild).

### Use Oracle EF Core Database-First

- **Decision**: Use the constitution-mandated Oracle 19c provider and reverse-scaffold the approved existing schema. Keep generated entities unedited; add behavior only through partial classes. Do not use EF migrations. Do not run scaffold commands until the owner approves access and any database/schema changes.
- **Rationale**: The repository has no provider, context, schema, or database configuration, and the constitution explicitly mandates Oracle EF Core Database-First.
- **Alternatives considered**: Handwrite persistence or use migrations. Both conflict with the required provider/database-first rules; migrations are expressly forbidden.
- **Package proposal**: `Oracle.EntityFrameworkCore` 10.23.26400 targets .NET 10. Its license is Oracle Free Distribution, Hosting, and Use Terms, not MIT/Apache; it grants development/testing and business-operation use subject to terms. Review/approve those terms before adding it. EF design package and CLI: `Microsoft.EntityFrameworkCore.Design` 10.0.14 and `dotnet-ef` 10.0.14, both MIT, required for database scaffolding. These packages do not authorize any schema operation. Sources: [Oracle provider](https://www.nuget.org/packages/Oracle.EntityFrameworkCore/10.23.26400), [provider license](https://www.nuget.org/packages/Oracle.EntityFrameworkCore/10.23.26400/License), [EF Design](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Design/10.0.14), [dotnet-ef](https://www.nuget.org/packages/dotnet-ef/10.0.14).

### Keep the Angular 22 UI (constitution amended)

**Pinned package proposal for approval**: `@angular/material` 22.2.5 and `@angular/cdk` 22.2.5 (MIT); `@angular-eslint/schematics` 22.6.0 (MIT). These exact versions were checked against the current Angular 22.2 project; revalidate compatibility when approval is given. Sources: [Material 22.2.5](https://www.npmjs.com/package/@angular/material/v/22.2.5), [CDK 22.2.5](https://www.npmjs.com/package/@angular/cdk/v/22.2.5), [Angular ESLint 22.6.0](https://www.npmjs.com/package/@angular-eslint/schematics/v/22.6.0).

- **Decision**: Keep the existing Angular 22.2 / TypeScript 6.0 UI project. The constitution was amended to v1.0.2 (Angular 22) instead of downgrading the project. No framework package change is needed.
- **Rationale**: `sdd-ui/package.json` already declares Angular 22.2 and TypeScript 6.0. Amending the constitution is simpler (Article 2) than downgrading a working scaffold, and avoids rework in the generated project.
- **Alternatives considered**: Downgrade to Angular 21 to match the earlier constitution wording. Rejected because it adds risk and rework for no benefit.
- **UI package proposal**: `@angular/material` and `@angular/cdk` on the Angular 22 release line (match the installed `@angular/core` version; exact version and license to be confirmed at approval, expected MIT). Material is the constitution-mandated component library; CDK supplies its accessibility and interaction primitives. Native HTML alone is insufficient to meet the required project library choice consistently. Request approval before adding. Source: [Angular compatibility](https://angular.dev/reference/versions).

### Add the required API and browser test infrastructure

**Note on the UI package proposal above**: Its exact versions and MIT licenses are pinned to Angular Material/CDK 22.2.5 and Angular ESLint 22.6.0. Recheck compatibility at approval; the version/license choices are no longer unspecified.

- **Decision**: Use xUnit v3 for API/unit tests, ASP.NET Core's test host for HTTP-level tests, and Playwright Test for end-to-end browser coverage. No feature behavior can be considered complete without both API and browser tests.
- **Rationale**: Constitution B2/B5 names xUnit and Playwright. The current repo has no .NET test project or browser E2E setup; the Angular project has only a starter Vitest smoke test.
- **Alternatives considered**: Rely only on Angular component tests or manual checks. Rejected because neither proves API behavior nor the complete user journeys.
- **Package proposals**: `xunit.v3` 4.0.2, Apache-2.0; `Microsoft.NET.Test.Sdk` 18.11.0, MIT; `Microsoft.AspNetCore.Mvc.Testing` 10.0.14, MIT; `@playwright/test` 1.64.1, Apache-2.0. Test host is needed to exercise actual ASP.NET Core endpoints without requiring a second production service. Playwright drives the browser for the end-to-end acceptance flows. Request approval before adding packages. Sources: [xUnit v3](https://www.nuget.org/packages/xunit.v3/4.0.2), [Test SDK](https://www.nuget.org/packages/Microsoft.NET.Test.Sdk/18.11.0), [ASP.NET test host](https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.Testing/10.0.14), [Playwright](https://www.npmjs.com/package/@playwright/test).

### Keep pagination, search, and sorting on the server

- **Decision**: Add the small shared `PaginatedResult<T>` API response type (the starter code contains no such type), then apply validated search and allow-listed sort fields to the full database query before `Skip`/`Take` pagination. Return 10 items per page by default and Make Code ascending initially.
- **Rationale**: The spec explicitly requires search/sort across all records; client-side operations on the visible page would produce incorrect results. The constitution requires `PaginatedResult<T>` with `items`, `page`, `pageSize`, and `totalCount`.
- **Alternatives considered**: Load all records and filter/sort in Angular. Rejected because it breaks the page-size contract and will not scale with the complete record set.

### Keep storage and identity decisions within owner-approved schema

- **Decision**: Model Make Code as the immutable, required, unique business key in the API and logical data model. Map it to the existing database key only after inspection. If the schema lacks the required not-null/unique enforcement, obtain explicit owner approval before proposing DDL.
- **Rationale**: The spec makes Make Code required and unique, but the schema and existing primary-key design are unknown. The constitution requires approval for all database changes.
- **Alternatives considered**: Assume a table name, surrogate key, sequence, or DDL definition. Rejected because none is evidenced by the repository or approved schema.

### Require one documented test command

- **Decision**: Add a simple PowerShell root runner during implementation after dependency approval. It will run API tests, Angular unit tests, Playwright tests, and the build checks, and stop on the first failure.
- **Rationale**: Constitution Article 4 requires one documented test command; no common runner exists in the starter repository.
- **Alternatives considered**: Ask the owner to run unrelated commands manually. Rejected because that does not meet the single-command rule.

## Approval and Implementation Gates

1. Owner approval is required before adding/updating/removing any backend or frontend package. Every proposal above includes purpose, why existing standard/platform support is insufficient, and license.
2. Angular version is resolved: the constitution now says Angular 22 (v1.0.2), matching the existing project. No downgrade.
3. Oracle provider license terms must be accepted and Oracle 19c schema access confirmed.
4. Owner approval is required before any DDL or database inserts, updates, or deletes. No database changes were made as part of this plan.

## Unresolved Technical Questions

- The owner has described table `BRM_VEH_make` (primary key `VMAK_CODE`; see `data-model.md`). Still to confirm against the live schema: the primary-key constraint itself, column defaults or triggers (notably `VMAK_ACTIVE_YN`), character-versus-byte length semantics, and whether `VMAK_CR_DT` / `VMAK_UP_DT` are set by the application or the database.
- Confirm which Oracle connection profile may be used for approved scaffolding and integration tests. Secrets must be supplied through user-secrets or environment variables and must not enter source control.
