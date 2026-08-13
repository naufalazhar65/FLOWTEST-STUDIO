import type {
  FlowNode,
  FlowNodeData,
  FlowNodeDataPatch,
} from "../types/flowNode";

export function updateNodeDataAction(
  nodes: FlowNode[],
  id: string,
  data: FlowNodeDataPatch,
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