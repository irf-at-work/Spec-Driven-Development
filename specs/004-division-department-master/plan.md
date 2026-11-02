# Implementation Plan: Division and Department Master

**Branch**: `004-division-department-master` | **Date**: 2026-11-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-division-department-master/spec.md`

## Summary

Extend Company Master with a guided company, division, and department creation flow and show the resulting structure on the existing company details page. Reuse the current .NET 10 API, Oracle database-first mappings, Angular 21 application, generated API client, and existing test stack. The first implementation action is to scaffold the missing `STD_DIVISION` mapping without changing database objects. Reuse `STD_DEPARTMENT` as the per-company, per-division assignment record, treating a department code as the same logical department across its company's divisions.

## Technical Context

**Language/Version**: C#/.NET 10; TypeScript/Angular 21.

**Primary Dependencies**: Existing ASP.NET Core, EF Core 10 Oracle provider, Angular Material, generated OpenAPI client, xUnit, Playwright for .NET, and Vitest. No new packages are planned.

**Storage**: Existing Oracle 19c schema `IIRIS_RD_DEVP`; database-first tables `STD_COMPANY` and `STD_DEPARTMENT`; the `STD_DIVISION` mapping is not currently scaffolded.

**Testing**: xUnit for code-only API/service tests; Playwright for each user story with mocked API responses; Vitest for Angular behavior. Use the existing `scripts/test.ps1` test entry point. Do not connect test suites to Oracle or mutate database data.

**Target Platform**: Local web application.

**Project Type**: Angular frontend with .NET API.

**Performance Goals**: No new latency or throughput target is specified. Preserve the existing default list page size of 10 and avoid loading unrelated company records.

**Constraints**:

- The first implementation step MUST scaffold `STD_DIVISION`; do not begin feature API or UI work until its existing table mapping is available.
- Database-first generated files MUST NOT be hand-edited. Use partial extensions for application-specific additions.
- Scaffolding is read-only. Do not create or alter Oracle objects, or write application data, without the database owner's approval required by the constitution.
- If `STD_DIVISION` is not present or accessible, stop implementation and request direction from the database owner; do not infer a table definition or create it.
- The existing `STD_DEPARTMENT` key is `(DEPT_COMP_CODE, DEPT_DIVN_CODE, DEPT_CODE)`. Treat each row as an assignment for one division and `(DEPT_COMP_CODE, DEPT_CODE)` as the logical company-scoped department identity. Department creation for multiple divisions creates an assignment for each selected division; removing one assignment must preserve the others.
- Preserve the current company fields, form validation, API behavior, generated Angular client conventions, and other company details.
- API response types are declared through return types. Generate OpenAPI from the API and regenerate the Angular client from it; do not hand-author an OpenAPI document or client.
- Use typed reactive forms, standalone OnPush Angular components, signals, Angular Material, and accessible confirmation and popup interactions.
- Keep the UI visually consistent with existing Company Master list, form, and details screens: reuse their layout widths, surface/card treatment, colour and focus tokens, typography, spacing, responsive behavior, and Material button/form conventions; do not introduce a separate visual theme.
- All user-facing copy is British English. Use current audit conventions (`Admin` and UTC timestamps) when creating or updating master records.
- No dependencies or database migrations are planned.

## Constitution Check

### Pre-design gate

| Principle | Status | Plan application |
|---|---|---|
| Spec-first and testable acceptance criteria (Articles 1, 4) | PASS | The approved feature spec defines user journeys, acceptance scenarios, and measurable outcomes. |
| Simplicity and explainability (Articles 2, 3) | PASS | Extend existing Company Master screens and API; reuse existing forms, navigation, error patterns, and generated client. |
| Configuration and secret safety (Articles 6, 7) | PASS | Use configured connection names only; never expose or commit credentials. Validate all incoming values. |
| Errors and human control (Articles 8, 9) | PASS | Show actionable validation/API errors and require confirmation for destructive actions. |
| Scope and branch discipline (Article 10) | PASS | Limit changes to Company Master and division/department relationships. Do not change unrelated work or switch branches as part of planning. |
| Documentation stays current (Article 11) | PASS | Record the database-first and relationship decisions in the feature research and data-model documents. |
| Technology and dependency rules (B2, B4) | PASS | Use the existing pinned .NET, Oracle, Angular, testing, and OpenAPI generation stack; add no packages. |
| Testing and test-data safety (B5) | PASS | Cover services with xUnit and each story with mocked Playwright journeys plus Vitest; no test database access or data mutation. |
| API, database-first, and Angular rules (B6-B8) | PASS | Use controller/DTO patterns, generated entity mappings and partial extensions, typed generated API client, and the prescribed Angular patterns. |
| Database approval and single-owner workflow (B8, B10) | PASS WITH GATE | Reverse-engineering existing `STD_DIVISION` metadata is read-only. Any DDL or data changes require prior owner approval; no competing scaffold or script ownership is assumed. |

No constitutional exception is proposed. If read-only scaffolding reveals that `STD_DIVISION` is absent, the implementation must stop at that prerequisite and seek database-owner direction rather than create schema.

## Project Structure

### Documentation (this feature)

```text
specs/004-division-department-master/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── company-division-department-api.md
```

### Source Code (repository root)

```text
Spec-Driven-Development/
├── SDD.API/
│   ├── SDD.API/
│   │   ├── Controllers/                  # Company-scoped division/department operations
│   │   ├── Contracts/                    # Typed requests and responses
│   │   ├── Data/                         # Existing context plus database-first mappings
│   │   ├── Services/                     # Company structure validation and operations
│   │   └── Data/Entities/                 # Generated StdDivision and existing StdDepartment
│   ├── SDD.API.Tests/                    # Service and validation tests
│   └── SDD.API.E2E.Tests/                # Mocked API/UI user journeys
└── sdd-ui/
    └── src/app/pages/company-master/      # Guided add flow and company details cards
```

**Structure Decision**: Extend the existing API and Company Master UI only. Keep database-generated entity classes in their existing entity folder, API contracts and business rules in their existing folders, and tests in the existing test projects. The typed Angular client remains generated under `sdd-ui/src/app/api/generated`.

## Design Overview

1. **Scaffold gate first**: reverse-engineer only the existing `STD_DIVISION` table into an isolated scaffold output/context. Review its columns, key, company ownership, and constraints; integrate the generated entity/context mapping without editing generated files. Do this before any other feature code. Do not use a command that overwrites the existing context or unrelated generated entities.
2. **API**: add company-scoped endpoints and typed DTOs for listing and maintaining divisions, listing logical company departments, creating departments with one or more division assignments, linking existing departments to a division, and removing one assignment. Follow the existing controller/service/repository patterns and propagate `CancellationToken`.
3. **Department identity**: group division-specific `STD_DEPARTMENT` rows by company and department code for the existing-department selector. A department create or link creates only missing company/division/code assignments. Validate that one logical department's shared details remain consistent across its assignment rows; do not remove other assignments when deleting one.
4. **OpenAPI and client**: build the API and produce OpenAPI from its endpoint return types, then regenerate the Angular client using the existing npm script. Do not start UI contract implementation against hand-written client types.
5. **UI**: adapt the existing company add flow into Basic Details, Division, and Department steps with progress indication and bottom actions. Persist the current step on every Save, Save and Exit, and Save & Add next-step action before navigating; this is step-by-step persistence, not a deferred save at the end of the wizard. On failure, stay on the current step, retain its entered values where possible, and let the user retry. Reset clears only unsaved values on the current step. Add division cards and department tables to company details, including in-place division editing and department association popups.
6. **Validation and destructive actions**: validate company ownership, required fields and code uniqueness on the API as authority; retain client-side validation for usability. Confirm division and association removals, block deletion where unresolved relationships remain, and show actionable errors without success-shaped fallbacks.
7. **Verification**: add service unit tests, mocked Playwright journeys covering the user stories, and focused Vitest tests for form state, step navigation, cards, and association selection. Run the existing full validation entry point only after targeted tests pass.

## Constitution Check (post-design)

| Gate | Result | Evidence |
|---|---|---|
| Scope and requirements | PASS | Design covers only the three-step Company Master workflow and its division/department details view. |
| Database-first and safety | PASS WITH GATE | Scaffolding only reads existing metadata. No schema or data changes are included; missing table or schema changes require database-owner direction. |
| API and client generation | PASS | Controller/DTO/service patterns are reused; OpenAPI is produced from API definitions and the Angular client is generated from that output. |
| Angular conventions | PASS | Design reuses standalone OnPush components, signals, typed reactive forms, Angular Material, and built-in control flow. |
| Error handling and deletion control | PASS | Validation errors are explicit, deletions are confirmed, and relationship conflicts are reported. |
| Testing | PASS | xUnit, Playwright, and Vitest cover acceptance behavior without database-backed tests. |
| Dependencies and simplicity | PASS | No new package, database migration framework, or shared infrastructure layer is proposed. |
| Owner explainability | PASS | The quickstart gives runnable checks and expected user-visible results; technical terms are explained in the linked data model. |

No post-design constitutional exception is required.

## Complexity Tracking

No constitution violations or additional architecture layers are proposed.
