import {
    Play,
    Pause,
    CheckCircle2,
    XCircle,
    Square,
} from "lucide-react";

import { ProgressBar } from "../../../components/ui/ProgressBar";

import { useExecutionStore } from "../store/useExecutionStore";

import {
    colors,
    layout,
    spacing,
    typography,
} from "../../../themes";

const STATUS_CONFIG = {
    idle: {
        label: "Ready",
        color: colors.textSecondary,
        icon: <Play size={15} />,
    },

    running: {
        label: "Running",
        color: colors.accent,
        icon: <Play size={15} />,
    },

    paused: {
        label: "Paused",
        color: colors.warning,
        icon: <Pause size={15} />,
    },

    passed: {
        label: "Passed",
        color: colors.success,
        icon: <CheckCircle2 size={15} />,
    },

    failed: {
        label: "Failed",
        color: colors.danger,
        icon: <XCircle size={15} />,
    },

    stopped: {
        label: "Stopped",
        color: colors.textSecondary,
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
                ...layout.row,

                height: 44,

                gap: spacing.lg,

                padding: `0 ${spacing.lg}px`,

                background: colors.panel,

                borderBottom: `1px solid ${colors.border}`,
            }}
        >
            <div
                style={{
                    ...layout.row,

                    gap: spacing.sm,

                    minWidth: 130,

                    color: current.color,

                    ...typography.subtitle,
                }}
            >
                {current.icon}

                <span>
                    {current.label}
                </span>
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

                    color: colors.textSecondary,

                    ...typography.caption,
                }}
            >
                {executedNodes} / {totalNodes} Nodes
            </div>
        </div>
    );
}