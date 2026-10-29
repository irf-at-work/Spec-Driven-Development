# Research: Shared Dashboard Foundation

**Date**: 2026-10-29

## Oracle EF Core reverse engineering

**Decision**: Use EF Core 10 tooling with the .NET 10 API and a compatible Oracle.EntityFrameworkCore 10.x provider. Pass `Name=ConnectionStrings:BrokerConnection` to the scaffold command rather than placing the connection-string value in the command. Select only the three requested tables using repeated `--table` options, set the context/output paths explicitly, and include `--no-onconfiguring`. Do not use `--force` for the initial scaffold or hand-edit generated files.

**Rationale**: The API targets .NET 10 and uses the pinned Oracle EF provider and EF tooling aligned to EF Core 10. The approved local connection key is `BrokerConnection`. Named configuration avoids putting credentials in command text, while `--no-onconfiguring` avoids writing connection configuration into the generated context. An explicit table allowlist limits the generated scope. Oracle's reverse-engineering guidance warns that combining schema and table filters can broaden results; avoid that combination. Scaffold is a read of metadata and must not apply DDL or data changes.

**Alternatives considered**:

- Put the connection string directly in the command: rejected because it can expose credentials in process arguments, history, or logs.
- Use a schema-wide scaffold: rejected because this feature only names three tables and a broad schema filter can include unintended objects.
- Edit generated entity/context classes or overwrite them on later scaffolds: rejected because changes would be lost and conflict with the constitution's database-first rules. Use partial extensions when a real need arises.
- Run the currently available EF CLI 9.0.6 against a .NET 10 / EF Core 10 setup: rejected until the toolchain is aligned.

**Sources**:

- [Microsoft EF Core reverse engineering](https://learn.microsoft.com/en-us/ef/core/managing-schemas/scaffolding/)
- [Microsoft EF Core connection strings](https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-strings)
- [ASP.NET Core Secret Manager](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-10.0)
- [Oracle EF Core reverse engineering and type mapping](https://docs.oracle.com/en/database/oracle/oracle-database/26/odpnt/EFCoreREDataTypeMapping.html)
- [Oracle.EntityFrameworkCore 10.23.26400](https://www.nuget.org/packages/Oracle.EntityFrameworkCore/10.23.26400)
- [Oracle ODP.NET system requirements](https://docs.oracle.com/en/database/oracle/oracle-database/26/odpnt/InstallSystemRequirements.html)

## Angular shell, navigation, and shared presentation

**Decision**: Target Angular 21, as selected by the user and required by the constitution. Before implementation, align the current Angular 22.2.3 dependency set to the chosen major and verify the compatible, pinned Angular Material/CDK versions. Keep the navigation shell separate from routed master destinations; use the Angular Router for the two destinations. Use Angular Material's accessible menu/toolbar controls and shared CSS tokens/styles for recurring table and input appearance.

**Rationale**: The router supports view navigation without full-page reloads. A shared shell keeps the one Masters menu consistent as additional separately specified master pages are introduced. Material is the constitution's primary UI library; global CSS is appropriate for cross-component styles, while local styles prevent shell rules leaking into page content. The current repository resolves Angular 22.2.3, which conflicts with the specified Angular 21 baseline; mixing major versions is not a safe design.

**Alternatives considered**:

- Plan against Angular 22 without reconciliation: rejected because it conflicts with the constitution and the user's choice.
- Implement separate headers on each destination: rejected because navigation and layout are shared foundation work.
- Use broad global selectors for every layout detail: rejected because global styles should be limited to reusable controls and theme tokens.
- Use a custom inaccessible dropdown: rejected in favour of Material's supported menu interaction and keyboard/focus behavior.

**Sources**:

- [Angular routing guide](https://angular.dev/guide/routing)
- [Angular accessibility best practices](https://angular.dev/best-practices/a11y)
- [Angular component styling](https://angular.dev/guide/components/styling)
- [Angular version compatibility](https://angular.dev/reference/versions)
- [Angular Material getting started](https://material.angular.dev/guide/getting-started)
- [Angular Material menu](https://material.angular.dev/components/menu/overview)
- [Angular Material toolbar](https://material.angular.dev/components/toolbar/overview)
- [Angular Material theming](https://material.angular.dev/guide/theming)

## Shared paginated response

**Decision**: Represent a page with the generic `PaginatedResult<T>` contract: `items`, `page`, `pageSize`, and `totalCount`. Use the constitution's default page size of 10. Treat `page` as a one-based page index, and calculate `totalCount` from the full filtered result before applying the page window. Return DTO items, not scaffolded EF entities.

**Rationale**: This preserves the constitution's single shared response shape and keeps database mappings separate from public API contracts. A one-based page is the conventional user-facing page number and matches the spec's page navigation language.

**Alternatives considered**:

- Add total-pages, links, or sort metadata: rejected because these values are not in the agreed contract.
- Return EF-generated entities directly: rejected because the constitution uses DTOs by default and generated database models are not API contracts.
- Create different pagination wrappers per endpoint: rejected because the constitution requires the shared generic type.

**Sources**:

- Project constitution, B6, B8, and B10.
- Feature specification, FR-007 through FR-009.

## Validation strategy

**Decision**: Use xUnit for .NET unit and Playwright end-to-end checks, and Vitest for Angular unit tests. Provide one PowerShell command that runs all applicable suites and propagates any failure.

**Rationale**: These are the project's required test technologies. A single runner satisfies the constitution's documented-test-command rule across the split API/UI repository.

**Alternatives considered**:

- Test only the API or UI: rejected because the spec covers database representation, pagination, navigation, and shared visual behavior.
- Run each suite without an aggregate documented command: rejected because the constitution requires one documented test invocation.
