import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { getRunner } from "../services/runnerRegistry";
import { executionLogger } from "../services/executionLogger";
import { useExecutionStore } from "../store/useExecutionStore";
import type { RunnerResult } from "../types/RunnerResult";

export async function executeNode(
  node: FlowNode,
  context: ExecutionContext,
): Promise<RunnerResult> {
  const execution = useExecutionStore.getState();

  const runner = getRunner(node.data.action);

  const startedAt = performance.now();

  execution.setCurrentNode(node.id);

  execution.setNodeStatus(
    node.id,
    "running",
  );

  executionLogger.info({
    message: "Executing node",
    nodeId: node.id,
    nodeType: node.type,
    nodeTitle: node.data.title,
  });

  try {
    const result = await runner.run(
      node,
      context,
    );

    execution.setNodeStatus(
      node.id,
      "passed",
    );

    execution.completeNode(true);

    return result ?? {
      outputs: ["next"],
    };
  } catch (error) {
    const duration =
      performance.now() - startedAt;

    execution.setNodeStatus(
      node.id,
      "failed",
    );

    execution.completeNode(false);

    executionLogger.error({
      message: "Node execution failed",
      nodeId: node.id,
      nodeType: node.type,
      nodeTitle: node.data.title,
      duration,
      details: {
        reason:
          error instanceof Error
            ? error.message
            : String(error),
      },
    });

    throw error;
  } finally {
    execution.setCurrentNode(null);
  }
}