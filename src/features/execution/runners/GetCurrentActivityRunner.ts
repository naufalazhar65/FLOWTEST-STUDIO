import { executionLogger } from "../services/executionLogger";
import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";

export const getCurrentActivityRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getCurrentActivity") {
            return;
        }

        const startedAt = performance.now();

        try {
            const activity = await appiumClient.getCurrentActivity();

            storeResult(
                node.data.variableName,
                activity,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Current Activity completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
                details: {
                    variable: node.data.variableName,
                    value: activity,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Current Activity failed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
                details: {
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