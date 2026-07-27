import { create } from "zustand";

export type ExecutionLogLevel =
  | "info"
  | "success"
  | "error";

export type ExecutionLogFilter =
  | "all"
  | ExecutionLogLevel;

export interface ExecutionLog {
  id: string;

  level: ExecutionLogLevel;

  message: string;

  timestamp: number;

  duration?: number;

  nodeId?: string;

  nodeType?: string;
}

interface ExecutionLogStore {
  logs: ExecutionLog[];

  filter: ExecutionLogFilter;

  addLog: (
    level: ExecutionLogLevel,
    message: string,
    nodeId?: string,
    nodeType?: string,
    duration?: number
  ) => void;

  clear: () => void;

  setFilter: (
    filter: ExecutionLogFilter
  ) => void;
}

export const useExecutionLogStore =
  create<ExecutionLogStore>((set) => ({
    logs: [],

    filter: "all",

    addLog(
      level,
      message,
      nodeId,
      nodeType,
      duration
    ) {
      set((state) => ({
        logs: [
          ...state.logs,
          {
            id: crypto.randomUUID(),
            level,
            message,

            timestamp: Date.now(),

            duration,

            nodeId,
            nodeType,
          },
        ],
      }));
    },

    clear() {
      set({
        logs: [],
      });
    },

    setFilter(filter) {
      set({
        filter,
      });
    },
  }));