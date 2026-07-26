import type { Edge } from "reactflow";

export function createEdge(
  source: string,
  target: string
): Edge {
  return {
    id: crypto.randomUUID(),

    source,
    target,

    type: "flow",

    animated: false,
  };
}