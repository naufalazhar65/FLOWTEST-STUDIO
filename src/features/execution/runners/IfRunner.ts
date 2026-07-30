import type { IfNodeData } from "../../flow/types/flowNode";
import type { NodeRunner } from "../types/NodeRunner";
import { compare } from "../utils/assertCompare";
import { resolveVariables } from "../variables/resolveVariable";

export const ifRunner: NodeRunner<IfNodeData> = {
    async run(node) {
        const actual = resolveVariables(node.data.actual);

        const expected = resolveVariables(node.data.expected);

        const passed = compare(
            actual,
            expected,
            node.data.operator,
        );

        return {
            outputs: [passed ? "true" : "false"],
        };
    },
};