import { tapRunner } from "../runners/TapRunner";
import { inputRunner } from "../runners/InputRunner";
import { assertRunner } from "../runners/AssertRunner";
import { setVariableRunner } from "../runners/SetVariableRunner";
import { delayRunner } from "../runners/DelayRunner";

import type { NodeRunner } from "../types/NodeRunner";
import type { NodeAction } from "../../flow/types/flowNode";
import { swipeRunner } from "../runners/SwipeRunner";
import { scrollRunner } from "../runners/ScrollRunner";

const registry = new Map<NodeAction, NodeRunner>([
  ["tap", tapRunner],
  ["input", inputRunner],
  ["assert", assertRunner],
  ["setVariable", setVariableRunner],
  ["delay", delayRunner],
  ["swipe", swipeRunner],
  ["scroll", scrollRunner],
]);

export function getRunner(
  action: NodeAction
): NodeRunner {
  const runner = registry.get(action);

  if (!runner) {
    throw new Error(
      `No runner registered for ${action}`
    );
  }

  return runner;
}