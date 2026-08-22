import type {
    ModificationPlan,
} from "../../modification/types/ModificationPlan";

import {
    validateModificationPlan,
} from "../../modification/services/validateModificationPlan";

export interface AIModificationValidationResult {
    valid: boolean;

    errors: string[];

    warnings: string[];
}

export function validateAIModificationPlan(
    plan: ModificationPlan,
    existingNodeIds: Set<string>,
): AIModificationValidationResult {
    return validateModificationPlan(
        plan,
        existingNodeIds,
    );
}