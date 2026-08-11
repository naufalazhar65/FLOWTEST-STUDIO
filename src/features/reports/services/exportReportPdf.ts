import type {
    TestReport,
} from "../types/TestReport";

export function exportReportPdf(
    report: TestReport,
): void {
    const html =
        createPdfReportHtml(report);

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=1200,height=900",
        );

    if (!printWindow) {
        window.alert(
            "Unable to open print window. Please allow pop-ups for FlowTest Studio.",
        );

        return;
    }

    printWindow.document.open();

    printWindow.document.write(
        html,
    );

    printWindow.document.close();

    printWindow.focus();

    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print();
        }, 300);
    };
}

function createPdfReportHtml(
    report: TestReport,
): string {
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
                    (node, index) => `
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
                            : ""
                        }

                                ${renderAssertionDetails(
                            report,
                            node,
                        )}
                            </td>

                            <td>
                                <span
                                    class="badge ${node.status}"
                                >
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
                    (log) => `
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
                            : ""
                        }

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

        @page {
            size: A4;
            margin: 14mm;
        }

        body {
            margin: 0;
            background: #0d1117;
            color: #e6edf3;
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;
            font-size: 12px;
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
            gap: 20px;
            margin-bottom: 24px;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9px;
            background:
                linear-gradient(
                    135deg,
                    #3b82f6,
                    #4f46e5
                );
            color: #ffffff;
            font-size: 18px;
            font-weight: 800;
        }

        h1 {
            margin: 0;
            font-size: 22px;
        }

        .subtitle {
            margin-top: 3px;
            color: #8b949e;
            font-size: 11px;
        }

        .generated {
            color: #6e7681;
            font-size: 10px;
            text-align: right;
        }

        .status {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 18px;
            margin-bottom: 14px;
            border: 1px solid #30363d;
            border-radius: 10px;
            background: #161b22;
        }

        .status-main {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .status-icon {
            width: 10px;
            height: 10px;
            flex-shrink: 0;
            border-radius: 50%;
        }

        .status-icon.passed {
            background: #3fb950;
        }

        .status-icon.failed {
            background: #f85149;
        }

        .status-icon.stopped {
            background: #d29922;
        }

        .status-title {
            font-size: 16px;
            font-weight: 700;
        }

        .status-subtitle {
            margin-top: 2px;
            color: #8b949e;
            font-size: 10px;
        }

        .status-duration {
            color: #8b949e;
            font-size: 11px;
        }

        .card {
            margin-bottom: 14px;
            overflow: hidden;
            border: 1px solid #30363d;
            border-radius: 10px;
            background: #161b22;
        }

        .card-title {
            padding: 11px 14px;
            border-bottom: 1px solid #30363d;
            font-size: 12px;
            font-weight: 600;
        }

        .summary {
            display: grid;
            grid-template-columns:
                repeat(4, minmax(0, 1fr));
        }

        .summary-item {
            padding: 13px;
            border-right:
                1px solid #21262d;
        }

        .summary-item:last-child {
            border-right: none;
        }

        .summary-label {
            color: #8b949e;
            font-size: 9px;
        }

        .summary-value {
            margin-top: 5px;
            font-size: 10px;
            font-weight: 600;
        }

        .metrics {
            display: grid;
            grid-template-columns:
                repeat(3, minmax(0, 1fr));
            gap: 10px;
            margin-bottom: 14px;
        }

        .metric {
            padding: 13px;
            border: 1px solid #30363d;
            border-radius: 10px;
            background: #161b22;
        }

        .metric-label {
            color: #8b949e;
            font-size: 9px;
        }

        .metric-value {
            margin-top: 5px;
            font-size: 19px;
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
            padding: 8px 12px;
            border-bottom: 1px solid #30363d;
            color: #8b949e;
            font-size: 8px;
            font-weight: 600;
            text-align: left;
            text-transform: uppercase;
        }

        td {
            padding: 9px 12px;
            border-bottom: 1px solid #21262d;
            vertical-align: middle;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .index {
            width: 40px;
            color: #6e7681;
            font-size: 9px;
        }

        .node-title {
            font-size: 10px;
            font-weight: 600;
        }

        .node-type {
            margin-top: 2px;
            color: #6e7681;
            font-size: 8px;
        }

        .node-error {
            margin-top: 5px;
            padding: 4px 6px;
            border: 1px solid #5a1e24;
            border-radius: 5px;
            background: #2d1115;
            color: #f85149;
            font-size: 8px;
        }

        .assertion-details {
            margin-top: 7px;
            padding: 7px;
            border: 1px solid #30363d;
            border-radius: 6px;
            background: #0d1117;
        }

        .assertion-title {
            margin-bottom: 5px;
            color: #e6edf3;
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        .assertion-grid {
            display: grid;
            grid-template-columns:
                repeat(3, minmax(0, 1fr));
            gap: 5px;
        }

        .assertion-item {
            min-width: 0;
            padding: 5px 6px;
            border: 1px solid #30363d;
            border-radius: 5px;
            background: #161b22;
        }

        .assertion-label {
            margin-bottom: 2px;
            color: #6e7681;
            font-size: 7px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .assertion-value {
            color: #c9d1d9;
            font-size: 8px;
            line-height: 1.4;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }

        .assertion-result {
            margin-top: 5px;
            padding: 4px 6px;
            border-radius: 5px;
            font-size: 7px;
            font-weight: 700;
        }

        .assertion-result.passed {
            background: #193b24;
            color: #3fb950;
        }

        .assertion-result.failed {
            background: #451a1d;
            color: #f85149;
        }

        .assertion-result.stopped {
            background: #4a3512;
            color: #d29922;
        }

        .badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 999px;
            font-size: 7px;
            font-weight: 700;
        }

        .badge.passed {
            background: #193b24;
            color: #3fb950;
        }

        .badge.failed {
            background: #451a1d;
            color: #f85149;
        }

        .badge.running {
            background: #172b4d;
            color: #58a6ff;
        }

        .badge.idle {
            background: #252a31;
            color: #6e7681;
        }

        .duration {
            color: #8b949e;
            font-size: 9px;
            text-align: right;
        }

        .log-row {
            display: grid;
            grid-template-columns:
                60px
                60px
                minmax(0, 1fr)
                55px;
            gap: 8px;
            padding: 8px 12px;
            border-bottom: 1px solid #21262d;
            align-items: start;
        }

        .log-row:last-child {
            border-bottom: none;
        }

        .log-time {
            color: #6e7681;
            font-size: 8px;
        }

        .log-level {
            font-size: 8px;
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
            font-size: 9px;
        }

        .log-node {
            margin-top: 2px;
            color: #6e7681;
            font-size: 8px;
        }

        .log-duration {
            color: #8b949e;
            font-size: 8px;
            text-align: right;
        }

        .details {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 5px;
        }

        .detail {
            padding: 2px 4px;
            border: 1px solid #30363d;
            border-radius: 4px;
            background: #0d1117;
            color: #8b949e;
            font-size: 7px;
        }

        .detail strong {
            color: #c9d1d9;
        }

        .empty {
            padding: 30px;
            color: #8b949e;
            font-size: 9px;
            text-align: center;
        }

        .footer {
            padding-top: 8px;
            color: #6e7681;
            font-size: 8px;
            text-align: center;
        }

        .assertion-grid {
            break-inside: avoid;
            page-break-inside: avoid;
        }

        .assertion-details {
            break-inside: avoid;
            page-break-inside: avoid;
        }

        /*
         * PDF specific rules
         */

        .card,
        .metric,
        .status {
            break-inside: avoid;
            page-break-inside: avoid;
        }

        .metrics {
            break-inside: avoid;
            page-break-inside: avoid;
        }

        tr {
            break-inside: avoid;
            page-break-inside: avoid;
        }

        .log-row {
            break-inside: avoid;
            page-break-inside: avoid;
        }

        /*
         * Preserve the dark FlowTest Studio
         * appearance when printing.
         */

        @media print {
            body {
                background: #0d1117;
                color: #e6edf3;

                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .card,
            .metric,
            .status {
                background: #161b22;
                border-color: #30363d;
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
                        ${escapeHtml(
        report.status.toUpperCase(),
    )}
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
                ${assertionValue(
        "Expected",
        expected,
    )}

                ${assertionValue(
        "Actual",
        actual,
    )}

                ${assertionValue(
        "Operator",
        operator,
    )}
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
                ([key, value]) => `
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