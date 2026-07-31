import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";

export const backRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "back") {
            return;
        }

        const startedAt = performance.now();

        try {
            await appiumClient.back();

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Back completed",
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
                message: "Back failed",
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