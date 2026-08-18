import {
    describe,
    expect,
    it,
} from "vitest";

import type {
    ExecutionFailureAnalysis,
} from "./analyzeExecutionFailure";

import {
    buildFailureModificationPlan,
} from "./buildFailureModificationPlan";

import type {
    AIModificationPlanSingle,
} from "../../ai/types/AIModificationPlan";

interface CreateAnalysisOptions {
    fixType?: string;

    action?: string;

    locatorStrategy:
    | string
    | null;

    locator:
    | string
    | null;
}

function createAnalysis(
    options?: CreateAnalysisOptions,
): ExecutionFailureAnalysis {
    const fixType =
        options?.fixType ??
        "addWait";

    return {
        context: {
            node: {
                id:
                    "node-1",

                action:
                    options?.action ??
                    "tap",

                title:
                    "Tap Login",

                subtitle:
                    "Tap login",

                locatorStrategy:
                    options?.locatorStrategy ===
                        undefined
                        ? "accessibilityId"
                        : options.locatorStrategy,

                locator:
                    options?.locator ===
                        undefined
                        ? "Login"
                        : options.locator,
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
                    "Operation timed out",
            },

            previousNodeIds: [],

            previousNodes: [],

            nextNodeIds: [],

            nextNodes: [],
        },

        classification: {
            category:
                "timeout",

            confidence:
                "high",

            evidence: [
                "Operation timed out",
            ],
        },

        rootCause: {
            category:
                "elementNotReady",

            title:
                "Operation timed out",

            explanation:
                "Target was not ready.",

            confidence:
                "high",

            evidence: [
                "Operation timed out",
            ],

            likelyCauses: [
                "Element was not ready.",
            ],
        },

        suggestedFix: {
            type:
                fixType as
                | "addWait"
                | "reviewLocator"
                | "none",

            title:
                "Add synchronization",

            description:
                "Add wait.",

            targetNodeId:
                "node-1",

            confidence:
                "high",

            reason:
                "Timing issue.",

            autoApplicable:
                fixType ===
                "addWait",
        },
    };
}

describe(
    "buildFailureModificationPlan",
    () => {
        it(
            "creates an addNodeBefore wait plan for a timeout",
            () => {
                const result =
                    buildFailureModificationPlan(
                        createAnalysis(),
                    );

                expect(
                    result,
                ).not.toBeNull();

                if (!result) {
                    throw new Error(
                        "Expected modification plan.",
                    );
                }

                expect(
                    result.type,
                ).toBe(
                    "modification_plan",
                );

                if (
                    !("operation" in result)
                ) {
                    throw new Error(
                        "Expected a single modification operation.",
                    );
                }

                const singlePlan =
                    result as AIModificationPlanSingle;

                const operation =
                    singlePlan.operation;

                expect(
                    operation.type,
                ).toBe(
                    "addNodeBefore",
                );

                if (
                    operation.type ===
                    "deleteNode"
                ) {
                    throw new Error(
                        "Expected a step modification operation.",
                    );
                }

                expect(
                    operation.targetNodeId,
                ).toBe(
                    "node-1",
                );

                expect(
                    operation.step.action,
                ).toBe(
                    "wait",
                );

                expect(
                    operation.step
                        .locatorStrategy,
                ).toBe(
                    "accessibilityId",
                );

                expect(
                    operation.step.locator,
                ).toBe(
                    "Login",
                );

                expect(
                    operation.step.timeout,
                ).toBe(
                    10000,
                );

                expect(
                    operation.step
                        .pollingInterval,
                ).toBe(
                    500,
                );
            },
        );

        it(
            "does not add a wait to another wait node",
            () => {
                const result =
                    buildFailureModificationPlan(
                        createAnalysis({
                            action:
                                "wait",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        }),
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );

        it(
            "does not heal without a usable locator",
            () => {
                const result =
                    buildFailureModificationPlan(
                        createAnalysis({
                            locatorStrategy:
                                null,

                            locator:
                                null,
                        }),
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );

        it(
            "does not create a plan for non-wait fixes",
            () => {
                const result =
                    buildFailureModificationPlan(
                        createAnalysis({
                            fixType:
                                "reviewLocator",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        }),
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );
    },
);