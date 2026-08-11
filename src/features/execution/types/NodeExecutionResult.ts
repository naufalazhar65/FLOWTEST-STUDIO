import type { NodeExecutionStatus } from "./NodeExecutionStatus";

export interface NodeExecutionResult {
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