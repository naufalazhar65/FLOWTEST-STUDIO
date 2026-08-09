import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";

export const hideKeyboardRunner: NodeRunner = {
    async run(node) {
        if (
            node.data.action !==
            "hideKeyboard"
        ) {
            return;
        }

        const startedAt =
            performance.now();

        try {
            await appiumClient.hideKeyboard();

            const duration =
                performance.now() -
                startedAt;

            executionLogger.success({
                message:
                    "Keyboard hidden",
                nodeId: node.id,
                nodeType:
                    node.data.action,
                nodeTitle:
                    node.data.title,
                duration,
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration =
                performance.now() -
                startedAt;

            executionLogger.error({
                message:
                    "Failed to hide keyboard",
                nodeId: node.id,
                nodeType:
                    node.data.action,
                nodeTitle:
                    node.data.title,
                duration,
                details: {
                    reason:
                        error instanceof Error
                            ? error.message
                            : String(
                                error,
                            ),
                },
            });

            throw error;
        }
    },
};