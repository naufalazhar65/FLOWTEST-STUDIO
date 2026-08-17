import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    convertTestCaseToFlow,
} from "./convertTestCaseToFlow.mjs";

const testCase = {
    id:
        "TC-001",

    title:
        "Login with valid credentials",

    priority:
        "high",

    type:
        "functional",

    preconditions: [
        "User is on the login screen.",
    ],

    steps: [
        {
            order:
                1,

            action:
                "Enter a valid username into the username field.",

            testData:
                "valid_user",
        },

        {
            order:
                2,

            action:
                "Enter a valid password into the password field.",

            testData:
                "valid_password",
        },

        {
            order:
                3,

            action:
                "Tap the Login button.",
        },

        {
            order:
                4,

            action:
                "Verify that the Dashboard screen is displayed.",

            expected:
                "Dashboard",
        },
    ],

    expectedResult:
        "User is redirected to the Dashboard screen.",
};

const context = {
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
};

function createOllamaResponse(
    payload,
) {
    return new Response(
        JSON.stringify({
            message: {
                content:
                    JSON.stringify(
                        payload,
                    ),
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
    );
}

function createValidFlowPayload() {
    return {
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

                    sourceStepOrder:
                        1,

                    action:
                        "input",

                    title:
                        "Input Username",

                    description:
                        "Enter the valid username.",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "username",

                    text:
                        "valid_user",
                },

                {
                    id:
                        "step-2",

                    sourceStepOrder:
                        2,

                    action:
                        "input",

                    title:
                        "Input Password",

                    description:
                        "Enter the valid password.",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "password",

                    text:
                        "valid_password",
                },

                {
                    id:
                        "step-3",

                    sourceStepOrder:
                        3,

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

                {
                    id:
                        "step-4",

                    sourceStepOrder:
                        4,

                    action:
                        "assert",

                    title:
                        "Verify Dashboard",

                    description:
                        "Verify that Dashboard is visible.",

                    actual:
                        "Dashboard",

                    operator:
                        "contains",

                    expected:
                        "Dashboard",
                },
            ],

            warnings: [],
        },
    };
}

describe(
    "convertTestCaseToFlow",
    () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it(
            "converts every test case step into a flow step",
            async () => {
                vi.stubGlobal(
                    "fetch",
                    vi.fn(
                        async () =>
                            createOllamaResponse(
                                createValidFlowPayload(),
                            ),
                    ),
                );

                const result =
                    await convertTestCaseToFlow(
                        testCase,
                        context,
                    );

                expect(
                    result.testCaseId,
                ).toBe(
                    "TC-001",
                );

                expect(
                    result.flowPlan.steps,
                ).toHaveLength(
                    4,
                );

                expect(
                    result.flowPlan.steps.map(
                        (step) =>
                            step.action,
                    ),
                ).toEqual([
                    "input",
                    "input",
                    "tap",
                    "assert",
                ]);

                expect(
                    result.flowPlan.steps[0]
                        .locator,
                ).toBe(
                    "username",
                );

                expect(
                    result.flowPlan.steps[0]
                        .text,
                ).toBe(
                    "valid_user",
                );

                expect(
                    result.flowPlan.steps[1]
                        .locator,
                ).toBe(
                    "password",
                );

                expect(
                    result.flowPlan.steps[1]
                        .text,
                ).toBe(
                    "valid_password",
                );

                expect(
                    result.flowPlan.steps[2]
                        .locator,
                ).toBe(
                    "Login",
                );

                expect(
                    result.flowPlan.steps[3]
                        .actual,
                ).toBe(
                    "Dashboard",
                );

                expect(
                    result.flowPlan.steps[3]
                        .operator,
                ).toBe(
                    "contains",
                );

                expect(
                    result.flowPlan.steps[3]
                        .expected,
                ).toBe(
                    "Dashboard",
                );
            },
        );

        it(
            "rejects a partial flow plan",
            async () => {
                const partialPayload = {
                    testCaseId:
                        "TC-001",

                    flowPlan: {
                        type:
                            "flow_plan",

                        summary:
                            "Incomplete login flow",

                        steps: [
                            {
                                id:
                                    "step-1",

                                sourceStepOrder:
                                    3,

                                action:
                                    "tap",

                                title:
                                    "Tap Login",

                                description:
                                    "Tap Login.",

                                locatorStrategy:
                                    "accessibilityId",

                                locator:
                                    "Login",
                            },
                        ],

                        warnings: [],
                    },
                };

                vi.stubGlobal(
                    "fetch",
                    vi.fn(
                        async () =>
                            createOllamaResponse(
                                partialPayload,
                            ),
                    ),
                );

                await expect(
                    convertTestCaseToFlow(
                        testCase,
                        context,
                    ),
                ).rejects.toThrow(
                    "Expected 4 flow step(s).",
                );
            },
        );

        it(
            "rejects a flow with duplicated source step orders",
            async () => {
                const invalidPayload =
                    createValidFlowPayload();

                invalidPayload.flowPlan.steps[3]
                    .sourceStepOrder =
                    3;

                vi.stubGlobal(
                    "fetch",
                    vi.fn(
                        async () =>
                            createOllamaResponse(
                                invalidPayload,
                            ),
                    ),
                );

                await expect(
                    convertTestCaseToFlow(
                        testCase,
                        context,
                    ),
                ).rejects.toThrow(
                    "Expected 4 flow step(s).",
                );
            },
        );

        it(
            "rejects an invalid test case",
            async () => {
                await expect(
                    convertTestCaseToFlow(
                        null,
                        context,
                    ),
                ).rejects.toThrow(
                    "testCase is required.",
                );
            },
        );

        it(
            "propagates Ollama errors",
            async () => {
                vi.stubGlobal(
                    "fetch",
                    vi.fn(
                        async () =>
                            new Response(
                                "Unavailable",
                                {
                                    status:
                                        503,
                                },
                            ),
                    ),
                );

                await expect(
                    convertTestCaseToFlow(
                        testCase,
                        context,
                    ),
                ).rejects.toThrow(
                    "Ollama flow conversion request failed (503): Unavailable",
                );
            },
        );

        it(
    "repairs an incomplete dashboard assertion",
    async () => {
        const payload = {
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

                        sourceStepOrder:
                            1,

                        action:
                            "input",

                        title:
                            "Input Username",

                        description:
                            "Enter username.",

                        locatorStrategy:
                            "id",

                        locator:
                            "username",

                        text:
                            "valid_username",
                    },

                    {
                        id:
                            "step-2",

                        sourceStepOrder:
                            2,

                        action:
                            "input",

                        title:
                            "Input Password",

                        description:
                            "Enter password.",

                        locatorStrategy:
                            "id",

                        locator:
                            "password",

                        text:
                            "valid_password",
                    },

                    {
                        id:
                            "step-3",

                        sourceStepOrder:
                            3,

                        action:
                            "tap",

                        title:
                            "Tap Login",

                        description:
                            "Tap Login.",

                        locatorStrategy:
                            "id",

                        locator:
                            "login",
                    },

                    {
                        id:
                            "step-4",

                        sourceStepOrder:
                            4,

                        action:
                            "assert",

                        title:
                            "Assert Dashboard",

                        description:
                            "Verify Dashboard screen is displayed.",

                        locatorStrategy:
                            "screen",

                        locator:
                            "dashboard",

                        actual:
                            null,

                        operator:
                            "contains",

                        expected:
                            "Dashboard screen is displayed",
                    },
                ],

                warnings: [],
            },
        };

        vi.stubGlobal(
            "fetch",
            vi.fn(
                async () =>
                    new Response(
                        JSON.stringify({
                            message: {
                                content:
                                    JSON.stringify(
                                        payload,
                                    ),
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
            ),
        );

        const result =
            await convertTestCaseToFlow(
                testCase,
                context,
            );

        expect(
            result.flowPlan.steps,
        ).toHaveLength(
            4,
        );

        const assertion =
            result.flowPlan.steps[3];

        expect(
            assertion.action,
        ).toBe(
            "assert",
        );

        expect(
            assertion.actual,
        ).toBe(
            "Dashboard",
        );

        expect(
            assertion.operator,
        ).toBe(
            "contains",
        );

        expect(
            assertion.expected,
        ).toBe(
            "Dashboard",
        );

        expect(
            assertion.locatorStrategy,
        ).toBeNull();

        expect(
            assertion.locator,
        ).toBeNull();
    },
);
    },
);