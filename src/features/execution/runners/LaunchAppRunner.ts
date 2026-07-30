import { appiumClient } from "../services/appium/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";
import type { LaunchAppNodeData } from "../../flow/types/flowNode";

export const launchAppRunner: NodeRunner = {
  async run(node) {
    const data = node.data as LaunchAppNodeData;

    await appiumClient.launchApp(
      data.appPackage,
      data.appActivity,
      data.noReset
    );
  },
};