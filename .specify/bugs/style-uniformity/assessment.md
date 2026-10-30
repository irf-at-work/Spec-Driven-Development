# Bug Assessment: Company master view and edit consistency

- **Slug**: style-uniformity
- **Created**: 2026-10-30
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

> slug = style-uniformity  
> - make the view and edit screen of company listing have uniform style.  
> - i would prefer if the screens haad the same layout and the editable fields just changed to become edit instead of loading a new ui and the headers and fields changing their locations.  
> - look up the best ways to display a data when many fields are present like in the company master listing  
> - make phone no field only accept nmumbers and max lenth 10.  
> - style the filter in accordance with rest of the style in listing page.  
> - make the header and filters sticky in listing table

## Symptom

Company details and company editing use different routed views and layouts, so entering edit mode changes the screen rather than making the existing field presentation editable in place. The phone field currently permits up to 20 arbitrary characters, and the company-list table does not keep its header or filter row visible while scrolling.

## Reproduction

1. Open Company Master and open a company’s details.
2. Select Edit and compare the resulting form with the details view; the edit action navigates to a separate form route and layout.
3. In the create or edit form, enter letters or more than 10 digits in Phone; the input and form validator currently allow up to 20 characters.
4. Scroll within the company table container and observe that the column-header and filter rows are not configured to remain sticky.

The precise desired visual treatment for the filters and field grouping is [NEEDS CLARIFICATION: no reference screenshot, target style, or device/browser context was provided].

## Suspected Code Paths

- `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts:20-32` — creation, editing, and detail views are separate route components.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html:19-66` — detail presentation is a panel and definition-list grid; Edit links to a separate route.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html:13-25` — create/edit has its own heading and form grid; Phone currently has `maxlength="20"` at line 137.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts:183` — Phone has only a 20-character maximum validator.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html:91-92` — header and filter rows are rendered separately without sticky row configuration.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css:7-8,32-37` — table scrolling is confined to `.table-container`; filter fields have basic width/padding styles but no sticky positioning.
- `Spec-Driven-Development/SDD.API/SDD.API/Contracts/CreateCompanyRequest.cs:38` and `UpdateCompanyRequest.cs:32` — API request contracts allow phone strings up to 20 characters and do not constrain them to digits.
- `Spec-Driven-Development/SDD.API/SDD.API/Data/BrokerDataContext.cs:127-130` — the existing database column allows 20 characters.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts:73-110` — current form tests assert a 20-character phone maximum, but do not test numeric-only or 10-digit behavior.

## Root Cause Hypothesis

The company details and edit experiences were implemented as separate pages with separate templates and styles, rather than one details presentation that switches its fields into an edit state. Separately, phone length and validation were set to 20 characters in the UI and API contracts, and the scrollable table has no sticky header/filter behavior. Confidence: high for the layout, phone-validation, and stickiness gaps; medium for the subjective filter styling and preferred many-field presentation.

## Proposed Remediation

**Preferred**: Consolidate company details and editing around the same field layout, with an explicit edit state that turns eligible values into form controls in place. Keep heading, field grouping/order, and panel geometry stable; group the many fields into clear sections (for example, company identity, address, licensing, contact, and audit metadata) and make the grid responsive. Preserve direct edit-route behavior if needed by making that route activate the same component’s edit state. Style filters using the listing’s existing design tokens and control density, and make both table header rows sticky within the existing scroll container with appropriate stacking order and backgrounds.

Set Phone to a maximum of 10 characters and reject non-digits in both the UI and API request validation, with matching inline error feedback. Check existing stored phone values before enforcing the narrower API rule so that records with punctuation or more than 10 characters are not silently altered or made unexpectedly impossible to update.

**Files likely to change**:
- `Spec-Driven-Development/sdd-ui/src/app/app.routes.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts`
- `Spec-Driven-Development/SDD.API/SDD.API/Contracts/CreateCompanyRequest.cs`
- `Spec-Driven-Development/SDD.API/SDD.API/Contracts/UpdateCompanyRequest.cs`
- Related API contract/service tests for phone validation

**Tests to add or update**:
- Verify detail and edit modes preserve the same field order and layout, and that edit/cancel/save transitions do not lose the viewed company or unsaved-state feedback.
- Verify Phone accepts 0–10 digits, rejects alphabetic and punctuation input, rejects more than 10 digits, and applies the same rule to create and update API requests.
- Verify column headers and filters remain visible during vertical scrolling in the table container, including the correct stacking of the two sticky rows.
- Verify filter-control styling and multi-field grouping remain usable at narrow and wide viewport sizes.

## Risks & Considerations

- Enforcing a stricter API phone contract may reject existing values longer than 10 characters or containing formatting characters; inspect existing data and avoid silently rewriting it. The database column can remain at 20 characters, so this change need not require a schema migration.
- Inline editing introduces unsaved-change and cancel behavior into the details view; preserve current save errors, loading states, and route/query-parameter behavior.
- Sticky rows must account for the table’s two header rows, scroll-container boundaries, backgrounds, and stacking so they do not overlap the data rows or each other.
- The requested filter styling is subjective; confirm the target appearance during implementation if the existing listing design does not establish a clear standard.

## Open Questions

- [NEEDS CLARIFICATION: Should the company code/name and audit metadata remain read-only in edit mode, as they currently are or appear only in the details view?]
- [NEEDS CLARIFICATION: Is the intended phone format strictly 10 digits with no spaces or punctuation, and should existing nonconforming records be corrected before API validation is tightened?]
- [NEEDS CLARIFICATION: What specific visual reference or responsive breakpoint should define filter styling and grouping for the company fields?]
