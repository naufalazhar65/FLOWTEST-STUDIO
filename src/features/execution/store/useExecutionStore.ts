import { create } from "zustand";

import type { ExecutionStatus } from "../types/ExecutionStatus";

interface ExecutionStore {
  status: ExecutionStatus;

  currentNodeId: string | null;

  nodeStatus: Record<
    string,
    ExecutionStatus
  >;

  setStatus(
    status: ExecutionStatus
  ): void;

  setCurrentNode(
    id: string | null
  ): void;

  setNodeStatus(
    id: string,
    status: ExecutionStatus
  ): void;

  reset(): void;
}

export const useExecutionStore =
  create<ExecutionStore>((set) => ({
    status: "idle",

    currentNodeId: null,

    nodeStatus: {},

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

    reset() {
      set({
        status: "idle",
        currentNodeId: null,
        nodeStatus: {},
      });
    },
  }));