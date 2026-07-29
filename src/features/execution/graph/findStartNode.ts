import type { Edge } from "reactflow";

import type { FlowNode } from "../../flow/types/flowNode";

export function findStartNode(
    nodes: FlowNode[],
    edges: Edge[]
): FlowNode | null {

    const targets = new Set(
        edges.map(edge => edge.target)
    );

    return (
        nodes.find(
            node => !targets.has(node.id)
        ) ?? null
    );
}