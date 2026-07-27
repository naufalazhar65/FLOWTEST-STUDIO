import { useExecutionLogStore } from "../../features/execution/store/useExecutionLogStore";

const levelColor = {
  info: "#60A5FA",
  success: "#10B981",
  error: "#EF4444",
};

export function ConsolePanel() {
  const logs = useExecutionLogStore(
    (state) => state.logs
  );

  return (
    <div
      style={{
        background: "#0D1117",
        borderTop: "1px solid #30363D",
        padding: 16,
        overflow: "auto",
        color: "#FFF",
        fontFamily: "monospace",
        fontSize: 13,
      }}
    >
      {logs.length === 0 && (
        <div
          style={{
            color: "#6B7280",
          }}
        >
          No execution logs.
        </div>
      )}

      {logs.map((log) => (
        <div
          key={log.id}
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 8,
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#6B7280",
              minWidth: 80,
            }}
          >
            {log.time}
          </span>

          <span
            style={{
              color: levelColor[log.level],
              fontWeight: 700,
              width: 70,
            }}
          >
            {log.level.toUpperCase()}
          </span>

          <span>{log.message}</span>
        </div>
      ))}
    </div>
  );
}