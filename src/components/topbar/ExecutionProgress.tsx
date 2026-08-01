import { ProgressBar } from "../ui/ProgressBar";

import { useExecutionStore } from "../../features/execution/store/useExecutionStore";

export function ExecutionProgress() {
    const status = useExecutionStore(
        (state) => state.status,
    );

    const progress = useExecutionStore(
        (state) => state.progress,
    );

    const executedNodes = useExecutionStore(
        (state) => state.executedNodes,
    );

    const totalNodes = useExecutionStore(
        (state) => state.totalNodes,
    );

    const statusText =
        status === "running"
            ? "Running"
            : status === "paused"
                ? "Paused"
                : status === "passed"
                    ? "Passed"
                    : status === "failed"
                        ? "Failed"
                        : status === "stopped"
                            ? "Stopped"
                            : "Ready";

    const statusColor =
        status === "failed"
            ? "#EF4444"
            : status === "passed"
                ? "#22C55E"
                : status === "running"
                    ? "#3B82F6"
                    : status === "paused"
                        ? "#F59E0B"
                        : "#8B949E";

    return (
        <div
            style={{
                width: 220,
                padding: "10px 14px",
                borderRadius: 12,
                background: "#0D1117",
                border: "1px solid #30363D",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 8,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span
                    style={{
                        fontSize: 11,
                        color: "#8B949E",
                        fontWeight: 500,
                    }}
                >
                    Execution
                </span>

                <span
                    style={{
                        fontSize: 11,
                        color: statusColor,
                        fontWeight: 600,
                    }}
                >
                    {statusText}
                </span>
            </div>

            <ProgressBar
                progress={progress}
                color={statusColor}
            />

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span
                    style={{
                        fontSize: 11,
                        color: "#8B949E",
                    }}
                >
                    {executedNodes} / {totalNodes} Nodes
                </span>

                <span
                    style={{
                        fontSize: 11,
                        color: "#8B949E",
                    }}
                >
                    {progress}%
                </span>
            </div>
        </div>
    );
}