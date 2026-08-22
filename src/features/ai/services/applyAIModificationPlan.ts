import type {
    AIModificationPlan,
} from "../types/AIModificationPlan";

import type {
    ModificationApplyResult,
} from "../../modification/services/applyModificationPlan";

import {
    applyModificationPlan,
} from "../../modification/services/applyModificationPlan";

export type AIModificationApplyResult =
    ModificationApplyResult;

export function applyAIModificationPlan(
    plan: AIModificationPlan,
): AIModificationApplyResult {
    return applyModificationPlan(
        plan,
    );
}