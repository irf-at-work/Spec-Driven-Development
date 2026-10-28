
# Broker Insurance Constitution

**Version:** 1.0.1 | **Ratified:** 2026-10-28 | **Last amended:** 2026-10-28
**Based on template:** v1.1.0

> This constitution sets the non-negotiable rules for this project. Every
> specification, plan, task list and line of code must comply with it.
> Part A is the universal core, reused across all projects. Part B holds the
> rules specific to this project. Where they conflict, Part B wins only if
> the conflict is recorded under Part C (Governance).
>
> Keywords: **MUST** = mandatory; **SHOULD** = expected unless a reason is
> written down; **MAY** = optional.

---

## PART A — UNIVERSAL CORE

### Article 1 — Specification first

- Every change MUST start from a written specification that states *what* is
  needed and *why*, before any technical decision is made.
- Specifications MUST describe user needs and outcomes, not technology.
- Each user story MUST have acceptance criteria a non-developer can check
  ("Given… when… then…").
- Anything unclear MUST be marked `[NEEDS CLARIFICATION]` rather than guessed.
- When requirements change, the spec MUST be updated first, then the plan,
  then the code — never the other way round.

*Why: the spec is the source of truth; code that drifts from it cannot be
reviewed by the project owner.*

### Article 2 — Simplicity

- The simplest design that meets the spec MUST be chosen. Every extra
  component, library or layer MUST be justified in the plan in plain English.
- No speculative features ("we might need this later").
- Prefer well-established, widely used tools over new or niche ones.
- Each module SHOULD do one job, with a name that says what that job is.

*Why: the owner must be able to understand and maintain what is built.*

### Article 3 — Explainability for a non-developer owner

- Every plan MUST include a plain-English summary of how the system works.
- Technical terms MUST be explained the first time they appear in any
  document meant for the owner.
- After each phase of work, the owner MUST be given step-by-step
  instructions to see the result working.

*Why: the owner approves the work and cannot approve what they cannot follow.*

### Article 4 — Testing

- Every feature MUST have automated tests that prove its acceptance
  criteria are met.
- Tests SHOULD be written before or alongside the code, never as an afterthought.
- All tests MUST pass before work is considered done or committed.
- Bugs MUST be fixed by first writing a test that reproduces them.
- Tests MUST run with a single, documented command.

*Why: tests are how a non-developer owner knows the system still works after
every change.*

### Article 5 — Code quality standards

- Code MUST follow the standard style conventions of its language and be
  checked by an automatic formatter and linter.
- Names of files, functions and variables MUST be descriptive; no
  abbreviations that need decoding.
- Each function SHOULD be short enough to read on one screen.
- Comments MUST explain *why*, not restate *what* the code does.
- No duplicated logic: shared behaviour lives in one place.
- No dead code, commented-out code or unused files in committed work.

### Article 6 — Configuration over code

- Settings that the owner may want to change (limits, schedules, thresholds,
  addresses, workflow rules) MUST live in readable configuration files, not
  inside code.
- Every configuration option MUST have a documented default and a one-line
  explanation.
- The system MUST check configuration at start-up and give a clear error
  message if something is missing or wrong.

### Article 7 — Security and privacy

- Secrets (passwords, API keys, tokens) MUST NEVER appear in code, logs,
  documents or version history. They MUST be loaded from environment
  variables or a secrets file that is excluded from version control.
- An example settings file with placeholder values MUST be provided.
- Personal data MUST be collected only when the spec requires it, and stored
  only as long as needed.
- All inputs from outside the system (users, files, other systems, AI output)
  MUST be validated before use.
- Third-party libraries MUST be from reputable sources and pinned to
  specific versions.

### Article 8 — Errors, logging and observability

- Errors MUST never fail silently. Each error MUST be logged with enough
  context to understand what happened.
- Messages shown to the owner MUST be in plain English and say what to do next.
- Logs MUST record significant actions with a timestamp, and MUST NOT
  contain secrets or unnecessary personal data.
- The system SHOULD make its own health visible (is it running, what is it
  doing, what has failed).

### Article 9 — Human control

- Actions that are irreversible, costly, or affect people outside the system
  (sending messages, deleting data, spending money, publishing) MUST require
  explicit owner approval unless the spec says otherwise.
- Where the system is unsure, it MUST stop and ask rather than guess.
- Every automated decision SHOULD be traceable to the rule or input that
  caused it.

### Article 10 — Version control and change discipline

- Work MUST be committed to Git in small, working steps, each with a clear
  message describing what changed and why.
- Each feature SHOULD be developed on its own branch and merged only when
  its tests pass.
- The main branch MUST always be in a working state.
- Changes outside the scope of the current task MUST NOT be slipped in;
  they are raised as separate items.

### Article 11 — Documentation stays current

- Significant technical decisions MUST be recorded briefly (decision, options
  considered, reason) in `docs/decisions/`.

---

## PART B — PROJECT-SPECIFIC RULES

### B1 — Project purpose

- The system is an MVP for Insurance Brokers to use
- It will only have Master tables and their respective CRUD operations in this stage

### B2 — Technology constraints

- Backend: .Net 10 (C#)
- Frontend: Angular 21
- Database: Oracle 19c
- Testing: Playwright for end-to-end tests, and XUnit for API tests 
- Hosting: Local machine only
- Secrets: Operating system credential store or environment variables; never in code or the database 

### B3 — Domain rules

- British/Indian English in all text users read.
- Dates and times in Gulf Standard Time (GST), shown as DD-MMM-YYYY.
- Money in AED


### B4 — Approved Dependencies and Safe Data
- Always ask for confirmation before adding, updating, or removing a frontend or backend package or library. 
- A proposal MUST explain its purpose, why the standard library or existing dependencies are insufficient, and its license. 
- Never commit secrets; use user-secrets or environment variables.
- Money MUST use `decimal` in C# and `NUMBER(p,s)` in Oracle, with the currency explicit.

### B5 — Tested, Reliable Changes
- New behavior MUST have unit tests. A task is complete only when the build and all tests
pass. Backend asynchronous operations MUST accept and propagate `CancellationToken`.

### B6 — Consistent, Secure API
- Use controllers, DTOs, and authorization by default.
- Every non-success response MUST use `ProblemDetails`; exceptions
MUST be handled globally, with no stack traces returned to clients.

### B7 — Typed, Generated Angular UI
- The OpenAPI specification is the source of truth: generate the Angular API client and
never hand-write or edit it. 
- Keep strict typing and templates enabled; do not use `any`, non-null assertions, or casts to silence the compiler. Use generated API types
without duplicating models.

## B8 — Technical Constraints

- The application consists of a .NET 10 API, an Angular 21 UI, and an Oracle database.
- Use `Oracle.EntityFrameworkCore` with Database-First: do not edit scaffolded files or use EF migrations.
- Database changes SHOULD be made to the tables and then scaffolded. 
- Extend scaffolded entities with partial classes. 
- Ask for confirmation before any database change, including DDL and inserts, updates, or
deletes.

- Listing endpoints MUST return the shared `PaginatedResult<T>` with `items`, `page`,
`pageSize`, and `totalCount`; the default page size is 10.
- Declare API response shapes through return types. 
- Do not add `[ProducesResponseType]`, `[Produces]`, `[Consumes]`, Swagger attributes, or XML documentation comments to controllers or actions. 
- If a response shape cannot be expressed through the return type, ask before introducing an attribute-based workaround.

- Angular components MUST be standalone, use `OnPush`, signals, `inject()`, signal-based
`input()` and `output()`, and built-in `@if`/`@for` control flow with `track`.
-  Use the generated types for API data. Do not duplicate models by hand.
- Use typed reactive forms, with client validation for user experience and the API as
the authority. 
- Angular Material is the primary UI library. 
- Handle HTTP errors in one global interceptor; do not swallow errors or show raw server messages. 
- Do not use `innerHTML` or `bypassSecurityTrust*`.


### B9 — Out of scope

- Authentication does not need to be handled

---

## PART C — GOVERNANCE

### C1 — Authority

- This constitution overrides all other project guidance, templates and
  habits. Plans and task lists MUST include a check confirming compliance.

### C2 — Amendments

- Amendments are made with `/speckit.constitution`, stating the change and
  the reason.
- Every amendment MUST update the version number:
  - **MAJOR** (2.0.0) — a principle is removed or changed in a way that
    breaks existing work.
  - **MINOR** (1.1.0) — a new principle or section is added.
  - **PATCH** (1.0.1) — wording clarified, no change in meaning.
- After an amendment, existing specs, plans and templates MUST be checked
  for conflicts, and any affected items listed in the amendment log.

### C3 — Exceptions

- A project may depart from a Part A rule only by writing the exception
  here, with the reason and the date. Unwritten exceptions do not exist.

| Date | Article | Exception | Reason |
| ---- | ------- | --------- | ------ |
|      |         |           |        |

### C4 — Amendment log

| Version | Date       | Change                                              | Reason |
| ------- | ---------- | ----------------------------------------------------| ------ |
| 1.0.0   | 2026-10-28 | Initial ratification from template v1.1.0           | —      |
| 1.0.1   | 2026-10-28 | Angular and Oracle Version updated  (Manual change) | —      |
