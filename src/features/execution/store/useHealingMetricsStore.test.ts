import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    summarizeHealingMetrics,
    useHealingMetricsStore,
} from "./useHealingMetricsStore";

describe(
    "useHealingMetricsStore",
    () => {
        beforeEach(() => {
            useHealingMetricsStore.setState({
                events: [],
            });
        });

        it(
            "records a healed event when self-healing is applied",
            () => {
                useHealingMetricsStore
                    .getState()
                    .recordHealingResult({
                        projectId:
                            "p1",

                        strategy:
                            "modification",

                        result: {
                            status:
                                "applied",

                            attempted:
                                true,

                            rerunAttempted:
                                true,

                            rerunSucceeded:
                                true,

                            healingAttempts:
                                1,

                            error:
                                null,
                        },
                    });

                const events =
                    useHealingMetricsStore
                        .getState()
                        .events;

                expect(
                    events.length,
                ).toBe(1);

                expect(
                    events[0].kind,
                ).toBe("healed");

                expect(
                    events[0].strategy,
                ).toBe(
                    "modification",
                );

                expect(
                    events[0].rerunSucceeded,
                ).toBe(true);

                expect(
                    events[0].projectId,
                ).toBe("p1");
            },
        );

        it(
            "records a healingFailed event when healing fails",
            () => {
                useHealingMetricsStore
                    .getState()
                    .recordHealingResult({
                        projectId:
                            "p1",

                        strategy:
                            "modification",

                        result: {
                            status:
                                "failed",

                            attempted:
                                true,

                            rerunAttempted:
                                true,

                            rerunSucceeded:
                                false,

                            healingAttempts:
                                1,

                            error:
                                "Rerun failed.",
                        },
                    });

                expect(
                    useHealingMetricsStore
                        .getState()
                        .events[0].kind,
                ).toBe(
                    "healingFailed",
                );
            },
        );

        it(
            "skips skipped healing results",
            () => {
                useHealingMetricsStore
                    .getState()
                    .recordHealingResult({
                        projectId:
                            "p1",

                        strategy:
                            "none",

                        result: {
                            status:
                                "skipped",

                            attempted:
                                false,

                            rerunAttempted:
                                false,

                            rerunSucceeded:
                                false,

                            healingAttempts:
                                0,

                            error:
                                null,
                        },
                    });

                expect(
                    useHealingMetricsStore
                        .getState()
                        .events.length,
                ).toBe(0);
            },
        );

        it(
            "records a rejected healing event",
            () => {
                useHealingMetricsStore
                    .getState()
                    .recordRejectedHealing(
                        "p1",
                        "modification",
                    );

                const event =
                    useHealingMetricsStore
                        .getState()
                        .events[0];

                expect(
                    event.kind,
                ).toBe("rejected");

                expect(
                    event.projectId,
                ).toBe("p1");
            },
        );

        it(
            "summarizes healing metrics",
            () => {
                useHealingMetricsStore
                    .getState()
                    .recordHealingResult({
                        projectId:
                            "p1",

                        strategy:
                            "modification",

                        result: {
                            status:
                                "applied",

                            attempted:
                                true,

                            rerunAttempted:
                                true,

                            rerunSucceeded:
                                true,

                            healingAttempts:
                                1,

                            error:
                                null,
                        },
                    });

                useHealingMetricsStore
                    .getState()
                    .recordHealingResult({
                        projectId:
                            "p1",

                        strategy:
                            "modification",

                        result: {
                            status:
                                "failed",

                            attempted:
                                true,

                            rerunAttempted:
                                true,

                            rerunSucceeded:
                                false,

                            healingAttempts:
                                1,

                            error:
                                "Fail.",
                        },
                    });

                useHealingMetricsStore
                    .getState()
                    .recordRejectedHealing(
                        "p1",
                        "modification",
                    );

                const summary =
                    summarizeHealingMetrics(
                        useHealingMetricsStore
                            .getState()
                            .events,
                    );

                expect(
                    summary.total,
                ).toBe(3);

                expect(
                    summary.healed,
                ).toBe(1);

                expect(
                    summary.healingFailed,
                ).toBe(1);

                expect(
                    summary.rejected,
                ).toBe(1);

                expect(
                    summary.rerunAttempted,
                ).toBe(2);

                expect(
                    summary.rerunSucceeded,
                ).toBe(1);
            },
        );

        it(
            "clear removes events for a project",
            () => {
                useHealingMetricsStore
                    .getState()
                    .recordRejectedHealing(
                        "p1",
                        "modification",
                    );

                useHealingMetricsStore
                    .getState()
                    .recordRejectedHealing(
                        "p2",
                        "modification",
                    );

                useHealingMetricsStore
                    .getState()
                    .clear("p1");

                const events =
                    useHealingMetricsStore
                        .getState()
                        .events;

                expect(
                    events.length,
                ).toBe(1);

                expect(
                    events[0].projectId,
                ).toBe("p2");
            },
        );

        it(
            "clear with no project clears all events",
            () => {
                useHealingMetricsStore
                    .getState()
                    .recordRejectedHealing(
                        "p1",
                        "modification",
                    );

                useHealingMetricsStore
                    .getState()
                    .clear();

                expect(
                    useHealingMetricsStore
                        .getState()
                        .events.length,
                ).toBe(0);
            },
        );
    },
);
