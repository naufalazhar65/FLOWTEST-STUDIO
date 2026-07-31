import { isTapNode } from "../../flow/utils/nodeGuards";
import { executionLogger } from "../services/executionLogger";
import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { resolveVariables } from "../variables/resolveVariable";

export const tapRunner: NodeRunner = {
  async run(node) {
    if (!isTapNode(node)) {
      return;
    }

    const start = performance.now();

    const locator = resolveVariables(node.data.locator);

    try {
      await appiumClient.tap(
        node.data.locatorStrategy,
        locator,
      );

      const duration = performance.now() - start;

      executionLogger.success({
        message: "Tap completed",
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: node.data.title,
        duration,
        details: {
          locator,
          locatorStrategy: node.data.locatorStrategy,
        },
      });
    } catch (error) {
      const duration = performance.now() - start;

      executionLogger.error({
        message: "Tap failed",
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: node.data.title,
        duration,
        details: {
          locator,
          locatorStrategy: node.data.locatorStrategy,
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