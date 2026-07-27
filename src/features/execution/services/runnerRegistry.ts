import { tapRunner } from "../runners/TapRunner";
import { inputRunner } from "../runners/InputRunner";
import { assertRunner } from "../runners/AssertRunner";
import { setVariableRunner } from "../runners/SetVariableRunner";

import type { NodeRunner } from "../types/NodeRunner";
import type { NodeAction } from "../../flow/types/flowNode";

const registry = new Map<NodeAction, NodeRunner>([
  ["tap", tapRunner],
  ["input", inputRunner],
  ["assert", assertRunner],
  ["setVariable", setVariableRunner],
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