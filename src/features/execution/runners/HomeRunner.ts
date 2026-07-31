import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";

export const homeRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "home") {
            return;
        }

        const startedAt = performance.now();

        try {
            await appiumClient.home();

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Home completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Home failed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
                details: {
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