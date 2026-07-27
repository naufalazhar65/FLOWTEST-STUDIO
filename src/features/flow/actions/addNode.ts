import type { Edge } from "reactflow";

import type { NodeType } from "../types/NodePlugin";
import type { FlowNode } from "../types/flowNode";

import { createNode } from "../factories/nodeFactory";
import { appendEdge } from "../services/graphService";

export function addNodeAction(
    nodes: FlowNode[],
    edges: Edge[],
    type: NodeType
) {
    const node = createNode(type);

    const lastNode = nodes.at(-1);

    return {
        nodes: [...nodes, node],

        edges: lastNode
            ? appendEdge(edges, lastNode.id, node.id)
            : edges,
    };
}