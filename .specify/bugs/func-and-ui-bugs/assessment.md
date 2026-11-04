# Bug Assessment: Company and Master UI Bugs

- **Slug**: func-and-ui-bugs
- **Created**: 2026-11-04
- **Source**: pasted text; user clarifications recorded 2026-11-04
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

The report groups related Company Master, Add Company, List Item Master, and Company listing issues. Clarifications supplied after initial assessment:

- Show all four company audit fields in one section/row.
- Truncate long values and expose the full value on hover for read-only detail values only. A 100-character company name reproduced the issue in Company Master view.
- Make expanded division details match the company details presentation.
- Make the Add division dialog use three fields per row and provide a close button and sticky title/button.
- Clear stale company setup route data when returning to the companies grid, open an initial division card, and add an Exit button to the Department step so the user can leave without adding a department. Do not otherwise change the existing setup flow.
- Make List Item Master details consistent with Company Master.
- Make the Company listing actions column just wide enough for its history icon. At fullscreen 1080p, the confirmed rendered widths are 190px for Company actions and 92px for List Item history.
- The Department-step Exit action must not save the unsaved department data.

## Symptom

Company details with a 100-character name can display an excessively long value and disrupt the layout; the user reproduced this in Company Master view. Other reported differences are supported by the templates and component logic, including the split audit layout, absent initial division card, and setup query parameter preservation. The Company actions column's actual rendered width differs from what the stylesheet values alone suggest and requires runtime/browser inspection.

## Reproduction

1. Open a company details page and inspect the Audit history and expanded division sections; the audit fields are split across two `dl` elements and division details use a separate grid style.
2. Display a company with a 100-character name in Company Master view; the user reports that the long name disrupts the layout. Apply the same inspection to other read-only detail values and to the Add division dialog layout, close control, and header positioning.
3. Start company setup, navigate to the grid using Back to companies, then choose Add company; setup query parameters are preserved by the links and may reopen the previous company/step. Also open the Division step with no existing divisions and compare it with the Department step.
4. At fullscreen 1080p, compare the confirmed rendered widths of 190px for Company actions and 92px for List Item history with the stylesheet declarations while correcting the Company width.

## Suspected Code Paths

- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html` — renders audit history as two `.audit-pair` elements; contains division read-only fields and the Add division dialog without a close button.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css` — styles division detail cards and the shared dialog; no sticky dialog title or three-column division-field layout is present.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts` — currently asserts two audit pairs, so the audit layout test needs updating if the requested one-row layout is adopted.
- `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.html` and `company-fields.css` — company values render as text; current `overflow-wrap` can wrap long text but does not provide truncation with a full-value tooltip.
- `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.html` and `list-item-details-page.css` — list-item detail presentation is implemented separately from the company details view, including its own grid styles.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html` and `company-form.ts` — Division setup has an empty state but no initial card creation; Department setup creates a default card. The Division step already renders “Save and Exit”; the Department step only renders Reset and Save, identifying where the requested additional Exit button belongs.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html` — Add company link preserves query parameters. The company details/form back links also preserve them, and `CompanyForm.ngOnInit` resumes setup from `step` and `companyCode` query parameters.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css` and `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/listing-master-page.css` — stylesheet widths are 5.5rem for Company actions/filter-actions and 6rem for List Item actions/filter-actions, while the user reports rendered widths of 190px and 92px respectively at fullscreen 1080p.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts` — currently expects an 88px company actions header; inspect actual rendered width and revise only after determining the desired icon-fit width.

## Root Cause Hypothesis

The confirmed presentation and setup differences appear to result from independently implemented templates/styles and incomplete setup initialization/navigation cleanup, rather than a shared master-detail presentation layer. The company form intentionally resumes steps from query parameters, but navigation links that preserve those parameters can carry setup state into a later Add company route. The user reproduced layout disruption with a 100-character company name; the specific cause is consistent with read-only values lacking truncation. Confidence is medium overall: the source confirms the differing markup and state logic, while the actual Company history-column width discrepancy remains unexplained by the declared CSS values and requires browser inspection.

## Proposed Remediation

**Preferred**: Consolidate company audit fields into a four-item responsive grid; reuse the company detail-field card style for division read-only details and align List Item Master detail headings, spacing, and field cards with the established Company Master pattern. Apply truncation and a full-value tooltip to read-only detail values only, preserving full values for assistive technology and touch access; do not alter editable form fields. Scope the Add division dialog layout to that dialog, arrange fields in three columns where space permits, and keep a dialog heading with an explicit close button visible while scrolling.

For setup, clear or explicitly override stale `step` and `companyCode` parameters when navigating back to the grid or starting a new company, while retaining the existing resume behavior for intentional setup navigation. Add a first Division card when entering a new division step with no existing cards. Add an Exit button to the Department step without otherwise changing the existing flow; activating it must discard unsaved department data and navigate to that company's details view. At fullscreen 1080p, make the Company action column (confirmed 190px) only as wide as its history icon, consistent with the 92px List Item history column.

**Alternatives**:
- Create a shared reusable details-field component for both master views. This could improve consistency further, but is a larger change than aligning the existing templates and styles.
- Use a native `title` attribute instead of the existing tooltip mechanism for full values. This avoids extra UI dependencies but has less consistent interaction/accessibility behavior.

**Files likely to change**:
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.spec.ts`
- `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.html`
- `Spec-Driven-Development/sdd-ui/src/app/shared/company-fields/company-fields.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/listing-master/list-item-details-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts`

**Tests to add or update**:
- Update the company detail audit test to assert one four-field audit grid; retain the actor/date labels and values.
- Add component/template tests for long display values and full-value access, division detail styling structure, and Add division dialog close/layout behavior.
- Add setup tests for an initially open Division card when no divisions exist, for the existing default Department card, for a Department-step Exit path that does not save unsaved department data, and for clearing stale setup query parameters when returning to or starting from the grid.
- Compare Company and List Item detail presentation at desktop and narrow viewport sizes.
- At fullscreen 1080p, verify the Company action-column sizing against the confirmed 190px Company and 92px List Item history widths, then update the Company action-column rule and its 88px test assertion to match an icon-fit width.

## Risks & Considerations

- Truncation must not make important values inaccessible to keyboard, touch, or assistive-technology users; preserve a way to inspect the full text.
- Query-parameter cleanup must not break intentional setup resume flows, filters, sorting, or pagination on the companies grid.
- Division setup already has “Save and Exit”; the requested additional Exit button belongs on the Department step, should not alter the existing flow, and must not save unsaved department data.
- At fullscreen 1080p, confirmed rendered widths are 190px for Company actions and 92px for List Item history. This conflicts with declared CSS widths (5.5rem and 6rem respectively); inspect computed/rendered sizing and table layout behavior to identify why Company is wider.
- No API, database migration, or persistence changes are indicated by the report.

## Open Questions

- None.
