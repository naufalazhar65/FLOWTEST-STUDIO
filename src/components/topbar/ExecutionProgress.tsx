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

    if (status === "idle") {
        return null;
    }

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}
        >
            <span
                style={{
                    color: "#8B949E",
                    fontSize: 12,
                    minWidth: 48,
                }}
            >
                {executedNodes}/{totalNodes}
            </span>

            <ProgressBar
                progress={progress}
                color={
                    status === "failed"
                        ? "#EF4444"
                        : "#22C55E"
                }
            />

            <span
                style={{
                    color: "#8B949E",
                    fontSize: 12,
                    minWidth: 36,
                }}
            >
                {progress}%
            </span>
        </div>
    );
}