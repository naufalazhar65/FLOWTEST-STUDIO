import { useEffect } from "react";
import { useReactFlow } from "reactflow";

import { useFlowStore } from "../../flow/store/useFlowStore";
import { useExecutionStore } from "../store/useExecutionStore";

export function useExecutionCamera() {
  const reactFlow = useReactFlow();

  const nodes = useFlowStore((state) => state.nodes);

  const currentNodeId = useExecutionStore(
    (state) => state.currentNodeId
  );

  useEffect(() => {
    if (!currentNodeId) {
      return;
    }

    const node = nodes.find(
      (node) => node.id === currentNodeId
    );

    if (!node) {
      return;
    }

    reactFlow.setCenter(
      node.position.x + 120,
      node.position.y + 60,
      {
        zoom: 1.1,
        duration: 500,
      }
    );
  }, [currentNodeId, nodes, reactFlow]);
}