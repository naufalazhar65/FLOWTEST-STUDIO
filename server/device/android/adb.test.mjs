import {
    describe,
    expect,
    it,
} from "vitest";

import {
    parseAdbDevices,
} from "./adb.mjs";

describe(
    "parseAdbDevices",
    () => {
        it(
            "parses an Android emulator",
            () => {
                const output = `
List of devices attached
emulator-5554	device product:sdk_gphone64_x86_64 model:sdk_gphone64_x86_64 device:generic_x86_64
`;

                expect(
                    parseAdbDevices(
                        output,
                    ),
                ).toEqual([
                    {
                        serial:
                            "emulator-5554",

                        state:
                            "device",
                    },
                ]);
            },
        );

        it(
            "parses a physical Android device",
            () => {
                const output = `
List of devices attached
R58N1234567	device usb:1-1 product:foo model:Pixel_8 device:husky
`;

                expect(
                    parseAdbDevices(
                        output,
                    ),
                ).toEqual([
                    {
                        serial:
                            "R58N1234567",

                        state:
                            "device",
                    },
                ]);
            },
        );

        it(
            "parses multiple Android devices",
            () => {
                const output = `
List of devices attached
emulator-5554	device
R58N1234567	device
`;

                expect(
                    parseAdbDevices(
                        output,
                    ),
                ).toEqual([
                    {
                        serial:
                            "emulator-5554",

                        state:
                            "device",
                    },

                    {
                        serial:
                            "R58N1234567",

                        state:
                            "device",
                    },
                ]);
            },
        );

        it(
            "preserves offline devices",
            () => {
                const output = `
List of devices attached
R58N1234567	offline
`;

                expect(
                    parseAdbDevices(
                        output,
                    ),
                ).toEqual([
                    {
                        serial:
                            "R58N1234567",

                        state:
                            "offline",
                    },
                ]);
            },
        );

        it(
            "ignores malformed lines",
            () => {
                const output = `
List of devices attached

invalid-line
emulator-5554	device
`;

                expect(
                    parseAdbDevices(
                        output,
                    ),
                ).toEqual([
                    {
                        serial:
                            "emulator-5554",

                        state:
                            "device",
                    },
                ]);
            },
        );

        it(
            "returns an empty list when no devices exist",
            () => {
                const output = `
List of devices attached
`;

                expect(
                    parseAdbDevices(
                        output,
                    ),
                ).toEqual([]);
            },
        );

        it(
            "returns an empty list for invalid input",
            () => {
                expect(
                    parseAdbDevices(
                        null,
                    ),
                ).toEqual([]);

                expect(
                    parseAdbDevices(
                        undefined,
                    ),
                ).toEqual([]);
            },
        );
    },
);
