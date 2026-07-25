import type { Edge } from "reactflow";

export function createEdge(
  source: string,
  target: string
): Edge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    animated: false,

    style: {
      stroke: "#64748B",
      strokeWidth: 2,
    },
  };
}