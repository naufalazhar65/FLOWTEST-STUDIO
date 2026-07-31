import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";

export const getPlatformVersionRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getPlatformVersion") {
            return;
        }

        const startedAt = performance.now();

        try {
            const platformVersion =
                await appiumClient.getPlatformVersion();

            storeResult(
                node.data.variableName,
                platformVersion,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Platform Version completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
                details: {
                    variable: node.data.variableName,
                    value: platformVersion,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Platform Version failed",
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