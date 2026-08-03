<div align="center">

# 🚀 FlowTest Studio

### Visual Mobile Automation Testing IDE

Design • Execute • Generate • Manage Mobile Automation Tests

Built with **React**, **TypeScript**, **React Flow**, **Appium**, **Monaco Editor**, and **Vite**.

---

FlowTest Studio is an open-source visual IDE for building, executing, and generating Appium-based mobile automation tests through an interactive workflow designer.

Instead of manually writing automation scripts, QA Engineers can create automation scenarios visually using drag-and-drop nodes, validate workflows, execute them with the built-in execution engine, and generate production-ready automation projects.

</div>

---

# 📖 Overview

FlowTest Studio is designed to modernize the way mobile automation tests are created.

Traditional Appium automation requires engineers to manually develop and maintain large amounts of source code.

FlowTest Studio introduces a visual workflow approach where automation scenarios are represented as connected nodes inside an interactive canvas.

Behind the visual interface, multiple engines work together to validate, execute, and generate automation projects.

The platform is currently composed of four major subsystems:

- 🎨 Visual Flow Designer
- ⚙ Execution Engine
- 🤖 Code Generator
- 📂 Project Management

---

# ✨ Key Features

## 🎨 Visual Flow Designer

Build automation scenarios visually using drag-and-drop nodes.

Features

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

---

## ⚙ Execution Engine

Execute automation flows directly from the visual designer.

Features

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

---

## 🤖 Code Generator

Automatically generate production-ready Appium automation projects.

Features

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

Features

- Appium Session
- Driver Factory
- Android Driver
- iOS Driver
- Gesture Service
- Element Service
- Connection Manager
- Capability Builder

---

## 📂 Project Management

Manage automation projects directly inside FlowTest Studio.

Features

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

---

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

---

## Device Actions

- Home
- Back
- Delay
- Wait
- Scroll
- Screenshot

---

## Element Getters

- Get Text
- Get Attribute
- Get Displayed
- Get Enabled
- Get Selected
- Get Location
- Get Size
- Get Rect

---

## Device Getters

- Get Current Activity
- Get Current Package
- Get Orientation
- Get Platform Version
- Get Device Name
- Get Device Time

---

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

        ┌───────────────────┼───────────────────┐

        │                   │                   │

   Flow Designer     Execution Engine    Code Generator

        │                   │                   │

        │                   │                   │

        └─────────────── Project Engine ───────────────┘

                            │

                    Appium Integration

                            │

                  Android / iOS Devices
```

---

# ⚙ Execution Pipeline

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

Example

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

Validation includes

- Required Fields
- Locator Validation
- Getter Validation
- Logic Validation
- Expression Validation
- Variable Validation
- Platform Validation

Invalid workflows cannot be executed.

---

# 📄 Code Generator

The generator produces a complete Appium project structure.

Example

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

Covered modules include

- Execution Engine
- Graph Navigator
- Generator Engine
- Validation
- Variable System
- Plugin Emitters
- Runner Registry
- Utilities
- Type Guards

Current Coverage

| Module | Coverage |
|----------|---------:|
| Execution Engine | ✅ 100% |
| Graph Navigation | ✅ 100% |
| Validation | ✅ 97%+ |
| Variable System | ✅ 98%+ |
| Type Guards | ✅ 100% |
| Utilities | ✅ 100% |

Coverage continues to improve as additional Appium integration tests and generator scenarios are implemented.

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

---

## Mobile Automation

- Appium
- WebDriver

---

## Testing

- Vitest

---

# 🚀 Getting Started

Clone repository

```bash
git clone https://github.com/naufalazhar65/FlowTest-Studio.git
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

## Phase 1 — Core IDE

- [x] Visual Flow Designer
- [x] Node Plugin Architecture
- [x] Execution Engine
- [x] Variable System
- [x] Validation Engine
- [x] Appium Runtime
- [x] Project Management
- [x] Monaco Code Preview
- [x] Generator Explorer
- [x] Unit Testing

---

## Phase 2 — Automation Development

- [ ] Python Project Generator
- [ ] Export ZIP
- [ ] Import Existing Project
- [ ] Mobile Element Inspector
- [ ] Locator Recorder
- [ ] Device Manager
- [ ] Project Templates

---

## Phase 3 — Professional Features

- [ ] HTML Test Report
- [ ] Parallel Execution
- [ ] Retry Mechanism
- [ ] AI Flow Generator
- [ ] Plugin Marketplace
- [ ] Cloud Device Execution
- [ ] Team Collaboration

---

# 🌟 Vision

FlowTest Studio aims to become a complete visual IDE for mobile automation testing.

The long-term goal is to provide QA Engineers with an integrated environment where they can design workflows, execute automation, inspect mobile applications, generate production-ready test projects, and manage the entire automation lifecycle without switching between multiple tools.

---

# 🤝 Contributing

Contributions are welcome.

If you have ideas, improvements, or bug fixes, feel free to open an Issue or submit a Pull Request.

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

### ⭐ If you find FlowTest Studio useful, consider giving this repository a star.

Made with ❤️ using React, TypeScript, React Flow, Monaco Editor, and Appium.

</div>