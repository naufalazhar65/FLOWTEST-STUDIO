import type { Edge } from "reactflow";

import type { FlowNode } from "../types/flowNode";

import { createEdge } from "../factories/edgeFactory";

export function duplicateNodeAction(
  nodes: FlowNode[],
  edges: Edge[],
  nodeId: string
) {
  const node = nodes.find(
    (node) => node.id === nodeId
  );

  if (!node) {
    return {
      nodes,
      edges,
    };
  }

  const duplicatedNode: FlowNode = {
    ...node,

    id: crypto.randomUUID(),

    position: {
      x: node.position.x + 60,
      y: node.position.y + 60,
    },

    selected: false,
  };

  return {
    nodes: [
      ...nodes,
      duplicatedNode,
    ],

    edges: [
      ...edges,

      createEdge(
        node.id,
        duplicatedNode.id
      ),
    ],
  };
}