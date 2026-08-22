import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import type {
    AIFlowApplyResult,
} from "../../ai/services/applyAIFlowPlan";

import type {
    ModificationPlan,
    ModificationStep,
    ModificationOperationData,
} from "../types/ModificationPlan";

import {
    validateModificationPlan,
} from "./validateModificationPlan";

export interface ModificationApplyResult
    extends AIFlowApplyResult {}

/*
 * --------------------------------------------------
 * Operation helper types
 * --------------------------------------------------
 *
 * ModificationOperationData currently groups
 * addNodeAfter, addNodeBefore, and updateNode
 * into one union-valued "type" property.
 *
 * These intersection types preserve the
 * ModificationOperationData definition while
 * allowing TypeScript to know that step exists.
 * --------------------------------------------------
 */

type StepModificationOperation =
    ModificationOperationData & {
        type:
            | "addNodeAfter"
            | "addNodeBefore"
            | "updateNode";

        step: ModificationStep;
    };

type DeleteModificationOperation =
    ModificationOperationData & {
        type: "deleteNode";

        targetNodeId: string;
    };

/*
 * --------------------------------------------------
 * Create data
 * --------------------------------------------------
 */

function buildCreateData(
    step: ModificationStep,
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

        ...(step.variableName !==
            undefined && {
            variableName:
                step.variableName,
        }),

        ...(step.actual !==
            undefined && {
            actual:
                step.actual,
        }),

        ...(step.operator !==
            undefined && {
            operator:
                step.operator,
        }),

        ...(step.expected !==
            undefined && {
            expected:
                step.expected,
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
    step: ModificationStep,
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

        case "getText":
        case "elementExists":
        case "getAttribute":
        case "getDisplayed":
        case "getEnabled":
        case "getSelected":
        case "getLocation":
        case "getSize":
        case "getRect":
        case "getCurrentActivity":
        case "getCurrentPackage":
        case "getOrientation":
        case "getPlatformVersion":
        case "getDeviceName":
        case "getDeviceTime":
            if (
                step.variableName !==
                undefined
            ) {
                patch.variableName =
                    step.variableName;
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
    step: ModificationStep,
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
): string {
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

    return newNode.id;
}

/*
 * --------------------------------------------------
 * ADD NODE BEFORE
 * --------------------------------------------------
 */

function applyAddNodeBefore(
    operation: StepModificationOperation,
): string {
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

    return newNode.id;
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
    operation: ModificationOperationData,
): string | null {
    switch (
        operation.type
    ) {
        case "addNodeAfter":
            return applyAddNodeAfter(
                operation as StepModificationOperation,
            );

        case "addNodeBefore":
            return applyAddNodeBefore(
                operation as StepModificationOperation,
            );

        case "updateNode":
            applyUpdateNode(
                operation as StepModificationOperation,
            );

            return null;

        case "deleteNode":
            applyDeleteNode(
                operation as DeleteModificationOperation,
            );

            return null;

        default:
            throw new Error(
                "Unsupported modification operation.",
            );
    }
}

/*
 * --------------------------------------------------
 * PUBLIC APPLY FUNCTION
 * --------------------------------------------------
 */

export function applyModificationPlan(
    plan: ModificationPlan,
): ModificationApplyResult {
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
        validateModificationPlan(
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

    const operations:
        ModificationOperationData[] =
        Array.isArray(
            plan.operations,
        )
            ? plan.operations
            : plan.operation
                ? [plan.operation]
                : [];

    const operationResults =
        new Map<
            string,
            string
        >();

    try {
        store.runInHistoryBatch(
            () => {
                for (
                    const operation of
                    operations
                ) {
                    let resolvedTargetNodeId =
                        operation.targetNodeId;

                    if (
                        resolvedTargetNodeId.startsWith(
                            "$",
                        )
                    ) {
                        const reference =
                            resolvedTargetNodeId.slice(
                                1,
                            );

                        const resolvedNodeId =
                            operationResults.get(
                                reference,
                            );

                        if (
                            !resolvedNodeId
                        ) {
                            throw new Error(
                                `Unable to resolve modification target reference "${resolvedTargetNodeId}".`,
                            );
                        }

                        resolvedTargetNodeId =
                            resolvedNodeId;
                    }

                    const resolvedOperation = {
                        ...operation,

                        targetNodeId:
                            resolvedTargetNodeId,
                    };

                    const createdNodeId =
                        applyOperation(
                            resolvedOperation,
                        );

                    if (
                        "resultId" in
                            operation &&
                        operation.resultId &&
                        createdNodeId
                    ) {
                        operationResults.set(
                            operation.resultId,
                            createdNodeId,
                        );
                    }
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