import { useExecutionLogStore } from "../store/useExecutionLogStore";
import { TimelineItem } from "./TimelineItem";

export function ExecutionTimeline() {
    const logs = useExecutionLogStore((state) => {
        if (state.filter === "all") {
            return state.logs;
        }

        return state.logs.filter(
            (log) => log.level === state.filter
        );
    });

    if (logs.length === 0) {
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
            {logs.map((log) => (
                <TimelineItem
                    key={log.id}
                    log={log}
                />
            ))}
        </>
    );
}