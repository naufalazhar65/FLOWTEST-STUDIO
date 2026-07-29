import type { FlowNode } from "../../flow/types/flowNode";
import type { NodeRunner } from "../types/NodeRunner";

import { evaluateExpression } from "../variables/evaluateExpression";

export const ifRunner: NodeRunner = {
    async run(node: FlowNode) {
        if (node.data.action !== "if") {
            return;
        }

        const passed = evaluateExpression(
            node.data.condition
        );

        return {
            outputs: [
                passed ? "true" : "false",
            ],
        };
    },
};