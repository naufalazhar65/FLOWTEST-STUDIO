import { nodeRegistry } from "../config/nodeRegistry";
import type { FlowNode } from "../types/flowNode";

export function useNodeConfig(
  node: FlowNode
) {
  return nodeRegistry[node.data.action];
}