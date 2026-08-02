import { isDragNode } from "../../flow/utils/nodeGuards";

import { executionLogger } from "../services/executionLogger";
import { appiumClient } from "../services/appium/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";

import { resolveVariables } from "../variables/resolveVariable";

export const dragRunner: NodeRunner = {
    async run(node) {
        if (!isDragNode(node)) {
            return;
        }

        const start = performance.now();

        const locator = resolveVariables(
            node.data.locator,
        );

        try {
            await appiumClient.drag(
                node.data.locatorStrategy,
                locator,
                node.data.direction,
                node.data.distance,
                node.data.duration,
            );

            const duration =
                performance.now() - start;

            executionLogger.success({
                message: "Drag completed",

                nodeId: node.id,

                nodeType: node.type,

                nodeTitle: node.data.title,

                duration,

                details: {
                    locator,

                    locatorStrategy:
                        node.data.locatorStrategy,

                    direction:
                        node.data.direction,

                    distance:
                        node.data.distance,

                    dragDuration:
                        node.data.duration,
                },
            });
        } catch (error) {
            const duration =
                performance.now() - start;

            executionLogger.error({
                message: "Drag failed",

                nodeId: node.id,

                nodeType: node.type,

                nodeTitle: node.data.title,

                duration,

                details: {
                    locator,

                    locatorStrategy:
                        node.data.locatorStrategy,

                    direction:
                        node.data.direction,

                    distance:
                        node.data.distance,

                    dragDuration:
                        node.data.duration,

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