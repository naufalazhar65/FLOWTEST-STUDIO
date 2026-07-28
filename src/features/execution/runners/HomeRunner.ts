import { appiumClient } from "../services/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";

export const homeRunner: NodeRunner = {
  async run() {
    await appiumClient.home();
  },
};