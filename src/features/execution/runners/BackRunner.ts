import { appiumClient } from "../services/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";

export const backRunner: NodeRunner = {
  async run() {
    await appiumClient.back();
  },
};