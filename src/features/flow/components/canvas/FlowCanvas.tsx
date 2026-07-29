import "reactflow/dist/style.css";
import { useEffect } from "react";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";

import { useFlowStore } from "../../store/useFlowStore";

import { useFlowCallbacks } from "../../hooks/useFlowCallbacks";
import { useDeleteNode } from "../../hooks/useDeleteNode";
import { useFlowShortcuts } from "../../hooks/useFlowShortcuts";

import { FlowNode } from "../nodes/FlowNode";
import { FlowEdge } from "../edges/FlowEdge";
import { useHistoryShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useExecutionCamera } from "../../../execution/hooks/useExecutionCamera";

// =========================
// React Flow Types
// =========================



const nodeTypes = {
  flow: FlowNode,
};

const edgeTypes = {
  flow: FlowEdge,
};

// =========================
// Component
// =========================
function ExecutionCamera() {
  useExecutionCamera();

  return null;
}

export function FlowCanvas() {
  const {
    nodes,
    edges,
    selectedNodeId,
    removeNode,
    setSelectedNode,
  } = useFlowStore();


  const callbacks = useFlowCallbacks();

  console.log(edges);

  useEffect(() => {
    console.log("Edges:", edges);
  }, [edges]);



  useDeleteNode({
    selectedNodeId,
    removeNode,
    setSelectedNode,
  });

  useFlowShortcuts();
  useHistoryShortcuts();

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
        edgeTypes={edgeTypes}
        fitView
        translateExtent={[
          [-10000, 0],
          [10000, 10000],
        ]}
        fitViewOptions={{
          padding: 0.3,
        }}
        proOptions={{
          hideAttribution: true,
        }}
        {...callbacks}
      >
        <ExecutionCamera />

        <Background />

        <Controls />

        {nodes.length > 0 && <MiniMap />}
      </ReactFlow>
    </div>
  );
}