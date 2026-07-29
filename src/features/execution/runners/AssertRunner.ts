import { isAssertNode } from "../../flow/utils/nodeGuards";
import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { resolveVariables } from "../variables/resolveVariable";

export const assertRunner: NodeRunner = {
  async run(node) {
    if (!isAssertNode(node)) {
      return;
    }

    const locator = resolveVariables(
      node.data.locator,
    );

    const expected = resolveVariables(
      node.data.expected,
    );

    await appiumClient.assert(
      node.data.locatorStrategy,
      locator,
      expected,
    );
  },
};