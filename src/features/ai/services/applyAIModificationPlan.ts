import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import type {
    AIFlowApplyResult,
} from "./applyAIFlowPlan";

import type {
    AIModificationPlan,
    AIModificationStep,
    AIModificationOperationData,
} from "../types/AIModificationPlan";

import {
    validateAIModificationPlan,
} from "./validateAIModificationPlan";

export interface AIModificationApplyResult
    extends AIFlowApplyResult { }

/*
 * --------------------------------------------------
 * Operation helper types
 * --------------------------------------------------
 *
 * AIModificationOperationData currently groups
 * addNodeAfter, addNodeBefore, and updateNode
 * into one union-valued "type" property.
 *
 * Therefore Extract<> cannot be used here.
 *
 * These intersection types preserve the existing
 * AIModificationOperationData definition while
 * allowing TypeScript to know that step exists.
 * --------------------------------------------------
 */

type StepModificationOperation =
    AIModificationOperationData & {
        type:
        | "addNodeAfter"
        | "addNodeBefore"
        | "updateNode";
        step: AIModificationStep;
    };

type DeleteModificationOperation =
    AIModificationOperationData & {
        type: "deleteNode";
        targetNodeId: string;
    };

/*
 * --------------------------------------------------
 * Create data
 * --------------------------------------------------
 */

function buildCreateData(
    step: AIModificationStep,
) {
    return {
        ...(step.locatorStrategy !==
            undefined && {
            locatorStrategy:
                step.locatorStrategy,
        }),

        ...(step.locator !==
            undefined && {
            locator:
                step.locator,
        }),

        ...(step.text !==
            undefined && {
            text:
                step.text,
        }),

        ...(step.action ===
            "wait" && {
            timeout:
                step.timeout ??
                10000,

            pollingInterval:
                step.pollingInterval ??
                500,
        }),

        ...(step.action ===
            "delay" && {
            duration:
                step.duration ??
                1000,
        }),
    };
}

/*
 * --------------------------------------------------
 * Update patch
 * --------------------------------------------------
 */

function buildUpdatePatch(
    step: AIModificationStep,
) {
    const patch: Record<
        string,
        unknown
    > = {};

    if (
        step.title !==
        undefined
    ) {
        patch.title =
            step.title;
    }

    if (
        step.description !==
        undefined
    ) {
        patch.subtitle =
            step.description;
    }

    if (
        step.locatorStrategy !==
        undefined
    ) {
        patch.locatorStrategy =
            step.locatorStrategy;
    }

    if (
        step.locator !==
        undefined
    ) {
        patch.locator =
            step.locator;
    }

    switch (
    step.action
    ) {
        case "input":
            if (
                step.text !==
                undefined
            ) {
                patch.text =
                    step.text;
            }

            break;

        case "assert":
        case "if":
            if (
                step.actual !==
                undefined
            ) {
                patch.actual =
                    step.actual;
            }

            if (
                step.operator !==
                undefined
            ) {
                patch.operator =
                    step.operator;
            }

            if (
                step.expected !==
                undefined
            ) {
                patch.expected =
                    step.expected;
            }

            break;

        case "delay":
            if (
                step.duration !==
                undefined
            ) {
                patch.duration =
                    step.duration;
            }

            break;

        case "wait":
            if (
                step.timeout !==
                undefined
            ) {
                patch.timeout =
                    step.timeout;
            }

            if (
                step.pollingInterval !==
                undefined
            ) {
                patch.pollingInterval =
                    step.pollingInterval;
            }

            break;

        case "setVariable":
            if (
                step.variableName !==
                undefined
            ) {
                patch.variableName =
                    step.variableName;
            }

            if (
                step.text !==
                undefined
            ) {
                patch.value =
                    step.text;
            }

            break;

        case "longPress":
            if (
                step.duration !==
                undefined
            ) {
                patch.duration =
                    step.duration;
            }

            break;

        case "drag":
            if (
                step.duration !==
                undefined
            ) {
                patch.duration =
                    step.duration;
            }

            break;

        case "pinch":
        case "zoom":
            if (
                step.duration !==
                undefined
            ) {
                patch.duration =
                    step.duration;
            }

            break;

        default:
            break;
    }

    return patch;
}

/*
 * --------------------------------------------------
 * Apply metadata after node creation
 * --------------------------------------------------
 */

function applyPostCreateMetadata(
    newNodeId: string,
    step: AIModificationStep,
): void {
    const store =
        useFlowStore.getState();

    const metadata =
        buildUpdatePatch(
            step,
        );

    if (
        Object.keys(metadata)
            .length === 0
    ) {
        return;
    }

    const postCreatePatch = {
        ...metadata,
    };

    delete postCreatePatch
        .locatorStrategy;

    delete postCreatePatch
        .locator;

    delete postCreatePatch
        .text;

    if (
        Object.keys(
            postCreatePatch,
        ).length > 0
    ) {
        store.updateNodeData(
            newNodeId,
            postCreatePatch as never,
        );
    }
}

/*
 * --------------------------------------------------
 * ADD NODE AFTER
 * --------------------------------------------------
 */

function applyAddNodeAfter(
    operation: StepModificationOperation,
): void {
    if (
        operation.type !==
        "addNodeAfter"
    ) {
        throw new Error(
            "Invalid modification operation for addNodeAfter.",
        );
    }

    const store =
        useFlowStore.getState();

    const {
        targetNodeId,
        step,
    } = operation;

    console.log(
    "[AI Apply Before] targetNodeId:",
    targetNodeId,
);

const targetNode =
    store.nodes.find(
        (node) =>
            node.id ===
            targetNodeId,
    );

console.log(
    "[AI Apply Before] targetNode:",
    targetNode
        ? {
            id: targetNode.id,
            action: targetNode.data.action,
            title: targetNode.data.title,
        }
        : null,
);

    const outgoingEdge =
        store.edges.find(
            (edge) =>
                edge.source ===
                targetNodeId,
        );

    const data =
        buildCreateData(
            step,
        );

    if (outgoingEdge) {
        store.insertNodeWithData(
            outgoingEdge.id,
            step.action,
            data,
        );
    } else {
        store.insertNodeWithData(
            null,
            step.action,
            data,
            targetNodeId,
        );
    }

    const {
        nodes,
    } =
        useFlowStore.getState();

    const newNode =
        nodes.at(-1);

    if (!newNode) {
        throw new Error(
            "Failed to create the modified flow node.",
        );
    }

    applyPostCreateMetadata(
        newNode.id,
        step,
    );
}

/*
 * --------------------------------------------------
 * ADD NODE BEFORE
 * --------------------------------------------------
 */

function applyAddNodeBefore(
    operation: StepModificationOperation,
): void {
    if (
        operation.type !==
        "addNodeBefore"
    ) {
        throw new Error(
            "Invalid modification operation for addNodeBefore.",
        );
    }

    const store =
        useFlowStore.getState();

    const {
        targetNodeId,
        step,
    } = operation;

    const targetNode =
        store.nodes.find(
            (node) =>
                node.id ===
                targetNodeId,
        );

    if (!targetNode) {
        throw new Error(
            `Target node "${targetNodeId}" was not found in the current flow.`,
        );
    }

    const data =
        buildCreateData(
            step,
        );

    /*
     * insertNodeWithData() supports
     * explicit beforeNodeId insertion.
     *
     * Parameter order:
     *
     * edgeId
     * type
     * data
     * afterNodeId
     * beforeNodeId
     *
     * For addNodeBefore we intentionally
     * leave edgeId and afterNodeId empty.
     */
    store.insertNodeWithData(
        null,
        step.action,
        data,
        undefined,
        targetNodeId,
    );

    const {
        nodes,
    } =
        useFlowStore.getState();

    const newNode =
        nodes.at(-1);

    if (!newNode) {
        throw new Error(
            "Failed to create the modified flow node.",
        );
    }

    applyPostCreateMetadata(
        newNode.id,
        step,
    );
}
/*
 * --------------------------------------------------
 * UPDATE NODE
 * --------------------------------------------------
 */

function applyUpdateNode(
    operation: StepModificationOperation,
): void {
    if (
        operation.type !==
        "updateNode"
    ) {
        throw new Error(
            "Invalid modification operation for updateNode.",
        );
    }

    const store =
        useFlowStore.getState();

    const {
        targetNodeId,
        step,
    } = operation;

    const targetNode =
        store.nodes.find(
            (node) =>
                node.id ===
                targetNodeId,
        );

    if (!targetNode) {
        throw new Error(
            `Target node "${targetNodeId}" was not found in the current flow.`,
        );
    }

    if (
        targetNode.data.action !==
        step.action
    ) {
        throw new Error(
            `Cannot update node "${targetNodeId}" as "${step.action}" because its current action is "${targetNode.data.action}".`,
        );
    }

    const patch =
        buildUpdatePatch(
            step,
        );

    if (
        Object.keys(patch)
            .length === 0
    ) {
        throw new Error(
            `Modification for node "${targetNodeId}" does not contain any fields to update.`,
        );
    }

    store.updateNodeData(
        targetNodeId,
        patch as never,
    );
}

/*
 * --------------------------------------------------
 * DELETE NODE
 * --------------------------------------------------
 */

function applyDeleteNode(
    operation: DeleteModificationOperation,
): void {
    if (
        operation.type !==
        "deleteNode"
    ) {
        throw new Error(
            "Invalid modification operation for deleteNode.",
        );
    }

    const store =
        useFlowStore.getState();

    store.removeNode(
        operation.targetNodeId,
    );
}

/*
 * --------------------------------------------------
 * APPLY ONE OPERATION
 * --------------------------------------------------
 */

function applyOperation(
    operation: AIModificationOperationData,
): void {
    switch (
    operation.type
    ) {
        case "addNodeAfter":
            applyAddNodeAfter(
                operation as StepModificationOperation,
            );

            return;

        case "addNodeBefore":
            applyAddNodeBefore(
                operation as StepModificationOperation,
            );

            return;

        case "updateNode":
            applyUpdateNode(
                operation as StepModificationOperation,
            );

            return;

        case "deleteNode":
            applyDeleteNode(
                operation as DeleteModificationOperation,
            );

            return;

        default:
            throw new Error(
                "Unsupported AI modification operation.",
            );
    }
}

/*
 * --------------------------------------------------
 * PUBLIC APPLY FUNCTION
 * --------------------------------------------------
 */

export function applyAIModificationPlan(
    plan: AIModificationPlan,
): AIModificationApplyResult {
    const store =
        useFlowStore.getState();

    const existingNodeIds =
        new Set(
            store.nodes.map(
                (node) =>
                    node.id,
            ),
        );

    const validation =
        validateAIModificationPlan(
            plan,
            existingNodeIds,
        );

    if (
        !validation.valid
    ) {
        return {
            success: false,

            appliedSteps: 0,

            error:
                validation.errors.join(
                    " ",
                ),
        };
    }

    /*
     * --------------------------------------------------
     * Resolve operations.
     *
     * Multi-step:
     *
     * operations: [...]
     *
     * Legacy:
     *
     * operation: {...}
     * --------------------------------------------------
     */
    const operations: AIModificationOperationData[] =
        Array.isArray(
            plan.operations,
        )
            ? plan.operations
            : plan.operation
                ? [plan.operation]
                : [];

    try {
        /*
         * One AI request = one history batch.
         */
        store.runInHistoryBatch(
            () => {
                for (
                    const operation of
                    operations
                ) {
                    applyOperation(
                        operation,
                    );
                }
            },
        );

        return {
            success: true,

            appliedSteps:
                operations.length,
        };
    } catch (error) {
        return {
            success: false,

            appliedSteps: 0,

            error:
                error instanceof Error
                    ? error.message
                    : String(error),
        };
    }
}