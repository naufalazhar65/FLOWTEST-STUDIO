import {
    describe,
    expect,
    it,
} from "vitest";

import {
    normalizeTestCaseFlowResponse,
} from "./normalizeTestCaseFlow.mjs";

describe(
    "normalizeTestCaseFlowResponse",
    () => {
        it(
            "normalizes a valid flow plan",
            () => {
                const result =
                    normalizeTestCaseFlowResponse(
                        {
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
                                            "input",

                                        title:
                                            "Input Username",

                                        description:
                                            "Enter username.",

                                        locatorStrategy:
                                            "accessibilityId",

                                        locator:
                                            "username",

                                        text:
                                            "demo-user",
                                    },

                                    {
                                        id:
                                            "step-2",

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

                                    {
                                        id:
                                            "step-3",

                                        action:
                                            "assert",

                                        title:
                                            "Verify Dashboard",

                                        description:
                                            "Verify Dashboard.",

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
                        },
                        "TC-001",
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result.testCaseId,
                ).toBe(
                    "TC-001",
                );

                expect(
                    result.flowPlan.steps,
                ).toHaveLength(
                    3,
                );
            },
        );

        it(
            "rejects tap without locator",
            () => {
                const result =
                    normalizeTestCaseFlowResponse(
                        {
                            testCaseId:
                                "TC-001",

                            flowPlan: {
                                type:
                                    "flow_plan",

                                summary:
                                    "Invalid flow",

                                steps: [
                                    {
                                        action:
                                            "tap",

                                        title:
                                            "Tap Login",
                                    },
                                ],
                            },
                        },
                        "TC-001",
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );

        it(
            "rejects input without text",
            () => {
                const result =
                    normalizeTestCaseFlowResponse(
                        {
                            testCaseId:
                                "TC-001",

                            flowPlan: {
                                type:
                                    "flow_plan",

                                summary:
                                    "Invalid flow",

                                steps: [
                                    {
                                        action:
                                            "input",

                                        locatorStrategy:
                                            "id",

                                        locator:
                                            "username",
                                    },
                                ],
                            },
                        },
                        "TC-001",
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );

        it(
            "rejects unsupported actions",
            () => {
                const result =
                    normalizeTestCaseFlowResponse(
                        {
                            testCaseId:
                                "TC-001",

                            flowPlan: {
                                type:
                                    "flow_plan",

                                summary:
                                    "Invalid flow",

                                steps: [
                                    {
                                        action:
                                            "navigate",
                                    },
                                ],
                            },
                        },
                        "TC-001",
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );

        it(
            "uses the fallback test case id",
            () => {
                const result =
                    normalizeTestCaseFlowResponse(
                        {
                            flowPlan: {
                                type:
                                    "flow_plan",

                                summary:
                                    "Login flow",

                                steps: [],
                            },
                        },
                        "TC-001",
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result.testCaseId,
                ).toBe(
                    "TC-001",
                );
            },
        );

        it(
    "rejects a partial flow when an expected step count is provided",
    () => {
        const result =
            normalizeTestCaseFlowResponse(
                {
                    testCaseId:
                        "TC-001",

                    flowPlan: {
                        type:
                            "flow_plan",

                        summary:
                            "Partial flow",

                        steps: [
                            {
                                id:
                                    "step-1",

                                sourceStepOrder:
                                    1,

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
                    },
                },
                "TC-001",
                4,
            );

        expect(
            result,
        ).toBeNull();
    },
);

it(
    "accepts a complete one-to-one flow mapping",
    () => {
        const result =
            normalizeTestCaseFlowResponse(
                {
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
                                    "Enter password.",

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
                                    "Tap Login.",

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
                                    "Verify Dashboard.",

                                actual:
                                    "Dashboard",

                                operator:
                                    "contains",

                                expected:
                                    "Dashboard",
                            },
                        ],
                    },
                },
                "TC-001",
                4,
            );

        expect(
            result,
        ).not.toBeNull();

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
    },
);
    },
);