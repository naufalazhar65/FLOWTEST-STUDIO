import { isAssertNode } from "../../flow/utils/nodeGuards";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { compare } from "../utils/assertCompare";
import { resolveVariables } from "../variables/resolveVariable";

export const assertRunner: NodeRunner = {
  async run(node) {
    if (!isAssertNode(node)) {
      return;
    }

    const actual = resolveVariables(node.data.actual);

    const expected = resolveVariables(node.data.expected);

    const passed = compare(
      actual,
      expected,
      node.data.operator,
    );

    const details = {
      actual,
      expected,
      operator: node.data.operator,
    };

    if (!passed) {
      executionLogger.error({
        message: "Assertion failed",
        nodeId: node.id,
        nodeType: node.type,
        nodeTitle: node.data.title,
        details,
      });

      throw new Error("Assertion failed");
    }

    executionLogger.success({
      message: "Assertion passed",
      nodeId: node.id,
      nodeType: node.type,
      nodeTitle: node.data.title,
      details,
    });
  },
};