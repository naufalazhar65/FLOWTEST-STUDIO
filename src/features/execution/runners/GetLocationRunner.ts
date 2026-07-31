import type { GetLocationNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";
import { resolveVariables } from "../variables/resolveVariable";

export const getLocationRunner: NodeRunner<GetLocationNodeData> = {
    async run(node) {
        if (node.data.action !== "getLocation") {
            return;
        }

        const startedAt = performance.now();

        const data = node.data;

        const locator = resolveVariables(data.locator);

        try {
            const location = await appiumClient.getLocation(
                data.locatorStrategy,
                locator,
            );

            storeResult(data.variableName, location);

            const elapsed = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Location completed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration: elapsed,
                details: {
                    locator,
                    locatorStrategy: data.locatorStrategy,
                    variable: data.variableName,
                    x: location.x,
                    y: location.y,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const elapsed = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Location failed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration: elapsed,
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