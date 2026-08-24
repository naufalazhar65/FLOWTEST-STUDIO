import "@testing-library/jest-dom/vitest";

import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";

import {
    DeviceManager,
} from "./DeviceManager";

import {
    useDeviceStore,
} from "../store/useDeviceStore";

import {
    useAppiumConfigStore,
} from "../../execution/store/useAppiumConfigStore";

import {
    useExecutionStore,
} from "../../execution/store/useExecutionStore";

import {
    discoverDevices,
} from "../services/discoverDevices";

import type {
    Device,
} from "../types/Device";

const {
    mockStart,
    mockStop,
    mockConnectDevice,
    mockDeleteSession,
    mockRefreshSession,
    mockHasSession,
} = vi.hoisted(
    () => ({
        mockStart:
            vi.fn(),

        mockStop:
            vi.fn(),

        mockConnectDevice:
            vi.fn(),

        mockDeleteSession:
            vi.fn(),

        mockRefreshSession:
            vi.fn(),

        mockHasSession:
            vi.fn(),
    }),
);

vi.mock(
    "../services/discoverDevices",
    () => ({
        discoverDevices:
            vi.fn(),
    }),
);

vi.mock(
    "./DeviceList",
    () => ({
        DeviceList: () => (
            <div
                data-testid="device-list"
            >
                Device List
            </div>
        ),
    }),
);

vi.mock(
    "./DeviceConfiguration",
    () => ({
        DeviceConfiguration: () => (
            <div
                data-testid="device-configuration"
            >
                Device Configuration
            </div>
        ),
    }),
);

vi.mock(
    "../../execution/services/appium/AppiumConnectionService",
    () => ({
        appiumConnectionService: {
            start:
                mockStart,

            stop:
                mockStop,
        },
    }),
);

vi.mock(
    "../../execution/services/appium/AppiumClient",
    () => ({
        appiumClient: {
            connectDevice:
                mockConnectDevice,

            deleteSession:
                mockDeleteSession,

            refreshSession:
                mockRefreshSession,
        },
    }),
);

vi.mock(
    "../../execution/services/appium/AppiumSession",
    () => ({
        appiumSession: {
            hasSession:
                mockHasSession,

            clear:
                vi.fn(),
        },
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

describe(
    "DeviceManager",
    () => {
        beforeEach(() => {
            vi.clearAllMocks();

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

            useExecutionStore.setState({
                appiumConnection:
                    "offline",

                environment: {
                    platform:
                        null,

                    osVersion:
                        null,

                    device:
                        null,

                    automation:
                        null,

                    sessionId:
                        null,
                },
            });

            vi.mocked(
                discoverDevices,
            ).mockResolvedValue(
                [],
            );

            mockHasSession.mockReturnValue(
                false,
            );

            mockConnectDevice.mockResolvedValue(
                undefined,
            );

            mockDeleteSession.mockResolvedValue(
                undefined,
            );

            mockRefreshSession.mockResolvedValue(
                undefined,
            );
        });

        it(
            "renders the device workspace",
            () => {
                render(
                    <DeviceManager />,
                );

                expect(
                    screen.getByText(
                        "Available Devices",
                    ),
                ).toBeInTheDocument();

                expect(
                    screen.getByTestId(
                        "device-list",
                    ),
                ).toBeInTheDocument();

                expect(
                    screen.getByTestId(
                        "device-configuration",
                    ),
                ).toBeInTheDocument();
            },
        );

        it(
            "discovers devices when mounted",
            async () => {
                vi.mocked(
                    discoverDevices,
                ).mockResolvedValue([
                    androidDevice,
                    iosDevice,
                ]);

                render(
                    <DeviceManager />,
                );

                await waitFor(
                    () => {
                        expect(
                            discoverDevices,
                        ).toHaveBeenCalledTimes(
                            1,
                        );
                    },
                );

                expect(
                    useDeviceStore
                        .getState()
                        .devices,
                ).toEqual([
                    androidDevice,
                    iosDevice,
                ]);
            },
        );

        it(
            "stores an empty list when discovery fails",
            async () => {
                vi.mocked(
                    discoverDevices,
                ).mockRejectedValue(
                    new Error(
                        "Device discovery failed",
                    ),
                );

                render(
                    <DeviceManager />,
                );

                await waitFor(
                    () => {
                        expect(
                            discoverDevices,
                        ).toHaveBeenCalledTimes(
                            1,
                        );
                    },
                );

                expect(
                    useDeviceStore
                        .getState()
                        .devices,
                ).toEqual([]);
            },
        );

        it(
            "refreshes devices when Refresh is clicked",
            async () => {
                vi.mocked(
                    discoverDevices,
                )
                    .mockResolvedValueOnce([
                        androidDevice,
                    ])
                    .mockResolvedValueOnce([
                        androidDevice,
                        iosDevice,
                    ]);

                render(
                    <DeviceManager />,
                );

                await waitFor(
                    () => {
                        expect(
                            discoverDevices,
                        ).toHaveBeenCalledTimes(
                            1,
                        );
                    },
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Refresh",
                        },
                    ),
                );

                await waitFor(
                    () => {
                        expect(
                            discoverDevices,
                        ).toHaveBeenCalledTimes(
                            2,
                        );
                    },
                );

                expect(
                    useDeviceStore
                        .getState()
                        .devices,
                ).toEqual([
                    androidDevice,
                    iosDevice,
                ]);
            },
        );

        it(
            "starts Appium connection monitoring on mount",
            () => {
                render(
                    <DeviceManager />,
                );

                expect(
                    mockStart,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "stops Appium connection monitoring on unmount",
            () => {
                const {
                    unmount,
                } = render(
                    <DeviceManager />,
                );

                unmount();

                expect(
                    mockStop,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "shows Offline when Appium is disconnected",
            () => {
                useExecutionStore.setState({
                    appiumConnection:
                        "offline",
                });

                render(
                    <DeviceManager />,
                );

                expect(
                    screen.getByText(
                        "Offline",
                    ),
                ).toBeInTheDocument();
            },
        );

        it(
            "shows Checking while Appium connection is being checked",
            () => {
                useExecutionStore.setState({
                    appiumConnection:
                        "checking",
                });

                render(
                    <DeviceManager />,
                );

                expect(
                    screen.getByText(
                        "Checking",
                    ),
                ).toBeInTheDocument();
            },
        );

        it(
            "shows Connected when Appium is connected",
            () => {
                useExecutionStore.setState({
                    appiumConnection:
                        "connected",
                });

                render(
                    <DeviceManager />,
                );

                expect(
                    screen.getByText(
                        "Connected",
                    ),
                ).toBeInTheDocument();
            },
        );

        it(
            "does not connect when Appium is offline",
            async () => {
                useExecutionStore.setState({
                    appiumConnection:
                        "offline",
                });

                render(
                    <DeviceManager />,
                );

                const button =
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Connect Device",
                        },
                    );

                expect(
                    button,
                ).toBeDisabled();

                fireEvent.click(
                    button,
                );

                await waitFor(
                    () => {
                        expect(
                            mockConnectDevice,
                        ).not.toHaveBeenCalled();
                    },
                );
            },
        );

        it(
            "connects the device when Appium is connected",
            async () => {
                useExecutionStore.setState({
                    appiumConnection:
                        "connected",
                });

                render(
                    <DeviceManager />,
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Connect Device",
                        },
                    ),
                );

                await waitFor(
                    () => {
                        expect(
                            mockConnectDevice,
                        ).toHaveBeenCalledTimes(
                            1,
                        );
                    },
                );
            },
        );

        it(
            "disconnects an active Appium session",
            async () => {
                mockHasSession.mockReturnValue(
                    true,
                );

                useExecutionStore.setState({
                    appiumConnection:
                        "connected",
                });

                render(
                    <DeviceManager />,
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Disconnect Device",
                        },
                    ),
                );

                await waitFor(
                    () => {
                        expect(
                            mockDeleteSession,
                        ).toHaveBeenCalledTimes(
                            1,
                        );
                    },
                );
            },
        );

        it(
            "shows active session information",
            () => {
                mockHasSession.mockReturnValue(
                    true,
                );

                useExecutionStore.setState({
                    appiumConnection:
                        "connected",

                    environment: {
                        platform:
                            "iOS",

                        osVersion:
                            "26.4",

                        device:
                            "iPhone 17 Pro",

                        automation:
                            "XCUITest",

                        sessionId:
                            "SESSION-001",
                    },
                });

                render(
                    <DeviceManager />,
                );

                expect(
                    screen.getByText(
                        "Active",
                    ),
                ).toBeInTheDocument();

                expect(
                    screen.getByText(
                        "iPhone 17 Pro",
                    ),
                ).toBeInTheDocument();

                expect(
                    screen.getByText(
                        "SESSION-001",
                    ),
                ).toBeInTheDocument();

                expect(
                    screen.getByText(
                        "Refresh Session Info",
                    ),
                ).toBeInTheDocument();
            },
        );

        it(
            "refreshes an active Appium session",
            async () => {
                mockHasSession.mockReturnValue(
                    true,
                );

                render(
                    <DeviceManager />,
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                        {
                            name:
                                "Refresh Session Info",
                        },
                    ),
                );

                await waitFor(
                    () => {
                        expect(
                            mockRefreshSession,
                        ).toHaveBeenCalledTimes(
                            1,
                        );
                    },
                );
            },
        );

        it(
            "shows the inactive session state when no session exists",
            () => {
                mockHasSession.mockReturnValue(
                    false,
                );

                render(
                    <DeviceManager />,
                );

                expect(
                    screen.getByText(
                        "Inactive",
                    ),
                ).toBeInTheDocument();

                expect(
                    screen.getByText(
                        "Connect a device to create an Appium session.",
                    ),
                ).toBeInTheDocument();
            },
        );
    },
);