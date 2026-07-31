import type { GetSizeNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";
import { resolveVariables } from "../variables/resolveVariable";

export const getSizeRunner: NodeRunner<GetSizeNodeData> = {
    async run(node) {
        if (node.data.action !== "getSize") {
            return;
        }

        const startedAt = performance.now();

        const data = node.data;

        const locator = resolveVariables(data.locator);

        try {
            const size = await appiumClient.getSize(
                data.locatorStrategy,
                locator,
            );

            storeResult(
                data.variableName,
                size,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Size completed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration,
                details: {
                    locator,
                    locatorStrategy: data.locatorStrategy,
                    variable: data.variableName,
                    width: size.width,
                    height: size.height,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Size failed",
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