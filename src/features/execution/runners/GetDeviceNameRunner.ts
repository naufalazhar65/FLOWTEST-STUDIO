import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";

export const getDeviceNameRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getDeviceName") {
            return;
        }

        const startedAt = performance.now();

        try {
            const deviceName = await appiumClient.getDeviceName();

            storeResult(
                node.data.variableName,
                deviceName,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Device Name completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
                details: {
                    variable: node.data.variableName,
                    value: deviceName,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Device Name failed",
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