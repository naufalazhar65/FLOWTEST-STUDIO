import type { Edge } from "reactflow";

import type { NodeType } from "../types/NodePlugin";
import type { FlowNode } from "../types/flowNode";

import { createNode } from "../factories/nodeFactory";
import { appendEdge } from "../services/graphService";

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
            )
            : edges,
    };
}