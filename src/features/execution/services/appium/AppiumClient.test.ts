import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    appiumClient,
} from "./AppiumClient";

import {
    appiumSession,
} from "./AppiumSession";

import {
    useAppiumConfigStore,
} from "../../store/useAppiumConfigStore";

describe(
    "AppiumClient capability validation",
    () => {
        afterEach(() => {
            appiumSession.clear();

            useAppiumConfigStore
                .getState()
                .updateDevice(
                    "android",
                    {
                        deviceName:
                            "Android Emulator",
                        platformVersion: "",
                        udid: "",
                    },
                );

            vi.restoreAllMocks();
        });

        it(
            "rejects invalid capabilities before creating a session",
            async () => {
                const fetchSpy =
                    vi.spyOn(
                        globalThis,
                        "fetch",
                    );

                useAppiumConfigStore
                    .getState()
                    .updateDevice(
                        "android",
                        {
                            deviceName: "",
                        },
                    );

                await expect(
                    appiumClient.launchApp({
                        platform: "Android",
                        noReset: false,
                    }),
                ).rejects.toThrow(
                    "Invalid Appium capabilities:",
                );

                expect(
                    fetchSpy,
                ).not.toHaveBeenCalled();

                expect(
                    appiumSession.hasSession(),
                ).toBe(false);
            },
        );

        it(
            "creates a session when capabilities are valid",
            async () => {
                const fetchSpy =
                    vi
                        .spyOn(
                            globalThis,
                            "fetch",
                        )
                        .mockResolvedValue(
                            new Response(
                                JSON.stringify({
                                    value: {
                                        sessionId:
                                            "session-123",

                                        capabilities: {
                                            platformName:
                                                "Android",

                                            "appium:automationName":
                                                "UiAutomator2",

                                            "appium:deviceName":
                                                "Android Emulator",

                                            "appium:noReset":
                                                false,
                                        },
                                    },
                                }),
                                {
                                    status: 200,

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                },
                            ),
                        );

                await appiumClient.launchApp({
                    platform: "Android",
                    noReset: false,
                });

                expect(
                    fetchSpy,
                ).toHaveBeenCalledTimes(1);

                expect(
                    fetchSpy.mock.calls[0]?.[0],
                ).toBe(
                    "http://127.0.0.1:4723/session",
                );

                expect(
                    appiumSession.hasSession(),
                ).toBe(true);

                expect(
                    appiumSession.getSessionId(),
                ).toBe(
                    "session-123",
                );
            },
        );
    },
);