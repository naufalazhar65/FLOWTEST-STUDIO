import { isTapNode } from "../../flow/utils/nodeGuards";
import { appiumClient } from "../services/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { resolveVariables } from "../variables/resolveVariable";

export const tapRunner: NodeRunner = {
  async run(node) {
    if (!isTapNode(node)) {
      return;
    }

    const locator = resolveVariables(
      node.data.locator,
    );

    await appiumClient.tap(
      node.data.locatorStrategy,
      locator,
    );
  },
};