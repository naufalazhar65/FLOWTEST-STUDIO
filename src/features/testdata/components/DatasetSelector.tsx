import {
    useState,
} from "react";

import {
    Button,
} from "../../../components/ui/Button";

import {
    Modal,
} from "../../../components/ui/Modal";

import {
    DialogBody,
} from "../../../components/ui/DialogBody";

import {
    DialogFooter,
} from "../../../components/ui/DialogFooter";

import {
    DialogHeader,
} from "../../../components/ui/DialogHeader";

import {
    Label,
} from "../../../components/ui/Label";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    useExecutionStore,
} from "../../execution/store/useExecutionStore";

import {
    useEnvironmentStore,
} from "../../environment/store/useEnvironmentStore";

import {
    openTestDataFile,
} from "../services/openTestDataFile";

import {
    runParameterizedFlow,
} from "../services/runParameterizedFlow";

import {
    useTestDataStore,
} from "../store/useTestDataStore";

import type {
    TestDataRunResult,
} from "../types/TestDataRunResult";

export function DatasetSelector() {
    const [
        open,
        setOpen,
    ] = useState(false);

    const [
        importing,
        setImporting,
    ] = useState(false);

    const [
        running,
        setRunning,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState<
        string | null
    >(null);

    const [
        runResults,
        setRunResults,
    ] = useState<
        TestDataRunResult[]
    >([]);

    const fileName =
        useTestDataStore(
            (state) =>
                state.fileName,
        );

    const format =
        useTestDataStore(
            (state) =>
                state.format,
        );

    const rows =
        useTestDataStore(
            (state) =>
                state.rows,
        );

    const clearDataset =
        useTestDataStore(
            (state) =>
                state.clearDataset,
        );

    const nodes =
        useFlowStore(
            (state) =>
                state.nodes,
        );

    const edges =
        useFlowStore(
            (state) =>
                state.edges,
        );

    const activeEnvironment =
        useEnvironmentStore(
            (state) =>
                state.activeEnvironment,
        );

    const executionStatus =
        useExecutionStore(
            (state) =>
                state.status,
        );

    const appiumConnection =
        useExecutionStore(
            (state) =>
                state.appiumConnection,
        );

    async function handleImport() {
        setImporting(true);
        setError(null);
        setRunResults([]);

        try {
            const result =
                await openTestDataFile();

            if (!result) {
                return;
            }

            useTestDataStore
                .getState()
                .setDataset(
                    result.file.name,
                    result.format,
                    result.rows,
                );
        } catch (
            importError
        ) {
            setError(
                importError instanceof
                    Error
                    ? importError.message
                    : String(
                          importError,
                      ),
            );
        } finally {
            setImporting(false);
        }
    }

    function handleClear() {
        clearDataset();

        setError(null);

        setRunResults([]);
    }

    async function handleRunDataset() {
        if (
            rows.length === 0 ||
            running
        ) {
            return;
        }

        if (
            executionStatus ===
                "running" ||
            executionStatus ===
                "paused"
        ) {
            return;
        }

        if (
            appiumConnection !==
            "connected"
        ) {
            setError(
                "Start Appium Server first.",
            );

            return;
        }

        if (
            nodes.length === 0
        ) {
            setError(
                "The current flow has no nodes.",
            );

            return;
        }

        setRunning(true);
        setError(null);
        setRunResults([]);

        try {
            const results =
                await runParameterizedFlow(
                    rows,
                    {
                        nodes,

                        edges,

                        environmentName:
                            activeEnvironment,
                    },
                );

            setRunResults(
                results,
            );
        } catch (
            runError
        ) {
            setError(
                runError instanceof
                    Error
                    ? runError.message
                    : String(
                          runError,
                      ),
            );
        } finally {
            setRunning(false);
        }
    }

    const passedRows =
        runResults.filter(
            (result) =>
                result.status ===
                "passed",
        ).length;

    const failedRows =
        runResults.filter(
            (result) =>
                result.status ===
                "failed",
        ).length;

    const canRunDataset =
        rows.length > 0 &&
        !running &&
        executionStatus !==
            "running" &&
        executionStatus !==
            "paused" &&
        appiumConnection ===
            "connected" &&
        nodes.length > 0;

    const datasetLabel =
        fileName
            ? `${fileName} · ${rows.length} rows`
            : "None";

    return (
        <>
            <button
                type="button"
                onClick={() =>
                    setOpen(true)
                }
                style={{
                    height: 30,

                    maxWidth: 210,

                    padding:
                        "0 10px",

                    border:
                        "1px solid #30363D",

                    borderRadius:
                        6,

                    background:
                        "#161B22",

                    color:
                        fileName
                            ? "#E6EDF3"
                            : "#8B949E",

                    fontSize:
                        12,

                    cursor:
                        "pointer",

                    overflow:
                        "hidden",

                    textOverflow:
                        "ellipsis",

                    whiteSpace:
                        "nowrap",
                }}
                title={
                    fileName ??
                    "No dataset loaded"
                }
            >
                Dataset:{" "}
                {datasetLabel}
            </button>

            <Modal
                open={open}
                onClose={() => {
                    if (!running) {
                        setOpen(false);
                    }
                }}
                width={620}
            >
                <DialogHeader
                    title="Dataset Configuration"
                    subtitle="Import, inspect, and execute JSON or CSV test data."
                />

                <DialogBody>
                    <section>
                        <Label>
                            Current Dataset
                        </Label>

                        <div
                            style={{
                                padding:
                                    12,

                                border:
                                    "1px solid #30363D",

                                borderRadius:
                                    8,

                                background:
                                    "#0D1117",
                            }}
                        >
                            <div
                                style={{
                                    fontSize:
                                        13,

                                    color:
                                        "#E6EDF3",

                                    fontWeight:
                                        600,
                                }}
                            >
                                {
                                    fileName ??
                                    "No dataset loaded"
                                }
                            </div>

                            {fileName && (
                                <div
                                    style={{
                                        marginTop:
                                            6,

                                        display:
                                            "flex",

                                        gap:
                                            12,

                                        fontSize:
                                            12,

                                        color:
                                            "#8B949E",
                                    }}
                                >
                                    <span>
                                        Format:{" "}
                                        {
                                            format
                                        }
                                    </span>

                                    <span>
                                        Rows:{" "}
                                        {
                                            rows.length
                                        }
                                    </span>

                                    <span>
                                        Environment:{" "}
                                        {
                                            activeEnvironment
                                        }
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <Label>
                            Dataset Actions
                        </Label>

                        <div
                            style={{
                                display:
                                    "flex",

                                gap:
                                    8,

                                flexWrap:
                                    "wrap",
                            }}
                        >
                            <Button
                                onClick={
                                    handleImport
                                }
                                disabled={
                                    importing ||
                                    running
                                }
                            >
                                {importing
                                    ? "Importing..."
                                    : "Import JSON / CSV"}
                            </Button>

                            {fileName && (
                                <Button
                                    onClick={
                                        handleClear
                                    }
                                    disabled={
                                        running
                                    }
                                >
                                    Clear Dataset
                                </Button>
                            )}

                            <Button
                                onClick={
                                    handleRunDataset
                                }
                                disabled={
                                    !canRunDataset
                                }
                            >
                                {running
                                    ? "Running Dataset..."
                                    : "Run Dataset"}
                            </Button>
                        </div>

                        {!canRunDataset &&
                            rows.length > 0 &&
                            !running && (
                                <div
                                    style={{
                                        marginTop:
                                            8,

                                        fontSize:
                                            12,

                                        color:
                                            "#8B949E",
                                    }}
                                >
                                    {appiumConnection !==
                                    "connected"
                                        ? "Start Appium Server before running the dataset."
                                        : nodes.length ===
                                          0
                                          ? "Add at least one node to the current flow."
                                          : executionStatus ===
                                                "running" ||
                                            executionStatus ===
                                                "paused"
                                            ? "Wait for the current execution to finish."
                                            : null}
                                </div>
                            )}
                    </section>

                    {runResults.length >
                        0 && (
                        <section>
                            <Label>
                                Execution Results
                            </Label>

                            <div
                                style={{
                                    display:
                                        "flex",

                                    gap:
                                        12,

                                    marginBottom:
                                        10,

                                    fontSize:
                                        12,
                                }}
                            >
                                <span
                                    style={{
                                        color:
                                            "#3FB950",
                                    }}
                                >
                                    Passed:{" "}
                                    {
                                        passedRows
                                    }
                                </span>

                                <span
                                    style={{
                                        color:
                                            "#F85149",
                                    }}
                                >
                                    Failed:{" "}
                                    {
                                        failedRows
                                    }
                                </span>
                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    gap:
                                        6,
                                }}
                            >
                                {runResults.map(
                                    (
                                        result,
                                    ) => (
                                        <div
                                            key={
                                                result.rowIndex
                                            }
                                            style={{
                                                display:
                                                    "flex",

                                                justifyContent:
                                                    "space-between",

                                                gap:
                                                    12,

                                                padding:
                                                    "8px 10px",

                                                border:
                                                    "1px solid #30363D",

                                                borderRadius:
                                                    6,

                                                background:
                                                    "#0D1117",
                                            }}
                                        >
                                            <div>
                                                <span
                                                    style={{
                                                        color:
                                                            "#E6EDF3",

                                                        fontSize:
                                                            12,
                                                    }}
                                                >
                                                    Row{" "}
                                                    {
                                                        result.rowIndex +
                                                        1
                                                    }
                                                </span>

                                                {result.error && (
                                                    <div
                                                        style={{
                                                            marginTop:
                                                                4,

                                                            maxWidth:
                                                                400,

                                                            fontSize:
                                                                11,

                                                            color:
                                                                "#F85149",
                                                        }}
                                                    >
                                                        {
                                                            result.error
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <span
                                                style={{
                                                    fontSize:
                                                        12,

                                                    color:
                                                        result.status ===
                                                        "passed"
                                                            ? "#3FB950"
                                                            : "#F85149",
                                                }}
                                            >
                                                {
                                                    result.status ===
                                                    "passed"
                                                        ? "PASS"
                                                        : "FAIL"
                                                }
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </section>
                    )}

                    {error && (
                        <div
                            style={{
                                padding:
                                    10,

                                border:
                                    "1px solid #F8514933",

                                borderRadius:
                                    6,

                                background:
                                    "#F8514912",

                                fontSize:
                                    12,

                                color:
                                    "#F85149",
                            }}
                        >
                            {error}
                        </div>
                    )}
                </DialogBody>

                <DialogFooter>
                    <Button
                        onClick={() =>
                            setOpen(
                                false,
                            )
                        }
                        disabled={
                            running
                        }
                    >
                        Close
                    </Button>
                </DialogFooter>
            </Modal>
        </>
    );
}