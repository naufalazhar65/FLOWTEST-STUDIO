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
| Appium execution | Android/iOS runners, iOS simulator/physical-device discovery, XCUITest/WDA integration, execution controls, evidence, and recovery paths; real iOS device execution validated | Stable Android/iOS real-device operation and CI execution |
| Test suites | Sequential suite execution and history | Data-driven, retryable, CI-ready suites |
| Reports | Persisted, comparable reports with HTML/JSON/print export; project-scoped report loading fixed | CI-compatible reporting and richer evidence |
| AI | Local Ollama workflow, generated plans, validation, generic locator self-healing, and rerun recovery | Safe, reviewable, auditable AI assistance |
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
- iOS simulator discovery through Xcode `simctl`
- iOS physical-device discovery through Xcode `devicectl`
- WebDriverAgent build/test workflow validated for a physical iOS device
- Real-device iOS flow execution validated through Appium/XCUITest
- Execution timeline, pause/resume/stop control, node and edge status
- Screenshot/page-source failure evidence when a session is active

### Quality workflow

- Persistent project-scoped reports, analytics, comparison, and export
- Sequential test suites with per-case run history
- Python/pytest/Appium project generation with Monaco preview
- AI flow analysis, test-case generation, flow-plan generation, clarification, and validated modification plans
- Generic self-healing locator resolution across locator strategies and node types
- `tap` self-healing validated, including `accessibilityId`
- Self-healing rerun behavior restored
- Root-cause analysis distinguishes stale locators from wrong application state
- Focused self-healing tests and production build passing

---

## Milestone 1 — Reliable real-device execution

**Objective:** Make the execution experience dependable before expanding automation breadth.

**Why now:** The editor and execution engine are strong, but a test platform earns trust through reliable sessions on actual devices and emulators.

### Progress

- [x] Discover iOS simulators through Xcode tooling
- [x] Discover iOS physical devices through Xcode tooling
- [x] Display platform, OS version, UDID, connection, and emulator/physical state
- [x] Establish an iOS real-device Appium/XCUITest session
- [x] Validate the WebDriverAgent build/test workflow required by the physical device
- [x] Execute a FlowTest flow successfully on a real iOS device
- [x] Persist the resulting execution report under the active project
- [x] Restore generic self-healing and rerun behavior after locator failures

### Remaining scope

- [x] Discover Android devices/emulators through ADB
- [x] Establish an Android real-device Appium/UiAutomator2 session
- [x] Execute a FlowTest flow successfully on a real Android device
- [x] Persist and display execution evidence for a real Android-device run
- [x] Validate capabilities before session creation with actionable errors
- [x] Add connection/session retry for transient Appium failures
- [x] Capture optional video evidence where the driver supports it
- [x] Create an Android and iOS device compatibility matrix
- [ ] Add end-to-end smoke tests against maintained sample applications
- [x] Document the required iOS WebDriverAgent/Xcode setup for real devices

> Compatibility details are maintained in [docs/COMPATIBILITY.md](COMPATIBILITY.md).

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

### Progress

- [x] Generic locator self-healing works across locator strategies instead of being tied to a specific node type
- [x] `tap` self-healing works with `accessibilityId`
- [x] Candidate locators are verified against the active Appium session
- [x] Failure analysis distinguishes stale locator, invalid locator, timing, application-state, assertion, and session failures
- [x] Self-healing rerun behavior is restored and validated

### Remaining scope

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

**Current checkpoint:** M1 real-device reliability is complete. iOS simulator, iOS physical-device discovery, Android device/emulator discovery, Android real-device Appium execution, capability validation, connection/session retry, optional video evidence, the initial Android/iOS compatibility matrix, maintained E2E smoke coverage, and real-device WebDriverAgent/Xcode documentation are working and documented.

**Current AI checkpoint:** Generic locator self-healing is operational. The next AI work is governance, traceability, approval, and measurement rather than locator-specific special cases.



## Backlog candidates

These are valuable but should be prioritized only after the milestone dependencies are met:

- Visual locator recorder
- Accessibility-focused checks and reporting
- Additional code generators such as WebdriverIO/TypeScript or Java
- Test scheduling, notifications, and webhook integrations
- Plugin marketplace and custom node SDK
- Dashboard-level quality metrics across projects
