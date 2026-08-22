import type {
    ModificationPlan,
} from "../../modification/types/ModificationPlan";

import type {
    ModificationApplyResult,
} from "../../modification/services/applyModificationPlan";

import {
    applyModificationPlan,
} from "../../modification/services/applyModificationPlan";

export type AIModificationApplyResult =
    ModificationApplyResult;

export function applyAIModificationPlan(
    plan: ModificationPlan,
): AIModificationApplyResult {
    return applyModificationPlan(
        plan,
    );
}