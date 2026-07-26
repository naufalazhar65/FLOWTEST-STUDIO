import type {
  FlowNode,
  FlowNodeData,
} from "../types/flowNode";

export function updateNodeDataAction(
  nodes: FlowNode[],
  id: string,
  data: Partial<FlowNodeData>
): FlowNode[] {
  return nodes.map((node) =>
    node.id === id
      ? {
          ...node,
          data: {
            ...node.data,
            ...data,
          },
        }
      : node
  );
}