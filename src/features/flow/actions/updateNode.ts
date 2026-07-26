import type { FlowNode } from "../types/flowNode";

export function updateNodeAction(
  nodes: FlowNode[],
  id: string,
  data: Partial<FlowNode>
): FlowNode[] {
  return nodes.map((node) =>
    node.id === id
      ? {
          ...node,
          ...data,
        }
      : node
  );
}