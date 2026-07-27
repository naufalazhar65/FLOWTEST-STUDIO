import { useFlowStore } from "../../store/useFlowStore";

interface Props {
  nodeId: string;

  fieldKey: string;

  value: string;
}

export function TextField({
  nodeId,
  fieldKey,
  value,
}: Props) {
  const updateNodeData =
    useFlowStore(
      (state) => state.updateNodeData
    );

  return (
    <input
      value={value}
      onChange={(e) =>
        updateNodeData(nodeId, {
          [fieldKey]: e.target.value,
        })
      }
      style={{
        width: "100%",
        background: "#0F172A",
        border: "1px solid #334155",
        borderRadius: 8,
        color: "#FFF",
        padding: "8px 10px",
        outline: "none",
        fontSize: 13,
      }}
    />
  );
}