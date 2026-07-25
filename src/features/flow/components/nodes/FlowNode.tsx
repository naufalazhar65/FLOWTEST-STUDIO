import type { NodeProps } from "reactflow";

import { BaseNode } from "./BaseNode";
import { nodeRegistry } from "../../config/nodeRegistry";

import type { FlowNodeData } from "../../types/FlowNodeData";

export function FlowNode({
  data,
}: NodeProps<FlowNodeData>) {
  const config = nodeRegistry[data.action];

  if (!config) {
    return (
      <div
        style={{
          padding: 20,
          background: "#EF4444",
          color: "#FFF",
          borderRadius: 10,
        }}
      >
        Unknown Node
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <BaseNode
  title={data.title}
  color={config.color}
  icon={<Icon size={18} />}
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <div>
      <div
        style={{
          fontSize: 11,
          color: "#6B7280",
        }}
      >
        {data.locatorStrategy}
      </div>

      <div
        style={{
          color: "#FFF",
          fontWeight: 600,
        }}
      >
        {data.locator || "-"}
      </div>
    </div>

    {data.action === "input" && (
      <div>
        <div
          style={{
            fontSize: 11,
            color: "#6B7280",
          }}
        >
          Text
        </div>

        <div
          style={{
            color: "#FFF",
            fontWeight: 600,
          }}
        >
          {data.text || "-"}
        </div>
      </div>
    )}

    {data.action === "assert" && (
      <div>
        <div
          style={{
            fontSize: 11,
            color: "#6B7280",
          }}
        >
          Expected
        </div>

        <div
          style={{
            color: "#FFF",
            fontWeight: 600,
          }}
        >
          {data.expected || "-"}
        </div>
      </div>
    )}
  </div>
</BaseNode>
  );
}