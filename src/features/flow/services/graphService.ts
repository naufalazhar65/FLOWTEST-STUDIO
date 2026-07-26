import type { Edge } from "reactflow";

import { createEdge } from "../factories/edgeFactory";

export function appendEdge(
  edges: Edge[],
  source: string,
  target: string
): Edge[] {
  return [...edges, createEdge(source, target)];
}

export function reconnectEdges(
  edges: Edge[],
  deletedNodeId: string
): Edge[] {
  const incoming = edges.find(
    (edge) => edge.target === deletedNodeId
  );

  const outgoing = edges.find(
    (edge) => edge.source === deletedNodeId
  );

  const filtered = edges.filter(
    (edge) =>
      edge.source !== deletedNodeId &&
      edge.target !== deletedNodeId
  );

  if (incoming && outgoing) {
    filtered.push(
      createEdge(
        incoming.source,
        outgoing.target
      )
    );
  }

  return filtered;
}