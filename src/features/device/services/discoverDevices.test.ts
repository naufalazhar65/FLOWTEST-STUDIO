import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    discoverDevices,
} from "./discoverDevices";

describe(
    "discoverDevices",
    () => {
        it(
            "returns devices from the API",
            async () => {
                const devices = [
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
                            "ANDROID-001",

                        name:
                            "Pixel 9",

                        platform:
                            "android",

                        version:
                            "15",

                        udid:
                            "ANDROID-001",

                        status:
                            "connected",

                        emulator:
                            true,
                    },
                ];

                const fetchMock =
                    vi
                        .spyOn(
                            globalThis,
                            "fetch",
                        )
                        .mockResolvedValue(
                            new Response(
                                JSON.stringify({
                                    devices,
                                }),
                                {
                                    status:
                                        200,

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                },
                            ),
                        );

                await expect(
                    discoverDevices(),
                ).resolves.toEqual(
                    devices,
                );

                expect(
                    fetchMock,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    fetchMock,
                ).toHaveBeenCalledWith(
                    "http://localhost:8787/api/devices",
                );

                fetchMock.mockRestore();
            },
        );

        it(
            "returns an empty list when the API returns no devices",
            async () => {
                const fetchMock =
                    vi
                        .spyOn(
                            globalThis,
                            "fetch",
                        )
                        .mockResolvedValue(
                            new Response(
                                JSON.stringify({
                                    devices: [],
                                }),
                                {
                                    status:
                                        200,

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                },
                            ),
                        );

                await expect(
                    discoverDevices(),
                ).resolves.toEqual(
                    [],
                );

                expect(
                    fetchMock,
                ).toHaveBeenCalledTimes(
                    1,
                );

                fetchMock.mockRestore();
            },
        );

        it(
            "throws when the API returns a non-ok response",
            async () => {
                const fetchMock =
                    vi
                        .spyOn(
                            globalThis,
                            "fetch",
                        )
                        .mockResolvedValue(
                            new Response(
                                JSON.stringify({
                                    error:
                                        "Device discovery failed.",
                                }),
                                {
                                    status:
                                        500,
                                },
                            ),
                        );

                await expect(
                    discoverDevices(),
                ).rejects.toThrow(
                    "Device discovery failed with status 500.",
                );

                expect(
                    fetchMock,
                ).toHaveBeenCalledTimes(
                    1,
                );

                fetchMock.mockRestore();
            },
        );

        it(
            "throws when the API response has an invalid devices field",
            async () => {
                const fetchMock =
                    vi
                        .spyOn(
                            globalThis,
                            "fetch",
                        )
                        .mockResolvedValue(
                            new Response(
                                JSON.stringify({
                                    devices:
                                        null,
                                }),
                                {
                                    status:
                                        200,

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                },
                            ),
                        );

                await expect(
                    discoverDevices(),
                ).rejects.toThrow(
                    "Device discovery returned an invalid response.",
                );

                expect(
                    fetchMock,
                ).toHaveBeenCalledTimes(
                    1,
                );

                fetchMock.mockRestore();
            },
        );

        it(
            "propagates network errors",
            async () => {
                const fetchMock =
                    vi
                        .spyOn(
                            globalThis,
                            "fetch",
                        )
                        .mockRejectedValue(
                            new Error(
                                "Failed to fetch",
                            ),
                        );

                await expect(
                    discoverDevices(),
                ).rejects.toThrow(
                    "Failed to fetch",
                );

                expect(
                    fetchMock,
                ).toHaveBeenCalledTimes(
                    1,
                );

                fetchMock.mockRestore();
            },
        );
    },
);