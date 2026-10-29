# Quickstart: Shared Dashboard Foundation

This guide describes how to validate the feature after implementation. It does not apply schema changes or include a real connection string.

## Prerequisites

- .NET 10 SDK.
- Node.js and npm versions supported by Angular 21.
- Oracle 19c access for reverse engineering, with read access to `STD_COMPANY`, `STD_DEPARTMENT`, and `STD_LIST_ITEM`.
- The `BrokerConnection` configuration key available through an environment variable or operating-system credential source. Tracked `appsettings.json` must not contain a real credential. Do not print or commit credential values.
- Oracle EF Core provider and EF CLI aligned to EF Core 10, with compatible, pinned dependencies.

## Scaffold the existing tables

The read-only scaffold has been completed using the locally configured `ConnectionStrings__BrokerConnection` environment variable. The equivalent initial EF Core reverse-engineering command, limited to the three named tables, is:

```powershell
dotnet ef dbcontext scaffold "Name=ConnectionStrings:BrokerConnection" Oracle.EntityFrameworkCore `
  --table STD_COMPANY `
  --table STD_DEPARTMENT `
  --table STD_LIST_ITEM `
  --context BrokerDataContext `
  --context-dir Data `
  --output-dir Data\Entities `
  --no-onconfiguring
```

Do not add `--schema` or `--force` to this initial operation. It reads table metadata and does not change database objects or data. It generated `Data/BrokerDataContext.cs` and `Data/Entities/StdCompany.cs`, `StdDepartment.cs`, and `StdListItem.cs`. The context maps exactly the three named tables in schema `IIRIS_RD_DEVP`; generated files have no `OnConfiguring` override or embedded connection configuration. Keep generated code unedited.

## Build and automated tests

From the repository root, run the single documented test entry point added by the implementation:

```powershell
.\scripts\test.ps1
```

Expected result: the script builds the .NET solution, installs the Playwright Chromium runtime, runs the API unit and Playwright end-to-end tests, then runs Angular Vitest; it exits nonzero if any step fails.

## Run and inspect the dashboard

In separate terminals, start the API and Angular UI:

```powershell
dotnet run --project .\Spec-Driven-Development\SDD.API\SDD.API\SDD.API.csproj
```

```powershell
npm --prefix .\Spec-Driven-Development\sdd-ui start
```

Expected checks:

1. The dashboard header remains visible while scrolling and shows one top-level Masters dropdown.
2. Opening Masters shows exactly Company Master and Listing Master.
3. Selecting either entry opens its corresponding navigation placeholder.
4. Keyboard users can open, move through, and select menu entries with visible focus.
5. At narrow viewport widths, the header and shared controls remain readable and usable.
6. Shared table and input examples use the common blue-based theme styles.

For the API response shape, compare serialized paging responses with [the pagination contract](./contracts/paginated-result.schema.json). Verify a request without a page size uses 10 and that an empty or out-of-range page retains the correct metadata.

The shared `PaginatedResult<T>` response shape is verified by xUnit serialization and default-value tests and by a Playwright contract check against a test-only API host. These tests do not connect to Oracle or change application data.

At this checkpoint, `.\scripts\test.ps1` completed successfully: the .NET solution built, all 5 xUnit tests, all 4 Playwright tests, and all 5 Angular Vitest tests passed. The API smoke test uses a test-only local connection string and does not connect to Oracle.
