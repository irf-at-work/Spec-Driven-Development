# Bug Assessment: Company Master Listing Presentation

- **Slug**: company-listing-ui
- **Created**: 2026-10-30
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

> Found the following bugs for company master listing:
> 1. Arrowback, history, etc mat icons are not shown, it shows as the text arrow back
> 2. make the table fixed height and always stay shown, if no data, then show the table with no rows
> 3. Use better font
> 4.Table disappears and reappears when typing into filter, fix that.

## Symptom

Company-listing Material icon ligatures appear as text, the table is removed during loading (including while filter changes cause requests), and the table has no fixed-height presentation. The report also requests a better font but does not identify a preferred typeface or concrete readability issue.

## Reproduction

1. Open the Company Master listing and observe whether its Material icons render as icons or as their ligature text.
2. Type into a listing filter and observe the table while the query updates and companies reload.
3. View the listing with no matching companies and observe the table's height and empty state.

[NEEDS CLARIFICATION: The preferred font, desired table height, and expected responsive behavior are unspecified.]

## Suspected Code Paths

- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html:11` — mutually exclusive error/loading/content branches remove the table while loading; icon ligatures are used in the listing.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.ts:85` — query changes set loading before issuing the API request; filter input navigates with each input event at line 116.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css:7` — the table wrapper only enables horizontal overflow and does not establish a stable height.
- `Spec-Driven-Development/sdd-ui/src/index.html` — no Material icon font is configured there.
- `Spec-Driven-Development/sdd-ui/src/styles.css:15` — the current global font stack is Segoe UI, Roboto, Arial, sans-serif.
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts` — current tests cover filters and the empty state, but not table persistence during loading or icon rendering.

## Root Cause Hypothesis

The table disappearance is directly supported by the template and request flow: each filter input updates the URL, the query-param stream starts a request and sets `loading`, and the template renders only a loading message instead of the table until the request completes. The table wrapper has no fixed-height styling. Material icons rely on ligature text, but the UI does not configure or load an icon font in its document or global styles, which plausibly explains the text fallback. Confidence: high for the table behavior; medium for the icon rendering cause without reproducing in the target browser.

## Proposed Remediation

**Preferred**: Keep the listing table mounted when loading, displaying a status indicator without replacing its headers, filters, and existing rows. Define a stable table/container height and retain a zero-row table when there are no results, with an accessible empty-state message. Configure a supported Material icon font in a way consistent with project asset and network policies, or replace ligature-dependent icons with bundled SVGs.

Address the font request with a readable, consistent font stack and appropriate weights after confirming the intended visual direction. The current font stack is already present globally, so avoid changing it without identifying what the user considers inadequate.

**Files likely to change**:
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.html`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.ts`
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.css`
- `Spec-Driven-Development/sdd-ui/src/index.html` or `Spec-Driven-Development/sdd-ui/src/styles.css` for icon-font configuration
- `Spec-Driven-Development/sdd-ui/src/styles.css` if a specific font improvement is agreed
- `Spec-Driven-Development/sdd-ui/src/app/pages/company-master/company-master-page.spec.ts`

**Tests to add or update**:
- Verify table headers and filter inputs remain rendered while a filter-triggered request is pending.
- Verify the table remains present with no data and that the empty state is accessible.
- Verify the icon implementation does not render icon names as visible text.
- If font styling changes, add or update an appropriate UI assertion or visual check for the agreed typography.

## Risks & Considerations

- Loading external icon or font resources introduces a network dependency and may conflict with privacy or offline requirements; prefer bundled assets or SVGs where appropriate.
- A fixed table height needs responsive behavior on smaller screens and a clear overflow strategy.
- Keeping prior rows visible during refresh avoids layout loss, but the UI should indicate that displayed data may be stale until the request completes.
- The exact font and table dimensions remain product decisions.

## Open Questions

- [NEEDS CLARIFICATION: Which font family or visual characteristics are preferred?]
- [NEEDS CLARIFICATION: What table height is expected, and should it remain fixed across viewport sizes?]
