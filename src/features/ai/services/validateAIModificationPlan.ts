import type { NodeAction } from "../../flow/types/flowNode";

import type {
    AIModificationPlan,
    AIModificationStep,
    AIModificationOperationData,
} from "../types/AIModificationPlan";

export interface AIModificationValidationResult {
    valid: boolean;

    errors: string[];

    warnings: string[];
}

const locatorActions: NodeAction[] = [
    "tap",
    "input",
    "wait",
    "getText",
    "elementExists",
    "getAttribute",
    "getDisplayed",
    "getEnabled",
    "getSelected",
    "getLocation",
    "getSize",
    "getRect",
];

function requiresLocator(
    action: NodeAction,
): boolean {
    return locatorActions.includes(
        action,
    );
}

function validateStep(
    step: AIModificationStep,
): string[] {
    const errors: string[] = [];

    if (
        requiresLocator(
            step.action,
        )
    ) {
        if (
            !step.locatorStrategy
        ) {
            errors.push(
                `${step.action} requires a locator strategy.`,
            );
        }

        if (
            !step.locator?.trim()
        ) {
            errors.push(
                `${step.action} requires a locator.`,
            );
        }
    }

    if (
        step.action === "input" &&
        !step.text?.trim()
    ) {
        errors.push(
            "input requires text.",
        );
    }

    if (
        step.action === "assert"
    ) {
        if (!step.actual?.trim()) {
            errors.push(
                "assert requires an actual value.",
            );
        }

        if (!step.operator) {
            errors.push(
                "assert requires an operator.",
            );
        }

        if (!step.expected?.trim()) {
            errors.push(
                "assert requires an expected value.",
            );
        }
    }

    if (
        step.action === "delay" &&
        (
            step.duration ===
                undefined ||
            step.duration <= 0
        )
    ) {
        errors.push(
            "delay requires a positive duration.",
        );
    }

    if (
        step.action === "wait"
    ) {
        if (
            step.timeout !==
                undefined &&
            step.timeout <= 0
        ) {
            errors.push(
                "wait timeout must be positive.",
            );
        }

        if (
            step.pollingInterval !==
                undefined &&
            step.pollingInterval <= 0
        ) {
            errors.push(
                "wait pollingInterval must be positive.",
            );
        }
    }

    return errors;
}

function validateOperation(
    operation: AIModificationOperationData,
    existingNodeIds: Set<string>,
    knownResultIds: Set<string>,
    index?: number,
): string[] {
    const errors: string[] = [];

    const prefix =
        index === undefined
            ? "Modification operation"
            : `Modification operation ${index + 1}`;

    if (
        operation.type !==
            "addNodeAfter" &&
        operation.type !==
            "addNodeBefore" &&
        operation.type !==
            "updateNode" &&
        operation.type !==
            "deleteNode"
    ) {
        errors.push(
            `${prefix} has an unsupported operation "${operation.type}".`,
        );

        return errors;
    }

    const targetNodeId =
        operation.targetNodeId?.trim() ??
        "";

    if (
        !targetNodeId
    ) {
        errors.push(
            `${prefix} requires a targetNodeId.`,
        );
    } else if (
        targetNodeId.startsWith(
            "$",
        )
    ) {
        const reference =
            targetNodeId
                .slice(1)
                .trim();

        if (
            !reference
        ) {
            errors.push(
                `${prefix} contains an empty target reference.`,
            );
        } else if (
            !knownResultIds.has(
                reference,
            )
        ) {
            errors.push(
                `${prefix} target reference "${targetNodeId}" does not refer to a previous operation result.`,
            );
        }
    } else if (
        !existingNodeIds.has(
            targetNodeId,
        )
    ) {
        errors.push(
            `${prefix} target node "${targetNodeId}" does not exist in the current flow.`,
        );
    }

    if (
        operation.type ===
        "deleteNode"
    ) {
        return errors;
    }

    if (!operation.step) {
        errors.push(
            `${prefix} requires a step.`,
        );

        return errors;
    }

    errors.push(
        ...validateStep(
            operation.step,
        ),
    );

    return errors;
}

export function validateAIModificationPlan(
    plan: AIModificationPlan,
    existingNodeIds: Set<string>,
): AIModificationValidationResult {
    const errors: string[] = [];

    if (
        plan.type !==
        "modification_plan"
    ) {
        errors.push(
            "Invalid modification plan type.",
        );
    }

    if (
        !plan.summary?.trim()
    ) {
        errors.push(
            "Modification plan summary is empty.",
        );
    }

    /*
     * --------------------------------------------------
     * Backward compatibility:
     *
     * Existing AI responses use:
     *
     * operation: {...}
     *
     * Multi-step modifications use:
     *
     * operations: [{...}, {...}]
     *
     * If both exist, operations[] is the
     * canonical source for validation.
     * --------------------------------------------------
     */
    const operations =
        Array.isArray(
            plan.operations,
        ) &&
        plan.operations.length > 0
            ? plan.operations
            : plan.operation
                ? [plan.operation]
                : [];

    if (
        operations.length ===
        0
    ) {
        errors.push(
            "Modification plan operation is missing.",
        );

        return {
            valid: false,

            errors,

            warnings:
                plan.warnings ?? [],
        };
    }

    /*
     * --------------------------------------------------
     * Validate every modification.
     * --------------------------------------------------
     */
    const knownResultIds =
    new Set<string>();

operations.forEach(
    (
        operation,
        index,
    ) => {
        errors.push(
            ...validateOperation(
                operation,
                existingNodeIds,
                knownResultIds,
                operations.length >
                    1
                    ? index
                    : undefined,
            ),
        );

        if (
    "resultId" in operation &&
    operation.resultId
) {
    if (
        operation.type !==
            "addNodeAfter" &&
        operation.type !==
            "addNodeBefore"
    ) {
        errors.push(
            `Modification operation ${
                index + 1
            } can only define resultId for addNodeAfter or addNodeBefore.`,
        );
    }

    const resultId =
        operation.resultId.trim();

    if (
        !resultId
    ) {
        errors.push(
            `Modification operation ${
                index + 1
            } has an empty resultId.`,
        );
    } else if (
        knownResultIds.has(
            resultId,
        )
    ) {
        errors.push(
            `Modification operation ${
                index + 1
            } reuses duplicate resultId "${resultId}".`,
        );
    } else {
        knownResultIds.add(
            resultId,
        );
    }
}
    },
);

    return {
        valid:
            errors.length === 0,

        errors,

        warnings:
            plan.warnings ?? [],
    };
}