import {
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

import type {
    ReportNode,
} from "../types/TestReport";

interface ReportNodeListProps {
    nodes: ReportNode[];
}

export function ReportNodeList({
    nodes,
}: ReportNodeListProps) {
    return (
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
                        "13px 16px",
                    borderBottom:
                        "1px solid #30363D",
                    fontSize: 14,
                    fontWeight: 600,
                }}
            >
                Node Execution
            </div>

            {nodes.length === 0 ? (
                <div
                    style={{
                        padding: 32,
                        textAlign:
                            "center",
                        color: "#8B949E",
                        fontSize: 12,
                    }}
                >
                    No node execution
                    data available.
                </div>
            ) : (
                nodes.map(
                    (node, index) => (
                        <NodeRow
                            key={
                                `${node.nodeId}-${index}`
                            }
                            node={
                                node
                            }
                        />
                    ),
                )
            )}
        </div>
    );
}

function NodeRow({
    node,
}: {
    node: ReportNode;
}) {
    const passed =
        node.status ===
        "passed";

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "28px minmax(0, 1fr) 90px",
                alignItems:
                    "center",
                gap: 10,
                padding:
                    "12px 16px",
                borderBottom:
                    "1px solid #21262D",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                }}
            >
                {passed ? (
                    <CheckCircle2
                        size={17}
                        color="#3FB950"
                    />
                ) : (
                    <XCircle
                        size={17}
                        color="#F85149"
                    />
                )}
            </div>

            <div
                style={{
                    minWidth: 0,
                }}
            >
                <div
                    style={{
                        color:
                            "#E6EDF3",
                        fontSize: 12,
                        fontWeight: 600,
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
                            "#6E7681",
                        fontSize: 10,
                    }}
                >
                    {node.nodeType}
                </div>

                {node.error && (
                    <div
                        style={{
                            marginTop: 6,
                            color:
                                "#F85149",
                            fontSize: 11,
                            overflow:
                                "hidden",
                            textOverflow:
                                "ellipsis",
                            whiteSpace:
                                "nowrap",
                        }}
                    >
                        {node.error}
                    </div>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "flex-end",
                    gap: 5,
                    color:
                        "#8B949E",
                    fontSize: 11,
                }}
            >
                <Clock3
                    size={13}
                />

                {formatDuration(
                    node.duration,
                )}
            </div>
        </div>
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