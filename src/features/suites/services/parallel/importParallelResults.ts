import type {
    DurationTrendData,
    SuiteRunResult,
    SuiteTestCaseResult,
    SuiteTestCaseResultStatus,
} from "../../types/SuiteRunResult";

import {
    computeDurationTrends,
} from "./computeDurationTrends";

import {
    planParallelBatches,
} from "./planParallelBatches";

export interface ParallelTestCaseRecord {
    testCaseId: string;

    projectId: string;

    projectName: string;

    status: SuiteTestCaseResultStatus;

    startedAt: number;

    finishedAt: number;

    duration: number;

    error?: string;

    artifactDir?: string;
}

export interface ImportParallelOptions {
    suiteId: string;

    suiteName: string;

    concurrency: number;

    startedAt: number;

    finishedAt: number;

    records: ParallelTestCaseRecord[];
}

export function buildSuiteRunResultFromParallel(
    options: ImportParallelOptions,
): SuiteRunResult {
    const results: SuiteTestCaseResult[] =
        options.records.map(
            (record) => ({
                testCaseId:
                    record.testCaseId,

                projectId:
                    record.projectId,

                projectName:
                    record.projectName,

                status:
                    record.status,

                startedAt:
                    record.startedAt,

                finishedAt:
                    record.finishedAt,

                duration:
                    record.duration,

                ...(record.error
                    ? {
                          error: record.error,
                      }
                    : {}),
            }),
        );

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

    const durationSamples =
        results.map(
            (result) => ({
                label:
                    result.projectName,

                duration:
                    result.duration,
            }),
        );

    const trends =
        computeDurationTrends(
            durationSamples,
        );

    const trendData: DurationTrendData[] =
        trends.trends.map(
            (trend) => ({
                ...trend,

                slowest:
                    trends.slowest
                        ?.label ===
                    trend.label,
            }),
        );

    const executionPlan =
        planParallelBatches(
            results.map(
                (result) => ({
                    id:
                        result.testCaseId,
                }),
            ),
            options.concurrency,
        );

    return {
        suiteId:
            options.suiteId,

        suiteName:
            options.suiteName,

        status:
            stopped > 0
                ? "stopped"
                : failed > 0
                    ? "failed"
                    : "passed",

        startedAt:
            options.startedAt,

        finishedAt:
            options.finishedAt,

        duration:
            options.finishedAt -
            options.startedAt,

        total:
            results.length,

        passed,

        failed,

        stopped,

        concurrency:
            options.concurrency,

        batchCount:
            executionPlan.batches.length,

        durationTrends:
            trendData,

        results,
    };
}
