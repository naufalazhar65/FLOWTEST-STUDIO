import { executionLogger } from "../services/executionLogger";
import { appiumClient } from "../services/appium/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";
import type { PinchNodeData } from "../../flow/types/flowNode";

import { resolveVariables } from "../variables/resolveVariable";

export const pinchRunner: NodeRunner<PinchNodeData> = {
    async run(node) {
        const start = performance.now();

        const locator = resolveVariables(
            node.data.locator,
        );

        try {
            await appiumClient.pinch(
                node.data.locatorStrategy,
                locator,
                node.data.percent,
                node.data.duration,
            );

            const duration =
                performance.now() - start;

            executionLogger.success({
                message: "Pinch completed",

                nodeId: node.id,

                nodeType: node.type,

                nodeTitle: node.data.title,

                duration,

                details: {
                    locator,

                    locatorStrategy:
                        node.data.locatorStrategy,

                    percent:
                        node.data.percent,
                },
            });
        } catch (error) {
            const duration =
                performance.now() - start;

            executionLogger.error({
                message: "Pinch failed",

                nodeId: node.id,

                nodeType: node.type,

                nodeTitle: node.data.title,

                duration,

                details: {
                    locator,

                    locatorStrategy:
                        node.data.locatorStrategy,

                    percent:
                        node.data.percent,

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