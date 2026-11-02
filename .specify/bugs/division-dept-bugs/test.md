# Bug Verification: Company master and division details UI defects

- **Slug**: division-dept-bugs
- **Tested**: 2026-11-02
- **Assessment**: ./assessment.md
- **Fix**: ./fix.md
- **Result**: partial

## Summary

The original layout and division-edit changes pass the full frontend suite and production build; a 1920×1080 browser check confirms the listing paginator fits without a document scrollbar. The additional note about problems adding/removing new departments is too general to reproduce, and the API is unavailable here for an end-to-end check, so that concern remains unresolved.

## Checks Performed

| Check | Command / Action | Result | Notes |
|-------|------------------|--------|-------|
| Reproduction (post-fix) | Browser check at 1920×1080 with an empty company-list API response mocked | pass | `scrollHeight` and `clientHeight` were both 1080; the paginator bottom was at 1016px. |
| New / updated tests | `npm --prefix 'D:\Spec-Driven-Development\Spec-Driven-Development\sdd-ui' test -- --watch=false` | pass | Includes coverage for collapsed Material panels, L2 preservation, layout/actions, new-department creation payload, and department assignment removal call. |
| Regression suite | `npm --prefix 'D:\Spec-Driven-Development\Spec-Driven-Development\sdd-ui' test -- --watch=false` | pass | All 8 test files and 39 tests passed. |
| Lint / type-check | `npm --prefix 'D:\Spec-Driven-Development\Spec-Driven-Development\sdd-ui' run build` | pass | Angular production build and template/type checks succeeded. No standalone lint script is configured. |
| Department add/remove concern | Attempted browser flow with API request interception; inspected existing unit coverage | not-run | No detailed failure steps were supplied and the API service is unavailable. Existing unit tests exercise the create request and removal endpoint invocation, but do not validate the live API workflow. |

## Output Excerpts

```text
Test Files  8 passed (8)
Tests       39 passed (39)
Application bundle generation complete.
```

```text
1920×1080 listing: clientHeight=1080, scrollHeight=1080, paginatorBottom=1016
```

## Residual Risks

- The reported issue “When adding and removing new departments there are issues” has no reproduction steps, expected result, or error detail; its cause and whether it is related to this UI fix are unknown.
- Department behavior was not verified against a running API/database. Current unit tests verify client-side request construction and endpoint invocation, not persistence or server-side assignment constraints.
- The browser layout check used a mocked empty list; row-heavy listing behavior and other viewport sizes were not exercised in this run.

## Recommendation

The original company listing and details UI changes are verified by the regression suite, production build, and the 1080p listing check. Keep the overall result partial and provide concrete steps, expected/actual behavior, and any API response for the department add/remove issue; then assess it separately or extend verification against a suitable API test environment.
