import { useExecutionStore } from "../../features/execution/store/useExecutionStore";

function formatDuration(ms: number) {
    if (ms <= 0) {
        return "0.00 s";
    }

    return `${(ms / 1000).toFixed(2)} s`;
}

export function StatusBar() {
    const status = useExecutionStore(
        (state) => state.status
    );

    const progress = useExecutionStore(
        (state) => state.progress
    );

    const executedNodes = useExecutionStore(
        (state) => state.executedNodes
    );

    const totalNodes = useExecutionStore(
        (state) => state.totalNodes
    );

    const passedNodes = useExecutionStore(
        (state) => state.passedNodes
    );

    const failedNodes = useExecutionStore(
        (state) => state.failedNodes
    );

    const duration = useExecutionStore(
        (state) => state.duration
    );

    const statusColor =
        status === "running"
            ? "#F59E0B"
            : status === "paused"
                ? "#FBBF24"
                : status === "passed"
                    ? "#22C55E"
                    : status === "failed"
                        ? "#EF4444"
                        : status === "stopped"
                            ? "#6B7280"
                            : "#8B949E";

    const statusText =
        status === "idle"
            ? "Ready"
            : status === "running"
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

    return (
        <footer
            style={{
                height: 32,
                background: "#161B22",
                borderTop: "1px solid #30363D",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
                fontSize: 12,
                color: "#8B949E",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: 18,
                    alignItems: "center",
                }}
            >
                <span>FlowTest Studio v0.1</span>

                <span>
                    Progress:
                    {" "}
                    {executedNodes}/{totalNodes}
                </span>

                <span>
                    Passed:
                    {" "}
                    {passedNodes}
                </span>

                <span>
                    Failed:
                    {" "}
                    {failedNodes}
                </span>

                <span>
                    Duration:
                    {" "}
                    {formatDuration(duration)}
                </span>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: statusColor,
                    fontWeight: 600,
                }}
            >
                <div
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: statusColor,
                    }}
                />

                <span>{statusText}</span>

                {status !== "idle" && (
                    <span
                        style={{
                            color: "#8B949E",
                        }}
                    >
                        ({progress}%)
                    </span>
                )}
            </div>
        </footer>
    );
}