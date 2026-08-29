import {
    describe,
    expect,
    it,
} from "vitest";

import {
    computeDurationTrends,
} from "./computeDurationTrends";

describe(
    "computeDurationTrends",
    () => {
        it(
            "computes per-label statistics and identifies the slowest",
            () => {
                const result =
                    computeDurationTrends(
                        [
                            {
                                label:
                                    "login",
                                duration: 100,
                            },
                            {
                                label:
                                    "login",
                                duration: 300,
                            },
                            {
                                label:
                                    "checkout",
                                duration: 5000,
                            },
                        ],
                    );

                expect(
                    result.trends,
                ).toHaveLength(2);

                expect(
                    result.slowest?.label,
                ).toBe(
                    "checkout",
                );

                const login =
                    result.trends.find(
                        (t) =>
                            t.label ===
                            "login",
                    );

                expect(
                    login?.average,
                ).toBe(200);

                expect(
                    login?.min,
                ).toBe(100);

                expect(
                    login?.max,
                ).toBe(300);

                expect(
                    login?.median,
                ).toBe(200);

                expect(
                    result.overall.total,
                ).toBe(5400);

                expect(
                    result.overall.average,
                ).toBe(1800);
            },
        );

        it(
            "returns a null slowest for no samples",
            () => {
                const result =
                    computeDurationTrends(
                        [],
                    );

                expect(
                    result.trends,
                ).toEqual([]);

                expect(
                    result.slowest,
                ).toBeNull();

                expect(
                    result.overall.average,
                ).toBe(0);
            },
        );
    },
);
