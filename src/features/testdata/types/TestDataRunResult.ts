export type TestDataRunStatus =
    | "passed"
    | "failed";

export interface TestDataRunResult {
    rowIndex: number;

    data: Record<
        string,
        unknown
    >;

    status: TestDataRunStatus;

    startedAt: number;

    finishedAt: number;

    duration: number;

    error?: string;
}