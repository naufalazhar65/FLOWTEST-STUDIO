import {
  useExecutionLogStore,
  type ExecutionLog,
} from "../store/useExecutionLogStore";

type ExecutionLogInput = Omit<
  ExecutionLog,
  "id" | "timestamp" | "level"
>;

class ExecutionLogger {
  info(log: ExecutionLogInput) {
    useExecutionLogStore.getState().addLog({
      ...log,
      level: "info",
    });
  }

  success(log: ExecutionLogInput) {
    console.log("LOGGER SUCCESS:", log, typeof log);

    useExecutionLogStore.getState().addLog({
      ...log,
      level: "success",
    });
  }

  warning(log: ExecutionLogInput) {
    useExecutionLogStore.getState().addLog({
      ...log,
      level: "warning",
    });
  }

  error(log: ExecutionLogInput) {
    useExecutionLogStore.getState().addLog({
      ...log,
      level: "error",
    });
  }

  clear() {
    useExecutionLogStore.getState().clear();
  }
}

export const executionLogger = new ExecutionLogger();