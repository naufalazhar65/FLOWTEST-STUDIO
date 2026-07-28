import type { CSSProperties } from "react";
import {
  Undo2,
  Redo2,
  Maximize,
} from "lucide-react";

import { useReactFlow } from "reactflow";
import { useFlowStore } from "../../store/useFlowStore";

export function Toolbar() {
  const {
    undo,
    redo,
    history,
    future,
  } = useFlowStore();

  const { fitView } = useReactFlow();

  return (
    <div style={toolbar}>
      <div style={group}>
        <button
          title="Undo"
          disabled={history.length === 0}
          onClick={undo}
          style={{
            ...iconButton,
            opacity: history.length === 0 ? 0.5 : 1,
            cursor:
              history.length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          <Undo2 size={18} />
        </button>

        <button
          title="Redo"
          disabled={future.length === 0}
          onClick={redo}
          style={{
            ...iconButton,
            opacity: future.length === 0 ? 0.5 : 1,
            cursor:
              future.length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          <Redo2 size={18} />
        </button>
      </div>

      <div style={divider} />

      <div style={group}>
        <button
          title="Fit View"
          onClick={() =>
            fitView({
              padding: 0.2,
              duration: 400,
            })
          }
          style={iconButton}
        >
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}

const toolbar: CSSProperties = {
  height: 54,
  display: "flex",
  alignItems: "center",
  padding: "0 18px",
  gap: 14,
  background: "#151922",
  borderBottom: "1px solid #232935",
};

const group: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const divider: CSSProperties = {
  width: 1,
  height: 24,
  background: "#313847",
};

const iconButton: CSSProperties = {
  width: 38,
  height: 38,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  border: "1px solid #313847",
  background: "#202632",
  color: "#FFF",
  cursor: "pointer",
  transition: "all .2s ease",
};