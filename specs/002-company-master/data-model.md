# Data Model: Company Master CRUD

## Company

The application reuses the database-first `StdCompany` mapping for `IIRIS_RD_DEVP.STD_COMPANY`. It must not edit the generated entity/context or add columns. Public request/response DTOs expose only the fields listed below; other database columns must be preserved when a company is updated.

| Public field | Existing column/property | Required | Maximum length / format |
|---|---|---:|---|
| `companyCode` | `COMP_CODE` / `CompCode` | Create only | 12 characters; primary key |
| `companyName` | `COMP_NAME` / `CompName` | Create only | 100 characters |
| `shortName` | `COMP_SHORT_NAME` / `CompShortName` | No | 30 characters; prefilled from first 30 name characters |
| `address1` | `COMP_ADDR1` / `CompAddr1` | No | 100 characters |
| `address2` | `COMP_ADDR2` / `CompAddr2` | No | 100 characters |
| `address3` | `COMP_ADDR3` / `CompAddr3` | No | 100 characters |
| `incorporationDate` | `COMP_INCORP_DT` / `CompIncorpDt` | No | Date-only value |
| `referenceNumber` | `COMP_REF_NO` / `CompRefNo` | No | 20 characters |
| `licenceIssueDate` | `COMP_LICENSE_ISS_DT` / `CompLicenseIssDt` | No | Date-only value |
| `licenceExpiryDate` | `COMP_LICENSE_EXP_DT` / `CompLicenseExpDt` | No | Date-only value |
| `companyInCharge` | `COMP_INCHARGE` / `CompIncharge` | No | 60 characters |
| `phone` | `COMP_PHONE` / `CompPhone` | No | 20 characters |
| `email` | `COMP_EMAIL` / `CompEmail` | No | 100 characters |
| `website` | `COMP_WEBSITE` / `CompWebsite` | No | 100 characters |
| `createdBy` | `COMP_CR_BY` / `CompCrBy` | System set | 12 characters; `Admin` |
| `createdAt` | `COMP_CR_DT` / `CompCrDt` | System set | UTC timestamp |
| `lastUpdatedBy` | `COMP_UP_BY` / `CompUpBy` | System set | 12 characters; `Admin` |
| `lastUpdatedAt` | `COMP_UP_DT` / `CompUpDt` | System set | UTC timestamp |

The assistant in-charge field is intentionally absent at the owner's direction. The second-language name and address fields, accounting fields, VAT fields, fax, mobile, active flag, and remarks are not part of this feature's public form.

## Relationships and deletion

- `STD_COMPANY.COMP_CODE` is the primary key.
- `STD_DEPARTMENT.DEPT_COMP_CODE` is a known company reference. A company with dependent records must not be deleted.
- Do not cascade deletion. Preserve any other database-enforced references; report a conflict if they block deletion.
- Concurrent valid updates use last-write-wins; do not require a concurrency token or reject an update solely because the company changed after it was loaded.

## Company list state

The list state consists of one-based page number, page size (default 10), sort field/direction, and optional per-column filters. The action column is not sortable or filterable. Store this state in route query parameters during navigation.

## Validation and display

- Code and name are required only on create and cannot be changed through update.
- Validate the field lengths above as values are entered and again at the API boundary.
- On create, prefill short name with the first 30 characters of company name; allow the user to edit it.
- Compose `primaryAddress` from non-empty address parts in their original order, separated by comma and space.
- Treat user-entered dates as date-only values; display dates as DD-MM-YYYY in GST per the project convention.
- Set audit identities to `Admin`; timestamps are UTC. Do not accept audit fields from client requests.
