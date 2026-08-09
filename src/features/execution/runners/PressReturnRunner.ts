import { executionLogger } from "../services/executionLogger";
import { appiumClient } from "../services/appium/AppiumClient";
import type { NodeRunner } from "../types/NodeRunner";

export const pressReturnRunner: NodeRunner = {
    async run(node) {
        const startedAt =
            performance.now();

        const data = node.data;

        try {
            await appiumClient.pressReturn();

            const duration =
                performance.now() -
                startedAt;

            executionLogger.success({
                message:
                    "Press Return completed",

                nodeId: node.id,

                nodeType:
                    data.action,

                nodeTitle:
                    data.title,

                duration,

                details: {},
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
                    "Press Return failed",

                nodeId: node.id,

                nodeType:
                    data.action,

                nodeTitle:
                    data.title,

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