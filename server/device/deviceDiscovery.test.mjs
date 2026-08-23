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

vi.mock(
    "./ios/simctl.mjs",
    () => ({
        listIOSSimulators:
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
            },
        );

        it(
            "returns an empty list when no devices are discovered",
            async () => {
                listIOSSimulators.mockResolvedValue(
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
