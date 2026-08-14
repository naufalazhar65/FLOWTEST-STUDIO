import type { Edge } from "reactflow";

import type { NodeType } from "../types/NodePlugin";
import type { FlowNode } from "../types/flowNode";

import { createNode } from "../factories/nodeFactory";
import { appendEdge } from "../services/graphService";
import { getNodePlugin } from "../services/pluginRegistry";

function getDefaultSourceHandle(
    node: FlowNode,
): string | undefined {
    const plugin =
        getNodePlugin(
            node.data.action,
        );

    const outputs =
        plugin?.handles?.outputs;

    if (!outputs?.length) {
        return undefined;
    }

    if (
        node.data.action === "repeat" &&
        outputs.includes("body")
    ) {
        return "body";
    }

    return outputs[0];
}

export function addNodeAction(
    nodes: FlowNode[],
    edges: Edge[],
    type: NodeType,
) {
    const lastNode = nodes.at(-1);

    const node = createNode(
        type,
        undefined,
        {
            x: 250,
            y: lastNode
                ? lastNode.position.y + 180
                : 80,
        },
    );

    return {
        nodes: [
            ...nodes,
            node,
        ],

        edges: lastNode
            ? appendEdge(
                edges,
                lastNode.id,
                node.id,
                getDefaultSourceHandle(
                    lastNode,
                ),
            )
            : edges,
    };
}