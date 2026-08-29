import {
    describe,
    expect,
    it,
} from "vitest";

import {
    mkdtemp,
} from "node:fs/promises";

import {
    tmpdir,
} from "node:os";

import {
    join,
} from "node:path";

import {
    planSuiteTestFlows,
    readExecutionRecord,
    writeSuiteFlows,
} from "./suite-flow.mjs";

describe("planSuiteTestFlows", () => {
    it("returns only enabled test cases as flow descriptors", () => {
        const flows =
            planSuiteTestFlows({
                id: "suite-1",
                name: "smoke",
                testCases: [
                    {
                        id: "tc-1",
                        enabled: true,
                        projectName: "login",
                        project: {
                            id: "p1",
                            nodes: [],
                            edges: [],
                        },
                    },
                    {
                        id: "tc-2",
                        enabled: false,
                        projectName: "home",
                        project: {
                            id: "p2",
                            nodes: [],
                            edges: [],
                        },
                    },
                ],
            });

        expect(flows).toHaveLength(1);

        expect(flows[0].testCaseId).toBe(
            "tc-1",
        );

        expect(
            flows[0].projectName,
        ).toBe("login");
    });
});

describe("writeSuiteFlows", () => {
    it("writes a flow file and artifact dir per test case", async () => {
        const dir =
            await mkdtemp(
                join(
                    tmpdir(),
                    "suite-flow-",
                ),
            );

        const written =
            await writeSuiteFlows({
                outputDirectory:
                    dir,
                flows: [
                    {
                        testCaseId:
                            "tc-1",
                        projectName:
                            "login",
                        project: {
                            id: "p1",
                            name: "login",
                            createdAt: "2026-01-01T00:00:00.000Z",
                            updatedAt: "2026-01-01T00:00:00.000Z",
                            nodes: [],
                            edges: [],
                        },
                    },
                ],
            });

        expect(written).toHaveLength(1);

        expect(written[0].flowPath).toMatch(
            /tc-1\.flow$/,
        );

        expect(
            written[0].artifactDir,
        ).toMatch(/tc-1$/);
    });
});

describe("readExecutionRecord", () => {
    it("marks a flow as passed with execution timing", async () => {
        const dir =
            await mkdtemp(
                join(
                    tmpdir(),
                    "suite-flow-",
                ),
            );

        const record =
            await readExecutionRecord({
                artifactDir: dir,
                testCaseId: "tc-1",
                projectId: "p1",
                projectName: "login",
                exitCode: 0,
                startedAt: 1000,
                finishedAt: 5000,
            });

        expect(record.status).toBe(
            "passed",
        );

        expect(record.startedAt).toBe(1000);

        expect(record.finishedAt).toBe(5000);
    });

    it("marks a flow as failed with an error when it did not pass", async () => {
        const dir =
            await mkdtemp(
                join(
                    tmpdir(),
                    "suite-flow-",
                ),
            );

        const record =
            await readExecutionRecord({
                artifactDir: dir,
                testCaseId: "tc-2",
                projectId: "p2",
                projectName: "home",
                exitCode: 1,
                startedAt: 1000,
                finishedAt: 3000,
            });

        expect(record.status).toBe(
            "failed",
        );

        expect(
            record.error,
        ).toContain("exit 1");
    });
});
