import type { Edge } from "reactflow";

import type { FlowNode } from "../types/flowNode";

import { createEdge } from "../factories/edgeFactory";
import { getNodePlugin } from "../services/pluginRegistry";

export function duplicateNodeAction(
  nodes: FlowNode[],
  edges: Edge[],
  nodeId: string,
) {
  const node = nodes.find(
    (item) => item.id === nodeId,
  );

  if (!node) {
    return {
      nodes,
      edges,
    };
  }

  const duplicatedNode: FlowNode = {
    ...structuredClone(node),

    id: crypto.randomUUID(),

    position: {
      x: node.position.x + 60,
      y: node.position.y + 60,
    },

    selected: false,
  };

  const plugin =
    getNodePlugin(node.data.action);

  const outputs =
    plugin.handles?.outputs ?? [];

  const duplicateEdge =
    outputs.length === 1
      ? createEdge(
        node.id,
        duplicatedNode.id,
        outputs[0],
      )
      : null;

  return {
    nodes: [
      ...nodes,
      duplicatedNode,
    ],

    edges: duplicateEdge
      ? [
        ...edges,
        duplicateEdge,
      ]
      : edges,
  };
}