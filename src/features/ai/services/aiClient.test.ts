import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    convertAITestCaseToFlow,
    generateAITestCases,
} from "./aiClient";

import type {
    AITestCaseFlowRequest,
} from "../types/AITestCaseFlow";

const fetchMock =
    vi.fn();

vi.stubGlobal(
    "fetch",
    fetchMock,
);

describe(
    "aiClient",
    () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        describe(
            "generateAITestCases",
            () => {
                it(
                    "generates test cases from a requirement",
                    async () => {
                        fetchMock.mockResolvedValue(
                            new Response(
                                JSON.stringify({
                                    requirement:
                                        "User should be able to log in with valid credentials.",

                                    testCases: [
                                        {
                                            id:
                                                "TC-001",

                                            title:
                                                "Login with valid credentials",

                                            description:
                                                "Verify successful login.",

                                            priority:
                                                "high",

                                            type:
                                                "functional",

                                            preconditions: [
                                                "User is on the login screen",
                                            ],

                                            steps: [
                                                {
                                                    order:
                                                        1,

                                                    action:
                                                        "Enter username",
                                                },

                                                {
                                                    order:
                                                        2,

                                                    action:
                                                        "Enter password",
                                                },

                                                {
                                                    order:
                                                        3,

                                                    action:
                                                        "Tap Login",
                                                },
                                            ],

                                            expectedResult:
                                                "User reaches the home screen.",
                                        },
                                    ],
                                }),
                                {
                                    status:
                                        200,

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                },
                            ),
                        );

                        const result =
                            await generateAITestCases(
                                "User should be able to log in with valid credentials.",
                            );

                        expect(
                            result.requirement,
                        ).toBe(
                            "User should be able to log in with valid credentials.",
                        );

                        expect(
                            result.testCases,
                        ).toHaveLength(
                            1,
                        );

                        expect(
                            result.testCases[0].id,
                        ).toBe(
                            "TC-001",
                        );

                        expect(
                            result.testCases[0]
                                .title,
                        ).toBe(
                            "Login with valid credentials",
                        );

                        expect(
                            result.testCases[0]
                                .steps,
                        ).toHaveLength(
                            3,
                        );

                        expect(
                            fetchMock,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        const [
                            url,
                            options,
                        ] =
                            fetchMock.mock
                                .calls[0];

                        expect(
                            url,
                        ).toContain(
                            "/api/ai/test-cases",
                        );

                        expect(
                            options.method,
                        ).toBe(
                            "POST",
                        );

                        expect(
                            options.headers[
                            "Content-Type"
                            ],
                        ).toBe(
                            "application/json",
                        );

                        expect(
                            JSON.parse(
                                options.body,
                            ),
                        ).toEqual({
                            requirement:
                                "User should be able to log in with valid credentials.",
                        });
                    },
                );

                it(
                    "throws the server error message",
                    async () => {
                        fetchMock.mockResolvedValue(
                            new Response(
                                JSON.stringify({
                                    error:
                                        "Requirement is required.",
                                }),
                                {
                                    status:
                                        400,

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                },
                            ),
                        );

                        await expect(
                            generateAITestCases(
                                "",
                            ),
                        ).rejects.toThrow(
                            "Requirement is required.",
                        );
                    },
                );

                it(
                    "throws when the response does not contain test cases",
                    async () => {
                        fetchMock.mockResolvedValue(
                            new Response(
                                JSON.stringify({
                                    requirement:
                                        "Verify login.",
                                }),
                                {
                                    status:
                                        200,

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                },
                            ),
                        );

                        await expect(
                            generateAITestCases(
                                "Verify login.",
                            ),
                        ).rejects.toThrow(
                            "AI test-case response did not contain valid test cases.",
                        );
                    },
                );
            },
        );

        describe(
            "convertAITestCaseToFlow",
            () => {
                const request:
                    AITestCaseFlowRequest =
                {
                    testCase: {
                        id:
                            "TC-001",

                        title:
                            "Login with valid credentials",

                        description:
                            "Verify successful login.",

                        priority:
                            "high",

                        type:
                            "functional",

                        preconditions: [],

                        steps: [
                            {
                                order:
                                    1,

                                action:
                                    "Tap Login",
                            },
                        ],

                        expectedResult:
                            "Login succeeds.",
                    },

                    context: {
                        selectedNodeId:
                            null,

                        selectedNode:
                            null,

                        nodes: [],

                        edges: [],

                        nodeCount:
                            0,

                        edgeCount:
                            0,
                    },
                };

                it(
                    "converts an approved test case into a flow plan",
                    async () => {
                        fetchMock.mockResolvedValue(
                            new Response(
                                JSON.stringify({
                                    testCaseId:
                                        "TC-001",

                                    flowPlan: {
                                        type:
                                            "flow_plan",

                                        summary:
                                            "Login flow",

                                        steps: [
                                            {
                                                id:
                                                    "step-1",

                                                action:
                                                    "tap",

                                                title:
                                                    "Tap Login",

                                                description:
                                                    "Tap the Login button.",

                                                locatorStrategy:
                                                    "accessibilityId",

                                                locator:
                                                    "Login",
                                            },
                                        ],

                                        warnings: [],
                                    },
                                }),
                                {
                                    status:
                                        200,

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                },
                            ),
                        );

                        const result =
                            await convertAITestCaseToFlow(
                                request,
                            );

                        expect(
                            result.testCaseId,
                        ).toBe(
                            "TC-001",
                        );

                        expect(
                            result.flowPlan.type,
                        ).toBe(
                            "flow_plan",
                        );

                        expect(
                            result.flowPlan.summary,
                        ).toBe(
                            "Login flow",
                        );

                        expect(
                            result.flowPlan.steps,
                        ).toHaveLength(
                            1,
                        );

                        expect(
                            result.flowPlan
                                .steps[0]
                                .action,
                        ).toBe(
                            "tap",
                        );

                        expect(
                            result.flowPlan
                                .steps[0]
                                .locatorStrategy,
                        ).toBe(
                            "accessibilityId",
                        );

                        expect(
                            result.flowPlan
                                .steps[0]
                                .locator,
                        ).toBe(
                            "Login",
                        );

                        expect(
                            fetchMock,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        const [
                            url,
                            options,
                        ] =
                            fetchMock.mock
                                .calls[0];

                        expect(
                            url,
                        ).toContain(
                            "/api/ai/test-cases/to-flow",
                        );

                        expect(
                            options.method,
                        ).toBe(
                            "POST",
                        );

                        expect(
                            options.headers[
                            "Content-Type"
                            ],
                        ).toBe(
                            "application/json",
                        );

                        expect(
                            JSON.parse(
                                options.body,
                            ),
                        ).toEqual(
                            request,
                        );
                    },
                );

                it(
                    "throws the server error message",
                    async () => {
                        fetchMock.mockResolvedValue(
                            new Response(
                                JSON.stringify({
                                    error:
                                        "testCase is required.",
                                }),
                                {
                                    status:
                                        400,

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                },
                            ),
                        );

                        await expect(
                            convertAITestCaseToFlow(
                                request,
                            ),
                        ).rejects.toThrow(
                            "testCase is required.",
                        );
                    },
                );

                it(
                    "throws when the response does not contain a valid flow plan",
                    async () => {
                        fetchMock.mockResolvedValue(
                            new Response(
                                JSON.stringify({
                                    testCaseId:
                                        "TC-001",
                                }),
                                {
                                    status:
                                        200,

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                },
                            ),
                        );

                        await expect(
                            convertAITestCaseToFlow(
                                request,
                            ),
                        ).rejects.toThrow(
                            "AI test-case flow response did not contain a valid flow plan.",
                        );
                    },
                );
            },
        );
    },
);