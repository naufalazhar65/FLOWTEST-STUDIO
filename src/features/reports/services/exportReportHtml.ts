import type {
    TestReport,
} from "../types/TestReport";

export function exportReportHtml(
    report: TestReport,
): void {
    const html =
        createReportHtml(report);

    const blob = new Blob(
        [html],
        {
            type: "text/html;charset=utf-8",
        },
    );

    const url =
        URL.createObjectURL(blob);

    const anchor =
        document.createElement("a");

    anchor.href = url;

    anchor.download =
        `flowtest-report-${formatFileTimestamp(
            report.startedAt,
        )}.html`;

    document.body.appendChild(
        anchor,
    );

    anchor.click();

    document.body.removeChild(
        anchor,
    );

    URL.revokeObjectURL(url);
}

function createReportHtml(
    report: TestReport,
): string {
    const status = escapeHtml(
        report.status.toUpperCase(),
    );

    const statusClass =
        report.status === "passed"
            ? "passed"
            : report.status === "failed"
                ? "failed"
                : "stopped";

    const nodesHtml =
        report.nodes.length > 0
            ? report.nodes
                .map(
                    (node, index) =>
                        `
                        <tr>
                            <td class="index">
                                ${index + 1}
                            </td>

                            <td>
                                <div class="node-title">
                                    ${escapeHtml(
                            node.nodeTitle,
                        )}
                                </div>

                                <div class="node-type">
                                    ${escapeHtml(
                            node.nodeType,
                        )}
                                </div>

                                ${node.error
                            ? `
                                        <div class="node-error">
                                            ${escapeHtml(
                                node.error,
                            )}
                                        </div>
                                    `
                            : ""}

                                ${renderAssertionDetails(
                                report,
                                node,
                            )}
                            </td>

                            <td>
                                <span class="badge ${node.status}">
                                    ${escapeHtml(
                                node.status.toUpperCase(),
                            )}
                                </span>
                            </td>

                            <td class="duration">
                                ${formatDuration(
                                node.duration,
                            )}
                            </td>
                        </tr>
                    `,
                )
                .join("")
            : `
                <tr>
                    <td
                        colspan="4"
                        class="empty"
                    >
                        No node execution data available.
                    </td>
                </tr>
            `;

    const logsHtml =
        report.logs.length > 0
            ? report.logs
                .map(
                    (log) =>
                        `
                        <div class="log-row">
                            <div class="log-time">
                                ${formatTime(
                            log.timestamp,
                        )}
                            </div>

                            <div
                                class="log-level ${log.level}"
                            >
                                ${escapeHtml(
                            log.level.toUpperCase(),
                        )}
                            </div>

                            <div class="log-content">
                                <div class="log-message">
                                    ${escapeHtml(
                            log.message,
                        )}
                                </div>

                                ${log.nodeTitle
                            ? `
                                        <div class="log-node">
                                            ${escapeHtml(
                                log.nodeTitle,
                            )}
                                        </div>
                                    `
                            : ""}

                                ${renderLogDetails(
                                log.details,
                            )}
                            </div>

                            <div class="log-duration">
                                ${log.duration !==
                            undefined
                            ? formatDuration(
                                log.duration,
                            )
                            : "—"
                        }
                            </div>
                        </div>
                    `,
                )
                .join("")
            : `
                <div class="empty">
                    No execution logs available.
                </div>
            `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <title>
        FlowTest Studio - Execution Report
    </title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 40px 24px;
            background: #0d1117;
            color: #e6edf3;
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;
            line-height: 1.5;
        }

        .container {
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 28px;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo {
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            background:
                linear-gradient(
                    135deg,
                    #3b82f6,
                    #4f46e5
                );
            color: white;
            font-size: 20px;
            font-weight: 800;
        }

        h1 {
            margin: 0;
            font-size: 24px;
        }

        .subtitle {
            margin-top: 4px;
            color: #8b949e;
            font-size: 13px;
        }

        .generated {
            color: #6e7681;
            font-size: 11px;
            text-align: right;
        }

        .status {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 22px;
            margin-bottom: 16px;
            border: 1px solid #30363d;
            border-radius: 12px;
            background: #161b22;
        }

        .status-main {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .status-icon {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }

        .status-icon.passed {
            background: #3fb950;
            box-shadow:
                0 0 12px
                rgba(63, 185, 80, 0.45);
        }

        .status-icon.failed {
            background: #f85149;
            box-shadow:
                0 0 12px
                rgba(248, 81, 73, 0.45);
        }

        .status-icon.stopped {
            background: #d29922;
            box-shadow:
                0 0 12px
                rgba(210, 153, 34, 0.45);
        }

        .status-title {
            font-size: 18px;
            font-weight: 700;
        }

        .status-subtitle {
            margin-top: 3px;
            color: #8b949e;
            font-size: 12px;
        }

        .status-duration {
            color: #8b949e;
            font-size: 13px;
        }

        .card {
            margin-bottom: 16px;
            overflow: hidden;
            border: 1px solid #30363d;
            border-radius: 12px;
            background: #161b22;
        }

        .card-title {
            padding: 14px 16px;
            border-bottom: 1px solid #30363d;
            font-size: 14px;
            font-weight: 600;
        }

        .summary {
            display: grid;
            grid-template-columns:
                repeat(4, minmax(0, 1fr));
        }

        .summary-item {
            padding: 16px;
            border-right:
                1px solid #21262d;
        }

        .summary-item:last-child {
            border-right: none;
        }

        .summary-label {
            color: #8b949e;
            font-size: 11px;
        }

        .summary-value {
            margin-top: 7px;
            font-size: 13px;
            font-weight: 600;
        }

        .metrics {
            display: grid;
            grid-template-columns:
                repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 16px;
        }

        .metric {
            padding: 18px;
            border: 1px solid #30363d;
            border-radius: 12px;
            background: #161b22;
        }

        .metric-label {
            color: #8b949e;
            font-size: 11px;
        }

        .metric-value {
            margin-top: 8px;
            font-size: 24px;
            font-weight: 700;
        }

        .metric-value.executed {
            color: #58a6ff;
        }

        .metric-value.passed {
            color: #3fb950;
        }

        .metric-value.failed {
            color: #f85149;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            padding: 10px 16px;
            border-bottom:
                1px solid #30363d;
            color: #8b949e;
            font-size: 10px;
            font-weight: 600;
            text-align: left;
            text-transform: uppercase;
        }

        td {
            padding: 13px 16px;
            border-bottom:
                1px solid #21262d;
            vertical-align: middle;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .index {
            width: 50px;
            color: #6e7681;
            font-size: 11px;
        }

        .node-title {
            font-size: 13px;
            font-weight: 600;
        }

        .node-type {
            margin-top: 3px;
            color: #6e7681;
            font-size: 10px;
        }

        .node-error {
            margin-top: 7px;
            padding: 6px 8px;
            border: 1px solid #5a1e24;
            border-radius: 6px;
            background: #2d1115;
            color: #f85149;
            font-size: 10px;
        }

        .assertion-details {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #30363d;
            border-radius: 8px;
            background: #0d1117;
        }

        .assertion-title {
            margin-bottom: 8px;
            color: #e6edf3;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        .assertion-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
        }

        .assertion-item {
            min-width: 0;
            padding: 8px 9px;
            border: 1px solid #30363d;
            border-radius: 6px;
            background: #161b22;
        }

        .assertion-label {
            margin-bottom: 4px;
            color: #6e7681;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .assertion-value {
            color: #c9d1d9;
            font-size: 10px;
            line-height: 1.45;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }

        .assertion-result {
            margin-top: 8px;
            padding: 7px 9px;
            border-radius: 6px;
            font-size: 9px;
            font-weight: 700;
        }

        .assertion-result.passed {
            border: 1px solid rgba(63, 185, 80, 0.35);
            background: rgba(63, 185, 80, 0.10);
            color: #3fb950;
        }

        .assertion-result.failed {
            border: 1px solid rgba(248, 81, 73, 0.35);
            background: rgba(248, 81, 73, 0.10);
            color: #f85149;
        }

        .assertion-result.stopped {
            border: 1px solid rgba(210, 153, 34, 0.35);
            background: rgba(210, 153, 34, 0.10);
            color: #d29922;
        }

        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 9px;
            font-weight: 700;
        }

        .badge.passed {
            border:
                1px solid
                rgba(63, 185, 80, 0.35);
            background:
                rgba(63, 185, 80, 0.10);
            color: #3fb950;
        }

        .badge.failed {
            border:
                1px solid
                rgba(248, 81, 73, 0.35);
            background:
                rgba(248, 81, 73, 0.10);
            color: #f85149;
        }

        .badge.running {
            border:
                1px solid
                rgba(88, 166, 255, 0.35);
            background:
                rgba(88, 166, 255, 0.10);
            color: #58a6ff;
        }

        .badge.idle {
            border:
                1px solid
                rgba(110, 118, 129, 0.35);
            background:
                rgba(110, 118, 129, 0.10);
            color: #6e7681;
        }

        .duration {
            color: #8b949e;
            font-size: 11px;
            text-align: right;
        }

        .log-row {
            display: grid;
            grid-template-columns:
                75px
                75px
                minmax(0, 1fr)
                70px;
            gap: 12px;
            padding: 11px 16px;
            border-bottom:
                1px solid #21262d;
            align-items: start;
        }

        .log-row:last-child {
            border-bottom: none;
        }

        .log-time {
            color: #6e7681;
            font-size: 11px;
        }

        .log-level {
            font-size: 10px;
            font-weight: 700;
        }

        .log-level.info {
            color: #58a6ff;
        }

        .log-level.success {
            color: #3fb950;
        }

        .log-level.warning {
            color: #d29922;
        }

        .log-level.error {
            color: #f85149;
        }

        .log-message {
            color: #e6edf3;
            font-size: 12px;
            font-weight: 500;
        }

        .log-node {
            margin-top: 3px;
            color: #6e7681;
            font-size: 10px;
        }

        .log-duration {
            color: #8b949e;
            font-size: 11px;
            text-align: right;
        }

        .details {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 7px;
        }

        .detail {
            padding: 3px 6px;
            border: 1px solid #30363d;
            border-radius: 5px;
            background: #0d1117;
            color: #8b949e;
            font-size: 10px;
        }

        .detail strong {
            color: #c9d1d9;
        }

        .empty {
            padding: 40px;
            color: #8b949e;
            font-size: 12px;
            text-align: center;
        }

        .footer {
            padding-top: 12px;
            color: #6e7681;
            font-size: 10px;
            text-align: center;
        }

        @media (max-width: 700px) {
            body {
                padding: 20px 12px;
            }

            .header {
                flex-direction: column;
            }

            .generated {
                text-align: left;
            }

            .summary {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
            }

            .metrics {
                grid-template-columns: 1fr;
            }

            .assertion-grid {
                grid-template-columns: 1fr;
            }

            .log-row {
                grid-template-columns:
                    65px
                    65px
                    minmax(0, 1fr);
            }

            .log-duration {
                display: none;
            }

            th:nth-child(1),
            td:nth-child(1) {
                display: none;
            }
        }

        @media print {
            body {
                padding: 0;
                background: white;
                color: #111827;
            }

            .card,
            .metric,
            .status {
                break-inside: avoid;
                background: white;
                border-color: #d1d5db;
            }

            .footer {
                color: #6b7280;
            }
        }
    </style>
</head>

<body>
    <main class="container">

        <header class="header">
            <div class="brand">
                <div class="logo">
                    F
                </div>

                <div>
                    <h1>
                        FlowTest Studio
                    </h1>

                    <div class="subtitle">
                        Visual Mobile Automation IDE
                        — Execution Report
                    </div>
                </div>
            </div>

            <div class="generated">
                Generated
                <br />
                ${escapeHtml(
        formatDate(
            Date.now(),
        ),
    )}
            </div>
        </header>

        <section class="status">
            <div class="status-main">
                <div
                    class="status-icon ${statusClass}"
                ></div>

                <div>
                    <div class="status-title">
                        ${status}
                    </div>

                    <div class="status-subtitle">
                        ${report.executedNodes}
                        /
                        ${report.totalNodes}
                        nodes executed
                    </div>
                </div>
            </div>

            <div class="status-duration">
                ${formatDuration(
        report.duration,
    )}
            </div>
        </section>

        <section class="card">
            <div class="card-title">
                Execution Summary
            </div>

            <div class="summary">
                ${summaryItem(
        "Started",
        formatDate(
            report.startedAt,
        ),
    )}

                ${summaryItem(
        "Finished",
        formatDate(
            report.finishedAt,
        ),
    )}

                ${summaryItem(
        "Duration",
        formatDuration(
            report.duration,
        ),
    )}

                ${summaryItem(
        "Nodes",
        `${report.executedNodes}/${report.totalNodes}`,
    )}
            </div>
        </section>

        <section class="metrics">
            ${metric(
        "Executed",
        report.executedNodes,
        "executed",
    )}

            ${metric(
        "Passed",
        report.passedNodes,
        "passed",
    )}

            ${metric(
        "Failed",
        report.failedNodes,
        "failed",
    )}
        </section>

        <section class="card">
            <div class="card-title">
                Node Execution
            </div>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Node</th>
                        <th>Status</th>
                        <th>Duration</th>
                    </tr>
                </thead>

                <tbody>
                    ${nodesHtml}
                </tbody>
            </table>
        </section>

        <section class="card">
            <div class="card-title">
                Execution Logs
            </div>

            ${logsHtml}
        </section>

        <div class="footer">
            FlowTest Studio · Visual Mobile
            Automation IDE
        </div>

    </main>
</body>
</html>`;
}

function summaryItem(
    label: string,
    value: string,
): string {
    return `
        <div class="summary-item">
            <div class="summary-label">
                ${escapeHtml(label)}
            </div>

            <div class="summary-value">
                ${escapeHtml(value)}
            </div>
        </div>
    `;
}

function metric(
    label: string,
    value: number,
    className: string,
): string {
    return `
        <div class="metric">
            <div class="metric-label">
                ${escapeHtml(label)}
            </div>

            <div class="metric-value ${className}">
                ${value}
            </div>
        </div>
    `;
}

function renderAssertionDetails(
    report: TestReport,
    node: TestReport["nodes"][number],
): string {
    if (node.nodeType !== "assert") {
        return "";
    }

    const assertionLog =
        [...report.logs]
            .reverse()
            .find(
                (log) =>
                    log.nodeId === node.nodeId &&
                    log.details &&
                    (
                        "actual" in log.details ||
                        "expected" in log.details ||
                        "operator" in log.details
                    ),
            );

    if (!assertionLog?.details) {
        return "";
    }

    const details = assertionLog.details;

    const expected =
        "expected" in details
            ? details.expected
            : undefined;

    const actual =
        "actual" in details
            ? details.actual
            : undefined;

    const operator =
        "operator" in details
            ? details.operator
            : undefined;

    const resultClass =
        node.status === "passed"
            ? "passed"
            : node.status === "failed"
                ? "failed"
                : "stopped";

    return `
        <div class="assertion-details">
            <div class="assertion-title">
                Assertion Result
            </div>

            <div class="assertion-grid">
                ${assertionValue("Expected", expected)}
                ${assertionValue("Actual", actual)}
                ${assertionValue("Operator", operator)}
            </div>

            <div class="assertion-result ${resultClass}">
                Result:
                ${escapeHtml(
        node.status.toUpperCase(),
    )}
            </div>
        </div>
    `;
}

function assertionValue(
    label: string,
    value: unknown,
): string {
    return `
        <div class="assertion-item">
            <div class="assertion-label">
                ${escapeHtml(label)}
            </div>

            <div class="assertion-value">
                ${escapeHtml(
        formatDetailValue(value),
    )}
            </div>
        </div>
    `;
}

function renderLogDetails(
    details:
        | Record<string, unknown>
        | undefined,
): string {
    if (!details) {
        return "";
    }

    const entries =
        Object.entries(details);

    if (entries.length === 0) {
        return "";
    }

    return `
        <div class="details">
            ${entries
            .map(
                ([key, value]) =>
                    `
                        <span class="detail">
                            <strong>
                                ${escapeHtml(
                        key,
                    )}
                            </strong>
                            :
                            ${escapeHtml(
                        formatDetailValue(
                            value,
                        ),
                    )}
                        </span>
                    `,
            )
            .join("")}
        </div>
    `;
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
        typeof value === "object"
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
        return `${Math.round(
            duration,
        )}ms`;
    }

    return `${(
        duration / 1000
    ).toFixed(2)}s`;
}

function formatFileTimestamp(
    timestamp: number,
): string {
    const date =
        new Date(timestamp);

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1,
        ).padStart(2, "0");

    const day =
        String(
            date.getDate(),
        ).padStart(2, "0");

    const hours =
        String(
            date.getHours(),
        ).padStart(2, "0");

    const minutes =
        String(
            date.getMinutes(),
        ).padStart(2, "0");

    const seconds =
        String(
            date.getSeconds(),
        ).padStart(2, "0");

    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

function escapeHtml(
    value: string,
): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}