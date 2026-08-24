# iOS Real Device Setup

This document describes the iOS real-device environment validated with FlowTest Studio.

## Validated environment

| Component | Version / Value |
| --- | --- |
| Xcode | 26.4.1 |
| Xcode Build | 17E202 |
| Appium | 2.19.0 |
| XCUITest driver | 7.35.1 |
| UiAutomator2 driver | 3.1.0 |
| Reference device | iPhone 12 |
| Device state | available (paired) |

## Device pairing

The reference iPhone 12 is paired with the development Mac and is visible through Xcode CoreDevice tooling.

Validate the device with:

```bash
xcrun devicectl list devices