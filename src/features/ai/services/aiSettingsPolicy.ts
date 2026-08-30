import type {
    AIAllowedOperation,
    AIAssistantSettings,
} from "../types/AIAssistantSettings";

export const ALL_AI_OPERATIONS:
    AIAllowedOperation[] = [
    "locatorRepair",
    "addWait",
    "interaction",
    "assertion",
    "flowGeneration",
];

export const DEFAULT_AI_ASSISTANT_SETTINGS:
    AIAssistantSettings = {
    requireHealingApproval: true,

    allowedOperations:
        ALL_AI_OPERATIONS,
};

const VALID_OPERATIONS =
    new Set<AIAllowedOperation>(
        ALL_AI_OPERATIONS,
    );

function normalizeOperations(
    operations:
        | AIAllowedOperation[]
        | undefined,
): AIAllowedOperation[] {
    if (
        !Array.isArray(
            operations,
        )
    ) {
        return [
            ...ALL_AI_OPERATIONS,
        ];
    }

    return operations.filter(
        (
            operation,
        ): operation is AIAllowedOperation =>
            VALID_OPERATIONS.has(
                operation,
            ),
    );
}

export function resolveAISettings(
    partial?:
        Partial<AIAssistantSettings>,
): AIAssistantSettings {
    return {
        requireHealingApproval:
            typeof partial?.requireHealingApproval ===
            "boolean"
                ? partial.requireHealingApproval
                : DEFAULT_AI_ASSISTANT_SETTINGS
                    .requireHealingApproval,

        allowedOperations:
            normalizeOperations(
                partial?.allowedOperations,
            ),
    };
}

export function isOperationAllowed(
    operation:
        AIAllowedOperation,
    allowedOperations?:
        AIAllowedOperation[],
): boolean {
    const resolved =
        resolveAISettings({
            allowedOperations,
        });

    if (
        operation ===
        "flowGeneration"
    ) {
        return resolved.allowedOperations.includes(
            "flowGeneration",
        );
    }

    return resolved.allowedOperations.includes(
        operation,
    ) &&
        resolved.allowedOperations.includes(
            "flowGeneration",
        );
}
