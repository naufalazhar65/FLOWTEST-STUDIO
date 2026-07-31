import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { setVariable } from "../variables/VariableStore";
import { resolveVariables } from "../variables/resolveVariable";

export const setVariableRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "setVariable") {
            return;
        }

        const startedAt = performance.now();

        const value = resolveVariables(node.data.value);

        try {
            setVariable(
                node.data.variableName,
                value,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Set Variable completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
                details: {
                    variable: node.data.variableName,
                    value,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Set Variable failed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
                details: {
                    variable: node.data.variableName,
                    value,
                    reason:
                        error instanceof Error
                            ? error.message
                            : String(error),
                },
            });

            throw error;
        }
    },
};