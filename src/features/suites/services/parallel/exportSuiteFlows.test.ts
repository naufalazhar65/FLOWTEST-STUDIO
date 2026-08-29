import {
    describe,
    expect,
    it,
} from "vitest";

import {
    planSuiteFlows,
} from "./exportSuiteFlows";

import type {
    TestSuite,
} from "../../types/TestSuite";

describe(
    "planSuiteFlows",
    () => {
        it(
            "derives a flow descriptor for each enabled test case",
            () => {
                const suite: TestSuite =
                    {
                        id: "suite-1",

                        projectId: "p1",

                        name: "smoke",

                        description: "",

                        createdAt:
                            "2026-01-01T00:00:00.000Z",

                        updatedAt:
                            "2026-01-01T00:00:00.000Z",

                        testCases: [
                            {
                                id: "tc-1",

                                projectId: "p1",

                                projectName: "login",

                                enabled: true,

                                project: {
                                    id: "p1",

                                    name: "login",

                                    createdAt: "2026-01-01T00:00:00.000Z",

                                    updatedAt: "2026-01-01T00:00:00.000Z",

                                    nodes: [],

                                    edges: [],
                                },
                            },
                            {
                                id: "tc-2",

                                projectId: "p2",

                                projectName: "home",

                                enabled: false,

                                project: {
                                    id: "p2",

                                    name: "home",

                                    createdAt: "2026-01-01T00:00:00.000Z",

                                    updatedAt: "2026-01-01T00:00:00.000Z",

                                    nodes: [],

                                    edges: [],
                                },
                            },
                        ],
                    };

                const flows =
                    planSuiteFlows(
                        suite,
                    );

                expect(
                    flows,
                ).toHaveLength(1);

                expect(
                    flows[0].testCaseId,
                ).toBe("tc-1");

                expect(
                    flows[0].projectName,
                ).toBe("login");

                expect(
                    flows[0].project.nodes,
                ).toEqual([]);
            },
        );

        it(
            "returns an empty list when no test case is enabled",
            () => {
                const suite: TestSuite =
                    {
                        id: "suite-2",

                        projectId: "p1",

                        name: "empty",

                        description: "",

                        createdAt: "2026-01-01T00:00:00.000Z",

                        updatedAt: "2026-01-01T00:00:00.000Z",

                        testCases: [
                            {
                                id: "tc-1",

                                projectId: "p1",

                                projectName: "login",

                                enabled: false,

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

                        lastRun: undefined,

                        runHistory: [],

                        concurrency: 2,
                    };

                expect(
                    planSuiteFlows(
                        suite,
                    ),
                ).toEqual([]);
            },
        );
    },
);
