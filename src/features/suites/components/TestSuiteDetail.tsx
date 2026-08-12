import {
    Square,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    Printer,
    Circle,
    MoreHorizontal,
    Play,
    Pause,
    Power,
    Trash2,
    Plus,
    Settings2,
    type LucideIcon,
} from "lucide-react";

import type {
    SuiteTestCase,
    TestSuite,
} from "../types/TestSuite";

import {
    useSuiteStore,
} from "../store/useSuiteStore";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    useProjectStore,
} from "../../project/store/useProjectStore";

import {
    setActiveProject,
} from "../../project/storage/activeProject";

import {
    useWorkspaceStore,
} from "../../workspace/store/useWorkspaceStore";

import {
    useEffect,
    useState,
    useRef
} from "react";

import {
    colors,
    radius,
    typography,
} from "../../../themes";

import {
    runSuite,
    stopSuite,
} from "../services/runSuite";

import {
    ExecutionController,
} from "../../execution/services/ExecutionController";

import {
    useExecutionStore,
} from "../../execution/store/useExecutionStore";

import type {
    SuiteRunResult,
    SuiteTestCaseResult,
} from "../types/SuiteRunResult";

interface Props {
    suite: TestSuite;
    onDelete?(): void;
    onAddTest?(): void;
    onToggleTestCase?(
        testCaseId: string,
    ): void;
    onRemoveTestCase?(
        testCaseId: string,
    ): void;
}

function exportSuiteRunAsPdf(
    suite: TestSuite,
    run: SuiteRunResult,
): void {
    const escapeHtml = (
        value: unknown,
    ): string =>
        String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(
                /</g,
                "&lt;",
            )
            .replace(
                />/g,
                "&gt;",
            )
            .replace(
                /"/g,
                "&quot;",
            )
            .replace(
                /'/g,
                "&#039;",
            );

    const statusLabel =
        run.status === "passed"
            ? "PASSED"
            : run.status === "failed"
                ? "FAILED"
                : "STOPPED";

    const statusClass =
        run.status === "passed"
            ? "passed"
            : run.status === "failed"
                ? "failed"
                : "stopped";

    const resultRows =
        run.results
            .map(
                (result) => {
                    const resultLabel =
                        result.status ===
                        "passed"
                            ? "Passed"
                            : result.status ===
                                "failed"
                                ? "Failed"
                                : "Stopped";

                    const resultClass =
                        result.status ===
                        "passed"
                            ? "passed"
                            : result.status ===
                                "failed"
                                ? "failed"
                                : "stopped";

                    return `
                        <tr>
                            <td>${escapeHtml(
                                result.projectName,
                            )}</td>
                            <td>
                                <span class="status ${resultClass}">
                                    ${resultLabel}
                                </span>
                            </td>
                            <td>
                                ${escapeHtml(
                                    formatDuration(
                                        result.duration,
                                    ),
                                )}
                            </td>
                            <td>
                                ${escapeHtml(
                                    new Date(
                                        result.startedAt,
                                    ).toLocaleString(),
                                )}
                            </td>
                            <td>
                                ${escapeHtml(
                                    new Date(
                                        result.finishedAt,
                                    ).toLocaleString(),
                                )}
                            </td>
                        </tr>
                        ${
                            result.error
                                ? `
                                    <tr class="error-row">
                                        <td colspan="5">
                                            <strong>
                                                Error:
                                            </strong>
                                            ${escapeHtml(
                                                result.error,
                                            )}
                                        </td>
                                    </tr>
                                `
                                : ""
                        }
                    `;
                },
            )
            .join("");

    const reportHtml = `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8" />
                <title>
                    ${escapeHtml(
                        suite.name,
                    )} - Test Suite Report
                </title>

                <style>
                    @page {
                        size: A4;
                        margin: 18mm;
                    }

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        color: #1f2328;
                        background: #ffffff;
                        font-family:
                            -apple-system,
                            BlinkMacSystemFont,
                            "Segoe UI",
                            sans-serif;
                        font-size: 11px;
                        line-height: 1.45;
                    }

                    .header {
                        display: flex;
                        justify-content: space-between;
                        gap: 24px;
                        padding-bottom: 18px;
                        border-bottom: 2px solid #24292f;
                    }

                    .brand {
                        font-size: 18px;
                        font-weight: 700;
                    }

                    .subtitle {
                        margin-top: 3px;
                        color: #656d76;
                        font-size: 10px;
                    }

                    .run-status {
                        padding: 5px 9px;
                        border-radius: 999px;
                        font-weight: 700;
                        font-size: 10px;
                    }

                    .run-status.passed {
                        color: #1a7f37;
                        background: #dafbe1;
                    }

                    .run-status.failed {
                        color: #cf222e;
                        background: #ffebe9;
                    }

                    .run-status.stopped {
                        color: #9a6700;
                        background: #fff8c5;
                    }

                    h2 {
                        margin: 22px 0 10px;
                        font-size: 13px;
                    }

                    .summary {
                        display: grid;
                        grid-template-columns:
                            repeat(5, minmax(0, 1fr));
                        gap: 8px;
                    }

                    .card {
                        padding: 10px;
                        border: 1px solid #d0d7de;
                        border-radius: 7px;
                    }

                    .label {
                        color: #656d76;
                        font-size: 9px;
                    }

                    .value {
                        margin-top: 3px;
                        font-size: 14px;
                        font-weight: 700;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th,
                    td {
                        padding: 8px 7px;
                        border-bottom: 1px solid #d8dee4;
                        text-align: left;
                        vertical-align: top;
                    }

                    th {
                        color: #656d76;
                        background: #f6f8fa;
                        font-size: 9px;
                        text-transform: uppercase;
                    }

                    .status {
                        font-weight: 700;
                    }

                    .status.passed {
                        color: #1a7f37;
                    }

                    .status.failed {
                        color: #cf222e;
                    }

                    .status.stopped {
                        color: #9a6700;
                    }

                    .error-row td {
                        color: #cf222e;
                        background: #fff8f7;
                        font-size: 10px;
                    }

                    .meta {
                        display: grid;
                        grid-template-columns:
                            1fr 1fr;
                        gap: 8px 24px;
                        color: #656d76;
                    }

                    .meta strong {
                        color: #1f2328;
                    }

                    .footer {
                        margin-top: 28px;
                        padding-top: 10px;
                        border-top: 1px solid #d0d7de;
                        color: #656d76;
                        font-size: 9px;
                    }

                    @media print {
                        .no-print {
                            display: none !important;
                        }
                    }
                </style>
            </head>

            <body>
                <div class="header">
                    <div>
                        <div class="brand">
                            FlowTest Studio
                        </div>
                        <div class="subtitle">
                            Test Suite Execution Report
                        </div>
                    </div>

                    <div class="run-status ${statusClass}">
                        ${statusLabel}
                    </div>
                </div>

                <h2>Suite</h2>

                <div class="meta">
                    <div>
                        <strong>Name:</strong>
                        ${escapeHtml(
                            suite.name,
                        )}
                    </div>

                    <div>
                        <strong>Suite ID:</strong>
                        ${escapeHtml(
                            suite.id,
                        )}
                    </div>

                    <div>
                        <strong>Started:</strong>
                        ${escapeHtml(
                            new Date(
                                run.startedAt,
                            ).toLocaleString(),
                        )}
                    </div>

                    <div>
                        <strong>Finished:</strong>
                        ${escapeHtml(
                            new Date(
                                run.finishedAt,
                            ).toLocaleString(),
                        )}
                    </div>
                </div>

                ${
                    suite.description
                        ? `
                            <div style="margin-top: 8px; color: #656d76;">
                                ${escapeHtml(
                                    suite.description,
                                )}
                            </div>
                        `
                        : ""
                }

                <h2>Execution Summary</h2>

                <div class="summary">
                    <div class="card">
                        <div class="label">
                            Status
                        </div>
                        <div class="value">
                            ${statusLabel}
                        </div>
                    </div>

                    <div class="card">
                        <div class="label">
                            Total
                        </div>
                        <div class="value">
                            ${run.total}
                        </div>
                    </div>

                    <div class="card">
                        <div class="label">
                            Passed
                        </div>
                        <div class="value">
                            ${run.passed}
                        </div>
                    </div>

                    <div class="card">
                        <div class="label">
                            Failed
                        </div>
                        <div class="value">
                            ${run.failed}
                        </div>
                    </div>

                    <div class="card">
                        <div class="label">
                            Duration
                        </div>
                        <div class="value">
                            ${escapeHtml(
                                formatDuration(
                                    run.duration,
                                ),
                            )}
                        </div>
                    </div>
                </div>

                <h2>Test Cases</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Test Case</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Started</th>
                            <th>Finished</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${resultRows}
                    </tbody>
                </table>

                <div class="footer">
                    Generated by FlowTest Studio on
                    ${escapeHtml(
                        new Date().toLocaleString(),
                    )}
                </div>
            </body>
        </html>
    `;

    const reportBlob =
        new Blob(
            [reportHtml],
            {
                type:
                    "text/html;charset=utf-8",
            },
        );

    const reportUrl =
        URL.createObjectURL(
            reportBlob,
        );

    const reportWindow =
        window.open(
            reportUrl,
            "_blank",
            "width=1000,height=800",
        );

    if (!reportWindow) {
        URL.revokeObjectURL(
            reportUrl,
        );

        window.alert(
            "Unable to open the report window. Please allow pop-ups for FlowTest Studio.",
        );

        return;
    }

    const cleanup =
        () => {
            window.setTimeout(() => {
                URL.revokeObjectURL(
                    reportUrl,
                );
            }, 1000);
        };

    reportWindow.addEventListener(
        "load",
        () => {
            reportWindow.focus();

            window.setTimeout(() => {
                reportWindow.print();
            }, 300);

            reportWindow.addEventListener(
                "afterprint",
                () => {
                    cleanup();
                },
                {
                    once: true,
                },
            );
        },
        {
            once: true,
        },
    );

    // Fallback for browsers that do not
    // dispatch load for blob popup documents.
    window.setTimeout(() => {
        try {
            if (
                !reportWindow.closed
            ) {
                reportWindow.focus();
                reportWindow.print();
            }
        } catch {
            // The load handler will handle
            // browsers that support it.
        }

        cleanup();
    }, 1200);
}

function csvEscape(
    value: unknown,
): string {
    const text =
        value == null
            ? ""
            : String(value);

    if (
        /[",\n\r]/.test(
            text,
        )
    ) {
        return `"${text.replace(
            /"/g,
            '""',
        )}"`;
    }

    return text;
}

function exportSuiteRunAsCsv(
    suite: TestSuite,
    run: SuiteRunResult,
): void {
    const header = [
        "Suite",
        "Test Case",
        "Project ID",
        "Status",
        "Duration (ms)",
        "Started At",
        "Finished At",
        "Error",
    ];

    const rows =
        run.results.map(
            (result) => [
                suite.name,
                result.projectName,
                result.projectId,
                result.status,
                result.duration,
                new Date(
                    result.startedAt,
                ).toISOString(),
                new Date(
                    result.finishedAt,
                ).toISOString(),
                result.error ?? "",
            ],
        );

    const csv = [
        header,
        ...rows,
    ]
        .map((row) =>
            row
                .map(csvEscape)
                .join(","),
        )
        .join("\r\n");

    const blob = new Blob(
        [csv],
        {
            type:
                "text/csv;charset=utf-8",
        },
    );

    const url =
        URL.createObjectURL(blob);

    const anchor =
        document.createElement("a");

    const safeSuiteName =
        suite.name
            .trim()
            .replace(
                /[^a-z0-9]+/gi,
                "-",
            )
            .replace(
                /^-+|-+$/g,
                "",
            )
            .toLowerCase() ||
        "test-suite";

    const timestamp =
        new Date(
            run.finishedAt,
        )
            .toISOString()
            .replace(
                /[:.]/g,
                "-",
            );

    anchor.href = url;

    anchor.download =
        `${safeSuiteName}-run-${timestamp}.csv`;

    document.body.appendChild(
        anchor,
    );

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);
}

function exportSuiteRunAsJson(
    suite: TestSuite,
    run: SuiteRunResult,
): void {
    const report = {
        exportedAt:
            new Date().toISOString(),

        suite: {
            id: suite.id,
            name: suite.name,
            description:
                suite.description,
        },

        run,
    };

    const blob = new Blob(
        [
            JSON.stringify(
                report,
                null,
                4,
            ),
        ],
        {
            type:
                "application/json;charset=utf-8",
        },
    );

    const url =
        URL.createObjectURL(blob);

    const anchor =
        document.createElement("a");

    const safeSuiteName =
        suite.name
            .trim()
            .replace(
                /[^a-z0-9]+/gi,
                "-",
            )
            .replace(
                /^-+|-+$/g,
                "",
            )
            .toLowerCase() ||
        "test-suite";

    const timestamp =
        new Date(
            run.finishedAt,
        )
            .toISOString()
            .replace(
                /[:.]/g,
                "-",
            );

    anchor.href = url;

    anchor.download =
        `${safeSuiteName}-run-${timestamp}.json`;

    document.body.appendChild(
        anchor,
    );

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);
}

export function TestSuiteDetail({
    suite,
    onDelete,
    onAddTest,
    onToggleTestCase,
    onRemoveTestCase,
}: Props) {
    const enabledCount =
        suite.testCases.filter(
            (test) => test.enabled,
        ).length;

    const [suiteMenuOpen, setSuiteMenuOpen] =
        useState(false);

    const [isRunning, setIsRunning] =
        useState(false);

    const executionStatus =
        useExecutionStore(
            (state) => state.status,
        );

    const isSuitePaused =
        isRunning &&
        executionStatus ===
            "paused";

    const [
        currentTestCaseId,
        setCurrentTestCaseId,
    ] = useState<string | null>(null);

    const suiteAbortControllerRef =
        useRef<AbortController | null>(
            null,
        );

    const [suiteResult, setSuiteResult] =
        useState<SuiteRunResult | null>(
            suite.lastRun ?? null,
        );

    const [
        showRunHistory,
        setShowRunHistory,
    ] = useState(false);

    const [
        selectedRunHistory,
        setSelectedRunHistory,
    ] = useState<SuiteRunResult | null>(
        null,
    );

    const [
        showClearHistoryDialog,
        setShowClearHistoryDialog,
    ] = useState(false);

    const runHistory =
        suite.runHistory ?? [];

    const handleClearRunHistory =
        () => {
            if (
                runHistory.length ===
                0
            ) {
                return;
            }

            setShowClearHistoryDialog(
                true,
            );
        };

    const handleConfirmClearRunHistory =
        () => {
            updateSuite(
                suite.id,
                {
                    runHistory: [],
                },
            );

            setSelectedRunHistory(
                null,
            );

            setShowClearHistoryDialog(
                false,
            );

            setShowRunHistory(false);
        };

    const updateSuite =
        useSuiteStore(
            (state) => state.updateSuite,
        );

    const handleRunSuite = async () => {
        if (
            isRunning ||
            suite.testCases.filter(
                (testCase) =>
                    testCase.enabled,
            ).length === 0
        ) {
            return;
        }

        const controller =
            new AbortController();

        suiteAbortControllerRef.current =
            controller;

        setIsRunning(true);
        setSuiteResult(null);

        try {
            const result =
                await runSuite(
                    suite,
                    {
                        signal:
                            controller.signal,

                        onTestCaseStart: (
                            testCaseId,
                        ) => {
                            setCurrentTestCaseId(
                                testCaseId,
                            );
                        },

                        onTestCaseComplete: (
                            testCaseResult,
                            results,
                        ) => {
                            const partialPassed =
                                results.filter(
                                    (item) =>
                                        item.status ===
                                        "passed",
                                ).length;

                            const partialFailed =
                                results.filter(
                                    (item) =>
                                        item.status ===
                                        "failed",
                                ).length;

                            const partialStopped =
                                results.filter(
                                    (item) =>
                                        item.status ===
                                        "stopped",
                                ).length;

                            const partialFinishedAt =
                                Date.now();

                            const partialResult: SuiteRunResult =
                                {
                                    suiteId:
                                        suite.id,

                                    suiteName:
                                        suite.name,

                                    status:
                                        testCaseResult.status ===
                                        "stopped"
                                            ? "stopped"
                                            : partialFailed > 0
                                                ? "failed"
                                                : "passed",

                                    startedAt:
                                        partialFinishedAt -
                                        results.reduce(
                                            (
                                                total,
                                                item,
                                            ) =>
                                                total +
                                                item.duration,
                                            0,
                                        ),

                                    finishedAt:
                                        partialFinishedAt,

                                    duration:
                                        results.reduce(
                                            (
                                                total,
                                                item,
                                            ) =>
                                                total +
                                                item.duration,
                                            0,
                                        ),

                                    total:
                                        suite.testCases.filter(
                                            (item) =>
                                                item.enabled,
                                        ).length,

                                    passed:
                                        partialPassed,

                                    failed:
                                        partialFailed,

                                    stopped:
                                        partialStopped,

                                    results,
                                };

                            setSuiteResult(
                                partialResult,
                            );

                            updateSuite(
                                suite.id,
                                {
                                    lastRun:
                                        partialResult,
                                },
                            );
                        },
                    },
                );

            setSuiteResult(result);

            updateSuite(
                suite.id,
                {
                    lastRun: result,

                    runHistory: [
                        result,
                        ...(suite.runHistory ??
                            []),
                    ].slice(0, 20),
                },
            );
        } catch (error) {
            console.error(
                "Failed to run suite:",
                error,
            );
        } finally {
            suiteAbortControllerRef.current =
                null;

            setCurrentTestCaseId(null);

            setIsRunning(false);
        }
    };

    const handlePauseSuite = () => {
        if (
            !isRunning ||
            isSuitePaused
        ) {
            return;
        }

        ExecutionController.pause();
    };

    const handleResumeSuite = () => {
        if (
            !isRunning ||
            !isSuitePaused
        ) {
            return;
        }

        ExecutionController.resume();
    };

    const handleStopSuite = () => {
        if (!isRunning) {
            return;
        }

        suiteAbortControllerRef.current?.abort();

        stopSuite();
    };

    const handleOpenTestCase = (
        testCase: SuiteTestCase,
    ) => {
        useFlowStore
            .getState()
            .loadProject(
                testCase.project,
            );

        useProjectStore
            .getState()
            .setProjectName(
                `${testCase.project.name}.flow`,
            );

        useProjectStore
            .getState()
            .setFileHandle(null);

        useProjectStore
            .getState()
            .markSaved();

        setActiveProject(
            testCase.project,
        );

        useWorkspaceStore
            .getState()
            .openWorkspace();
    };

    useEffect(() => {
        if (!suiteMenuOpen) {
            return;
        }

        const handlePointerDown = (
            event: PointerEvent,
        ) => {
            const target = event.target;

            if (
                target instanceof Element &&
                target.closest(
                    '[data-suite-menu="true"]',
                )
            ) {
                return;
            }

            setSuiteMenuOpen(false);
        };

        document.addEventListener(
            "pointerdown",
            handlePointerDown,
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown,
            );
        };
    }, [suiteMenuOpen]);

    useEffect(() => {
        setSuiteMenuOpen(false);
        setShowRunHistory(false);
        setSelectedRunHistory(null);
        setSuiteResult(
            suite.lastRun ?? null,
        );
    }, [
        suite.id,
        suite.lastRun,
    ]);

    useEffect(() => {
        return () => {
            suiteAbortControllerRef
                .current
                ?.abort();
        };
    }, []);

    return (
        <main
            style={{
                height: "100%",
                minWidth: 0,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                background: colors.background,
                overflow: "hidden",
            }}
        >
            <header
                style={{
                    padding: "18px 20px 16px",
                    borderBottom:
                        `1px solid ${colors.border}`,
                    flexShrink: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 20,
                    }}
                >
                    <div style={{ minWidth: 0 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 7,
                                    background:
                                        colors.panelHover,
                                    color: colors.accent,
                                }}
                            >
                                <Settings2 size={15} />
                            </div>

                            <h2
                                style={{
                                    margin: 0,
                                    ...typography.subtitle,
                                    color: colors.text,
                                    fontSize: 16,
                                    fontWeight: 650,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {suite.name}
                            </h2>
                        </div>

                        {suite.description && (
                            <p
                                style={{
                                    margin:
                                        "8px 0 0 36px",
                                    color:
                                        colors.textSecondary,
                                    fontSize: 12,
                                    lineHeight: 1.5,
                                }}
                            >
                                {suite.description}
                            </p>
                        )}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            flexShrink: 0,
                        }}
                    >
                        <div
                            data-suite-menu="true"
                            style={{
                                position: "relative",
                            }}
                        >
                            <button
                                type="button"
                                aria-label="More suite actions"
                                aria-expanded={
                                    suiteMenuOpen
                                }
                                onClick={() =>
                                    setSuiteMenuOpen(
                                        (open) => !open,
                                    )
                                }
                                style={{
                                    width: 34,
                                    height: 34,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "center",
                                    border:
                                        `1px solid ${suiteMenuOpen
                                            ? colors.border
                                            : colors.border
                                        }`,
                                    borderRadius:
                                        radius.md,
                                    background:
                                        suiteMenuOpen
                                            ? colors.panelHover
                                            : colors.panel,
                                    color: colors.text,
                                    cursor: "pointer",
                                }}
                            >
                                <MoreHorizontal size={15} />
                            </button>

                            {suiteMenuOpen && (
                                <div
                                    role="menu"
                                    style={{
                                        position:
                                            "absolute",
                                        top:
                                            "calc(100% + 6px)",
                                        right: 0,
                                        zIndex: 100,
                                        width: 176,
                                        padding: 5,
                                        border:
                                            `1px solid ${colors.border}`,
                                        borderRadius:
                                            radius.md,
                                        background:
                                            colors.panel,
                                        boxShadow:
                                            "0 14px 35px rgba(0,0,0,.35)",
                                    }}
                                >
                                    <MenuButton
                                        icon={Trash2}
                                        label="Delete suite"
                                        danger
                                        onClick={() => {
                                            setSuiteMenuOpen(
                                                false,
                                            );
                                            onDelete?.();
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {!isRunning ? (
                            <button
                                type="button"
                                onClick={() => {
                                    void handleRunSuite();
                                }}
                                disabled={
                                    enabledCount ===
                                    0
                                }
                                title={
                                    enabledCount ===
                                    0
                                        ? "Add and enable at least one test case."
                                        : ""
                                }
                                style={{
                                    height: 34,
                                    display:
                                        "inline-flex",
                                    alignItems:
                                        "center",
                                    gap: 7,
                                    padding:
                                        "0 13px",
                                    border:
                                        "1px solid transparent",
                                    borderRadius:
                                        radius.md,
                                    background:
                                        colors.success,
                                    color:
                                        "#FFFFFF",
                                    cursor:
                                        enabledCount ===
                                        0
                                            ? "not-allowed"
                                            : "pointer",
                                    opacity:
                                        enabledCount ===
                                        0
                                            ? 0.5
                                            : 1,
                                    fontSize: 12,
                                    fontWeight: 650,
                                }}
                            >
                                <Play
                                    size={14}
                                    fill="currentColor"
                                />
                                Run Suite
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={
                                        isSuitePaused
                                            ? handleResumeSuite
                                            : handlePauseSuite
                                    }
                                    style={{
                                        height: 34,
                                        display:
                                            "inline-flex",
                                        alignItems:
                                            "center",
                                        gap: 7,
                                        padding:
                                            "0 13px",
                                        border:
                                            `1px solid ${colors.border}`,
                                        borderRadius:
                                            radius.md,
                                        background:
                                            colors.panel,
                                        color:
                                            colors.text,
                                        cursor:
                                            "pointer",
                                        fontSize: 12,
                                        fontWeight: 650,
                                    }}
                                >
                                    {isSuitePaused ? (
                                        <Play
                                            size={14}
                                            fill="currentColor"
                                        />
                                    ) : (
                                        <Pause
                                            size={14}
                                        />
                                    )}

                                    {isSuitePaused
                                        ? "Resume Suite"
                                        : "Pause Suite"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleStopSuite
                                    }
                                    style={{
                                        height: 34,
                                        display:
                                            "inline-flex",
                                        alignItems:
                                            "center",
                                        gap: 7,
                                        padding:
                                            "0 13px",
                                        border:
                                            "1px solid transparent",
                                        borderRadius:
                                            radius.md,
                                        background:
                                            "#F85149",
                                        color:
                                            "#FFFFFF",
                                        cursor:
                                            "pointer",
                                        fontSize: 12,
                                        fontWeight: 650,
                                    }}
                                >
                                    <Square
                                        size={14}
                                        fill="currentColor"
                                    />
                                    Stop Suite
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        marginTop: 16,
                        marginLeft: 36,
                    }}
                >
                    <Stat
                        label="Test Cases"
                        value={suite.testCases.length}
                    />

                    <Stat
                        label="Enabled"
                        value={enabledCount}
                    />

                    <Stat
                        label="Updated"
                        value={formatDate(
                            suite.updatedAt,
                        )}
                    />
                </div>
            </header>

            {isSuitePaused && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding:
                            "8px 20px",
                        borderBottom:
                            `1px solid ${colors.border}`,
                        background:
                            colors.panel,
                        color:
                            colors.textMuted,
                        fontSize: 10,
                        fontWeight: 650,
                        flexShrink: 0,
                    }}
                >
                    <Pause size={12} />
                    Suite paused. Resume to continue
                    the current test case.
                </div>
            )}

            {suiteResult && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        gap: 12,
                        padding:
                            "9px 20px",
                        borderBottom:
                            `1px solid ${colors.border}`,
                        background:
                            colors.panel,
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 10,
                            minWidth: 0,
                        }}
                    >
                        <span
                            style={{
                                color:
                                    suiteResult.status ===
                                        "passed"
                                        ? colors.success
                                        : "#F85149",
                                fontSize: 11,
                                fontWeight: 700,
                            }}
                        >
                            {suiteResult.status ===
                                "passed"
                                ? "Suite passed"
                                : "Suite failed"}
                        </span>

                        <span
                            style={{
                                color:
                                    colors.textMuted,
                                fontSize: 10,
                            }}
                        >
                            {suiteResult.passed} passed
                            {" · "}
                            {suiteResult.failed} failed
                            {" · "}
                            {suiteResult.total} total
                        </span>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 10,
                            flexShrink: 0,
                        }}
                    >
                        <span
                            style={{
                                color:
                                    colors.textMuted,
                                fontSize: 10,
                            }}
                        >
                            {formatDuration(
                                suiteResult.duration,
                            )}
                        </span>

                        {runHistory.length >
                            0 && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowRunHistory(
                                        (
                                            value,
                                        ) =>
                                            !value,
                                    )
                                }
                                style={{
                                    border: "none",
                                    background:
                                        "transparent",
                                    color:
                                        colors.textMuted,
                                    cursor:
                                        "pointer",
                                    fontSize: 10,
                                    padding:
                                        "2px 0",
                                }}
                            >
                                {showRunHistory
                                    ? "Hide History"
                                    : "Run History"}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {showRunHistory && (
                <div
                    style={{
                        borderBottom:
                            `1px solid ${colors.border}`,
                        background:
                            colors.panel,
                        padding:
                            "10px 20px",
                    }}
                >
                    <div
                        style={{
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "space-between",
                            gap: 10,
                            marginBottom: 8,
                        }}
                    >
                        <div
                            style={{
                                color:
                                    colors.textMuted,
                                fontSize: 10,
                                fontWeight: 650,
                            }}
                        >
                            Run History
                        </div>

                        {runHistory.length >
                            0 && (
                            <button
                                type="button"
                                onClick={
                                    handleClearRunHistory
                                }
                                style={{
                                    border:
                                        "none",
                                    background:
                                        "transparent",
                                    color:
                                        "#F85149",
                                    cursor:
                                        "pointer",
                                    padding:
                                        "2px 0",
                                    fontSize:
                                        10,
                                    fontWeight:
                                        650,
                                }}
                            >
                                Clear History
                            </button>
                        )}
                    </div>

                    {runHistory.length ===
                    0 ? (
                        <div
                            style={{
                                color:
                                    colors.textMuted,
                                fontSize: 10,
                            }}
                        >
                            No runs yet.
                        </div>
                    ) : (
                        <div
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap: 5,
                                maxHeight:
                                    180,
                                overflowY:
                                    "auto",
                            }}
                        >
                            {runHistory.map(
                                (
                                    run,
                                    index,
                                ) => (
                                    <button
                                        key={`${run.finishedAt}-${index}`}
                                        type="button"
                                        onClick={() =>
                                            setSelectedRunHistory(
                                                run,
                                            )
                                        }
                                        style={{
                                            width:
                                                "100%",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "space-between",
                                            gap: 12,
                                            padding:
                                                "7px 8px",
                                            border:
                                                "none",
                                            borderRadius:
                                                radius.sm,
                                            background:
                                                "transparent",
                                            color:
                                                colors.text,
                                            cursor:
                                                "pointer",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap: 8,
                                                minWidth: 0,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color:
                                                        run.status ===
                                                        "passed"
                                                            ? colors.success
                                                            : run.status ===
                                                                "failed"
                                                                ? "#F85149"
                                                                : "#D29922",
                                                    fontSize:
                                                        10,
                                                    fontWeight:
                                                        650,
                                                }}
                                            >
                                                {run.status ===
                                                "passed"
                                                    ? "Passed"
                                                    : run.status ===
                                                        "failed"
                                                        ? "Failed"
                                                        : "Stopped"}
                                            </span>

                                            <span
                                                style={{
                                                    color:
                                                        colors.textMuted,
                                                    fontSize:
                                                        10,
                                                }}
                                            >
                                                {run.passed} passed
                                                {" · "}
                                                {run.failed} failed
                                                {" · "}
                                                {run.stopped} stopped
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap: 8,
                                                color:
                                                    colors.textMuted,
                                                fontSize:
                                                    10,
                                                flexShrink:
                                                    0,
                                            }}
                                        >
                                            <span>
                                                {formatDuration(
                                                    run.duration,
                                                )}
                                            </span>

                                            <span>
                                                {formatDate(
                                                    new Date(
                                                        run.finishedAt,
                                                    ).toISOString(),
                                                )}
                                            </span>
                                        </div>
                                    </button>
                                ),
                            )}
                        </div>
                    )}
                </div>
            )}

            {showClearHistoryDialog && (
                <div
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setShowClearHistoryDialog(
                                false,
                            );
                        }
                    }}
                    style={{
                        position:
                            "absolute",
                        inset: 0,
                        zIndex: 40,
                        display:
                            "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        padding: 24,
                        background:
                            "rgba(0, 0, 0, 0.55)",
                        backdropFilter:
                            "blur(4px)",
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="clear-history-title"
                        style={{
                            width:
                                "min(420px, 100%)",
                            border:
                                `1px solid ${colors.border}`,
                            borderRadius:
                                radius.lg,
                            background:
                                colors.background,
                            boxShadow:
                                "0 24px 80px rgba(0, 0, 0, 0.5)",
                            overflow:
                                "hidden",
                        }}
                    >
                        <div
                            style={{
                                padding:
                                    "18px 18px 14px",
                            }}
                        >
                            <div
                                id="clear-history-title"
                                style={{
                                    color:
                                        colors.text,
                                    fontSize:
                                        13,
                                    fontWeight:
                                        700,
                                }}
                            >
                                Clear Run History?
                            </div>

                            <div
                                style={{
                                    marginTop:
                                        7,
                                    color:
                                        colors.textMuted,
                                    fontSize:
                                        11,
                                    lineHeight:
                                        1.5,
                                }}
                            >
                                This will permanently
                                remove{" "}
                                <strong
                                    style={{
                                        color:
                                            colors.text,
                                    }}
                                >
                                    {runHistory.length}{" "}
                                    {runHistory.length ===
                                    1
                                        ? "run"
                                        : "runs"}
                                </strong>{" "}
                                from this suite's
                                run history.
                                <br />
                                The Last Run result
                                will remain available.
                            </div>
                        </div>

                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "flex-end",
                                gap: 8,
                                padding:
                                    "12px 18px",
                                borderTop:
                                    `1px solid ${colors.border}`,
                                background:
                                    colors.panel,
                            }}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setShowClearHistoryDialog(
                                        false,
                                    )
                                }
                                style={{
                                    height:
                                        32,
                                    padding:
                                        "0 12px",
                                    border:
                                        `1px solid ${colors.border}`,
                                    borderRadius:
                                        radius.sm,
                                    background:
                                        colors.background,
                                    color:
                                        colors.text,
                                    cursor:
                                        "pointer",
                                    fontSize:
                                        11,
                                    fontWeight:
                                        650,
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleConfirmClearRunHistory
                                }
                                style={{
                                    height:
                                        32,
                                    padding:
                                        "0 12px",
                                    border:
                                        "1px solid transparent",
                                    borderRadius:
                                        radius.sm,
                                    background:
                                        "#F85149",
                                    color:
                                        "#FFFFFF",
                                    cursor:
                                        "pointer",
                                    fontSize:
                                        11,
                                    fontWeight:
                                        650,
                                }}
                            >
                                Clear History
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedRunHistory && (
                <div
                    style={{
                        position:
                            "absolute",
                        inset: 0,
                        zIndex: 30,
                        display:
                            "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        padding: 24,
                        background:
                            "rgba(0, 0, 0, 0.45)",
                        backdropFilter:
                            "blur(4px)",
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        style={{
                            width:
                                "min(680px, 100%)",
                            maxHeight:
                                "min(620px, 90vh)",
                            display:
                                "flex",
                            flexDirection:
                                "column",
                            overflow:
                                "hidden",
                            border:
                                `1px solid ${colors.border}`,
                            borderRadius:
                                radius.lg,
                            background:
                                colors.background,
                            boxShadow:
                                "0 24px 80px rgba(0, 0, 0, 0.45)",
                        }}
                    >
                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                padding:
                                    "16px 18px",
                                borderBottom:
                                    `1px solid ${colors.border}`,
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        color:
                                            colors.text,
                                        fontSize:
                                            13,
                                        fontWeight:
                                            700,
                                    }}
                                >
                                    Run Details
                                </div>

                                <div
                                    style={{
                                        marginTop:
                                            3,
                                        color:
                                            colors.textMuted,
                                        fontSize:
                                            10,
                                    }}
                                >
                                    {formatDate(
                                        new Date(
                                            selectedRunHistory.finishedAt,
                                        ).toISOString(),
                                    )}
                                </div>
                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 6,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        exportSuiteRunAsPdf(
                                            suite,
                                            selectedRunHistory,
                                        )
                                    }
                                    title="Export run as PDF"
                                    style={{
                                        height:
                                            28,
                                        display:
                                            "inline-flex",
                                        alignItems:
                                            "center",
                                        gap: 6,
                                        padding:
                                            "0 9px",
                                        border:
                                            `1px solid ${colors.border}`,
                                        borderRadius:
                                            radius.sm,
                                        background:
                                            colors.panel,
                                        color:
                                            colors.text,
                                        cursor:
                                            "pointer",
                                        fontSize:
                                            10,
                                        fontWeight:
                                            650,
                                    }}
                                >
                                    <Printer
                                        size={12}
                                    />
                                    PDF
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        exportSuiteRunAsJson(
                                            suite,
                                            selectedRunHistory,
                                        )
                                    }
                                    title="Export run as JSON"
                                    style={{
                                        height:
                                            28,
                                        display:
                                            "inline-flex",
                                        alignItems:
                                            "center",
                                        gap: 6,
                                        padding:
                                            "0 9px",
                                        border:
                                            `1px solid ${colors.border}`,
                                        borderRadius:
                                            radius.sm,
                                        background:
                                            colors.panel,
                                        color:
                                            colors.text,
                                        cursor:
                                            "pointer",
                                        fontSize:
                                            10,
                                        fontWeight:
                                            650,
                                    }}
                                >
                                    <Download
                                        size={12}
                                    />
                                    JSON
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        exportSuiteRunAsCsv(
                                            suite,
                                            selectedRunHistory,
                                        )
                                    }
                                    title="Export run as CSV"
                                    style={{
                                        height:
                                            28,
                                        display:
                                            "inline-flex",
                                        alignItems:
                                            "center",
                                        gap: 6,
                                        padding:
                                            "0 9px",
                                        border:
                                            `1px solid ${colors.border}`,
                                        borderRadius:
                                            radius.sm,
                                        background:
                                            colors.panel,
                                        color:
                                            colors.text,
                                        cursor:
                                            "pointer",
                                        fontSize:
                                            10,
                                        fontWeight:
                                            650,
                                    }}
                                >
                                    <FileSpreadsheet
                                        size={12}
                                    />
                                    CSV
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedRunHistory(
                                            null,
                                        )
                                    }
                                    style={{
                                        width:
                                            28,
                                        height:
                                            28,
                                        display:
                                            "inline-flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        border:
                                            "none",
                                        borderRadius:
                                            radius.sm,
                                        background:
                                            "transparent",
                                        color:
                                            colors.textMuted,
                                        cursor:
                                            "pointer",
                                        fontSize:
                                            18,
                                        lineHeight:
                                            1,
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div
                            style={{
                                overflowY:
                                    "auto",
                                padding:
                                    18,
                            }}
                        >
                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "repeat(4, minmax(0, 1fr))",
                                    gap: 8,
                                    marginBottom:
                                        18,
                                }}
                            >
                                {[
                                    [
                                        "Status",
                                        formatTestCaseStatus(
                                            selectedRunHistory
                                                .status,
                                        ),
                                    ],
                                    [
                                        "Total",
                                        String(
                                            selectedRunHistory.total,
                                        ),
                                    ],
                                    [
                                        "Passed",
                                        String(
                                            selectedRunHistory.passed,
                                        ),
                                    ],
                                    [
                                        "Failed",
                                        String(
                                            selectedRunHistory.failed,
                                        ),
                                    ],
                                ].map(
                                    ([
                                        label,
                                        value,
                                    ]) => (
                                        <div
                                            key={
                                                label
                                            }
                                            style={{
                                                padding:
                                                    "10px 11px",
                                                border:
                                                    `1px solid ${colors.border}`,
                                                borderRadius:
                                                    radius.md,
                                                background:
                                                    colors.panel,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    color:
                                                        colors.textMuted,
                                                    fontSize:
                                                        9,
                                                }}
                                            >
                                                {
                                                    label
                                                }
                                            </div>

                                            <div
                                                style={{
                                                    marginTop:
                                                        4,
                                                    color:
                                                        label ===
                                                        "Status"
                                                            ? selectedRunHistory.status ===
                                                                "passed"
                                                                ? colors.success
                                                                : selectedRunHistory.status ===
                                                                    "failed"
                                                                    ? "#F85149"
                                                                    : "#D29922"
                                                            : colors.text,
                                                    fontSize:
                                                        12,
                                                    fontWeight:
                                                        700,
                                                }}
                                            >
                                                {
                                                    value
                                                }
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    marginBottom:
                                        8,
                                    color:
                                        colors.textMuted,
                                    fontSize:
                                        10,
                                }}
                            >
                                <span>
                                    Duration
                                </span>

                                <span>
                                    {formatDuration(
                                        selectedRunHistory.duration,
                                    )}
                                </span>
                            </div>

                            <div
                                style={{
                                    marginTop:
                                        16,
                                    marginBottom:
                                        8,
                                    color:
                                        colors.text,
                                    fontSize:
                                        11,
                                    fontWeight:
                                        700,
                                }}
                            >
                                Test Cases
                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    flexDirection:
                                        "column",
                                    gap: 6,
                                }}
                            >
                                {selectedRunHistory.results.map(
                                    (
                                        result,
                                    ) => (
                                        <div
                                            key={
                                                result.testCaseId
                                            }
                                            style={{
                                                padding:
                                                    "9px 10px",
                                                border:
                                                    `1px solid ${colors.border}`,
                                                borderRadius:
                                                    radius.md,
                                                background:
                                                    colors.panel,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 10,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color:
                                                            colors.text,
                                                        fontSize:
                                                            11,
                                                        fontWeight:
                                                            650,
                                                    }}
                                                >
                                                    {
                                                        result.projectName
                                                    }
                                                </span>

                                                <span
                                                    style={{
                                                        color:
                                                            result.status ===
                                                            "passed"
                                                                ? colors.success
                                                                : result.status ===
                                                                    "failed"
                                                                    ? "#F85149"
                                                                    : "#D29922",
                                                        fontSize:
                                                            10,
                                                        fontWeight:
                                                            650,
                                                    }}
                                                >
                                                    {formatTestCaseStatus(
                                                        result.status,
                                                    )}
                                                </span>
                                            </div>

                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: 10,
                                                    marginTop:
                                                        4,
                                                    color:
                                                        colors.textMuted,
                                                    fontSize:
                                                        9,
                                                }}
                                            >
                                                <span>
                                                    {formatDuration(
                                                        result.duration,
                                                    )}
                                                </span>

                                                <span>
                                                    {formatDate(
                                                        new Date(
                                                            result.finishedAt,
                                                        ).toISOString(),
                                                    )}
                                                </span>
                                            </div>

                                            {result.error && (
                                                <div
                                                    style={{
                                                        marginTop:
                                                            6,
                                                        padding:
                                                            "6px 7px",
                                                        borderRadius:
                                                            radius.sm,
                                                        background:
                                                            "rgba(248, 81, 73, 0.08)",
                                                        color:
                                                            "#F85149",
                                                        fontSize:
                                                            9,
                                                        lineHeight:
                                                            1.4,
                                                    }}
                                                >
                                                    {
                                                        result.error
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    padding: 20,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 10,
                    }}
                >
                    <div>
                        <div
                            style={{
                                color: colors.text,
                                fontSize: 12,
                                fontWeight: 650,
                            }}
                        >
                            Test Cases
                        </div>

                        <div
                            style={{
                                marginTop: 3,
                                color: colors.textMuted,
                                fontSize: 10,
                            }}
                        >
                            Flows included in this suite
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onAddTest}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            height: 30,
                            padding: "0 10px",
                            border:
                                `1px solid ${colors.border}`,
                            borderRadius: radius.md,
                            background: colors.panel,
                            color: colors.textSecondary,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                        }}
                    >
                        <Plus size={13} />
                        Add Test
                    </button>
                </div>

                {suite.testCases.length > 0 ? (
                    <div
                        style={{
                            border:
                                `1px solid ${colors.border}`,
                            borderRadius: radius.lg,
                            overflow: "visible",
                            background: colors.panel,
                        }}
                    >
                        {suite.testCases.map(
                            (test, index) => (
                                <TestCaseRow
                                    key={test.id}
                                    test={test}
                                    index={index}
                                    result={
                                        suiteResult?.results.find(
                                            (result) =>
                                                result.testCaseId ===
                                                test.id,
                                        )
                                    }
                                    isRunning={
                                        isRunning
                                    }
                                    isCurrent={
                                        currentTestCaseId ===
                                        test.id
                                    }
                                    onOpen={() =>
                                        handleOpenTestCase(
                                            test,
                                        )
                                    }
                                    onToggle={() =>
                                        onToggleTestCase?.(
                                            test.id,
                                        )
                                    }
                                    onRemove={() =>
                                        onRemoveTestCase?.(
                                            test.id,
                                        )
                                    }
                                />
                            ),
                        )}
                    </div>
                ) : (
                    <div
                        style={{
                            minHeight: 220,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 32,
                            border:
                                `1px dashed ${colors.border}`,
                            borderRadius: radius.lg,
                            background: colors.panel,
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 38,
                                height: 38,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 10,
                                background:
                                    colors.panelHover,
                                color: colors.textMuted,
                            }}
                        >
                            <Plus size={18} />
                        </div>

                        <div
                            style={{
                                marginTop: 12,
                                color: colors.text,
                                fontSize: 13,
                                fontWeight: 650,
                            }}
                        >
                            No test cases
                        </div>

                        <div
                            style={{
                                maxWidth: 320,
                                marginTop: 5,
                                color: colors.textMuted,
                                fontSize: 11,
                                lineHeight: 1.5,
                            }}
                        >
                            Add flows to this suite to
                            run them together.
                        </div>

                        <button
                            type="button"
                            onClick={onAddTest}
                            style={{
                                marginTop: 14,
                                height: 32,
                                padding: "0 11px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                border:
                                    `1px solid ${colors.border}`,
                                borderRadius: radius.md,
                                background:
                                    colors.panelHover,
                                color: colors.text,
                                cursor: "pointer",
                                fontSize: 11,
                                fontWeight: 600,
                            }}
                        >
                            <Plus size={13} />
                            Add Test Case
                        </button>
                    </div>
                )}
            </div>

            <footer
                style={{
                    minHeight: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px",
                    borderTop:
                        `1px solid ${colors.border}`,
                    background: colors.panel,
                    flexShrink: 0,
                }}
            >
                <span
                    style={{
                        color: colors.textMuted,
                        fontSize: 10,
                    }}
                >
                    Suite ID: {suite.id}
                </span>

                <button
                    type="button"
                    onClick={onDelete}
                    style={{
                        border: "none",
                        background: "transparent",
                        color: "#F85149",
                        cursor: "pointer",
                        fontSize: 10,
                        fontWeight: 600,
                    }}
                >
                    Delete Suite
                </button>
            </footer>
        </main>
    );
}

interface TestCaseRowProps {
    test: {
        id: string;
        projectName: string;
        enabled: boolean;
    };

    index: number;

    result?: SuiteTestCaseResult;

    isRunning: boolean;

    isCurrent: boolean;

    onOpen(): void;

    onToggle(): void;

    onRemove(): void;
}

function TestCaseRow({
    test,
    index,
    result,
    isRunning,
    isCurrent,
    onOpen,
    onToggle,
    onRemove,
}: TestCaseRowProps) {
    const [menuOpen, setMenuOpen] =
        useState(false);

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const handlePointerDown = (
            event: PointerEvent,
        ) => {
            const target = event.target;

            if (
                target instanceof Element &&
                target.closest(
                    '[data-test-case-menu="true"]',
                )
            ) {
                return;
            }

            setMenuOpen(false);
        };

        document.addEventListener(
            "pointerdown",
            handlePointerDown,
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown,
            );
        };
    }, [menuOpen]);

    return (
        <div
            style={{
                minHeight: 64,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderBottom:
                    `1px solid ${colors.border}`,
                opacity: test.enabled ? 1 : 0.5,
            }}
        >
            <div
                style={{
                    width: 24,
                    color: colors.textMuted,
                    fontSize: 10,
                    textAlign: "center",
                    fontVariantNumeric:
                        "tabular-nums",
                }}
            >
                {String(index + 1).padStart(2, "0")}
            </div>

            {test.enabled ? (
                <CheckCircle2
                    size={16}
                    color={colors.success}
                />
            ) : (
                <Circle
                    size={16}
                    color={colors.textMuted}
                />
            )}

            <button
                type="button"
                onClick={onOpen}
                aria-label={`Open ${test.projectName}`}
                style={{
                    minWidth: 0,
                    flex: 1,
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                    textAlign: "left",
                }}
            >
                <div
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: colors.text,
                        fontSize: 12,
                        fontWeight: 600,
                    }}
                >
                    {test.projectName}
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginTop: 3,
                        minWidth: 0,
                    }}
                >
                    <span
                        style={{
                            color: colors.textMuted,
                            fontSize: 10,
                        }}
                    >
                        Flow project
                    </span>

                    {result ? (
                        <>
                            <span
                                style={{
                                    color: colors.border,
                                    fontSize: 9,
                                }}
                            >
                                ·
                            </span>

                            <span
                                style={{
                                    color:
                                        result.status ===
                                        "passed"
                                            ? colors.success
                                            : result.status ===
                                                "failed"
                                                ? "#F85149"
                                                : "#D29922",
                                    fontSize: 10,
                                    fontWeight: 650,
                                }}
                            >
                                {formatTestCaseStatus(
                                    result.status,
                                )}
                            </span>

                            <span
                                style={{
                                    color:
                                        colors.textMuted,
                                    fontSize: 10,
                                }}
                            >
                                {formatDuration(
                                    result.duration,
                                )}
                            </span>
                        </>
                    ) : isRunning ? (
                        <>
                            <span
                                style={{
                                    color: colors.border,
                                    fontSize: 9,
                                }}
                            >
                                ·
                            </span>

                            <span
                                style={{
                                    color: isCurrent
                                        ? colors.accent
                                        : colors.textMuted,
                                    fontSize: 10,
                                    fontWeight: 650,
                                }}
                            >
                                {isCurrent
                                    ? "Running..."
                                    : "Pending"}
                            </span>
                        </>
                    ) : null}
                </div>
                {result?.status === "failed" &&
                    result.error && (
                        <div
                            title={result.error}
                            style={{
                                marginTop: 4,
                                color: "#F85149",
                                fontSize: 9,
                                overflow: "hidden",
                                textOverflow:
                                    "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {result.error}
                        </div>
                    )}
            </button>

            <div
                data-test-case-menu="true"
                style={{
                    position: "relative",
                    flexShrink: 0,
                }}
            >
                <button
                    type="button"
                    aria-label="Test case actions"
                    aria-expanded={menuOpen}
                    onClick={(event) => {
                        event.stopPropagation();
                        setMenuOpen((open) => !open);
                    }}
                    style={{
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border:
                            `1px solid ${menuOpen
                                ? colors.border
                                : "transparent"
                            }`,
                        borderRadius: 6,
                        background: menuOpen
                            ? colors.panelHover
                            : "transparent",
                        color: colors.textMuted,
                        cursor: "pointer",
                    }}
                >
                    <MoreHorizontal size={15} />
                </button>

                {menuOpen && (
                    <div
                        style={{
                            position: "absolute",
                            right: 0,
                            top: "calc(100% + 5px)",
                            zIndex: 20,
                            width: 160,
                            padding: 5,
                            border:
                                `1px solid ${colors.border}`,
                            borderRadius: radius.md,
                            background: colors.panel,
                            boxShadow:
                                "0 14px 35px rgba(0,0,0,.35)",
                        }}
                    >
                        <MenuButton
                            icon={Power}
                            label={
                                test.enabled
                                    ? "Disable test case"
                                    : "Enable test case"
                            }
                            onClick={() => {
                                onToggle();
                                setMenuOpen(false);
                            }}
                        />

                        <MenuButton
                            icon={Trash2}
                            label="Remove test case"
                            danger
                            onClick={() => {
                                onRemove();
                                setMenuOpen(false);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}


interface MenuButtonProps {
    icon: LucideIcon;
    label: string;
    danger?: boolean;
    onClick(): void;
}

function MenuButton({
    icon: Icon,
    label,
    danger = false,
    onClick,
}: MenuButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                width: "100%",
                minHeight: 30,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 8px",
                border: "none",
                borderRadius: 6,
                background: "transparent",
                color: danger
                    ? "#F85149"
                    : colors.textSecondary,
                cursor: "pointer",
                textAlign: "left",
                fontSize: 11,
                fontWeight: 600,
            }}
            onMouseEnter={(event) => {
                event.currentTarget.style.background =
                    colors.panelHover;
            }}
            onMouseLeave={(event) => {
                event.currentTarget.style.background =
                    "transparent";
            }}
        >
            <Icon size={13} />
            {label}
        </button>
    );
}

function Stat({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "baseline",
                gap: 6,
            }}
        >
            <span
                style={{
                    color: colors.text,
                    fontSize: 12,
                    fontWeight: 650,
                }}
            >
                {value}
            </span>

            <span
                style={{
                    color: colors.textMuted,
                    fontSize: 10,
                }}
            >
                {label}
            </span>
        </div>
    );
}

function formatDuration(
    value: number,
): string {
    if (value < 1000) {
        return `${Math.round(value)}ms`;
    }

    const totalSeconds =
        Math.floor(value / 1000);

    const minutes =
        Math.floor(
            totalSeconds / 60,
        );

    const seconds =
        totalSeconds % 60;

    if (minutes === 0) {
        return `${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
}

function formatTestCaseStatus(
    status: SuiteTestCaseResult["status"],
): string {
    if (status === "passed") {
        return "Passed";
    }

    if (status === "failed") {
        return "Failed";
    }

    return "Stopped";
}

function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        },
    );
}