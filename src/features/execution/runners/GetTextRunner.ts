import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { executeElementGetter } from "../utils/executeElementGetter";
import { resolveVariables } from "../variables/resolveVariable";

import { isGetTextNode } from "../../flow/utils/nodeGuards";

export const getTextRunner: NodeRunner = {
    async run(node) {
        if (!isGetTextNode(node)) {
            return;
        }

        const startedAt = performance.now();

        const locator = resolveVariables(node.data.locator);

        try {
            const value = await executeElementGetter(
                () =>
                    appiumClient.getText(
                        node.data.locatorStrategy,
                        locator,
                    ),
                node.data.variableName,
                "Text",
            );

            const elapsed = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Text completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration: elapsed,
                details: {
                    locator,
                    locatorStrategy: node.data.locatorStrategy,
                    variable: node.data.variableName,
                    value,
                },
            });

            return value;
        } catch (error) {
            const elapsed = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Text failed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration: elapsed,
                details: {
                    locator,
                    locatorStrategy: node.data.locatorStrategy,
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