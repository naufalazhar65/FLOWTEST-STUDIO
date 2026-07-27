import {
  Undo2,
  Redo2,
  ScanSearch,
  Hand,
} from "lucide-react";

import { useFlowStore } from "../../store/useFlowStore";
import { getPlugins } from "../../services/pluginRegistry";

export function Toolbar() {
  const {
    addNode,
    undo,
    redo,
    history,
    future,
  } = useFlowStore();

  const plugins = getPlugins();

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
      {plugins.map((plugin) => {
        const Icon = plugin.icon;

        return (
          <button
            key={plugin.type}
            onClick={() =>
              addNode(plugin.type)
            }
            style={buttonStyle}
          >
            <Icon size={18} />
            {plugin.title}
          </button>
        );
      })}

      <button
        style={buttonStyle}
        disabled
      >
        <Hand size={18} />
        Swipe
      </button>

      <div style={{ flex: 1 }} />

      <button
        title="Undo"
        style={{
          ...iconButton,
          opacity:
            history.length === 0 ? 0.5 : 1,
          cursor:
            history.length === 0
              ? "not-allowed"
              : "pointer",
        }}
        disabled={history.length === 0}
        onClick={undo}
      >
        <Undo2 size={18} />
      </button>

      <button
        title="Redo"
        style={{
          ...iconButton,
          opacity:
            future.length === 0 ? 0.5 : 1,
          cursor:
            future.length === 0
              ? "not-allowed"
              : "pointer",
        }}
        disabled={future.length === 0}
        onClick={redo}
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