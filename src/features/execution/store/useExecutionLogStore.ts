import { create } from "zustand";

export type ExecutionLogLevel =
  | "info"
  | "success"
  | "warning"
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

  nodeTitle?: string;

  details?: Record<string, unknown>;
}

interface ExecutionLogStore {
  logs: ExecutionLog[];

  filter: ExecutionLogFilter;

  addLog: (
    log: Omit<ExecutionLog, "id" | "timestamp">
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

    addLog(log: Omit<ExecutionLog, "id" | "timestamp">) {
      console.log("ADD LOG >>>", log, typeof log);
      console.trace("ADD LOG TRACE");

      set((state) => ({
        logs: [
          ...state.logs,
          {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            ...log,
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