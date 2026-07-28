import {
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useExecutionLogStore } from "../../features/execution/store/useExecutionLogStore";
import { ExecutionTimeline } from "../../features/execution/components/ExecutionTimeline";
import { ExecutionFilter } from "../../features/execution/components/ExecutionFilter";

interface ConsolePanelProps {
  expanded: boolean;
  onToggle: () => void;
}

export function ConsolePanel({
  expanded,
  onToggle,
}: ConsolePanelProps) {
  const clear = useExecutionLogStore(
    (state) => state.clear
  );

  const logs = useExecutionLogStore(
    (state) => state.logs
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#0D1117",
        borderTop: "1px solid #30363D",
        color: "#FFF",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: expanded
            ? "1px solid #30363D"
            : "none",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {expanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}

          <span
            style={{
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Execution Console
          </span>

          <span
            style={{
              padding: "2px 8px",
              borderRadius: 999,
              background: "#202632",
              border: "1px solid #313847",
              color: "#8B949E",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {logs.length} Logs
          </span>
        </div>

        {expanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
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
        )}
      </div>

      {expanded && (
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 16px",
          }}
        >
          <ExecutionFilter />

          <div
            style={{
              marginTop: 12,
            }}
          >
            <ExecutionTimeline />
          </div>
        </div>
      )}
    </div>
  );
}