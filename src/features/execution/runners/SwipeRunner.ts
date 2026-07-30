import { appiumClient } from "../services/appium/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";
import type { SwipeNodeData } from "../../flow/types/flowNode";

export const swipeRunner: NodeRunner = {
  async run(node, context) {
    void context;

    const data = node.data as SwipeNodeData;

    await appiumClient.swipe(
      data.direction,
      data.distance,
      data.duration
    );
  },
};