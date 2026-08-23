import {
    describe,
    expect,
    it,
} from "vitest";

import {
    parseSimctlDevices,
} from "./simctl.mjs";

describe(
    "parseSimctlDevices",
    () => {
        it(
            "parses available iOS simulators",
            () => {
                const output =
                    JSON.stringify({
                        devices: {
                            "com.apple.CoreSimulator.SimRuntime.iOS-26-4":
                                [
                                    {
                                        state:
                                            "Booted",

                                        isAvailable:
                                            true,

                                        name:
                                            "iPhone 17 Pro",

                                        udid:
                                            "3293AF1E-3396-4D4C-873B-9FD3B6E73E53",
                                    },

                                    {
                                        state:
                                            "Shutdown",

                                        isAvailable:
                                            true,

                                        name:
                                            "iPhone 17 Pro Max",

                                        udid:
                                            "F8A862A5-ECCB-4A90-AD79-A1AFE80B9004",
                                    },
                                ],
                        },
                    });

                const devices =
                    parseSimctlDevices(
                        output,
                    );

                expect(
                    devices,
                ).toHaveLength(2);

                expect(
                    devices[0],
                ).toEqual({
                    id:
                        "3293AF1E-3396-4D4C-873B-9FD3B6E73E53",

                    name:
                        "iPhone 17 Pro",

                    platform:
                        "ios",

                    version:
                        "26.4",

                    udid:
                        "3293AF1E-3396-4D4C-873B-9FD3B6E73E53",

                    status:
                        "connected",

                    emulator:
                        true,
                });

                expect(
                    devices[1].status,
                ).toBe(
                    "offline",
                );
            },
        );

        it(
            "ignores unavailable simulators",
            () => {
                const output =
                    JSON.stringify({
                        devices: {
                            "com.apple.CoreSimulator.SimRuntime.iOS-26-4":
                                [
                                    {
                                        state:
                                            "Shutdown",

                                        isAvailable:
                                            false,

                                        name:
                                            "Unavailable iPhone",

                                        udid:
                                            "UNAVAILABLE-UDID",
                                    },

                                    {
                                        state:
                                            "Shutdown",

                                        isAvailable:
                                            true,

                                        name:
                                            "Available iPhone",

                                        udid:
                                            "AVAILABLE-UDID",
                                    },
                                ],
                        },
                    });

                const devices =
                    parseSimctlDevices(
                        output,
                    );

                expect(
                    devices,
                ).toHaveLength(1);

                expect(
                    devices[0].name,
                ).toBe(
                    "Available iPhone",
                );
            },
        );

        it(
            "supports multiple iOS runtimes",
            () => {
                const output =
                    JSON.stringify({
                        devices: {
                            "com.apple.CoreSimulator.SimRuntime.iOS-26-0":
                                [
                                    {
                                        state:
                                            "Shutdown",

                                        isAvailable:
                                            true,

                                        name:
                                            "iPhone 17 Pro",

                                        udid:
                                            "IOS-26-0-UDID",
                                    },
                                ],

                            "com.apple.CoreSimulator.SimRuntime.iOS-26-4":
                                [
                                    {
                                        state:
                                            "Booted",

                                        isAvailable:
                                            true,

                                        name:
                                            "iPhone 17 Pro",

                                        udid:
                                            "IOS-26-4-UDID",
                                    },
                                ],
                        },
                    });

                const devices =
                    parseSimctlDevices(
                        output,
                    );

                expect(
                    devices,
                ).toHaveLength(2);

                expect(
                    devices[0].version,
                ).toBe(
                    "26.0",
                );

                expect(
                    devices[1].version,
                ).toBe(
                    "26.4",
                );
            },
        );

        it(
            "returns an empty list when no devices exist",
            () => {
                const output =
                    JSON.stringify({
                        devices: {},
                    });

                expect(
                    parseSimctlDevices(
                        output,
                    ),
                ).toEqual([]);
            },
        );

        it(
            "ignores malformed device entries",
            () => {
                const output =
                    JSON.stringify({
                        devices: {
                            "com.apple.CoreSimulator.SimRuntime.iOS-26-4":
                                [
                                    null,

                                    {},

                                    {
                                        state:
                                            "Booted",

                                        isAvailable:
                                            true,

                                        name:
                                            "Valid iPhone",

                                        udid:
                                            "VALID-UDID",
                                    },
                                ],
                        },
                    });

                const devices =
                    parseSimctlDevices(
                        output,
                    );

                expect(
                    devices,
                ).toHaveLength(1);

                expect(
                    devices[0].name,
                ).toBe(
                    "Valid iPhone",
                );
            },
        );
    },
);
