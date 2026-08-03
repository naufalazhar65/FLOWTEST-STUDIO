<div align="center">

# 🚀 FlowTest Studio

### Visual Mobile Automation Testing IDE

Design, Execute, and Generate Mobile Automation Tests Visually.

Built with **React**, **TypeScript**, **React Flow**, and **Appium**.

---

A modern visual automation testing platform that enables QA Engineers to build mobile automation workflows using drag-and-drop nodes instead of writing Appium scripts manually.

</div>

---

# 📖 Introduction

FlowTest Studio is a visual Mobile Automation Testing IDE designed to simplify the development of Appium automation projects.

Instead of manually writing large amounts of automation code, users can design test scenarios visually using a flow-based interface.

The execution engine traverses the workflow graph, validates every node, resolves variables, evaluates expressions, and executes each action through Appium.

The long-term vision of FlowTest Studio is to become a complete visual automation platform for Android and iOS testing.

---

# ✨ Features

## 🎨 Visual Flow Builder

Design automation scenarios using drag-and-drop nodes.

### Features

- Drag & Drop Node
- Connect Nodes
- Interactive Canvas
- Zoom & Pan
- Visual Validation
- Execution Status
- Breakpoint Support
- Variable System
- Expression Resolver
- Node Inspector

---

## 🤖 Execution Engine

The execution engine is responsible for traversing the workflow graph and executing every node sequentially.

### Features

- Graph Traversal
- Flow Validation
- Node Execution
- Edge Transition
- Breakpoint Support
- Pause & Resume
- Execution Logger
- Runtime Variables
- Expression Evaluation
- Execution Statistics

---

## 📱 Supported Platforms

- Android
- iOS

Powered by Appium.

---

# 📦 Supported Nodes

## 📱 Application

- Launch App
- Close App

---

## 👆 Element Actions

- Tap
- Double Tap
- Long Press
- Input Text
- Swipe
- Drag
- Pinch
- Zoom
- Fling

---

## 📲 Device Actions

- Home
- Back
- Delay
- Wait
- Scroll
- Screenshot

---

## 📖 Element Getter

- Get Text
- Get Attribute
- Get Displayed
- Get Enabled
- Get Selected
- Get Location
- Get Size
- Get Rect

---

## 📱 Device Getter

- Get Current Activity
- Get Current Package
- Get Orientation
- Get Platform Version
- Get Device Name
- Get Device Time

---

## 🧠 Logic

- If
- Assert
- Set Variable

---

# ⚙ Execution Pipeline

The execution engine processes every flow using the following lifecycle.

```text
Reset Execution

        │

        ▼

Validate Flow

        │

        ▼

Find Start Node

        │

        ▼

Execute Current Node

        │

        ▼

Resolve Output

        │

        ▼

Find Next Transition

        │

        ▼

Execute Next Node

        │

        ▼

Finish Execution
```

---

# 🏗 Core Components

The execution engine is built around several independent components.

| Component | Responsibility |
|-----------|----------------|
| executeFlow | Main execution orchestrator |
| executeNode | Execute a single node |
| GraphNavigator | Graph traversal |
| Runner Registry | Resolve node runner |
| Variable Store | Runtime variable management |
| Expression Resolver | Resolve `${variable}` expressions |
| Execution Logger | Runtime logging |
| Execution Store | Execution state management |

---

# 🔄 Variable System

FlowTest Studio supports runtime variables.

Example

```text
${username}

${password}

${price}

${status}
```

Example usage

```text
Input Text

${username}
```

Variables can be created, updated, and reused across multiple nodes during execution.

---

# ✅ Validation System

Every flow is validated before execution begins.

Supported validation includes

- Launch App
- Close App
- Locator Validation
- Element Getter
- Device Getter
- Assert
- If
- Delay
- Input
- Drag
- Pinch
- Zoom
- Fling
- Set Variable

Invalid flows will never be executed.

---

# 🧪 Unit Testing

FlowTest Studio uses **Vitest** for unit testing.

## Engine

- executeFlow
- executeNode

---

## Graph

- GraphNavigator
- findStartNode
- findNextNode
- findIncomingEdges
- findOutgoingEdges

---

## Runner

### Element Actions

- Tap
- Double Tap
- Long Press
- Drag
- Swipe
- Pinch
- Zoom
- Fling
- Input

### Device Actions

- Launch App
- Close App
- Home
- Back
- Delay
- Wait
- Screenshot
- Scroll

### Getter

#### Element Getter

- Get Text
- Get Attribute
- Get Displayed
- Get Enabled
- Get Selected
- Get Location
- Get Size
- Get Rect

#### Device Getter

- Get Current Activity
- Get Current Package
- Get Orientation
- Get Platform Version
- Get Device Name
- Get Device Time

### Logic

- Assert
- If
- Set Variable

---

## Utilities

- assertCompare
- executeElementGetter
- storeResult
- formatDuration

---

## Variable System

- VariableStore
- resolveVariable
- resolveNodeVariables
- evaluateExpression

---

## Validation

- validateNode
- validateFlow

---

## Type Guards

- isTapNode
- isLongPressNode
- isDoubleTapNode
- isDragNode
- isPinchNode
- isZoomNode
- isFlingNode
- isAssertNode
- isGetTextNode

---

# 📊 Test Coverage

| Module | Coverage |
|----------|---------:|
| Execution Engine | ✅ 100% |
| Graph Navigator | ✅ 100% |
| Validation | ✅ 97%+ |
| Variable System | ✅ 98%+ |
| Type Guards | ✅ 100% |
| Execution Utilities | ✅ 100% |

Coverage continues to improve as additional runner implementations and Appium integration tests are added.

---

# 📂 Project Structure

```text
src/

├── app/

├── components/

│   ├── canvas/
│   ├── inspector/
│   ├── layout/
│   └── ui/

├── features/

│   ├── flow/
│   │      ├── actions/
│   │      ├── components/
│   │      ├── factories/
│   │      ├── plugins/
│   │      ├── validation/
│   │      ├── utils/
│   │      └── types/
│   │
│   ├── execution/
│   │      ├── engine/
│   │      ├── graph/
│   │      ├── runners/
│   │      ├── services/
│   │      ├── store/
│   │      ├── variables/
│   │      ├── utils/
│   │      └── types/
│   │
│   └── generator/

└── shared/
```

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- React Flow
- Zustand
- Tailwind CSS
- Vite
- Monaco Editor

---

## Mobile Automation

- Appium
- WebDriver

---

## Testing

- Vitest

---

# 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/FlowTest-Studio.git
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build production

```bash
npm run build
```

---

# 🗺 Roadmap

## Phase 1 — Core Platform

- [x] Visual Flow Builder
- [x] Node Plugin System
- [x] Execution Engine
- [x] Variable System
- [x] Validation System
- [x] Execution Logger
- [x] Unit Testing

---

## Phase 2 — Automation Development

- [ ] Python Script Generator
- [ ] Export Test Project
- [ ] Import Project
- [ ] Mobile Element Inspector
- [ ] Locator Recorder
- [ ] Device Manager

---

## Phase 3 — Advanced Features

- [ ] Test Report
- [ ] Parallel Execution
- [ ] Retry Mechanism
- [ ] Plugin Marketplace
- [ ] AI Test Generation
- [ ] Cloud Device Execution

---

# 🤝 Contributing

Contributions are welcome.

1. Fork this repository.

2. Create a feature branch.

```bash
git checkout -b feature/my-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push to your branch.

```bash
git push origin feature/my-feature
```

5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Naufal Azhar**

Software Quality Assurance Engineer

- GitHub: https://github.com/naufalazhar65
- LinkedIn: https://www.linkedin.com/in/naufalazhar

---

<div align="center">

⭐ If you find this project useful, consider giving it a star.

Built with ❤️ using React, TypeScript, React Flow, and Appium.

</div>