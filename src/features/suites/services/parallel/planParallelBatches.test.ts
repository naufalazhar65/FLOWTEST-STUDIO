import {
    describe,
    expect,
    it,
} from "vitest";

import {
    planParallelBatches,
} from "./planParallelBatches";

describe(
    "planParallelBatches",
    () => {
        it(
            "runs all independent tasks in one batch when concurrency allows",
            () => {
                const plan =
                    planParallelBatches(
                        [
                            {
                                id: "a",
                            },
                            {
                                id: "b",
                            },
                            {
                                id: "c",
                            },
                        ],
                        3,
                    );

                expect(
                    plan.batches,
                ).toEqual([
                    {
                        index: 0,

                        batchSize: 3,

                        taskIds: [
                            "a",
                            "b",
                            "c",
                        ],
                    },
                ]);

                expect(
                    plan.totalTasks,
                ).toBe(3);

                expect(
                    plan.maxConcurrency,
                ).toBe(3);
            },
        );

        it(
            "splits tasks into batches limited by concurrency",
            () => {
                const plan =
                    planParallelBatches(
                        [
                            {
                                id: "a",
                            },
                            {
                                id: "b",
                            },
                            {
                                id: "c",
                            },
                        ],
                        2,
                    );

                expect(
                    plan.batches,
                ).toEqual([
                    {
                        index: 0,

                        batchSize: 2,

                        taskIds: [
                            "a",
                            "b",
                        ],
                    },
                    {
                        index: 1,

                        batchSize: 1,

                        taskIds: [
                            "c",
                        ],
                    },
                ]);
            },
        );

        it(
            "respects dependencies between tasks",
            () => {
                const plan =
                    planParallelBatches(
                        [
                            {
                                id: "a",
                            },
                            {
                                id: "b",
                                dependencies: [
                                    "a",
                                ],
                            },
                            {
                                id: "c",
                                dependencies: [
                                    "a",
                                ],
                            },
                        ],
                        2,
                    );

                expect(
                    plan.batches,
                ).toEqual([
                    {
                        index: 0,

                        batchSize: 1,

                        taskIds: [
                            "a",
                        ],
                    },
                    {
                        index: 1,

                        batchSize: 2,

                        taskIds: [
                            "b",
                            "c",
                        ],
                    },
                ]);
            },
        );

        it(
            "floors the concurrency to at least one",
            () => {
                const plan =
                    planParallelBatches(
                        [
                            {
                                id: "a",
                            },
                            {
                                id: "b",
                            },
                        ],
                        0,
                    );

                expect(
                    plan.maxConcurrency,
                ).toBe(1);
            },
        );

        it(
            "handles an empty task list",
            () => {
                const plan =
                    planParallelBatches(
                        [],
                        2,
                    );

                expect(
                    plan.batches,
                ).toEqual([]);

                expect(
                    plan.totalTasks,
                ).toBe(0);
            },
        );
    },
);
