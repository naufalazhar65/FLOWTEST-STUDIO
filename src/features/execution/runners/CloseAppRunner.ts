import { appiumClient } from "../services/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";
import type { CloseAppNodeData } from "../../flow/types/flowNode";

export const closeAppRunner: NodeRunner = {
  async run(node) {
    const data = node.data as CloseAppNodeData;

    await appiumClient.closeApp(
      data.appPackage
    );
  },
};