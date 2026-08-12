import type { TestSuite } from "../types/TestSuite";

import type {
    SuiteRunResult,
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

function isSuiteStopped(
    signal?: AbortSignal,
): boolean {
    return signal?.aborted === true;
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
        if (
            isSuiteStopped(signal)
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
            const {
                nodes,
                edges,
            } = getExecutionProject(
                testCase,
            );

            await ExecutionController.run(
                nodes,
                {
                    edges,
                },
            );

            const finishedAt =
                Date.now();

            results.push({
                testCaseId:
                    testCase.id,

                projectId:
                    testCase.projectId,

                projectName:
                    testCase.projectName,

                status: "passed",

                startedAt,

                finishedAt,

                duration:
                    finishedAt -
                    startedAt,
            });

            onTestCaseComplete?.(
                results[results.length - 1],
                [...results],
            );
        } catch (error) {
            const finishedAt =
                Date.now();

            const wasStopped =
                isSuiteStopped(signal);

            results.push({
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
            });

            onTestCaseComplete?.(
                results[results.length - 1],
                [...results],
            );

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
        suiteId: suite.id,

        suiteName: suite.name,

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