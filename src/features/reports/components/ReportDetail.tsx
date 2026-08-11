import {
    useState,
    type ReactNode,
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
    Code2,
    Copy,
    Check,
    Search,
    Smartphone,
    Cpu,
    TerminalSquare,
    Hash,
    Download,
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

    const [copiedPageSourceNodeId, setCopiedPageSourceNodeId] =
        useState<string | null>(null);

    const copyPageSource = async (
        node: ReportNode,
    ) => {
        if (!node.pageSource) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                node.pageSource,
            );

            setCopiedPageSourceNodeId(
                node.nodeId,
            );

            window.setTimeout(() => {
                setCopiedPageSourceNodeId(
                    (current) =>
                        current === node.nodeId
                            ? null
                            : current,
                );
            }, 1500);
        } catch (error) {
            console.warn(
                "Failed to copy page source.",
                error,
            );
        }
    };

    const downloadFile = (
        content: string,
        fileName: string,
        mimeType: string,
    ) => {
        const blob = new Blob(
            [content],
            { type: mimeType },
        );

        const url =
            URL.createObjectURL(blob);

        const anchor =
            document.createElement("a");

        anchor.href = url;
        anchor.download = fileName;

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        URL.revokeObjectURL(url);
    };

    const exportJson = () => {
        downloadFile(
            JSON.stringify(report, null, 2),
            `flowtest-report-${report.id}.json`,
            "application/json",
        );
    };

    const exportHtml = () => {
        downloadFile(
            createReportHtml(report),
            `flowtest-report-${report.id}.html`,
            "text/html;charset=utf-8",
        );
    };

    const exportPdf = () => {
        const printWindow = window.open(
            "",
            "_blank",
            "width=1200,height=900",
        );

        if (!printWindow) {
            return;
        }

        printWindow.document.open();
        printWindow.document.write(
            createReportHtml(report),
        );
        printWindow.document.close();
        printWindow.focus();

        window.setTimeout(() => {
            printWindow.print();
        }, 500);
    };

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

                    <div
                        style={{
                            marginLeft: "auto",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            flex: "0 0 auto",
                        }}
                    >
                        <ExportButton
                            label="HTML"
                            onClick={exportHtml}
                        />

                        <ExportButton
                            label="PDF"
                            onClick={exportPdf}
                        />

                        <ExportButton
                            label="JSON"
                            onClick={exportJson}
                        />
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

                {/* Environment */}
                <section
                    style={{
                        marginBottom: 16,
                        border:
                            "1px solid #30363D",
                        borderRadius: 12,
                        background: "#161B22",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "14px 16px",
                            borderBottom:
                                "1px solid #30363D",
                        }}
                    >
                        <Smartphone
                            size={15}
                            color="#58A6FF"
                        />

                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#C9D1D9",
                            }}
                        >
                            Environment
                        </span>

                        <span
                            style={{
                                marginLeft: "auto",
                                color: "#6E7681",
                                fontSize: 10,
                            }}
                        >
                            Captured at execution time
                        </span>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(2, minmax(0, 1fr))",
                        }}
                    >
                        <EnvironmentItem
                            icon={
                                <Smartphone
                                    size={13}
                                />
                            }
                            label="Platform"
                            value={
                                report.environment
                                    ?.platform ||
                                "—"
                            }
                        />

                        <EnvironmentItem
                            icon={
                                <Cpu
                                    size={13}
                                />
                            }
                            label="OS Version"
                            value={
                                report.environment
                                    ?.platformVersion ||
                                "—"
                            }
                        />

                        <EnvironmentItem
                            icon={
                                <Smartphone
                                    size={13}
                                />
                            }
                            label="Device"
                            value={
                                report.environment
                                    ?.deviceName ||
                                "—"
                            }
                        />

                        <EnvironmentItem
                            icon={
                                <TerminalSquare
                                    size={13}
                                />
                            }
                            label="Automation"
                            value={
                                report.environment
                                    ?.automationName ||
                                "—"
                            }
                        />

                        <EnvironmentItem
                            icon={
                                <Hash
                                    size={13}
                                />
                            }
                            label="Session"
                            value={
                                report.environment
                                    ?.sessionId ||
                                "No active session"
                            }
                            fullWidth
                        />
                    </div>
                </section>

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
                                            node.screenshot ||
                                            node.pageSource,
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

                                                    {node.pageSource && (
                                                        <PageSourceEvidence
                                                            pageSource={
                                                                node.pageSource
                                                            }
                                                            copied={
                                                                copiedPageSourceNodeId ===
                                                                node.nodeId
                                                            }
                                                            onCopy={() =>
                                                                copyPageSource(
                                                                    node,
                                                                )
                                                            }
                                                        />
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

function PageSourceEvidence({
    pageSource,
    copied,
    onCopy,
}: {
    pageSource: string;
    copied: boolean;
    onCopy: () => void;
}) {
    const [expanded, setExpanded] =
        useState(false);

    const [searchQuery, setSearchQuery] =
        useState("");

    const previewLimit = 4000;

    const sourceLines =
        pageSource.split("\n");

    const normalizedQuery =
        searchQuery.trim().toLowerCase();

    const matchingLineNumbers =
        normalizedQuery
            ? sourceLines.reduce<number[]>(
                (
                    matches,
                    line,
                    index,
                ) => {
                    if (
                        line
                            .toLowerCase()
                            .includes(
                                normalizedQuery,
                            )
                    ) {
                        matches.push(
                            index,
                        );
                    }

                    return matches;
                },
                [],
            )
            : [];

    const visibleSource =
        expanded ||
            pageSource.length <=
            previewLimit
            ? pageSource
            : `${pageSource.slice(
                0,
                previewLimit,
            )}\n\n... page source truncated ...`;

    const highlightedSource =
        highlightXml(
            visibleSource,
        );

    const scrollToNextMatch = () => {
        if (
            matchingLineNumbers.length ===
            0
        ) {
            return;
        }

        const firstMatch =
            matchingLineNumbers[0];

        // If the match is outside the preview,
        // expand the source before scrolling.
        const matchLine =
            sourceLines[firstMatch] ?? "";

        const previewLines =
            visibleSource.split("\n").length;

        const matchIsOutsidePreview =
            firstMatch >=
            previewLines;

        if (matchIsOutsidePreview) {
            setExpanded(true);
        }

        // Wait for the expanded source to render,
        // then scroll directly to the matching line.
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                const element =
                    document.getElementById(
                        `page-source-line-${firstMatch}`,
                    );

                element?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest",
                });
            });
        });
    };

    return (
        <div
            style={{
                marginTop: 12,
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
                    alignItems:
                        "center",
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
                    <Code2
                        size={14}
                        color="#A371F7"
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
                            Page Source Evidence
                        </div>

                        <div
                            style={{
                                marginTop: 2,
                                color:
                                    "#6E7681",
                                fontSize: 9,
                            }}
                        >
                            UI hierarchy captured at failure
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems:
                            "center",
                        gap: 6,
                    }}
                >
                    <button
                        type="button"
                        onClick={onCopy}
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
                            color:
                                "#C9D1D9",
                            fontSize: 9,
                            fontWeight: 600,
                            cursor:
                                "pointer",
                        }}
                    >
                        {copied ? (
                            <Check
                                size={12}
                            />
                        ) : (
                            <Copy
                                size={12}
                            />
                        )}

                        {copied
                            ? "Copied"
                            : "Copy XML"}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setExpanded(
                                (value) =>
                                    !value,
                            )
                        }
                        style={{
                            height: 28,
                            padding:
                                "0 8px",
                            border:
                                "1px solid #30363D",
                            borderRadius: 6,
                            background:
                                "#161B22",
                            color:
                                "#8B949E",
                            fontSize: 9,
                            fontWeight: 600,
                            cursor:
                                "pointer",
                        }}
                    >
                        {expanded
                            ? "Collapse"
                            : "Expand"}
                    </button>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems:
                        "center",
                    gap: 8,
                    padding:
                        "8px 10px",
                    borderBottom:
                        "1px solid #21262D",
                    background:
                        "#0D1117",
                }}
            >
                <Search
                    size={13}
                    color="#6E7681"
                />

                <input
                    value={searchQuery}
                    onChange={(event) =>
                        setSearchQuery(
                            event.target.value,
                        )
                    }
                    onKeyDown={(event) => {
                        if (
                            event.key ===
                            "Enter"
                        ) {
                            scrollToNextMatch();
                        }
                    }}
                    placeholder="Search elements or attributes... Press Enter to jump"
                    style={{
                        flex: 1,
                        minWidth: 0,
                        height: 26,
                        padding:
                            "0 4px",
                        border: "none",
                        outline: "none",
                        background:
                            "transparent",
                        color:
                            "#C9D1D9",
                        fontSize: 10,
                    }}
                />

                {searchQuery && (
                    <span
                        style={{
                            flex:
                                "0 0 auto",
                            color:
                                matchingLineNumbers.length >
                                    0
                                    ? "#3FB950"
                                    : "#F85149",
                            fontSize: 9,
                            fontWeight: 600,
                        }}
                    >
                        {matchingLineNumbers.length}{" "}
                        {matchingLineNumbers.length ===
                            1
                            ? "match"
                            : "matches"}
                    </span>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    maxHeight:
                        expanded
                            ? 560
                            : 260,
                    overflow: "auto",
                    background:
                        "#010409",
                }}
            >
                <div
                    aria-hidden="true"
                    style={{
                        flex:
                            "0 0 auto",
                        padding:
                            "14px 10px 14px 14px",
                        borderRight:
                            "1px solid #21262D",
                        color:
                            "#484F58",
                        fontSize: 10,
                        lineHeight: 1.55,
                        fontFamily:
                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        textAlign:
                            "right",
                        userSelect:
                            "none",
                    }}
                >
                    {visibleSource
                        .split("\n")
                        .map(
                            (
                                _line,
                                index,
                            ) => (
                                <div
                                    key={
                                        index
                                    }
                                    id={`page-source-line-${index}`}
                                    style={{
                                        minWidth: 28,
                                        padding:
                                            "0 2px",
                                        borderRadius:
                                            3,
                                        background:
                                            normalizedQuery &&
                                                matchingLineNumbers.includes(
                                                    index,
                                                )
                                                ? "rgba(210,153,34,.16)"
                                                : "transparent",
                                        color:
                                            normalizedQuery &&
                                                matchingLineNumbers.includes(
                                                    index,
                                                )
                                                ? "#D29922"
                                                : "#484F58",
                                    }}
                                >
                                    {index +
                                        1}
                                </div>
                            ),
                        )}
                </div>

                <pre
                    style={{
                        flex: 1,
                        margin: 0,
                        padding:
                            "14px 14px 14px 12px",
                        minWidth: 0,
                        color:
                            "#C9D1D9",
                        fontSize: 10,
                        lineHeight: 1.55,
                        fontFamily:
                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        whiteSpace:
                            "pre",
                    }}
                >
                    {highlightedSource}
                </pre>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "space-between",
                    gap: 12,
                    padding:
                        "8px 12px",
                    borderTop:
                        "1px solid #21262D",
                    color:
                        "#6E7681",
                    fontSize: 9,
                }}
            >
                <span>
                    {pageSource.length.toLocaleString()}{" "}
                    characters ·{" "}
                    {sourceLines.length.toLocaleString()}{" "}
                    lines
                </span>

                {!expanded &&
                    pageSource.length >
                    previewLimit && (
                        <button
                            type="button"
                            onClick={() =>
                                setExpanded(
                                    true,
                                )
                            }
                            style={{
                                border:
                                    "none",
                                background:
                                    "transparent",
                                color:
                                    "#58A6FF",
                                fontSize: 9,
                                fontWeight:
                                    600,
                                cursor:
                                    "pointer",
                            }}
                        >
                            View full source
                        </button>
                    )}
            </div>
        </div>
    );
}

function highlightXml(
    source: string,
): ReactNode[] {
    const tokenPattern =
        /<!--[\s\S]*?-->|<\/?[\w:.-]+(?:\s+[\s\S]*?)?\/?>/g;

    const result: ReactNode[] = [];

    let lastIndex = 0;
    let tokenIndex = 0;

    const addText = (
        value: string,
    ) => {
        if (!value) {
            return;
        }

        result.push(
            <span
                key={`text-${tokenIndex++}`}
            >
                {value}
            </span>,
        );
    };

    let match: RegExpExecArray | null;

    while (
        (match =
            tokenPattern.exec(
                source,
            )) !== null
    ) {
        addText(
            source.slice(
                lastIndex,
                match.index,
            ),
        );

        const token =
            match[0];

        if (
            token.startsWith(
                "<!--",
            )
        ) {
            result.push(
                <span
                    key={`comment-${tokenIndex++}`}
                    style={{
                        color:
                            "#6E7681",
                    }}
                >
                    {token}
                </span>,
            );
        } else {
            const tagMatch =
                token.match(
                    /^(<\/?)([\w:.-]+)([\s\S]*?)(\/?>)$/,
                );

            if (!tagMatch) {
                result.push(
                    <span
                        key={`raw-${tokenIndex++}`}
                    >
                        {token}
                    </span>,
                );
            } else {
                const [
                    ,
                    open,
                    tagName,
                    attributes,
                    close,
                ] = tagMatch;

                result.push(
                    <span
                        key={`tag-${tokenIndex++}`}
                    >
                        <span
                            style={{
                                color:
                                    "#FF7B72",
                            }}
                        >
                            {open}
                        </span>

                        <span
                            style={{
                                color:
                                    "#79C0FF",
                            }}
                        >
                            {tagName}
                        </span>

                        {highlightXmlAttributes(
                            attributes,
                        )}

                        <span
                            style={{
                                color:
                                    "#FF7B72",
                            }}
                        >
                            {close}
                        </span>
                    </span>,
                );
            }
        }

        lastIndex =
            match.index +
            token.length;
    }

    addText(
        source.slice(
            lastIndex,
        ),
    );

    return result;
}

function highlightXmlAttributes(
    value: string,
): ReactNode[] {
    const attributePattern =
        /([\w:.-]+)(\s*=\s*)(["'][\s\S]*?["'])/g;

    const result: ReactNode[] = [];

    let lastIndex = 0;
    let tokenIndex = 0;

    let match: RegExpExecArray | null;

    while (
        (match =
            attributePattern.exec(
                value,
            )) !== null
    ) {
        if (
            match.index >
            lastIndex
        ) {
            result.push(
                <span
                    key={`attr-text-${tokenIndex++}`}
                >
                    {value.slice(
                        lastIndex,
                        match.index,
                    )}
                </span>,
            );
        }

        result.push(
            <span
                key={`attribute-${tokenIndex++}`}
            >
                <span
                    style={{
                        color:
                            "#D2A8FF",
                    }}
                >
                    {match[1]}
                </span>

                <span
                    style={{
                        color:
                            "#8B949E",
                    }}
                >
                    {match[2]}
                </span>

                <span
                    style={{
                        color:
                            "#A5D6FF",
                    }}
                >
                    {match[3]}
                </span>
            </span>,
        );

        lastIndex =
            match.index +
            match[0].length;
    }

    if (
        lastIndex <
        value.length
    ) {
        result.push(
            <span
                key={`attr-tail-${tokenIndex++}`}
            >
                {value.slice(
                    lastIndex,
                )}
            </span>,
        );
    }

    return result;
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

function ExportButton({
    label,
    onClick,
}: {
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`Export report as ${label}`}
            title={`Export ${label}`}
            style={{
                height: 32,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 10px",
                border: "1px solid #30363D",
                borderRadius: 7,
                background: "#161B22",
                color: "#C9D1D9",
                fontSize: 10,
                fontWeight: 600,
                cursor: "pointer",
            }}
            onMouseEnter={(event) => {
                event.currentTarget.style.borderColor =
                    "#58A6FF";
                event.currentTarget.style.color =
                    "#E6EDF3";
            }}
            onMouseLeave={(event) => {
                event.currentTarget.style.borderColor =
                    "#30363D";
                event.currentTarget.style.color =
                    "#C9D1D9";
            }}
        >
            <Download size={12} />
            {label}
        </button>
    );
}

function EnvironmentItem({
    icon,
    label,
    value,
    fullWidth = false,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    fullWidth?: boolean;
}) {
    return (
        <div
            style={{
                gridColumn:
                    fullWidth
                        ? "1 / -1"
                        : undefined,
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                minWidth: 0,
                padding: "13px 16px",
                borderBottom:
                    "1px solid #21262D",
                borderRight:
                    fullWidth
                        ? undefined
                        : "1px solid #21262D",
            }}
        >
            <div
                style={{
                    width: 26,
                    height: 26,
                    flex: "0 0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border:
                        "1px solid #30363D",
                    borderRadius: 6,
                    background: "#0D1117",
                    color: "#8B949E",
                }}
            >
                {icon}
            </div>

            <div style={{ minWidth: 0 }}>
                <div
                    style={{
                        color: "#6E7681",
                        fontSize: 9,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                    }}
                >
                    {label}
                </div>

                <div
                    title={value}
                    style={{
                        marginTop: 4,
                        color: "#C9D1D9",
                        fontSize: 11,
                        fontWeight: 500,
                        fontFamily:
                            label === "Session"
                                ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                                : undefined,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {value}
                </div>
            </div>
        </div>
    );
}

function SectionHeader({
    title,
    icon,
}: {
    title: string;

    icon: ReactNode;
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

function createReportHtml(
    report: TestReport,
): string {
    const environment = report.environment;

    const nodesHtml = report.nodes
        .map((node, index) => {
            const screenshot = node.screenshot
                ? node.screenshot.startsWith("data:image/")
                    ? node.screenshot
                    : `data:image/png;base64,${node.screenshot}`
                : "";

            return `
                <section class="node">
                    <div class="node-header">
                        <div>
                            <div class="node-title">
                                ${escapeHtml(node.nodeTitle)}
                            </div>
                            <div class="node-type">
                                #${index + 1} · ${escapeHtml(node.nodeType)}
                            </div>
                        </div>

                        <div class="node-meta">
                            <span class="status ${escapeHtml(node.status)}">
                                ${escapeHtml(node.status.toUpperCase())}
                            </span>
                            <span>
                                ${escapeHtml(formatDuration(node.duration))}
                            </span>
                        </div>
                    </div>

                    ${
                        node.error
                            ? `
                                <div class="error">
                                    <strong>Error</strong>
                                    <div>${escapeHtml(node.error)}</div>
                                </div>
                            `
                            : ""
                    }

                    ${
                        screenshot
                            ? `
                                <div class="evidence">
                                    <h4>Screenshot Evidence</h4>
                                    <img
                                        src="${screenshot}"
                                        alt="${escapeHtml(node.nodeTitle)} screenshot"
                                    />
                                </div>
                            `
                            : ""
                    }

                    ${
                        node.pageSource
                            ? `
                                <div class="source">
                                    <h4>Page Source Evidence</h4>
                                    <pre>${escapeHtml(node.pageSource)}</pre>
                                </div>
                            `
                            : ""
                    }
                </section>
            `;
        })
        .join("");

    const logsHtml = report.logs
        .map(
            (log) => `
                <div class="log">
                    <div class="log-time">
                        ${escapeHtml(formatTime(log.timestamp))}
                    </div>
                    <div class="log-level ${escapeHtml(log.level)}">
                        ${escapeHtml(log.level.toUpperCase())}
                    </div>
                    <div class="log-message">
                        ${escapeHtml(log.message)}
                        ${
                            log.nodeTitle
                                ? `<div class="log-node">${escapeHtml(log.nodeTitle)}</div>`
                                : ""
                        }
                    </div>
                    <div class="log-duration">
                        ${
                            log.duration !== undefined
                                ? escapeHtml(formatDuration(log.duration))
                                : "—"
                        }
                    </div>
                </div>
            `,
        )
        .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>FlowTest Studio - Execution Report</title>
<style>
    * { box-sizing: border-box; }

    body {
        margin: 0;
        padding: 32px;
        background: #0D1117;
        color: #E6EDF3;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.5;
    }

    .container { max-width: 1100px; margin: 0 auto; }

    .header { margin-bottom: 24px; }

    h1 { margin: 0; font-size: 26px; }

    h2 { margin: 0; font-size: 17px; }

    .subtitle { margin-top: 6px; color: #8B949E; font-size: 12px; }

    .card {
        margin-bottom: 16px;
        border: 1px solid #30363D;
        border-radius: 12px;
        background: #161B22;
        overflow: hidden;
    }

    .card-header {
        padding: 14px 16px;
        border-bottom: 1px solid #30363D;
        font-size: 14px;
        font-weight: 600;
    }

    .status-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px;
    }

    .status { font-size: 11px; font-weight: 700; }
    .status.passed { color: #3FB950; }
    .status.failed { color: #F85149; }
    .status.stopped { color: #D29922; }

    .summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }

    .summary-item { padding: 16px; border-right: 1px solid #21262D; }

    .label { color: #8B949E; font-size: 10px; }

    .value { margin-top: 6px; color: #E6EDF3; font-size: 12px; font-weight: 600; }

    .environment { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }

    .environment-item {
        padding: 14px 16px;
        border-right: 1px solid #21262D;
        border-bottom: 1px solid #21262D;
    }

    .environment-item.full { grid-column: 1 / -1; }

    .node { padding: 16px; border-bottom: 1px solid #21262D; }

    .node-header { display: flex; justify-content: space-between; gap: 16px; }

    .node-title { font-size: 13px; font-weight: 600; }

    .node-type { margin-top: 3px; color: #6E7681; font-size: 10px; }

    .node-meta { display: flex; align-items: center; gap: 12px; color: #8B949E; font-size: 10px; }

    .error {
        margin-top: 12px;
        padding: 12px;
        border: 1px solid rgba(248, 81, 73, .35);
        border-radius: 8px;
        background: rgba(248, 81, 73, .08);
        color: #C9D1D9;
        font-size: 11px;
    }

    .error strong { display: block; margin-bottom: 5px; color: #F85149; }

    .evidence, .source {
        margin-top: 12px;
        padding: 12px;
        border: 1px solid #30363D;
        border-radius: 8px;
        background: #0D1117;
    }

    .evidence h4, .source h4 { margin: 0 0 10px; color: #C9D1D9; font-size: 11px; }

    .evidence img {
        display: block;
        width: 100%;
        max-height: 600px;
        object-fit: contain;
        background: #010409;
        border-radius: 6px;
    }

    pre {
        margin: 0;
        padding: 12px;
        max-height: 600px;
        overflow: auto;
        background: #010409;
        color: #C9D1D9;
        font-size: 10px;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-word;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    .log {
        display: grid;
        grid-template-columns: 80px 80px minmax(0, 1fr) 70px;
        gap: 12px;
        padding: 10px 16px;
        border-bottom: 1px solid #21262D;
        font-size: 11px;
    }

    .log-time { color: #6E7681; }
    .log-level { font-weight: 700; }
    .log-level.success { color: #3FB950; }
    .log-level.error, .log-level.failed { color: #F85149; }
    .log-level.warn, .log-level.warning { color: #D29922; }
    .log-level.info { color: #58A6FF; }
    .log-message { color: #E6EDF3; }
    .log-node { margin-top: 3px; color: #6E7681; font-size: 9px; }
    .log-duration { color: #8B949E; text-align: right; }

    @media (max-width: 760px) {
        body { padding: 16px; }
        .summary, .environment { grid-template-columns: 1fr; }
        .environment-item.full { grid-column: auto; }
        .summary-item, .environment-item { border-right: none; }
        .log { grid-template-columns: 1fr; gap: 3px; }
        .log-duration { text-align: left; }
    }

    @media print {
        @page { margin: 14mm; }

        body {
            padding: 0;
            background: white;
            color: #111;
        }

        .card, .node, .evidence, .source {
            break-inside: avoid;
        }

        .card { background: white; border-color: #D0D7DE; }
        .environment-item, .summary-item, .node, .log { border-color: #D0D7DE; }
        .label, .node-type, .subtitle, .log-time, .log-node, .log-duration { color: #57606A; }
        .value, .node-title, .log-message { color: #111; }
        .source, .evidence { background: #F6F8FA; border-color: #D0D7DE; }
        pre { background: #F6F8FA; color: #111; }
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>FlowTest Studio</h1>
        <div class="subtitle">Execution Report · ${escapeHtml(report.id)}</div>
    </div>

    <div class="card status-card">
        <div>
            <div class="status ${escapeHtml(report.status)}">
                ${escapeHtml(report.status.toUpperCase())}
            </div>
            <div class="subtitle">
                ${report.executedNodes} / ${report.totalNodes} nodes executed
            </div>
        </div>
        <div>${escapeHtml(formatDuration(report.duration))}</div>
    </div>

    <div class="card">
        <div class="card-header">Execution Summary</div>
        <div class="summary">
            <div class="summary-item">
                <div class="label">Started</div>
                <div class="value">${escapeHtml(formatDate(report.startedAt))}</div>
            </div>
            <div class="summary-item">
                <div class="label">Finished</div>
                <div class="value">${escapeHtml(formatDate(report.finishedAt))}</div>
            </div>
            <div class="summary-item">
                <div class="label">Duration</div>
                <div class="value">${escapeHtml(formatDuration(report.duration))}</div>
            </div>
            <div class="summary-item">
                <div class="label">Nodes</div>
                <div class="value">${report.executedNodes}/${report.totalNodes}</div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header">Environment</div>
        <div class="environment">
            <div class="environment-item">
                <div class="label">Platform</div>
                <div class="value">${escapeHtml(environment?.platform || "—")}</div>
            </div>
            <div class="environment-item">
                <div class="label">OS Version</div>
                <div class="value">${escapeHtml(environment?.platformVersion || "—")}</div>
            </div>
            <div class="environment-item">
                <div class="label">Device</div>
                <div class="value">${escapeHtml(environment?.deviceName || "—")}</div>
            </div>
            <div class="environment-item">
                <div class="label">Automation</div>
                <div class="value">${escapeHtml(environment?.automationName || "—")}</div>
            </div>
            <div class="environment-item full">
                <div class="label">Session</div>
                <div class="value">${escapeHtml(environment?.sessionId || "No active session")}</div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header">Node Execution</div>
        ${nodesHtml || '<div class="node">No node execution data available.</div>'}
    </div>

    <div class="card">
        <div class="card-header">Execution Logs</div>
        ${logsHtml || '<div class="node">No execution logs available.</div>'}
    </div>
</div>
</body>
</html>`;
}

function escapeHtml(
    value: unknown,
): string {
    return String(value).replace(
        /[&<>"']/g,
        (character) => {
            switch (character) {
                case "&":
                    return "&amp;";
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
                case '"':
                    return "&quot;";
                case "'":
                    return "&#039;";
                default:
                    return character;
            }
        },
    );
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