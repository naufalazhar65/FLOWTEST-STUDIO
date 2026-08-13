import type { TestSuite } from "../types/TestSuite";

import {
    useExecutionStore,
} from "../../execution/store/useExecutionStore";

import type {
    SuiteRunResult,
    SuiteTestCaseResult,
} from "../types/SuiteRunResult";

import {
    ExecutionController,
} from "../../execution/services/ExecutionController";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    getActiveProjectId,
} from "../../project/storage/activeProject";

export interface RunSuiteOptions {
    signal?: AbortSignal;

    onTestCaseStart?: (
        testCaseId: string,
    ) => void;

    onTestCaseComplete?: (
        result: SuiteRunResult["results"][number],
        results: SuiteRunResult["results"],
    ) => void;
}

function getExecutionProject(
    testCase: TestSuite["testCases"][number],
) {
    const activeProjectId =
        getActiveProjectId();

    if (
        activeProjectId ===
        testCase.projectId
    ) {
        const {
            nodes,
            edges,
        } = useFlowStore.getState();

        return {
            nodes,
            edges,
        };
    }

    return {
        nodes:
            testCase.project.nodes,

        edges:
            testCase.project.edges,
    };
}

function isSuiteAborted(
    signal?: AbortSignal,
): boolean {
    return signal?.aborted === true;
}

function isExecutionStopped(): boolean {
    return (
        useExecutionStore
            .getState()
            .status === "stopped"
    );
}

export function stopSuite(): void {
    ExecutionController.stop();
}

export async function runSuite(
    suite: TestSuite,
    options: RunSuiteOptions = {},
): Promise<SuiteRunResult> {
    const {
        signal,
        onTestCaseStart,
        onTestCaseComplete,
    } = options;

    const enabledTestCases =
        suite.testCases.filter(
            (testCase) =>
                testCase.enabled,
        );

    const suiteStartedAt =
        Date.now();

    const results:
        SuiteRunResult["results"] =
        [];

    let suiteStopped = false;

    for (
        const testCase of enabledTestCases
    ) {
        // ---------------------------------------
        // Check Abort Before Test Case
        // ---------------------------------------

        if (
            isSuiteAborted(signal)
        ) {
            suiteStopped = true;
            break;
        }

        onTestCaseStart?.(
            testCase.id,
        );

        const startedAt =
            Date.now();

        try {
            // ---------------------------------------
            // Get Project Graph
            // ---------------------------------------

            const {
                nodes,
                edges,
            } = getExecutionProject(
                testCase,
            );

            // ---------------------------------------
            // Execute Test Case
            // ---------------------------------------

            await ExecutionController.run(
                nodes,
                {
                    edges,
                },
            );

            const finishedAt =
                Date.now();

            // ---------------------------------------
            // Check Stop After Execution
            // ---------------------------------------

            const wasStopped =
                isSuiteAborted(
                    signal,
                ) ||
                isExecutionStopped();

            const testCaseResult:
                SuiteTestCaseResult = {
                testCaseId:
                    testCase.id,

                projectId:
                    testCase.projectId,

                projectName:
                    testCase.projectName,

                status:
                    wasStopped
                        ? "stopped"
                        : "passed",

                startedAt,

                finishedAt,

                duration:
                    finishedAt -
                    startedAt,
            };

            results.push(
                testCaseResult,
            );

            onTestCaseComplete?.(
                testCaseResult,
                [...results],
            );

            // ---------------------------------------
            // Stop Suite
            // ---------------------------------------

            if (wasStopped) {
                suiteStopped = true;
                break;
            }
        } catch (error) {
            const finishedAt =
                Date.now();

            // ---------------------------------------
            // Check Stop After Error
            // ---------------------------------------

            const wasStopped =
                isSuiteAborted(
                    signal,
                ) ||
                isExecutionStopped();

            const testCaseResult:
                SuiteTestCaseResult = {
                testCaseId:
                    testCase.id,

                projectId:
                    testCase.projectId,

                projectName:
                    testCase.projectName,

                status:
                    wasStopped
                        ? "stopped"
                        : "failed",

                startedAt,

                finishedAt,

                duration:
                    finishedAt -
                    startedAt,

                error:
                    error instanceof Error
                        ? error.message
                        : String(error),
            };

            results.push(
                testCaseResult,
            );

            onTestCaseComplete?.(
                testCaseResult,
                [...results],
            );

            // ---------------------------------------
            // Stop Suite
            // ---------------------------------------

            if (wasStopped) {
                suiteStopped = true;
                break;
            }
        }
    }

    const suiteFinishedAt =
        Date.now();

    const passed =
        results.filter(
            (result) =>
                result.status ===
                "passed",
        ).length;

    const failed =
        results.filter(
            (result) =>
                result.status ===
                "failed",
        ).length;

    const stopped =
        results.filter(
            (result) =>
                result.status ===
                "stopped",
        ).length;

    return {
        suiteId:
            suite.id,

        suiteName:
            suite.name,

        status:
            suiteStopped ||
            stopped > 0
                ? "stopped"
                : failed > 0
                    ? "failed"
                    : "passed",

        startedAt:
            suiteStartedAt,

        finishedAt:
            suiteFinishedAt,

        duration:
            suiteFinishedAt -
            suiteStartedAt,

        total:
            enabledTestCases.length,

        passed,

        failed,

        stopped,

        results,
    };
}