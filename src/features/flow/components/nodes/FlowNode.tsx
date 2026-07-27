import type { NodeProps } from "reactflow";

import { BaseNode } from "./BaseNode";

import type { FlowNodeData } from "../../types/flowNode";

import { getNodePlugin } from "../../services/pluginRegistry";
import { validateNode } from "../../validation/validateNode";

import { useExecutionStore } from "../../../execution/store/useExecutionStore";
import { useFlowStore } from "../../store/useFlowStore";

export function FlowNode({
  id,
  data,
}: NodeProps<FlowNodeData>) {
  const plugin = getNodePlugin(data.action);

  const Icon = plugin.icon;

  const {
    currentNodeId,
    nodeStatus,
  } = useExecutionStore();

  const updateNodeData = useFlowStore(
    (state) => state.updateNodeData
  );

  const validation = validateNode(data);

  function handleToggleBreakpoint() {
    updateNodeData(id, {
      debug: {
        breakpoint: !data.debug.breakpoint,
      },
    });
  }

  return (
    <BaseNode
      title={plugin.title}
      subtitle={plugin.subtitle}
      icon={<Icon size={18} />}
      color={plugin.color}
      running={currentNodeId === id}
      executionStatus={nodeStatus[id] ?? "idle"}
      valid={validation.valid}
      breakpoint={data.debug?.breakpoint ?? false} onToggleBreakpoint={handleToggleBreakpoint}
    >
      {plugin.preview?.(data)}
    </BaseNode>
  );
}