import { useState } from "react";

import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    Minus,
    XCircle,
} from "lucide-react";

import type {
    ReportNode,
    TestReport,
} from "../types/TestReport";

interface ReportComparisonProps {
    reports: TestReport[];
    onBack: () => void;
}

export function ReportComparison({
    reports,
    onBack,
}: ReportComparisonProps) {
    const [leftId, setLeftId] =
        useState<string>(
            reports[1]?.id ??
            reports[0]?.id ??
            "",
        );

    const [rightId, setRightId] =
        useState<string>(
            reports[0]?.id ?? "",
        );

    const leftReport =
        reports.find(
            (report) =>
                report.id === leftId,
        );

    const rightReport =
        reports.find(
            (report) =>
                report.id === rightId,
        );

    const comparison =
        leftReport && rightReport
            ? compareReports(
                leftReport,
                rightReport,
            )
            : null;

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
                        style={buttonStyle}
                    >
                        <ArrowLeft
                            size={17}
                        />
                    </button>

                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 22,
                                fontWeight: 700,
                            }}
                        >
                            Report Comparison
                        </h1>

                        <p
                            style={{
                                margin:
                                    "6px 0 0",
                                color:
                                    "#8B949E",
                                fontSize: 12,
                            }}
                        >
                            Compare two test
                            executions and
                            identify changes.
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: 12,
                        marginBottom: 16,
                    }}
                >
                    <ReportSelector
                        label="Previous Run"
                        value={leftId}
                        reports={reports}
                        onChange={
                            setLeftId
                        }
                    />

                    <ReportSelector
                        label="Current Run"
                        value={rightId}
                        reports={reports}
                        onChange={
                            setRightId
                        }
                    />
                </div>

                {leftReport &&
                    rightReport &&
                    comparison ? (
                    <>
                        <ComparisonSummary
                            left={leftReport}
                            right={rightReport}
                            comparison={
                                comparison
                            }
                        />

                        <NodeComparison
                            left={leftReport}
                            right={rightReport}
                        />

                        <AssertionComparison
                            left={leftReport}
                            right={rightReport}
                        />
                    </>
                ) : (
                    <div
                        style={{
                            padding: 40,
                            border:
                                "1px solid #30363D",
                            borderRadius: 12,
                            background:
                                "#161B22",
                            textAlign:
                                "center",
                            color:
                                "#8B949E",
                            fontSize: 12,
                        }}
                    >
                        Select two reports
                        to compare.
                    </div>
                )}
            </div>
        </div>
    );
}

function ReportSelector({
    label,
    value,
    reports,
    onChange,
}: {
    label: string;
    value: string;
    reports: TestReport[];
    onChange: (
        value: string,
    ) => void;
}) {
    return (
        <label
            style={{
                display: "flex",
                flexDirection:
                    "column",
                gap: 7,
                padding: 12,
                border:
                    "1px solid #30363D",
                borderRadius: 10,
                background:
                    "#161B22",
            }}
        >
            <span
                style={{
                    color: "#8B949E",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform:
                        "uppercase",
                }}
            >
                {label}
            </span>

            <select
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value,
                    )
                }
                style={{
                    width: "100%",
                    height: 34,
                    padding:
                        "0 9px",
                    border:
                        "1px solid #30363D",
                    borderRadius: 7,
                    background:
                        "#0D1117",
                    color:
                        "#E6EDF3",
                    fontSize: 11,
                    outline: "none",
                }}
            >
                {reports.map(
                    (report, index) => (
                        <option
                            key={
                                report.id
                            }
                            value={
                                report.id
                            }
                        >
                            Run #{index + 1} ·{" "}
                            {report.status.toUpperCase()} ·{" "}
                            {formatDate(
                                report.startedAt,
                            )}
                        </option>
                    ),
                )}
            </select>
        </label>
    );
}

function ComparisonSummary({
    left,
    right,
    comparison,
}: {
    left: TestReport;
    right: TestReport;
    comparison: ReturnType<
        typeof compareReports
    >;
}) {
    return (
        <div
            style={{
                marginBottom: 12,
                border:
                    "1px solid #30363D",
                borderRadius: 12,
                background:
                    "#161B22",
                overflow: "hidden",
            }}
        >
            <SectionTitle title="Execution Comparison" />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 1fr 1fr",
                }}
            >
                <div />

                <RunHeading
                    report={left}
                    label="Previous"
                />

                <RunHeading
                    report={right}
                    label="Current"
                />

                <ComparisonRow
                    label="Status"
                    left={left.status}
                    right={right.status}
                    render={renderStatus}
                />

                <ComparisonRow
                    label="Duration"
                    left={left.duration}
                    right={right.duration}
                    render={formatDuration}
                    change={
                        comparison.durationChange
                    }
                />

                <ComparisonRow
                    label="Nodes"
                    left={`${left.executedNodes}/${left.totalNodes}`}
                    right={`${right.executedNodes}/${right.totalNodes}`}
                />

                <ComparisonRow
                    label="Passed"
                    left={left.passedNodes}
                    right={right.passedNodes}
                    change={
                        right.passedNodes -
                        left.passedNodes
                    }
                />

                <ComparisonRow
                    label="Failed"
                    left={left.failedNodes}
                    right={right.failedNodes}
                    change={
                        right.failedNodes -
                        left.failedNodes
                    }
                    changeGoodWhenNegative
                />
            </div>
        </div>
    );
}

function RunHeading({
    report,
    label,
}: {
    report: TestReport;
    label: string;
}) {
    const passed =
        report.status ===
        "passed";

    const stopped =
        report.status ===
        "stopped";

    const color = passed
        ? "#3FB950"
        : stopped
            ? "#D29922"
            : "#F85149";

    return (
        <div
            style={{
                padding:
                    "12px 14px",
                borderLeft:
                    "1px solid #30363D",
                background:
                    "#0D1117",
            }}
        >
            <div
                style={{
                    color: "#6E7681",
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform:
                        "uppercase",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    marginTop: 4,
                    color,
                    fontSize: 11,
                    fontWeight: 700,
                }}
            >
                {report.status.toUpperCase()}
            </div>

            <div
                style={{
                    marginTop: 3,
                    color: "#6E7681",
                    fontSize: 9,
                }}
            >
                {formatDate(
                    report.startedAt,
                )}
            </div>
        </div>
    );
}

function ComparisonRow({
    label,
    left,
    right,
    render,
    change,
    changeGoodWhenNegative = false,
}: {
    label: string;
    left: string | number;
    right: string | number;
    render?: (
        value: string | number,
    ) => string;
    change?: number;
    changeGoodWhenNegative?: boolean;
}) {
    const leftValue =
        render ? render(left) : left;
    const rightValue =
        render ? render(right) : right;

    const changeColor =
        change === undefined ||
            change === 0
            ? "#6E7681"
            : changeGoodWhenNegative
                ? change < 0
                    ? "#3FB950"
                    : "#F85149"
                : change > 0
                    ? "#3FB950"
                    : "#F85149";

    return (
        <>
            <div
                style={{
                    padding:
                        "10px 14px",
                    borderTop:
                        "1px solid #30363D",
                    color: "#8B949E",
                    fontSize: 10,
                    fontWeight: 600,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    padding:
                        "10px 14px",
                    borderTop:
                        "1px solid #30363D",
                    borderLeft:
                        "1px solid #30363D",
                    color: "#C9D1D9",
                    fontSize: 11,
                }}
            >
                {leftValue}
            </div>

            <div
                style={{
                    padding:
                        "10px 14px",
                    borderTop:
                        "1px solid #30363D",
                    borderLeft:
                        "1px solid #30363D",
                    color: "#C9D1D9",
                    fontSize: 11,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "space-between",
                        gap: 8,
                    }}
                >
                    <span>
                        {rightValue}
                    </span>

                    {change !==
                        undefined &&
                        change !== 0 && (
                            <span
                                style={{
                                    color:
                                        changeColor,
                                    fontSize: 9,
                                    fontWeight: 700,
                                }}
                            >
                                {change > 0
                                    ? "+"
                                    : ""}
                                {render
                                    ? formatDuration(
                                        change,
                                    )
                                    : change}
                            </span>
                        )}
                </div>
            </div>
        </>
    );
}

function NodeComparison({
    left,
    right,
}: {
    left: TestReport;
    right: TestReport;
}) {
    const changes =
        compareNodes(
            left.nodes,
            right.nodes,
        );

    return (
        <div
            style={{
                marginBottom: 12,
                border:
                    "1px solid #30363D",
                borderRadius: 12,
                background:
                    "#161B22",
                overflow: "hidden",
            }}
        >
            <SectionTitle
                title={`Node Changes · ${changes.length}`}
            />

            {changes.length === 0 ? (
                <EmptyComparison message="No node changes detected." />
            ) : (
                <div>
                    {changes.map(
                        (change) => (
                            <NodeChangeRow
                                key={
                                    change.key
                                }
                                change={
                                    change
                                }
                            />
                        ),
                    )}
                </div>
            )}
        </div>
    );
}

function NodeChangeRow({
    change,
}: {
    change: NodeChange;
}) {
    const statusChanged =
        change.left?.status !==
        change.right?.status;

    const durationChanged =
        change.left &&
        change.right &&
        Math.round(
            change.left.duration,
        ) !==
        Math.round(
            change.right.duration,
        );

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "minmax(0, 1.4fr) 1fr 1fr",
                gap: 12,
                alignItems:
                    "center",
                padding:
                    "11px 14px",
                borderTop:
                    "1px solid #21262D",
            }}
        >
            <div
                style={{
                    minWidth: 0,
                }}
            >
                <div
                    style={{
                        color:
                            "#C9D1D9",
                        fontSize: 11,
                        fontWeight: 600,
                        overflow:
                            "hidden",
                        textOverflow:
                            "ellipsis",
                        whiteSpace:
                            "nowrap",
                    }}
                >
                    {change.title}
                </div>

                <div
                    style={{
                        marginTop: 3,
                        color:
                            "#6E7681",
                        fontSize: 9,
                    }}
                >
                    {change.nodeType}
                    {statusChanged
                        ? " · status changed"
                        : durationChanged
                            ? " · duration changed"
                            : " · unchanged"}
                </div>
            </div>

            <NodeStatusValue
                node={change.left}
            />

            <NodeStatusValue
                node={change.right}
            />
        </div>
    );
}

function NodeStatusValue({
    node,
}: {
    node?: ReportNode;
}) {
    if (!node) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems:
                        "center",
                    gap: 6,
                    color: "#6E7681",
                    fontSize: 10,
                }}
            >
                <Minus size={13} />
                Not present
            </div>
        );
    }

    const color =
        node.status ===
            "passed"
            ? "#3FB950"
            : node.status ===
                "failed"
                ? "#F85149"
                : "#D29922";

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems:
                        "center",
                    gap: 6,
                }}
            >
                {node.status ===
                    "passed" ? (
                    <CheckCircle2
                        size={13}
                        color={color}
                    />
                ) : node.status ===
                    "failed" ? (
                    <XCircle
                        size={13}
                        color={color}
                    />
                ) : (
                    <Clock3
                        size={13}
                        color={color}
                    />
                )}

                <span
                    style={{
                        color,
                        fontSize: 10,
                        fontWeight: 700,
                    }}
                >
                    {node.status.toUpperCase()}
                </span>
            </div>

            <div
                style={{
                    marginTop: 3,
                    color: "#6E7681",
                    fontSize: 9,
                }}
            >
                {formatDuration(
                    node.duration,
                )}
            </div>
        </div>
    );
}

function AssertionComparison({
    left,
    right,
}: {
    left: TestReport;
    right: TestReport;
}) {
    const changes =
        compareAssertions(
            left,
            right,
        );

    if (changes.length === 0) {
        return null;
    }

    return (
        <div
            style={{
                border:
                    "1px solid #30363D",
                borderRadius: 12,
                background:
                    "#161B22",
                overflow: "hidden",
            }}
        >
            <SectionTitle title="Assertion Changes" />

            {changes.map(
                (change) => (
                    <div
                        key={
                            change.key
                        }
                        style={{
                            padding:
                                "11px 14px",
                            borderTop:
                                "1px solid #21262D",
                        }}
                    >
                        <div
                            style={{
                                color:
                                    "#C9D1D9",
                                fontSize: 11,
                                fontWeight: 600,
                            }}
                        >
                            {
                                change.title
                            }
                        </div>

                        <div
                            style={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    "1fr 1fr",
                                gap: 8,
                                marginTop: 8,
                            }}
                        >
                            <AssertionSide
                                label="Previous"
                                details={
                                    change.left
                                }
                            />

                            <AssertionSide
                                label="Current"
                                details={
                                    change.right
                                }
                            />
                        </div>
                    </div>
                ),
            )}
        </div>
    );
}

function AssertionSide({
    label,
    details,
}: {
    label: string;
    details?: AssertionDetails;
}) {
    return (
        <div
            style={{
                padding: 9,
                border:
                    "1px solid #30363D",
                borderRadius: 7,
                background:
                    "#0D1117",
            }}
        >
            <div
                style={{
                    marginBottom: 6,
                    color: "#6E7681",
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform:
                        "uppercase",
                }}
            >
                {label}
            </div>

            {!details ? (
                <span
                    style={{
                        color:
                            "#6E7681",
                        fontSize: 10,
                    }}
                >
                    Not available
                </span>
            ) : (
                <div
                    style={{
                        display:
                            "flex",
                        flexDirection:
                            "column",
                        gap: 4,
                        color:
                            "#C9D1D9",
                        fontSize: 10,
                    }}
                >
                    <div>
                        Expected:{" "}
                        {formatDetail(
                            details.expected,
                        )}
                    </div>

                    <div>
                        Actual:{" "}
                        {formatDetail(
                            details.actual,
                        )}
                    </div>

                    <div>
                        Operator:{" "}
                        {formatDetail(
                            details.operator,
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function SectionTitle({
    title,
}: {
    title: string;
}) {
    return (
        <div
            style={{
                padding:
                    "12px 14px",
                borderBottom:
                    "1px solid #30363D",
                color: "#E6EDF3",
                fontSize: 12,
                fontWeight: 600,
            }}
        >
            {title}
        </div>
    );
}

function EmptyComparison({
    message,
}: {
    message: string;
}) {
    return (
        <div
            style={{
                padding: 28,
                textAlign: "center",
                color: "#6E7681",
                fontSize: 10,
            }}
        >
            {message}
        </div>
    );
}

function compareReports(
    left: TestReport,
    right: TestReport,
) {
    return {
        durationChange:
            right.duration -
            left.duration,
    };
}

interface NodeChange {
    key: string;
    title: string;
    nodeType: string;
    left?: ReportNode;
    right?: ReportNode;
}

function compareNodes(
    left: ReportNode[],
    right: ReportNode[],
): NodeChange[] {
    const map = new Map<
        string,
        NodeChange
    >();

    for (const node of left) {
        map.set(node.nodeId, {
            key: node.nodeId,
            title: node.nodeTitle,
            nodeType: node.nodeType,
            left: node,
        });
    }

    for (const node of right) {
        const current =
            map.get(node.nodeId);

        if (current) {
            current.right = node;
        } else {
            map.set(node.nodeId, {
                key: node.nodeId,
                title: node.nodeTitle,
                nodeType: node.nodeType,
                right: node,
            });
        }
    }

    return [
        ...map.values(),
    ].filter((item) => {
        if (
            !item.left ||
            !item.right
        ) {
            return true;
        }

        return (
            item.left.status !==
            item.right.status ||
            Math.round(
                item.left.duration,
            ) !==
            Math.round(
                item.right.duration,
            )
        );
    });
}

interface AssertionDetails {
    expected: unknown;
    actual: unknown;
    operator: unknown;
}

interface AssertionChange {
    key: string;
    title: string;
    left?: AssertionDetails;
    right?: AssertionDetails;
}

function compareAssertions(
    left: TestReport,
    right: TestReport,
): AssertionChange[] {
    const leftAssertions =
        getAssertionMap(left);

    const rightAssertions =
        getAssertionMap(right);

    const keys = new Set([
        ...leftAssertions.keys(),
        ...rightAssertions.keys(),
    ]);

    const changes: AssertionChange[] = [];

    for (const key of keys) {
        const previous =
            leftAssertions.get(key);

        const current =
            rightAssertions.get(key);

        if (
            JSON.stringify(
                previous,
            ) ===
            JSON.stringify(
                current,
            )
        ) {
            continue;
        }

        changes.push({
            key,
            title:
                getAssertionTitle(
                    key,
                    left,
                    right,
                ),
            left: previous,
            right: current,
        });
    }

    return changes;
}

function getAssertionMap(
    report: TestReport,
) {
    const map = new Map<
        string,
        AssertionDetails
    >();

    for (const log of report.logs) {
        if (
            log.nodeType !== "assert" ||
            !log.details
        ) {
            continue;
        }

        if (
            !(
                "actual" in
                log.details ||
                "expected" in
                log.details ||
                "operator" in
                log.details
            )
        ) {
            continue;
        }

        const key =
            log.nodeId ??
            log.nodeTitle ??
            log.id;

        map.set(key, {
            expected:
                log.details
                    .expected,
            actual:
                log.details.actual,
            operator:
                log.details.operator,
        });
    }

    return map;
}

function getAssertionTitle(
    key: string,
    left: TestReport,
    right: TestReport,
): string {
    const node =
        [
            ...left.nodes,
            ...right.nodes,
        ].find(
            (item) =>
                item.nodeId === key,
        );

    return (
        node?.nodeTitle ??
        "Assertion"
    );
}

function renderStatus(
    value: string | number,
): string {
    return String(value).toUpperCase();
}

function formatDetail(
    value: unknown,
): string {
    if (
        value === undefined ||
        value === null
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
    ).toLocaleString(
        [],
        {
            dateStyle: "short",
            timeStyle: "short",
        },
    );
}

function formatDuration(
    value: string | number,
): string {
    const duration =
        typeof value === "number"
            ? value
            : Number(value);

    const sign =
        duration < 0
            ? "-"
            : "";

    const absolute =
        Math.abs(duration);

    if (absolute < 1000) {
        return `${sign}${Math.round(
            absolute,
        )}ms`;
    }

    return `${sign}${(
        absolute / 1000
    ).toFixed(2)}s`;
}

const buttonStyle = {
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
};