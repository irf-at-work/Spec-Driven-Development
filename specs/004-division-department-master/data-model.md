# Data Model: Division and Department Master

## Company

Reuse the database-first `StdCompany` mapping and existing company API. The company code remains the owner key for all divisions and departments in this feature. Existing company fields and update behavior are unchanged.

## Division

The division record is the existing Oracle `STD_DIVISION` row, to be reverse-engineered before feature code is started. Its generated mapping is the authority for the division key, company reference, field names, limits, and required values; do not invent columns or edit generated files.

| Logical field | Source |
|---|---|
| Division identifier | Primary key from the generated `StdDivision` mapping |
| Company identifier | Company reference from the generated mapping |
| Division details | Remaining mapped columns from the generated mapping |
| Audit fields | Existing table audit columns, if present; set creator/updater to `Admin` and timestamps to UTC when supported |

**Relationship**: Each division belongs to one company. A company can have multiple divisions. Division identifiers are unique within the scope defined by the database key.

**Validation**: Follow database nullability and length constraints obtained by scaffolding; reject divisions whose company does not exist. The exact field-level rules are not guessed in this design.

## Department assignment

Reuse the database-first `StdDepartment` mapping for `STD_DEPARTMENT`.

| Property | Existing column/property | Meaning |
|---|---|---|
| Company identifier | `DEPT_COMP_CODE` / `DeptCompCode` | Company scope |
| Division identifier | `DEPT_DIVN_CODE` / `DeptDivnCode` | Division receiving this assignment |
| Department identifier | `DEPT_CODE` / `DeptCode` | Company-scoped logical department code |
| Department name | `DEPT_NAME` / `DeptName` | User-facing department name |
| Short name | `DEPT_SHORT_NAME` / `DeptShortName` | Optional short display name |
| Localised name | `DEPT_NAME_L2` / `DeptNameL2` | Optional second-language name |
| Localised short name | `DEPT_SHORT_NAME_L2` / `DeptShortNameL2` | Optional second-language short name |
| In-charge | `DEPT_INCHARGE` / `DeptIncharge` | Optional department in-charge |
| Localised in-charge | `DEPT_INCHARGE_L2` / `DeptInchargeL2` | Optional second-language in-charge |
| Remarks | `DEPT_REMARKS` / `DeptRemarks` | Optional remarks |
| Active flag | `DEPT_ACTIVE_YN` / `DeptActiveYn` | Existing active state |
| Audit fields | `DEPT_CR_BY`, `DEPT_CR_DT`, `DEPT_UP_BY`, `DEPT_UP_DT` | Existing creator/updater audit values |

The current primary key is `(DeptCompCode, DeptDivnCode, DeptCode)`. This plan treats `(DeptCompCode, DeptCode)` as the logical company-scoped department identity and a row with one `DeptDivnCode` as that department's assignment to one division. Do not collapse distinct assignments into one record or delete other division rows when removing a single assignment.

**Validation and consistency**:

- The company and every selected division must exist, and each division must belong to the same company.
- A department assignment requires non-empty company, division, and department codes as required by the existing key.
- Adding a department to several divisions creates one assignment row per selected division.
- Adding an existing department creates only missing target assignments; an assignment already present is reported without creating a duplicate.
- When rows with the same company and department code exist for multiple divisions, their shared descriptive fields must be consistent. Surface conflicts instead of silently choosing a row.
- Removing the final division assignment is blocked. Removing an assignment from one division leaves other assignments intact.
- Existing column sizes and nullability in `StdDepartment`/Oracle are authoritative; no additional database constraint is assumed.

## Relationships and lifecycle

```text
Company (1) ─── (many) Division
Company (1) ─── (many) Department assignment rows
Division (1) ─── (many) Department assignment rows
Logical Department (company + department code) ─── (many) Division assignment rows
```

- Creation starts with the existing company save, then saves divisions, then saves department assignments.
- Each step's Save or save-and-navigation action persists that step immediately; data is not held until all three steps are complete. A failed current-step save leaves the user on that step with entered values available for retry, while earlier successfully saved steps remain persisted.
- Division setup may be saved before departments; this permits the requested Save and Exit path.
- Department association removal affects one assignment only.
- A division with department assignments cannot be deleted until those assignments have been resolved.
- Company deletion and existing company lifecycle behavior remain unchanged by this feature.
