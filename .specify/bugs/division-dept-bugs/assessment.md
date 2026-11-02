# Bug Assessment: Company master and division details UI defects

- **Slug**: division-dept-bugs
- **Created**: 2026-11-02
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: low

## Report (verbatim or summarized)

The report requests visual and layout corrections on the Company Master listing and company details pages: style delete actions red, align “Add company” with the listing heading, use the available page area for the table and pagination, group company details before audit history into one UI unit while retaining headings, and move company and division edit actions to the bottoms of their respective detail sections. It also requests Material expansion panels for divisions, collapsed by default, removal of unwanted L2 division fields and the redundant header cancel action, and a visible department-delete icon.

## Symptom

The current templates place the listing action below/right of the page heading, use a viewport-derived fixed-height table container, show company and division edit actions above their requested content, and render divisions expanded with custom collapse controls. The division form exposes L2 fields, while the department delete icon uses a text ligature; these behaviors conflict with the requested layout and interaction.

## Reproduction

1. Open the Company Master listing and compare the heading, Add company action, table, and paginator layout.
2. Open a company’s details page and inspect the company-information groups, audit history, and edit actions.
3. Inspect the division cards on initial load, then enter division edit mode and inspect its fields, action placement, and department table action icon.
4. [NEEDS CLARIFICATION: confirm the viewport and browser dimensions for reproducing the reported unused page space and vertical scrollbar.]

## Suspected Code Paths

- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html:2-3,18,127` — The heading and Add company action are separate siblings; the table container and paginator are separate layout elements. No delete control is present in this listing template, so the exact listing delete action mentioned in the report is not identifiable from current markup.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css:1-10,147` — The action is right-aligned, and the table container uses a fixed `100dvh - 27.5rem` height with scrolling; this can leave unused space or contribute to page scrolling depending on viewport and surrounding layout.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html:19-66` — Company edit actions occur in the details heading; company fields render as a separate component with individually bordered groups before audit history.
- `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.html:1-4` and `company-fields.css:1-16` — The current company fields UI is divided into separate field-group cards, despite the request to present pre-audit details as one unit while retaining section headings.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html:84-120,137-220,235-264` — Divisions use custom article/header collapse markup, expose a Cancel edit action in the header, place division save/cancel before the department table, and render the department delete icon as the literal `delete` text.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts:61,86-107,178-192,224-254` — The collapsed-code set starts empty, so divisions render expanded; the form and update request include L2 fields.
- `Spec-Driven-Development/SDD.API/SDD.API/Data/Entities/StdDivision.cs:12-40` and `SDD.API/SDD.API/Data/BrokerDataContext.Division.cs` — L2 fields are mapped database columns. They may be omitted from this UI per the request, but should not be removed from the API/schema or accidentally cleared when an edit is saved.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts:89-100` — Existing coverage tests manually collapsing a division, but does not assert that panels start collapsed or use Material expansion panels.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts:48-77` — Existing listing coverage verifies layout and SVG action icons, but does not cover heading/action alignment or viewport fit.

## Root Cause Hypothesis

The reported issues are primarily caused by the current templates and styles implementing an earlier interaction/layout design: separate header actions and field cards, hand-built division collapse state, and a hard-coded viewport subtraction for the table height. The department icon is a Material icon ligature rendered as text, unlike the neighboring SVG icons. Confidence: high for the markup and default-state issues; medium for the exact scrollbar/unused-space symptom because it depends on viewport and surrounding page measurements.

## Proposed Remediation

**Preferred**: Adjust the company listing layout so the Add company action shares the heading row, apply the requested destructive-action styling wherever a delete control actually exists, and size the table region from the remaining page height while keeping the paginator in view. Consolidate the pre-audit company information into a single visual container while preserving its existing headings, and move company save/cancel controls to the bottom of that region.

Use Angular Material expansion panels for divisions with collapsed initial state and place edit/delete controls in each panel header. Remove the redundant header cancel control, retain one division save/cancel group after the department table and its assignment actions, omit L2 inputs from the edit UI, and replace the department delete ligature with a visible icon consistent with the project’s SVG pattern. Preserve L2 values in update requests because they are present in the database model even though the UI should not expose them.

**Files likely to change**:
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts`
- `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.html`
- `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts`

**Tests to add or update**:
- Assert the listing header and Add company control share a row, and verify delete styling on each rendered delete action; first identify the listing delete control, since none appears in its current template.
- Check that the table and paginator fit the intended viewport without an unnecessary document scrollbar at supported desktop dimensions.
- Assert pre-audit company information is one visual unit, headings remain present, and company save/cancel controls appear after the fields and before audit history in edit mode.
- Assert divisions initially render as collapsed Material expansion panels, with edit/delete header actions and no separate collapse or redundant header cancel control.
- Assert the division form omits L2 inputs, places save/cancel after the department table and assignment controls, preserves existing L2 values after saving, and renders a visible department delete icon rather than text.

## Risks & Considerations

- L2 properties are real mapped `STD_DIVISION` columns. Hiding them in the UI must not remove API support or clear stored values during edits.
- Available table height depends on the dashboard header, content padding, browser viewport, and responsive breakpoints; validate at the dimensions where the issue was observed.
- The listing template currently has no delete button. Confirm which listing control should receive destructive styling before changing or adding an action.
- Moving controls and changing accordion semantics may affect keyboard and screen-reader behavior; preserve accessible labels, focus handling, and expanded-state announcements.

## Open Questions

- [NEEDS CLARIFICATION: Which delete action on the Company Master listing should be red? No delete button is present in the current listing template.]
- [NEEDS CLARIFICATION: What viewport/browser dimensions reproduce the unused space and vertical scrollbar?]
