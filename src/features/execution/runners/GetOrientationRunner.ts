import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";

export const getOrientationRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getOrientation") {
            return;
        }

        const startedAt = performance.now();

        try {
            const orientation = await appiumClient.getOrientation();

            storeResult(
                node.data.variableName,
                orientation,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Orientation completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
                details: {
                    variable: node.data.variableName,
                    value: orientation,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Orientation failed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
                details: {
                    variable: node.data.variableName,
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