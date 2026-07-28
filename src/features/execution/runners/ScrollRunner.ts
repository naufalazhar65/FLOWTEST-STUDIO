import { appiumClient } from "../services/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";
import type { ScrollNodeData } from "../../flow/types/flowNode";

export const scrollRunner: NodeRunner = {
  async run(node, context) {
    void context;

    const data = node.data as ScrollNodeData;

    await appiumClient.scroll(
      data.direction,
      data.amount
    );
  },
};