import {
    describe,
    expect,
    it,
} from "vitest";

import {
    loadTestData,
} from "./loadTestData";

import type {
    TestDataFormat,
} from "./loadTestData";

describe(
    "loadTestData",
    () => {
        it(
            "loads JSON test data",
            () => {
                const rows =
                    loadTestData(
                        JSON.stringify([
                            {
                                username:
                                    "user1",

                                password:
                                    "pass1",
                            },
                        ]),
                        "json",
                    );

                expect(
                    rows,
                ).toEqual([
                    {
                        username:
                            "user1",

                        password:
                            "pass1",
                    },
                ]);
            },
        );

        it(
            "loads CSV test data",
            () => {
                const rows =
                    loadTestData(
                        [
                            "username,password",
                            "user1,pass1",
                        ].join(
                            "\n",
                        ),
                        "csv",
                    );

                expect(
                    rows,
                ).toEqual([
                    {
                        username:
                            "user1",

                        password:
                            "pass1",
                    },
                ]);
            },
        );

        it(
            "rejects unsupported formats",
            () => {
                expect(() =>
                    loadTestData(
                        "data",
                        "xml" as TestDataFormat,
                    ),
                ).toThrow(
                    "Unsupported test data format: xml",
                );
            },
        );
    },
);