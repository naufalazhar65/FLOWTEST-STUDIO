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
      title={config.title}
      color={config.color}
      icon={<Icon size={18} />}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {config.fields.map((field) => (
          <div key={field.key}>
            <div
              style={{
                fontSize: 11,
                color: "#6B7280",
                marginBottom: 4,
              }}
            >
              {field.label}
            </div>

            <div
              style={{
                color: "#FFF",
                fontWeight: 600,
                wordBreak: "break-word",
              }}
            >
              {String(data[field.key] ?? "-")}
            </div>
          </div>
        ))}
      </div>
    </BaseNode>
  );
}