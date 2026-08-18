import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("./AppiumClient", () => ({
    appiumClient: {
        closeApp:
            vi.fn(),

        deleteSession:
            vi.fn(),

        launchApp:
            vi.fn(),
    },
}));

import {
    appiumClient,
} from "./AppiumClient";

import type {
    LaunchAppNodeData,
} from "../../../flow/types/flowNode";

import {
    recoverApplicationState,
} from "./recoverApplicationState";

const closeAppMock =
    vi.mocked(
        appiumClient.closeApp,
    );

const deleteSessionMock =
    vi.mocked(
        appiumClient.deleteSession,
    );

const launchAppMock =
    vi.mocked(
        appiumClient.launchApp,
    );

function createAndroidLaunchData():
    LaunchAppNodeData {
    return {
        action:
            "launchApp",

        title:
            "Launch App",

        subtitle:
            "Launch application",

        debug: {
            breakpoint:
                false,
        },

        platform:
            "Android",

        appPackage:
            "com.demo.android",

        appActivity:
            ".MainActivity",

        bundleId:
            "",

        app:
            "",

        noReset:
            false,
    };
}

function createIOSLaunchData():
    LaunchAppNodeData {
    return {
        action:
            "launchApp",

        title:
            "Launch App",

        subtitle:
            "Launch application",

        debug: {
            breakpoint:
                false,
        },

        platform:
            "iOS",

        appPackage:
            "",

        appActivity:
            "",

        bundleId:
            "com.demo.ios",

        app:
            "",

        noReset:
            false,
    };
}

describe(
    "recoverApplicationState",
    () => {
        beforeEach(() => {
            vi.clearAllMocks();

            closeAppMock.mockResolvedValue(
                undefined,
            );

            deleteSessionMock.mockResolvedValue(
                undefined,
            );

            launchAppMock.mockResolvedValue(
                undefined,
            );
        });

        it(
            "restarts the Android application using a fresh Appium session",
            async () => {
                await recoverApplicationState(
                    createAndroidLaunchData(),
                );

                expect(
                    closeAppMock,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    closeAppMock,
                ).toHaveBeenCalledWith(
                    {
                        platform:
                            "Android",

                        appPackage:
                            "com.demo.android",

                        bundleId:
                            "",
                    },
                );

                expect(
                    deleteSessionMock,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    launchAppMock,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    launchAppMock,
                ).toHaveBeenCalledWith({
                    platform:
                        "Android",

                    appPackage:
                        "com.demo.android",

                    appActivity:
                        ".MainActivity",

                    bundleId:
                        "",

                    app:
                        "",

                    noReset:
                        false,
                });
            },
        );

        it(
            "restarts the iOS application using a fresh Appium session",
            async () => {
                await recoverApplicationState(
                    createIOSLaunchData(),
                );

                expect(
                    closeAppMock,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    closeAppMock,
                ).toHaveBeenCalledWith(
                    {
                        platform:
                            "iOS",

                        appPackage:
                            "",

                        bundleId:
                            "com.demo.ios",
                    },
                );

                expect(
                    deleteSessionMock,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    launchAppMock,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    launchAppMock,
                ).toHaveBeenCalledWith({
                    platform:
                        "iOS",

                    appPackage:
                        "",

                    appActivity:
                        "",

                    bundleId:
                        "com.demo.ios",

                    app:
                        "",

                    noReset:
                        false,
                });
            },
        );

        it(
            "deletes the session before launching the application",
            async () => {
                const order:
                    string[] =
                    [];

                closeAppMock.mockImplementation(
                    async () => {
                        order.push(
                            "closeApp",
                        );
                    },
                );

                deleteSessionMock.mockImplementation(
                    async () => {
                        order.push(
                            "deleteSession",
                        );
                    },
                );

                launchAppMock.mockImplementation(
                    async () => {
                        order.push(
                            "launchApp",
                        );
                    },
                );

                await recoverApplicationState(
                    createIOSLaunchData(),
                );

                expect(
                    order,
                ).toEqual([
                    "closeApp",
                    "deleteSession",
                    "launchApp",
                ]);
            },
        );

        it(
            "does not launch the application when closing the current application fails",
            async () => {
                closeAppMock.mockRejectedValueOnce(
                    new Error(
                        "Failed to close app",
                    ),
                );

                await expect(
                    recoverApplicationState(
                        createIOSLaunchData(),
                    ),
                ).rejects.toThrow(
                    "Failed to close app",
                );

                expect(
                    deleteSessionMock,
                ).not.toHaveBeenCalled();

                expect(
                    launchAppMock,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "does not launch the application when deleting the session fails",
            async () => {
                deleteSessionMock.mockRejectedValueOnce(
                    new Error(
                        "Failed to delete session",
                    ),
                );

                await expect(
                    recoverApplicationState(
                        createIOSLaunchData(),
                    ),
                ).rejects.toThrow(
                    "Failed to delete session",
                );

                expect(
                    launchAppMock,
                ).not.toHaveBeenCalled();
            },
        );
    },
);