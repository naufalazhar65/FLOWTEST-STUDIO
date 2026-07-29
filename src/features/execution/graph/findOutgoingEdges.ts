import type { Edge } from "reactflow";

export function findOutgoingEdges(
    nodeId: string,
    edges: Edge[]
): Edge[] {

    return edges.filter(
        edge => edge.source === nodeId
    );
}