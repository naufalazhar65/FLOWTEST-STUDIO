import {
    beforeEach,
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

import {
    listAndroidDevices,
} from "./android/adb.mjs";

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

vi.mock(
    "./android/adb.mjs",
    () => ({
        listAndroidDevices:
            vi.fn(),
    }),
);

describe(
    "discoverDevices",
    () => {
        beforeEach(() => {
            vi.clearAllMocks();

            listIOSSimulators.mockResolvedValue(
                [],
            );

            listIOSPhysicalDevices.mockResolvedValue(
                [],
            );

            listAndroidDevices.mockResolvedValue(
                [],
            );
        });

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

                expect(
                    listAndroidDevices,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "returns discovered physical iOS devices",
            async () => {
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
            "returns discovered Android emulator",
            async () => {
                listAndroidDevices.mockResolvedValue(
                    [
                        {
                            id:
                                "emulator-5554",

                            name:
                                "Pixel_8",

                            platform:
                                "android",

                            version:
                                "16",

                            udid:
                                "emulator-5554",

                            status:
                                "connected",

                            emulator:
                                true,
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
                            "emulator-5554",

                        name:
                            "Pixel_8",

                        platform:
                            "android",

                        version:
                            "16",

                        udid:
                            "emulator-5554",

                        status:
                            "connected",

                        emulator:
                            true,
                    },
                ]);

                expect(
                    listAndroidDevices,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "returns discovered physical Android device",
            async () => {
                listAndroidDevices.mockResolvedValue(
                    [
                        {
                            id:
                                "R58N1234567",

                            name:
                                "Pixel 8",

                            platform:
                                "android",

                            version:
                                "15",

                            udid:
                                "R58N1234567",

                            status:
                                "connected",

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
                            "R58N1234567",

                        name:
                            "Pixel 8",

                        platform:
                            "android",

                        version:
                            "15",

                        udid:
                            "R58N1234567",

                        status:
                            "connected",

                        emulator:
                            false,
                    },
                ]);

                expect(
                    listAndroidDevices,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "combines iOS simulators and physical iOS devices",
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
            "combines iOS and Android devices",
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

                listAndroidDevices.mockResolvedValue(
                    [
                        {
                            id:
                                "emulator-5554",

                            name:
                                "Pixel_8",

                            platform:
                                "android",

                            version:
                                "16",

                            udid:
                                "emulator-5554",

                            status:
                                "connected",

                            emulator:
                                true,
                        },

                        {
                            id:
                                "R58N1234567",

                            name:
                                "Pixel 8",

                            platform:
                                "android",

                            version:
                                "15",

                            udid:
                                "R58N1234567",

                            status:
                                "connected",

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

                    {
                        id:
                            "emulator-5554",

                        name:
                            "Pixel_8",

                        platform:
                            "android",

                        version:
                            "16",

                        udid:
                            "emulator-5554",

                        status:
                            "connected",

                        emulator:
                            true,
                    },

                    {
                        id:
                            "R58N1234567",

                        name:
                            "Pixel 8",

                        platform:
                            "android",

                        version:
                            "15",

                        udid:
                            "R58N1234567",

                        status:
                            "connected",

                        emulator:
                            false,
                    },
                ]);
            },
        );

        it(
            "returns an empty list when no devices are discovered",
            async () => {
                await expect(
                    discoverDevices(),
                ).resolves.toEqual(
                    [],
                );

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

                expect(
                    listAndroidDevices,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );
    },
);