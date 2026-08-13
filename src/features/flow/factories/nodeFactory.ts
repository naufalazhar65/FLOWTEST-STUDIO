import { plugins } from "../plugins";

import type {
  FlowNode,
  FlowNodeData,
} from "../types/flowNode";

import type {
  NodePlugin,
  NodeType,
} from "../types/NodePlugin";

import type { LocatorStrategy } from "../../execution/types/LocatorStrategy";

interface NodeOverrides {
  locatorStrategy?: LocatorStrategy;
  locator?: string;
  text?: string;
}

interface NodePosition {
  x: number;
  y: number;
}

export function createNode(
  action: NodeType,
  overrides?: NodeOverrides,
  position?: NodePosition,
): FlowNode {
  const plugin = plugins.find(
    (plugin): plugin is NodePlugin =>
      plugin.type === action,
  );

  if (!plugin) {
    throw new Error(
      `Unknown node type: ${action}`,
    );
  }

  const data: FlowNodeData = {
    ...plugin.defaults,

    title: plugin.title,
    subtitle: plugin.subtitle,

    ...overrides,

    debug: {
      breakpoint: false,
    },
  };

  return {
    id: crypto.randomUUID(),

    type: "flow",

    position: position ?? {
      x: 250,
      y: 80,
    },

    data,
  };
}