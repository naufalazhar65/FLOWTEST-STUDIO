import {
    describe,
    expect,
    it,
} from "vitest";

import {
    importTestDataFile,
} from "./importTestDataFile";

describe(
    "importTestDataFile",
    () => {
        it(
            "imports JSON test data",
            async () => {
                const file =
                    new File(
                        [
                            JSON.stringify(
                                [
                                    {
                                        username:
                                            "user1",
                                    },
                                ],
                            ),
                        ],
                        "users.json",
                        {
                            type:
                                "application/json",
                        },
                    );

                const result =
                    await importTestDataFile(
                        file,
                    );

                expect(
                    result.format,
                ).toBe("json");

                expect(
                    result.rows,
                ).toEqual([
                    {
                        username:
                            "user1",
                    },
                ]);

                expect(
                    result.file.name,
                ).toBe(
                    "users.json",
                );
            },
        );

        it(
            "imports CSV test data",
            async () => {
                const file =
                    new File(
                        [
                            [
                                "username,password",
                                "user1,pass1",
                            ].join("\n"),
                        ],
                        "users.csv",
                        {
                            type:
                                "text/csv",
                        },
                    );

                const result =
                    await importTestDataFile(
                        file,
                    );

                expect(
                    result.format,
                ).toBe("csv");

                expect(
                    result.rows,
                ).toEqual([
                    {
                        username:
                            "user1",

                        password:
                            "pass1",
                    },
                ]);

                expect(
                    result.file.name,
                ).toBe(
                    "users.csv",
                );
            },
        );

        it(
            "rejects unsupported file extensions",
            async () => {
                const file =
                    new File(
                        ["data"],
                        "users.txt",
                    );

                await expect(
                    importTestDataFile(
                        file,
                    ),
                ).rejects.toThrow(
                    "Unsupported test data file type: .txt",
                );
            },
        );
    },
);