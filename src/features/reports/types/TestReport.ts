import type {
    ExecutionLogLevel,
} from "../../execution/store/useExecutionLogStore";

import type {
    NodeExecutionStatus,
} from "../../execution/types/NodeExecutionStatus";

export interface ExecutionReportLog {
    id: string;

    level: ExecutionLogLevel;

    message: string;

    timestamp: number;

    duration?: number;

    nodeId?: string;

    nodeType?: string;

    nodeTitle?: string;

    details?: Record<
        string,
        unknown
    >;
}

export interface ReportNode {
    nodeId: string;

    nodeType: string;

    nodeTitle: string;

    status: NodeExecutionStatus;

    startedAt: number;

    finishedAt: number;

    duration: number;

    error?: string;

    screenshot?: string;

    pageSource?: string;
}

export type TestReportStatus =
    | "passed"
    | "failed"
    | "stopped";

export interface ReportEnvironment {
    platform: string;

    platformVersion: string;

    deviceName: string;

    automationName: string;

    sessionId: string | null;
}

export interface TestReport {
    id: string;

    projectId: string;

    status: TestReportStatus;

    startedAt: number;

    finishedAt: number;

    duration: number;

    totalNodes: number;

    executedNodes: number;

    passedNodes: number;

    failedNodes: number;

    environment: ReportEnvironment;

    nodes: ReportNode[];

    logs: ExecutionReportLog[];
}