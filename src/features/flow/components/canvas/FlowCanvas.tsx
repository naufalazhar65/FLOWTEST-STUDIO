import "reactflow/dist/style.css";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";

import {
  colors,
  radius,
} from "../../../../themes";

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
        background:
          colors.canvas,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}

        onNodesChange={
          callbacks.onNodesChange
        }

        onEdgesChange={
          callbacks.onEdgesChange
        }

        onConnect={(connection) => {
          callbacks.onConnect(
            connection,
          );
        }}

        onNodeClick={
          callbacks.onNodeClick
        }

        onPaneClick={
          callbacks.onPaneClick
        }

        nodesConnectable={true}
        nodesDraggable={true}
        elementsSelectable={true}
        connectOnClick={false}

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

        selectionOnDrag
        panOnDrag
        zoomOnScroll
      >
        <ExecutionCamera />

        <Background
          color={colors.border}
          gap={24}
          size={1}
        />

        <Controls
          showZoom
          showFitView
          showInteractive
          position="bottom-left"
          style={{
            borderRadius:
              radius.md,
            overflow:
              "hidden",
            boxShadow:
              "0 6px 20px rgba(0,0,0,.20)",
          }}
        />

        {nodes.length > 0 && (
          <MiniMap
            position="bottom-right"
            nodeColor={(node) => {
              const data =
                node.data as
                | {
                  color?: string;
                }
                | undefined;

              return (
                data?.color ??
                colors.borderLight
              );
            }}
            maskColor="rgba(13,17,23,0.72)"
            style={{
              background:
                colors.panel,
              border:
                `1px solid ${colors.border}`,
              borderRadius:
                radius.lg,
              boxShadow:
                "0 8px 24px rgba(0,0,0,.25)",
            }}
          />
        )}
      </ReactFlow>
    </div>
  );
}