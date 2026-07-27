import { useExecutionLogStore } from "../store/useExecutionLogStore";

class ExecutionLogger {
  info(
    message: string,
    nodeId?: string,
    nodeType?: string,
    duration?: number
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        message,
        nodeId,
        nodeType,
        duration
      );
  }

  success(
    message: string,
    nodeId?: string,
    nodeType?: string,
    duration?: number
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "success",
        message,
        nodeId,
        nodeType,
        duration
      );
  }

  error(
    message: string,
    nodeId?: string,
    nodeType?: string,
    duration?: number
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "error",
        message,
        nodeId,
        nodeType,
        duration
      );
  }

  clear() {
    useExecutionLogStore
      .getState()
      .clear();
  }
}

export const executionLogger =
  new ExecutionLogger();