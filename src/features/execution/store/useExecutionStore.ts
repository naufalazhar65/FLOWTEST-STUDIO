import { create } from "zustand";

import type { FlowExecutionStatus } from "../types/FlowExecutionStatus";
import type { NodeExecutionStatus } from "../types/NodeExecutionStatus";

interface ExecutionStore {
  // =====================================
  // Global Status
  // =====================================

  status: FlowExecutionStatus;


  isPaused: boolean;

  isStopped: boolean;

  currentNodeId: string | null;

  nodeStatus: Record<string, NodeExecutionStatus>;

  edgeStatus: Record<string, NodeExecutionStatus>;

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

  setStatus(status: FlowExecutionStatus): void;


  setCurrentNode(id: string | null): void;

  setNodeStatus(
    id: string,
    status: NodeExecutionStatus
  ): void;

  setEdgeStatus(
    id: string,
    status: NodeExecutionStatus
  ): void;

  startExecution(
    totalNodes: number
  ): void;

  completeNode(
    passed: boolean
  ): void;

  finishExecution(): void;

  pauseExecution(): void;

  resumeExecution(): void;

  stopExecution(): void;

  reset(): void;
}

export const useExecutionStore =
  create<ExecutionStore>((set, get) => ({
    // =====================================
    // Initial State
    // =====================================

    status: "idle",

    isPaused: false,

    isStopped: false,

    currentNodeId: null,

    nodeStatus: {},

    edgeStatus: {},

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

    setCurrentNode(id) {
      set({
        currentNodeId: id,
      });
    },

    setNodeStatus(id, status) {
      set((state) => ({
        nodeStatus: {
          ...state.nodeStatus,
          [id]: status,
        },
      }));
    },

    setEdgeStatus(id, status) {
      set((state) => ({
        edgeStatus: {
          ...state.edgeStatus,
          [id]: status,
        },
      }));
    },

    // =====================================
    // Execution
    // =====================================

    startExecution(totalNodes) {
      set({
        status: "running",

        isPaused: false,

        isStopped: false,

        totalNodes,

        executedNodes: 0,

        passedNodes: 0,

        failedNodes: 0,

        progress: 0,

        startedAt: performance.now(),

        finishedAt: null,

        duration: 0,

        currentNodeId: null,

        nodeStatus: {},

        edgeStatus: {},
      });
    },

    completeNode(passed) {
      const state = get();

      const executed =
        state.executedNodes + 1;

      const progress =
        state.totalNodes === 0
          ? 0
          : Math.round(
            (executed / state.totalNodes) * 100
          );

      set({
        executedNodes: executed,

        progress,

        passedNodes: passed
          ? state.passedNodes + 1
          : state.passedNodes,

        failedNodes: passed
          ? state.failedNodes
          : state.failedNodes + 1,
      });
    },

    finishExecution() {
      const finished = performance.now();

      const started =
        get().startedAt ?? finished;

      set({
        finishedAt: finished,
        duration: finished - started,
        progress: 100,
        currentNodeId: null, // opsional, agar highlight node hilang
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
        status: "idle",

        isPaused: false,

        isStopped: false,

        currentNodeId: null,

        nodeStatus: {},

        edgeStatus: {},

        totalNodes: 0,

        executedNodes: 0,

        passedNodes: 0,

        failedNodes: 0,

        progress: 0,

        startedAt: null,

        finishedAt: null,

        duration: 0,
      });
    },
  }));