import {
    getActiveProjectId,
} from "../../project/storage/activeProject";

import {
    useExecutionLogStore,
} from "../../execution/store/useExecutionLogStore";

import {
    useExecutionStore,
} from "../../execution/store/useExecutionStore";

import type {
    TestReport,
    TestReportStatus,
} from "../types/TestReport";

export interface CreateExecutionReportInput {
    status: TestReportStatus;

    startedAt: number;

    finishedAt: number;

    duration: number;
}

export function createExecutionReport({
    status,
    startedAt,
    finishedAt,
    duration,
}: CreateExecutionReportInput): TestReport {
    const projectId =
        getActiveProjectId();

    if (!projectId) {
        throw new Error(
            "Cannot create execution report without an active project.",
        );
    }

    const execution =
        useExecutionStore.getState();

    const logs =
        useExecutionLogStore
            .getState()
            .logs;

    const environment = {
        platform:
            execution.environment.platform ??
            "",

        platformVersion:
            execution.environment.osVersion ??
            "",

        deviceName:
            execution.environment.device ??
            "",

        automationName:
            execution.environment.automation ??
            "",

        sessionId:
            execution.environment.sessionId ??
            null,
    };

    const nodes =
        Object.values(
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

    return {
        id: crypto.randomUUID(),

        projectId,

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

        environment,

        nodes,

        logs: logs.map(
            (log) => ({
                ...log,
            }),
        ),
    };
}