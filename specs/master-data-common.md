# Master Data Common Ground Rules

**Status**: Project-wide conventions for master-data feature specifications  
**Created**: 09-Nov-2026  
**Applies to**: Existing and future master-data features unless a feature specification records an explicit exception

## Purpose

This document records the shared user experience and API rules for master-data features. Each feature specification remains responsible for its own fields, keys, validation rules, lookup mappings, relationships, and allowed lifecycle actions. A feature-specific rule may refine a common rule only when the feature spec states that rule clearly.

## List, Filter, Sort, and Page

- Master-data lists MUST NOT have a single global search box. Each visible business-data column MUST have its own filter. The Actions column MUST NOT be filterable.
- Text filters MUST offer starts with, ends with, contains (default), equals, and not equals. Status filters MUST offer Active or Inactive with equals and not equals.
- Filters MUST ignore upper and lower case, combine so that a record matches every supplied filter, apply to the full result set before pagination, treat typed characters literally, and ignore blank filter values. A not-equals filter MUST include records whose value is empty.
- Filter results MUST update 500 ms after the user stops typing. Changing a filter or sort MUST return the list to page 1.
- Lists MUST default to 10 records per page and offer page sizes of 10, 25, and 50. The API MUST support the selected page size and return the shared paginated shape: `items`, `page`, `pageSize`, and `totalCount`.
- Sorting MUST apply to the full filtered result set, ignore letter case, and use deterministic tie-breakers. Each feature MUST name its sortable columns and initial sort order; the default is ascending by the feature's key fields.
- Empty results MUST be clearly distinguished from deletion or system failure. Inactive rows remain visible unless the user filters them out.

## Create, View, Update, and Lifecycle

- Feature specs MUST identify required fields, immutable key fields, duplicate rules, and field-specific limits and validation. Database column types and byte lengths MUST NOT be presented as character limits unless that equivalence is verified.
- The server is authoritative for validation. The user interface may validate early for clarity, but invalid or duplicate values MUST NOT be saved.
- Opening a record MUST show its details in the feature's established edit flow. The feature spec MUST name any immutable fields. Do not add a separate Edit action when the existing master pattern opens directly in edit mode.
- Active status MUST be available when a master record's lifecycle uses activation. It defaults to active for new records, is stored as `Y` or `N`, and can be turned off and on while editing. Turning it off retains the record; inactive records remain viewable in the list.
- Permanent deletion is separate from deactivation. A feature MUST state whether permanent deletion is supported and any relationship restrictions. When supported, the user MUST confirm a message that says deletion cannot be undone.
- Leaving a form with unsaved changes MUST require confirmation before discarding those changes. Cancelling the confirmation keeps the form and its changes.
- Creation and update audit information MUST be retained. Features MUST identify the user value used by the project; current master features use `admin` while sign-in is out of scope.

## Dropdowns and Stored Values

- Dropdown fields MUST be identified by the feature spec. Where a dropdown is backed by `STD_LIST_ITEM`, the UI shows the item's code and description, stores the code, and offers active items only.
- Each feature MUST specify the `LI_TYPE` value for each dropdown before implementation. Existing inactive values may remain visible and save unchanged when editing; they MUST NOT be offered as new selections unless a feature explicitly defines a different rule.
- Lookup lists are not paged only when they are small, bounded option sets. Any exception to the project's paginated-listing rule MUST be recorded in the constitution's governance section before implementation.

## Shared UI Behavior

- Action controls MUST use icons with a tooltip and an accessible name for assistive technology.
- Pages MUST show a breadcrumb trail below the page header. Breadcrumb links MUST respect unsaved-change confirmation, and the current page MUST be identified accessibly.
- Use a consistent style for success/error messages and confirmations. Messages use British/Indian English, state what happened, and give the next step where useful. Never show raw server exceptions.
- Follow the existing readability rules: English uses Inter, Arabic uses Noto Sans Arabic; body text is at least 16 px and table text at least 15 px. Back buttons align to the right side of the page header.
- Text casing and normalization are field-specific. Each feature MUST specify them; common UI styling does not imply a common data transformation.

## API Behavior

- List APIs MUST use the shared paginated result and the same filtering/sorting semantics as the list UI. Feature specs or API contracts MUST enumerate feature-specific filter and sort fields.
- API response shapes MUST be declared through return types and used to generate client types. JSON uses camelCase. Successful create/update operations return the saved record; successful delete returns no content.
- Validation, not-found, duplicate, and conflict failures MUST use `ProblemDetails`. Error messages MUST identify fields or conflicts in plain language and MUST NOT expose stack traces or raw exception details.
- The server MUST revalidate all user-supplied values, including dropdown codes, irrespective of client-side validation.

## Feature-Specific Decisions and Exceptions

Each master feature still needs to state:

- Its list columns, filter fields, sortable fields, initial sort, and unique tie-breaker.
- Its key, required and immutable fields, field limits, normalization rules, and duplicate behavior.
- Its dropdown fields, `LI_TYPE` mappings, requiredness, and behavior for previously saved inactive choices.
- Whether it permits permanent deletion, imports, or relationships to other master data.
- Any exception to these common grounds and the reason for it.

This document does not define claim transaction behavior, permissions, data retention, imports, or domain-specific validation where a feature spec has not supplied those rules.
