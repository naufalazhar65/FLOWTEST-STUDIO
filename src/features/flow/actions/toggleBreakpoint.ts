import { useFlowStore } from "../store/useFlowStore";

export function toggleBreakpoint(nodeId: string) {
  const store = useFlowStore.getState();

  const node = store.nodes.find((n) => n.id === nodeId);

  if (!node) {
    return;
  }

  store.updateNodeData(nodeId, {
    debug: {
      breakpoint: !node.data.debug.breakpoint,
    },
  });
}