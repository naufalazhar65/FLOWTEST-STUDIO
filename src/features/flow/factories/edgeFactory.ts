import type { Edge } from "reactflow";

export function createEdge(
  source: string,
  target: string,
  sourceHandle?: string,
  targetHandle?: string,
): Edge {
  return {
    id: crypto.randomUUID(),

    source,
    target,

    ...(sourceHandle !==
      undefined && {
      sourceHandle,
    }),

    ...(targetHandle !==
      undefined && {
      targetHandle,
    }),

    type: "flow",

    animated: false,
  };
}