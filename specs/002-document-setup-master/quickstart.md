# Quickstart: Document Setup Master

## Prerequisites

- .NET 10 SDK and Node.js/npm versions used by the repository.
- Oracle 19c reachable through the existing `CodesMasterOracle` user-secrets/environment configuration.
- Existing `IIRIS_RD_DEVP.STD_DOCUMENT` and `IIRIS_RD_DEVP.STD_DOC_APPL_MODULE` tables matching the DDL recorded in [data-model.md](./data-model.md).
- Do not apply DDL, migrations, sequence creation, or table changes for this feature.
- Regenerate the Angular API client from the canonical OpenAPI contract; never hand-edit generated files.

## Automated validation

From the repository root, run the API test suite, build the UI, and run the focused Playwright suite:

```powershell
dotnet test .\Spec-Driven-Development\SDD.API\SDD.API.Tests\SDD.API.Tests.csproj
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Push-Location .\Spec-Driven-Development\sdd-ui
try {
  npm run build
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  npm run test:e2e -- document-setup-list.spec.ts document-setup-add.spec.ts document-setup-edit.spec.ts document-setup-delete.spec.ts
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
  Pop-Location
}
```

The API tests cover validation, filtering/paging, audit values, association checks, stale edits, and parent/child deletion. The Oracle integration tests verify max-plus-one allocation under simultaneous inserts and serialize parent deletion against child creation; they create uniquely named temporary rows and remove them after each test. The tests skip only when the existing connection is not configured or cannot be opened.

Run just the Oracle concurrency tests with:

```powershell
dotnet test .\Spec-Driven-Development\SDD.API\SDD.API.Tests\SDD.API.Tests.csproj --filter "FullyQualifiedName~ApplicableModulesOracleConcurrencyTests"
```

The browser tests intercept API calls and cover listing states, filters, parent add/edit/reset, staying on the Add page after parent save with success feedback, opening the separate Applicable Module form from the parent Add page, preserving parent values while staging child rows, centered empty states and visible Add buttons, loading saved children on Edit, conditional ASR/ASSET fields, child CRUD, keyboard-operable controls, progress/duplicate-click behavior, stale-save guidance, and confirmation flows.

## Local end-to-end smoke test

1. Start the API using the existing `CodesMasterOracle` configuration:

   ```powershell
   dotnet run --project .\Spec-Driven-Development\SDD.API\SDD.API\SDD.API.csproj
   ```

2. In another terminal, start Angular:

   ```powershell
   Set-Location .\Spec-Driven-Development\sdd-ui
   npm run start -- --host 127.0.0.1
   ```

3. Open the app and navigate to **Masters > Document Setup**. Confirm the loading, empty/error, and paginated-list states.
4. Add a parent with a unique Doc Code, a required Doc Setup For value, and optional name/description. Use the Applicable Modules section's Add Applicable Module button to open the separate child form, add ASR or ASSET children, and confirm they appear in the child listing before saving the parent. Save and confirm the success alert appears while the Add page remains open, with persisted rows displayed.
5. Open Edit and confirm saved child rows are loaded under the parent. Select a non-fixed-asset Applicable For code; confirm only Applicable For, Mandatory, and Active are shown. Select the Fixed Asset option; confirm Product, PCM, and CCM choices load from their matching Codes Master types and display codes with descriptions.
6. Add an ASSET child with selected range values. Confirm the child listing shows all six range columns and the selected values.
7. Edit a child, change ASSET to Assured Master (`ASR`), and confirm all six range values are saved and displayed as `ALL`. Confirm Reset restores the loaded values.
8. Attempt to delete the parent while children exist; confirm the operation is blocked. Delete the child rows and then confirm parent deletion.
9. In a separate browser session, change a record while the first session has it open; confirm the stale save is rejected and asks the user to reload.
10. Use keyboard-only navigation through the listing and forms; confirm visible focus, labels, validation messages, progress feedback, and unsaved-change confirmation.

Use only a local/test database for the smoke test. Remove test records through the UI after the test; do not manually alter schema or data outside the feature flow.
