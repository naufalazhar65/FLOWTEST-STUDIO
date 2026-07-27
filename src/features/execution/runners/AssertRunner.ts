import { appiumClient } from "../services/AppiumClient";
import { resolveVariables } from "../variables/resolveVariable";
import type { NodeRunner } from "../types/NodeRunner";

export const assertRunner: NodeRunner = {
  async run(node) {
    if (node.data.action !== "assert") {
      return;
    }

    const expected =
      resolveVariables(
        node.data.expected
      );

    await appiumClient.assert(
      node.data.locatorStrategy,
      node.data.locator,
      expected
    );
  },
};