import { appiumClient } from "../services/AppiumClient";
import { resolveVariables } from "../variables/resolveVariable";
import type { NodeRunner } from "../types/NodeRunner";

export const inputRunner: NodeRunner = {
  async run(node) {
    if (node.data.action !== "input") {
      return;
    }

    const locator = resolveVariables(
      node.data.locator
    );

    const text = resolveVariables(
      node.data.text
    );

    await appiumClient.input(
      node.data.locatorStrategy,
      locator,
      text
    );
  },
};