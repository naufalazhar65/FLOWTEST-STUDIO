# 🚀 FlowTest Studio

### Visual Mobile Automation Testing IDE

**Design • Inspect • Execute • Generate • Manage Mobile Automation Tests**

Built with **React**, **TypeScript**, **React Flow**, **Appium**, **Monaco Editor**, and **Vite**.

---

FlowTest Studio is an open-source visual IDE for building, inspecting, executing, and generating Appium-based mobile automation tests through an interactive workflow designer.

Instead of manually writing automation scripts, QA Engineers can create automation scenarios visually using drag-and-drop nodes, inspect mobile application elements, generate reliable locators, validate workflows, execute them with the built-in execution engine, and generate production-ready automation projects.

## 📖 Overview

FlowTest Studio is designed to modernize the way mobile automation tests are created.

Traditional Appium automation requires engineers to manually develop and maintain large amounts of source code and manually identify mobile element locators.

FlowTest Studio introduces a visual workflow approach where automation scenarios are represented as connected nodes inside an interactive canvas.

The platform is currently composed of five major subsystems:

- 🎨 Visual Flow Designer
- 🔍 Mobile Element Inspector
- ⚙️ Execution Engine
- 🤖 Code Generator
- 📂 Project Management

---

# ✨ Key Features

## 🎨 Visual Flow Designer

Build automation scenarios visually using drag-and-drop nodes.

### Features

- Drag & Drop Workflow
- Smart Node Connections
- Interactive Canvas
- Zoom & Pan
- Multi Selection
- Validation
- Breakpoint Support
- Variable System
- Expression Resolver
- History (Undo / Redo)
- Dynamic Inspector
- Plugin-based Nodes
- Add Locator to Flow
- Runtime Node Status

## 🔍 Mobile Element Inspector

Inspect mobile application elements directly through Appium.

The Element Inspector provides a visual representation of the mobile application's element hierarchy and allows QA Engineers to inspect element properties and generate automation locators.

### Features

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

### Android Locator Strategies

Supported Android locator strategies include:

- Accessibility ID
- Resource ID
- Class Name
- XPath
- Android UiAutomator

### iOS Locator Strategies

Supported iOS locator strategies include:

- Class Name
- iOS Predicate
- iOS Class Chain
- XPath
- Accessibility ID

The iOS locator generator uses available element attributes to create more specific selectors.

For example, an iOS button with:

```text
className = XCUIElementTypeButton
name = Login
```

can generate:

#### iOS Predicate

```text
name == "Login"
```

#### iOS Class Chain

```text
**/XCUIElementTypeButton[name == "Login"]
```

#### XPath

```text
//XCUIElementTypeButton[@name="Login"]
```

#### Class Name

```text
XCUIElementTypeButton
```

The locator generator can also fall back to the element type when additional attributes are unavailable.

Accessibility ID is not automatically generated from the iOS `name` attribute unless the element exposes a meaningful accessibility identifier. This prevents generic or invalid accessibility selectors from being generated.

### Locator to Flow

Generated locators can be directly added to the visual workflow.

```text
Element Inspector
      │
      ▼
Select Element
      │
      ▼
Generate Locator
      │
      ▼
Select Locator Strategy
      │
      ▼
Add to Flow
      │
      ▼
Create Element Action Node
```

The selected locator strategy and locator value are preserved when creating the flow node.

---

## ⚙️ Execution Engine

Execute automation flows directly from the visual designer.

### Features

- Graph Traversal
- Sequential Execution
- Runtime Variables
- Conditional Branching
- Breakpoints
- Pause / Resume
- Execution Timeline
- Execution Logger
- Node Status Tracking
- Edge Status Tracking
- Runtime Statistics
- Appium Session Management
- Android Execution
- iOS Execution

---

## 🤖 Code Generator

Automatically generate production-ready Appium automation projects.

### Features

- Python Generator
- Modular Emitters
- Project Templates
- Runtime Templates
- Code Formatter
- Monaco Preview
- Multi Tab Preview
- File Explorer
- ZIP Export *(Coming Soon)*

---

## 📱 Appium Integration

Integrated Appium runtime for Android and iOS automation.

### Features

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

Supported locator strategies include:

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

## ⌨️ iOS Keyboard Automation

FlowTest Studio provides dedicated keyboard automation nodes for mobile automation.

### Press Return

The **Press Return** node is particularly useful for iOS applications where the software keyboard remains visible after entering text.

For example:

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

The `Press Return` action triggers the native return action of the active text field before continuing to the next node.

This is useful when an element such as the Login button is located behind the keyboard.

### Hide Keyboard

FlowTest Studio also provides a **Hide Keyboard** node for keyboard dismissal scenarios.

The node is available as a reusable workflow action and can be used independently when the application supports native keyboard dismissal.

---

## 📂 Project Management

Manage automation projects directly inside FlowTest Studio.

### Features

- Open Project
- Save Project
- Save As
- Export Project
- Import Project *(Coming Soon)*

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

# 🏗 Architecture

```text
                     FlowTest Studio
                            │
         ┌──────────────────┼────────────────────────┐
         │                  │                        │
         │                  │                        │
   Flow Designer     Element Inspector       Execution Engine
         │                  │                        │
         │                  │                        │
         └──────────────────┼────────────────────────┘
                            │
                     Project Engine
                            │
                     Appium Integration
                            │
                     Android / iOS Devices
                            │
                       Code Generator
```

---

# 🔍 Element Inspection Pipeline

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
Display Element Tree
      │
      ▼
Select Element
      │
      ▼
Inspect Element Properties
      │
      ▼
Generate Locator Candidates
      │
      ▼
Select / Test Locator
      │
      ▼
Add Locator to Flow
```

---

# ⚙️ Execution Pipeline

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

---

# 🧠 Variable System

FlowTest Studio provides runtime variables that can be shared between nodes.

Example variables:

```text
${username}
${password}
${status}
${price}
```

Variables are resolved during execution and can be reused throughout the workflow.

---

# ✅ Validation Engine

Every workflow is validated before execution begins.

Validation includes:

- Required Fields
- Locator Validation
- Getter Validation
- Logic Validation
- Expression Validation
- Variable Validation
- Platform Validation
- Node Action Validation

Invalid workflows cannot be executed.

---

# 📄 Code Generator

The generator produces a complete Appium project structure.

Example:

```text
Generated Project

framework/
pages/
tests/
actions.py
driver.py
variables.py
waits.py
pytest.ini
requirements.txt
```

---

# 🧪 Testing

FlowTest Studio uses **Vitest** for unit testing.

Covered modules include:

- Execution Engine
- Graph Navigator
- Generator Engine
- Validation
- Variable System
- Plugin Emitters
- Runner Registry
- Utilities
- Type Guards

### Current Coverage

| Module | Coverage |
|---|---:|
| Execution Engine | ✅ 100% |
| Graph Navigation | ✅ 100% |
| Validation | ✅ 97%+ |
| Variable System | ✅ 98%+ |
| Type Guards | ✅ 100% |
| Utilities | ✅ 100% |

Coverage continues to improve as additional Appium integration tests, mobile inspection scenarios, and generator scenarios are implemented.

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

## Phase 1 — Core IDE

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

## Phase 2 — Automation Development

- Python Project Generator
- Export ZIP
- Import Existing Project
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
- Locator Recorder
- Device Manager
- Project Templates

## Phase 3 — Professional Features

- HTML Test Report
- Parallel Execution
- Retry Mechanism
- AI Flow Generator
- Plugin Marketplace
- Cloud Device Execution
- Team Collaboration

---

# 🌟 Vision

FlowTest Studio aims to become a complete visual IDE for mobile automation testing.

The long-term goal is to provide QA Engineers with an integrated environment where they can design workflows, inspect mobile applications, generate reliable automation locators, execute automation, generate production-ready test projects, and manage the entire automation lifecycle without switching between multiple tools.

---

# 🤝 Contributing

Contributions are welcome.

If you have ideas, improvements, or bug fixes, feel free to open an **Issue** or submit a **Pull Request**.

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

Made with ❤️ using React, TypeScript, React Flow, and Appium.
