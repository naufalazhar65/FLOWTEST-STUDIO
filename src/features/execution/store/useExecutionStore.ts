import { create } from "zustand";

import type { FlowExecutionStatus } from "../types/FlowExecutionStatus";
import type { NodeExecutionStatus } from "../types/NodeExecutionStatus";
import type { NodeExecutionResult } from "../types/NodeExecutionResult";

export type AppiumConnectionStatus =
    | "checking"
    | "connected"
    | "offline";

export interface ExecutionEnvironment {
    platform: "Android" | "iOS" | null;

    osVersion: string | null;

    device: string | null;

    automation: string | null;

    sessionId: string | null;
}

interface ExecutionStore {
    // =====================================
    // Global Status
    // =====================================

    status: FlowExecutionStatus;

    appiumConnection: AppiumConnectionStatus;

    isPaused: boolean;

    isStopped: boolean;

    currentNodeId: string | null;

    nodeStatus: Record<
        string,
        NodeExecutionStatus
    >;

    edgeStatus: Record<
        string,
        NodeExecutionStatus
    >;

    // =====================================
    // Environment
    // =====================================

    environment: ExecutionEnvironment;

    // =====================================
    // Node Execution History
    // =====================================

    nodeResults: Record<
        string,
        NodeExecutionResult
    >;

    setNodeResult(
        result: NodeExecutionResult,
    ): void;

    // =====================================
    // Statistics
    // =====================================

    totalNodes: number;

    executedNodes: number;

    passedNodes: number;

    failedNodes: number;

    progress: number;

    startedAt: number | null;

    finishedAt: number | null;

    duration: number;

    // =====================================
    // Actions
    // =====================================

    setStatus(
        status: FlowExecutionStatus,
    ): void;

    setAppiumConnection(
        status: AppiumConnectionStatus,
    ): void;

    setEnvironment(
        environment: Partial<ExecutionEnvironment>,
    ): void;

    setCurrentNode(
        id: string | null,
    ): void;

    setNodeStatus(
        id: string,
        status: NodeExecutionStatus,
    ): void;

    setEdgeStatus(
        id: string,
        status: NodeExecutionStatus,
    ): void;

    startExecution(
        totalNodes: number,
    ): void;

    completeNode(
        passed: boolean,
    ): void;

    finishExecution(): void;

    finalizeRecoveredExecution(): void;

    pauseExecution(): void;

    resumeExecution(): void;

    stopExecution(): void;

    reset(): void;
}

export const useExecutionStore =
    create<ExecutionStore>(
        (set, get) => ({
            // =====================================
            // Initial State
            // =====================================

            status: "idle",

            appiumConnection:
                "checking",

            isPaused: false,

            isStopped: false,

            currentNodeId: null,

            nodeStatus: {},

            edgeStatus: {},

            // =====================================
            // Environment
            // =====================================

            environment: {
                platform: null,
                osVersion: null,
                device: null,
                automation: null,
                sessionId: null,
            },

            // =====================================
            // Node Execution History
            // =====================================

            nodeResults: {},

            // =====================================
            // Statistics
            // =====================================

            totalNodes: 0,

            executedNodes: 0,

            passedNodes: 0,

            failedNodes: 0,

            progress: 0,

            startedAt: null,

            finishedAt: null,

            duration: 0,

            // =====================================
            // Basic Actions
            // =====================================

            setStatus(status) {
                set({
                    status,
                });
            },

            setAppiumConnection(
                status,
            ) {
                set({
                    appiumConnection:
                        status,
                });
            },

            setEnvironment(
                environment,
            ) {
                set((state) => ({
                    environment: {
                        ...state.environment,
                        ...environment,
                    },
                }));
            },

            setCurrentNode(id) {
                set({
                    currentNodeId:
                        id,
                });
            },

            setNodeStatus(
                id,
                status,
            ) {
                set((state) => ({
                    nodeStatus: {
                        ...state.nodeStatus,
                        [id]: status,
                    },
                }));
            },

            setEdgeStatus(
                id,
                status,
            ) {
                set((state) => ({
                    edgeStatus: {
                        ...state.edgeStatus,
                        [id]: status,
                    },
                }));
            },

            // =====================================
            // Node Execution History
            // =====================================

            setNodeResult(result) {
                set((state) => ({
                    nodeResults: {
                        ...state.nodeResults,

                        [result.nodeId]:
                            result,
                    },
                }));
            },

            // =====================================
            // Execution
            // =====================================

            startExecution(
                totalNodes,
            ) {
                set({
                    status: "running",

                    isPaused: false,

                    isStopped: false,

                    totalNodes,

                    executedNodes: 0,

                    passedNodes: 0,

                    failedNodes: 0,

                    progress: 0,

                    startedAt:
                        performance.now(),

                    finishedAt:
                        null,

                    duration: 0,

                    currentNodeId:
                        null,

                    nodeStatus: {},

                    edgeStatus: {},

                    nodeResults: {},
                });
            },

            completeNode(passed) {
                const state =
                    get();

                const executed =
                    state.executedNodes +
                    1;

                const progress =
                    state.totalNodes ===
                        0
                        ? 0
                        : Math.round(
                            (executed /
                                state.totalNodes) *
                            100,
                        );

                set({
                    executedNodes:
                        executed,

                    progress,

                    passedNodes:
                        passed
                            ? state.passedNodes +
                            1
                            : state.passedNodes,

                    failedNodes:
                        passed
                            ? state.failedNodes
                            : state.failedNodes +
                            1,
                });
            },

            finishExecution() {
                const finished =
                    performance.now();

                const started =
                    get().startedAt ??
                    finished;

                set({
                    finishedAt:
                        finished,

                    duration:
                        finished -
                        started,

                    progress: 100,

                    currentNodeId:
                        null,
                });
            },

            finalizeRecoveredExecution() {
                const state =
                    get();

                const results =
                    Object.values(
                        state.nodeResults,
                    );

                const passedNodes =
                    results.filter(
                        (result) =>
                            result.status ===
                            "passed",
                    ).length;

                const failedNodes =
                    results.filter(
                        (result) =>
                            result.status ===
                            "failed",
                    ).length;

                const executedNodes =
                    results.length;

                const finished =
                    performance.now();

                const started =
                    state.startedAt ??
                    finished;

                set({
                    status:
                        "passed",

                    executedNodes,

                    passedNodes,

                    failedNodes,

                    progress: 100,

                    finishedAt:
                        finished,

                    duration:
                        finished -
                        started,

                    currentNodeId:
                        null,

                    edgeStatus:
                        Object.fromEntries(
                            Object.keys(
                                state.edgeStatus,
                            ).map(
                                (edgeId) => [
                                    edgeId,
                                    "passed",
                                ],
                            ),
                        ),
                });
            },

            pauseExecution() {
                set({
                    isPaused: true,

                    status: "paused",
                });
            },

            resumeExecution() {
                set({
                    isPaused: false,

                    status: "running",
                });
            },

            stopExecution() {
                set({
                    isStopped: true,

                    status: "stopped",
                });
            },

            // =====================================
            // Reset
            // =====================================

            reset() {
                set({
                    appiumConnection:
                        "checking",

                    status: "idle",

                    isPaused: false,

                    isStopped: false,

                    currentNodeId:
                        null,

                    nodeStatus: {},

                    edgeStatus: {},

                    nodeResults: {},

                    totalNodes: 0,

                    executedNodes: 0,

                    passedNodes: 0,

                    failedNodes: 0,

                    progress: 0,

                    startedAt: null,

                    finishedAt: null,

                    duration: 0,

                    // Keep the last device
                    // information, but clear
                    // the active session.
                    environment: {
                        ...get().environment,
                        sessionId: null,
                    },
                });
            },
        }),
    );