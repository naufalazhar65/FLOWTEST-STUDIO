import { appiumClient } from "../services/AppiumClient";
import { resolveNodeVariables } from "../variables/resolveNodeVariables";
import type { NodeRunner } from "../types/NodeRunner";

export const inputRunner: NodeRunner = {
  async run(node) {
    if (node.data.action !== "input") {
      return;
    }

    const data = resolveNodeVariables({
      locator: node.data.locator,
      text: node.data.text,
    });

    await appiumClient.input(
      node.data.locatorStrategy,
      data.locator,
      data.text
    );
  },
};