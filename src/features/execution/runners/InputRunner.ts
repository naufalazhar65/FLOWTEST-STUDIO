import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { resolveNodeVariables } from "../variables/resolveNodeVariables";

export const inputRunner: NodeRunner = {
  async run(node) {
    if (node.data.action !== "input") {
      return;
    }

    const startedAt = performance.now();

    const data = resolveNodeVariables({
      locator: node.data.locator,
      text: node.data.text,
    });

    try {
      await appiumClient.input(
        node.data.locatorStrategy,
        data.locator,
        data.text,
      );

      const duration = performance.now() - startedAt;

      executionLogger.success({
        message: "Input completed",
        nodeId: node.id,
        nodeType: node.data.action,
        nodeTitle: node.data.title,
        duration,
        details: {
          locator: data.locator,
          locatorStrategy: node.data.locatorStrategy,
          value: data.text,
        },
      });

      return {
        outputs: ["next"],
      };
    } catch (error) {
      const duration = performance.now() - startedAt;

      executionLogger.error({
        message: "Input failed",
        nodeId: node.id,
        nodeType: node.data.action,
        nodeTitle: node.data.title,
        duration,
        details: {
          locator: data.locator,
          locatorStrategy: node.data.locatorStrategy,
          value: data.text,
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