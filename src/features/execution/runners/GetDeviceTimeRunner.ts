import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";

export const getDeviceTimeRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getDeviceTime") {
            return;
        }

        const startedAt = performance.now();

        try {
            const deviceTime = await appiumClient.getDeviceTime();

            storeResult(
                node.data.variableName,
                deviceTime,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Device Time completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
                details: {
                    variable: node.data.variableName,
                    value: deviceTime,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Device Time failed",
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