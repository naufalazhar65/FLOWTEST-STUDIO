import type { LaunchAppNodeData } from "../../flow/types/flowNode";

import { executionLogger } from "../services/executionLogger";
import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";

export const launchAppRunner: NodeRunner = {
  async run(node) {
    if (node.data.action !== "launchApp") {
      return;
    }

    const startedAt = performance.now();

    const data = node.data as LaunchAppNodeData;

    try {
      await appiumClient.launchApp(
        data.appPackage,
        data.appActivity,
        data.noReset,
      );

      const elapsed = performance.now() - startedAt;

      executionLogger.success({
        message: "Launch App completed",
        nodeId: node.id,
        nodeType: node.data.action,
        nodeTitle: node.data.title,
        duration: elapsed,
        details: {
          appPackage: data.appPackage,
          appActivity: data.appActivity,
          noReset: data.noReset,
        },
      });
    } catch (error) {
      const elapsed = performance.now() - startedAt;

      executionLogger.error({
        message: "Launch App failed",
        nodeId: node.id,
        nodeType: node.data.action,
        nodeTitle: node.data.title,
        duration: elapsed,
        details: {
          appPackage: data.appPackage,
          appActivity: data.appActivity,
          noReset: data.noReset,
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