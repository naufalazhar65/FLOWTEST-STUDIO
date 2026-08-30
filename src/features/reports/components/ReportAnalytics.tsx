import {
    BarChart3,
    CheckCircle2,
    Clock3,
    EyeOff,
    TrendingUp,
    Wrench,
    XCircle,
} from "lucide-react";

import {
    summarizeHealingMetrics,
    useHealingMetricsStore,
} from "../../execution/store/useHealingMetricsStore";

import type { TestReport } from "../types/TestReport";

interface ReportAnalyticsProps {
    reports: TestReport[];
}

export function ReportAnalytics({
    reports,
}: ReportAnalyticsProps) {
    const totalRuns = reports.length;

    const passedRuns = reports.filter(
        (report) =>
            report.status === "passed",
    ).length;

    const failedRuns = reports.filter(
        (report) =>
            report.status === "failed",
    ).length;

    const stoppedRuns = reports.filter(
        (report) =>
            report.status === "stopped",
    ).length;

    const totalDuration = reports.reduce(
        (total, report) =>
            total + report.duration,
        0,
    );

    const averageDuration =
        totalRuns > 0
            ? totalDuration / totalRuns
            : 0;

    const passRate =
        totalRuns > 0
            ? (passedRuns / totalRuns) *
              100
            : 0;

    const failureRate =
        totalRuns > 0
            ? (failedRuns / totalRuns) *
              100
            : 0;

    const trendReports = [
        ...reports,
    ].sort(
        (a, b) =>
            a.startedAt -
            b.startedAt,
    );

    const failedNodes = getFailedNodes(
        reports,
    );

    const failureReasons =
        getFailureReasons(reports);

    const maxFailedNodes =
        failedNodes.length > 0
            ? failedNodes[0].count
            : 1;

    const maxFailureReason =
        failureReasons.length > 0
            ? failureReasons[0].count
            : 1;

    const healingProjectId =
        reports.length > 0
            ? reports[0].projectId
            : undefined;

    const healingMetrics =
        summarizeHealingMetrics(
            healingProjectId
                ? useHealingMetricsStore
                      .getState()
                      .events.filter(
                          (
                              event,
                          ) =>
                              event.projectId ===
                              healingProjectId,
                      )
                : [],
        );

    if (totalRuns === 0) {
        return null;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 24,
            }}
        >
            {/* Analytics Summary */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(4, minmax(0, 1fr))",
                    gap: 12,
                }}
            >
                <AnalyticsCard
                    label="Pass Rate"
                    value={`${passRate.toFixed(1)}%`}
                    icon={
                        <TrendingUp
                            size={17}
                        />
                    }
                    accent="#3FB950"
                    subtitle={`${passedRuns} of ${totalRuns} runs passed`}
                />

                <AnalyticsCard
                    label="Failure Rate"
                    value={`${failureRate.toFixed(1)}%`}
                    icon={
                        <XCircle size={17} />
                    }
                    accent="#F85149"
                    subtitle={`${failedRuns} failed runs`}
                />

                <AnalyticsCard
                    label="Average Duration"
                    value={formatDuration(
                        averageDuration,
                    )}
                    icon={
                        <Clock3 size={17} />
                    }
                    accent="#58A6FF"
                    subtitle={`${totalRuns} total executions`}
                />

                <AnalyticsCard
                    label="Stopped Runs"
                    value={stoppedRuns}
                    icon={
                        <BarChart3
                            size={17}
                        />
                    }
                    accent="#D29922"
                    subtitle={
                        stoppedRuns === 0
                            ? "No stopped executions"
                            : "Execution stopped manually"
                    }
                />
            </div>

            {/* Trend + Pass Distribution */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "minmax(0, 2fr) minmax(280px, 1fr)",
                    gap: 12,
                }}
            >
                <AnalyticsPanel title="Execution Trend">
                    <div
                        style={{
                            minWidth: 0,
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                maxWidth: "100%",
                                overflowX: "auto",
                                overflowY: "hidden",
                                padding: "0 0 4px",
                                overscrollBehaviorX:
                                    "contain",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems:
                                        "flex-end",
                                    gap: 10,
                                    minWidth:
                                        Math.max(
                                            360,
                                            trendReports.length *
                                                52,
                                        ),
                                    width: "max-content",
                                    height: 150,
                                    padding:
                                        "12px 4px 4px",
                                }}
                            >
                                {trendReports.map(
                                    (
                                        report,
                                        index,
                                    ) => {
                                        const maxDuration =
                                            Math.max(
                                                ...trendReports.map(
                                                    (
                                                        item,
                                                    ) =>
                                                        item.duration,
                                                ),
                                            );

                                        const barHeight =
                                            Math.max(
                                                22,
                                                Math.min(
                                                    108,
                                                    maxDuration >
                                                        0
                                                        ? (report.duration /
                                                              maxDuration) *
                                                              108
                                                        : 22,
                                                ),
                                            );

                                        const color =
                                            report.status ===
                                            "passed"
                                                ? "#3FB950"
                                                : report.status ===
                                                    "failed"
                                                  ? "#F85149"
                                                  : "#D29922";

                                        return (
                                            <div
                                                key={
                                                    report.id
                                                }
                                                style={{
                                                    flex:
                                                        "0 0 42px",
                                                    width: 42,
                                                    height:
                                                        "100%",
                                                    display:
                                                        "flex",
                                                    flexDirection:
                                                        "column",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "flex-end",
                                                    gap: 6,
                                                }}
                                            >
                                                <div
                                                    title={`${report.status.toUpperCase()} · ${formatDuration(report.duration)}`}
                                                    style={{
                                                        width:
                                                            "100%",
                                                        height:
                                                            barHeight,
                                                        borderRadius:
                                                            "6px 6px 3px 3px",
                                                        background:
                                                            color,
                                                        opacity:
                                                            0.85,
                                                        transition:
                                                            "height .2s ease",
                                                    }}
                                                />

                                                <span
                                                    style={{
                                                        color:
                                                            "#6E7681",
                                                        fontSize: 9,
                                                    }}
                                                >
                                                    {index +
                                                        1}
                                                </span>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 14,
                            marginTop: 4,
                            color: "#8B949E",
                            fontSize: 10,
                        }}
                    >
                        <Legend
                            color="#3FB950"
                            label="Passed"
                        />

                        <Legend
                            color="#F85149"
                            label="Failed"
                        />

                        <Legend
                            color="#D29922"
                            label="Stopped"
                        />

                        <span
                            style={{
                                marginLeft:
                                    "auto",
                                color:
                                    "#6E7681",
                            }}
                        >
                            {trendReports.length ===
                            1
                                ? "1 run"
                                : `${trendReports.length} runs`}
                        </span>
                    </div>
                </AnalyticsPanel>

                <AnalyticsPanel title="Run Distribution">
                    <div
                        style={{
                            display: "flex",
                            flexDirection:
                                "column",
                            gap: 14,
                            paddingTop: 8,
                        }}
                    >
                        <DistributionRow
                            label="Passed"
                            value={
                                passedRuns
                            }
                            total={
                                totalRuns
                            }
                            color="#3FB950"
                        />

                        <DistributionRow
                            label="Failed"
                            value={
                                failedRuns
                            }
                            total={
                                totalRuns
                            }
                            color="#F85149"
                        />

                        <DistributionRow
                            label="Stopped"
                            value={
                                stoppedRuns
                            }
                            total={
                                totalRuns
                            }
                            color="#D29922"
                        />
                    </div>
                </AnalyticsPanel>
            </div>

            {/* Failure Analysis */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                }}
            >
                <AnalyticsPanel title="Most Failed Nodes">
                    {failedNodes.length ===
                    0 ? (
                        <AnalyticsEmpty
                            icon={
                                <CheckCircle2
                                    size={18}
                                />
                            }
                            message="No failed nodes yet."
                        />
                    ) : (
                        <div
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap: 12,
                            }}
                        >
                            {failedNodes
                                .slice(
                                    0,
                                    5,
                                )
                                .map(
                                    (
                                        item,
                                    ) => (
                                        <ProgressRow
                                            key={
                                                item.key
                                            }
                                            label={
                                                item.title
                                            }
                                            meta={`${item.nodeType} · ${item.count} failure${item.count === 1 ? "" : "s"}`}
                                            value={
                                                item.count
                                            }
                                            max={
                                                maxFailedNodes
                                            }
                                            color="#F85149"
                                        />
                                    ),
                                )}
                        </div>
                    )}
                </AnalyticsPanel>

                <AnalyticsPanel title="Failure Analysis">
                    {failureReasons.length ===
                    0 ? (
                        <AnalyticsEmpty
                            icon={
                                <CheckCircle2
                                    size={18}
                                />
                            }
                            message="No failure reasons recorded."
                        />
                    ) : (
                        <div
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap: 12,
                            }}
                        >
                            {failureReasons
                                .slice(
                                    0,
                                    5,
                                )
                                .map(
                                    (
                                        item,
                                    ) => (
                                        <ProgressRow
                                            key={
                                                item.reason
                                            }
                                            label={
                                                item.reason
                                            }
                                            value={
                                                item.count
                                            }
                                            max={
                                                maxFailureReason
                                            }
                                            color="#D29922"
                                        />
                                    ),
                                )}
                        </div>
                    )}
                </AnalyticsPanel>
            </div>

            <AnalyticsPanel title="Self-Healing">
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(3, minmax(0, 1fr))",
                        gap: 12,
                    }}
                >
                    <HealingMetricCard
                        icon={
                            <Wrench
                                size={16}
                            />
                        }
                        label="Healed"
                        value={
                            healingMetrics.healed
                        }
                        accent="#8957E5"
                        subtitle="Repair applied and rerun passed"
                    />

                    <HealingMetricCard
                        icon={
                            <XCircle
                                size={16}
                            />
                        }
                        label="Healing Failed"
                        value={
                            healingMetrics.healingFailed
                        }
                        accent="#F85149"
                        subtitle="Repair or rerun still failed"
                    />

                    <HealingMetricCard
                        icon={
                            <EyeOff
                                size={16}
                            />
                        }
                        label="Rejected"
                        value={
                            healingMetrics.rejected
                        }
                        accent="#D29922"
                        subtitle="Fix surfaced for review, not auto-applied"
                    />
                </div>

                {healingMetrics.total > 0 && (
                    <div
                        style={{
                            marginTop: 12,
                            paddingTop: 10,
                            borderTop:
                                "1px solid #21262D",
                            color: "#8B949E",
                            fontSize: 10,
                            lineHeight: 1.5,
                        }}
                    >
                        Reruns:{" "}
                        {
                            healingMetrics.rerunAttempted
                        }{" "}
                        attempted ·{" "}
                        {
                            healingMetrics.rerunSucceeded
                        }{" "}
                        succeeded ·{" "}
                        {(
                            (healingMetrics.rerunSucceeded /
                                Math.max(
                                    healingMetrics.rerunAttempted,
                                    1,
                                )) *
                            100
                        ).toFixed(
                            0,
                        )}
                        % rerun success rate
                    </div>
                )}
            </AnalyticsPanel>
        </div>
    );
}

function AnalyticsCard({
    label,
    value,
    icon,
    accent,
    subtitle,
}: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    accent: string;
    subtitle: string;
}) {
    return (
        <div
            style={{
                minWidth: 0,
                padding: 14,
                border:
                    "1px solid #30363D",
                borderRadius: 12,
                background: "#161B22",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    color: "#8B949E",
                    fontSize: 11,
                }}
            >
                <span
                    style={{
                        color: accent,
                    }}
                >
                    {icon}
                </span>

                <span>
                    {label}
                </span>
            </div>

            <div
                style={{
                    marginTop: 8,
                    color: "#E6EDF3",
                    fontSize: 22,
                    fontWeight: 700,
                }}
            >
                {value}
            </div>

            <div
                style={{
                    marginTop: 4,
                    color: "#6E7681",
                    fontSize: 9,
                }}
            >
                {subtitle}
            </div>
        </div>
    );
}

function HealingMetricCard({
    icon,
    label,
    value,
    accent,
    subtitle,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    accent: string;
    subtitle: string;
}) {
    return (
        <div
            style={{
                minWidth: 0,
                padding: 12,
                border:
                    "1px solid #30363D",
                borderRadius: 10,
                background: "#0D1117",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    color: "#8B949E",
                    fontSize: 10,
                }}
            >
                <span
                    style={{
                        color: accent,
                    }}
                >
                    {icon}
                </span>

                <span>
                    {label}
                </span>
            </div>

            <div
                style={{
                    marginTop: 8,
                    color: "#E6EDF3",
                    fontSize: 18,
                    fontWeight: 700,
                }}
            >
                {value}
            </div>

            <div
                style={{
                    marginTop: 2,
                    color: "#6E7681",
                    fontSize: 9,
                }}
            >
                {subtitle}
            </div>
        </div>
    );
}

function AnalyticsPanel({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                minWidth: 0,
                padding: 14,
                border:
                    "1px solid #30363D",
                borderRadius: 12,
                background: "#161B22",
            }}
        >
            <div
                style={{
                    marginBottom: 10,
                    color: "#E6EDF3",
                    fontSize: 12,
                    fontWeight: 600,
                }}
            >
                {title}
            </div>

            {children}
        </div>
    );
}

function DistributionRow({
    label,
    value,
    total,
    color,
}: {
    label: string;
    value: number;
    total: number;
    color: string;
}) {
    const percentage =
        total > 0
            ? (value / total) * 100
            : 0;

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    gap: 8,
                    marginBottom: 6,
                    color: "#8B949E",
                    fontSize: 10,
                }}
            >
                <span>
                    {label}
                </span>

                <span>
                    {value} ·{" "}
                    {percentage.toFixed(
                        1,
                    )}
                    %
                </span>
            </div>

            <div
                style={{
                    height: 6,
                    overflow: "hidden",
                    borderRadius: 999,
                    background:
                        "#21262D",
                }}
            >
                <div
                    style={{
                        width: `${percentage}%`,
                        height: "100%",
                        borderRadius:
                            999,
                        background: color,
                    }}
                />
            </div>
        </div>
    );
}

function ProgressRow({
    label,
    meta,
    value,
    max,
    color,
}: {
    label: string;
    meta?: string;
    value: number;
    max: number;
    color: string;
}) {
    const percentage =
        max > 0
            ? (value / max) * 100
            : 0;

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems:
                        "baseline",
                    justifyContent:
                        "space-between",
                    gap: 12,
                    marginBottom: 5,
                }}
            >
                <div
                    style={{
                        minWidth: 0,
                        color:
                            "#C9D1D9",
                        fontSize: 10,
                        fontWeight: 600,
                        overflow:
                            "hidden",
                        textOverflow:
                            "ellipsis",
                        whiteSpace:
                            "nowrap",
                    }}
                    title={label}
                >
                    {label}
                </div>

                <span
                    style={{
                        flexShrink: 0,
                        color: color,
                        fontSize: 10,
                        fontWeight: 700,
                    }}
                >
                    {value}
                </span>
            </div>

            {meta && (
                <div
                    style={{
                        marginBottom: 5,
                        color:
                            "#6E7681",
                        fontSize: 9,
                    }}
                >
                    {meta}
                </div>
            )}

            <div
                style={{
                    height: 5,
                    overflow: "hidden",
                    borderRadius: 999,
                    background:
                        "#21262D",
                }}
            >
                <div
                    style={{
                        width: `${percentage}%`,
                        height: "100%",
                        borderRadius:
                            999,
                        background: color,
                    }}
                />
            </div>
        </div>
    );
}

function Legend({
    color,
    label,
}: {
    color: string;
    label: string;
}) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems:
                    "center",
                gap: 5,
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius:
                        "50%",
                    background: color,
                }}
            />

            {label}
        </span>
    );
}

function AnalyticsEmpty({
    icon,
    message,
}: {
    icon: React.ReactNode;
    message: string;
}) {
    return (
        <div
            style={{
                minHeight: 96,
                display: "flex",
                alignItems:
                    "center",
                justifyContent:
                    "center",
                gap: 8,
                color: "#6E7681",
                fontSize: 10,
            }}
        >
            {icon}
            {message}
        </div>
    );
}

function getFailedNodes(
    reports: TestReport[],
) {
    const counts = new Map<
        string,
        {
            key: string;
            title: string;
            nodeType: string;
            count: number;
        }
    >();

    for (const report of reports) {
        for (const node of report.nodes) {
            if (node.status !== "failed") {
                continue;
            }

            const key =
                `${node.nodeType}:${node.nodeTitle}`;

            const current =
                counts.get(key);

            if (current) {
                current.count += 1;
            } else {
                counts.set(key, {
                    key,
                    title:
                        node.nodeTitle,
                    nodeType:
                        node.nodeType,
                    count: 1,
                });
            }
        }
    }

    return [
        ...counts.values(),
    ].sort(
        (a, b) =>
            b.count - a.count,
    );
}

function getFailureReasons(
    reports: TestReport[],
) {
    const counts = new Map<
        string,
        number
    >();

    for (const report of reports) {
        for (const log of report.logs) {
            if (
                log.level !== "error"
            ) {
                continue;
            }

            const reason =
                typeof log.details
                    ?.reason === "string"
                    ? log.details.reason
                    : log.message;

            if (!reason) {
                continue;
            }

            counts.set(
                reason,
                (counts.get(reason) ??
                    0) + 1,
            );
        }
    }

    return [
        ...counts.entries(),
    ]
        .map(
            ([reason, count]) => ({
                reason,
                count,
            }),
        )
        .sort(
            (a, b) =>
                b.count - a.count,
        );
}

function formatDuration(
    duration: number,
): string {
    if (duration < 1000) {
        return `${Math.round(
            duration,
        )}ms`;
    }

    return `${(
        duration / 1000
    ).toFixed(2)}s`;
}