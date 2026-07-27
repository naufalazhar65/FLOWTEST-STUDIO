import { plugins } from "../plugins";

import type {
  FlowNode,
  FlowNodeData,
} from "../types/flowNode";

import type {
  NodePlugin,
  NodeType,
} from "../types/NodePlugin";

let currentY = 80;

export function createNode(
  action: NodeType
): FlowNode {
  const plugin = plugins.find(
    (plugin): plugin is NodePlugin =>
      plugin.type === action
  );

  if (!plugin) {
    throw new Error(
      `Unknown node type: ${action}`
    );
  }

  const data = {
    ...plugin.defaults,

    title: plugin.title,
    subtitle: plugin.subtitle,

    debug: {
      breakpoint: false,
    },
  } as FlowNodeData;

  const node: FlowNode = {
    id: crypto.randomUUID(),

    type: "flow",

    position: {
      x: 250,
      y: currentY,
    },

    data,
  };

  currentY += 180;

  return node;
}