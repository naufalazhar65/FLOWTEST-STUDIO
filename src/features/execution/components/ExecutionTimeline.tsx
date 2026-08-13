import { useMemo } from "react";

import {
  colors,
  spacing,
  typography,
} from "../../../themes";

import { useExecutionLogStore } from "../store/useExecutionLogStore";
import { TimelineItem } from "./TimelineItem";

export function ExecutionTimeline() {
  const logs = useExecutionLogStore(
    (state) => state.logs,
  );

  const filter = useExecutionLogStore(
    (state) => state.filter,
  );

  const filteredLogs =
    useMemo(() => {
      if (filter === "all") {
        return logs;
      }

      return logs.filter(
        (log) =>
          log.level === filter,
      );
    }, [logs, filter]);

  if (filteredLogs.length === 0) {
    return (
      <div
        style={{
          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          minHeight: 120,

          padding:
            spacing.xl,

          color:
            colors.textMuted,

          fontSize:
            typography.body
              .fontSize,

          textAlign: "center",
        }}
      >
        No execution logs.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",

        flexDirection:
          "column",

        gap: spacing.sm,
      }}
    >
      {filteredLogs.map(
        (log) => (
          <TimelineItem
            key={log.id}
            log={log}
          />
        ),
      )}
    </div>
  );
}