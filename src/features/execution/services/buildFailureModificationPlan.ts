import type {
    LocatorStrategy,
} from "../../execution/types/LocatorStrategy";

import type {
    ModificationPlan,
} from "../../modification/types/ModificationPlan";

import type {
    ExecutionFailureAnalysis,
} from "./analyzeExecutionFailure";

export function buildFailureModificationPlan(
    analysis:
        ExecutionFailureAnalysis,
): ModificationPlan | null {
    const fix =
        analysis.suggestedFix;

    if (
        fix.type !==
        "addWait"
    ) {
        return null;
    }

    const context =
        analysis.context;

    if (!context) {
        return null;
    }

    const targetNode =
        context.node;

    if (
        targetNode.action ===
        "wait"
    ) {
        return null;
    }

    if (
        !targetNode.locatorStrategy ||
        !targetNode.locator?.trim()
    ) {
        return null;
    }

    return {
        type:
            "modification_plan",

        summary:
            "Add synchronization before the failed action.",

        operation: {
            type:
                "addNodeBefore",

            targetNodeId:
                targetNode.id,

            step: {
                action:
                    "wait",

                title:
                    "Wait Until Element",

                description:
                    "Wait for the failed action target to become available before continuing.",

                locatorStrategy:
                    targetNode.locatorStrategy as LocatorStrategy,

                locator:
                    targetNode.locator,

                timeout:
                    10000,

                pollingInterval:
                    500,
            },
        },

        warnings: [
            "Self-healing added a synchronization step before the failed action. Re-run should be used to verify that the timing issue is resolved.",
        ],
    };
}