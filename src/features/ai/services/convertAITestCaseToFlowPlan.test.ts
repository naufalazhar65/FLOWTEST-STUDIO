import {
    describe,
    expect,
    it,
} from "vitest";

import {
    convertAITestCaseToFlowPlan,
} from "./convertAITestCaseToFlowPlan";

import type {
    AITestCase,
} from "../types/AITestCase";

function createTestCase(): AITestCase {
    return {
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
            "User is on the login screen.",
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

            {
                order:
                    4,

                action:
                    "Verify Dashboard is visible",

                expected:
                    "Dashboard is visible.",
            },
        ],

        expectedResult:
            "User is redirected to the home screen.",
    };
}

describe(
    "convertAITestCaseToFlowPlan",
    () => {
        it(
            "creates a flow plan from an approved test case",
            () => {
                const result =
                    convertAITestCaseToFlowPlan(
                        createTestCase(),
                    );

                expect(
                    result.plan.type,
                ).toBe(
                    "flow_plan",
                );

                expect(
                    result.plan.summary,
                ).toContain(
                    "TC-001",
                );

                expect(
                    result.plan.summary,
                ).toContain(
                    "Login with valid credentials",
                );

                expect(
                    result.plan.steps,
                ).toHaveLength(
                    0,
                );

                expect(
                    result.unresolvedSteps,
                ).toHaveLength(
                    4,
                );
            },
        );

        it(
            "reports unresolved natural-language steps",
            () => {
                const result =
                    convertAITestCaseToFlowPlan(
                        createTestCase(),
                    );

                expect(
                    result.unresolvedSteps.map(
                        (step) =>
                            step.order,
                    ),
                ).toEqual([
                    1,
                    2,
                    3,
                    4,
                ]);

                expect(
                    result.plan.warnings,
                ).toContain(
                    "4 test step(s) require AI enrichment before they can become executable FlowTest nodes.",
                );
            },
        );

        it(
            "preserves precondition information as a warning",
            () => {
                const result =
                    convertAITestCaseToFlowPlan(
                        createTestCase(),
                    );

                expect(
                    result.plan.warnings,
                ).toContain(
                    "Test case preconditions are preserved as metadata and are not converted into executable nodes yet.",
                );
            },
        );

        it(
            "returns an empty plan for a test case without steps",
            () => {
                const testCase =
                    createTestCase();

                testCase.steps =
                    [];

                const result =
                    convertAITestCaseToFlowPlan(
                        testCase,
                    );

                expect(
                    result.plan.steps,
                ).toHaveLength(
                    0,
                );

                expect(
                    result.unresolvedSteps,
                ).toHaveLength(
                    0,
                );
            },
        );
    },
);