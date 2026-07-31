import type { WaitNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { resolveNodeVariables } from "../variables/resolveNodeVariables";

export const waitRunner: NodeRunner<WaitNodeData> = {
  async run(node, context) {
    void context;

    if (node.data.action !== "wait") {
      return;
    }

    const startedAt = performance.now();

    const waitNode = node.data;

    const data = resolveNodeVariables({
      locator: waitNode.locator,
    });

    try {
      await appiumClient.waitUntilElement(
        waitNode.locatorStrategy,
        data.locator,
        waitNode.timeout,
        waitNode.pollingInterval,
      );

      const duration = performance.now() - startedAt;

      executionLogger.success({
        message: "Wait completed",
        nodeId: node.id,
        nodeType: waitNode.action,
        nodeTitle: waitNode.title,
        duration,
        details: {
          locator: data.locator,
          locatorStrategy: waitNode.locatorStrategy,
          timeout: waitNode.timeout,
          pollingInterval: waitNode.pollingInterval,
        },
      });

      return {
        outputs: ["next"],
      };
    } catch (error) {
      const duration = performance.now() - startedAt;

      executionLogger.error({
        message: "Wait failed",
        nodeId: node.id,
        nodeType: waitNode.action,
        nodeTitle: waitNode.title,
        duration,
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