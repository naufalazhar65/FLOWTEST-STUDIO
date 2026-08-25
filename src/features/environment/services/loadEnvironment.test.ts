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
    loadEnvironment,
} from "./loadEnvironment";

import type {
    EnvironmentProfile,
} from "../types/EnvironmentProfile";

describe(
    "loadEnvironment",
    () => {
        beforeEach(() => {
            clearVariables();

            useAppiumConfigStore
                .getState()
                .updateConfig({
                    platformName:
                        "Android",
                });

            useAppiumConfigStore
                .getState()
                .updateDevice(
                    "android",
                    {
                        deviceName:
                            "",
                        platformVersion:
                            "",
                        udid:
                            "",
                    },
                );

            useAppiumConfigStore
                .getState()
                .updateDevice(
                    "ios",
                    {
                        deviceName:
                            "",
                        platformVersion:
                            "",
                        udid:
                            "",
                    },
                );
        });

        it(
            "loads environment variables into the runtime store",
            () => {
                const environment:
                    EnvironmentProfile = {
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

                        retries: {
                            value:
                                3,

                            secret:
                                false,
                        },
                    },
                };

                loadEnvironment(
                    environment,
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

                expect(
                    getVariable(
                        "retries",
                    ),
                ).toBe(3);
            },
        );

        it(
            "replaces existing runtime variables",
            () => {
                const first:
                    EnvironmentProfile = {
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
                };

                const second:
                    EnvironmentProfile = {
                    name:
                        "staging",

                    variables: {
                        baseUrl: {
                            value:
                                "https://staging.example.com",

                            secret:
                                false,
                        },
                    },
                };

                loadEnvironment(
                    first,
                );

                expect(
                    getVariable(
                        "baseUrl",
                    ),
                ).toBe(
                    "https://dev.example.com",
                );

                loadEnvironment(
                    second,
                );

                expect(
                    getVariable(
                        "baseUrl",
                    ),
                ).toBe(
                    "https://staging.example.com",
                );
            },
        );

        it(
            "applies a generic device profile",
            () => {
                const environment:
                    EnvironmentProfile = {
                    name:
                        "staging",

                    variables: {},

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
                };

                loadEnvironment(
                    environment,
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
                ).toBe("15");

                expect(
                    config.android.udid,
                ).toBe(
                    "8738d8d2",
                );
            },
        );

        it(
            "applies an iOS device profile",
            () => {
                const environment:
                    EnvironmentProfile = {
                    name:
                        "development",

                    variables: {},

                    deviceProfile: {
                        platformName:
                            "iOS",

                        deviceName:
                            "iPhone 12",

                        platformVersion:
                            "",

                        udid:
                            "ios-device-id",
                    },
                };

                loadEnvironment(
                    environment,
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
                    "ios-device-id",
                );
            },
        );

        it(
            "keeps the current Appium configuration when no device profile exists",
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
                                "existing-ios-device",
                        },
                    );

                const environment:
                    EnvironmentProfile = {
                    name:
                        "staging",

                    variables: {
                        baseUrl: {
                            value:
                                "https://staging.example.com",

                            secret: false,
                        },
                    }
                };

                loadEnvironment(
                    environment,
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
                    "existing-ios-device",
                );
            },
        );

        it(
            "loads the value of secret variables into the runtime store",
            () => {
                const environment:
                    EnvironmentProfile = {
                    name:
                        "staging",

                    variables: {
                        password: {
                            value:
                                "secret-value",

                            secret:
                                true,
                        },
                    },
                };

                loadEnvironment(
                    environment,
                );

                expect(
                    getVariable(
                        "password",
                    ),
                ).toBe(
                    "secret-value",
                );
            },
        );
    },
);