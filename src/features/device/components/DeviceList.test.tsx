import "@testing-library/jest-dom/vitest";

import {
    describe,
    expect,
    it,
    beforeEach,
    vi,
} from "vitest";

import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react";

import {
    DeviceList,
} from "./DeviceList";

import {
    useDeviceStore,
} from "../store/useDeviceStore";

import {
    useAppiumConfigStore,
} from "../../execution/store/useAppiumConfigStore";

import type {
    Device,
} from "../types/Device";

vi.mock(
    "./DeviceCard",
    () => ({
        DeviceCard: ({
            device,
            selected,
            onClick,
        }: {
            device: Device;

            selected: boolean;

            onClick: () => void;
        }) => (
            <button
                type="button"
                data-testid={
                    `device-${device.id}`
                }
                data-selected={
                    selected
                        ? "true"
                        : "false"
                }
                onClick={onClick}
            >
                {device.name}
            </button>
        ),
    }),
);

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

const iosDevice: Device = {
    id:
        "IOS-001",

    name:
        "iPhone 17 Pro",

    platform:
        "ios",

    version:
        "26.4",

    udid:
        "IOS-UDID-001",

    status:
        "connected",

    emulator:
        true,
};

const iosUnknownVersionDevice: Device = {
    id:
        "IOS-002",

    name:
        "iPhone Test",

    platform:
        "ios",

    version:
        "Unknown",

    udid:
        "IOS-UDID-002",

    status:
        "offline",

    emulator:
        false,
};

describe(
    "DeviceList",
    () => {
        beforeEach(
            () => {
                useDeviceStore.setState({
                    devices: [],

                    selectedDeviceId:
                        null,
                });

                useAppiumConfigStore.setState({
                    config:
                        useAppiumConfigStore
                            .getState()
                            .config,
                });
            },
        );

        it(
            "renders all discovered devices",
            () => {
                useDeviceStore.setState({
                    devices: [
                        androidDevice,
                        iosDevice,
                    ],
                });

                render(
                    <DeviceList />,
                );

                expect(
                    screen.getByText(
                        "Pixel 9 Pro",
                    ),
                ).toBeInTheDocument();

                expect(
                    screen.getByText(
                        "iPhone 17 Pro",
                    ),
                ).toBeInTheDocument();
            },
        );

        it(
            "renders an empty list when no devices are available",
            () => {
                useDeviceStore.setState({
                    devices: [],
                });

                render(
                    <DeviceList />,
                );

                expect(
                    screen.queryByTestId(
                        "device-ANDROID-001",
                    ),
                ).not.toBeInTheDocument();

                expect(
                    screen.queryByTestId(
                        "device-IOS-001",
                    ),
                ).not.toBeInTheDocument();
            },
        );

        it(
            "marks the selected device",
            () => {
                useDeviceStore.setState({
                    devices: [
                        androidDevice,
                        iosDevice,
                    ],

                    selectedDeviceId:
                        iosDevice.id,
                });

                render(
                    <DeviceList />,
                );

                expect(
                    screen.getByTestId(
                        "device-ANDROID-001",
                    ),
                ).toHaveAttribute(
                    "data-selected",
                    "false",
                );

                expect(
                    screen.getByTestId(
                        "device-IOS-001",
                    ),
                ).toHaveAttribute(
                    "data-selected",
                    "true",
                );
            },
        );

        it(
            "selects an Android device and updates Appium configuration",
            () => {
                useDeviceStore.setState({
                    devices: [
                        androidDevice,
                    ],
                });

                render(
                    <DeviceList />,
                );

                fireEvent.click(
                    screen.getByTestId(
                        "device-ANDROID-001",
                    ),
                );

                expect(
                    useDeviceStore
                        .getState()
                        .selectedDeviceId,
                ).toBe(
                    "ANDROID-001",
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
                    config.android
                        .deviceName,
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
                    config.android
                        .udid,
                ).toBe(
                    "ANDROID-UDID-001",
                );
            },
        );

        it(
            "selects an iOS device and updates Appium configuration",
            () => {
                useDeviceStore.setState({
                    devices: [
                        iosDevice,
                    ],
                });

                render(
                    <DeviceList />,
                );

                fireEvent.click(
                    screen.getByTestId(
                        "device-IOS-001",
                    ),
                );

                expect(
                    useDeviceStore
                        .getState()
                        .selectedDeviceId,
                ).toBe(
                    "IOS-001",
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
                    config.ios
                        .deviceName,
                ).toBe(
                    "iPhone 17 Pro",
                );

                expect(
                    config.ios
                        .platformVersion,
                ).toBe(
                    "26.4",
                );

                expect(
                    config.ios
                        .udid,
                ).toBe(
                    "IOS-UDID-001",
                );
            },
        );

        it(
            "clears an Unknown device version when updating Appium configuration",
            () => {
                useDeviceStore.setState({
                    devices: [
                        iosUnknownVersionDevice,
                    ],
                });

                render(
                    <DeviceList />,
                );

                fireEvent.click(
                    screen.getByTestId(
                        "device-IOS-002",
                    ),
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
                    config.ios
                        .deviceName,
                ).toBe(
                    "iPhone Test",
                );

                expect(
                    config.ios
                        .platformVersion,
                ).toBe(
                    "",
                );

                expect(
                    config.ios
                        .udid,
                ).toBe(
                    "IOS-UDID-002",
                );
            },
        );
    },
);