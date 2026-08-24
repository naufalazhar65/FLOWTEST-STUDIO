import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    useDeviceStore,
} from "./useDeviceStore";

const devices = [
    {
        id:
            "SIM-001",

        name:
            "iPhone 17 Pro",

        platform:
            "ios" as const,

        version:
            "26.4",

        udid:
            "SIM-001",

        status:
            "connected" as const,

        emulator:
            true,
    },

    {
        id:
            "ANDROID-001",

        name:
            "Pixel 9",

        platform:
            "android" as const,

        version:
            "15",

        udid:
            "ANDROID-001",

        status:
            "connected" as const,

        emulator:
            true,
    },
];

describe(
    "useDeviceStore",
    () => {
        beforeEach(
            () => {
                useDeviceStore
                    .getState()
                    .clear();
            },
        );

        it(
            "starts with an empty device list",
            () => {
                const state =
                    useDeviceStore.getState();

                expect(
                    state.devices,
                ).toEqual(
                    [],
                );

                expect(
                    state.selectedDeviceId,
                ).toBeNull();
            },
        );

        it(
            "sets discovered devices",
            () => {
                useDeviceStore
                    .getState()
                    .setDevices(
                        devices,
                    );

                expect(
                    useDeviceStore
                        .getState()
                        .devices,
                ).toEqual(
                    devices,
                );
            },
        );

        it(
            "selects a device",
            () => {
                useDeviceStore
                    .getState()
                    .setDevices(
                        devices,
                    );

                useDeviceStore
                    .getState()
                    .selectDevice(
                        "SIM-001",
                    );

                expect(
                    useDeviceStore
                        .getState()
                        .selectedDeviceId,
                ).toBe(
                    "SIM-001",
                );
            },
        );

        it(
            "clears the selected device",
            () => {
                useDeviceStore
                    .getState()
                    .setDevices(
                        devices,
                    );

                useDeviceStore
                    .getState()
                    .selectDevice(
                        "SIM-001",
                    );

                useDeviceStore
                    .getState()
                    .selectDevice(
                        null,
                    );

                expect(
                    useDeviceStore
                        .getState()
                        .selectedDeviceId,
                ).toBeNull();
            },
        );

        it(
            "clears devices and selection",
            () => {
                useDeviceStore
                    .getState()
                    .setDevices(
                        devices,
                    );

                useDeviceStore
                    .getState()
                    .selectDevice(
                        "ANDROID-001",
                    );

                useDeviceStore
                    .getState()
                    .clear();

                expect(
                    useDeviceStore
                        .getState()
                        .devices,
                ).toEqual(
                    [],
                );

                expect(
                    useDeviceStore
                        .getState()
                        .selectedDeviceId,
                ).toBeNull();
            },
        );

        it(
            "replaces previously discovered devices",
            () => {
                useDeviceStore
                    .getState()
                    .setDevices(
                        devices,
                    );

                const replacement =
                    [
                        {
                            id:
                                "DEVICE-001",

                            name:
                                "iPhone Naufal’s",

                            platform:
                                "ios" as const,

                            version:
                                "26.0.1",

                            udid:
                                "00008101-TEST",

                            status:
                                "offline" as const,

                            emulator:
                                false,
                        },
                    ];

                useDeviceStore
                    .getState()
                    .setDevices(
                        replacement,
                    );

                expect(
                    useDeviceStore
                        .getState()
                        .devices,
                ).toEqual(
                    replacement,
                );
            },
        );
    },
);