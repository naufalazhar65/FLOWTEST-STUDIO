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

# 🤖 AI Assistant & AI Flow Modification

FlowTest Studio now includes an AI Assistant for understanding the current flow context and generating targeted modifications without recreating the entire workflow.

The AI modification pipeline uses the current FlowTest Studio state as the source of truth.

## AI Capabilities

### Flow Analysis

- Current flow context analysis
- Selected node analysis
- Node and edge context awareness
- Current selected-node tracking

### AI Flow Modification

The AI Assistant supports targeted modifications to the existing flow:

- Add Node Before
- Add Node After
- Update Node
- Delete Node
- Single-operation modifications
- Multi-operation modifications
- Selected-node targeting
- Action-specific field validation
- Modification preview before applying
- Apply changes directly to the current flow
- Undo AI modifications through flow history

### Supported Modification Examples

```text
Tambahkan wait 1000ms sebelum node yang dipilih
```

```text
Hapus node yang dipilih
```

```text
Ubah assertion menjadi contains Dashboard
```

Multiple modifications can also be handled in a single request:

```text
Tambahkan wait 1000ms sebelum node yang dipilih,
lalu ubah assertion setelahnya menjadi contains Dashboard
```

The resulting modification plan can contain multiple ordered operations:

```text
Modification Request
        │
        ▼
AI / Ollama
        │
        ▼
Raw Modification Plan
        │
        ▼
Normalization
        │
        ▼
Validation
        │
        ▼
Modification Preview
        │
        ▼
Apply Changes
        │
        ▼
Flow Store
        │
        ▼
Updated Canvas
```

### Selected Node Resolution

The current FlowTest Studio selection is authoritative when the user refers to:

- "node yang dipilih"
- "selected node"
- "node terpilih"

The AI server can correct an AI-generated target node ID using the current `selectedNodeId` from the FlowTest Studio context.

### Modification Validation

AI modification plans are validated before they are applied.

Validation includes:

- Supported modification operation
- Target node existence
- Required step fields
- Locator requirements
- Input text requirements
- Assertion requirements
- Delay duration requirements
- Wait timeout validation
- Wait polling interval validation
- Delete-node operation without a step

### Wait Defaults

For generated `wait` nodes:

- `timeout` uses the requested timeout
- `pollingInterval` defaults to `500 ms` when not explicitly provided

For example:

```json
{
  "action": "wait",
  "timeout": 1000,
  "pollingInterval": 500
}
```

### AI Modification History

Multiple AI operations are applied through the FlowTest Studio history system so an AI request can be reverted through Undo.

Example:

```text
AI Request
   │
   ├── Add Wait
   │
   └── Update Assertion
          │
          ▼
       One Apply
          │
          ▼
       History Entry
          │
          ▼
       Undo
          │
          ▼
   Restore Previous Flow
```

### AI Technology

The AI server is implemented as a separate service and integrates with Ollama for local model-based responses.

The AI flow is separated into:

```text
AI Client
    │
    ▼
AI Server
    │
    ▼
Ollama
    │
    ▼
Intent Detection
    │
    ├── Analyze Flow
    ├── Analyze Selected Node
    ├── Generate Flow
    └── Modify Flow
           │
           ▼
Modification Normalizer
           │
           ▼
Modification Validator
           │
           ▼
Flow Store
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
- AI Modification Validation
- AI Modification Application
- AI Flow Context
- AI Flow Modification Workflows

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

## AI

- Ollama
- Local AI Server
- AI Intent Detection
- AI Flow Context
- AI Modification Normalization
- AI Modification Validation

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

## Run AI Development Server

FlowTest Studio's AI Assistant can be run with the local AI service:

```bash
npm run dev:ai
```

The AI service runs on:

```text
http://localhost:8787
```

The frontend sends AI requests to:

```text
POST /api/ai
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

### AI Assistant

- AI Assistant
- AI Flow Context
- AI Intent Detection
- Analyze Current Flow
- Analyze Selected Node
- AI Modify Flow
- Add Node Before
- Add Node After
- Update Node
- Delete Node
- Single Modification Operations
- Multiple Modification Operations
- Selected Node Resolution
- Modification Validation
- Modification Preview
- AI Apply Changes
- AI Modification History / Undo

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
- Advanced AI Flow Generation Improvements
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
