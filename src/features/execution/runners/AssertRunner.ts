import { isAssertNode } from "../../flow/utils/nodeGuards";
import type { NodeRunner } from "../types/NodeRunner";
import { resolveVariables } from "../variables/resolveVariable";
import { compare } from "../utils/assertCompare";

export const assertRunner: NodeRunner = {
  async run(node) {
    if (!isAssertNode(node)) {
      return;
    }

    const actual = resolveVariables(
      node.data.actual,
    );

    const expected = resolveVariables(
      node.data.expected,
    );

    const passed = compare(
      actual,
      expected,
      node.data.operator,
    );

    if (!passed) {
      throw new Error(
        [
          "Assertion failed",
          `Actual   : ${actual}`,
          `Expected : ${expected}`,
          `Operator : ${node.data.operator}`,
        ].join("\n"),
      );
    }
  },
};