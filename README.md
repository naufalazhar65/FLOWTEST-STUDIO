# FlowTest Studio

### Visual Mobile Automation Testing IDE

**Design • Inspect • Execute • Generate • Manage Mobile Automation Tests**

FlowTest Studio is an open-source visual IDE for building, inspecting, executing, and generating Appium-based mobile automation tests through an interactive workflow designer.

Built with **React**, **TypeScript**, **React Flow**, **Appium**, **Monaco Editor**, **Zustand**, and **Vite**.

---

## Overview

FlowTest Studio is designed to modernize mobile automation development by replacing repetitive, script-first workflows with a visual approach.

Instead of manually writing and maintaining automation code for every scenario, QA Engineers can:

- Design automation workflows visually.
- Connect actions through a workflow graph.
- Inspect mobile application elements through Appium.
- Generate and test reliable locators.
- Add inspected elements directly into the flow.
- Validate workflows before execution.
- Execute flows on Android and iOS.
- Pause, resume, or stop executions.
- Capture execution evidence.
- Review detailed execution reports.
- Compare previous executions.
- Export reports in HTML, PDF, and JSON.
- Preview generated automation projects.

The project is built around a modular architecture so the workflow designer, execution engine, Appium integration, reporting system, and code generator can evolve independently.

---

# ✨ Features

## 🎨 Visual Flow Designer

Create mobile automation scenarios through an interactive node-based workflow editor.

### Included

- Drag & Drop Workflow
- Interactive Canvas
- Zoom & Pan
- Multi Selection
- Smart Node Connections
- Plugin-based Nodes
- Dynamic Inspector
- Validation
- Breakpoint Support
- Variable System
- Expression Resolver
- Undo / Redo History
- Locator-to-Flow Integration
- Runtime Node Status
- Runtime Edge Status

Example:

```text
Launch App
    │
    ▼
Tap Login
    │
    ▼
Input Username
    │
    ▼
Input Password
    │
    ▼
Press Return
    │
    ▼
Tap Login
    │
    ▼
Assert
```

---

## 🔍 Mobile Element Inspector

Inspect mobile application elements directly through Appium.

The Element Inspector provides a visual representation of the mobile application's element hierarchy and exposes element properties that can be used to create automation locators.

### Included

- Mobile Element Tree
- Element Selection
- Element Properties
- Element Attribute Inspection
- Locator Generation
- Locator Recommendation
- Locator Copy
- Locator Testing
- Add Locator to Flow
- Android Locator Support
- iOS Locator Support
- XCUITest Locator Support

### Locator Strategies

#### Android

- Accessibility ID
- Resource ID
- Class Name
- XPath
- Android UiAutomator

#### iOS

- Class Name
- iOS Predicate
- iOS Class Chain
- XPath
- Accessibility ID

### Locator Workflow

```text
Connect to Appium
        │
        ▼
Create Appium Session
        │
        ▼
Retrieve Page Source
        │
        ▼
Parse Element Hierarchy
        │
        ▼
Select Element
        │
        ▼
Inspect Properties
        │
        ▼
Generate Locator Candidates
        │
        ▼
Test Locator
        │
        ▼
Add Locator to Flow
```

Generated locators can be preserved together with their selected strategy when creating flow nodes.

---

# ⚙️ Execution Engine

Execute automation flows directly from the visual designer.

The execution engine traverses the workflow graph, resolves variables, executes node runners, resolves transitions, and tracks runtime state.

### Included

- Graph Traversal
- Sequential Execution
- Runtime Variables
- Conditional Branching
- Breakpoints
- Pause / Resume
- Stop Execution
- Execution Timeline
- Execution Logger
- Node Status Tracking
- Edge Status Tracking
- Runtime Statistics
- Node Execution History
- Appium Session Management
- Android Execution
- iOS Execution
- Screenshot Evidence
- Page Source Capture
- Stopped Run Tracking

### Execution Pipeline

```text
Load Flow
    │
    ▼
Validate Flow
    │
    ▼
Initialize Execution
    │
    ▼
Traverse Graph
    │
    ▼
Execute Current Node
    │
    ▼
Resolve Variables
    │
    ▼
Execute Runner
    │
    ▼
Resolve Transition
    │
    ▼
Execute Next Node
    │
    ▼
Finish Execution
```

Execution failures and stopped runs are recorded with their corresponding execution state and timing information.

---

# 📊 Test Reporting & Analytics

FlowTest Studio includes a persistent reporting system for reviewing automation executions after they finish.

Reports are designed to preserve the important information needed to understand an execution without rerunning the test.

## Report Information

A report can contain:

```text
Execution Report
├── Status
├── Start Time
├── Finish Time
├── Duration
├── Node Statistics
│   ├── Total
│   ├── Executed
│   ├── Passed
│   └── Failed
│
├── Environment
│   ├── Platform
│   ├── Platform Version
│   ├── Device
│   ├── Automation
│   └── Session ID
│
├── Appium Capabilities
├── Node Execution Results
├── Screenshot Evidence
├── Page Source
└── Execution Logs
```

## Reporting Features

- Execution History
- Passed / Failed / Stopped Run Tracking
- Execution Summary
- Execution Trend
- Report Analytics
- Environment Information
- Appium Capabilities
- Session ID Tracking
- Node Execution Results
- Execution Logs
- Screenshot Evidence
- Page Source Evidence
- Report Comparison
- Persistent Report Storage
- Delete Individual Report
- Clear All Reports
- HTML Export
- PDF Export
- JSON Export

### Report Lifecycle

```text
Execute Flow
     │
     ▼
Collect Execution Data
     │
     ├── Environment
     ├── Capabilities
     ├── Nodes
     ├── Logs
     ├── Screenshots
     └── Page Source
     │
     ▼
Create Report
     │
     ▼
Persist Report
     │
     ▼
Review / Compare
     │
     ├── HTML
     ├── PDF
     └── JSON
```

---

# 🤖 Code Generator

FlowTest Studio can generate production-oriented Appium automation project structures from visual workflows.

### Included

- Python Generator
- Modular Emitters
- Project Templates
- Runtime Templates
- Code Formatter
- Monaco Preview
- Multi Tab Preview
- File Explorer

ZIP export is planned for a future iteration.

Example generated project structure:

```text
Generated Project
│
├── framework/
├── pages/
├── tests/
├── actions.py
├── driver.py
├── variables.py
├── waits.py
├── pytest.ini
└── requirements.txt
```

---

# 📱 Appium Integration

Appium is the runtime foundation for mobile automation execution and inspection.

### Included

- Appium Session
- Driver Factory
- Android Driver
- iOS Driver
- Gesture Service
- Element Service
- Connection Manager
- Capability Builder
- Mobile Element Inspector
- Locator Generation
- Locator Testing

### Supported Platforms

```text
Android
└── UiAutomator2

iOS
└── XCUITest
```

### Locator API

```text
id
xpath
accessibilityId
className
androidUiAutomator
iOSPredicateString
iOSClassChain
```

---

# ⌨️ iOS Keyboard Automation

FlowTest Studio provides dedicated keyboard-related actions for mobile automation.

## Press Return

The **Press Return** node triggers the native return action of the active text field.

This is useful when the software keyboard remains visible after text input and covers elements that need to be interacted with next.

Example:

```text
Tap Username
      ↓
Input Username
      ↓
Tap Password
      ↓
Input Password
      ↓
Press Return
      ↓
Tap Login
```

## Hide Keyboard

The **Hide Keyboard** node provides a reusable action for native keyboard dismissal scenarios.

---

# 📂 Project Management

Manage automation projects directly inside FlowTest Studio.

### Included

- Open Project
- Save Project
- Save As
- Export Project

Importing existing projects is planned for a future iteration.

---

# 🧩 Supported Nodes

## Application

- Launch App
- Close App

## Element Actions

- Tap
- Double Tap
- Long Press
- Input Text
- Swipe
- Drag
- Pinch
- Zoom
- Fling
- Press Return
- Hide Keyboard

## Device Actions

- Home
- Back
- Delay
- Wait
- Scroll
- Screenshot

## Element Getters

- Get Text
- Get Attribute
- Get Displayed
- Get Enabled
- Get Selected
- Get Location
- Get Size
- Get Rect

## Device Getters

- Get Current Activity
- Get Current Package
- Get Orientation
- Get Platform Version
- Get Device Name
- Get Device Time

## Logic

- If
- Assert
- Set Variable
- Repeat *(In Progress)*

---

# 🧠 Variable System

FlowTest Studio provides runtime variables that can be shared between nodes.

Example:

```text
${username}
${password}
${status}
${price}
```

Variables are resolved during execution and can be reused throughout a workflow.

This allows values produced or defined during one part of a flow to participate in subsequent actions and assertions.

---

# ✅ Validation Engine

Every workflow is validated before execution begins.

### Validation Areas

- Required Fields
- Locator Validation
- Getter Validation
- Logic Validation
- Expression Validation
- Variable Validation
- Platform Validation
- Node Action Validation

Invalid workflows are prevented from entering normal execution.

---

# 🏗 Architecture

FlowTest Studio is organized around several cooperating subsystems:

```text
                         FlowTest Studio
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
   Flow Designer        Element Inspector      Execution Engine
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                │
                                ▼
                       Project / Flow Engine
                                │
                                ▼
                        Appium Integration
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
                 Android                  iOS
                                │
                                ▼
                         Test Reporting
                                │
                                ▼
                         Code Generator
```

---

# 🧪 Testing

FlowTest Studio uses **Vitest** for unit testing.

### Covered Areas

- Execution Engine
- Graph Navigator
- Generator Engine
- Validation
- Variable System
- Plugin Emitters
- Runner Registry
- Utilities
- Type Guards
- Report Services
- Report Persistence

### Current Coverage

| Module | Coverage |
|---|---:|
| Execution Engine | ✅ 100% |
| Graph Navigation | ✅ 100% |
| Validation | ✅ 97%+ |
| Variable System | ✅ 98%+ |
| Type Guards | ✅ 100% |
| Utilities | ✅ 100% |

Coverage continues to improve as additional Appium integration tests, mobile inspection scenarios, reporting scenarios, and generator scenarios are implemented.

---

# 🛠 Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Flow
- Zustand
- Monaco Editor
- Lucide React

## Mobile Automation

- Appium
- WebDriver
- XCUITest
- Android Automation

## Testing

- Vitest

---

# 🚀 Getting Started

## Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Appium
- Android SDK *(for Android automation)*
- Xcode *(for iOS automation)*
- iOS Simulator or physical iOS device
- Android Emulator or physical Android device

## Clone Repository

```bash
git clone https://github.com/naufalazhar65/FlowTest-Studio.git
cd FlowTest-Studio
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Build Production

```bash
npm run build
```

---

# 🗺 Roadmap

## ✅ Completed

### Core IDE

- Visual Flow Designer
- Node Plugin Architecture
- Execution Engine
- Variable System
- Validation Engine
- Appium Runtime
- Project Management
- Monaco Code Preview
- Generator Explorer
- Unit Testing

### Mobile Automation

- Mobile Element Inspector
- Element Tree
- Element Properties Inspector
- Locator Generation
- Android Locator Support
- iOS Locator Support
- iOS Predicate Support
- iOS Class Chain Support
- XPath Locator Generation
- Locator Testing
- Add Locator to Flow
- Press Return Node
- Hide Keyboard Node

### Execution & Reporting

- Graph-based Execution
- Pause / Resume
- Stop Execution
- Runtime Node Status
- Runtime Edge Status
- Execution Timeline
- Execution Logger
- Runtime Statistics
- Stopped Run Detection
- Node Execution History
- Screenshot Evidence
- Page Source Evidence
- Environment Reporting
- Appium Capabilities Reporting
- Persistent Execution History
- Report Analytics
- Execution Trend
- Report Comparison
- Delete Report
- Clear Reports
- HTML Report Export
- PDF Report Export
- JSON Report Export

## 🚧 Planned

- Locator Recorder
- Device Manager
- Data Driven Testing
- Test Suites
- Advanced Flow Controls
- Loop / Repeat Nodes
- Retry Mechanism
- Parallel Execution
- Python Project Generator Improvements
- Export ZIP
- Import Existing Project
- Project Templates
- AI Flow Generator
- Plugin Marketplace
- Cloud Device Execution
- Team Collaboration

---

# 🌟 Vision

FlowTest Studio aims to become a complete visual IDE for mobile automation testing.

The long-term goal is to provide QA Engineers with an integrated environment where they can:

```text
Design
  ↓
Inspect
  ↓
Generate Locator
  ↓
Build Flow
  ↓
Validate
  ↓
Execute
  ↓
Capture Evidence
  ↓
Analyze Results
  ↓
Export Report
  ↓
Generate Automation Project
```

The project focuses on bringing the major stages of mobile automation development into a single workflow-oriented environment.

---

# 🤝 Contributing

Contributions are welcome.

If you have ideas, improvements, bug fixes, or feature proposals, feel free to open an **Issue** or submit a **Pull Request**.

Before contributing, please make sure changes preserve the existing execution, reporting, and Appium workflows.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Naufal Azhar**

Software Quality Assurance Engineer

- GitHub: [naufalazhar65](https://github.com/naufalazhar65)
- LinkedIn: [naufalazhar](https://www.linkedin.com/in/naufalazhar)

---

### ⭐ If you find FlowTest Studio useful, consider giving this repository a star.

Made with ❤️ using **React, TypeScript, React Flow, and Appium**.
