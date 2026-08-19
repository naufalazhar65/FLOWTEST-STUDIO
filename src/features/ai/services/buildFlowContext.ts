import { useFlowStore } from "../../flow/store/useFlowStore";

import type {
    AIFlowContext,
    AIFlowContextNode,
    AIFlowContextEdge,
} from "../types/AIRequest";

function buildNodeContext(
    node: ReturnType<
        typeof useFlowStore.getState
    >["nodes"][number],
): AIFlowContextNode {
    const data = node.data;

    const locatorStrategy =
        "locatorStrategy" in data
            ? data.locatorStrategy
            : undefined;

    const locator =
        "locator" in data
            ? data.locator
            : undefined;

    const details: Record<
        string,
        unknown
    > = {};

    Object.entries(data).forEach(
        ([key, value]) => {
            if (
                key === "action" ||
                key === "title" ||
                key === "subtitle" ||
                key === "debug" ||
                key === "locatorStrategy" ||
                key === "locator"
            ) {
                return;
            }

            details[key] = value;
        },
    );

    return {
        id: node.id,
        action: data.action,
        title: data.title,
        subtitle: data.subtitle,
        locatorStrategy,
        locator,
        details:
            Object.keys(details).length > 0
                ? details
                : undefined,
    };
}

export function buildFlowContext(): AIFlowContext {
    const {
        nodes,
        edges,
        selectedNodeId,
    } = useFlowStore.getState();

    const contextNodes =
        nodes.map(
            buildNodeContext,
        );

    const contextEdges:
        AIFlowContextEdge[] =
        edges.map(
            (
                edge,
            ) => ({
                id:
                    edge.id,

                source:
                    edge.source,

                target:
                    edge.target,

                sourceHandle:
                    edge.sourceHandle,

                targetHandle:
                    edge.targetHandle,
            }),
        );

    const selectedNode =
        contextNodes.find(
            (node) =>
                node.id ===
                selectedNodeId,
        ) ?? null;

    return {
        selectedNodeId,

        selectedNode,

        nodes:
            contextNodes,

        edges:
            contextEdges,

        nodeCount:
            contextNodes.length,

        edgeCount:
            contextEdges.length,
    };
}