import "reactflow/dist/style.css";

import { useEffect } from "react";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

import type {
  Node,
  NodeChange,
  EdgeChange,
  Connection,
} from "reactflow";

import { useFlowStore } from "../../store/useFlowStore";
import { FlowNode } from "../nodes/FlowNode";

// =========================
// React Flow Node Types
// =========================

const nodeTypes = {
  flow: FlowNode,
};

export function FlowCanvas() {
  const {
    nodes,
    edges,
    selectedNodeId,
    setNodes,
    setEdges,
    removeNode,
    setSelectedNode,
  } = useFlowStore();

  // =========================
  // React Flow Events
  // =========================

  const onNodesChange = (changes: NodeChange[]) => {
  setNodes((currentNodes) =>
    applyNodeChanges(changes, currentNodes)
  );
};

const onEdgesChange = (changes: EdgeChange[]) => {
  setEdges((currentEdges) =>
    applyEdgeChanges(changes, currentEdges)
  );
};

 const onConnect = (connection: Connection) => {
  setEdges((currentEdges) =>
    addEdge(connection, currentEdges)
  );
};

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
  setSelectedNode(node.id);
};

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  // =========================
  // Delete Selected Node
  // =========================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete") return;
      if (!selectedNodeId) return;

      removeNode(selectedNodeId);
      setSelectedNode(null);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    selectedNodeId,
    removeNode,
    setSelectedNode,
  ]);

  // =========================
  // Render
  // =========================

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{
          padding: 0.3,
        }}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background />
        <Controls />
        {nodes.length > 0 && <MiniMap />}
      </ReactFlow>
    </div>
  );
}