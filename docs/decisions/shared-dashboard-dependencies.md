# Shared Dashboard Dependency Versions

**Date**: 2026-10-29

## Decision

Use the constitution's Angular 21 baseline and pin the approved dependencies
used by the shared dashboard and database-first scaffold. The user approved
these dependency changes before installation.

| Package                                                                                                                                   | Pinned version | Purpose                                                                                | Licence                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------: | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Angular framework packages (`@angular/core`, `common`, `compiler`, `forms`, `platform-browser`, `router`, `cli`, `build`, `compiler-cli`) |        21.2.25 | Align the existing Angular 22 application with the chosen Angular 21 baseline.         | MIT                                                                  |
| `@angular/material`                                                                                                                       |        21.2.14 | Accessible menu and toolbar controls consistent with the project's primary UI library. | MIT                                                                  |
| `@angular/cdk`                                                                                                                            |        21.2.14 | Required peer package for Angular Material components.                                 | MIT                                                                  |
| `typescript`                                                                                                                              |          5.9.3 | Satisfies Angular 21 build's `>=5.9 <6.0` peer requirement.                            | Apache-2.0                                                           |
| `vitest`                                                                                                                                  |         4.1.12 | Satisfies Angular 21 build's `^4.0.8` peer requirement.                                | MIT                                                                  |
| `Oracle.EntityFrameworkCore`                                                                                                              |    10.23.26400 | Reverse-engineer the existing Oracle 19c tables using EF Core 10.                      | Oracle package terms; review the terms distributed with the package. |
| `Microsoft.EntityFrameworkCore.Design`                                                                                                    |        10.0.14 | EF Core design-time support for database-first scaffolding.                            | MIT                                                                  |
| `Microsoft.EntityFrameworkCore`                                                                                                           |        10.0.14 | Direct EF Core dependency used by the API's generated context and Oracle provider.     | MIT                                                                  |
| `Microsoft.EntityFrameworkCore.Relational`                                                                                                |        10.0.14 | Direct relational EF dependency used by the API's generated table mappings.            | MIT                                                                  |
| `dotnet-ef` local tool                                                                                                                    |        10.0.14 | EF Core command-line tooling aligned with .NET 10 / EF Core 10.                        | MIT                                                                  |
| `xunit`                                                                                                                                   |          2.9.3 | Required backend unit tests.                                                           | Apache-2.0                                                           |
| `Microsoft.Playwright.Xunit`                                                                                                              |         1.64.1 | Required browser end-to-end tests.                                                     | MIT                                                                  |
| `Microsoft.NET.Test.Sdk`                                                                                                                  |        18.11.0 | Test host required for `dotnet test` to discover and run xUnit tests.                  | MIT                                                                  |
| `xunit.runner.visualstudio`                                                                                                               |          4.0.1 | xUnit adapter required for test discovery and execution in the .NET test host.         | Apache-2.0                                                           |

The Angular 21 peer requirements were verified against package metadata. The
user separately approved moving TypeScript from 6.0.3 to 5.9.3 and Vitest from
5.x to 4.1.12 to meet those requirements. The user also approved the two test
host packages because the approved test framework alone cannot be discovered
and run by `dotnet test`. The user approved direct EF Core and EF Core
Relational references after the scaffolded API and test projects exposed
10.0.0/10.0.14 assembly mismatches. These references live in the API project
so all consumers inherit the aligned versions. Do not add a package merely
for convenience when the existing approved dependencies can perform the work.

## Rationale

Angular 21 is required by the constitution and was selected by the user; the
existing application currently resolves Angular 22.2.3. Angular Material
provides accessible menu and toolbar controls that the project requires as its
primary UI library. The Oracle provider and EF command-line/design tools must
share the EF Core 10 major version to support the .NET 10 API. xUnit and
Playwright for .NET are required by the constitution's test rules.

## Alternatives considered

- Keep Angular 22: rejected because it conflicts with the constitution and the
  user's selected Angular 21 baseline.
- Build a custom dropdown without Angular Material: rejected because Angular
  Material is the mandated primary UI library and provides established
  accessible menu behavior.
- Run the currently installed `dotnet-ef` 9.0.6: rejected because it is not
  aligned with the .NET 10 / EF Core 10 target.
- Keep TypeScript 6 or Vitest 5: rejected because Angular 21's build peer
  requirements exclude those versions.
- Omit the .NET test host and adapter: rejected because `dotnet test` needs
  both to discover and execute xUnit test assemblies.
