# FlowTest Studio Roadmap

> A phased product plan for evolving FlowTest Studio from a capable local visual editor into a reliable mobile test-automation platform for QA teams.

**Status:** Active  
**Planning horizon:** Next 12 months  
**Principle:** Reliability before scale; transparency before automation.

## Product direction

FlowTest Studio should let a QA engineer complete the mobile automation loop in one place:

```text
Design → Inspect → Validate → Execute → Diagnose → Improve → Deliver
```

The next stages therefore focus first on dependable execution and CI adoption, then on scale, governance, and collaboration.

## How to read this roadmap

- **Completed** describes capabilities present in the codebase today.
- **Now** is the recommended next release focus.
- **Next** follows when the preceding milestone meets its exit criteria.
- Later milestones are directional; their scope can change with user feedback and technical findings.

## Product status

| Area | Current state | Next outcome |
| --- | --- | --- |
| Visual authoring | Mature local flow editor with a plugin-based node system | Faster reuse and maintainable flow versioning |
| Appium execution | Android/iOS runners, execution controls, evidence, and recovery paths | Stable operation on detected real devices |
| Test suites | Sequential suite execution and history | Data-driven, retryable, CI-ready suites |
| Reports | Persisted, comparable reports with HTML/JSON/print export | CI-compatible reporting and richer evidence |
| AI | Local Ollama workflow, generated plans, validation, and self-healing | Safe, reviewable, auditable AI assistance |
| Collaboration | Local-first project persistence | Versioning, sharing, and team workflow |

---

## Completed foundation

These capabilities form the current baseline and should be preserved as future work is added.

### Visual automation workspace

- Visual React Flow canvas with node plugin registry
- 38 registered automation, getter, logic, and variable nodes
- Node insertion, duplication, copy/paste, undo/redo, breakpoints, and validation
- Runtime variable and expression resolution
- Android, iOS, and cross-platform project creation

### Appium runtime and inspection

- Android UiAutomator2 and iOS XCUITest capability support
- Appium client, driver factory, element service, and gesture service
- Page-source inspection, element tree, locator candidates, locator testing, and add-to-flow workflow
- Execution timeline, pause/resume/stop control, node and edge status
- Screenshot/page-source failure evidence when a session is active

### Quality workflow

- Persistent project-scoped reports, analytics, comparison, and export
- Sequential test suites with per-case run history
- Python/pytest/Appium project generation with Monaco preview
- AI flow analysis, test-case generation, flow-plan generation, clarification, and validated modification plans
- Deterministic self-healing for supported locator, timing, and application-state failures

---

## Milestone 1 — Reliable real-device execution

**Objective:** Make the execution experience dependable before expanding automation breadth.

**Why now:** The editor and execution engine are strong, but a test platform earns trust through reliable sessions on actual devices and emulators.

### Scope

- [ ] Discover Android devices/emulators through ADB
- [ ] Discover iOS simulators/devices through Xcode tooling
- [ ] Display live platform, OS version, UDID, connection, and busy state
- [ ] Validate capabilities before session creation with actionable errors
- [ ] Add connection/session retry for transient Appium failures
- [ ] Capture optional video evidence where the driver supports it
- [ ] Create an Android and iOS device compatibility matrix
- [ ] Add end-to-end smoke tests against maintained sample applications

### Exit criteria

- A user can choose a detected Android or iOS target without manually copying its UDID.
- Connection failures describe the cause and recommended correction.
- A maintained smoke suite runs repeatedly on supported sample targets with a documented reliability target.
- Device/session evidence is attached to a failed execution when available.

---

## Milestone 2 — CI-ready suite runner

**Objective:** Allow teams to run FlowTest projects in continuous integration without opening the browser UI.

**Why now:** This is the bridge from a useful visual authoring tool to a tool used in daily regression delivery.

### Scope

- [ ] Build a headless CLI runner for a project or test suite
- [ ] Add machine-readable exit codes and concise terminal output
- [ ] Export JUnit XML alongside the existing HTML/JSON reports
- [ ] Support configuration through environment variables
- [ ] Add reusable CI templates for GitHub Actions first
- [ ] Document Appium, emulator/simulator, and secret setup for CI
- [ ] Publish execution artifacts: logs, screenshots, page source, and reports

### Exit criteria

- A suite can be run from a clean CI environment with one command.
- Failed runs mark the pipeline failed and provide a JUnit-compatible result.
- A reference GitHub Actions workflow runs a sample Android test and uploads evidence.

---

## Milestone 3 — Test data and execution resilience

**Objective:** Reduce flaky tests and let one flow cover meaningful data variations safely.

### Scope

- [ ] Define named environments: local, development, staging, and production
- [ ] Add environment-specific variables and capability profiles
- [ ] Load test data from JSON and CSV
- [ ] Add parameterized suite runs and data-set selection
- [ ] Implement retry policies at node and test-case level
- [ ] Retry only eligible transient failures; do not mask assertion failures
- [ ] Identify and report flaky tests separately from deterministic failures
- [ ] Redact secrets and personally identifiable data in logs, reports, and AI context

### Exit criteria

- The same flow can run against at least two environments without editing nodes.
- A suite can execute with a selected data set and clearly attribute each result to its data row.
- Retry behavior is visible in reports and cannot silently convert a genuine assertion failure into a pass.

---

## Milestone 4 — Faster regression at scale

**Objective:** Reduce regression duration without compromising evidence or result isolation.

### Scope

- [ ] Parallelize independent suite test cases across isolated devices/sessions
- [ ] Add resource-aware scheduling and concurrency limits
- [ ] Keep reports, artifacts, variables, and Appium sessions isolated per worker
- [ ] Add queue visibility and cancellation controls
- [ ] Introduce cloud-device provider adapters behind a provider interface
- [ ] Track duration trends to identify slow scenarios

### Exit criteria

- Users can configure parallelism with a safe default.
- Parallel results remain deterministic and project-scoped.
- A suite report clearly identifies the target device and artifacts for every test case.

---

## Milestone 5 — Trustworthy AI automation

**Objective:** Ensure AI accelerates maintenance without making unreviewable or unsafe flow changes.

### Scope

- [ ] Display a node/edge diff before applying an AI change
- [ ] Require explicit approval for auto-healing configuration changes
- [ ] Store AI request, rationale, confidence, plan, outcome, and rollback reference
- [ ] Add per-project AI settings and allowed-operation policies
- [ ] Improve ambiguity handling with interactive clarification
- [ ] Keep secret-redaction rules active in every AI context
- [ ] Measure healing success, rerun success, and rejected recommendations

### Exit criteria

- Every AI-applied change can be reviewed, traced, and undone.
- A user can disable or restrict automatic repair at project level.
- AI-generated plans never bypass the existing structural and action-specific validation layer.

---

## Milestone 6 — Team-ready project management

**Objective:** Let multiple QA engineers maintain the same automation assets safely.

### Scope

- [ ] Introduce a stable, human-reviewable project/flow file format
- [ ] Add flow revision history, comparison, and restore
- [ ] Provide Git-friendly import/export workflows
- [ ] Add shared project storage abstraction
- [ ] Add comments or review requests on flow changes
- [ ] Define role and access-control requirements before implementing collaboration
- [ ] Extend generator output and add ZIP project export

### Exit criteria

- A team can review and restore flow changes without losing execution history.
- Project files can be versioned meaningfully in source control.
- Generated automation output can be downloaded as a complete project artifact.

---

## Cross-cutting standards

Every milestone must satisfy these requirements before it is considered complete:

| Area | Definition of done |
| --- | --- |
| Quality | Relevant unit/integration tests are added or updated; `npm run test:run` passes. |
| Build | `npm run build` passes without TypeScript errors. |
| UX | Loading, empty, permission-denied, and failure states are designed and tested. |
| Evidence | User-visible failures include a clear message and retain available diagnostic context. |
| Security | Secrets are not persisted in plain text or exposed in logs, reports, exports, or AI prompts. |
| Documentation | README and relevant docs describe the capability, setup, and current limitations. |

## Suggested delivery order

```text
M1 Real-device reliability
        ↓
M2 CLI + CI reporting
        ↓
M3 Test data + resilience
        ↓
M4 Parallel execution
        ↓
M5 AI governance
        ↓
M6 Collaboration + versioning
```

This ordering is deliberate: CI adoption should not precede dependable runtime behavior, and autonomous AI or collaboration should not precede traceable project changes.

## Backlog candidates

These are valuable but should be prioritized only after the milestone dependencies are met:

- Visual locator recorder
- Accessibility-focused checks and reporting
- Additional code generators such as WebdriverIO/TypeScript or Java
- Test scheduling, notifications, and webhook integrations
- Plugin marketplace and custom node SDK
- Dashboard-level quality metrics across projects
