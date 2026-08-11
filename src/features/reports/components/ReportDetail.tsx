import { useState } from "react";

import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    FileText,
    Info,
    XCircle,
    AlertTriangle,
    Circle,
    LoaderCircle,
    Download,
    ChevronDown,
    ChevronRight,

} from "lucide-react";

import {
    exportReportJson,
} from "../services/exportReportJson";
import {
    exportReportHtml,
} from "../services/exportReportHtml";
import {
    exportReportPdf,
} from "../services/exportReportPdf";

import type {
    ReportNode,
    TestReport,
} from "../types/TestReport";

interface ReportDetailProps {
    report: TestReport;
    onBack: () => void;
}

export function ReportDetail({
    report,
    onBack,
}: ReportDetailProps) {

    const [
        expandedNodes,
        setExpandedNodes,
    ] = useState<Set<string>>(
        new Set(),
    );

    const toggleNode = (
        nodeId: string,
    ) => {
        setExpandedNodes((current) => {
            const next =
                new Set(current);

            if (next.has(nodeId)) {
                next.delete(nodeId);
            } else {
                next.add(nodeId);
            }

            return next;
        });
    };
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
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        marginBottom: 24,
                    }}
                >
                    {/* Back */}
                    <button
                        type="button"
                        onClick={onBack}
                        style={{
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #30363D",
                            borderRadius: 8,
                            background: "#161B22",
                            color: "#8B949E",
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(event) => {
                            event.currentTarget.style.color =
                                "#E6EDF3";

                            event.currentTarget.style.borderColor =
                                "#58A6FF";
                        }}
                        onMouseLeave={(event) => {
                            event.currentTarget.style.color =
                                "#8B949E";

                            event.currentTarget.style.borderColor =
                                "#30363D";
                        }}
                    >
                        <ArrowLeft size={17} />
                    </button>

                    {/* Title */}
                    <div
                        style={{
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 9,
                            }}
                        >
                            <FileText
                                size={20}
                                color="#58A6FF"
                            />

                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: 22,
                                    fontWeight: 700,
                                }}
                            >
                                Execution Details
                            </h1>
                        </div>

                        <p
                            style={{
                                margin:
                                    "6px 0 0 29px",
                                color: "#8B949E",
                                fontSize: 12,
                            }}
                        >
                            Detailed execution result
                            and logs.
                        </p>
                    </div>

                    {/* Export */}
                    <button
                        type="button"
                        onClick={() =>
                            exportReportJson(report)
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            height: 34,
                            padding: "0 11px",
                            border:
                                "1px solid #30363D",
                            borderRadius: 7,
                            background: "#161B22",
                            color: "#C9D1D9",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(event) => {
                            event.currentTarget.style.borderColor =
                                "#58A6FF";

                            event.currentTarget.style.color =
                                "#58A6FF";

                            event.currentTarget.style.background =
                                "#1C2128";
                        }}
                        onMouseLeave={(event) => {
                            event.currentTarget.style.borderColor =
                                "#30363D";

                            event.currentTarget.style.color =
                                "#C9D1D9";

                            event.currentTarget.style.background =
                                "#161B22";
                        }}
                    >
                        <Download size={14} />

                        Export JSON
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            exportReportHtml(report)
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            height: 34,
                            padding: "0 11px",
                            border:
                                "1px solid #30363D",
                            borderRadius: 7,
                            background: "#161B22",
                            color: "#C9D1D9",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(event) => {
                            event.currentTarget.style.borderColor =
                                "#58A6FF";

                            event.currentTarget.style.color =
                                "#58A6FF";

                            event.currentTarget.style.background =
                                "#1C2128";
                        }}
                        onMouseLeave={(event) => {
                            event.currentTarget.style.borderColor =
                                "#30363D";

                            event.currentTarget.style.color =
                                "#C9D1D9";

                            event.currentTarget.style.background =
                                "#161B22";
                        }}
                    >
                        <FileText size={14} />

                        Export HTML
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            exportReportPdf(report)
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            height: 34,
                            padding: "0 11px",
                            border:
                                "1px solid #30363D",
                            borderRadius: 7,
                            background: "#161B22",
                            color: "#C9D1D9",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(event) => {
                            event.currentTarget.style.borderColor =
                                "#58A6FF";

                            event.currentTarget.style.color =
                                "#58A6FF";

                            event.currentTarget.style.background =
                                "#1C2128";
                        }}
                        onMouseLeave={(event) => {
                            event.currentTarget.style.borderColor =
                                "#30363D";

                            event.currentTarget.style.color =
                                "#C9D1D9";

                            event.currentTarget.style.background =
                                "#161B22";
                        }}
                    >
                        <FileText size={14} />

                        Export PDF
                    </button>
                </div>

                {/* Status */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        gap: 16,
                        padding: 18,
                        marginBottom: 16,
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
                            gap: 12,
                        }}
                    >
                        {report.status ===
                            "passed" ? (
                            <CheckCircle2
                                size={24}
                                color="#3FB950"
                            />
                        ) : report.status ===
                            "failed" ? (
                            <XCircle
                                size={24}
                                color="#F85149"
                            />
                        ) : (
                            <AlertTriangle
                                size={24}
                                color="#D29922"
                            />
                        )}

                        <div>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    textTransform:
                                        "uppercase",
                                }}
                            >
                                {report.status}
                            </div>

                            <div
                                style={{
                                    marginTop: 4,
                                    color: "#8B949E",
                                    fontSize: 12,
                                }}
                            >
                                {report.executedNodes}
                                {" / "}
                                {report.totalNodes}
                                {" nodes executed"}
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            color: "#8B949E",
                            fontSize: 13,
                        }}
                    >
                        <Clock3 size={15} />

                        {formatDuration(
                            report.duration,
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div
                    style={{
                        marginBottom: 16,
                        border:
                            "1px solid #30363D",
                        borderRadius: 12,
                        background: "#161B22",
                        overflow: "hidden",
                    }}
                >
                    <SectionHeader
                        title="Execution Summary"
                        icon={
                            <Info size={16} />
                        }
                    />

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(4, minmax(0, 1fr))",
                        }}
                    >
                        <SummaryItem
                            label="Started"
                            value={formatDate(
                                report.startedAt,
                            )}
                        />

                        <SummaryItem
                            label="Finished"
                            value={formatDate(
                                report.finishedAt,
                            )}
                        />

                        <SummaryItem
                            label="Duration"
                            value={formatDuration(
                                report.duration,
                            )}
                        />

                        <SummaryItem
                            label="Nodes"
                            value={`${report.executedNodes}/${report.totalNodes}`}
                        />
                    </div>
                </div>

                {/* Node Statistics */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(3, minmax(0, 1fr))",
                        gap: 12,
                        marginBottom: 16,
                    }}
                >
                    <MetricCard
                        label="Executed"
                        value={
                            report.executedNodes
                        }
                    />

                    <MetricCard
                        label="Passed"
                        value={
                            report.passedNodes
                        }
                        accent="#3FB950"
                    />

                    <MetricCard
                        label="Failed"
                        value={
                            report.failedNodes
                        }
                        accent="#F85149"
                    />
                </div>

                {/* Node Execution */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                    }}
                >
                    {report.nodes.length === 0 ? (
                        <div
                            style={{
                                padding: 24,
                                textAlign: "center",
                                color: "#8B949E",
                                fontSize: 12,
                            }}
                        >
                            No node execution data
                            available.
                        </div>


                    ) : (
                        report.nodes.map((node) => {
                            const expanded =
                                expandedNodes.has(
                                    node.nodeId,
                                );

                            const passed =
                                node.status ===
                                "passed";

                            const failed =
                                node.status ===
                                "failed";

                            const statusColor =
                                passed
                                    ? "#3FB950"
                                    : failed
                                        ? "#F85149"
                                        : "#D29922";

                            return (
                                <div
                                    key={node.nodeId}
                                    style={{
                                        border:
                                            "1px solid #30363D",
                                        borderRadius: 9,
                                        overflow:
                                            "hidden",
                                        background:
                                            "#0D1117",
                                    }}
                                >
                                    {/* Node Header */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleNode(
                                                node.nodeId,
                                            )
                                        }
                                        style={{
                                            width: "100%",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: 10,
                                            padding:
                                                "11px 12px",
                                            border: "none",
                                            background:
                                                expanded
                                                    ? "#161B22"
                                                    : "transparent",
                                            color:
                                                "#E6EDF3",
                                            cursor:
                                                "pointer",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        {expanded ? (
                                            <ChevronDown
                                                size={15}
                                                color="#8B949E"
                                            />
                                        ) : (
                                            <ChevronRight
                                                size={15}
                                                color="#8B949E"
                                            />
                                        )}

                                        <div
                                            style={{
                                                width: 8,
                                                height: 8,
                                                flexShrink: 0,
                                                borderRadius:
                                                    "50%",
                                                background:
                                                    statusColor,
                                                boxShadow:
                                                    `0 0 8px ${statusColor}55`,
                                            }}
                                        />

                                        <div
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight:
                                                        600,
                                                    overflow:
                                                        "hidden",
                                                    textOverflow:
                                                        "ellipsis",
                                                    whiteSpace:
                                                        "nowrap",
                                                }}
                                            >
                                                {
                                                    node.nodeTitle
                                                }
                                            </div>

                                            <div
                                                style={{
                                                    marginTop: 3,
                                                    color:
                                                        "#6E7681",
                                                    fontSize: 10,
                                                }}
                                            >
                                                {
                                                    node.nodeType
                                                }
                                            </div>
                                        </div>


                                        <span
                                            style={{
                                                padding:
                                                    "3px 7px",
                                                borderRadius:
                                                    999,
                                                background:
                                                    `${statusColor}18`,
                                                border:
                                                    `1px solid ${statusColor}44`,
                                                color:
                                                    statusColor,
                                                fontSize: 9,
                                                fontWeight:
                                                    700,
                                                textTransform:
                                                    "uppercase",
                                            }}
                                        >
                                            {
                                                node.status
                                            }
                                        </span>

                                        <span
                                            style={{
                                                minWidth: 55,
                                                color:
                                                    "#8B949E",
                                                fontSize: 10,
                                                textAlign:
                                                    "right",
                                            }}
                                        >
                                            {formatDuration(
                                                node.duration,
                                            )}
                                        </span>
                                    </button>

                                    {/* Node Details */}
                                    {expanded && (
                                        <div
                                            style={{
                                                padding:
                                                    "0 12px 12px 37px",
                                                background:
                                                    "#161B22",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: 1,
                                                    marginBottom:
                                                        12,
                                                    background:
                                                        "#30363D",
                                                }}
                                            />

                                            <div
                                                style={{
                                                    display:
                                                        "grid",
                                                    gridTemplateColumns:
                                                        "repeat(2, minmax(0, 1fr))",
                                                    gap: 8,
                                                }}
                                            >
                                                <NodeDetailItem
                                                    label="Node ID"
                                                    value={
                                                        node.nodeId
                                                    }
                                                />

                                                <NodeDetailItem
                                                    label="Type"
                                                    value={
                                                        node.nodeType
                                                    }
                                                />

                                                <NodeDetailItem
                                                    label="Started"
                                                    value={formatDate(
                                                        node.startedAt,
                                                    )}
                                                />

                                                <NodeDetailItem
                                                    label="Finished"
                                                    value={formatDate(
                                                        node.finishedAt,
                                                    )}
                                                />

                                                <NodeDetailItem
                                                    label="Duration"
                                                    value={formatDuration(
                                                        node.duration,
                                                    )}
                                                />

                                                <NodeDetailItem
                                                    label="Status"
                                                    value={
                                                        node.status.toUpperCase()
                                                    }
                                                    valueColor={
                                                        statusColor
                                                    }
                                                />
                                            </div>

                                            {node.error && (
                                                <div
                                                    style={{
                                                        marginTop:
                                                            10,
                                                        padding:
                                                            "9px 10px",
                                                        border:
                                                            "1px solid #5A1E24",
                                                        borderRadius:
                                                            7,
                                                        background:
                                                            "#2D1115",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            marginBottom:
                                                                4,
                                                            color:
                                                                "#F85149",
                                                            fontSize:
                                                                10,
                                                            fontWeight:
                                                                700,
                                                        }}
                                                    >
                                                        ERROR
                                                    </div>

                                                    <div
                                                        style={{
                                                            color:
                                                                "#F85149",
                                                            fontSize:
                                                                11,
                                                            lineHeight:
                                                                1.5,
                                                        }}
                                                    >
                                                        {
                                                            node.error
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                            <AssertionDetails
                                                report={report}
                                                node={node}
                                            />
                                        </div>
                                    )}
                                </div>


                            );
                        })
                    )}
                    {/* Execution Logs */}
                    <div
                        style={{
                            marginTop: 16,
                            border: "1px solid #30363D",
                            borderRadius: 12,
                            background: "#161B22",
                            overflow: "hidden",
                        }}
                    >
                        <SectionHeader
                            title="Execution Logs"
                            icon={<FileText size={16} />}
                        />

                        {report.logs.length === 0 ? (
                            <EmptyLogs />
                        ) : (
                            <div>
                                {report.logs.map((log) => (
                                    <LogRow
                                        key={log.id}
                                        log={log}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function NodeDetailItem({
    label,
    value,
    valueColor,
}: {
    label: string;
    value: string;
    valueColor?: string;
}) {
    return (
        <div
            style={{
                padding:
                    "8px 10px",
                border:
                    "1px solid #30363D",
                borderRadius: 7,
                background:
                    "#0D1117",
            }}
        >
            <div
                style={{
                    marginBottom: 3,
                    color: "#6E7681",
                    fontSize: 9,
                    fontWeight: 600,
                    textTransform:
                        "uppercase",
                    letterSpacing:
                        "0.04em",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    color:
                        valueColor ??
                        "#C9D1D9",
                    fontSize: 11,
                    fontWeight: 500,
                    wordBreak:
                        "break-word",
                }}
            >
                {value}
            </div>
        </div>
    );
}

function SectionHeader({
    title,
    icon,
}: {
    title: string;
    icon: React.ReactNode;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding:
                    "13px 16px",
                borderBottom:
                    "1px solid #30363D",
                fontSize: 14,
                fontWeight: 600,
                color: "#E6EDF3",
            }}
        >
            {icon}
            {title}
        </div>
    );
}

function SummaryItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div
            style={{
                padding: 16,
                borderRight:
                    "1px solid #21262D",
            }}
        >
            <div
                style={{
                    color: "#8B949E",
                    fontSize: 11,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    marginTop: 7,
                    color: "#E6EDF3",
                    fontSize: 12,
                    fontWeight: 600,
                }}
            >
                {value}
            </div>
        </div>
    );
}

function MetricCard({
    label,
    value,
    accent = "#58A6FF",
}: {
    label: string;
    value: number;
    accent?: string;
}) {
    return (
        <div
            style={{
                padding: 16,
                border:
                    "1px solid #30363D",
                borderRadius: 12,
                background: "#161B22",
            }}
        >
            <div
                style={{
                    color: "#8B949E",
                    fontSize: 11,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    marginTop: 7,
                    color: accent,
                    fontSize: 22,
                    fontWeight: 700,
                }}
            >
                {value}
            </div>
        </div>
    );
}

function NodeRow({
    node,
    index,
}: {
    node: ReportNode;
    index: number;
}) {
    const statusColor =
        getNodeStatusColor(node.status);

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "42px minmax(0, 1fr) 90px 80px",
                alignItems: "center",
                gap: 12,
                padding:
                    "13px 16px",
                borderBottom:
                    "1px solid #21262D",
            }}
        >
            {/* Index */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: "#0D1117",
                    border:
                        "1px solid #30363D",
                    color: "#6E7681",
                    fontSize: 11,
                    fontWeight: 600,
                }}
            >
                {index + 1}
            </div>

            {/* Node information */}
            <div
                style={{
                    minWidth: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <NodeStatusIcon
                        status={node.status}
                    />

                    <span
                        style={{
                            color: "#E6EDF3",
                            fontSize: 13,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow:
                                "ellipsis",
                            whiteSpace:
                                "nowrap",
                        }}
                    >
                        {node.nodeTitle}
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 5,
                        marginLeft: 24,
                    }}
                >
                    <span
                        style={{
                            color: "#6E7681",
                            fontSize: 10,
                        }}
                    >
                        {node.nodeType}
                    </span>

                    <span
                        style={{
                            color: "#30363D",
                        }}
                    >
                        •
                    </span>

                    <span
                        style={{
                            color: "#6E7681",
                            fontSize: 10,
                        }}
                    >
                        {formatTime(
                            node.startedAt,
                        )}
                    </span>
                </div>

                {node.error && (
                    <div
                        style={{
                            marginTop: 7,
                            marginLeft: 24,
                            padding:
                                "6px 8px",
                            border:
                                "1px solid #5A1E24",
                            borderRadius: 6,
                            background:
                                "#2D1115",
                            color: "#F85149",
                            fontSize: 10,
                            lineHeight: 1.4,
                        }}
                    >
                        {node.error}
                    </div>
                )}
            </div>

            {/* Status */}
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "center",
                }}
            >
                <span
                    style={{
                        padding:
                            "4px 8px",
                        borderRadius: 999,
                        border: `1px solid ${statusColor}55`,
                        background: `${statusColor}15`,
                        color: statusColor,
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform:
                            "uppercase",
                    }}
                >
                    {node.status}
                </span>
            </div>

            {/* Duration */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "flex-end",
                    gap: 5,
                    color: "#8B949E",
                    fontSize: 11,
                }}
            >
                <Clock3 size={12} />

                {formatDuration(
                    node.duration,
                )}
            </div>
        </div>
    );
}

function NodeStatusIcon({
    status,
}: {
    status: ReportNode["status"];
}) {
    if (status === "passed") {
        return (
            <CheckCircle2
                size={16}
                color="#3FB950"
                style={{
                    flexShrink: 0,
                }}
            />
        );
    }

    if (status === "failed") {
        return (
            <XCircle
                size={16}
                color="#F85149"
                style={{
                    flexShrink: 0,
                }}
            />
        );
    }

    if (status === "running") {
        return (
            <LoaderCircle
                size={16}
                color="#58A6FF"
                style={{
                    flexShrink: 0,
                }}
            />
        );
    }

    return (
        <Circle
            size={16}
            color="#6E7681"
            style={{
                flexShrink: 0,
            }}
        />
    );
}

function getNodeStatusColor(
    status: ReportNode["status"],
): string {
    switch (status) {
        case "passed":
            return "#3FB950";

        case "failed":
            return "#F85149";

        case "running":
            return "#58A6FF";

        default:
            return "#6E7681";
    }
}

function LogRow({
    log,
}: {
    log: TestReportLog;
}) {
    const levelColor =
        getLevelColor(log.level);

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "75px 75px minmax(0, 1fr) 70px",
                alignItems: "center",
                gap: 12,
                padding:
                    "11px 16px",
                borderBottom:
                    "1px solid #21262D",
                fontSize: 12,
            }}
        >
            <span
                style={{
                    color: "#6E7681",
                    fontSize: 11,
                }}
            >
                {formatTime(
                    log.timestamp,
                )}
            </span>

            <span
                style={{
                    color: levelColor,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform:
                        "uppercase",
                }}
            >
                {log.level}
            </span>

            <div
                style={{
                    minWidth: 0,
                }}
            >
                <div
                    style={{
                        color: "#E6EDF3",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow:
                            "ellipsis",
                        whiteSpace:
                            "nowrap",
                    }}
                >
                    {log.message}
                </div>

                {log.nodeTitle && (
                    <div
                        style={{
                            marginTop: 3,
                            color: "#6E7681",
                            fontSize: 10,
                        }}
                    >
                        {log.nodeTitle}
                    </div>
                )}

                {log.details && (
                    <LogDetails
                        details={
                            log.details
                        }
                    />
                )}
            </div>

            <span
                style={{
                    color: "#8B949E",
                    textAlign: "right",
                    fontSize: 11,
                }}
            >
                {log.duration !==
                    undefined
                    ? formatDuration(
                        log.duration,
                    )
                    : "—"}
            </span>
        </div>
    );
}

function LogDetails({
    details,
}: {
    details: Record<
        string,
        unknown
    >;
}) {
    const entries =
        Object.entries(details);

    if (entries.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 7,
            }}
        >
            {entries.map(
                ([key, value]) => (
                    <span
                        key={key}
                        style={{
                            padding:
                                "3px 6px",
                            border:
                                "1px solid #30363D",
                            borderRadius: 5,
                            background:
                                "#0D1117",
                            color: "#8B949E",
                            fontSize: 10,
                        }}
                    >
                        <strong
                            style={{
                                color: "#C9D1D9",
                            }}
                        >
                            {key}
                        </strong>

                        {": "}

                        {formatDetailValue(
                            value,
                        )}
                    </span>
                ),
            )}
        </div>
    );
}

function EmptyNodes() {
    return (
        <div
            style={{
                padding: 40,
                textAlign: "center",
                color: "#8B949E",
                fontSize: 12,
            }}
        >
            No node execution data
            available.
        </div>
    );
}

function EmptyLogs() {
    return (
        <div
            style={{
                padding: 40,
                textAlign: "center",
                color: "#8B949E",
                fontSize: 12,
            }}
        >
            No execution logs
            available.
        </div>
    );
}

type TestReportLog =
    import("../types/TestReport")
    .ExecutionReportLog;

function getLevelColor(
    level: TestReportLog["level"],
): string {
    switch (level) {
        case "success":
            return "#3FB950";

        case "error":
            return "#F85149";

        case "warning":
            return "#D29922";

        default:
            return "#58A6FF";
    }
}

function formatDetailValue(
    value: unknown,
): string {
    if (
        value === null ||
        value === undefined
    ) {
        return "—";
    }

    if (
        typeof value ===
        "object"
    ) {
        try {
            return JSON.stringify(
                value,
            );
        } catch {
            return String(value);
        }
    }

    return String(value);
}

function formatDate(
    timestamp: number,
): string {
    return new Date(
        timestamp,
    ).toLocaleString();
}

function formatTime(
    timestamp: number,
): string {
    return new Date(
        timestamp,
    ).toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        },
    );
}

function formatDuration(
    duration: number,
): string {
    if (duration < 1000) {
        return `${Math.round(duration)}ms`;
    }

    return `${(
        duration / 1000
    ).toFixed(2)}s`;
}

function AssertionDetails({
    report,
    node,
}: {
    report: TestReport;
    node: ReportNode;
}) {
    if (node.nodeType !== "assert") {
        return null;
    }

    const assertionLog = [...report.logs]
        .reverse()
        .find(
            (log) =>
                log.nodeId === node.nodeId &&
                log.details &&
                ("actual" in log.details ||
                    "expected" in log.details ||
                    "operator" in log.details),
        );

    if (!assertionLog?.details) {
        return null;
    }

    const details = assertionLog.details;

    return (
        <div
            style={{
                marginTop: 10,
                paddingTop: 10,
                borderTop: "1px solid #30363D",
            }}
        >
            <div
                style={{
                    marginBottom: 8,
                    color: "#E6EDF3",
                    fontSize: 10,
                    fontWeight: 700,
                }}
            >
                ASSERTION RESULT
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                    gap: 8,
                }}
            >
                {"expected" in details && (
                    <NodeDetailItem
                        label="Expected"
                        value={String(
                            details.expected ?? "—",
                        )}
                    />
                )}

                {"actual" in details && (
                    <NodeDetailItem
                        label="Actual"
                        value={String(
                            details.actual ?? "—",
                        )}
                    />
                )}

                {"operator" in details && (
                    <NodeDetailItem
                        label="Operator"
                        value={String(
                            details.operator ?? "—",
                        )}
                    />
                )}

                <NodeDetailItem
                    label="Result"
                    value={node.status.toUpperCase()}
                    valueColor={
                        node.status === "passed"
                            ? "#3FB950"
                            : node.status === "failed"
                                ? "#F85149"
                                : "#D29922"
                    }
                />
            </div>
        </div>
    );
}

