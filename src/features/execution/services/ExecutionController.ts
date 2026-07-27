import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { executeFlow } from "../engine/executeFlow";
import { useExecutionStore } from "../store/useExecutionStore";

export class ExecutionController {
  static async run(
    nodes: FlowNode[],
    context: ExecutionContext
  ) {
    await executeFlow(nodes, context);
  }

  static pause() {
    useExecutionStore
      .getState()
      .pauseExecution();
  }

  static resume() {
    useExecutionStore
      .getState()
      .resumeExecution();
  }

  static stop() {
    useExecutionStore
      .getState()
      .stopExecution();
  }
}