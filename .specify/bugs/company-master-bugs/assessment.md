# Bug Assessment: Company Master Table and Detail Navigation

- **Slug**: company-master-bugs
- **Created**: 2026-10-30
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

> slug=company-master-bugs
> Below bugs were found:
> in company master listing:
> - no horizontal scollbar in company master listing table
> - make the tables height fit within view and use vertical scoll inside to view records that ovverflow
> - add borders to table and between rows, style it professionaly.
>
> in company details view:
> - details feel like they're floating in space(which is bad), make it look nice
>
> in company details edit:
> - cancel button navigates to listing, but it should navigate to the view page instead

## Symptom

The company listing does not provide the requested visible horizontal scrolling, viewport-fitting vertical scrolling, or table borders. The details fields have no enclosing visual panel, and the edit form's Cancel link always goes to the listing rather than returning to the edited company's details.

## Reproduction

1. Open Company Master at a viewport narrower than the table and inspect horizontal scrolling and row overflow.
2. Open a company details page and inspect the presentation of its detail fields.
3. Open a company's edit page and select Cancel; it navigates to `/company-master` rather than `/company-master/<companyCode>`.

[NEEDS CLARIFICATION: The preferred table border treatment and details-page visual style are not specified.]

## Suspected Code Paths

- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css:7` — `.table-container` currently has a fixed `42rem` height and `overflow: auto`, while the table has a `1500px` minimum width; it does not adapt its height to the viewport or style table borders and row separators.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html:24` — listing table and rows have no explicit bordered presentation.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html:65` — details are rendered as a definition list without a containing visual card or panel.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css:16` — details are laid out in a plain grid without panel, border, or surface styling.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html:163` — Cancel uses a fixed `/company-master` router link for both create and edit forms.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.ts:207` — the form already tracks whether it is editing and reads the company code from route parameters, which can determine the correct Cancel destination.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts` — the existing tests cover form behavior but do not assert Cancel navigation.

## Root Cause Hypothesis

The edit Cancel behavior is directly explained by the unconditional router link to the listing, despite the form already knowing whether it is editing and which company code is active. The details view uses a bare grid with no enclosing surface or borders, explaining the reported floating appearance. The listing does set `overflow: auto` and a wide minimum table width, so it should be capable of horizontal overflow in a constrained viewport; the absent scrollbar may depend on viewport layout or overlay-scrollbar behavior and should be confirmed in the target browser. The fixed 42rem height also does not adapt to available viewport space. Confidence: high for cancellation and details styling; medium for the reported missing horizontal scrollbar.

## Proposed Remediation

**Preferred**: Constrain the table wrapper to the available content width, explicitly support horizontal scrolling, and size its vertical scrolling area against the viewport rather than using a fixed 42rem height. Preserve the wide table layout, use a visible scrollbar/scroll affordance where platform defaults hide it, and add a restrained table border, row separators, and header styling consistent with the existing palette.

Present company details within a centered or full-width surface panel with a clear heading, spacing, and bordered detail groups, retaining the responsive grid and readable wrapping. Make Cancel conditional: for edits, navigate to the current company's details route while preserving query parameters; for new-company creation, retain navigation to the listing. Add a form test that verifies both destinations.

**Files likely to change**:
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.css`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-details-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-form.spec.ts`

**Tests to add or update**:
- Verify table overflow styles and row separators are present, with viewport-aware vertical sizing.
- Verify details render within a styled panel and preserve responsive detail content.
- Verify Cancel from an edit route navigates to that company's details route and Cancel from a create route still navigates to the listing.

## Risks & Considerations

- Viewport-relative height calculations must account for the dashboard header and page spacing and remain usable on short screens.
- Scrollbar visibility varies by operating system and user preferences; retain usable keyboard scrolling and an accessible table structure.
- Detail-panel styling should remain responsive and avoid truncating long addresses, emails, or websites.
- Keep query parameters when returning from edit so listing context is not lost.

## Open Questions

- [NEEDS CLARIFICATION: Are there preferred colors, border weights, or a reference design for the table and company details panel?]
