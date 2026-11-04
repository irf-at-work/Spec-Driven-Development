# Implementation Plan: Premium Insurance Brokerage UI Revamp

**Branch**: `sdd.irfan` (current checkout) | **Date**: 2026-11-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-ui-revamp/spec.md`

## Summary

Apply one cohesive, light premium-finance visual system to the existing Angular application: centralise design tokens in the global stylesheet, reuse the current Angular Material controls and shared layout/components, and refine the existing dashboard shell, company and list-item screens, tables, forms, dialogs, audit history, divisions, and departments. Use glass effects only on suitable broad surfaces; keep data-heavy surfaces opaque and readable.

The change is presentation-only. Preserve routes, business logic, API calls, data models, field rules, permissions, form submission, filters, sorting, pagination, and all current actions. No additional libraries or screens are required.

## Technical Context

**Language/Version**: Angular 21 application; TypeScript 5.9.3.

**Primary Dependencies**: Angular 21, Angular Material 21, RxJS 7.8, and plain CSS. No dependency changes are planned.

**Storage**: N/A. No data, API contract, or persistence changes are in scope.

**Testing**: Frontend unit/component tests use Vitest via `npm run test` in `Spec-Driven-Development/sdd-ui`; production compilation uses `npm run build`. The existing Playwright/.NET/xUnit acceptance suite is in `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests`. Extend applicable existing user-journey coverage; do not introduce a test dependency as part of this plan.

**Target Platform**: Existing web application in desktop, tablet, and mobile viewports from 320 px to 1920 px. Retain the current supported browser baseline; backdrop blur is decorative and must have a readable non-blurred fallback.

**Project Type**: Existing Angular single-page web application with a .NET API; this feature changes only the Angular presentation layer.

**Performance Goals**: No measurable regression in route rendering, table interaction, or form interaction. Keep blur and large-area transparency out of data-heavy screens; use subtle transitions only where they do not delay interaction.

**Constraints**: Preserve all existing functionality and UI control behavior. Retain Angular, Angular Material, and plain CSS; do not add packages or edit generated API clients. Maintain WCAG 2.2 AA contrast, keyboard access, reduced-motion support, British English, and GST date presentation. Do not add routes, screens, backend changes, or data fields.

**Scale/Scope**: Restyle the existing shared application shell and all current routed UI: empty dashboard content area, Company Master list, company add/setup, company details/edit with audit history and divisions/departments, List Item Master list, and list-item create/details/edit. Reuse shared company fields, filter controls, navigation, and existing page components.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Before Phase 0

- **Article 1 — Specification first**: PASS. The approved feature source is `specs/006-ui-revamp/spec.md`; no implementation begins in this planning phase.
- **Articles 2 and 10 — Simplicity and change scope**: PASS. Use the existing application structure and components; no speculative screens, new layers, or unrelated work.
- **Article 3 — Explainability**: PASS. The design artifacts and validation guide will describe the user-facing result and how an owner can review it.
- **Article 4 and B5 — Testing**: PASS WITH PLAN REQUIREMENT. Preserve and run frontend tests/build, and cover affected user journeys with the project's mandated Playwright acceptance tests. No data-changing tests may target development data.
- **Article 5 — Quality**: PASS. Follow existing Angular and CSS conventions; use existing format/test/build tools.
- **Articles 6–9 — Configuration, security, errors, human control**: PASS. No configuration, data collection, API, error semantics, or consequential action changes are planned. Existing messages and confirmation behaviour remain intact.
- **Article 7 and B4 — Dependencies/secrets**: PASS. Add, update, and remove no packages; no secrets or external assets are required.
- **B3 — Domain language and dates**: PASS. Keep British English and existing GST/DD-MM-YYYY output.
- **B7/B8 — Typed Angular and stack constraints**: PASS. Preserve the existing standalone/OnPush/signal-based patterns, typed forms, Angular Material, strict templates, and plain CSS; avoid generated API files.
- **B10 — Reuse shared pieces**: PASS. Extend shared tokens, layout, and existing reusable controls rather than duplicating them.
- **C1 — Governance**: PASS. This plan records the required constitution review; no exception is requested.

**Gate result**: PASS. There are no unresolved technical choices or constitution violations requiring an exception.

## Research Decisions

See [research.md](./research.md) for the codebase-grounded decisions. The principal choices are:

1. Use the existing global stylesheet as the source for CSS design tokens, and keep component-specific layout rules in the existing component stylesheets.
2. Restyle current Angular Material components in place; do not replace controls or add a new UI library.
3. Keep all dense tables, fields, and dialog content solid or nearly solid; reserve optional translucent/blur effects for broad navigation or shell surfaces.
4. Validate visual work alongside existing interaction tests and acceptance flows, checking behavior parity before and after the refresh.

## Design and Implementation Approach

Implementation proceeds from shared styling to dependent screens:

1. Define and verify global palette, typography, spacing, surfaces, focus, elevation, motion, and Angular Material theme tokens.
2. Refine the shared navigation shell and responsive content container without changing route destinations or dashboard content.
3. Apply reusable control treatments to Material buttons, fields, selects, menus, tooltips, tables, pagination, and dialogs without changing their event wiring or semantics.
4. Apply the system to Company Master listing and shared filters, then company details, audit presentation, divisions/departments, and company setup.
5. Apply the same patterns to List Item Master and its create/details/edit screens.
6. Run targeted component tests and build, then exercise the complete acceptance matrix: route navigation and actions, filters/operators, sorting, pagination, column resizing, forms, dialogs, empty/error/loading states, and keyboard operation at supported viewport sizes.

The order establishes shared styles first and avoids page-specific copies of common visual rules. Changes should be limited to CSS and presentation-only template adjustments; TypeScript, routes, API calls, and models should remain untouched unless an existing visual accessibility defect cannot be corrected otherwise. Any such exception must be surfaced and shown to preserve behavior.

## Project Structure

### Documentation (this feature)

```text
specs/006-ui-revamp/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── screen-behaviour.md
└── tasks.md             # Created later by /speckit-tasks; not part of this plan
```

### Source Code (repository root)

```text
Spec-Driven-Development/sdd-ui/
└── src/
    ├── styles.css                         # Global palette, typography, Material tokens
    └── app/
        ├── layout/                        # Shared dashboard shell and navigation
        ├── shared/
        │   ├── company-fields/            # Reused company field groups
        │   └── filter-control/             # Reused text-filter control
        └── pages/
            ├── dashboard/                 # Empty dashboard content
            ├── company-master/            # Listing, create/setup, details/edit, divisions
            └── listing-master/            # List table, create, details/edit
```

Existing component tests are colocated with their Angular components as `*.spec.ts`. No backend, generated API, routing, or persistence source is in scope.

**Structure Decision**: Use the existing single Angular application and its global stylesheet, shared layout, reusable controls, and page/component styles. No new application project, library, dependency, or runtime module is needed. The `contracts/screen-behaviour.md` document records visual and interaction invariants, not a new external API.

## Constitution Check (Post-Design)

- **Specification and scope**: PASS. Design decisions derive from the approved specification; the change is limited to presentation.
- **Simplicity and reuse**: PASS. Existing shell, Material controls, shared fields, filters, and per-page styles are reused.
- **Testing**: PASS WITH IMPLEMENTATION GATE. Preserve all existing tests; verify visual requirements and behavior parity at the four widths specified in the spec. The constitution-required Playwright stories remain part of implementation validation.
- **Technology and dependencies**: PASS. Angular 21, Angular Material, and CSS only; no dependency or API change.
- **Accessibility and domain rules**: PASS. WCAG 2.2 AA, keyboard access, reduced motion, en-GB, and GST dates are explicit acceptance checks.
- **Data, API, and security**: PASS. No entity/schema/API/auth changes or new personal data.
- **Documentation and ownership**: PASS. Research, UI contract, data-model notes, and quickstart are maintained with the feature.

**Post-design gate result**: PASS. No constitution exceptions or complexity-tracking entries are required.

## Implementation Baseline

- Frontend tests before implementation: 58 passed, 1 failed because an existing assertion expected `List item master` while the page renders `List Item Master`.
- Production build before implementation: passed; the existing initial bundle exceeded the configured 500 kB warning budget (740.10 kB).
- `DashboardNavigationTests` passed in isolation. The complete Playwright project was not run at baseline because its shared collection starts a local Oracle-backed API fixture and includes data-changing journeys; confirm test-data isolation before running any unmocked database scenario.
- No application source files had been changed when these baseline results were recorded.

## Implementation Validation Record

- `npm run test`: passed, 60 tests across 12 files.
- `npm run build`: passed. Initial bundle is 742.64 kB, still above the existing 500 kB warning budget (baseline: 740.10 kB); the company details component-style budget warning was removed.
- Route-mocked Playwright UI acceptance set: 23 passed. This covers dashboard navigation, company/list-item listing and details, setup steps, structure editing/deletion, and responsive checks at 320, 768, 1024, and 1440 px. Unmocked database scenarios were not run because the local Oracle `FREEPDB1` fixture has not been confirmed as isolated.
- Shared presentation checks verified keyboard-visible focus (3 px outline) and reduced-motion transition suppression. Primary text, secondary text, and focus colors measure 16.27:1, 7.58:1, and 5.17:1 against white, respectively; the decorative gold-derived text color measures 5.98:1.
- .NET test output retains pre-existing NU1902/NU1903 warnings for `System.Security.Cryptography.Pkcs` 8.0.1.
- No routes, API contracts, form/business logic, dependencies, or data were changed.
