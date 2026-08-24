import {
    afterAll,
    afterEach,
    beforeAll,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    app,
} from "./index.mjs";

import {
    discoverDevices,
} from "./device/deviceDiscovery.mjs";

vi.mock(
    "./device/deviceDiscovery.mjs",
    () => ({
        discoverDevices:
            vi.fn(),
    }),
);

let server;

let baseUrl;

beforeAll(
    async () => {
        server =
            app.listen(
                0,
                "127.0.0.1",
            );

        await new Promise(
            (
                resolve,
                reject,
            ) => {
                server.once(
                    "listening",
                    resolve,
                );

                server.once(
                    "error",
                    reject,
                );
            },
        );

        const address =
            server.address();

        if (
            !address ||
            typeof address ===
                "string"
        ) {
            throw new Error(
                "Unable to resolve test server address.",
            );
        }

        baseUrl =
            `http://127.0.0.1:${address.port}`;
    },
);

afterEach(
    () => {
        vi.clearAllMocks();
    },
);

afterAll(
    async () => {
        if (!server) {
            return;
        }

        await new Promise(
            (
                resolve,
                reject,
            ) => {
                server.close(
                    (
                        error,
                    ) => {
                        if (
                            error &&
                            error.code !==
                                "ERR_SERVER_NOT_RUNNING"
                        ) {
                            reject(
                                error,
                            );

                            return;
                        }

                        resolve();
                    },
                );
            },
        );
    },
);

describe(
    "GET /api/devices",
    () => {
        it(
            "returns discovered iOS and Android devices",
            async () => {
                discoverDevices.mockResolvedValue(
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
                    ],
                );

                const response =
                    await fetch(
                        `${baseUrl}/api/devices`,
                    );

                expect(
                    response.status,
                ).toBe(
                    200,
                );

                expect(
                    await response.json(),
                ).toEqual({
                    devices: [
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
                    ],
                });

                expect(
                    discoverDevices,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "returns an empty device list",
            async () => {
                discoverDevices.mockResolvedValue(
                    [],
                );

                const response =
                    await fetch(
                        `${baseUrl}/api/devices`,
                    );

                expect(
                    response.status,
                ).toBe(
                    200,
                );

                expect(
                    await response.json(),
                ).toEqual({
                    devices: [],
                });

                expect(
                    discoverDevices,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "returns 500 when device discovery fails",
            async () => {
                discoverDevices.mockRejectedValue(
                    new Error(
                        "ADB is not available.",
                    ),
                );

                const response =
                    await fetch(
                        `${baseUrl}/api/devices`,
                    );

                expect(
                    response.status,
                ).toBe(
                    500,
                );

                expect(
                    await response.json(),
                ).toEqual({
                    error:
                        "ADB is not available.",
                });

                expect(
                    discoverDevices,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );
    },
);