import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getVariable,
} from "../../execution/variables/VariableStore";

import {
    runTestDataRows,
} from "./runTestDataRows";

describe(
    "runTestDataRows",
    () => {
        it(
            "runs every row and records per-row results",
            async () => {
                const executed:
                    string[] = [];

                const results =
                    await runTestDataRows(
                        [
                            {
                                username:
                                    "user1",
                            },

                            {
                                username:
                                    "user2",
                            },

                            {
                                username:
                                    "user3",
                            },
                        ],
                        {
                            async executeRow(
                                row,
                            ) {
                                const username =
                                    getVariable<string>(
                                        "username",
                                    );

                                expect(
                                    username,
                                ).toBe(
                                    row.username,
                                );

                                executed.push(
                                    username as string,
                                );

                                expect(
                                    username,
                                ).toBe(
                                    row.username,
                                );
                            },
                        },
                    );

                expect(
                    executed,
                ).toEqual([
                    "user1",
                    "user2",
                    "user3",
                ]);

                expect(
                    results,
                ).toHaveLength(3);

                expect(
                    results.every(
                        (
                            result,
                        ) =>
                            result.status ===
                            "passed",
                    ),
                ).toBe(true);
            },
        );

        it(
            "continues after a failed row",
            async () => {
                const results =
                    await runTestDataRows(
                        [
                            {
                                username:
                                    "user1",
                            },

                            {
                                username:
                                    "user2",
                            },

                            {
                                username:
                                    "user3",
                            },
                        ],
                        {
                            async executeRow(
                                row,
                            ) {
                                if (
                                    row.username ===
                                    "user2"
                                ) {
                                    throw new Error(
                                        "Intentional row failure",
                                    );
                                }
                            },
                        },
                    );

                expect(
                    results.map(
                        (
                            result,
                        ) =>
                            result.status,
                    ),
                ).toEqual([
                    "passed",
                    "failed",
                    "passed",
                ]);

                expect(
                    results[1]
                        .error,
                ).toBe(
                    "Intentional row failure",
                );
            },
        );
    },
);