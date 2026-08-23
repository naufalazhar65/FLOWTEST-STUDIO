import {
    describe,
    expect,
    it,
} from "vitest";

import {
    parseDevicectlDevices,
} from "./devicectl.mjs";

describe(
    "parseDevicectlDevices",
    () => {
        it(
            "parses physical iOS devices",
            () => {
                const output =
                    JSON.stringify({
                        result: {
                            devices: [
                                {
                                    identifier:
                                        "CDF00FB1-50E4-5093-9C63-FDC798A3A5C3",

                                    deviceProperties: {
                                        name:
                                            "iPhone Naufal’s",

                                        osVersionNumber:
                                            "26.0.1",
                                    },

                                    hardwareProperties: {
                                        platform:
                                            "iOS",

                                        reality:
                                            "physical",

                                        udid:
                                            "00008101-000D49D20146001E",
                                    },

                                    connectionProperties: {
                                        tunnelState:
                                            "unavailable",
                                    },
                                },
                            ],
                        },
                    });

                const devices =
                    parseDevicectlDevices(
                        output,
                    );

                expect(
                    devices,
                ).toEqual([
                    {
                        id:
                            "CDF00FB1-50E4-5093-9C63-FDC798A3A5C3",

                        name:
                            "iPhone Naufal’s",

                        platform:
                            "ios",

                        version:
                            "26.0.1",

                        udid:
                            "00008101-000D49D20146001E",

                        status:
                            "offline",

                        emulator:
                            false,
                    },
                ]);
            },
        );

        it(
            "marks a physical device as connected when the tunnel is connected",
            () => {
                const output =
                    JSON.stringify({
                        result: {
                            devices: [
                                {
                                    identifier:
                                        "physical-device",

                                    deviceProperties: {
                                        name:
                                            "iPhone 12",

                                        osVersionNumber:
                                            "26.0.1",
                                    },

                                    hardwareProperties: {
                                        platform:
                                            "iOS",

                                        reality:
                                            "physical",

                                        udid:
                                            "00008101-TEST",
                                    },

                                    connectionProperties: {
                                        tunnelState:
                                            "connected",
                                    },
                                },
                            ],
                        },
                    });

                const devices =
                    parseDevicectlDevices(
                        output,
                    );

                expect(
                    devices[0]?.status,
                ).toBe(
                    "connected",
                );
            },
        );

        it(
            "ignores simulators",
            () => {
                const output =
                    JSON.stringify({
                        result: {
                            devices: [
                                {
                                    identifier:
                                        "simulator",

                                    deviceProperties: {
                                        name:
                                            "iPhone 17 Pro",

                                        osVersionNumber:
                                            "26.4",
                                    },

                                    hardwareProperties: {
                                        platform:
                                            "iOS",

                                        reality:
                                            "simulator",

                                        udid:
                                            "simulator-udid",
                                    },

                                    connectionProperties: {
                                        tunnelState:
                                            "connected",
                                    },
                                },
                            ],
                        },
                    });

                expect(
                    parseDevicectlDevices(
                        output,
                    ),
                ).toEqual([]);
            },
        );

        it(
            "ignores non-iOS physical devices",
            () => {
                const output =
                    JSON.stringify({
                        result: {
                            devices: [
                                {
                                    identifier:
                                        "android-device",

                                    deviceProperties: {
                                        name:
                                            "Android Device",

                                        osVersionNumber:
                                            "16",
                                    },

                                    hardwareProperties: {
                                        platform:
                                            "Android",

                                        reality:
                                            "physical",

                                        udid:
                                            "android-udid",
                                    },

                                    connectionProperties: {
                                        tunnelState:
                                            "connected",
                                    },
                                },
                            ],
                        },
                    });

                expect(
                    parseDevicectlDevices(
                        output,
                    ),
                ).toEqual([]);
            },
        );

        it(
            "returns an empty list when no devices exist",
            () => {
                const output =
                    JSON.stringify({
                        result: {
                            devices: [],
                        },
                    });

                expect(
                    parseDevicectlDevices(
                        output,
                    ),
                ).toEqual([]);
            },
        );

        it(
            "returns an empty list for malformed device entries",
            () => {
                const output =
                    JSON.stringify({
                        result: {
                            devices: [
                                {
                                    identifier:
                                        "invalid",
                                },
                                null,
                                {},
                            ],
                        },
                    });

                expect(
                    parseDevicectlDevices(
                        output,
                    ),
                ).toEqual([]);
            },
        );
    },
);