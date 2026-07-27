import type {
  FlowNode,
  FlowNodeData,
} from "../types/flowNode";

export function updateNodeDataAction(
  
  nodes: FlowNode[],
  id: string,
  data: Partial<FlowNodeData>
): FlowNode[] {
  return nodes.map((node) => {
    if (node.id !== id) {
      return node;
    }

    return {
      ...node,
      data: {
        ...node.data,
        ...data,
      } as FlowNodeData,
    };
  });
}