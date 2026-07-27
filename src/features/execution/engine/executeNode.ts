import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { getRunner } from "../services/runnerRegistry";
import { useExecutionStore } from "../store/useExecutionStore";

export async function executeNode(
  node: FlowNode,
  context: ExecutionContext
) {
  const execution = useExecutionStore.getState();

  const runner = getRunner(node.data.action);

  try {
    await runner.run(node, context);

    execution.completeNode(true);
  } catch (error) {
    execution.completeNode(false);

    throw error;
  }
}