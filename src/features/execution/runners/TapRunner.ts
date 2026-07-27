import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";

export const tapRunner: NodeRunner = {
  async run(node) {
    if (node.data.action !== "tap") {
      return;
    }

    await appiumClient.tap(
      node.data.locatorStrategy,
      node.data.locator
    );
  },
};