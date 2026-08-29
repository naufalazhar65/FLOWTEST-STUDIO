<div align="center">
  <img src="src/assets/hero.png" alt="FlowTest Studio" width="180" />

  <h1>FlowTest Studio</h1>

  <p><strong>Visual Mobile Automation Testing Studio</strong></p>

  <p>
    <a href="https://github.com/naufalazhar65/FlowTest-Studio">
      <img src="https://img.shields.io/badge/Platform-Android%20%26%20iOS-7C3AED?style=flat-square" alt="Platforms: Android and iOS" />
    </a>
    <img src="https://img.shields.io/badge/Automation-Appium-00A6A6?style=flat-square" alt="Automation: Appium" />
    <img src="https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-149ECA?style=flat-square" alt="Frontend: React and TypeScript" />
    <img src="https://img.shields.io/badge/AI-Ollama-111827?style=flat-square" alt="AI: Ollama" />
  </p>

  <p>
    <a href="#getting-started">Get started</a>
    ·
    <a href="#capabilities">Explore capabilities</a>
    ·
    <a href="#current-limitations">Current limitations</a>
  </p>
</div>

<br />

> **Design flows. Inspect elements. Run with confidence.**
>
> FlowTest Studio enables QA engineers to build Android and iOS automation as visual workflows rather than maintaining every scenario as handwritten code. It unifies flow authoring, Appium inspection, execution, evidence, reporting, test suites, AI-assisted authoring, and Python project generation in one browser-based workspace.

## Table of contents

- [What it does](#what-it-does)
- [Core workflow](#core-workflow)
- [Capabilities](#capabilities)
- [Supported flow nodes](#supported-flow-nodes)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [AI service](#ai-service)
- [Commands](#commands)
- [Current limitations](#current-limitations)
- [Testing](#testing)
- [Technology](#technology)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## ✨ What it does

FlowTest Studio is designed for the end-to-end mobile QA workflow:

```text
Create project → Design flow → Inspect app → Validate → Execute with Appium
                                                   │
                                                   ▼
                                  Capture evidence → Review report → Export or generate code
```

It supports Android through UiAutomator2 and iOS through XCUITest, using Appium as its execution and inspection runtime.

| 🎨 Visual-first | 📱 Appium-native | 🧠 QA-aware |
| --- | --- | --- |
| Compose test scenarios as connected, editable flow nodes. | Inspect and automate Android or iOS application sessions. | Use reports, suites, validated AI plans, and deterministic recovery. |

## 🔄 Core workflow

```text
Launch App
    │
    ▼
Tap Login
    │
    ▼
Input credentials
    │
    ▼
Tap Submit
    │
    ▼
Assert Dashboard
```

1. Create or open a flow project.
2. Add nodes to the visual canvas and connect their execution path.
3. Use the Element Inspector to examine the target app and add tested locators.
4. Validate the flow before execution.
5. Run the flow against an Android or iOS Appium session.
6. Review execution state, logs, screenshots, page source, and the persisted report.

## 🧩 Capabilities

### 🎨 Visual Flow Designer

The visual editor is the core authoring surface for automation flows.

- Drag-and-drop, zoom, pan, multi-select, and canvas navigation
- Plugin-based node catalog with typed fields and platform metadata
- Smart node connections and insert-node-on-edge actions
- Node inspector, node duplication, copy/paste, and undo/redo history
- Breakpoints and real-time node/edge execution status
- Runtime variables and expression resolution
- Pre-run flow and node validation

### ⚙️ Appium Execution Engine

The execution engine traverses the graph, resolves variables, invokes node runners, and records execution state.

- Graph traversal with conditional branches and repeat support
- Pause, resume, stop, and breakpoint handling
- Android and iOS capability configuration
- Separate Android and iOS driver implementations
- Appium session lifecycle and application-state recovery
- iOS simulator and physical-device discovery through Xcode tooling
- Android device and emulator discovery through ADB
- Android real-device Appium/UiAutomator2 session support
- Real-device Android flow execution validated through Appium
- WebDriverAgent/XCUITest workflow for real iOS devices
- Real-device iOS flow execution validated through Appium
- Optional screen recording from the execution Toolbar for supported Appium targets
- Screen recording validated on iOS Simulator, iOS physical device, and Android real device
- Execution timeline, node result history, and structured execution logs
- Screenshot and page-source capture for failed nodes when a session is available

### 🔍 Element Inspector and Locator Tools

The inspector uses the current Appium session to turn the application UI into reusable flow locators.

- Retrieve and parse page source into an element tree
- Inspect element properties and attributes
- Generate locator candidates and test them against the session
- Copy a locator or add it directly to a flow node
- Verify generated candidates against the active Appium session
- Generic AI locator resolution across supported locator strategies
- Self-healing support for failed interaction locators, including `tap` and `accessibilityId`

| Android strategies | iOS strategies |
| --- | --- |
| Accessibility ID | Accessibility ID |
| Resource ID | Class Name |
| Class Name | iOS Predicate |
| XPath | iOS Class Chain |
| Android UiAutomator | XPath |

### 📊 Reports and Evidence

Completed runs are stored per project and can be reviewed after execution.

- Passed, failed, and stopped run tracking
- Environment and Appium capability information
- Node execution results, duration, and errors
- Logs, screenshot evidence, page-source evidence, and optional video recording evidence
- Video recording is opt-in and disabled by default to avoid unnecessary storage usage
- Report analytics, execution trends, and comparison view
- HTML and JSON download exports
- Print-oriented PDF export through the browser print dialog

### 🧪 Test Suites

Group flow projects into reusable test suites.

- Add, edit, delete, and search suites
- Include or disable individual test cases
- Run enabled cases sequentially
- Stop a suite and retain per-test-case run results and history

### 📁 Project Workspace

Projects have a dedicated lifecycle rather than being only an in-memory flow.

- Create Android, iOS, or cross-platform projects
- Open, save, save as, download, and close project files
- Restore active and recent projects
- Persist project metadata and file handles using browser storage APIs
- Scope reports and suites to the active project

### 🐍 Python Project Generator

Generate a Python/pytest/Appium project from a visual flow.

- Structured emitters for actions, locators, getters, and device operations
- Generated framework, pages, tests, driver, variables, waits, and pytest configuration
- File explorer and multi-tab Monaco code preview
- Copy or download generated code and project files

### 🤖 AI Assistant and QA Intelligence

The optional local AI service uses the current flow and selected node as context. It integrates with Ollama and applies structured plans rather than directly mutating the canvas.

- Analyze the current flow or selected node
- Generate test cases from a written requirement
- Convert approved AI test cases into executable flow plans
- Add, update, or delete flow nodes through validated modification plans
- Resolve ambiguous target nodes with selection and clarification support
- Preview and atomically apply multi-operation modifications through flow history
- Perform generic self-healing locator resolution instead of node-specific special cases
- Verify replacement locators against the active Appium session before applying repairs
- Re-run failed execution after a verified self-healing modification
- Classify failures by locator, timing, application state, assertion, and automation-session causes
- Suggest deterministic fixes after failures, including locator repair, waits, and application-state recovery

Example requests:

```text
Tambahkan wait 1000ms sebelum node yang dipilih
```

```text
Ubah assertion setelah login menjadi contains Dashboard
```

## 🧱 Supported flow nodes

| Category | Nodes |
| --- | --- |
| Application | Launch App, Close App |
| Element actions | Tap, Input Text, Swipe, Scroll, Wait, Long Press, Double Tap, Drag, Pinch, Zoom, Fling, Hide Keyboard, Press Return |
| Device actions | Back, Home, Delay, Screenshot |
| Element getters | Get Text, Element Exists, Get Attribute, Get Displayed, Get Enabled, Get Selected |
| Device getters | Get Current Activity, Get Current Package, Get Orientation, Get Platform Version, Get Device Name, Get Device Time, Get Location, Get Size, Get Rect |
| Logic and data | If, Repeat, Assert, Set Variable |

Variables may be referenced in node configuration and assertions:

```text
${username}
${password}
${status}
${price}
```

## 🏗️ Architecture

```text
React workspace
├── Flow Designer ────── Flow store, plugin registry, graph validation
├── Inspector ────────── Page source, element tree, locator generation
├── Execution ────────── Appium client, drivers, runners, recovery
├── Reports ──────────── Evidence, analytics, comparison, export
├── Test Suites ──────── Sequential suite orchestration
├── Generator ────────── Python/pytest project emitters and Monaco preview
└── AI Assistant ─────── Flow context and validated change application
                              │
                              ▼
                      Express local AI service
                      Ollama + QA intelligence
```

```text
src/
├── components/          # Shared layout and UI
├── features/
│   ├── ai/              # AI client, plans, previews, and application
│   ├── command/         # Command palette and keyboard commands
│   ├── device/          # Device manager UI and configuration
│   ├── execution/       # Engine, Appium services, runners, recovery
│   ├── flow/            # Canvas, plugins, actions, store, validation
│   ├── generator/       # Python generator and code preview
│   ├── inspector/       # Element inspection and locator services
│   ├── project/         # Project persistence and file-system workflows
│   ├── reports/         # Report persistence, analytics, and exports
│   └── suites/          # Test-suite models and execution
└── themes/              # Design tokens

server/
├── index.mjs            # Express API and route definitions
├── start.mjs            # Local server entry point
├── device/              # Android/iOS device discovery
├── ai/                  # Prompts and schemas
└── services/            # Ollama, QA intelligence, and target resolution
```

## 🚀 Getting started

### 1. Prerequisites

- Node.js and npm
- Appium
- Android SDK and an Android emulator/device for Android automation
- Xcode and an iOS simulator/device for iOS automation
- Xcode command-line tooling for iOS device discovery and WebDriverAgent workflows
- [Ollama](https://ollama.com/) only when using the AI Assistant

For physical iOS execution, the project currently uses Xcode/XCUITest and WebDriverAgent through Appium.

### 2. Install

```bash
git clone https://github.com/naufalazhar65/FlowTest-Studio.git
cd FlowTest-Studio
npm install
```

### 3. Run the application

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## 🧠 AI service

Start the local AI server in a second terminal:

```bash
npm run dev:ai
```

By default it listens on `http://localhost:8787`. The service exposes:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Service health and configured Ollama model |
| `POST /api/ai` | Contextual chat, flow analysis, and modifications |
| `POST /api/ai/qa/fix` | Build a deterministic QA fix plan |
| `POST /api/ai/test-cases` | Generate test cases from a requirement |
| `POST /api/ai/test-cases/to-flow` | Convert a test case to a flow plan |

The default model can be set through `OLLAMA_MODEL`; the server port can be set through `AI_SERVER_PORT`.

## ⌨️ Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run dev:ai` | Start the local Express/Ollama AI service |
| `npm run build` | Type-check and build the production bundle |
| `npm run lint` | Run ESLint |
| `npm run test` | Start Vitest in watch mode |
| `npm run test:run` | Run the test suite once |
| `npm run test:coverage` | Run tests with coverage collection |

## ⚠️ Current limitations

To set clear expectations, these areas are intentionally not represented as complete functionality:

- iOS simulator, iOS physical-device, and Android device/emulator discovery are integrated.
- Real-device Android execution has been validated through Appium/UiAutomator2, while broader device compatibility coverage and maintained E2E smoke coverage are still future work.
- Real-device iOS execution has been validated through Appium/XCUITest, while broader device compatibility coverage and maintained E2E smoke coverage are still future work.
- Optional screen recording is available from the execution Toolbar and has been validated on iOS Simulator, iOS physical device, and Android real device.
- Capability validation now runs before Appium session creation and returns actionable validation errors.
- Connection/session retry now retries eligible transient Appium session failures without retrying permanent capability or client errors.
- Test suites run enabled test cases sequentially. Parallel execution and data-driven suites are future work.
- The Python generator is the available generator target; ZIP project export and other language targets are not currently included.
- PDF export opens a printable report page, so the browser is responsible for saving it as a PDF.
- AI self-healing is now generic across supported locator strategies and includes verified rerun behavior; AI governance, approval, audit history, and healing metrics remain future work.

## ✅ Testing

The project uses Vitest for unit and integration-style tests across the flow editor, graph traversal, execution engine, node runners, variables, validation, generators, reports, project lifecycle, AI planning, self-healing behavior, device discovery, device management, and server APIs.

```bash
npm run test:run
npm run build
```

## 🛠️ Technology

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Workflow editor | React Flow, Zustand, Framer Motion |
| Code preview | Monaco Editor |
| Mobile automation | Appium, WebDriver, UiAutomator2, XCUITest |
| AI service | Express, Ollama, OpenAI SDK |
| Testing | Vitest, JSDOM |

## 🗺️ Roadmap

The detailed, phased product plan is available in [docs/ROADMAP.md](docs/ROADMAP.md).

A detailed Android and iOS compatibility matrix is available in [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md).

The validated iOS real-device setup is documented in [docs/IOS-REAL-DEVICE.md](docs/IOS-REAL-DEVICE.md).

### Current progress

- **Milestone 1 — Real-device reliability:** Complete. iOS simulator and physical-device execution, Android device/emulator discovery, Android real-device execution, capability validation, connection/session retry, optional video evidence, the initial Android/iOS compatibility matrix, maintained E2E smoke tests, and real-device WebDriverAgent/Xcode documentation are validated and documented.
- **AI self-healing:** Generic locator resolution is working across supported strategies, including `tap` with `accessibilityId`. Verified locator candidates and rerun behavior are working.
- **Reports:** Project-scoped active-project report loading is working.
- **Milestone 2 — CI-ready suite runner:** Complete. Headless flow execution, machine-readable exit codes, JUnit XML reporting, environment-based flow selection, reusable GitHub Actions CI, redacted execution artifacts, CI device/Appium documentation, and validated Android physical-device execution through a self-hosted macOS ARM64 runner are operational.
- **Milestone 3 — Test data and execution resilience:** M3.1, M3.2, and M3.3 are operational. Named environments, environment-specific variables and device profiles, secret-aware environment configuration, JSON/CSV dataset loading, dataset import and selection, parameterized flow execution, environment-to-dataset variable overlay, variable substitution, row isolation, per-row PASS/FAIL results, configurable node-level retry policies, transient-failure classification, retry attempt limits, self-healing-compatible retries, and retry evidence in execution logs and headless artifacts are validated.
- **Milestone 4 — Faster regression at scale:** Foundations for parallel execution are in place. Pure modules under `src/features/suites/services/parallel/` (concurrency pool, deterministic batch planner, duration-trend analytics, device-provider interface, plus an `exportSuiteFlows` planner and `buildSuiteRunResultFromParallel` re-import), `runSuite` concurrency/batch/duration-trend fields, an in-suite "Per-Project Duration" (slowest) panel, and a parallel cross-process headless suite runner (`npm run test:headless:suite`). The runner supports `--flow` (spawn one vitest process per flow with isolated per-worker state, aggregate to `summary.json`) and `--suite <suite.json>` (write each enabled test case to its own `.flow` + artifact dir, run cross-process, aggregate to `suite-result.json` with per-test-case `records`). Those `suite-result.json` files can be re-imported into the UI via the suite's "Import parallel run" control to rebuild `lastRun`/`runHistory` without running in-process. Real in-process multi-device parallelism is intentionally deferred (global-singleton execution architecture).
- **Milestone 5 — Trustworthy AI automation:** AI self-healing and verified rerun behavior plus the first governance piece are in place. Before applying an AI plan, users now see a node/edge diff via the pure `computePlanDiff` module (`src/features/ai/services/flowPlanDiff.ts`), which projects an `AIFlowPlan` or `ModificationPlan` onto a copy of the current flow using the same pure actions as the real applier and reports added/modified/removed nodes (with per-node field changes) and added/removed edges. A reactive "Changes this will make" summary renders in the `AIFlowPreview` and modification preview panels before the Apply button. Remaining M5 work: approval for auto-healing config changes, AI audit/rollback history, per-project AI policies, ambiguity clarification, secret redaction everywhere, and healing metrics.
- **Next priorities:** Continue M5 governance (approval, audit/rollback traceability, per-project AI settings, healing metrics), then M6 collaboration/versioning.

## 🤝 Contributing

Contributions, bug reports, and feature proposals are welcome.

1. Fork the repository and create a focused branch.
2. Add or update tests for behavior changes.
3. Run `npm run test:run` and `npm run build` before opening a pull request.
4. Describe the change and how it was verified.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Naufal Azhar** — Software Quality Assurance Engineer

- GitHub: [naufalazhar65](https://github.com/naufalazhar65)
- LinkedIn: [naufalazhar](https://www.linkedin.com/in/naufalazhar)

If FlowTest Studio helps your team, consider giving the repository a star.
