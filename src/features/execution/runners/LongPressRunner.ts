import { isLongPressNode } from "../../flow/utils/nodeGuards";

import { executionLogger } from "../services/executionLogger";
import { appiumClient } from "../services/appium/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";

import { resolveVariables } from "../variables/resolveVariable";

export const longPressRunner: NodeRunner = {
    async run(node) {
        if (!isLongPressNode(node)) {
            return;
        }

        const start = performance.now();

        const locator = resolveVariables(
            node.data.locator,
        );

        try {
            await appiumClient.longPress(
                node.data.locatorStrategy,
                locator,
                node.data.duration,
            );

            const duration =
                performance.now() - start;

            executionLogger.success({
                message: "Long Press completed",

                nodeId: node.id,

                nodeType: node.type,

                nodeTitle: node.data.title,

                duration,

                details: {
                    locator,

                    locatorStrategy:
                        node.data.locatorStrategy,

                    pressDuration:
                        node.data.duration,
                },
            });
        } catch (error) {
            const duration =
                performance.now() - start;

            executionLogger.error({
                message: "Long Press failed",

                nodeId: node.id,

                nodeType: node.type,

                nodeTitle: node.data.title,

                duration,

                details: {
                    locator,

                    locatorStrategy:
                        node.data.locatorStrategy,

                    pressDuration:
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