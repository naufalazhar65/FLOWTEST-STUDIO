export type SuiteTestCaseResultStatus =
    | "passed"
    | "failed"
    | "stopped";

export interface SuiteTestCaseResult {
    testCaseId: string;

    projectId: string;

    projectName: string;

    status: SuiteTestCaseResultStatus;

    startedAt: number;

    finishedAt: number;

    duration: number;

    error?: string;
}

export interface DurationTrendData {
    label: string;

    samples: number;

    average: number;

    min: number;

    max: number;

    median: number;

    total: number;

    slowest: boolean;
}

export interface SuiteRunResult {
    suiteId: string;

    suiteName: string;

    status: "passed" | "failed" | "stopped";

    startedAt: number;

    finishedAt: number;

    duration: number;

    total: number;

    passed: number;

    failed: number;

    stopped: number;

    concurrency?: number;

    batchCount?: number;

    durationTrends?: DurationTrendData[];

    results: SuiteTestCaseResult[];
}