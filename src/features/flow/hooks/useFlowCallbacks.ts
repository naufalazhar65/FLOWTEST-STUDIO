import {
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";

import type {
  Connection,
  EdgeChange,
  Node,
  NodeChange,
} from "reactflow";

import { useFlowStore } from "../store/useFlowStore";

export function useFlowCallbacks() {
  const {
    setNodes,
    setEdges,
    setSelectedNode,
    connectNodes,
  } = useFlowStore();

  const onNodesChange = (
    changes: NodeChange[],
  ) => {
    setNodes((nodes) =>
      applyNodeChanges(
        changes,
        nodes,
      ),
    );
  };

  const onEdgesChange = (
    changes: EdgeChange[],
  ) => {
    setEdges((edges) =>
      applyEdgeChanges(
        changes,
        edges,
      ),
    );
  };

  const onConnect = (
    connection: Connection,
  ) => {
    connectNodes(connection);
  };

 const onNodeClick = (
    _event: React.MouseEvent,
    node: Node,
) => {
    console.log(
        "[Flow Selection] clicked:",
        {
            id: node.id,
            type: node.type,
            action: node.data?.action,
            title: node.data?.title,
        },
    );

    setSelectedNode(node.id);

    console.log(
        "[Flow Selection] store after click:",
        useFlowStore.getState()
            .selectedNodeId,
    );
};

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  return {
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
  };
}