import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react";

import {
    DeviceConfiguration,
} from "./DeviceConfiguration";

import {
    useAppiumConfigStore,
} from "../../execution/store/useAppiumConfigStore";

import {
    useDeviceStore,
} from "../store/useDeviceStore";

import type {
    Device,
} from "../types/Device";

const androidDevice: Device = {
    id:
        "ANDROID-001",

    name:
        "Pixel 9 Pro",

    platform:
        "android",

    version:
        "15",

    udid:
        "ANDROID-UDID-001",

    status:
        "connected",

    emulator:
        true,
};



describe(
    "DeviceConfiguration",
    () => {
        beforeEach(() => {
            useAppiumConfigStore.setState({
                config: {
                    serverUrl:
                        "http://127.0.0.1:4723",

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
            });

            useDeviceStore.setState({
                devices: [],

                selectedDeviceId:
                    null,
            });
        });

        it(
            "renders the configuration header",
            () => {
                render(
                    <DeviceConfiguration />,
                );

                expect(
                    screen.getByText(
                        "Device Configuration",
                    ),
                ).toBeDefined();

                expect(
                    screen.getByText(
                        "Configure the target device used by Appium.",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "renders the Android configuration by default",
            () => {
                render(
                    <DeviceConfiguration />,
                );

                expect(
                    screen.getByDisplayValue(
                        "Android Emulator",
                    ),
                ).toBeDefined();

                expect(
                    screen.getByText(
                        "Android",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "renders the current Android device configuration",
            () => {
                useAppiumConfigStore.setState({
                    config: {
                        serverUrl:
                            "http://127.0.0.1:4723",

                        platformName:
                            "Android",

                        android: {
                            deviceName:
                                "Pixel 9 Pro",

                            platformVersion:
                                "15",

                            udid:
                                "ANDROID-UDID-001",
                        },

                        ios: {
                            deviceName:
                                "iPhone 17 Pro",

                            platformVersion:
                                "",

                            udid: "",
                        },
                    },
                });

                render(
                    <DeviceConfiguration />,
                );

                expect(
                    screen.getByDisplayValue(
                        "Pixel 9 Pro",
                    ),
                ).toBeDefined();

                expect(
                    screen.getByDisplayValue(
                        "15",
                    ),
                ).toBeDefined();

                expect(
                    screen.getByDisplayValue(
                        "ANDROID-UDID-001",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "updates Android device name",
            () => {
                render(
                    <DeviceConfiguration />,
                );

                const input =
                    screen.getByDisplayValue(
                        "Android Emulator",
                    );

                fireEvent.change(
                    input,
                    {
                        target: {
                            value:
                                "Pixel 9 Pro",
                        },
                    },
                );

                expect(
                    screen.getByDisplayValue(
                        "Pixel 9 Pro",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "updates Android platform version",
            () => {
                render(
                    <DeviceConfiguration />,
                );

                const input =
                    screen.getByPlaceholderText(
                        "26.4",
                    );

                fireEvent.change(
                    input,
                    {
                        target: {
                            value:
                                "15",
                        },
                    },
                );

                expect(
                    screen.getByDisplayValue(
                        "15",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "updates Android UDID",
            () => {
                render(
                    <DeviceConfiguration />,
                );

                const input =
                    screen.getByPlaceholderText(
                        "Device UDID",
                    );

                fireEvent.change(
                    input,
                    {
                        target: {
                            value:
                                "ANDROID-UDID-001",
                        },
                    },
                );

                expect(
                    screen.getByDisplayValue(
                        "ANDROID-UDID-001",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "updates Appium configuration when Android platform is selected",
            () => {
                render(
                    <DeviceConfiguration />,
                );

                fireEvent.change(
                    screen.getByRole(
                        "combobox",
                    ),
                    {
                        target: {
                            value:
                                "Android",
                        },
                    },
                );

                const inputs =
                    screen.getAllByRole(
                        "textbox",
                    );

                fireEvent.change(
                    inputs[0],
                    {
                        target: {
                            value:
                                "Pixel 9 Pro",
                        },
                    },
                );

                fireEvent.change(
                    inputs[1],
                    {
                        target: {
                            value:
                                "15",
                        },
                    },
                );

                fireEvent.change(
                    inputs[2],
                    {
                        target: {
                            value:
                                "ANDROID-UDID-001",
                        },
                    },
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Save Configuration",
                        },
                    ),
                );

                const config =
                    useAppiumConfigStore
                        .getState()
                        .config;

                expect(
                    config.android.deviceName,
                ).toBe(
                    "Pixel 9 Pro",
                );

                expect(
                    config.android
                        .platformVersion,
                ).toBe(
                    "15",
                );

                expect(
                    config.android.udid,
                ).toBe(
                    "ANDROID-UDID-001",
                );
            },
        );

        it(
            "switches to iOS configuration",
            () => {
                render(
                    <DeviceConfiguration />,
                );

                fireEvent.change(
                    screen.getByRole(
                        "combobox",
                    ),
                    {
                        target: {
                            value:
                                "iOS",
                        },
                    },
                );

                expect(
                    screen.getByDisplayValue(
                        "iPhone 17 Pro",
                    ),
                ).toBeDefined();

                expect(
                    useAppiumConfigStore
                        .getState()
                        .config
                        .platformName,
                ).toBe(
                    "iOS",
                );
            },
        );

        it(
            "updates iOS configuration",
            () => {
                useAppiumConfigStore.setState({
                    config: {
                        serverUrl:
                            "http://127.0.0.1:4723",

                        platformName:
                            "iOS",

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
                                "26.4",

                            udid:
                                "IOS-UDID-001",
                        },
                    },
                });

                render(
                    <DeviceConfiguration />,
                );

                fireEvent.change(
                    screen.getByDisplayValue(
                        "iPhone 17 Pro",
                    ),
                    {
                        target: {
                            value:
                                "iPhone Test",
                        },
                    },
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Save Configuration",
                        },
                    ),
                );

                expect(
                    useAppiumConfigStore
                        .getState()
                        .config
                        .ios.deviceName,
                ).toBe(
                    "iPhone Test",
                );
            },
        );

        it(
            "shows the selected device",
            () => {
                useDeviceStore.setState({
                    devices: [
                        androidDevice,
                    ],

                    selectedDeviceId:
                        androidDevice.id,
                });

                render(
                    <DeviceConfiguration />,
                );

                expect(
                    screen.getByText(
                        "Selected device:",
                    ),
                ).toBeDefined();

                expect(
                    screen.getByText(
                        "Pixel 9 Pro",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "does not render selected device information when no device is selected",
            () => {
                render(
                    <DeviceConfiguration />,
                );

                expect(
                    screen.queryByText(
                        "Selected device:",
                    ),
                ).toBeNull();
            },
        );

        it(
            "resets Android configuration to defaults",
            () => {
                useAppiumConfigStore.setState({
                    config: {
                        serverUrl:
                            "http://127.0.0.1:4723",

                        platformName:
                            "Android",

                        android: {
                            deviceName:
                                "Pixel 9 Pro",

                            platformVersion:
                                "15",

                            udid:
                                "ANDROID-UDID-001",
                        },

                        ios: {
                            deviceName:
                                "iPhone 17 Pro",

                            platformVersion:
                                "",

                            udid: "",
                        },
                    },
                });

                render(
                    <DeviceConfiguration />,
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Reset to Default",
                        },
                    ),
                );

                const config =
                    useAppiumConfigStore
                        .getState()
                        .config;

                expect(
                    config.android.deviceName,
                ).toBe(
                    "Android Emulator",
                );

                expect(
                    config.android
                        .platformVersion,
                ).toBe(
                    "",
                );

                expect(
                    config.android.udid,
                ).toBe(
                    "",
                );

                expect(
                    screen.getByDisplayValue(
                        "Android Emulator",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "resets iOS configuration to defaults",
            () => {
                useAppiumConfigStore.setState({
                    config: {
                        serverUrl:
                            "http://127.0.0.1:4723",

                        platformName:
                            "iOS",

                        android: {
                            deviceName:
                                "Android Emulator",

                            platformVersion:
                                "",

                            udid: "",
                        },

                        ios: {
                            deviceName:
                                "iPhone Test",

                            platformVersion:
                                "17.0",

                            udid:
                                "OLD-IOS-UDID",
                        },
                    },
                });

                render(
                    <DeviceConfiguration />,
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Reset to Default",
                        },
                    ),
                );

                const config =
                    useAppiumConfigStore
                        .getState()
                        .config;

                expect(
                    config.ios.deviceName,
                ).toBe(
                    "iPhone 17 Pro",
                );

                expect(
                    config.ios
                        .platformVersion,
                ).toBe(
                    "",
                );

                expect(
                    config.ios.udid,
                ).toBe(
                    "",
                );

                expect(
                    screen.getByDisplayValue(
                        "iPhone 17 Pro",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "shows Saved after saving configuration",
            () => {
                render(
                    <DeviceConfiguration />,
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Save Configuration",
                        },
                    ),
                );

                expect(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Saved",
                        },
                    ),
                ).toBeDefined();
            },
        );

        it(
            "keeps the server URL unchanged when saving device configuration",
            () => {
                const serverUrl =
                    "http://127.0.0.1:4723";

                useAppiumConfigStore.setState({
                    config: {
                        serverUrl,

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
                });

                render(
                    <DeviceConfiguration />,
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Save Configuration",
                        },
                    ),
                );

                expect(
                    useAppiumConfigStore
                        .getState()
                        .config
                        .serverUrl,
                ).toBe(
                    serverUrl,
                );
            },
        );
    },
);