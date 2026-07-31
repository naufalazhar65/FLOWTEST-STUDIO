import type { ScreenshotNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";

export const screenshotRunner: NodeRunner<ScreenshotNodeData> = {
  async run(node) {
    if (node.data.action !== "screenshot") {
      return;
    }

    const startedAt = performance.now();

    const data = node.data;

    try {
      await appiumClient.screenshot(
        data.fileName,
      );

      const duration = performance.now() - startedAt;

      executionLogger.success({
        message: "Screenshot completed",
        nodeId: node.id,
        nodeType: data.action,
        nodeTitle: data.title,
        duration,
        details: {
          fileName: data.fileName,
        },
      });

      return {
        outputs: ["next"],
      };
    } catch (error) {
      const duration = performance.now() - startedAt;

      executionLogger.error({
        message: "Screenshot failed",
        nodeId: node.id,
        nodeType: data.action,
        nodeTitle: data.title,
        duration,
        details: {
          fileName: data.fileName,
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