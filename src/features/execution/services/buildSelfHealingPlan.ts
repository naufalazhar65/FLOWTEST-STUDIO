import type {
    AIModificationPlan,
} from "../../ai/types/AIModificationPlan";

import type {
    ExecutionFailureAnalysis,
} from "./analyzeExecutionFailure";

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
        AIModificationPlan | null;

    targetNodeId:
        string | null;
}

export function buildSelfHealingPlan(
    analysis:
        ExecutionFailureAnalysis,
    modificationPlan:
        AIModificationPlan | null =
            null,
): SelfHealingPlan {
    const fix =
        analysis.suggestedFix;

    /*
     * Only allow automatic healing when
     * the suggested fix explicitly says
     * that it is auto-applicable and an
     * actual deterministic modification
     * plan exists.
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
     * A suggested fix exists, but it is
     * not safe to apply automatically.
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
                fix.description,

            modificationPlan:
                null,

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