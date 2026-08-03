# Mobile Automation Flow Builder

A visual Mobile Automation Testing framework built with **React + TypeScript + React Flow + Appium**.

Users can build automation test scenarios visually using drag-and-drop nodes, then execute them through an Appium-based execution engine.

---

# Features

## Flow Builder

- Drag & Drop Node
- Connect Nodes
- Visual Flow Editor
- Validation
- Node Execution Status
- Breakpoint Support
- Variable System
- Expression Resolver

---

## Supported Nodes

### Application

- Launch App
- Close App

### Element Actions

- Tap
- Double Tap
- Long Press
- Swipe
- Drag
- Pinch
- Zoom
- Fling
- Input

### Device Actions

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

- If
- Assert
- Set Variable

---

# Architecture

```
src/
 ├── features/
 │
 ├── flow/
 │      ├── components/
 │      ├── actions/
 │      ├── factories/
 │      ├── plugins/
 │      ├── validation/
 │      ├── utils/
 │      └── types/
 │
 ├── execution/
 │      ├── engine/
 │      ├── graph/
 │      ├── runners/
 │      ├── services/
 │      ├── variables/
 │      ├── utils/
 │      ├── store/
 │      └── types/
 │
 └── shared/
```

---

# Execution Engine

Execution Flow

```
Start Node
      │
      ▼
Execute Node
      │
      ▼
Find Next Edge
      │
      ▼
Execute Next Node
      │
      ▼
End
```

Main Components

- executeFlow
- executeNode
- GraphNavigator
- Runner Registry
- Variable Resolver
- Execution Logger

---

# Variable System

Supports:

```
${username}

${password}

${status}

${price}
```

Example

```
Input Text

${username}
```

---

# Validation

Supported Validation

- Launch App
- Close App
- Locator
- Element Getter
- Device Getter
- Assert
- If
- Drag
- Pinch
- Zoom
- Fling
- Delay
- Input
- Set Variable

---

# Unit Testing

Framework

- Vitest

Coverage includes:

## Engine

- executeFlow
- executeNode

## Graph

- GraphNavigator
- findStartNode
- findNextNode
- findIncomingEdges
- findOutgoingEdges

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

# Utilities Tested

- assertCompare
- executeElementGetter
- storeResult
- formatDuration

---

# Variable Utilities Tested

- VariableStore
- resolveVariable
- resolveNodeVariables
- evaluateExpression

---

# Validation Tested

- validateNode
- validateFlow

---

# Type Guards Tested

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

# Current Coverage

Current Status

- Engine: ✅ 100%
- Graph: ✅ 100%
- Validation: ✅ 97%+
- Node Guards: ✅ 100%
- Execution Utils: ✅ 100%
- Variable System: ✅ 98%+

Overall coverage is continuously improving as additional runner scenarios and Appium integration tests are added.

---

# Tech Stack

Frontend

- React
- TypeScript
- React Flow
- Zustand
- TailwindCSS
- Vite

Automation

- Appium
- WebDriver

Testing

- Vitest

---

# Roadmap

## Phase 1

- [x] Flow Builder
- [x] Node System
- [x] Execution Engine
- [x] Variable System
- [x] Validation
- [x] Execution Logger
- [x] Unit Testing

---

## Phase 2

- [ ] Python Script Generator
- [ ] Export Test Project
- [ ] Import Project
- [ ] Mobile Element Inspector
- [ ] Locator Recorder

---

## Phase 3

- [ ] Test Report
- [ ] Parallel Execution
- [ ] Retry Mechanism
- [ ] Plugin System
- [ ] AI Test Generation

---

# Author

Developed by **Naufal Azhar**

Software Quality Assurance Engineer