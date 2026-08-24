import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    createAppiumSession,
} from "./createAppiumSession";

import {
    WebDriverError,
} from "./WebDriverClient";

import type {
    AppiumCapabilities,
} from "./AppiumSession";

describe(
    "createAppiumSession",
    () => {
        const capabilities:
            AppiumCapabilities = {
            platformName:
                "Android",

            "appium:automationName":
                "UiAutomator2",

            "appium:deviceName":
                "Android Emulator",

            "appium:noReset":
                false,
        };

        it(
            "retries transient failures",
            async () => {
                const post =
                    vi.fn()
                        .mockRejectedValueOnce(
                            new WebDriverError(
                                "Connection refused",
                                {
                                    retryable:
                                        true,
                                },
                            ),
                        )
                        .mockRejectedValueOnce(
                            new WebDriverError(
                                "Appium temporarily unavailable",
                                {
                                    status: 503,
                                    retryable:
                                        true,
                                },
                            ),
                        )
                        .mockResolvedValue({
                            value: {
                                sessionId:
                                    "session-123",

                                capabilities,
                            },
                        });

                const client = {
                    post,
                } as unknown as Parameters<
                    typeof createAppiumSession
                >[0];

                const result =
                    await createAppiumSession(
                        client,
                        capabilities,
                        {
                            maxAttempts: 3,
                            retryDelayMs: 0,
                        },
                    );

                expect(
                    result.sessionId,
                ).toBe(
                    "session-123",
                );

                expect(
                    post,
                ).toHaveBeenCalledTimes(3);
            },
        );

        it(
            "does not retry permanent failures",
            async () => {
                const post =
                    vi.fn()
                        .mockRejectedValue(
                            new WebDriverError(
                                "Invalid capability",
                                {
                                    status: 400,
                                    retryable:
                                        false,
                                },
                            ),
                        );

                const client = {
                    post,
                } as unknown as Parameters<
                    typeof createAppiumSession
                >[0];

                await expect(
                    createAppiumSession(
                        client,
                        capabilities,
                        {
                            maxAttempts: 3,
                            retryDelayMs: 0,
                        },
                    ),
                ).rejects.toThrow(
                    "Invalid capability",
                );

                expect(
                    post,
                ).toHaveBeenCalledTimes(1);
            },
        );

        it(
            "stops after maximum attempts",
            async () => {
                const post =
                    vi.fn()
                        .mockRejectedValue(
                            new WebDriverError(
                                "Connection refused",
                                {
                                    retryable:
                                        true,
                                },
                            ),
                        );

                const client = {
                    post,
                } as unknown as Parameters<
                    typeof createAppiumSession
                >[0];

                await expect(
                    createAppiumSession(
                        client,
                        capabilities,
                        {
                            maxAttempts: 3,
                            retryDelayMs: 0,
                        },
                    ),
                ).rejects.toThrow(
                    "Connection refused",
                );

                expect(
                    post,
                ).toHaveBeenCalledTimes(3);
            },
        );
    },
);