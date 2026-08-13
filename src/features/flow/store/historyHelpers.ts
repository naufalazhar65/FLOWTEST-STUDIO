import type { Edge } from "reactflow";

import type { FlowNode } from "../types/flowNode";
import type { FlowSnapshot } from "../types/FlowSnapshot";

export function pushHistory(
  history: FlowSnapshot[],
  nodes: FlowNode[],
  edges: Edge[]
): FlowSnapshot[] {
  return [
    ...history,
    {
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
    },
  ];
}