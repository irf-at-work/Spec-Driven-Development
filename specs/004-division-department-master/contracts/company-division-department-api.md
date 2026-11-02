# Company Division and Department API Contract

This document records the intended behavior and resource boundaries for the feature. The executable API contract remains the OpenAPI document generated from the implemented API; do not hand-author an OpenAPI file or Angular client.

## Resource scope

All division and department operations are company-scoped. A division cannot be read or changed through another company. A department is identified within a company by its department code, and its assignments are identified by division code.

## Operations

| Operation | Request | Successful result | Important failures |
|---|---|---|---|
| List company divisions | Company code | Divisions with mapped details | Company not found |
| Create divisions | Company code and one or more division detail objects | Saved division records | Validation errors; company not found; duplicate division key |
| Update division | Company code, division code, editable division details | Updated division | Validation errors; division not found |
| Delete division | Company code and division code after UI confirmation | No-content result | Division not found; conflict while department assignments remain |
| List company departments | Company code | Distinct logical departments and their division assignments | Company not found |
| Create department assignments | Company code, department detail object, one or more division codes | Department with saved assignments | Validation errors; invalid/foreign division; conflicting logical department details |
| Link existing department | Company code, division code, selected department code(s) | Newly created assignment(s) | Invalid department; duplicate assignment; invalid division |
| Remove one department assignment | Company code, division code, department code after UI confirmation | No-content result | Assignment not found; conflict if this is the department's final assignment |

## Behavior requirements

- Request and response shapes are declared as API DTO types and published through generated OpenAPI.
- Validation errors use the existing typed field-validation response pattern; not-found and relationship conflicts use the existing problem response pattern.
- List operations do not expose generated database entities directly.
- Every asynchronous operation accepts and propagates cancellation.
- Audit identities use `Admin`; timestamps use UTC where the existing table provides audit columns.
- API errors must not be converted to success-shaped responses.

## UI interaction contract

- The creation flow shows Basic Details, Division, and Department, with the current step identified.
- Each Save, Save and Exit, or Save & Add next-step action persists the current step before navigation; saving is not deferred until the wizard is complete.
- On a failed save, remain on the current step, show an actionable error, preserve entered values where possible, and allow retry. Earlier successful step saves remain persisted.
- Reset clears unsaved state for the current step only and does not undo previously persisted data.
- Division cards expose collapse and confirmed delete actions. Details cards also expose in-place edit.
- The department selection popup includes only logical departments for the current company and prevents duplicate assignment.
- Department removal deletes one division assignment only; it does not delete the department's remaining assignments.
