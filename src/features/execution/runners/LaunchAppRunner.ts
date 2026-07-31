import type { LaunchAppNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";

export const launchAppRunner: NodeRunner<LaunchAppNodeData> = {
  async run(node) {
    if (node.data.action !== "launchApp") {
      return;
    }

    const startedAt = performance.now();

    const data = node.data;

    try {
      await appiumClient.launchApp(
        data.appPackage,
        data.appActivity,
        data.noReset,
      );

      const duration = performance.now() - startedAt;

      executionLogger.success({
        message: "Launch App completed",
        nodeId: node.id,
        nodeType: data.action,
        nodeTitle: data.title,
        duration,
        details: {
          appPackage: data.appPackage,
          appActivity: data.appActivity,
          noReset: data.noReset,
        },
      });

      return {
        outputs: ["next"],
      };
    } catch (error) {
      const duration = performance.now() - startedAt;

      executionLogger.error({
        message: "Launch App failed",
        nodeId: node.id,
        nodeType: data.action,
        nodeTitle: data.title,
        duration,
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