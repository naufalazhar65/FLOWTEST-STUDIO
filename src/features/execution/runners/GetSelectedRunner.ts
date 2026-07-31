import type { GetSelectedNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { executeGetter } from "../utils/executeGetter";
import { resolveVariables } from "../variables/resolveVariable";

export const getSelectedRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getSelected") {
            return;
        }

        const startedAt = performance.now();

        const data = node.data as GetSelectedNodeData;

        const locator = resolveVariables(data.locator);

        try {
            const value = await executeGetter(
                () =>
                    appiumClient.isSelected(
                        data.locatorStrategy,
                        locator,
                    ),
                {
                    variableName: data.variableName,
                    label: "Element Selected",
                },
            );

            const elapsed = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Selected completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration: elapsed,
                details: {
                    locator,
                    locatorStrategy: data.locatorStrategy,
                    variable: data.variableName,
                    value,
                },
            });

            return value;
        } catch (error) {
            const elapsed = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Selected failed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration: elapsed,
                details: {
                    locator,
                    locatorStrategy: data.locatorStrategy,
                    variable: data.variableName,
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