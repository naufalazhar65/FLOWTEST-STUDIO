import { appiumClient } from "../services/appium/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";
import type { ScreenshotNodeData } from "../../flow/types/flowNode";

export const screenshotRunner: NodeRunner = {
  async run(node) {
    const data =
      node.data as ScreenshotNodeData;

    await appiumClient.screenshot(
      data.fileName
    );
  },
};