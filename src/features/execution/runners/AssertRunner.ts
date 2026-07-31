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

    const startedAt = performance.now();

    const actual = resolveVariables(node.data.actual);
    const expected = resolveVariables(node.data.expected);

    const passed = compare(
      actual,
      expected,
      node.data.operator,
    );

    const elapsed = performance.now() - startedAt;

    const details = {
      actual,
      expected,
      operator: node.data.operator,
    };

    if (!passed) {
      executionLogger.error({
        message: "Assertion failed",
        nodeId: node.id,
        nodeType: node.data.action,
        nodeTitle: node.data.title,
        duration: elapsed,
        details,
      });

      throw new Error("Assertion failed");
    }

    executionLogger.success({
      message: "Assertion passed",
      nodeId: node.id,
      nodeType: node.data.action,
      nodeTitle: node.data.title,
      duration: elapsed,
      details,
    });

    return {
      outputs: ["next"],
    };
  },
};