import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    Edge,
} from "reactflow";

import {
    ExecutionController,
} from "../../execution/services/ExecutionController";

import {
    runParameterizedFlow,
} from "./runParameterizedFlow";

vi.mock(
    "../../execution/services/ExecutionController",
    () => ({
        ExecutionController: {
            run: vi.fn(),
        },
    }),
);

describe(
    "runParameterizedFlow",
    () => {
        beforeEach(() => {
            vi.clearAllMocks();

            vi.mocked(
                ExecutionController.run,
            ).mockResolvedValue();
        });

        it(
            "executes every dataset row",
            async () => {
                const nodes =
                    [] as FlowNode[];

                const edges =
                    [] as Edge[];

                const rows = [
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

                    {
                        username:
                            "user3",

                        password:
                            "pass3",
                    },
                ];

                const results =
                    await runParameterizedFlow(
                        rows,
                        {
                            nodes,
                            edges,

                            environmentName:
                                "staging",
                        },
                    );

                expect(
                    ExecutionController.run,
                ).toHaveBeenCalledTimes(
                    3,
                );

                expect(
                    ExecutionController.run,
                ).toHaveBeenNthCalledWith(
                    1,
                    nodes,
                    {
                        edges,
                    },
                    {
                        environmentName:
                            "staging",

                        testDataRow:
                            rows[0],
                    },
                );

                expect(
                    ExecutionController.run,
                ).toHaveBeenNthCalledWith(
                    2,
                    nodes,
                    {
                        edges,
                    },
                    {
                        environmentName:
                            "staging",

                        testDataRow:
                            rows[1],
                    },
                );

                expect(
                    ExecutionController.run,
                ).toHaveBeenNthCalledWith(
                    3,
                    nodes,
                    {
                        edges,
                    },
                    {
                        environmentName:
                            "staging",

                        testDataRow:
                            rows[2],
                    },
                );

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
            "continues collecting results when one row fails",
            async () => {
                const nodes =
                    [] as FlowNode[];

                const edges =
                    [] as Edge[];

                const rows = [
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
                ];

                vi.mocked(
                    ExecutionController.run,
                )
                    .mockResolvedValueOnce()
                    .mockRejectedValueOnce(
                        new Error(
                            "Row 2 failed",
                        ),
                    )
                    .mockResolvedValueOnce();

                const results =
                    await runParameterizedFlow(
                        rows,
                        {
                            nodes,
                            edges,

                            environmentName:
                                "staging",
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
                    results[1].error,
                ).toBe(
                    "Row 2 failed",
                );

                expect(
                    ExecutionController.run,
                ).toHaveBeenCalledTimes(
                    3,
                );
            },
        );

        it(
            "reports row completion callbacks",
            async () => {
                const completedRows:
                    number[] = [];

                await runParameterizedFlow(
                    [
                        {
                            username:
                                "user1",
                        },

                        {
                            username:
                                "user2",
                        },
                    ],
                    {
                        nodes:
                            [] as FlowNode[],

                        edges:
                            [] as Edge[],

                        onRowComplete:
                            (
                                rowIndex,
                            ) => {
                                completedRows.push(
                                    rowIndex,
                                );
                            },
                    },
                );

                expect(
                    completedRows,
                ).toEqual([
                    0,
                    1,
                ]);
            },
        );
    },
);