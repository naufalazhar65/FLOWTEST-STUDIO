import type { Node } from "reactflow";

import {
  nodeRegistry,
  type NodeType,
} from "../config/nodeRegistry";
import type { FlowNode } from "../types/flowNode";

let currentY = 80;

export function createNode(action: NodeType): FlowNode {
  const config = nodeRegistry[action];

  const node: Node = {
    id: crypto.randomUUID(),

    type: "flow",

    position: {
      x: 250,
      y: currentY,
    },

    data: {
      title: config.title,
      subtitle: config.subtitle,

      ...config.defaults,
    },
  };

  currentY += 180;

  return node;
}