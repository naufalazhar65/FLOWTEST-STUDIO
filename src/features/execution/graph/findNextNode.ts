import type { Edge } from "reactflow";

import type { FlowNode } from "../../flow/types/flowNode";

export function findNextNode(
    nodeId: string,
    output: string,
    nodes: FlowNode[],
    edges: Edge[]
): FlowNode | null {

    const edge = edges.find(edge =>

        edge.source === nodeId &&

        (edge.sourceHandle ?? "next") === output

    );

    if (!edge) {
        return null;
    }

    return (
        nodes.find(
            node => node.id === edge.target
        ) ?? null
    );
}