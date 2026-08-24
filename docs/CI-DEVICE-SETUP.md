# FlowTest Studio CI Device Setup

This document defines the environment required for device-backed CI execution with FlowTest Studio.

The setup described here is based on the mobile automation environment validated during local development.

## Purpose

FlowTest Studio separates hosted CI from device-backed CI.

Hosted CI is responsible for:

- Unit and integration tests
- Production build verification
- JUnit test reporting
- Static and project-level validation

Device-backed CI is responsible for:

- Appium session creation
- Android smoke execution
- iOS simulator smoke execution
- iOS physical-device execution where a paired device is available
- Screenshots and page-source evidence
- Optional video evidence

## Host requirements

A device-backed runner requires a macOS host for the validated iOS workflow.

Validated local environment:

| Component | Version |
| --- | --- |
| macOS | Development host |
| Node.js | 22 |
| Xcode | 26.4.1 |
| Appium | 2.19.0 |
| XCUITest | 7.35.1 |
| UiAutomator2 | 3.1.0 |
| FFmpeg | 7.1 |

The environment should expose the Appium server at:

```text
http://127.0.0.1:4723