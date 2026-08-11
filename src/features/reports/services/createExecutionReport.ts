import {
    useExecutionLogStore,
} from "../../execution/store/useExecutionLogStore";

import {
    useExecutionStore,
} from "../../execution/store/useExecutionStore";

import type {
    TestReport,
} from "../types/TestReport";

export function createExecutionReport(): TestReport {
    const execution =
        useExecutionStore.getState();

    const logStore =
        useExecutionLogStore.getState();

    const nodes = Object.values(
        execution.nodeResults,
    )
        .sort(
            (a, b) =>
                a.startedAt -
                b.startedAt,
        )
        .map((node) => ({
            nodeId: node.nodeId,

            nodeType: node.nodeType,

            nodeTitle: node.nodeTitle,

            status: node.status,

            startedAt: node.startedAt,

            finishedAt: node.finishedAt,

            duration: node.duration,

            error: node.error,
        }));

    return {
        id: crypto.randomUUID(),

        status:
            execution.status ===
                "passed"
                ? "passed"
                : execution.status ===
                    "stopped"
                    ? "stopped"
                    : "failed",

        startedAt:
            execution.startedAt ??
            0,

        finishedAt:
            execution.finishedAt ??
            performance.now(),

        duration:
            execution.duration,

        totalNodes:
            execution.totalNodes,

        executedNodes:
            execution.executedNodes,

        passedNodes:
            execution.passedNodes,

        failedNodes:
            execution.failedNodes,

        nodes,

        logs: logStore.logs.map(
            (log) => ({
                id: log.id,

                level: log.level,

                message: log.message,

                timestamp:
                    log.timestamp,

                duration:
                    log.duration,

                nodeId:
                    log.nodeId,

                nodeType:
                    log.nodeType,

                nodeTitle:
                    log.nodeTitle,

                details:
                    log.details,
            }),
        ),
    };
}