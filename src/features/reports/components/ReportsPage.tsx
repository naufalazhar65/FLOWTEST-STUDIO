import {
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    CheckCircle2,
    Clock3,
    FileText,
    XCircle,
    Trash2,
} from "lucide-react";

import {
    useReportStore,
} from "../store/useReportStore";

import {
    ReportToolbar,
    type ReportFilter,
    type ReportSort,
} from "./ReportToolbar";

import {
    ReportDetail,
} from "./ReportDetail";

import {
    ReportAnalytics,
} from "./ReportAnalytics";

import {
    ReportComparison,
} from "./ReportComparison";

import {
    ConfirmDialog,
} from "../../../components/ui/ConfirmDialog";

export function ReportsPage() {
    const reports =
        useReportStore(
            (state) => state.reports,
        );

    const [
        selectedReportId,
        setSelectedReportId,
    ] = useState<
        string | null
    >(null);

    const [
        comparisonOpen,
        setComparisonOpen,
    ] = useState(false);

    const [
        deleteReportId,
        setDeleteReportId,
    ] = useState<string | null>(null);

    const [
        clearReportsOpen,
        setClearReportsOpen,
    ] = useState(false);

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        filter,
        setFilter,
    ] = useState<ReportFilter>(
        "all",
    );

    const [
        sort,
        setSort,
    ] = useState<ReportSort>(
        "newest",
    );

    const selectedReport =
        reports.find(
            (report) =>
                report.id ===
                selectedReportId,
        );

    const removeReport =
        useReportStore(
            (state) => state.removeReport,
        );

    const clearReports =
        useReportStore(
            (state) => state.clearReports,
        );

    const totalRuns =
        reports.length;

    const passedRuns =
        reports.filter(
            (report) =>
                report.status ===
                "passed",
        ).length;

    const failedRuns =
        reports.filter(
            (report) =>
                report.status ===
                "failed",
        ).length;

    const totalDuration =
        reports.reduce(
            (total, report) =>
                total +
                report.duration,
            0,
        );

    const averageDuration =
        totalRuns > 0
            ? totalDuration /
            totalRuns
            : 0;

    const filteredReports =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            const result =
                reports.filter(
                    (report) => {
                        if (
                            filter !==
                            "all" &&
                            report.status !==
                            filter
                        ) {
                            return false;
                        }

                        if (!query) {
                            return true;
                        }

                        const searchableText =
                            [
                                report.status,

                                report.id,

                                String(
                                    report.totalNodes,
                                ),

                                String(
                                    report.executedNodes,
                                ),

                                ...report.nodes.map(
                                    (
                                        node,
                                    ) =>
                                        `${node.nodeTitle} ${node.nodeType}`,
                                ),

                                ...report.logs.map(
                                    (log) =>
                                        `${log.message} ${log.nodeTitle ?? ""}`,
                                ),
                            ]
                                .join(" ")
                                .toLowerCase();

                        return searchableText.includes(
                            query,
                        );
                    },
                );

            return [
                ...result,
            ].sort(
                (a, b) => {
                    switch (sort) {
                        case "oldest":
                            return (
                                a.startedAt -
                                b.startedAt
                            );

                        case "duration-desc":
                            return (
                                b.duration -
                                a.duration
                            );

                        case "duration-asc":
                            return (
                                a.duration -
                                b.duration
                            );

                        case "newest":
                        default:
                            return (
                                b.startedAt -
                                a.startedAt
                            );
                    }
                },
            );
        }, [
            reports,
            search,
            filter,
            sort,
        ]);

    if (comparisonOpen) {
        return (
            <ReportComparison
                reports={reports}
                onBack={() =>
                    setComparisonOpen(
                        false,
                    )
                }
            />
        );
    }

    if (selectedReport) {
        return (
            <ReportDetail
                report={
                    selectedReport
                }
                onBack={() =>
                    setSelectedReportId(
                        null,
                    )
                }
            />
        );
    }

    return (
        <div
            style={{
                height: "100%",
                overflow: "auto",
                padding: 24,
                background: "#0D1117",
                color: "#E6EDF3",
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        marginBottom: 24,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 10,
                        }}
                    >
                        <FileText
                            size={22}
                            color="#58A6FF"
                        />

                        <h1
                            style={{
                                margin: 0,
                                fontSize: 22,
                                fontWeight: 700,
                            }}
                        >
                            Test Reports
                        </h1>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between",
                            gap: 16,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 16,
                                width: "100%",
                            }}
                        >
                            <p
                                style={{
                                    margin:
                                        "8px 0 0 32px",
                                    color: "#8B949E",
                                    fontSize: 13,
                                }}
                            >
                                Execution history and
                                test results.
                            </p>

                            <button
                                type="button"
                                disabled={
                                    reports.length === 0
                                }
                                onClick={() =>
                                    setClearReportsOpen(true)
                                }
                                style={{
                                    height: 34,
                                    padding: "0 12px",
                                    border:
                                        "1px solid #30363D",
                                    borderRadius: 7,
                                    background:
                                        reports.length === 0
                                            ? "#161B22"
                                            : "#21262D",
                                    color:
                                        reports.length === 0
                                            ? "#6E7681"
                                            : "#F85149",
                                    fontSize: 10,
                                    fontWeight: 600,
                                    cursor:
                                        reports.length === 0
                                            ? "not-allowed"
                                            : "pointer",
                                }}
                            >
                                Clear Reports
                            </button>
                        </div>

                        <button
                            type="button"
                            disabled={
                                reports.length < 2
                            }
                            onClick={() =>
                                setComparisonOpen(
                                    true,
                                )
                            }
                            style={{
                                height: 34,
                                padding:
                                    "0 12px",
                                border:
                                    "1px solid #30363D",
                                borderRadius: 7,
                                background:
                                    reports.length <
                                    2
                                        ? "#161B22"
                                        : "#21262D",
                                color:
                                    reports.length <
                                    2
                                        ? "#6E7681"
                                        : "#E6EDF3",
                                fontSize: 10,
                                fontWeight: 600,
                                cursor:
                                    reports.length <
                                    2
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            Compare Reports
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4, minmax(0, 1fr))",
                        gap: 12,
                        marginBottom: 24,
                    }}
                >
                    <StatCard
                        label="Total Runs"
                        value={
                            totalRuns
                        }
                        icon={
                            <FileText
                                size={18}
                            />
                        }
                    />

                    <StatCard
                        label="Passed"
                        value={
                            passedRuns
                        }
                        icon={
                            <CheckCircle2
                                size={18}
                            />
                        }
                    />

                    <StatCard
                        label="Failed"
                        value={
                            failedRuns
                        }
                        icon={
                            <XCircle
                                size={18}
                            />
                        }
                    />

                    <StatCard
                        label="Average Duration"
                        value={formatDuration(
                            averageDuration,
                        )}
                        icon={
                            <Clock3
                                size={18}
                            />
                        }
                    />
                </div>

                {/* Analytics */}
                <ReportAnalytics
                    reports={reports}
                />

                {/* Reports */}
                <div
                    style={{
                        border:
                            "1px solid #30363D",
                        borderRadius: 12,
                        background:
                            "#161B22",
                        overflow:
                            "hidden",
                    }}
                >
                    <div
                        style={{
                            padding:
                                "14px 16px",
                            borderBottom:
                                "1px solid #30363D",
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        Recent Executions
                    </div>

                    <ReportToolbar
                        search={search}
                        filter={filter}
                        sort={sort}
                        onSearchChange={
                            setSearch
                        }
                        onFilterChange={
                            setFilter
                        }
                        onSortChange={
                            setSort
                        }
                    />

                    {filteredReports.length ===
                        0 ? (
                        <EmptyReports
                            hasFilters={
                                search.trim()
                                    .length >
                                0 ||
                                filter !==
                                "all"
                            }
                        />
                    ) : (
                        <div>
                            {filteredReports.map(
                                (
                                    report,
                                ) => (
                                    <ReportRow
                                        key={
                                            report.id
                                        }
                                        report={
                                            report
                                        }
                                        onClick={() =>
                                            setSelectedReportId(
                                                report.id,
                                            )
                                        }
                                        onDelete={() =>
                                            setDeleteReportId(
                                                report.id,
                                            )
                                        }
                                    />
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={deleteReportId !== null}
                title="Delete Report"
                message="Are you sure you want to delete this report? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onCancel={() =>
                    setDeleteReportId(null)
                }
                onConfirm={() => {
                    if (deleteReportId) {
                        removeReport(deleteReportId);
                    }

                    setDeleteReportId(null);
                }}
            />

            <ConfirmDialog
                open={clearReportsOpen}
                title="Clear Reports"
                message="Are you sure you want to delete all saved reports? This action cannot be undone."
                confirmLabel="Clear All"
                cancelLabel="Cancel"
                onCancel={() =>
                    setClearReportsOpen(false)
                }
                onConfirm={() => {
                    clearReports();
                    setClearReportsOpen(false);
                    setSelectedReportId(null);
                }}
            />
        </div>
    );
}

interface StatCardProps {
    label: string;

    value: string | number;

    icon: ReactNode;
}

function StatCard({
    label,
    value,
    icon,
}: StatCardProps) {
    return (
        <div
            style={{
                padding: 16,
                border:
                    "1px solid #30363D",
                borderRadius: 12,
                background:
                    "#161B22",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems:
                        "center",
                    gap: 8,
                    color: "#8B949E",
                    fontSize: 12,
                }}
            >
                {icon}

                <span>
                    {label}
                </span>
            </div>

            <div
                style={{
                    marginTop: 10,
                    fontSize: 24,
                    fontWeight: 700,
                }}
            >
                {value}
            </div>
        </div>
    );
}

function ReportRow({
    report,
    onClick,
    onDelete,
}: {
    report: ReturnType<
        typeof useReportStore.getState
    >["reports"][number];

    onClick: () => void;

    onDelete: () => void;
}) {
    const passed =
        report.status ===
        "passed";

    const stopped =
        report.status ===
        "stopped";

    const statusColor =
        passed
            ? "#3FB950"
            : stopped
                ? "#D29922"
                : "#F85149";

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                borderBottom:
                    "1px solid #21262D",
            }}
        >
            <button
                type="button"
                onClick={onClick}
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "14px 16px",
                    border: "none",
                    background: "transparent",
                    color: "#E6EDF3",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background .15s ease",
                }}
                onMouseEnter={(event) => {
                    event.currentTarget.style.background =
                        "#1C2128";
                }}
                onMouseLeave={(event) => {
                    event.currentTarget.style.background =
                        "transparent";
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        minWidth: 0,
                    }}
                >
                    {passed ? (
                        <CheckCircle2
                            size={18}
                            color="#3FB950"
                        />
                    ) : stopped ? (
                        <Clock3
                            size={18}
                            color="#D29922"
                        />
                    ) : (
                        <XCircle
                            size={18}
                            color="#F85149"
                        />
                    )}

                    <div style={{ minWidth: 0 }}>
                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        >
                            Execution
                        </div>

                        <div
                            style={{
                                marginTop: 4,
                                color: "#8B949E",
                                fontSize: 11,
                            }}
                        >
                            {report.executedNodes}
                            /
                            {report.totalNodes}{" "}
                            nodes
                            {" · "}
                            {formatDate(
                                report.startedAt,
                            )}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        flexShrink: 0,
                    }}
                >
                    <StatusBadge
                        status={report.status}
                        color={statusColor}
                    />

                    <span
                        style={{
                            color: "#8B949E",
                            fontSize: 12,
                            minWidth: 60,
                            textAlign: "right",
                        }}
                    >
                        {formatDuration(
                            report.duration,
                        )}
                    </span>
                </div>
            </button>

            <button
                type="button"
                aria-label="Delete report"
                title="Delete report"
                onClick={onDelete}
                style={{
                    width: 34,
                    height: 34,
                    marginRight: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid transparent",
                    borderRadius: 7,
                    background: "transparent",
                    color: "#6E7681",
                    cursor: "pointer",
                    flexShrink: 0,
                }}
                onMouseEnter={(event) => {
                    event.currentTarget.style.color =
                        "#F85149";
                    event.currentTarget.style.background =
                        "#F8514915";
                    event.currentTarget.style.borderColor =
                        "#F8514933";
                }}
                onMouseLeave={(event) => {
                    event.currentTarget.style.color =
                        "#6E7681";
                    event.currentTarget.style.background =
                        "transparent";
                    event.currentTarget.style.borderColor =
                        "transparent";
                }}
            >
                <Trash2 size={15} />
            </button>
        </div>
    );
}

function StatusBadge({
    status,
    color,
}: {
    status:
    | "passed"
    | "failed"
    | "stopped";

    color: string;
}) {
    return (
        <span
            style={{
                padding:
                    "4px 8px",
                borderRadius: 999,
                background: `${color}22`,
                border: `1px solid ${color}55`,
                color,
                fontSize: 10,
                fontWeight: 700,
                textTransform:
                    "uppercase",
            }}
        >
            {status}
        </span>
    );
}

function EmptyReports({
    hasFilters,
}: {
    hasFilters: boolean;
}) {
    return (
        <div
            style={{
                padding: 48,
                textAlign: "center",
                color: "#8B949E",
            }}
        >
            <FileText
                size={32}
                style={{
                    marginBottom: 12,
                    opacity: 0.5,
                }}
            />

            <div
                style={{
                    color: "#E6EDF3",
                    fontSize: 14,
                    fontWeight: 600,
                }}
            >
                {hasFilters
                    ? "No matching reports"
                    : "No reports yet"}
            </div>

            <div
                style={{
                    marginTop: 6,
                    fontSize: 12,
                }}
            >
                {hasFilters
                    ? "Try changing your search or filter."
                    : "Run a flow to generate your first test report."}
            </div>
        </div>
    );
}

function formatDate(
    timestamp: number,
): string {
    return new Date(
        timestamp,
    ).toLocaleString(
        [],
        {
            dateStyle: "short",
            timeStyle: "short",
        },
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