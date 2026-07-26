import {
  Undo2,
  Redo2,
  ScanSearch,
  Hand,
} from "lucide-react";

import { useFlowStore } from "../../store/useFlowStore";
import {
  nodeRegistry,
  type NodeType,
} from "../../config/nodeRegistry";

const actionOrder: NodeType[] = [
  "tap",
  "input",
  "assert",
];

export function Toolbar() {
  console.log("Toolbar Render");

  const { addNode, undo,
    redo, history,
    future, } = useFlowStore();

  return (
    <div
      style={{
        height: 54,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 18px",
        borderBottom: "1px solid #232935",
        background: "#151922",
      }}
    >
      {actionOrder.map((type) => {
        const config = nodeRegistry[type];
        const Icon = config.icon;

        return (
          <button
            key={type}
            onClick={() => {
              console.log("CLICK:", type);
              addNode(type);
            }}
            style={buttonStyle}
          >
            <Icon size={18} />
            {config.title}
          </button>
        );
      })}

      {/* Future Feature */}
      <button style={buttonStyle}>
        <Hand size={18} />
        Swipe
      </button>

      <div style={{ flex: 1 }} />

      <button
        onClick={undo}
        disabled={history.length === 0}
        style={{
          ...iconButton,
          opacity:
            history.length === 0 ? 0.4 : 1,
        }}
      >
        <Undo2 size={18} />
      </button>

      <button
        onClick={redo}
        disabled={future.length === 0}
        style={{
          ...iconButton,
          opacity:
            future.length === 0 ? 0.4 : 1,
        }}
      >
        <Redo2 size={18} />
      </button>

      <button style={iconButton}>
        <ScanSearch size={18} />
      </button>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "#202632",
  border: "1px solid #313847",
  color: "#FFF",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
  transition: "0.2s",
};

const iconButton: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 8,
  border: "1px solid #313847",
  background: "#202632",
  color: "#FFF",
  cursor: "pointer",
};