# Quickstart: List Item Master

This guide validates List Item Master after implementation. It does not change schema or application data.

## Prerequisites

- .NET 10 SDK and Node.js/npm for the existing projects.
- JDK 11 or later for OpenAPI Generator; the CLI version is pinned in `Spec-Driven-Development/sdd-ui/openapitools.json`.
- No database connection is needed for automated tests. Do not create, edit, or delete real master records as part of validation.

## Confirm the existing scaffold

The model-only test verifies the existing `STD_LIST_ITEM` table, schema, composite key, property mappings, audit columns, and field limits without opening a database connection. Run it from the repository root:

```powershell
dotnet test .\Spec-Driven-Development\SDD.API\SDD.API.Tests\SDD.API.Tests.csproj --filter FullyQualifiedName~BrokerDataContextModelTests
```

Expected: the scaffold assertions pass. Do not run reverse engineering, DDL, migrations, or database writes as part of this feature; stop and raise a mismatch rather than changing the approved table or generated context.

## API-first client workflow

The Angular client is generated from the API's OpenAPI output; neither the OpenAPI document nor generated client files are edited by hand.

1. Start the API in Development with its configured connection string:

   ```powershell
   dotnet run --project .\Spec-Driven-Development\SDD.API\SDD.API\SDD.API.csproj --urls http://localhost:5114
   ```

2. In another terminal, capture the document produced by the running API:

   ```powershell
   Invoke-WebRequest http://localhost:5114/openapi/v1.json -OutFile .\Spec-Driven-Development\SDD.API\SDD.API\openapi.json
   ```

   OpenAPI generation does not call list-item operations or modify database data.

3. Generate the typed Angular client:

   ```powershell
   npm --prefix .\Spec-Driven-Development\sdd-ui run generate-api-client
   ```

   Complete and validate the API and generated client before implementing the List Item Master UI.

## Automated checks

From the repository root, run:

```powershell
.\scripts\test.ps1
```

Expected: API unit tests, Playwright tests with mocked API responses, and Angular Vitest pass; any failure returns a non-zero exit code. Tests must use code-side fakes and mocked responses and must not connect to or change database data.

## Manual end-to-end checks

Use mocked API responses for UI checks. Never write test records to the configured database.

Start the API and UI in separate terminals:

```powershell
dotnet run --project .\Spec-Driven-Development\SDD.API\SDD.API\SDD.API.csproj
```

```powershell
npm --prefix .\Spec-Driven-Development\sdd-ui start
```

In the dashboard:

1. Select List Item Master and verify the current master content is replaced by the paginated list. Select Company Master and verify the existing page still opens.
2. Verify visible columns, per-column filters, sorting, page size, empty results, and page/filter/sort restoration after navigating to a configuration and returning.
3. Open a configuration and verify primary/alternate descriptions, short descriptions, value, active status, flexible values, and available history.
4. Enter edit mode on the details page, verify type/code stay read-only, save a valid change, and verify cancel discards unsaved changes without leaving the page.
5. Verify create validation, duplicate composite identity feedback, field-length validation, and active/inactive status using mocked API responses.
6. Verify removal requires confirmation; cancellation retains the item, a successful mocked removal returns to the list, and a reference conflict is shown without a success state.
7. Verify API failures leave entered form values available for retry and never appear as success.

See [the data model](./data-model.md) for field limits and [the API contract](./contracts/list-item-api.md) for the planned request and response shapes. The generated OpenAPI document remains the final public contract.
