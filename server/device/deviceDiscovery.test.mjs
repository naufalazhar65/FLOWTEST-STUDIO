import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    discoverDevices,
} from "./deviceDiscovery.mjs";

import {
    listIOSSimulators,
} from "./ios/simctl.mjs";

import {
    listIOSPhysicalDevices,
} from "./ios/devicectl.mjs";

vi.mock(
    "./ios/simctl.mjs",
    () => ({
        listIOSSimulators:
            vi.fn(),
    }),
);

vi.mock(
    "./ios/devicectl.mjs",
    () => ({
        listIOSPhysicalDevices:
            vi.fn(),
    }),
);

describe(
    "discoverDevices",
    () => {
        it(
            "returns discovered iOS simulators",
            async () => {
                listIOSSimulators.mockResolvedValue(
                    [
                        {
                            id:
                                "SIM-001",

                            name:
                                "iPhone 17 Pro",

                            platform:
                                "ios",

                            version:
                                "26.4",

                            udid:
                                "SIM-001",

                            status:
                                "connected",

                            emulator:
                                true,
                        },
                    ],
                );

                listIOSPhysicalDevices.mockResolvedValue(
                    [],
                );

                const devices =
                    await discoverDevices();

                expect(
                    devices,
                ).toEqual([
                    {
                        id:
                            "SIM-001",

                        name:
                            "iPhone 17 Pro",

                        platform:
                            "ios",

                        version:
                            "26.4",

                        udid:
                            "SIM-001",

                        status:
                            "connected",

                        emulator:
                            true,
                    },
                ]);

                expect(
                    listIOSSimulators,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    listIOSPhysicalDevices,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "returns discovered physical iOS devices",
            async () => {
                listIOSSimulators.mockResolvedValue(
                    [],
                );

                listIOSPhysicalDevices.mockResolvedValue(
                    [
                        {
                            id:
                                "DEVICE-001",

                            name:
                                "iPhone Naufal’s",

                            platform:
                                "ios",

                            version:
                                "26.0.1",

                            udid:
                                "00008101-TEST",

                            status:
                                "offline",

                            emulator:
                                false,
                        },
                    ],
                );

                const devices =
                    await discoverDevices();

                expect(
                    devices,
                ).toEqual([
                    {
                        id:
                            "DEVICE-001",

                        name:
                            "iPhone Naufal’s",

                        platform:
                            "ios",

                        version:
                            "26.0.1",

                        udid:
                            "00008101-TEST",

                        status:
                            "offline",

                        emulator:
                            false,
                    },
                ]);
            },
        );

        it(
            "combines simulators and physical iOS devices",
            async () => {
                listIOSSimulators.mockResolvedValue(
                    [
                        {
                            id:
                                "SIM-001",

                            name:
                                "iPhone 17 Pro",

                            platform:
                                "ios",

                            version:
                                "26.4",

                            udid:
                                "SIM-001",

                            status:
                                "connected",

                            emulator:
                                true,
                        },
                    ],
                );

                listIOSPhysicalDevices.mockResolvedValue(
                    [
                        {
                            id:
                                "DEVICE-001",

                            name:
                                "iPhone Naufal’s",

                            platform:
                                "ios",

                            version:
                                "26.0.1",

                            udid:
                                "00008101-TEST",

                            status:
                                "offline",

                            emulator:
                                false,
                        },
                    ],
                );

                const devices =
                    await discoverDevices();

                expect(
                    devices,
                ).toEqual([
                    {
                        id:
                            "SIM-001",

                        name:
                            "iPhone 17 Pro",

                        platform:
                            "ios",

                        version:
                            "26.4",

                        udid:
                            "SIM-001",

                        status:
                            "connected",

                        emulator:
                            true,
                    },

                    {
                        id:
                            "DEVICE-001",

                        name:
                            "iPhone Naufal’s",

                        platform:
                            "ios",

                        version:
                            "26.0.1",

                        udid:
                            "00008101-TEST",

                        status:
                            "offline",

                        emulator:
                            false,
                    },
                ]);
            },
        );

        it(
            "returns an empty list when no devices are discovered",
            async () => {
                listIOSSimulators.mockResolvedValue(
                    [],
                );

                listIOSPhysicalDevices.mockResolvedValue(
                    [],
                );

                await expect(
                    discoverDevices(),
                ).resolves.toEqual(
                    [],
                );
            },
        );
    },
);