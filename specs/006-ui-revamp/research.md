# Research: Premium Insurance Brokerage UI Revamp

## Context

The UI stack and desired visual direction are explicit in the feature specification. Research therefore focused on confirming the current implementation surfaces and identifying behavior-sensitive areas rather than selecting new technologies. The findings below are based on the existing Angular application and its co-located component tests.

## Decisions

### 1. Extend the existing global theme and local component styles

**Decision**: Define shared colour, typography, spacing, surface, elevation, focus, and motion tokens in `Spec-Driven-Development/sdd-ui/src/styles.css`. Continue to implement layout-specific presentation in the existing component CSS files.

**Rationale**: The global stylesheet already defines application and Angular Material system variables, while the shared layout and each page already have dedicated styles. This preserves current style ownership and lets Material controls and app components use a single token vocabulary.

**Alternatives considered**:

- Add a separate theme package or styling framework: rejected because Angular Material and plain CSS are mandated and sufficient.
- Move all screen styles into the global stylesheet: rejected because it would increase selector coupling and make page-level changes harder to isolate.

### 2. Restyle the existing controls and preserve their behavior

**Decision**: Retain the current Angular Material components, shared `company-fields` and `filter-control` components, route configuration, event bindings, form bindings, and API services. Make visual changes in CSS and presentation-only template markup.

**Rationale**: Existing tests and templates already cover routing, filtering, sorting, pagination, resize behavior, validation, date handling, dialogs, audit history, and company hierarchy. Replacing controls or changing bindings increases the risk of breaking behavior without adding required user value.

**Alternatives considered**:

- Replace existing table or form controls with a new library or custom implementation: rejected because it violates the stack constraint and risks established keyboard and interaction behavior.
- Refactor the route or data architecture as part of the revamp: rejected because the specification explicitly excludes those changes.

### 3. Use glass effects only on non-dense surfaces

**Decision**: Apply optional translucency, blur, or subtle gradients sparingly to broad shell/navigation surfaces. Keep tables, filter rows, forms, dialog content, and validation information opaque or nearly opaque.

**Rationale**: The current app contains wide data tables, form-heavy company details, and nested division/department content. Their readability and keyboard focus must remain clear at all widths. Blur is decorative, so a solid fallback must preserve the same hierarchy.

**Alternatives considered**:

- Apply glass effects to every card and control: rejected because it reduces information clarity and conflicts with the explicit restraint requirement.
- Use a predominantly dark palette: rejected because the supplied direction requires a light interface.

### 4. Preserve bounded table scrolling and sticky/resize interactions

**Decision**: Keep each wide table within its existing scroll container. Preserve company column resizing, keyboard resize support, sticky trailing Actions column, sticky filter rows, row navigation, sort headers, and pagination.

**Rationale**: The existing screens intentionally expose many business data columns. Hiding columns or allowing the document itself to scroll horizontally would make data and actions harder to find. Table CSS and row event propagation are interaction-sensitive.

**Alternatives considered**:

- Hide lower-priority columns on mobile: rejected because the specification requires existing data to remain available.
- Replace table scrolling with cards: rejected because it changes established information hierarchy and interaction semantics.

### 5. Verify behavior and visual quality separately

**Decision**: Retain and extend existing component tests and build checks; use Playwright acceptance coverage for user journeys as required by the constitution, plus explicit viewport, keyboard, contrast, and glass-fallback checks.

**Rationale**: Existing component tests verify many behaviors but do not fully establish visual quality, contrast, or responsive layout. A successful build or unit suite alone cannot prove that a new theme has not clipped controls or made focus indicators invisible.

**Alternatives considered**:

- Rely only on unit tests/build: rejected because CSS regressions and responsive overflow may not be detected.
- Add a new visual testing dependency during this feature: rejected because package changes need approval and are unnecessary for specifying the required review matrix.

## Codebase Findings

- `src/styles.css` imports the Angular Material prebuilt theme and declares both app tokens and Material system variables.
- `app/layout/dashboard-layout.html` and its CSS define the shared toolbar, brand link, Masters menu, sticky shell, focus states, and content container.
- `app/shared/filter-control/` implements the reusable text filter, six operators, clear action, and accessible labels. Its native select is visually overlaid, so restyling must preserve hit-testing and focus.
- `app/shared/company-fields/` renders company data in view/add/edit modes and contains shared date controls and validation presentation.
- Company Master and List Item Master have separate Material table templates/styles and component tests. They have their own bounded table scrolling, filter rows, sorting, pagination, row navigation, history tooltips, and loading/error/empty states.
- Company Master additionally supports pointer and keyboard column resizing and a sticky trailing Actions column.
- Company details contain company audit history, editable company fields, expandable division panels, departments tables, and existing dialogs. Company creation includes Basic details, Division, and Department steps.
- The app route configuration already covers the dashboard, company master/list/create/details/edit, and list-item master/create/details/edit routes; unknown routes redirect to the dashboard.
- Tests are colocated with UI components. Existing tests verify behavior and rendered structure, but do not replace the required visual review at representative viewport sizes.
- The repository has an existing Playwright/.NET/xUnit acceptance-test project at `Spec-Driven-Development/SDD.API/SDD.API.E2E.Tests`; retain and extend it for user-journey acceptance rather than introducing another test framework.

## Implementation Risks to Track

- Global element selectors and Material system tokens affect many screens at once; validate all routes after changes to root styles.
- Sticky table cells and filter rows depend on stacking order and opaque backgrounds; verify both while scrolling.
- Keep row-action click propagation separate from row navigation.
- Do not alter form control bindings, validators, date adapters, phone sanitization, URL query state, or route links during presentation-only changes.
- Overlay styling must not obscure content, remove visible focus, or prevent scrolling/focusing on small viewports.
- If an interaction cannot be preserved through CSS/presentation markup alone, document it as a separate proposed functional change rather than silently implementing it.
