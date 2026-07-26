import type { FlowNode } from "../types/flowNode";
import type { NodeType } from "../config/nodeRegistry";

import { plugins } from "../plugins";

let currentY = 80;

export function createNode(
  action: NodeType
): FlowNode {

  const plugin = plugins.find(
    (plugin) => plugin.type === action
  );

  if (!plugin) {
    throw new Error(`Unknown node type: ${action}`);
  }

  const node: FlowNode = {
    id: crypto.randomUUID(),

    type: "flow",

    position: {
      x: 250,
      y: currentY,
    },

    data: {
      ...plugin.defaults,

      title: plugin.title,
      subtitle: plugin.subtitle,
    },
  };

  currentY += 180;

  return node;
}