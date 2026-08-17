import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildSelfHealingPlan,
} from "./buildSelfHealingPlan";

import type {
    ExecutionFailureAnalysis,
} from "./analyzeExecutionFailure";

import type {
    AIModificationPlan,
} from "../../ai/types/AIModificationPlan";

function createAnalysis(
    autoApplicable: boolean,
    fixType = "reviewLocator",
): ExecutionFailureAnalysis {
    return {
        context: {
            node: {
                id:
                    "node-1",

                action:
                    "tap",

                title:
                    "Tap Login",

                subtitle:
                    "Tap login",

                locatorStrategy:
                    "accessibilityId",

                locator:
                    "Login",
            },

            execution: {
                nodeId:
                    "node-1",

                nodeType:
                    "tap",

                nodeTitle:
                    "Tap Login",

                status:
                    "failed",

                startedAt:
                    1000,

                finishedAt:
                    1500,

                duration:
                    500,

                error:
                    "Element not found",
            },

            previousNodeIds: [],

            nextNodeIds: [],
        },

        classification: {
            category:
                "elementNotFound",

            confidence:
                "high",

            evidence: [
                "Element not found",
            ],
        },

        rootCause: {
            category:
                "staleLocator",

            title:
                "Target element could not be located",

            explanation:
                "The locator did not resolve.",

            confidence:
                "high",

            evidence: [
                "Element not found",
            ],

            likelyCauses: [
                "Stale locator",
            ],
        },

        suggestedFix: {
            type:
                fixType as
                    "reviewLocator",

            title:
                "Review locator",

            description:
                "Review locator",

            targetNodeId:
                "node-1",

            confidence:
                "high",

            reason:
                "Test reason",

            autoApplicable,
        },
    };
}

const modificationPlan:
    AIModificationPlan = {
        type:
            "modification_plan",

        summary:
            "Test modification",

        operation: {
            type:
                "updateNode",

            targetNodeId:
                "node-1",

            step: {
                action:
                    "tap",

                title:
                    "Tap Login",

                description:
                    "Tap login",

                locatorStrategy:
                    "accessibilityId",

                locator:
                    "Login",
            },
        },
    };

describe(
    "buildSelfHealingPlan",
    () => {
        it(
            "allows auto apply when a deterministic plan exists",
            () => {
                const result =
                    buildSelfHealingPlan(
                        createAnalysis(
                            true,
                        ),
                        modificationPlan,
                    );

                expect(
                    result.canAutoApply,
                ).toBe(
                    true,
                );

                expect(
                    result.strategy,
                ).toBe(
                    "modification",
                );

                expect(
                    result.modificationPlan,
                ).toEqual(
                    modificationPlan,
                );

                expect(
                    result.targetNodeId,
                ).toBe(
                    "node-1",
                );
            },
        );

        it(
            "requires manual review when no deterministic plan exists",
            () => {
                const result =
                    buildSelfHealingPlan(
                        createAnalysis(
                            true,
                        ),
                        null,
                    );

                expect(
                    result.canAutoApply,
                ).toBe(
                    false,
                );

                expect(
                    result.strategy,
                ).toBe(
                    "manual",
                );

                expect(
                    result.modificationPlan,
                ).toBeNull();
            },
        );

        it(
            "requires manual review when the fix is not auto applicable",
            () => {
                const result =
                    buildSelfHealingPlan(
                        createAnalysis(
                            false,
                        ),
                        modificationPlan,
                    );

                expect(
                    result.canAutoApply,
                ).toBe(
                    false,
                );

                expect(
                    result.strategy,
                ).toBe(
                    "manual",
                );

                expect(
                    result.modificationPlan,
                ).toBeNull();
            },
        );

        it(
            "returns none when no fix exists",
            () => {
                const result =
                    buildSelfHealingPlan(
                        createAnalysis(
                            false,
                            "none",
                        ),
                        null,
                    );

                expect(
                    result.canAutoApply,
                ).toBe(
                    false,
                );

                expect(
                    result.strategy,
                ).toBe(
                    "none",
                );
            },
        );
    },
);