import type { CloseAppNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";

import type { NodeRunner } from "../types/NodeRunner";

export const closeAppRunner: NodeRunner<CloseAppNodeData> = {
  async run(node) {
    const startedAt =
      performance.now();

    const data = node.data;

    try {
      await appiumClient.closeApp({
        platform:
          data.platform,

        appPackage:
          data.appPackage,

        bundleId:
          data.bundleId,
      });

      const duration =
        performance.now() -
        startedAt;

      executionLogger.success({
        message:
          "Close App completed",

        nodeId: node.id,

        nodeType: data.action,

        nodeTitle:
          data.title,

        duration,

        details: {
          platform:
            data.platform,

          ...(data.platform ===
            "Android" && {
            appPackage:
              data.appPackage,
          }),

          ...(data.platform ===
            "iOS" && {
            bundleId:
              data.bundleId,
          }),
        },
      });

      return {
        outputs: [
          "next",
        ],
      };
    } catch (error) {
      const duration =
        performance.now() -
        startedAt;

      executionLogger.error({
        message:
          "Close App failed",

        nodeId: node.id,

        nodeType: data.action,

        nodeTitle:
          data.title,

        duration,

        details: {
          platform:
            data.platform,

          ...(data.platform ===
            "Android" && {
            appPackage:
              data.appPackage,
          }),

          ...(data.platform ===
            "iOS" && {
            bundleId:
              data.bundleId,
          }),

          reason:
            error instanceof
              Error
              ? error.message
              : String(
                error,
              ),
        },
      });

      throw error;
    }
  },
};