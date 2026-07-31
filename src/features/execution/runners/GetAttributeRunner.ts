import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";
import { resolveVariables } from "../variables/resolveVariable";

export const getAttributeRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getAttribute") {
            return;
        }

        const startedAt = performance.now();

        const locator = resolveVariables(node.data.locator);
        const attribute = resolveVariables(node.data.attribute);

        try {
            const value = await appiumClient.getAttribute(
                node.data.locatorStrategy,
                locator,
                attribute,
            );

            storeResult(node.data.variableName, value);

            const elapsed = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Attribute completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration: elapsed,
                details: {
                    locator,
                    locatorStrategy: node.data.locatorStrategy,
                    attribute,
                    variable: node.data.variableName,
                    value,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const elapsed = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Attribute failed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration: elapsed,
                details: {
                    locator,
                    locatorStrategy: node.data.locatorStrategy,
                    attribute,
                    variable: node.data.variableName,
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