# UI Data and State Model: Premium Insurance Brokerage UI Revamp

## Scope

This feature changes presentation only. It introduces no persisted fields, database entities, API request/response shapes, or business state. The entities below describe existing information rendered by the UI; the existing generated API types and services remain authoritative.

## Existing UI Entities

### Company

**Purpose**: Broker/company master record displayed in the company listing, details, and company forms.

**Existing information groups**:

- Identity: company code, company name, short name.
- Address: address lines 1–3 and the existing primary-address listing value.
- Licensing/registration: incorporation date, reference number, licence issue date, licence expiry date.
- Contact: company in charge, phone, email, website.
- Audit: created by, created date, last updated by, last updated date.
- Relationships: one company may have zero or more divisions.

**Presentation constraints**: Preserve exact existing values, field order/grouping, required status, date handling, validation, and view/edit behavior. Empty optional values keep the existing empty-value presentation. Dates remain GST and DD-MM-YYYY as applicable.

### Division

**Purpose**: A subdivision displayed in an expandable panel belonging to a company.

**Existing information**: division code, name, short name, address lines 1–3, commercial registration number, licence issue/expiry dates, in-charge contact, phone, fax, mobile, email, remarks, and active state.

**Relationships**: A division belongs to one company and displays its assigned departments.

**Presentation constraints**: Retain the expansion state behavior, current fields, edit/cancel/save controls, delete constraints, empty/error states, and the division-to-department relationship.

### Department

**Purpose**: A department displayed in the departments table within its division.

**Existing information**: department code, name, short name, and in-charge value.

**Relationships**: A department can be assigned to a division through existing assignment behavior. Company details may expose the existing list of departments available for assignment.

**Presentation constraints**: Preserve current create, assign-existing, remove-assignment, empty-table, validation, and error behavior.

### List Item

**Purpose**: Configurable master-data record in List Item Master.

**Existing information**: list type, list code, description and second-language description, short description and second-language short description, value, active status, flexible values 01 and 02, and audit information.

**Presentation constraints**: Preserve immutable fields in edit mode, existing list filters/operators, active-status selection, sorting, pagination, history tooltip, validation, and all create/edit/delete outcomes.

## Existing View State

### Table state

- Filters and operators for currently filterable columns.
- Sort field and direction.
- Page number and page size.
- Company table column widths while resizing.
- Existing state encoded in the URL query parameters where currently supported.

No new preference persistence is introduced. Presentation changes must preserve the current table state transitions.

### Company form state

- Read-only view and editable company detail modes.
- Company add/setup steps: Basic details → Division → Department.
- Existing saving, loading, validation, and error states.

Changing view/edit presentation must not reset saved values or move fields between positions. Create/edit submissions and cancellation retain their current outcomes.

### Division and department state

- Expanded/collapsed division panels.
- Division edit state.
- New division dialog state.
- New department and existing-department assignment dialog state.
- Existing loading, validation, error, empty, and blocked-delete states.

Visual treatment may improve grouping and readability but must not alter available actions or transitions.

## Validation and Ownership

- Existing typed forms, validators, API validation responses, and generated API types remain the source of truth.
- The visual refresh does not add fields, change valid values, relax validation, or reinterpret status.
- Accessible names, semantic groupings, readable empty states, and focus states are presentation requirements, not additional business data.
