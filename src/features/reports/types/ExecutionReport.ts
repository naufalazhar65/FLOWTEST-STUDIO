import type { ExecutionLog } from "../../execution/store/useExecutionLogStore";

export type ExecutionReportStatus =
    | "passed"
    | "failed"
    | "stopped";

export interface ExecutionReport {
    id: string;

    flowName: string;

    status: ExecutionReportStatus;

    startedAt: number;

    finishedAt: number;

    duration: number;

    totalNodes: number;

    passedNodes: number;

    failedNodes: number;

    logs: ExecutionLog[];
}