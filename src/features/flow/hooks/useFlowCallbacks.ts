import {
  addEdge,
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
  } = useFlowStore();

  const onNodesChange = (
    changes: NodeChange[]
  ) => {
    setNodes((nodes) =>
      applyNodeChanges(changes, nodes)
    );
  };

  const onEdgesChange = (
    changes: EdgeChange[]
  ) => {
    setEdges((edges) =>
      applyEdgeChanges(changes, edges)
    );
  };

  const onConnect = (
    connection: Connection
  ) => {
    setEdges((edges) =>
      addEdge(connection, edges)
    );
  };

  const onNodeClick = (
    _event: React.MouseEvent,
    node: Node
  ) => {
    setSelectedNode(node.id);
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