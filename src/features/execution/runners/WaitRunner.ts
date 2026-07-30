import { appiumClient } from "../services/appium/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";
import type { WaitNodeData } from "../../flow/types/flowNode";

export const waitRunner: NodeRunner = {
  async run(node, context) {
    void context;

    const data = node.data as WaitNodeData;

    await appiumClient.waitUntilElement(
      data.locatorStrategy,
      data.locator,
      data.timeout,
      data.pollingInterval
    );
  },
};