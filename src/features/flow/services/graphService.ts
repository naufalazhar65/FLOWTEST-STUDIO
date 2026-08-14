import type { Edge } from "reactflow";

import { createEdge } from "../factories/edgeFactory";

export function appendEdge(
  edges: Edge[],
  source: string,
  target: string,
  sourceHandle?: string,
): Edge[] {
  return [
    ...edges,
    createEdge(
      source,
      target,
      sourceHandle,
    ),
  ];
}

export function reconnectEdges(
  edges: Edge[],
  deletedNodeId: string,
): Edge[] {
  const incoming = edges.filter(
    (edge) =>
      edge.target ===
      deletedNodeId,
  );

  const outgoing = edges.filter(
    (edge) =>
      edge.source ===
      deletedNodeId,
  );

  const filtered = edges.filter(
    (edge) =>
      edge.source !==
      deletedNodeId &&
      edge.target !==
      deletedNodeId,
  );

  for (const incomingEdge of incoming) {
    for (const outgoingEdge of outgoing) {
      filtered.push(
        createEdge(
          incomingEdge.source,
          outgoingEdge.target,
          incomingEdge.sourceHandle ??
          undefined,
          outgoingEdge.targetHandle ??
          undefined,
        ),
      );
    }
  }

  return filtered;
}