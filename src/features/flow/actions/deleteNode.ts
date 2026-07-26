import type { Edge } from "reactflow";

import type { FlowNode } from "../types/flowNode";

import { reconnectEdges } from "../services/graphService";

export function deleteNodeAction(
  nodes: FlowNode[],
  edges: Edge[],
  id: string
) {
  return {
    nodes: nodes.filter(
      (node) => node.id !== id
    ),

    edges: reconnectEdges(
      edges,
      id
    ),
  };
}