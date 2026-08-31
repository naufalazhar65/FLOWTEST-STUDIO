# AGENTS.md

FlowTest Studio: a browser-based visual mobile automation studio. React/TypeScript/Vite SPA (Appium flows, inspector, reports, Python generator) plus a separate Express AI service backed by Ollama.

## Setup / commands

- Run SPA: `npm run dev` (Vite). Typecheck + build: `npm run build` (`tsc -b && vite build`).
- Run AI server separately: `npm run dev:ai` (Express, defaults to `http://localhost:8787`, reads `server/start.mjs`).
- Prereqs for real execution: Appium, Android SDK/emulator, Xcode+simulator, Ollama (AI only). Local tests that don't touch Appium need none of these.

## Tests (critically, three separate suites)

- **Unit**: `npm run test:run`. Uses `vitest.unit.config.ts`, which **excludes `tests/e2e/**`**. This is the CI suite (`npx vitest run --config vitest.unit.config.ts`). Use this for quick, no-device verification.
- **E2E (device)**: `npm run test:e2e` → `vitest run tests/e2e`. These hit Appium/real devices and are **not** in CI (CI is unit-only). Smoke fixtures are in `tests/e2e/fixtures/`.
- **Headless**: `npm run test:headless -- --flow <path>` → `scripts/run-headless.mjs` spawns vitest on `tests/e2e/headless/headless.flow.test.ts` with `FLOWTEST_FLOW` set, requires a `.flow` JSON file path, writes JUnit to `artifacts/test-results/junit.xml` and artifacts to `artifacts/execution/`.
- **Headless suite (parallel)**: `npm run test:headless:suite -- --flow <a.flow> --flow <b.flow> --concurrency <n>` → `scripts/run-headless-suite.mjs` spawns `--flow`-based vitest runs in parallel (one process per flow, isolating global singletons), relays output with a `[label]` prefix, writes `summary.json`, and exits 0 only if all flows pass. A `--suite <suite.json>` mode is also supported: each enabled test case is written to its own `.flow` + artifact dir, run in parallel cross-process (via `FLOWTEST_FLOW` + `FLOWTEST_ARTIFACT_DIR`), and aggregated into `suite-result.json` with per-test-case `records` — importable in the UI via the suite's "Import parallel run" control.
- Watch mode: `npm test`. Coverage: `npm run test:coverage`.

Always run `npm run lint` and `npm run build` before pushing; CI runs unit tests then build.

## Code format convention (easy to miss)

There is **no Prettier/prettier config** in the repo. The codebase uses a hand-rolled style: every statement/import broken onto its own indented line with lots of vertical whitespace (see any `src/` or `server/` file, e.g. `src/features/execution/services/ExecutionController.ts`). Mimic the surrounding style and avoid mass reformatting — large formatting churn is unwelcome and ESLint does not enforce formatting.

## TypeScript / lint gotchas

- `verbatimModuleSyntax: true` → **use `import type`** for type-only imports (repo convention already does this everywhere).
- Strict flags on: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`. Unused params/vars fail the build/typecheck.

## Architecture

- Single React SPA (`src/main.tsx`). Feature areas live under `src/features/` (flow, execution, inspector, reports, suites, generator, ai, project, device, testdata, environment, command, modification, workspace). State is Zustand stores (e.g. `useExecutionStore`, `useFlowStore`).
- The **AI service is a separate Node process**, plain ESM `.mjs` files under `server/` (`index.mjs`, `start.mjs`, `services/`, `device/`, `ai/`). It is **not** part of the `tsc`/Vite build. It uses `dotenv`; config in `.env` / `.env.example`:
  - `OLLAMA_BASE_URL`, `OLLAMA_MODEL` (default `qwen3:1.7b`), `AI_SERVER_PORT` (default `8787`).
- Serialized flow/project files are **`.flow` JSON** (a `FlowProject`: `nodes` + `edges`). E2E fixtures live in `tests/e2e/fixtures/*.flow`.
  - `loadFlowFixture` (`tests/e2e/utils/loadFlowFixture.ts`) loads fixtures **synchronously** via `import.meta.glob(..., { eager: true })`.
  - `loadFlowProjectFile` reads an arbitrary path **asynchronously** via `node:fs` (used by headless).
- Execution is driven by `ExecutionController.run(nodes, { edges })`; result state is read from `useExecutionStore` (`status`, `failedNodes`). See `tests/e2e/smoke/android.smoke.test.ts`.

## CI / device runners

- Hosted CI (`ci.yml`, Ubuntu, Node 22) only runs unit tests + build — never e2e/device work.
- Real-device Android e2e (`device-android-e2e.yml`) runs on a **self-hosted macOS ARM64 runner** labeled `android`; it assumes Appium already listening on `127.0.0.1:4723` and an ADB device connected. These workflows are `workflow_dispatch` only.
- Node 22 is the CI version; target Node 22.

## Docs

Roadmap, iOS real-device setup, CI device setup, and a platform compatibility matrix live in `docs/` (`ROADMAP.md`, `IOS-REAL-DEVICE.md`, `CI-DEVICE-SETUP.md`, `COMPATIBILITY.md`). Consult before assuming device behavior.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
