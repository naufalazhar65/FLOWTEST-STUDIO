import { executionLogger } from "../services/executionLogger";
import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { resolveNodeVariables } from "../variables/resolveNodeVariables";

export const inputRunner: NodeRunner = {
  async run(node) {
    if (node.data.action !== "input") {
      return;
    }

    const start = performance.now();

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

      const duration = performance.now() - start;

      executionLogger.success({
        message: "Input completed",
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: node.data.title,
        duration,
        details: {
          locator: data.locator,
          locatorStrategy: node.data.locatorStrategy,
          value: data.text,
        },
      });
    } catch (error) {
      const duration = performance.now() - start;

      executionLogger.error({
        message: "Input failed",
        nodeId: node.id,
        nodeType: node.type,
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