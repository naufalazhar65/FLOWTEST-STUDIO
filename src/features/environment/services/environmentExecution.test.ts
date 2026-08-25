import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    clearVariables,
    getVariable,
} from "../../execution/variables/VariableStore";

import {
    useAppiumConfigStore,
} from "../../execution/store/useAppiumConfigStore";

import {
    useEnvironmentStore,
} from "../store/useEnvironmentStore";

import {
    loadEnvironmentByName,
} from "./loadEnvironmentByName";

describe(
    "environment execution integration",
    () => {
        beforeEach(() => {
            clearVariables();

            useEnvironmentStore
                .getState()
                .resetEnvironments();

            useEnvironmentStore
                .getState()
                .updateEnvironment({
                    name:
                        "staging",

                    variables: {
                        baseUrl: {
                            value:
                                "https://staging.example.com",

                            secret:
                                false,
                        },

                        username: {
                            value:
                                "staging-user",

                            secret:
                                false,
                        },
                    },

                    deviceProfile: {
                        platformName:
                            "Android",

                        deviceName:
                            "Redmi Note 6 Pro",

                        platformVersion:
                            "15",

                        udid:
                            "8738d8d2",
                    },
                });
        });

        it(
            "loads the selected environment",
            () => {
                loadEnvironmentByName(
                    "staging",
                );

                expect(
                    getVariable(
                        "baseUrl",
                    ),
                ).toBe(
                    "https://staging.example.com",
                );

                expect(
                    getVariable(
                        "username",
                    ),
                ).toBe(
                    "staging-user",
                );

                const config =
                    useAppiumConfigStore
                        .getState()
                        .config;

                expect(
                    config.platformName,
                ).toBe(
                    "Android",
                );

                expect(
                    config.android.deviceName,
                ).toBe(
                    "Redmi Note 6 Pro",
                );

                expect(
                    config.android.platformVersion,
                ).toBe(
                    "15",
                );

                expect(
                    config.android.udid,
                ).toBe(
                    "8738d8d2",
                );
            },
        );

        it(
            "does not change Appium configuration when the environment has no device profile",
            () => {
                useAppiumConfigStore
                    .getState()
                    .updateConfig({
                        platformName:
                            "iOS",
                    });

                useAppiumConfigStore
                    .getState()
                    .updateDevice(
                        "ios",
                        {
                            deviceName:
                                "iPhone 12",

                            platformVersion:
                                "",

                            udid:
                                "ios-device",
                        },
                    );

                useEnvironmentStore
                    .getState()
                    .updateEnvironment({
                        name:
                            "development",

                        variables: {
                            baseUrl: {
                                value:
                                    "https://dev.example.com",

                                secret:
                                    false,
                            },
                        },
                    });

                loadEnvironmentByName(
                    "development",
                );

                const config =
                    useAppiumConfigStore
                        .getState()
                        .config;

                expect(
                    config.platformName,
                ).toBe(
                    "iOS",
                );

                expect(
                    config.ios.deviceName,
                ).toBe(
                    "iPhone 12",
                );

                expect(
                    config.ios.udid,
                ).toBe(
                    "ios-device",
                );

                expect(
                    getVariable(
                        "baseUrl",
                    ),
                ).toBe(
                    "https://dev.example.com",
                );
            },
        );
    },
);