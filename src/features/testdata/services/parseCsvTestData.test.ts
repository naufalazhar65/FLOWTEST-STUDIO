import {
    describe,
    expect,
    it,
} from "vitest";

import {
    parseCsvTestData,
} from "./parseCsvTestData";

describe(
    "parseCsvTestData",
    () => {
        it(
            "parses basic CSV data",
            () => {
                const rows =
                    parseCsvTestData(
                        [
                            "username,password",
                            "user1,pass1",
                            "user2,pass2",
                        ].join(
                            "\n",
                        ),
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
            "supports quoted values containing commas",
            () => {
                const rows =
                    parseCsvTestData(
                        [
                            "name,address",
                            '"John Doe","123 Main St, Jakarta"',
                        ].join(
                            "\n",
                        ),
                    );

                expect(
                    rows,
                ).toEqual([
                    {
                        name:
                            "John Doe",
                        address:
                            "123 Main St, Jakarta",
                    },
                ]);
            },
        );

        it(
            "supports escaped quotes",
            () => {
                const rows =
                    parseCsvTestData(
                        [
                            "message",
                            '"He said ""hello"""',
                        ].join(
                            "\n",
                        ),
                    );

                expect(
                    rows,
                ).toEqual([
                    {
                        message:
                            'He said "hello"',
                    },
                ]);
            },
        );

        it(
            "ignores empty lines",
            () => {
                const rows =
                    parseCsvTestData(
                        [
                            "username,password",
                            "",
                            "user1,pass1",
                            "",
                        ].join(
                            "\n",
                        ),
                    );

                expect(
                    rows,
                ).toHaveLength(
                    1,
                );
            },
        );

        it(
            "rejects empty CSV data",
            () => {
                expect(() =>
                    parseCsvTestData(
                        "",
                    ),
                ).toThrow(
                    "CSV test data is empty.",
                );
            },
        );

        it(
            "rejects empty headers",
            () => {
                expect(() =>
                    parseCsvTestData(
                        ",password\nuser1,pass1",
                    ),
                ).toThrow(
                    "CSV test data must contain non-empty headers.",
                );
            },
        );

        it(
            "rejects duplicate headers",
            () => {
                expect(() =>
                    parseCsvTestData(
                        "username,username\nuser1,user2",
                    ),
                ).toThrow(
                    "CSV test data contains duplicate headers: username",
                );
            },
        );

        it(
            "rejects inconsistent column counts",
            () => {
                expect(() =>
                    parseCsvTestData(
                        "username,password\nuser1",
                    ),
                ).toThrow(
                    "CSV test data row 2 has 1 columns; expected 2.",
                );
            },
        );

        it(
            "rejects unterminated quoted values",
            () => {
                expect(() =>
                    parseCsvTestData(
                        'username\n"user1',
                    ),
                ).toThrow(
                    "Invalid CSV: unterminated quoted value.",
                );
            },
        );

        it(
            "supports a UTF-8 BOM",
            () => {
                const rows =
                    parseCsvTestData(
                        "\uFEFFusername\nuser1",
                    );

                expect(
                    rows,
                ).toEqual([
                    {
                        username:
                            "user1",
                    },
                ]);
            },
        );
    },
);