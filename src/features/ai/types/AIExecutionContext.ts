import type {
    NodeExecutionResult,
} from "../../execution/types/NodeExecutionResult";

import type {
    NodeExecutionStatus,
} from "../../execution/types/NodeExecutionStatus";

import type {
    AppiumConnectionStatus,
} from "../../execution/store/useExecutionStore";

import type {
    AIFlowContext,
} from "./AIRequest";

import type {
    FlowExecutionStatus,
} from "../../execution/types/FlowExecutionStatus";

export interface AIExecutionStatistics {
    totalNodes: number;

    executedNodes: number;

    passedNodes: number;

    failedNodes: number;

    skippedNodes: number;

    progress: number;
}

export interface AIExecutionTiming {
    startedAt: number | null;

    finishedAt: number | null;

    duration: number;
}

export interface AIExecutionEnvironment {
    appiumConnection:
    AppiumConnectionStatus;

    platform:
    | "Android"
    | "iOS"
    | null;

    deviceName:
    string | null;

    platformVersion:
    string | null;

    udid:
    string | null;
}

export interface AIExecutionContext {
    flow:
    AIFlowContext;

    execution: {
        status:
        FlowExecutionStatus;

        currentNodeId:
        string | null;

        nodeStatus:
        Record<
            string,
            NodeExecutionStatus
        >;

        edgeStatus:
        Record<
            string,
            NodeExecutionStatus
        >;

        nodeResults:
        Record<
            string,
            NodeExecutionResult
        >;

        statistics:
        AIExecutionStatistics;

        timing:
        AIExecutionTiming;
    };

    environment:
    AIExecutionEnvironment;
}