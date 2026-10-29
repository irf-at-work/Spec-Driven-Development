# Research: Premium Adjustment Master

## Decisions

### Decision: Package approvals required before implementation

**Decision**: The following packages require owner approval before any installation or update:

| Package | Purpose | Why existing platform/dependencies are insufficient | Version | License | Approval Required |
|---------|---------|------------------------------------------------------|---------|---------|-------------------|
| Oracle.EntityFrameworkCore | Oracle 19c access and Database-First provider | .NET built-in data providers do not supply the constitution-required Oracle EF Core provider or reverse scaffolding integration. | 10.23.26400 | Oracle Free Distribution, Hosting, and Use Terms | Yes |
| Microsoft.EntityFrameworkCore.Design | EF design-time scaffolding support | Required by EF Core tooling to reverse-engineer the approved Oracle schema; not present in the API project. | 10.0.14 | MIT | Yes |
| dotnet-ef | Command-line schema scaffolding tool | The SDK has no built-in command to scaffold EF Core entities from the approved Oracle schema. | 10.0.14 | MIT | Yes |
| @angular/material / @angular/cdk | UI components and interaction primitives per constitution B8 | Native controls alone do not satisfy the mandated Angular Material UI library; CDK is its accessible interaction foundation. | 21.2.0 | MIT | Yes |
| NSwag.MSBuild | Generate the typed Angular API client from OpenAPI | ASP.NET Core emits OpenAPI but does not generate a TypeScript client; handwritten API types violate constitution B7. | 14.7.1 | MIT | Yes |
| xunit.v3 | API unit/integration tests per constitution B2/B5 | No API test framework or test project exists in the repository. | 4.0.2 | Apache-2.0 | Yes |
| Microsoft.NET.Test.Sdk | Discover and run .NET tests | The API solution has no test runner integration or test project. | 18.11.0 | MIT | Yes |
| Microsoft.AspNetCore.Mvc.Testing | Host the real API for integration tests | No existing test host is configured; a real in-memory ASP.NET Core test host validates routing and middleware without replacing the API with mocks. | 10.0.14 | MIT | Yes |
| @playwright/test | Browser end-to-end testing per constitution B2 | No browser E2E tooling exists; unit tests cannot prove the broker workflows across UI and API. | 1.64.1 | Apache-2.0 | Yes |

**Rationale**: Constitution B4 requires owner approval before adding, updating, or removing any frontend or backend package. Each proposal must explain purpose, why standard library or existing dependencies are insufficient, and its license.

**Alternatives considered**: Reusing existing dependencies is not possible for these capabilities because the relevant providers, generators, and test runners are absent. The Oracle EF provider is also explicitly mandated by the constitution. Package additions remain proposals, not authorization to install.

---

### Decision: Angular version alignment

**Decision**: The constitution (B2) requires Angular 21, but the current UI project declares Angular 22.2 and TypeScript 6.0. Alignment requires owner approval under B4.

**Rationale**: Constitution B2 is a non-negotiable technology constraint. The UI project must be aligned to Angular 21 with a compatible TypeScript version before implementation.

**Alternatives considered**: None — the constitution requirement is explicit and non-negotiable.

---

### Decision: Oracle schema confirmation

**Decision**: Before any implementation, confirm the approved Oracle 19c schema contains:
- The adjustment code master table
- Four standard-list tables (Code Type, Discount Type, Charges Type, Charges Category)
- Connection access credentials

**Rationale**: Constitution B8 requires database changes to be made to tables and then scaffolded; no EF migrations; no schema or data changes without owner approval. Do not invent schema.

**Alternatives considered**: None — schema inspection is a prerequisite gate.

---

### Decision: Test runner setup

**Decision**: A single test runner (`test-all.ps1`) must execute API unit/integration tests, Angular tests, Playwright end-to-end tests, and production builds. The repository currently has no API test project or Playwright setup.

**Rationale**: Constitution Article 4 requires tests to run with a single, documented command.

**Alternatives considered**: None — single runner is constitutionally required.

---

## Open Items (gated on owner approval)

1. Package installation/updates listed above
2. Angular 21 alignment of the UI project
3. Oracle 19c schema inspection and connection access
4. Test project and Playwright setup

No implementation, package change, or database access was performed during this research phase.