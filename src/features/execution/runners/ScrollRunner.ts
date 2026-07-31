import type { ScrollNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";

export const scrollRunner: NodeRunner<ScrollNodeData> = {
    async run(node, context) {
        void context;

        if (node.data.action !== "scroll") {
            return;
        }

        const startedAt = performance.now();

        const data = node.data;

        try {
            await appiumClient.scroll(
                data.direction,
                data.amount,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Scroll completed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration,
                details: {
                    direction: data.direction,
                    amount: data.amount,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Scroll failed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration,
                details: {
                    direction: data.direction,
                    amount: data.amount,
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