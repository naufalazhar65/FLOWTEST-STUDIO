import { useFlowStore } from "../../features/flow/store/useFlowStore";

import { InspectorField } from "../../features/flow/components/inspector/InspectorField";

import { getNodePlugin } from "../../features/flow/services/pluginRegistry";
import { validateNode } from "../../features/flow/validation/validateNode";

import { Badge } from "../ui/Badge";
import { Divider } from "../ui/Divider";

export function InspectorPanel() {
  const {
    nodes,
    selectedNodeId,
    updateNodeData,
  } = useFlowStore();

  const node = nodes.find(
    (node) => node.id === selectedNodeId
  );

  if (!node) {
    return (
      <div
        style={{
          padding: 24,
          color: "#8B949E",
        }}
      >
        Select a node
      </div>
    );
  }

  const plugin = getNodePlugin(
    node.data.action
  );

  const validation = validateNode(
    node.data
  );

  const nodeData = node.data as unknown as Record<
    string,
    unknown
  >;


  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        padding: 24,
        color: "#FFF",
        boxSizing: "border-box",
      }}
    >
      <Badge color={plugin.color}>
        {plugin.title.toUpperCase()}
      </Badge>

      <h2
        style={{
          marginTop: 14,
          marginBottom: 4,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        {plugin.title}
      </h2>

      <p
        style={{
          color: "#8B949E",
          marginTop: 0,
          marginBottom: 20,
          lineHeight: 1.5,
        }}
      >
        {plugin.subtitle}
      </p>

      <Divider />

      <div
        style={{
          marginBottom: 18,
          fontWeight: 700,
          fontSize: 13,
          color: "#94A3B8",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        General
      </div>

      {plugin.fields.map((field) => (
        <InspectorField
          key={field.key}
          field={field}
          value={String(
            nodeData[field.key] ?? ""
          )}
          onChange={(value) =>
            updateNodeData(
              node.id,
              {
                [field.key]: value,
              } as Partial<typeof node.data>
            )
          }
        />
      ))}

      <Divider />

      <div
        style={{
          marginBottom: 16,
          fontWeight: 700,
          fontSize: 13,
          color: "#94A3B8",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        Preview
      </div>

      <div
        style={{
          padding: 14,
          borderRadius: 10,
          background: "#161B22",
          border: "1px solid #30363D",
          marginBottom: 20,
        }}
      >
        {plugin.preview?.(node.data)}
      </div>

      <Divider />

      {validation.valid ? (
        <div
          style={{
            padding: 12,
            borderRadius: 10,
            background: "#12341F",
            border: "1px solid #10B981",
            color: "#6EE7B7",
            fontWeight: 600,
          }}
        >
          ✓ Node is valid
        </div>
      ) : (
        <div
          style={{
            padding: 14,
            borderRadius: 10,
            background: "#3A1618",
            border: "1px solid #EF4444",
          }}
        >
          <div
            style={{
              color: "#FCA5A5",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Validation Errors
          </div>

          {validation.errors.map((error) => (
            <div
              key={error}
              style={{
                color: "#FCA5A5",
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              • {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}