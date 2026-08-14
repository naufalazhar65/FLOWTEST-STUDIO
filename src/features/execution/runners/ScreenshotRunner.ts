import type { ScreenshotNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";

export const screenshotRunner: NodeRunner<ScreenshotNodeData> = {
  async run(node) {
    if (node.data.action !== "screenshot") {
      return;
    }

    const startedAt =
      performance.now();

    const data =
      node.data;

    const fileName =
      data.fileName.trim() ||
      `screenshot-${node.id}.png`;

    try {
      const screenshot =
        await appiumClient.screenshot(
          fileName,
        );

      const duration =
        performance.now() -
        startedAt;

      executionLogger.success({
        message:
          "Screenshot completed",

        nodeId:
          node.id,

        nodeType:
          data.action,

        nodeTitle:
          data.title,

        duration,

        details: {
          fileName,
        },
      });

      return {
        outputs: ["next"],

        screenshot,

        screenshotFileName:
          fileName,
      };
    } catch (error) {
      const duration =
        performance.now() -
        startedAt;

      executionLogger.error({
        message:
          "Screenshot failed",

        nodeId:
          node.id,

        nodeType:
          data.action,

        nodeTitle:
          data.title,

        duration,

        details: {
          fileName,

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