import type { WaitNodeData } from "../../flow/types/flowNode";

import { executionLogger } from "../services/executionLogger";
import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { resolveNodeVariables } from "../variables/resolveNodeVariables";

export const waitRunner: NodeRunner = {
  async run(node, context) {
    void context;

    if (node.data.action !== "wait") {
      return;
    }

    const startedAt = performance.now();

    const data = resolveNodeVariables({
      locator: (node.data as WaitNodeData).locator,
    });

    const waitNode = node.data as WaitNodeData;

    try {
      await appiumClient.waitUntilElement(
        waitNode.locatorStrategy,
        data.locator,
        waitNode.timeout,
        waitNode.pollingInterval,
      );

      const elapsed = performance.now() - startedAt;

      executionLogger.success({
        message: "Wait completed",
        nodeId: node.id,
        nodeType: node.data.action,
        nodeTitle: node.data.title,
        duration: elapsed,
        details: {
          locator: data.locator,
          locatorStrategy: waitNode.locatorStrategy,
          timeout: waitNode.timeout,
          pollingInterval: waitNode.pollingInterval,
        },
      });
    } catch (error) {
      const elapsed = performance.now() - startedAt;

      executionLogger.error({
        message: "Wait failed",
        nodeId: node.id,
        nodeType: node.data.action,
        nodeTitle: node.data.title,
        duration: elapsed,
        details: {
          locator: data.locator,
          locatorStrategy: waitNode.locatorStrategy,
          timeout: waitNode.timeout,
          pollingInterval: waitNode.pollingInterval,
          reason:
            error instanceof Error
              ? error.message
              : String(error),
        },
      });

      throw error;
    }
  },
};