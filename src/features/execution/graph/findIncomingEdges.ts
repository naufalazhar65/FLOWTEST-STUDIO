import type { Edge } from "reactflow";

export function findIncomingEdges(
  nodeId: string,
  edges: Edge[]
): Edge[] {
  return edges.filter(
    (edge) => edge.target === nodeId
  );
}