import { Trash2 } from "lucide-react";

import { useExecutionLogStore } from "../../features/execution/store/useExecutionLogStore";
import { ExecutionTimeline } from "../../features/execution/components/ExecutionTimeline";
import { ExecutionFilter } from "../../features/execution/components/ExecutionFilter";


export function ConsolePanel() {
  const clear = useExecutionLogStore((state) => state.clear);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#0D1117",
        borderTop: "1px solid #30363D",
        color: "#FFF",
        fontFamily: "monospace",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          borderBottom: "1px solid #30363D",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Console
        </div>

        <button
          onClick={clear}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "none",
            color: "#8B949E",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 16px",
        }}
      >
        <ExecutionFilter />

        <ExecutionTimeline />
      </div>
    </div>
  );
}