import { nodeRegistry } from "../../features/flow/config/nodeRegistry";
import { useFlowStore } from "../../features/flow/store/useFlowStore";

import { InspectorField } from "../../features/flow/components/inspector/InspectorField";

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

  const config =
    nodeRegistry[node.data.action];

  return (
    <div
      style={{
        padding: 24,
        color: "#FFF",
      }}
    >
      <h2
        style={{
          marginTop: 0,
        }}
      >
        {config.title}
      </h2>

      <p
        style={{
          color: "#8B949E",
          marginBottom: 28,
        }}
      >
        {config.subtitle}
      </p>

      {config.fields.map((field) => (
        <InspectorField
          key={field.key}
          field={field}
          value={String(node.data[field.key] ?? "")}
          onChange={(value) =>
            updateNodeData(node.id, {
              [field.key]: value,
            })
          }
        />
      ))}
    </div>
  );
}