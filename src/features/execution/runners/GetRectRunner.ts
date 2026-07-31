import type { GetRectNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";
import { resolveVariables } from "../variables/resolveVariable";

export const getRectRunner: NodeRunner<GetRectNodeData> = {
    async run(node) {
        if (node.data.action !== "getRect") {
            return;
        }

        const startedAt = performance.now();

        const data = node.data;

        const locator = resolveVariables(data.locator);

        try {
            const rect = await appiumClient.getRect(
                data.locatorStrategy,
                locator,
            );

            storeResult(
                data.variableName,
                rect,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Rect completed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration,
                details: {
                    locator,
                    locatorStrategy: data.locatorStrategy,
                    variable: data.variableName,
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Rect failed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration,
                details: {
                    locator,
                    locatorStrategy: data.locatorStrategy,
                    variable: data.variableName,
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