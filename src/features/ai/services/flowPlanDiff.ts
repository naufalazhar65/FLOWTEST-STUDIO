import type {
    Edge,
} from "reactflow";

import type {
    FlowNode,
    FlowNodeDataPatch,
} from "../../flow/types/flowNode";

import type {
    LocatorStrategy,
} from "../../execution/types/LocatorStrategy";

import {
    addNodeAction,
} from "../../flow/actions/addNode";

import {
    addNodeWithLocatorAction,
} from "../../flow/actions/addNodeWithLocator";

import {
    updateNodeDataAction,
} from "../../flow/actions/updateNodeData";

import {
    deleteNodeAction,
} from "../../flow/actions/deleteNode";

import {
    insertNodeWithDataAction,
} from "../../flow/actions/insertNodeWithData";

import type {
    AIFlowPlan,
    AIFlowStep,
} from "../types/AIFlowPlan";

import type {
    ModificationPlan,
    ModificationStep,
    ModificationOperationData,
} from "../../modification/types/ModificationPlan";

export type PlanDiffSource =
    | {
        kind: "flow";

        plan: AIFlowPlan;
    }
    | {
        kind: "modification";

        plan: ModificationPlan;
    };

export interface PlanDiffFieldChange {
    field: string;

    before: unknown;

    after: unknown;
}

export interface PlanDiffNodeChange {
    nodeId: string;

    action: string;

    title: string;

    kind:
    | "added"
    | "modified"
    | "removed";

    fieldChanges?:
    PlanDiffFieldChange[];
}

export interface PlanDiffEdgeChange {
    edgeId: string;

    source: string;

    target: string;

    kind:
    | "added"
    | "removed";
}

export interface PlanDiffSummary {
    addedNodes: number;

    modifiedNodes: number;

    removedNodes: number;

    addedEdges: number;

    removedEdges: number;
}

export interface PlanDiff {
    addedNodes:
    PlanDiffNodeChange[];

    modifiedNodes:
    PlanDiffNodeChange[];

    removedNodes:
    PlanDiffNodeChange[];

    addedEdges:
    PlanDiffEdgeChange[];

    removedEdges:
    PlanDiffEdgeChange[];

    summary: PlanDiffSummary;

    projectedNodes:
    FlowNode[];

    projectedEdges: Edge[];
}

/*
 * ------------------------------------------------------------------
 * Edge signature helpers
 * ------------------------------------------------------------------
 *
 * Edge ids can change when a node is inserted or deleted (edges are
 * recreated during reconnection). Comparing by signature (source ->
 * sourceHandle -> target -> targetHandle) lets us report meaningful
 * "added" / "removed" edge changes instead of noise from id churn.
 * ------------------------------------------------------------------
 */

function edgeSignature(
    edge: Edge,
): string {
    return [
        edge.source,
        edge.sourceHandle ??
        "",
        edge.target,
        edge.targetHandle ??
        "",
    ].join("::");
}

/*
 * ------------------------------------------------------------------
 * Node data field comparison
 * ------------------------------------------------------------------
 */

function isDeepEqual(
    a: unknown,
    b: unknown,
): boolean {
    if (a === b) {
        return true;
    }

    if (
        typeof a !==
            "object" ||
        typeof b !==
            "object" ||
        a === null ||
        b === null
    ) {
        return false;
    }

    return (
        JSON.stringify(a) ===
        JSON.stringify(b)
    );
}

function diffNodeData(
    before:
        FlowNode["data"],
    after: FlowNode["data"],
):
    PlanDiffFieldChange[] {
    if (!before || !after) {
        return [];
    }

    const beforeRecord =
        before as unknown as Record<
            string,
            unknown
        >;

    const afterRecord =
        after as unknown as Record<
            string,
            unknown
        >;

    const fields =
        new Set([
            ...Object.keys(
                beforeRecord,
            ),

            ...Object.keys(
                afterRecord,
            ),
        ]);

    const changes:
        PlanDiffFieldChange[] = [];

    if (afterRecord.action !==
        beforeRecord.action) {
        changes.push({
            field: "action",

            before:
                beforeRecord.action,

            after:
                afterRecord.action,
        });
    }

    for (
        const field of fields
    ) {
        if (
            field === "action"
        ) {
            continue;
        }

        const beforeValue =
            beforeRecord[field];

        const afterValue =
            afterRecord[field];

        if (
            isDeepEqual(
                beforeValue,
                afterValue,
            )
        ) {
            continue;
        }

        changes.push({
            field,

            before:
                beforeValue,

            after:
                afterValue,
        });
    }

    return changes;
}

/*
 * ------------------------------------------------------------------
 * Generic before/after diff
 * ------------------------------------------------------------------
 */

function diffProjection(
    beforeNodes: FlowNode[],
    beforeEdges: Edge[],
    afterNodes: FlowNode[],
    afterEdges: Edge[],
): Omit<
    PlanDiff,
    "projectedNodes" |
    "projectedEdges"
> {
    const beforeById =
        new Map(
            beforeNodes.map(
                (
                    node,
                ) => [
                    node.id,
                    node,
                ],
            ),
        );

    const afterById =
        new Map(
            afterNodes.map(
                (
                    node,
                ) => [
                    node.id,
                    node,
                ],
            ),
        );

    const addedNodes:
        PlanDiffNodeChange[] = [];

    const modifiedNodes:
        PlanDiffNodeChange[] = [];

    const removedNodes:
        PlanDiffNodeChange[] = [];

    for (
        const node of afterNodes
    ) {
        if (
            !beforeById.has(
                node.id,
            )
        ) {
            addedNodes.push({
                nodeId: node.id,

                action:
                    node.data.action,

                title:
                    node.data.title,

                kind: "added",
            });

            continue;
        }

        const before =
            beforeById.get(
                node.id,
            )!;

        const fieldChanges =
            diffNodeData(
                before.data,
                node.data,
            );

        if (
            fieldChanges.length ===
            0
        ) {
            continue;
        }

        modifiedNodes.push({
            nodeId: node.id,

            action:
                node.data.action,

            title:
                node.data.title,

            kind: "modified",

            fieldChanges,
        });
    }

    for (
        const node of beforeNodes
    ) {
        if (
            afterById.has(
                node.id,
            )
        ) {
            continue;
        }

        removedNodes.push({
            nodeId: node.id,

            action:
                node.data.action,

            title:
                node.data.title,

            kind: "removed",
        });
    }

    const beforeEdgeCount =
        new Map<
            string,
            number
        >();

    for (
        const edge of beforeEdges
    ) {
        const signature =
            edgeSignature(
                edge,
            );

        beforeEdgeCount.set(
            signature,
            (beforeEdgeCount.get(
                signature,
            ) ?? 0) + 1,
        );
    }

    const afterEdgeCount =
        new Map<
            string,
            number
        >();

    for (
        const edge of afterEdges
    ) {
        const signature =
            edgeSignature(
                edge,
            );

        afterEdgeCount.set(
            signature,
            (afterEdgeCount.get(
                signature,
            ) ?? 0) + 1,
        );
    }

    const addedEdges:
        PlanDiffEdgeChange[] = [];

    const removedEdges:
        PlanDiffEdgeChange[] = [];

    for (
        const edge of afterEdges
    ) {
        const signature =
            edgeSignature(
                edge,
            );

        const beforeCount =
            beforeEdgeCount.get(
                signature,
            ) ?? 0;

        const afterCount =
            afterEdgeCount.get(
                signature,
            ) ?? 0;

        if (
            afterCount <=
            beforeCount
        ) {
            continue;
        }

        addedEdges.push({
            edgeId: edge.id,

            source: edge.source,

            target: edge.target,

            kind: "added",
        });
    }

    for (
        const edge of beforeEdges
    ) {
        const signature =
            edgeSignature(
                edge,
            );

        const beforeCount =
            beforeEdgeCount.get(
                signature,
            ) ?? 0;

        const afterCount =
            afterEdgeCount.get(
                signature,
            ) ?? 0;

        if (
            beforeCount <=
            afterCount
        ) {
            continue;
        }

        removedEdges.push({
            edgeId: edge.id,

            source: edge.source,

            target: edge.target,

            kind: "removed",
        });
    }

    return {
        addedNodes,

        modifiedNodes,

        removedNodes,

        addedEdges,

        removedEdges,

        summary: {
            addedNodes:
                addedNodes.length,

            modifiedNodes:
                modifiedNodes.length,

            removedNodes:
                removedNodes.length,

            addedEdges:
                addedEdges.length,

            removedEdges:
                removedEdges.length,
        },
    };
}

/*
 * ------------------------------------------------------------------
 * AIFlowPlan projection (append-only)
 * ------------------------------------------------------------------
 */

const supportedLocatorStrategies:
    LocatorStrategy[] = [
    "accessibilityId",
    "id",
    "xpath",
    "className",
    "androidUiAutomator",
    "iOSPredicateString",
    "iOSClassChain",
];

function toLocatorStrategy(
    value:
        | string
        | null
        | undefined,
): LocatorStrategy {
    if (
        value &&
        supportedLocatorStrategies.includes(
            value as LocatorStrategy,
        )
    ) {
        return value as LocatorStrategy;
    }

    return "id";
}

function getSemanticTarget(
    step: AIFlowStep,
): string | undefined {
    if (
        typeof step.semanticTarget ===
        "string" &&
        step.semanticTarget.trim()
    ) {
        return step.semanticTarget.trim();
    }

    const title =
        step.title?.trim() ??
        "";

    if (!title) {
        return undefined;
    }

    const normalizedTitle =
        title
            .replace(
                /^(enter|input|type|tap|click|press|verify|check|assert|select|choose)\s+/i,
                "",
            )
            .replace(
                /\s+(button|field|element|input|textbox|text field|screen)$/i,
                "",
            )
            .trim();

    if (
        /^(username|user\s*name)$/i.test(
            normalizedTitle,
        )
    ) {
        return "username-field";
    }

    if (
        /^password$/i.test(
            normalizedTitle,
        )
    ) {
        return "password-field";
    }

    if (
        /^login$/i.test(
            normalizedTitle,
        )
    ) {
        return "login-button";
    }

    if (
        /^login\s+screen$/i.test(
            normalizedTitle,
        )
    ) {
        return "login-screen";
    }

    return (
        normalizedTitle ||
        undefined
    );
}

function projectAIFlowStep(
    nodes: FlowNode[],
    edges: Edge[],
    step: AIFlowStep,
): {
    nodes: FlowNode[];

    edges: Edge[];
} {
    switch (step.action) {
        case "tap": {
            const result =
                addNodeWithLocatorAction(
                    nodes,
                    edges,
                    "tap",
                    {
                        locatorStrategy:
                            toLocatorStrategy(
                                step.locatorStrategy,
                            ),

                        locator:
                            step.locator ?? "",
                    },
                );

            const createdId =
                result.node.id;

            const updated =
                updateNodeDataAction(
                    result.nodes,
                    createdId,
                    {
                        title:
                            step.title,

                        subtitle:
                            step.description,

                        text:
                            step.text ?? "",

                        semanticTarget:
                            getSemanticTarget(
                                step,
                            ),
                    },
                );

            return {
                nodes: updated,

                edges:
                    result.edges,
            };
        }

        case "input": {
            const result =
                addNodeWithLocatorAction(
                    nodes,
                    edges,
                    "input",
                    {
                        locatorStrategy:
                            toLocatorStrategy(
                                step.locatorStrategy,
                            ),

                        locator:
                            step.locator ?? "",

                        text:
                            step.text ??
                            "",
                    },
                );

            const createdId =
                result.node.id;

            const updated =
                updateNodeDataAction(
                    result.nodes,
                    createdId,
                    {
                        title:
                            step.title,

                        subtitle:
                            step.description,

                        semanticTarget:
                            getSemanticTarget(
                                step,
                            ),
                    },
                );

            return {
                nodes: updated,

                edges:
                    result.edges,
            };
        }

        case "assert": {
            const result =
                addNodeAction(
                    nodes,
                    edges,
                    "assert",
                );

            const createdId =
                result.nodes.at(-1)
                    ?.id ?? "";

            const updated =
                updateNodeDataAction(
                    result.nodes,
                    createdId,
                    {
                        title:
                            step.title,

                        subtitle:
                            step.description,

                        actual:
                            step.actual ?? "",

                        operator:
                            step.operator ??
                            "equals",

                        expected:
                            step.expected ?? "",
                    },
                );

            return {
                nodes: updated,

                edges:
                    result.edges,
            };
        }

        case "delay": {
            const result =
                addNodeAction(
                    nodes,
                    edges,
                    "delay",
                );

            const createdId =
                result.nodes.at(-1)
                    ?.id ?? "";

            const updated =
                updateNodeDataAction(
                    result.nodes,
                    createdId,
                    {
                        title:
                            step.title,

                        subtitle:
                            step.description,

                        duration:
                            step.duration ??
                            1000,
                    },
                );

            return {
                nodes: updated,

                edges:
                    result.edges,
            };
        }

        case "wait": {
            const result =
                addNodeWithLocatorAction(
                    nodes,
                    edges,
                    "wait",
                    {
                        locatorStrategy:
                            toLocatorStrategy(
                                step.locatorStrategy,
                            ),

                        locator:
                            step.locator ?? "",
                    },
                );

            const createdId =
                result.node.id;

            const updated =
                updateNodeDataAction(
                    result.nodes,
                    createdId,
                    {
                        title:
                            step.title,

                        subtitle:
                            step.description,

                        semanticTarget:
                            getSemanticTarget(
                                step,
                            ),

                        timeout:
                            step.timeout ??
                            10000,

                        pollingInterval:
                            step.pollingInterval ??
                            500,
                    },
                );

            return {
                nodes: updated,

                edges:
                    result.edges,
            };
        }

        case "launchApp": {
            const result =
                addNodeAction(
                    nodes,
                    edges,
                    "launchApp",
                );

            const createdId =
                result.nodes.at(-1)
                    ?.id ?? "";

            const updated =
                updateNodeDataAction(
                    result.nodes,
                    createdId,
                    {
                        title:
                            step.title,

                        subtitle:
                            step.description,

                        semanticTarget:
                            getSemanticTarget(
                                step,
                            ),
                    },
                );

            return {
                nodes: updated,

                edges:
                    result.edges,
            };
        }

        default:
            return {
                nodes,

                edges,
            };
    }
}

function projectAIFlowPlan(
    nodes: FlowNode[],
    edges: Edge[],
    plan: AIFlowPlan,
): {
    nodes: FlowNode[];

    edges: Edge[];
} {
    let workingNodes =
        nodes;

    let workingEdges =
        edges;

    for (
        const step of plan.steps
    ) {
        const projected =
            projectAIFlowStep(
                workingNodes,
                workingEdges,
                step,
            );

        workingNodes =
            projected.nodes;

        workingEdges =
            projected.edges;
    }

    return {
        nodes: workingNodes,

        edges: workingEdges,
    };
}

/*
 * ------------------------------------------------------------------
 * ModificationPlan projection
 * ------------------------------------------------------------------
 */

type ModificationProjection =
    {
        nodes: FlowNode[];

        edges: Edge[];
    };

function projectModificationStep(
    nodes: FlowNode[],
    edges: Edge[],
    operation: ModificationOperationData,
): ModificationProjection {
    switch (operation.type) {
        case "addNodeAfter":
        case "addNodeBefore": {
            const targetNode =
                nodes.find(
                    (node) =>
                        node.id ===
                        operation.targetNodeId,
                );

            if (!targetNode) {
                return {
                    nodes,

                    edges,
                };
            }

            const step =
                operation.step;

            const data =
                buildModificationCreateData(
                    step,
                );

            const outgoingEdge =
                edges.find(
                    (edge) =>
                        edge.source ===
                        targetNode.id,
                );

            const result =
                insertNodeWithDataAction(
                    nodes,
                    edges,
                    operation.type ===
                        "addNodeBefore"
                        ? null
                        : outgoingEdge
                            ? outgoingEdge.id
                            : null,
                    step.action,
                    data,
                    operation.type ===
                        "addNodeAfter"
                        ? targetNode.id
                        : undefined,
                    operation.type ===
                        "addNodeBefore"
                        ? targetNode.id
                        : undefined,
                );

            if (
                !result.node
            ) {
                return {
                    nodes,

                    edges,
                };
            }

            const postPatch =
                buildModificationUpdatePatch(
                    step,
                );

            delete postPatch
                .locatorStrategy;

            delete postPatch
                .locator;

            delete postPatch
                .text;

            if (
                Object.keys(
                    postPatch,
                ).length > 0
            ) {
                const updated =
                    updateNodeDataAction(
                        result.nodes,
                        result.node.id,
                        postPatch,
                    );

                return {
                    nodes: updated,

                    edges:
                        result.edges,
                };
            }

            return {
                nodes:
                    result.nodes,

                edges:
                    result.edges,
            };
        }

        case "updateNode": {
            const targetNode =
                nodes.find(
                    (node) =>
                        node.id ===
                        operation.targetNodeId,
                );

            if (!targetNode) {
                return {
                    nodes,

                    edges,
                };
            }

            const patch =
                buildModificationUpdatePatch(
                    operation.step,
                );

            const updated =
                updateNodeDataAction(
                    nodes,
                    targetNode.id,
                    patch,
                );

            return {
                nodes: updated,

                edges,
            };
        }

        case "deleteNode": {
            const result =
                deleteNodeAction(
                    nodes,
                    edges,
                    operation.targetNodeId,
                );

            return {
                nodes:
                    result.nodes,

                edges:
                    result.edges,
            };
        }

        default:
            return {
                nodes,

                edges,
            };
    }
}

function buildModificationCreateData(
    step: ModificationStep,
): FlowNodeDataPatch {
    return {
        ...(step.locatorStrategy !==
            undefined && {
            locatorStrategy:
                step.locatorStrategy,
        }),

        ...(step.locator !==
            undefined && {
            locator: step.locator,
        }),

        ...(step.text !==
            undefined && {
            text: step.text,
        }),

        ...(step.variableName !==
            undefined && {
            variableName:
                step.variableName,
        }),

        ...(step.actual !==
            undefined && {
            actual: step.actual,
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
    } as FlowNodeDataPatch;
}

function buildModificationUpdatePatch(
    step: ModificationStep,
): Record<
    string,
    unknown
> {
    const patch: Record<
        string,
        unknown
    > = {};

    if (
        step.title !== undefined
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
        step.locator !== undefined
    ) {
        patch.locator =
            step.locator;
    }

    switch (step.action) {
        case "input":
            if (
                step.text !== undefined
            ) {
                patch.text =
                    step.text;
            }

            break;

        case "assert":
        case "if":
            if (
                step.actual !== undefined
            ) {
                patch.actual =
                    step.actual;
            }

            if (
                step.operator !== undefined
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
                step.duration !== undefined
            ) {
                patch.duration =
                    step.duration;
            }

            break;

        case "wait":
            if (
                step.timeout !== undefined
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
                step.text !== undefined
            ) {
                patch.value =
                    step.text;
            }

            break;

        default:
            break;
    }

    return patch;
}

function projectModificationPlan(
    nodes: FlowNode[],
    edges: Edge[],
    plan: ModificationPlan,
): {
    nodes: FlowNode[];

    edges: Edge[];
} {
    const operations:
        ModificationOperationData[] =
        Array.isArray(
            plan.operations,
        )
            ? plan.operations
            : plan.operation
                ? [plan.operation]
                : [];

    let workingNodes =
        nodes;

    let workingEdges =
        edges;

    const operationResults =
        new Map<
            string,
            string
        >();

    for (
        const operation of operations
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

            const resolved =
                operationResults.get(
                    reference,
                );

            if (
                !resolved
            ) {
                continue;
            }

            resolvedTargetNodeId =
                resolved;
        }

        const resolvedOperation:
            ModificationOperationData =
            "step" in operation
                ? {
                    ...(operation as {
                        type:
                        | "addNodeAfter"
                        | "addNodeBefore"
                        | "updateNode";

                        targetNodeId: string;

                        step: ModificationStep;

                        resultId?: string;
                    }),

                    targetNodeId:
                        resolvedTargetNodeId,
                }
                : {
                    ...operation,

                    targetNodeId:
                        resolvedTargetNodeId,
                };

        const result =
            projectModificationStep(
                workingNodes,
                workingEdges,
                resolvedOperation,
            );

        const newNode =
            result.nodes.find(
                (node) =>
                    !workingNodes.some(
                        (existing) =>
                            existing.id ===
                            node.id,
                    ),
            );

        workingNodes =
            result.nodes;

        workingEdges =
            result.edges;

        if (
            newNode &&
            "resultId" in operation &&
            operation.resultId
        ) {
            operationResults.set(
                operation.resultId!,
                newNode.id,
            );
        }
    }

    return {
        nodes: workingNodes,

        edges: workingEdges,
    };
}

/*
 * ------------------------------------------------------------------
 * Public API
 * ------------------------------------------------------------------
 */

export function computePlanDiff(
    source: PlanDiffSource,
    currentNodes: FlowNode[],
    currentEdges: Edge[],
): PlanDiff {
    let projected: {
        nodes: FlowNode[];

        edges: Edge[];
    };

    if (source.kind === "flow") {
        projected =
            projectAIFlowPlan(
                currentNodes,
                currentEdges,
                source.plan,
            );
    } else {
        projected =
            projectModificationPlan(
                currentNodes,
                currentEdges,
                source.plan,
            );
    }

    const delta =
        diffProjection(
            currentNodes,
            currentEdges,
            projected.nodes,
            projected.edges,
        );

    return {
        ...delta,

        projectedNodes:
            projected.nodes,

        projectedEdges:
            projected.edges,
    };
}
