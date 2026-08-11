import {
    useState,
} from "react";

import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    FileText,
    Info,
    XCircle,
    AlertTriangle,
    Camera,
    ChevronDown,
    ExternalLink,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

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
    const [expandedNodes, setExpandedNodes] =
        useState<Record<string, boolean>>({});

    const [lightboxNodeId, setLightboxNodeId] =
        useState<string | null>(null);

    const evidenceNodes = report.nodes.filter(
        (node) => Boolean(node.screenshot),
    );

    const lightboxIndex =
        evidenceNodes.findIndex(
            (node) =>
                node.nodeId ===
                lightboxNodeId,
        );

    const lightboxNode =
        lightboxIndex >= 0
            ? evidenceNodes[lightboxIndex]
            : undefined;

    const closeLightbox = () =>
        setLightboxNodeId(null);

    const showPreviousScreenshot = () => {
        if (
            evidenceNodes.length === 0
        ) {
            return;
        }

        const previousIndex =
            lightboxIndex <= 0
                ? evidenceNodes.length - 1
                : lightboxIndex - 1;

        setLightboxNodeId(
            evidenceNodes[
                previousIndex
            ].nodeId,
        );
    };

    const showNextScreenshot = () => {
        if (
            evidenceNodes.length === 0
        ) {
            return;
        }

        const nextIndex =
            lightboxIndex >=
            evidenceNodes.length - 1
                ? 0
                : lightboxIndex + 1;

        setLightboxNodeId(
            evidenceNodes[
                nextIndex
            ].nodeId,
        );
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
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 24,
                    }}
                >
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

                    <div>
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
                            Detailed execution
                            result and logs.
                        </p>
                    </div>
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
                        marginBottom: 16,
                        border:
                            "1px solid #30363D",
                        borderRadius: 12,
                        background: "#161B22",
                        overflow: "hidden",
                    }}
                >
                    <SectionHeader
                        title="Node Execution"
                        icon={
                            <Camera
                                size={16}
                            />
                        }
                    />

                    {report.nodes.length === 0 ? (
                        <div
                            style={{
                                padding: 32,
                                textAlign: "center",
                                color: "#8B949E",
                                fontSize: 12,
                            }}
                        >
                            No node execution data
                            available.
                        </div>
                    ) : (
                        <div>
                            {report.nodes.map(
                                (node, index) => {
                                    const expanded =
                                        expandedNodes[
                                            node.nodeId
                                        ] ?? false;

                                    const hasEvidence =
                                        Boolean(
                                            node.screenshot,
                                        );

                                    const statusColor =
                                        node.status ===
                                        "passed"
                                            ? "#3FB950"
                                            : node.status ===
                                                "failed"
                                              ? "#F85149"
                                              : "#D29922";

                                    return (
                                        <div
                                            key={
                                                node.nodeId
                                            }
                                            style={{
                                                borderBottom:
                                                    index ===
                                                    report
                                                        .nodes
                                                        .length -
                                                        1
                                                        ? "none"
                                                        : "1px solid #21262D",
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExpandedNodes(
                                                        (
                                                            state,
                                                        ) => ({
                                                            ...state,
                                                            [node.nodeId]:
                                                                !expanded,
                                                        }),
                                                    )
                                                }
                                                style={{
                                                    width:
                                                        "100%",
                                                    display:
                                                        "grid",
                                                    gridTemplateColumns:
                                                        "28px minmax(0, 1fr) auto auto",
                                                    alignItems:
                                                        "center",
                                                    gap: 10,
                                                    padding:
                                                        "12px 16px",
                                                    border:
                                                        "none",
                                                    background:
                                                        "transparent",
                                                    color:
                                                        "#E6EDF3",
                                                    textAlign:
                                                        "left",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color:
                                                            "#6E7681",
                                                        fontSize:
                                                            10,
                                                        textAlign:
                                                            "center",
                                                    }}
                                                >
                                                    {index +
                                                        1}
                                                </span>

                                                <div
                                                    style={{
                                                        minWidth:
                                                            0,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            overflow:
                                                                "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                            color:
                                                                "#E6EDF3",
                                                            fontSize:
                                                                12,
                                                            fontWeight:
                                                                600,
                                                        }}
                                                    >
                                                        {
                                                            node.nodeTitle
                                                        }
                                                    </div>

                                                    <div
                                                        style={{
                                                            marginTop:
                                                                3,
                                                            color:
                                                                "#6E7681",
                                                            fontSize:
                                                                10,
                                                        }}
                                                    >
                                                        {
                                                            node.nodeType
                                                        }
                                                    </div>
                                                </div>

                                                <span
                                                    style={{
                                                        color:
                                                            statusColor,
                                                        fontSize:
                                                            10,
                                                        fontWeight:
                                                            700,
                                                    }}
                                                >
                                                    {node.status.toUpperCase()}
                                                </span>

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 7,
                                                        color:
                                                            "#8B949E",
                                                        fontSize:
                                                            10,
                                                    }}
                                                >
                                                    {formatDuration(
                                                        node.duration,
                                                    )}

                                                    {hasEvidence && (
                                                        <Camera
                                                            size={
                                                                13
                                                            }
                                                            color="#58A6FF"
                                                        />
                                                    )}

                                                    <ChevronDown
                                                        size={
                                                            14
                                                        }
                                                        style={{
                                                            transform:
                                                                expanded
                                                                    ? "rotate(180deg)"
                                                                    : "rotate(0deg)",
                                                            transition:
                                                                "transform .15s ease",
                                                        }}
                                                    />
                                                </div>
                                            </button>

                                            {expanded && (
                                                <div
                                                    style={{
                                                        padding:
                                                            "0 16px 16px 54px",
                                                    }}
                                                >
                                                    {node.error && (
                                                        <div
                                                            style={{
                                                                marginBottom:
                                                                    12,
                                                                padding:
                                                                    "10px 12px",
                                                                border:
                                                                    "1px solid rgba(248,81,73,.35)",
                                                                borderRadius:
                                                                    8,
                                                                background:
                                                                    "rgba(248,81,73,.08)",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    color:
                                                                        "#F85149",
                                                                    fontSize:
                                                                        10,
                                                                    fontWeight:
                                                                        700,
                                                                }}
                                                            >
                                                                Error
                                                            </div>

                                                            <div
                                                                style={{
                                                                    marginTop:
                                                                        5,
                                                                    color:
                                                                        "#C9D1D9",
                                                                    fontSize:
                                                                        11,
                                                                    lineHeight:
                                                                        1.5,
                                                                    whiteSpace:
                                                                        "pre-wrap",
                                                                    overflowWrap:
                                                                        "anywhere",
                                                                }}
                                                            >
                                                                {
                                                                    node.error
                                                                }
                                                            </div>
                                                        </div>
                                                    )}

                                                    {node.screenshot ? (
                                                        <ScreenshotEvidence
                                                            screenshot={
                                                                node.screenshot
                                                            }
                                                            title={
                                                                node.nodeTitle
                                                            }
                                                            onOpen={() =>
                                                                setLightboxNodeId(
                                                                    node.nodeId,
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                padding:
                                                                    12,
                                                                border:
                                                                    "1px dashed #30363D",
                                                                borderRadius:
                                                                    8,
                                                                color:
                                                                    "#6E7681",
                                                                fontSize:
                                                                    10,
                                                            }}
                                                        >
                                                            No screenshot
                                                            evidence
                                                            captured for
                                                            this node.
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    )}
                </div>

                {/* Logs */}
                <div
                    style={{
                        border:
                            "1px solid #30363D",
                        borderRadius: 12,
                        background: "#161B22",
                        overflow: "hidden",
                    }}
                >
                    <SectionHeader
                        title="Execution Logs"
                        icon={
                            <FileText
                                size={16}
                            />
                        }
                    />

                    {report.logs.length ===
                    0 ? (
                        <EmptyLogs />
                    ) : (
                        <div>
                            {report.logs.map(
                                (log) => (
                                    <LogRow
                                        key={
                                            log.id
                                        }
                                        log={log}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>

            {lightboxNode && (
                <ScreenshotLightbox
                    node={lightboxNode}
                    index={lightboxIndex}
                    total={
                        evidenceNodes.length
                    }
                    onClose={
                        closeLightbox
                    }
                    onPrevious={
                        showPreviousScreenshot
                    }
                    onNext={
                        showNextScreenshot
                    }
                />
            )}
        </div>
    );
}

function ScreenshotEvidence({
    screenshot,
    title,
    onOpen,
}: {
    screenshot: string;
    title: string;
    onOpen: () => void;
}) {
    const src = screenshot.startsWith(
        "data:image/",
    )
        ? screenshot
        : `data:image/png;base64,${screenshot}`;

    return (
        <div
            style={{
                border:
                    "1px solid #30363D",
                borderRadius: 10,
                background: "#0D1117",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    gap: 10,
                    padding:
                        "10px 12px",
                    borderBottom:
                        "1px solid #30363D",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems:
                            "center",
                        gap: 8,
                    }}
                >
                    <Camera
                        size={14}
                        color="#58A6FF"
                    />

                    <div>
                        <div
                            style={{
                                color:
                                    "#C9D1D9",
                                fontSize: 11,
                                fontWeight: 600,
                            }}
                        >
                            Screenshot Evidence
                        </div>

                        <div
                            style={{
                                marginTop: 2,
                                color:
                                    "#6E7681",
                                fontSize: 9,
                            }}
                        >
                            Captured from the
                            Appium session
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onOpen}
                    style={{
                        display: "flex",
                        alignItems:
                            "center",
                        gap: 5,
                        height: 28,
                        padding:
                            "0 8px",
                        border:
                            "1px solid #30363D",
                        borderRadius: 6,
                        background:
                            "#161B22",
                        color: "#C9D1D9",
                        fontSize: 9,
                        fontWeight: 600,
                        cursor:
                            "pointer",
                    }}
                >
                    <ExternalLink
                        size={12}
                    />

                    View
                </button>
            </div>

            <button
                type="button"
                onClick={onOpen}
                title="Open screenshot"
                style={{
                    display: "block",
                    width: "100%",
                    padding: 12,
                    border: "none",
                    background:
                        "#0D1117",
                    cursor: "zoom-in",
                }}
            >
                <img
                    src={src}
                    alt={`${title} screenshot`}
                    style={{
                        display: "block",
                        width: "100%",
                        maxHeight: 420,
                        objectFit:
                            "contain",
                        borderRadius: 7,
                        background:
                            "#010409",
                    }}
                />
            </button>
        </div>
    );
}

function ScreenshotLightbox({
    node,
    index,
    total,
    onClose,
    onPrevious,
    onNext,
}: {
    node: ReportNode;
    index: number;
    total: number;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
}) {
    const screenshot =
        node.screenshot ?? "";

    const src = screenshot.startsWith(
        "data:image/",
    )
        ? screenshot
        : `data:image/png;base64,${screenshot}`;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Screenshot evidence"
            onClick={onClose}
            onKeyDown={(event) => {
                if (
                    event.key ===
                    "Escape"
                ) {
                    onClose();
                }

                if (
                    event.key ===
                    "ArrowLeft"
                ) {
                    onPrevious();
                }

                if (
                    event.key ===
                    "ArrowRight"
                ) {
                    onNext();
                }
            }}
            tabIndex={-1}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                flexDirection:
                    "column",
                alignItems:
                    "center",
                justifyContent:
                    "center",
                gap: 14,
                padding: 24,
                background:
                    "rgba(1, 4, 9, 0.88)",
                backdropFilter:
                    "blur(8px)",
            }}
        >
            <div
                style={{
                    width: "min(1100px, 100%)",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "space-between",
                    gap: 12,
                }}
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <div
                    style={{
                        minWidth: 0,
                    }}
                >
                    <div
                        style={{
                            color:
                                "#E6EDF3",
                            fontSize: 13,
                            fontWeight: 700,
                            overflow:
                                "hidden",
                            textOverflow:
                                "ellipsis",
                            whiteSpace:
                                "nowrap",
                        }}
                    >
                        {node.nodeTitle}
                    </div>

                    <div
                        style={{
                            marginTop: 4,
                            color:
                                "#8B949E",
                            fontSize: 10,
                        }}
                    >
                        {node.nodeType} ·{" "}
                        {formatDuration(
                            node.duration,
                        )}{" "}
                        · Screenshot{" "}
                        {index + 1} of{" "}
                        {total}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                        flex:
                            "0 0 auto",
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        border:
                            "1px solid #30363D",
                        borderRadius: 7,
                        background:
                            "#161B22",
                        color:
                            "#C9D1D9",
                        cursor:
                            "pointer",
                    }}
                >
                    <X size={16} />
                </button>
            </div>

            <div
                style={{
                    position: "relative",
                    width:
                        "min(1100px, 100%)",
                    maxHeight:
                        "calc(100vh - 150px)",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                }}
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {total > 1 && (
                    <button
                        type="button"
                        onClick={
                            onPrevious
                        }
                        aria-label="Previous screenshot"
                        style={{
                            position:
                                "absolute",
                            left: 12,
                            zIndex: 2,
                            width: 38,
                            height: 38,
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            border:
                                "1px solid #30363D",
                            borderRadius:
                                "50%",
                            background:
                                "rgba(22,27,34,.9)",
                            color:
                                "#E6EDF3",
                            cursor:
                                "pointer",
                        }}
                    >
                        <ChevronLeft
                            size={18}
                        />
                    </button>
                )}

                <img
                    src={src}
                    alt={`${node.nodeTitle} screenshot`}
                    style={{
                        display: "block",
                        maxWidth: "100%",
                        maxHeight:
                            "calc(100vh - 150px)",
                        objectFit:
                            "contain",
                        border:
                            "1px solid #30363D",
                        borderRadius: 10,
                        background:
                            "#010409",
                        boxShadow:
                            "0 24px 80px rgba(0,0,0,.5)",
                    }}
                />

                {total > 1 && (
                    <button
                        type="button"
                        onClick={onNext}
                        aria-label="Next screenshot"
                        style={{
                            position:
                                "absolute",
                            right: 12,
                            zIndex: 2,
                            width: 38,
                            height: 38,
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            border:
                                "1px solid #30363D",
                            borderRadius:
                                "50%",
                            background:
                                "rgba(22,27,34,.9)",
                            color:
                                "#E6EDF3",
                            cursor:
                                "pointer",
                        }}
                    >
                        <ChevronRight
                            size={18}
                        />
                    </button>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems:
                        "center",
                    gap: 8,
                    color:
                        "#6E7681",
                    fontSize: 9,
                }}
            >
                <span>
                    Press Esc to close
                </span>

                {total > 1 && (
                    <span>
                        · ← / → to navigate
                    </span>
                )}
            </div>
        </div>
    );
}

function escapeHtml(
    value: string,
): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll(
            "'",
            "&#039;",
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
    TestReportLogFromType;

type TestReportLogFromType =
    import("../types/TestReport").ExecutionReportLog;

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