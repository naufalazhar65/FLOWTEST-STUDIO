import {
    describe,
    expect,
    it,
} from "vitest";

import {
    parseJsonTestData,
} from "./parseJsonTestData";

describe(
    "parseJsonTestData",
    () => {
        it(
            "parses an array of objects",
            () => {
                const rows =
                    parseJsonTestData(
                        JSON.stringify([
                            {
                                username:
                                    "user1",
                                password:
                                    "pass1",
                            },
                            {
                                username:
                                    "user2",
                                password:
                                    "pass2",
                            },
                        ]),
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
                    {
                        username:
                            "user2",
                        password:
                            "pass2",
                    },
                ]);
            },
        );

        it(
            "rejects invalid JSON",
            () => {
                expect(() =>
                    parseJsonTestData(
                        "{invalid",
                    ),
                ).toThrow(
                    "Invalid JSON test data",
                );
            },
        );

        it(
            "rejects a JSON object instead of an array",
            () => {
                expect(() =>
                    parseJsonTestData(
                        JSON.stringify({
                            username:
                                "user1",
                        }),
                    ),
                ).toThrow(
                    "JSON test data must contain an array of objects.",
                );
            },
        );

        it(
            "rejects non-object rows",
            () => {
                expect(() =>
                    parseJsonTestData(
                        JSON.stringify([
                            {
                                username:
                                    "user1",
                            },
                            "invalid",
                        ]),
                    ),
                ).toThrow(
                    "Test data row 2 must be an object.",
                );
            },
        );
    },
);