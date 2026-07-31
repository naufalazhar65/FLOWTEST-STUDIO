import type { IfNodeData } from "../../flow/types/flowNode";

import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { compare } from "../utils/assertCompare";
import { resolveVariables } from "../variables/resolveVariable";

export const ifRunner: NodeRunner<IfNodeData> = {
    async run(node) {
        if (node.data.action !== "if") {
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

        const duration = performance.now() - startedAt;

        executionLogger.success({
            message: `Condition evaluated: ${passed}`,
            nodeId: node.id,
            nodeType: node.data.action,
            nodeTitle: node.data.title,
            duration,
            details: {
                actual,
                expected,
                operator: node.data.operator,
                result: passed,
                output: passed ? "true" : "false",
            },
        });

        return {
            outputs: [passed ? "true" : "false"],
        };
    },
};