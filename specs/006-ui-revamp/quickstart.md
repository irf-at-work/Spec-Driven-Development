# UI Revamp Validation Quickstart

## Prerequisites

- Node.js and npm compatible with the existing UI project.
- Front-end dependencies already installed in `Spec-Driven-Development/sdd-ui`.
- The existing .NET API running at the UI's configured development endpoint when exercising data-backed screens.
- A dedicated test database/schema for tests that create, update, or delete data; do not use development data for automated destructive scenarios.

No dependency or runtime changes are required for these checks.

## Automated Validation

From `Spec-Driven-Development/sdd-ui`:

```powershell
npm run test
npm run build
```

Expected result: existing component tests pass and the Angular production build completes without errors. The pre-existing initial-bundle budget warning is recorded in `plan.md`.

The full E2E project starts an API fixture configured for local Oracle `FREEPDB1`. Run the full suite only after verifying that database is a dedicated test environment:

```powershell
dotnet test .\Spec-Driven-Development\SDD.API\SDD.API.E2E.Tests\SDD.API.E2E.Tests.csproj
```

Do not run unmocked database scenarios against development data.

For presentation and mocked-route acceptance checks that do not exercise the database scaffold smoke tests, select the existing UI journeys explicitly:

```powershell
dotnet test .\Spec-Driven-Development\SDD.API\SDD.API.E2E.Tests\SDD.API.E2E.Tests.csproj --filter "FullyQualifiedName~DashboardNavigationTests|FullyQualifiedName~CompanyListAndDetailsE2ETests|FullyQualifiedName~CompanyStructureDetailsE2ETests|FullyQualifiedName~CompanyStructureAddE2ETests|FullyQualifiedName~CompanyStructureEditE2ETests|FullyQualifiedName~CompanyAddEditE2ETests|FullyQualifiedName~CompanyDeleteE2ETests|FullyQualifiedName~ListItemAddEditE2ETests|FullyQualifiedName~ListItemListAndDetailsE2ETests|FullyQualifiedName~ListItemDeleteE2ETests|FullyQualifiedName~SharedPresentationTests"
```

These journeys mock UI API requests. The test collection still initializes its local API fixture, so verify the fixture's database configuration before running tests that are not route-mocked.

## Manual Acceptance Review

1. Start the existing UI with `npm start`.
2. Visit `/`, `/company-master`, `/company-master/new`, a company details route, `/listing-master`, `/listing-master/new`, and a list-item details route.
3. Repeat the layout review at viewport widths 320 px, 768 px, 1024 px, and 1440 px.
4. Confirm the shared toolbar and Masters menu are visible and navigate to the same destinations. Confirm the dashboard content remains empty.
5. In Company Master, check all 11 columns, each supported text filter/operator and clear action, date-column sort/no-filter behavior, sorting, pagination, URL state, pointer/keyboard resizing, row navigation, and the sticky trailing Actions column.
6. In company details, compare view/edit field positions and values, inspect both audit pairs and GST dates, then test existing save/cancel/delete interactions.
7. Expand multiple divisions; inspect the department table, empty state, edit state, and existing create/assign/delete dialogs.
8. Complete the company creation steps and confirm existing fields, validation, and save/navigation behavior.
9. In List Item Master, check filters, active-status selection, sorting, pagination, history tooltip, record navigation, and existing create/edit behavior.
10. Use keyboard-only navigation through menus, table controls, dialogs, fields, and actions. Confirm focus stays visible and no pointer-only action is introduced.
11. Check text and meaningful control contrast against WCAG 2.2 AA thresholds. Verify readable behavior with glass blur unavailable or disabled and with reduced motion enabled.
12. Check empty, loading, error, saving, disabled, active/inactive, warning, success, and destructive states without relying on colour alone.

Expected result: visual hierarchy is consistent and premium, the interface remains light and readable, dense data remains on solid/near-solid surfaces, and existing interactions behave as they did before styling changes.

## References

- Screen and interaction invariants: [contracts/screen-behaviour.md](./contracts/screen-behaviour.md)
- Existing entities and UI state: [data-model.md](./data-model.md)
- Normative outcomes: [spec.md](./spec.md)
