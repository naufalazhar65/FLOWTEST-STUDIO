import { useFlowStore } from "../../features/flow/store/useFlowStore";

import { TextField } from "./fields/TextField";
import { SelectField } from "./fields/SelectField";

export function InspectorPanel() {
  const {
    nodes,
    selectedNodeId,
    updateNodeData,
  } = useFlowStore();

  const node = nodes.find(
    (n) => n.id === selectedNodeId
  );

  if (!node) {
    return (
      <div
        style={{
          padding: 24,
          color: "#9CA3AF",
        }}
      >
        Select a node
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 20,
        color: "#FFF",
      }}
    >
      <h2
        style={{
          marginBottom: 24,
        }}
      >
        Inspector
      </h2>

      <TextField
        label="Action"
        value={node.data.title}
        onChange={() => {}}
      />

      <SelectField
        label="Locator Strategy"
        value={node.data.locatorStrategy}
        options={[
          {
            label: "id",
            value: "id",
          },
          {
            label: "xpath",
            value: "xpath",
          },
          {
            label: "accessibility id",
            value: "accessibility id",
          },
          {
            label: "class name",
            value: "class name",
          },
        ]}
        onChange={(value) =>
          updateNodeData(node.id, {
            locatorStrategy: value,
          })
        }
      />

      <TextField
        label="Locator"
        value={node.data.locator}
        placeholder="resource-id / xpath"
        onChange={(value) =>
          updateNodeData(node.id, {
            locator: value,
          })
        }
      />

      {node.data.action === "input" && (
        <TextField
          label="Text"
          value={node.data.text ?? ""}
          placeholder="Text to input"
          onChange={(value) =>
            updateNodeData(node.id, {
              text: value,
            })
          }
        />
      )}

      {node.data.action === "assert" && (
        <TextField
          label="Expected"
          value={node.data.expected ?? ""}
          placeholder="Expected value"
          onChange={(value) =>
            updateNodeData(node.id, {
              expected: value,
            })
          }
        />
      )}
    </div>
  );
}