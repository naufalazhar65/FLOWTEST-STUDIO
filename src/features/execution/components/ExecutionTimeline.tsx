import { useMemo } from "react";

import { useExecutionLogStore } from "../store/useExecutionLogStore";
import { TimelineItem } from "./TimelineItem";

export function ExecutionTimeline() {
  const logs = useExecutionLogStore(
    (state) => state.logs
  );

  const filter = useExecutionLogStore(
    (state) => state.filter
  );

  const filteredLogs = useMemo(() => {
    if (filter === "all") {
      return logs;
    }

    return logs.filter(
      (log) => log.level === filter
    );
  }, [logs, filter]);

  if (filteredLogs.length === 0) {
    return (
      <div
        style={{
          color: "#6B7280",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        No execution logs.
      </div>
    );
  }

  return (
    <>
      {filteredLogs.map((log) => (
        <TimelineItem
          key={log.id}
          log={log}
        />
      ))}
    </>
  );
}