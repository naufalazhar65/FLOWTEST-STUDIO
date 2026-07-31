import type { SwipeNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";

export const swipeRunner: NodeRunner<SwipeNodeData> = {
    async run(node, context) {
        void context;

        if (node.data.action !== "swipe") {
            return;
        }

        const startedAt = performance.now();

        const data = node.data;

        try {
            await appiumClient.swipe(
                data.direction,
                data.distance,
                data.duration,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Swipe completed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration,
                details: {
                    direction: data.direction,
                    distance: data.distance,
                    swipeDuration: data.duration,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Swipe failed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration,
                details: {
                    direction: data.direction,
                    distance: data.distance,
                    swipeDuration: data.duration,
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