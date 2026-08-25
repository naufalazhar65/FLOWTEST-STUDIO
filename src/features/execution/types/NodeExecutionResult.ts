import type { NodeExecutionStatus } from "./NodeExecutionStatus";

export interface NodeExecutionResult {
    nodeId: string;

    nodeType: string;

    nodeTitle: string;

    status: NodeExecutionStatus;

    startedAt: number;

    finishedAt: number;

    duration: number;

    attempts?: number;

    retries?: number;

    retryReason?: string;

    locatorStrategy?:
        string | null;

    locator?:
        string | null;

    error?: string;

    screenshot?: string;

    screenshotFileName?: string;

    pageSource?: string;
}