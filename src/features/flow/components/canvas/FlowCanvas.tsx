import "reactflow/dist/style.css";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";

import { useFlowStore } from "../../store/useFlowStore";

import { useFlowCallbacks } from "../../hooks/useFlowCallbacks";
import { useDeleteNode } from "../../hooks/useDeleteNode";
import { useFlowShortcuts } from "../../hooks/useFlowShortcuts";
import { useClipboardShortcuts } from "../../hooks/useClipboardShortcuts";

import { FlowNode } from "../nodes/FlowNode";
import { FlowEdge } from "../edges/FlowEdge";

import { useExecutionCamera } from "../../../execution/hooks/useExecutionCamera";

const nodeTypes = {
  flow: FlowNode,
};

const edgeTypes = {
  flow: FlowEdge,
};

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

  useDeleteNode({
    selectedNodeId,
    removeNode,
    setSelectedNode,
  });

  useFlowShortcuts();
  useClipboardShortcuts();

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