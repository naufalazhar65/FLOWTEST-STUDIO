import { create } from "zustand";

export interface ExecutionLog {
  id: string;
  level: "info" | "success" | "error";
  message: string;
  time: string;
}

interface ExecutionLogStore {
  logs: ExecutionLog[];

  addLog: (
    level: ExecutionLog["level"],
    message: string
  ) => void;

  clear: () => void;
}

export const useExecutionLogStore =
  create<ExecutionLogStore>((set) => ({
    logs: [],

    addLog(level, message) {
      set((state) => ({
        logs: [
          ...state.logs,
          {
            id: crypto.randomUUID(),
            level,
            message,
            time: new Date().toLocaleTimeString(),
          },
        ],
      }));
    },

    clear() {
      set({
        logs: [],
      });
    },
  }));