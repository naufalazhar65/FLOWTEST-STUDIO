import { appiumClient } from "../services/AppiumClient";
import { resolveVariables } from "../variables/resolveVariable";
import type { NodeRunner } from "../types/NodeRunner";

export const inputRunner: NodeRunner = {
  async run(node) {
    if (node.data.action !== "input") {
      return;
    }

    const text = resolveVariables(
      node.data.text
    );

    await appiumClient.input(
      node.data.locatorStrategy,
      node.data.locator,
      text
    );
  },
};