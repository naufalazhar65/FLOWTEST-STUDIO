import {
    colors,
    layout,
    radius,
    spacing,
    typography,
} from "../../themes";

import { useExecutionStore } from "../../features/execution/store/useExecutionStore";

function formatDuration(
    ms: number,
) {
    if (ms <= 0) {
        return "0.00 s";
    }

    return `${(ms / 1000).toFixed(2)} s`;
}

const STATUS_CONFIG = {
    idle: {
        label: "Ready",
        color: colors.textSecondary,
    },

    running: {
        label: "Running",
        color: colors.accent,
    },

    paused: {
        label: "Paused",
        color: colors.warning,
    },

    passed: {
        label: "Passed",
        color: colors.success,
    },

    failed: {
        label: "Failed",
        color: colors.danger,
    },

    stopped: {
        label: "Stopped",
        color: colors.textMuted,
    },
} as const;

export function StatusBar() {
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

    const passedNodes =
        useExecutionStore(
            (state) =>
                state.passedNodes,
        );

    const failedNodes =
        useExecutionStore(
            (state) =>
                state.failedNodes,
        );

    const duration = useExecutionStore(
        (state) => state.duration,
    );

    const current =
        STATUS_CONFIG[
        status as keyof typeof STATUS_CONFIG
        ];

    return (
        <footer
            style={{
                ...layout.between,

                height: 32,

                flexShrink: 0,

                padding:
                    `0 ${spacing.md}px`,

                background:
                    colors.panel,

                borderTop:
                    `1px solid ${colors.border}`,

                color:
                    colors.textSecondary,

                fontSize:
                    typography.tiny.fontSize,

                boxSizing:
                    "border-box",

                userSelect: "none",
            }}
        >
            <div
                style={{
                    ...layout.row,

                    gap: spacing.lg,

                    minWidth: 0,

                    overflow: "hidden",
                }}
            >
                <span
                    style={{
                        color:
                            colors.textMuted,

                        whiteSpace:
                            "nowrap",
                    }}
                >
                    FlowTest Studio v0.1
                </span>

                <StatusMetric
                    label="Progress"
                    value={`${executedNodes}/${totalNodes}`}
                />

                <StatusMetric
                    label="Passed"
                    value={String(
                        passedNodes,
                    )}
                    valueColor={
                        passedNodes > 0
                            ? colors.success
                            : undefined
                    }
                />

                <StatusMetric
                    label="Failed"
                    value={String(
                        failedNodes,
                    )}
                    valueColor={
                        failedNodes > 0
                            ? colors.danger
                            : undefined
                    }
                />

                <StatusMetric
                    label="Duration"
                    value={formatDuration(
                        duration,
                    )}
                />
            </div>

            <div
                style={{
                    ...layout.row,

                    gap: spacing.sm,

                    flexShrink: 0,

                    color:
                        current.color,

                    fontSize:
                        typography.caption
                            .fontSize,

                    fontWeight:
                        typography.caption
                            .fontWeight,
                }}
            >
                <span
                    style={{
                        width: 8,

                        height: 8,

                        flexShrink: 0,

                        borderRadius:
                            radius.full,

                        background:
                            current.color,

                        boxShadow:
                            `0 0 7px ${current.color}66`,
                    }}
                />

                <span>
                    {current.label}
                </span>

                {status !== "idle" && (
                    <span
                        style={{
                            color:
                                colors.textMuted,

                            fontVariantNumeric:
                                "tabular-nums",
                        }}
                    >
                        {progress}%
                    </span>
                )}
            </div>
        </footer>
    );
}

interface StatusMetricProps {
    label: string;

    value: string;

    valueColor?: string;
}

function StatusMetric({
    label,
    value,
    valueColor,
}: StatusMetricProps) {
    return (
        <span
            style={{
                display:
                    "inline-flex",

                alignItems:
                    "center",

                gap: spacing.xs,

                whiteSpace:
                    "nowrap",
            }}
        >
            <span
                style={{
                    color:
                        colors.textMuted,
                }}
            >
                {label}
            </span>

            <span
                style={{
                    color:
                        valueColor ??
                        colors.textSecondary,

                    fontVariantNumeric:
                        "tabular-nums",

                    fontWeight:
                        typography.caption
                            .fontWeight,
                }}
            >
                {value}
            </span>
        </span>
    );
}