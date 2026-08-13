import {
    CheckCircle2,
    Pause,
    Play,
    Square,
    XCircle,
} from "lucide-react";

import {
    colors,
    layout,
    radius,
    spacing,
    typography,
} from "../../../themes";

import { ProgressBar } from "../../../components/ui/ProgressBar";

import { useExecutionStore } from "../store/useExecutionStore";

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

    const executedNodes =
        useExecutionStore(
            (state) =>
                state.executedNodes,
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

                minHeight: 44,

                gap: spacing.lg,

                padding:
                    `0 ${spacing.lg}px`,

                background:
                    colors.panel,

                borderBottom:
                    `1px solid ${colors.border}`,

                boxSizing:
                    "border-box",

                flexShrink: 0,
            }}
        >
            {/* Status */}
            <div
                style={{
                    ...layout.row,

                    gap: spacing.sm,

                    minWidth: 130,

                    color: current.color,

                    ...typography.subtitle,
                }}
            >
                <span
                    style={{
                        width: 26,

                        height: 26,

                        display:
                            "inline-flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        flexShrink: 0,

                        borderRadius:
                            radius.sm,

                        background:
                            `${current.color}15`,

                        border:
                            `1px solid ${current.color}35`,

                        color:
                            current.color,
                    }}
                >
                    {current.icon}
                </span>

                <span>
                    {current.label}
                </span>
            </div>

            {/* Progress */}
            <div
                style={{
                    flex: 1,

                    minWidth: 120,

                    maxWidth: 420,

                    display:
                        "flex",

                    alignItems:
                        "center",
                }}
            >
                <ProgressBar
                    progress={progress}
                    color={current.color}
                />
            </div>

            {/* Counter */}
            <div
                style={{
                    minWidth: 110,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "flex-end",

                    gap: spacing.xs,

                    color:
                        colors.textSecondary,

                    ...typography.caption,
                }}
            >
                <span>
                    {executedNodes}
                </span>

                <span
                    style={{
                        color:
                            colors.textMuted,
                    }}
                >
                    /
                </span>

                <span>
                    {totalNodes}
                </span>

                <span
                    style={{
                        marginLeft:
                            spacing.xs,

                        color:
                            colors.textMuted,
                    }}
                >
                    Nodes
                </span>
            </div>
        </div>
    );
}