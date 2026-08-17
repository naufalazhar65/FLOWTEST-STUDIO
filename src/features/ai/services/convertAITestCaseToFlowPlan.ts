import type {
    AITestCase,
    AITestCaseStep,
} from "../types/AITestCase";

import type {
    AIFlowPlan,
    AIFlowStep,
} from "../types/AIFlowPlan";

export interface AITestCaseFlowConversionResult {
    plan: AIFlowPlan;

    unresolvedSteps: AITestCaseStep[];
}

function convertStep(
    step: AITestCaseStep,
): AIFlowStep | null {
    const action =
        step.action
            .trim()
            .toLowerCase();

    /*
     * Explicit deterministic actions.
     *
     * These are only converted when the
     * test case already contains enough
     * structured information.
     */

    if (
        action === "delay"
    ) {
        return null;
    }

    if (
        action === "wait"
    ) {
        return null;
    }

    if (
        action === "assert"
    ) {
        return null;
    }

    if (
        action === "tap" ||
        action === "click"
    ) {
        return null;
    }

    if (
        action === "input" ||
        action === "type"
    ) {
        return null;
    }

    /*
     * Natural-language steps remain
     * unresolved until AI enrichment.
     */
    return null;
}

export function convertAITestCaseToFlowPlan(
    testCase: AITestCase,
): AITestCaseFlowConversionResult {
    const steps: AIFlowStep[] =
        [];

    const unresolvedSteps:
        AITestCaseStep[] =
        [];

    for (
        const testStep of
            testCase.steps
    ) {
        const flowStep =
            convertStep(
                testStep,
            );

        if (flowStep) {
            steps.push(
                flowStep,
            );
        } else {
            unresolvedSteps.push(
                testStep,
            );
        }
    }

    const warnings: string[] =
        [];

    if (
        unresolvedSteps.length >
        0
    ) {
        warnings.push(
            `${unresolvedSteps.length} test step(s) require AI enrichment before they can become executable FlowTest nodes.`,
        );
    }

    if (
        testCase.preconditions
            .length > 0
    ) {
        warnings.push(
            "Test case preconditions are preserved as metadata and are not converted into executable nodes yet.",
        );
    }

    return {
        plan: {
            type:
                "flow_plan",

            summary:
                `Flow generated from ${testCase.id}: ${testCase.title}`,

            steps,

            warnings,
        },

        unresolvedSteps,
    };
}