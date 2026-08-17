import type { Edge } from "reactflow";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    NodeExecutionResult,
} from "../types/NodeExecutionResult";

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

    nextNodeIds: string[];
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

    return {
        node: {
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
        },

        execution:
            result,

        previousNodeIds:
            incoming.get(
                node.id,
            ) ?? [],

        nextNodeIds:
            outgoing.get(
                node.id,
            ) ?? [],
    };
}