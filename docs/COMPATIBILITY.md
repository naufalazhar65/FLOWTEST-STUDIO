# FlowTest Studio Compatibility Matrix

This document records mobile automation environments that have been validated with FlowTest Studio.

The matrix is evidence-based: a target is marked **Validated** only when the relevant execution path has been exercised successfully in the current development environment.

## Validation legend

| Status | Meaning |
| --- | --- |
| ✅ Validated | Execution path has been successfully tested |
| ⚠️ Partial | Some functionality works, but the full path has not been validated |
| ⬜ Not validated | No validation evidence is available yet |

## Current environment

| Component | Version |
| --- | --- |
| Appium | 2.19.0 |
| UiAutomator2 | 3.1.0 |
| XCUITest | 7.35.1 |
| Xcode | 26.4.1 |
| FFmpeg | 7.1 |

## Android compatibility

| Target | OS | API | Device type | Driver | Execution | Screen recording | Status |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| Redmi Note 6 Pro | Android 15 | 35 | Physical device | UiAutomator2 3.1.0 | ✅ | ✅ | ✅ Validated |

### Android validation notes

- ADB detected the Redmi Note 6 Pro successfully as a connected `device`.
- Real-device Appium execution was validated.
- Optional screen recording was validated successfully.
- Screen recording produced an `.mp4` artifact.

## iOS compatibility

| Target | OS | Device type | Driver | Execution | Screen recording | Status |
| --- | --- | --- | --- | --- | --- | --- |
| iPhone 12 | iOS version validated in the current environment | Physical device | XCUITest 7.35.1 | ✅ | ✅ | ✅ Validated |
| iOS Simulator | Simulator runtime validated in the current environment | Simulator | XCUITest 7.35.1 | ✅ | ✅ | ✅ Validated |

### iOS validation notes

- iOS physical-device discovery was validated through Xcode tooling.
- The iPhone 12 was detected as an available paired physical device.
- Real-device Appium/XCUITest execution was validated.
- Optional screen recording was validated on the physical device and produced an `.mp4` artifact.
- iOS Simulator execution was validated.
- iOS Simulator screen recording was validated successfully.

## Screen recording compatibility

Screen recording is an **optional, user-controlled execution feature**.

Default state:

```text
Screen Recording = OFF
```

The recording button is available in the execution Toolbar. When enabled, the button changes to a red/pulsing state to indicate that the next execution will be recorded.

Current validated targets:

| Platform | Target | Recording path | Artifact | Status |
| --- | --- | --- | --- | --- |
| Android | Redmi Note 6 Pro | UiAutomator2 MediaProjection | `.mp4` | ✅ |
| iOS | Physical iPhone 12 | Appium XCUITest screen-recording command | `.mp4` | ✅ |
| iOS | Simulator | XCUITest XCTest screen recording | `.mov` | ✅ |

## Scope and limitations

The matrix does not currently claim full compatibility across all Android or iOS versions, devices, or simulator runtimes.

The following areas remain to be expanded:

- Additional Android device models and Android API levels
- Additional iPhone/iPad models and iOS versions
- Additional iOS Simulator runtimes
- Broader Appium driver/version combinations
- Maintained end-to-end smoke coverage across the supported targets
- Documented iOS WebDriverAgent/Xcode setup for real devices

A successful validation on one device or OS version should not be interpreted as universal platform support.

## Recommended support policy

For future releases, compatibility entries should be added only after:

1. Device discovery succeeds.
2. Appium session creation succeeds.
3. A representative FlowTest flow completes successfully.
4. Failure evidence is available when applicable.
5. Optional screen recording is validated when the target supports it.
6. The environment and driver versions are recorded.