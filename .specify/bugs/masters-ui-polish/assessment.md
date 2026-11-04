# Bug Assessment: Master UI polish and company setup flow

- **Slug**: masters-ui-polish
- **Created**: 2026-11-03
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

The report requests:

- Remove “Choose operator” from filter dropdowns in both masters and style the filters consistently with the existing UI.
- Add pen icons to all Edit buttons and bin icons to all Delete buttons, align the icons and text correctly, and use red text for Delete.
- In List Item Master, show a plus icon instead of the visible “add” text, add a back arrow to the list-item details back link, and use “List item master” as the details-screen heading instead of the item's description/type/code heading.
- In Company Master add flow, allow returning from Division to Basic details, use Material expansion panels for Division and Department cards, permit editing/resaving a previously saved division without duplicate-code validation blocking it, and move department removal to the top-right of its card.
- In Company Master edit flow, insert a newly added division before existing division cards.

The user clarified that multiple Division/Department cards may remain expanded at once and that all UI styling should follow the existing UI.

## Symptom

Several master-screen controls do not match the requested presentation: the shared filter still offers “Choose operator,” the list-item Add action renders the `add` ligature as text, list-item details have no back-arrow icon and use the item description/type/code instead of the requested “List item master” heading, and Edit/Delete actions lack consistent icons, alignment, and red delete text. In the company setup flow, returning from Department to Division leaves previously saved division forms without updated saved-code tracking, so saving again can submit an existing division code; the Division step also has no navigation back to Basic details, the Division and Department cards are not Material expansion panels, department removal is below the fields rather than in the top-right, and newly created divisions are appended after existing ones.

## Reproduction

1. In Company Master, create a company, continue to Division, add a division, and choose “Save & Add Department.”
2. From Department, choose “Back to Division,” then save the displayed division again. The division form remains present, but its code is not added to `savedDivisionCodes` after the initial save, so the subsequent save request can include that duplicate code.
3. Open List Item Master and a list-item detail page to observe the current filter, Add action, back link, heading, and Edit/Delete actions. Open company creation/edit screens to observe the requested navigation, card, ordering, icon, and action-layout differences.

## Suspected Code Paths

- `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.html:30` — renders the “Choose operator” option used by both master tables; the same component owns the filter appearance.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html:14,76-98,144-207` — has no Division-to-Basic action, uses custom rather than Material expansion cards, and renders department removal below its fields rather than at the top-right.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts:232,594-661` — save filters by `savedDivisionCodes`, but that set is populated only when division forms are initially loaded and is not updated after a successful save.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts:340-385` — existing division edits already use the division update API, a suitable precedent for persisting edits to saved division cards in the add/setup flow.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts:250-305` — adds a new division by preserving existing Map insertion order and then appending the new division.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html:28-46,119-140` — company and division Edit/Delete controls show the current icon and delete-style inconsistencies.
- `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/listing-master-page.html:5` — uses the `add` ligature text inside `mat-icon` rather than an explicit plus glyph.
- `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.html:2,10-26` — back link has no icon, heading is data-derived, and edit/delete controls lack the requested icons.
- `Spec-Driven-Development/sdd-ui/src/index.html` and `Spec-Driven-Development/sdd-ui/src/styles.css` — no Material Icons font is loaded or declared; this supports the reported rendering of the `add` ligature as text.

## Root Cause Hypothesis

The company setup issue is likely caused by stale client-side saved-division bookkeeping: `saveDivisions` filters already-saved codes, but does not update that set after a successful POST; on returning to Division, forms are not repopulated because they already exist, so the load path does not initialize the set. Confidence: high. The other reported UI differences are directly reflected in current templates and styling, including the absent Material Icons font setup alongside the `add` ligature. Confidence: high for the missing markup/styling and medium for the exact browser rendering, which can vary with available fonts. Match colors, spacing, typography, and action treatment to established UI styles rather than introducing a new visual convention.

## Proposed Remediation

**Preferred**: Update the shared filter control to remove the placeholder option and align its visual treatment with the existing UI. Use reliably rendered pen, bin, plus, and back-arrow icons for the requested actions, align them consistently with their labels, and make Delete text red while following existing UI conventions. Replace the list-item details heading with the requested “List item master” text.

For company creation, provide navigation from Division back to Basic details, use Material expansion panels for Division and Department cards, allow multiple cards to remain open simultaneously, and move department removal into the top-right of its card header. Distinguish persisted division cards from new cards when saving: send edits for an existing division through the division update API using its existing division code, and send only genuinely new divisions through the create API. Do not merely skip persisted cards if that would discard edits. For company edit, prepend a newly created division to the existing division list. Preserve validation for genuinely new division codes.

**Files likely to change**:
- `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.html`
- `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.css`
- `Spec-Driven-Development/sdd-ui/src/app/shared/filter-control/filter-control.spec.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/listing-master-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.spec.ts`

**Tests to add or update**:
- Verify the shared filter has no “Choose operator” option and retains operator selection, clearing, and accessibility behavior for both masters.
- Verify a division saved before entering Department is not submitted as a new duplicate after returning to Division and saving again.
- Verify edits to an already-saved division in the setup flow are persisted through the update path without being treated as duplicate creates.
- Verify Division-to-Basic navigation, expansion-panel rendering with multiple cards open at the same time, department-removal placement, and the exact list-item details heading/back-icon markup.
- Verify a newly added division is first in the company details list.
- Verify all Edit/Delete buttons across both masters render pen/bin icons with correct alignment and red Delete text; verify the list-item Add action and details back link render plus/back-arrow icons.

## Risks & Considerations

- Division tracking must distinguish persisted divisions from newly added or edited forms; avoid silently bypassing validation for genuinely new codes.
- Using Material expansion panels in the add form requires importing the corresponding Material module and preserving keyboard/accessibility behavior.
- Icon-font availability is not configured in the inspected UI shell, so explicit SVG icons are less dependent on external font loading.
- The report groups functional workflow behavior with visual polish; severity is based on the duplicate-code workflow failure, while the other items are primarily usability and consistency issues.
- Visual changes should follow existing UI styling and tokens; multiple setup cards being expanded simultaneously is an explicit requirement, not an open design choice.

## Open Questions

- None. The user clarified that multiple cards may remain expanded simultaneously and that UI-related changes should follow the existing UI.