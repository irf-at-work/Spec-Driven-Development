# CCM Validation Quickstart

This guide is for implementation validation after the CCM feature is delivered. Use only the approved development Oracle connection already configured for the application. Do not put credentials in source files or run these workflows against a production database.

## Prerequisites

- .NET 10 SDK and Node/npm versions already used by the repository.
- Oracle development database access through the existing `CodesMasterOracle` configuration.
- Existing Oracle tables and `STD_LIST_ITEM` data for the exact CCM lookup types.
- The API and Angular application configured as they are for existing Codes Master/Document Setup development.

## Automated validation

From the repository root, run backend tests:

```powershell
dotnet test .\Spec-Driven-Development\SDD.API\SDD.API.slnx
```

Run Angular unit tests and production build:

```powershell
Push-Location .\Spec-Driven-Development\sdd-ui
npm test -- --watch=false
npm run build
Pop-Location
```

Run the end-to-end suite with the API available at the URL expected by the existing UI proxy and the approved development database configured:

```powershell
Push-Location .\Spec-Driven-Development\sdd-ui
npm run test:e2e
Pop-Location
```

The Playwright configuration starts the Angular development server. The API and development Oracle connection must be available separately.

## CCM end-to-end scenarios

1. Open Claim Configuration Master from Master navigation. Confirm the four data columns, Add/Edit/Delete controls, empty/error states, case-insensitive filters, AND combination, sorting, and page sizes 10, 15, 20, and 50.
2. Open Add. Confirm company code is not shown and every dropdown loads only active options for its exact `LI_TYPE` using `LI_CODE`/`LI_DESC`.
3. Confirm Claim Config Code and Claims Config Name are required; test string column limits and Rounding Value from 0 through 999.99999 with at most five decimal places, including rejection of negative values. Confirm the four standard toggles default to N and Active defaults to Y. Use Reset to restore these values.
4. Save a unique configuration. Verify the parent persists under `CCM001`, creation audit is `ADMIN`/Oracle `SYSDATE`, and Applicable Products appears on the same detail page.
5. Open the CCM listing and verify records with `CCM_COMP_CODE` `CCM001` and `ASRTEST` appear with their company code; use the company-code filter and sorting to locate each.
5. Add a product mapping. Confirm its code and `LI_DESC` name appear in the child list. Attempt to add the same product again and verify the duplicate is rejected.
6. Edit the mapping to another allowed product. Verify the same mapping is updated, the child list refreshes, and its creation audit remains unchanged. Try changing it to a product already mapped to the same parent and verify conflict feedback.
7. Cancel a child-delete confirmation and verify no change; confirm another child delete and verify only that mapping is removed.
8. Attempt parent deletion while at least one product mapping exists and verify it is blocked. Remove the remaining mappings, confirm parent deletion, and verify the parent is removed. Cancel another deletion and verify that record remains.
9. Edit a parent and verify its original creation audit values remain, update audit is `ADMIN`/Oracle `SYSDATE`, and reset restores the initially loaded values.
10. In Edit, verify an already-saved inactive lookup remains visible without becoming an available new choice. Change the record in a second session, then try saving the stale form; verify it is rejected and asks you to reload.
11. Repeat the stale-edit check for a product mapping.
12. Run the existing Codes Master and Document Setup UI/API regression tests and verify no changes to their behavior.

## Expected results

- Invalid input and duplicate keys produce clear field-level or conflict feedback and do not alter existing rows.
- Lookup or network/database errors are shown as errors, not empty successful results.
- Every successful change uses the specified audit values; the UI cannot submit audit or company-code values.
- Inactive lookup rows are unavailable for new selections; stale edits never overwrite newer parent or child values.
- Parent pagination is server-side; the returned total reflects all filtered results.
- No database objects are created or changed.

The API endpoint shapes and DTO fields are detailed in [the CCM API contract](./contracts/claim-configuration-api.md); persistence fields and keys are detailed in [the data model](./data-model.md).
