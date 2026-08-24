import {
    describe,
    expect,
    it,
} from "vitest";

import {
    assertValidCapabilities,
    validateCapabilities,
} from "./validateCapabilities";

describe(
    "validateCapabilities",
    () => {
        it(
            "accepts valid Android capabilities",
            () => {
                const result =
                    validateCapabilities({
                        platformName: "Android",
                        "appium:automationName":
                            "UiAutomator2",
                        "appium:deviceName":
                            "Redmi Note 6 Pro",
                        "appium:platformVersion":
                            "15",
                        "appium:udid":
                            "8738d8d2",
                        "appium:noReset":
                            false,
                    });

                expect(result).toEqual({
                    valid: true,
                    errors: [],
                });
            },
        );

        it(
            "accepts valid iOS capabilities",
            () => {
                const result =
                    validateCapabilities({
                        platformName: "iOS",
                        "appium:automationName":
                            "XCUITest",
                        "appium:deviceName":
                            "iPhone",
                        "appium:platformVersion":
                            "18.5",
                        "appium:udid":
                            "00008110-XXXX",
                        "appium:noReset":
                            false,
                    });

                expect(result).toEqual({
                    valid: true,
                    errors: [],
                });
            },
        );

        it(
            "rejects missing device name",
            () => {
                const result =
                    validateCapabilities({
                        platformName: "Android",
                        "appium:automationName":
                            "UiAutomator2",
                    });

                expect(result.valid)
                    .toBe(false);

                expect(
                    result.errors,
                ).toContain(
                    "Device name is required. Select a connected Android or iOS device.",
                );
            },
        );

        it(
            "rejects incorrect Android automation driver",
            () => {
                const result =
                    validateCapabilities({
                        platformName: "Android",
                        "appium:automationName":
                            "XCUITest",
                        "appium:deviceName":
                            "Android Device",
                    });

                expect(result.valid)
                    .toBe(false);

                expect(
                    result.errors,
                ).toContain(
                    "Android requires the UiAutomator2 automation driver.",
                );
            },
        );

        it(
            "rejects incorrect iOS automation driver",
            () => {
                const result =
                    validateCapabilities({
                        platformName: "iOS",
                        "appium:automationName":
                            "UiAutomator2",
                        "appium:deviceName":
                            "iPhone",
                    });

                expect(result.valid)
                    .toBe(false);

                expect(
                    result.errors,
                ).toContain(
                    "iOS requires the XCUITest automation driver.",
                );
            },
        );

        it(
            "rejects invalid noReset type",
            () => {
                const result =
                    validateCapabilities({
                        platformName: "Android",
                        "appium:automationName":
                            "UiAutomator2",
                        "appium:deviceName":
                            "Android Device",
                        "appium:noReset":
                            "false",
                    });

                expect(result.valid)
                    .toBe(false);

                expect(
                    result.errors,
                ).toContain(
                    "noReset must be a boolean value.",
                );
            },
        );

        it(
            "throws an actionable error",
            () => {
                expect(() =>
                    assertValidCapabilities({
                        platformName: "Android",
                        "appium:automationName":
                            "XCUITest",
                    }),
                ).toThrow(
                    /Invalid Appium capabilities/,
                );
            },
        );
    },
);