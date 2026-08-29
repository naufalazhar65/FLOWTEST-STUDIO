import {
    describe,
    expect,
    it,
} from "vitest";

import {
    flowLabel,
    flowOutputPaths,
    normalizeId,
    planSuiteBatches,
    summarizeRunResults,
} from "./suite-batches.mjs";

describe("normalizeId", () => {
    it("returns a safe slug for a label with spaces and case", () => {
        expect(
            normalizeId(
                "Android Login Flow",
            ),
        ).toBe(
            "android-login-flow",
        );
    });

    it("removes trailing separators", () => {
        expect(
            normalizeId(
                "Login Flow -",
            ),
        ).toBe(
            "login-flow",
        );
    });

    it("falls back for an empty input", () => {
        expect(
            normalizeId(
                "",
            ),
        ).toBe(
            "flow",
        );
    });
});

describe("flowLabel", () => {
    it("returns the basename without extension", () => {
        expect(
            flowLabel(
                "/tmp/android/loginTest.flow",
            ),
        ).toBe(
            "loginTest",
        );
    });
});

describe("planSuiteBatches", () => {
    it("groups flows into full batches up to concurrency", () => {
        const plan =
            planSuiteBatches({
                flowCount: 7,
                concurrency: 3,
            });

        expect(plan.total).toBe(7);

        expect(
            plan.batches.map(
                (batch) =>
                    batch.batchSize,
            ),
        ).toEqual([
            3,
            3,
            1,
        ]);
    });

    it("floors concurrency to at least 1", () => {
        const plan =
            planSuiteBatches({
                flowCount: 4,
                concurrency: 0,
            });

        expect(
            plan.batches.map(
                (batch) =>
                    batch.batchSize,
            ),
        ).toEqual([
            1,
            1,
            1,
            1,
        ]);
    });

    it("returns empty for zero flows", () => {
        const plan =
            planSuiteBatches({
                flowCount: 0,
                concurrency: 2,
            });

        expect(plan.batches).toEqual([]);

        expect(plan.total).toBe(0);
    });
});

describe("flowOutputPaths", () => {
    it("builds unique artifact dir and report path from a label", () => {
        const paths =
            flowOutputPaths({
                outputDirectory:
                    "artifacts/execution",
                flowPath:
                    "/tmp/Login Flow.flow",
            });

        expect(paths.label).toBe(
            "Login Flow",
        );

        expect(paths.artifactDir).toMatch(
            /Login%20Flow|login-flow|Login.Flow/,
        );

        expect(paths.reportPath).toContain(
            "login-flow.junit.xml",
        );
    });
});

describe("summarizeRunResults", () => {
    it("counts passed and failed flows", () => {
        const summary =
            summarizeRunResults([
                {
                    label: "a",
                    exitCode: 0,
                    reportPath: "a.xml",
                },
                {
                    label: "b",
                    exitCode: 1,
                    reportPath: "b.xml",
                },
                {
                    label: "c",
                    exitCode: 0,
                    reportPath: "c.xml",
                },
            ]);

        expect(summary.total).toBe(3);

        expect(summary.passed).toBe(2);

        expect(summary.failed).toBe(1);
    });
});
