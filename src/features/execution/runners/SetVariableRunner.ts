import type { NodeRunner } from "../types/NodeRunner";

import { setVariable } from "../variables/VariableStore";
import { resolveVariables } from "../variables/resolveVariable";

export const setVariableRunner: NodeRunner = {
  async run(node) {
    if (node.data.action !== "setVariable") {
      return;
    }

    setVariable(
      node.data.variableName,
      resolveVariables(node.data.value)
    );
  },
};