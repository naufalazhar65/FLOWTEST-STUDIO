import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { getRunner } from "../services/runnerRegistry";
import { executionLogger } from "../services/executionLogger";
import { useExecutionStore } from "../store/useExecutionStore";

export async function executeNode(
  node: FlowNode,
  context: ExecutionContext
) {
  const execution = useExecutionStore.getState();
  const runner = getRunner(node.data.action);

  const startedAt = performance.now();

  try {
    // Log sebelum menjalankan node
    let message = `Executing ${node.data.title}`;

    if (node.data.action === "delay") {
      message = `Waiting ${node.data.duration} ms`;
    }

    executionLogger.info(
      message,
      node.id,
      node.data.action
    );

    await runner.run(node, context);

    const duration = performance.now() - startedAt;

    execution.completeNode(true);

    executionLogger.success(
      `${node.data.title} completed`,
      node.id,
      node.data.action,
      duration
    );
  } catch (error) {
    const duration = performance.now() - startedAt;

    execution.completeNode(false);

    executionLogger.error(
      `${node.data.title} failed`,
      node.id,
      node.data.action,
      duration
    );

    throw error;
  }
}