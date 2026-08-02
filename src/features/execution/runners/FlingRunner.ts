import type { FlingNodeData } from "../../flow/types/flowNode";

import { executionLogger } from "../services/executionLogger";
import { appiumClient } from "../services/appium/AppiumClient";

import type { NodeRunner } from "../types/NodeRunner";

import { resolveVariables } from "../variables/resolveVariable";

export const flingRunner: NodeRunner<FlingNodeData> = {
    async run(node) {
        const startedAt = performance.now();

        const data = node.data;

        const locator = resolveVariables(
            data.locator,
        );

        try {
            await appiumClient.fling(
                data.locatorStrategy,
                locator,
                data.direction,
                data.speed,
            );

            const duration =
                performance.now() - startedAt;

            executionLogger.success({
                message: "Fling completed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration,
                details: {
                    locator,
                    locatorStrategy:
                        data.locatorStrategy,
                    direction:
                        data.direction,
                    speed: data.speed,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration =
                performance.now() - startedAt;

            executionLogger.error({
                message: "Fling failed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration,
                details: {
                    locator,
                    locatorStrategy:
                        data.locatorStrategy,
                    direction:
                        data.direction,
                    speed: data.speed,
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