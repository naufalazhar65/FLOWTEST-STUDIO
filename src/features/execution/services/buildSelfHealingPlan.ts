import type {
    ExecutionFailureAnalysis,
} from "./analyzeExecutionFailure";

import {
    buildFailureModificationPlan,
} from "./buildFailureModificationPlan";

import type {
    AIModificationPlan,
} from "../../ai/types/AIModificationPlan";

export interface SelfHealingPlan {
    canAutoApply: boolean;

    strategy:
        | "modification"
        | "manual"
        | "none";

    confidence:
        | "high"
        | "medium"
        | "low";

    reason: string;

    modificationPlan:
        | AIModificationPlan
        | null;

    targetNodeId:
        string | null;
}

export function buildSelfHealingPlan(
    analysis:
        ExecutionFailureAnalysis,
): SelfHealingPlan {
    const fix =
        analysis.suggestedFix;

    /*
     * --------------------------------------------------
     * Attempt to build a deterministic modification
     * plan from the failure analysis.
     * --------------------------------------------------
     */
    const modificationPlan =
        buildFailureModificationPlan(
            analysis,
        );

    /*
     * --------------------------------------------------
     * Automatic healing is allowed only when:
     *
     * 1. The suggested fix explicitly allows it.
     * 2. A deterministic modification plan exists.
     *
     * This keeps diagnosis and repair separate.
     * --------------------------------------------------
     */
    if (
        fix.autoApplicable &&
        modificationPlan
    ) {
        return {
            canAutoApply:
                true,

            strategy:
                "modification",

            confidence:
                fix.confidence,

            reason:
                `A deterministic modification plan is available for "${fix.title}".`,

            modificationPlan,

            targetNodeId:
                fix.targetNodeId,
        };
    }

    /*
     * --------------------------------------------------
     * A fix exists, but it cannot currently be
     * applied automatically.
     *
     * The deterministic builder may return null
     * because the fix requires additional evidence.
     * --------------------------------------------------
     */
    if (
        fix.type !==
        "none"
    ) {
        return {
            canAutoApply:
                false,

            strategy:
                "manual",

            confidence:
                fix.confidence,

            reason:
                modificationPlan
                    ? `The suggested fix "${fix.title}" requires manual review before it can be applied automatically.`
                    : fix.description,

            modificationPlan:
                modificationPlan,

            targetNodeId:
                fix.targetNodeId,
        };
    }

    return {
        canAutoApply:
            false,

        strategy:
            "none",

        confidence:
            "low",

        reason:
            "No safe self-healing strategy was identified.",

        modificationPlan:
            null,

        targetNodeId:
            null,
    };
}