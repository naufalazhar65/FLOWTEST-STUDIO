import {
    Play,
    Pause,
    CheckCircle2,
    XCircle,
    Square,
} from "lucide-react";

import { ProgressBar } from "../../components/ui/ProgressBar";
import { useExecutionStore } from "./store/useExecutionStore";

const STATUS_CONFIG = {
    idle: {
        label: "Ready",
        color: "#8B949E",
        icon: <Play size={15} />,
    },

    running: {
        label: "Running",
        color: "#3B82F6",
        icon: <Play size={15} />,
    },

    paused: {
        label: "Paused",
        color: "#F59E0B",
        icon: <Pause size={15} />,
    },

    passed: {
        label: "Passed",
        color: "#22C55E",
        icon: <CheckCircle2 size={15} />,
    },

    failed: {
        label: "Failed",
        color: "#EF4444",
        icon: <XCircle size={15} />,
    },

    stopped: {
        label: "Stopped",
        color: "#8B949E",
        icon: <Square size={15} />,
    },
} as const;

export function ExecutionBar() {
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

    const current =
        STATUS_CONFIG[
        status as keyof typeof STATUS_CONFIG
        ];

    return (
        <div
            style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                gap: 18,

                padding: "0 18px",

                background: "#11161D",

                borderBottom: "1px solid #30363D",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,

                    minWidth: 120,

                    color: current.color,

                    fontSize: 13,

                    fontWeight: 600,
                }}
            >
                {current.icon}

                {current.label}
            </div>

            <div
                style={{
                    flex: 1,
                    maxWidth: 420,
                }}
            >
                <ProgressBar
                    progress={progress}
                    color={current.color}
                />
            </div>

            <div
                style={{
                    minWidth: 110,

                    textAlign: "right",

                    color: "#8B949E",

                    fontSize: 12,
                }}
            >
                {executedNodes} / {totalNodes} Nodes
            </div>
        </div>
    );
}