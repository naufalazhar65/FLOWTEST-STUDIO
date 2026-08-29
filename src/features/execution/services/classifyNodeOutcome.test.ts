import {
    describe,
    expect,
    it,
} from "vitest";

import {
    classifyNodeOutcome,
    summarizeFlakiness,
    type NodeOutcome,
} from "./classifyNodeOutcome";

interface NodeLike {
    status: string;

    attempts?: number;

    retries?: number;
}

function node(
    overrides: Partial<NodeLike> &
        Pick<NodeLike, "status">,
): NodeLike {
    return {
        status:
            overrides.status,

        attempts:
            overrides.attempts,

        retries:
            overrides.retries,
    };
}

describe(
    "classifyNodeOutcome",
    () => {
        it(
            "labels a first-try pass as deterministic",
            () => {
                expect(
                    classifyNodeOutcome(
                        node({
                            status:
                                "passed",
                        }),
                    ),
                ).toBe(
                    "deterministicPass",
                );
            },
        );

        it(
            "labels an explicit attempts=1 pass as deterministic",
            () => {
                expect(
                    classifyNodeOutcome(
                        node({
                            status:
                                "passed",
                            attempts: 1,
                            retries: 0,
                        }),
                    ),
                ).toBe(
                    "deterministicPass",
                );
            },
        );

        it(
            "labels a pass after retry as flaky using attempts",
            () => {
                expect(
                    classifyNodeOutcome(
                        node({
                            status:
                                "passed",
                            attempts: 3,
                        }),
                    ),
                ).toBe("flaky");
            },
        );

        it(
            "labels a pass after retry as flaky using retries",
            () => {
                expect(
                    classifyNodeOutcome(
                        node({
                            status:
                                "passed",
                            attempts: 1,
                            retries: 2,
                        }),
                    ),
                ).toBe("flaky");
            },
        );

        it(
            "labels a first-try failure as deterministic failure",
            () => {
                expect(
                    classifyNodeOutcome(
                        node({
                            status:
                                "failed",
                        }),
                    ),
                ).toBe(
                    "deterministicFailure",
                );
            },
        );

        it(
            "labels a failure after retries as transient failure",
            () => {
                expect(
                    classifyNodeOutcome(
                        node({
                            status:
                                "failed",
                            attempts: 2,
                        }),
                    ),
                ).toBe(
                    "transientFailure",
                );
            },
        );

        it(
            "labels idle/running nodes as not executed",
            () => {
                expect(
                    classifyNodeOutcome(
                        node({
                            status:
                                "idle",
                        }),
                    ),
                ).toBe(
                    "notExecuted",
                );

                expect(
                    classifyNodeOutcome(
                        node({
                            status:
                                "running",
                        }),
                    ),
                ).toBe(
                    "notExecuted",
                );
            },
        );
    },
);

describe(
    "summarizeFlakiness",
    () => {
        it(
            "counts each outcome and computes the flaky rate",
            () => {
                const summary =
                    summarizeFlakiness(
                        [
                            node({
                                status:
                                    "passed",
                            }),
                            node({
                                status:
                                    "passed",
                            }),
                            node({
                                status:
                                    "passed",
                                attempts: 2,
                            }),
                            node({
                                status:
                                    "failed",
                            }),
                            node({
                                status:
                                    "failed",
                                attempts: 3,
                            }),
                            node({
                                status:
                                    "idle",
                            }),
                        ],
                    );

                expect(summary).toEqual({
                    flaky: 1,

                    deterministicPass: 2,

                    deterministicFailure: 1,

                    transientFailure: 1,

                    notExecuted: 1,

                    flakyRate: 0.2,
                });
            },
        );

        it(
            "returns a zero flaky rate for no executed nodes",
            () => {
                const summary =
                    summarizeFlakiness(
                        [
                            node({
                                status:
                                    "idle",
                            }),
                        ],
                    );

                expect(
                    summary.flakyRate,
                ).toBe(0);
            },
        );

        it(
            "exposes valid outcome values",
            () => {
                const values: NodeOutcome[] =
                    [
                        "deterministicPass",
                        "flaky",
                        "transientFailure",
                        "deterministicFailure",
                        "notExecuted",
                    ];

                expect(
                    values.length,
                ).toBe(5);
            },
        );
    },
);
