import type {
    AIModificationPlan,
} from "../types/AIModificationPlan";

import {
    validateModificationPlan,
} from "../../modification/services/validateModificationPlan";

export interface AIModificationValidationResult {
    valid: boolean;

    errors: string[];

    warnings: string[];
}

export function validateAIModificationPlan(
    plan: AIModificationPlan,
    existingNodeIds: Set<string>,
): AIModificationValidationResult {
    return validateModificationPlan(
        plan,
        existingNodeIds,
    );
}