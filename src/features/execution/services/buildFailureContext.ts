import type { Edge } from "reactflow";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    NodeExecutionResult,
} from "../types/NodeExecutionResult";

import {
    findPathToNode,
} from "../graph/findPathToNode";

export interface FailureContextNode {
    id: string;

    action: string;

    title: string;

    subtitle: string;

    locatorStrategy:
    | string
    | null;

    locator:
    | string
    | null;
}

export interface FailureContext {
    node: FailureContextNode;

    execution: NodeExecutionResult;

    previousNodeIds: string[];

    previousNodes: FailureContextNode[];

    nextNodeIds: string[];

    nextNodes: FailureContextNode[];

    executionPathNodes?: FailureContextNode[];
}

function buildOutgoingMap(
    edges: Edge[],
): Map<string, string[]> {
    const outgoing =
        new Map<
            string,
            string[]
        >();

    for (
        const edge of edges
    ) {
        const targets =
            outgoing.get(
                edge.source,
            );

        if (
            targets
        ) {
            targets.push(
                edge.target,
            );

            continue;
        }

        outgoing.set(
            edge.source,
            [
                edge.target,
            ],
        );
    }

    return outgoing;
}

function buildIncomingMap(
    edges: Edge[],
): Map<string, string[]> {
    const incoming =
        new Map<
            string,
            string[]
        >();

    for (
        const edge of edges
    ) {
        const sources =
            incoming.get(
                edge.target,
            );

        if (
            sources
        ) {
            sources.push(
                edge.source,
            );

            continue;
        }

        incoming.set(
            edge.target,
            [
                edge.source,
            ],
        );
    }

    return incoming;
}

function toFailureContextNode(
    node: FlowNode,
): FailureContextNode {
    return {
        id:
            node.id,

        action:
            node.data.action,

        title:
            node.data.title,

        subtitle:
            node.data.subtitle,

        locatorStrategy:
            "locatorStrategy" in
                node.data
                ? node.data
                    .locatorStrategy
                : null,

        locator:
            "locator" in
                node.data
                ? node.data.locator
                : null,
    };
}

export function buildFailureContext(
    result: NodeExecutionResult,
    nodes: FlowNode[],
    edges: Edge[],
): FailureContext | null {
    if (
        !result ||
        result.status !==
        "failed"
    ) {
        return null;
    }

    const node =
        nodes.find(
            (
                candidate,
            ) =>
                candidate.id ===
                result.nodeId,
        );

    if (!node) {
        return null;
    }

    const outgoing =
        buildOutgoingMap(
            edges,
        );

    const incoming =
        buildIncomingMap(
            edges,
        );

    const executionPath =
        findPathToNode(
            nodes,
            edges,
            node.id,
        );

    const executionPathNodes =
        executionPath
            .slice(
                0,
                -1,
            )
            .map(
                toFailureContextNode,
            );

    return {
        node:
            toFailureContextNode(
                node,
            ),

        execution:
            result,

        previousNodeIds:
            incoming.get(
                node.id,
            ) ?? [],

        previousNodes:
            (
                incoming.get(
                    node.id,
                ) ?? []
            )
                .map(
                    (
                        nodeId,
                    ) =>
                        nodes.find(
                            (
                                candidate,
                            ) =>
                                candidate.id ===
                                nodeId,
                        ),
                )
                .filter(
                    (
                        candidate,
                    ): candidate is FlowNode =>
                        candidate !==
                        undefined,
                )
                .map(
                    toFailureContextNode,
                ),

        nextNodeIds:
            outgoing.get(
                node.id,
            ) ?? [],

        nextNodes:
            (
                outgoing.get(
                    node.id,
                ) ?? []
            )
                .map(
                    (
                        nodeId,
                    ) =>
                        nodes.find(
                            (
                                candidate,
                            ) =>
                                candidate.id ===
                                nodeId,
                        ),
                )
                .filter(
                    (
                        candidate,
                    ): candidate is FlowNode =>
                        candidate !==
                        undefined,
                )
                .map(
                    toFailureContextNode,
                ),

        executionPathNodes,
    };
}