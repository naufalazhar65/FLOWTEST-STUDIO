import type { Edge } from "reactflow";

import type { FlowNode } from "../types/flowNode";
import type { NodeType } from "../types/NodePlugin";
import { createNode } from "../factories/nodeFactory";
import { createEdge } from "../factories/edgeFactory";

interface InsertNodeResult {
  nodes: FlowNode[];
  edges: Edge[];
}

export function insertNodeAction(
  nodes: FlowNode[],
  edges: Edge[],
  edgeId: string,
  type: NodeType
): InsertNodeResult {
  const edge = edges.find(
    (edge) => edge.id === edgeId
  );

  if (!edge) {
    return {
      nodes,
      edges,
    };
  }

  const node = createNode(type);

  const remainingEdges = edges.filter(
    (edge) => edge.id !== edgeId
  );

  return {
    nodes: [
      ...nodes,
      node,
    ],

    edges: [
      ...remainingEdges,

      createEdge(
        edge.source,
        node.id
      ),

      createEdge(
        node.id,
        edge.target
      ),
    ],
  };
}