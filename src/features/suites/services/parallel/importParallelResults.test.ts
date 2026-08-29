import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildSuiteRunResultFromParallel,
} from "./importParallelResults";

describe(
    "buildSuiteRunResultFromParallel",
    () => {
        const base = {
            suiteId: "suite-1",

            suiteName: "smoke",

            concurrency: 2,

            startedAt: 1000,

            finishedAt: 5000,
        };

        it(
            "aggregates passed/failed/stopped counts and status",
            () => {
                const result =
                    buildSuiteRunResultFromParallel(
                        {
                            ...base,

                            records: [
                                {
                                    testCaseId: "tc-1",

                                    projectId: "p1",

                                    projectName: "login",

                                    status: "passed",

                                    startedAt: 1000,

                                    finishedAt: 2000,

                                    duration: 1000,
                                },
                                {
                                    testCaseId: "tc-2",

                                    projectId: "p2",

                                    projectName: "home",

                                    status: "failed",

                                    startedAt: 1000,

                                    finishedAt: 4000,

                                    duration: 3000,

                                    error:
                                        "boom",
                                },
                            ],
                        },
                    );

                expect(
                    result.status,
                ).toBe("failed");

                expect(
                    result.total,
                ).toBe(2);

                expect(
                    result.passed,
                ).toBe(1);

                expect(
                    result.failed,
                ).toBe(1);

                expect(
                    result.stopped,
                ).toBe(0);

                expect(
                    result.duration,
                ).toBe(4000);

                expect(
                    result.concurrency,
                ).toBe(2);
            },
        );

        it(
            "marks the suite stopped when any test case stops",
            () => {
                const result =
                    buildSuiteRunResultFromParallel(
                        {
                            ...base,

                            records: [
                                {
                                    testCaseId: "tc-1",

                                    projectId: "p1",

                                    projectName: "login",

                                    status: "stopped",

                                    startedAt: 1000,

                                    finishedAt: 1500,

                                    duration: 500,
                                },
                                {
                                    testCaseId: "tc-2",

                                    projectId: "p2",

                                    projectName: "home",

                                    status: "passed",

                                    startedAt: 1000,

                                    finishedAt: 2500,

                                    duration: 1500,
                                },
                            ],
                        },
                    );

                expect(
                    result.status,
                ).toBe("stopped");

                expect(
                    result.stopped,
                ).toBe(1);
            },
        );

        it(
            "computes duration trends and marks the slowest",
            () => {
                const result =
                    buildSuiteRunResultFromParallel(
                        {
                            ...base,

                            records: [
                                {
                                    testCaseId: "tc-1",

                                    projectId: "p1",

                                    projectName: "login",

                                    status: "passed",

                                    startedAt: 1000,

                                    finishedAt: 2000,

                                    duration: 1000,
                                },
                                {
                                    testCaseId: "tc-2",

                                    projectId: "p2",

                                    projectName: "checkout",

                                    status: "passed",

                                    startedAt: 1000,

                                    finishedAt: 6000,

                                    duration: 5000,
                                },
                            ],
                        },
                    );

                expect(
                    result.durationTrends,
                ).toHaveLength(2);

                const slowest =
                    result
                        .durationTrends?.find(
                            (trend) =>
                                trend.slowest,
                        );

                expect(
                    slowest?.label,
                ).toBe("checkout");
            },
        );
    },
);
