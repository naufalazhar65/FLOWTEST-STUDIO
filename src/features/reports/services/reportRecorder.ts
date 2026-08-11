import {
    useExecutionLogStore,
} from "../../execution/store/useExecutionLogStore";

import {
    useExecutionStore,
} from "../../execution/store/useExecutionStore";

import {
    useReportStore,
} from "../store/useReportStore";

import type {
    TestReportStatus,
} from "../types/TestReport";

interface RecordExecutionReportInput {
    status: TestReportStatus;

    startedAt: number;

    finishedAt: number;

    duration: number;
}

export function recordExecutionReport({
    status,
    startedAt,
    finishedAt,
    duration,
}: RecordExecutionReportInput): void {
    const execution =
        useExecutionStore.getState();

    const logs =
        useExecutionLogStore
            .getState()
            .logs;

    const nodes = Object.values(
        execution.nodeResults,
    )
        .sort(
            (a, b) =>
                a.startedAt -
                b.startedAt,
        )
        .map((node) => ({
            ...node,
        }));

    useReportStore
        .getState()
        .addReport({
            id: crypto.randomUUID(),

            status,

            startedAt,

            finishedAt,

            duration,

            totalNodes:
                execution.totalNodes,

            executedNodes:
                execution.executedNodes,

            passedNodes:
                execution.passedNodes,

            failedNodes:
                execution.failedNodes,

            nodes,

            logs: logs.map(
                (log) => ({
                    ...log,
                }),
            ),
        });
}