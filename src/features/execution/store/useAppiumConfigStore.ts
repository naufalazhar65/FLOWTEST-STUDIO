import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_SERVER_URL =
    "http://127.0.0.1:4723";

export interface DeviceConfig {
    deviceName: string;

    platformVersion: string;

    udid: string;
}

export interface AppiumConfig {
    serverUrl: string;

    platformName: "Android" | "iOS";

    android: DeviceConfig;

    ios: DeviceConfig;
}

interface AppiumConfigState {
    config: AppiumConfig;

    updateConfig(
        config: Partial<AppiumConfig>,
    ): void;

    updateDevice(
        platform: "android" | "ios",
        config: Partial<DeviceConfig>,
    ): void;
}

function appiumConfigStoreDefaults(): AppiumConfig {
    return {
        serverUrl: DEFAULT_SERVER_URL,
        platformName: "Android",
        android: {
            deviceName: "Android Emulator",
            platformVersion: "",
            udid: "",
        },
        ios: {
            deviceName: "iPhone 17 Pro",
            platformVersion: "",
            udid: "",
        },
    };
}

export const useAppiumConfigStore =
    create<AppiumConfigState>()(
        persist(
            (set) => ({
                config: {
                    serverUrl:
                        DEFAULT_SERVER_URL,

                    platformName:
                        "Android",

                    android: {
                        deviceName:
                            "Android Emulator",

                        platformVersion:
                            "",

                        udid: "",
                    },

                    ios: {
                        deviceName:
                            "iPhone 17 Pro",

                        platformVersion:
                            "",

                        udid: "",
                    },
                },

                updateConfig(config) {
                    set((state) => ({
                        config: {
                            ...state.config,
                            ...config,
                        },
                    }));
                },

                updateDevice(
                    platform,
                    config,
                ) {
                    set((state) => ({
                        config: {
                            ...state.config,

                            [platform]: {
                                ...state.config[
                                platform
                                ],

                                ...config,
                            },
                        },
                    }));
                },
            }),
            {
                name:
                    "flowtest-studio-appium-config",

                version: 2,

                migrate: (persistedState) => {
                    const state =
                        persistedState as Partial<AppiumConfigState> | undefined;

                    const persistedConfig =
                        state?.config;

                    const serverUrl =
                        persistedConfig?.serverUrl ??
                        DEFAULT_SERVER_URL;

                    const normalizedServerUrl =
                        serverUrl
                            .replace(/^\[([^\]]+)\]\([^)]*\)$/, "$1")
                            .trim() ||
                        DEFAULT_SERVER_URL;

                    return {
                        config: {
                            ...appiumConfigStoreDefaults(),
                            ...persistedConfig,
                            serverUrl:
                                normalizedServerUrl,
                            android: {
                                ...appiumConfigStoreDefaults().android,
                                ...persistedConfig?.android,
                            },
                            ios: {
                                ...appiumConfigStoreDefaults().ios,
                                ...persistedConfig?.ios,
                            },
                        },
                    };
                },

                partialize: (state) => ({
                    config: state.config,
                }),
            },
        ),
    );