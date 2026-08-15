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

import {
    getActiveProjectId,
} from "../../project/storage/activeProject";

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

    const projectId =
        getActiveProjectId();

    if (!projectId) {
        console.warn(
            "[Report Recorder] No active project ID. Report will not be saved.",
        );

        return;
    }
    const execution =
        useExecutionStore.getState();

    const logs =
        useExecutionLogStore
            .getState()
            .logs;

    /*
     * Snapshot execution environment
     * into the persisted test report.
     *
     * ExecutionStore:
     *
     * platform
     * osVersion
     * device
     * automation
     * sessionId
     *
     * TestReport:
     *
     * platform
     * platformVersion
     * deviceName
     * automationName
     * sessionId
     */
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
            execution.environment.sessionId,
    };

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

    const report = {
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

    console.log(
        "[Report Environment]",
        environment,
    );

    useReportStore
        .getState()
        .addReport(report);
}