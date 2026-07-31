import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";

export const getCurrentPackageRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getCurrentPackage") {
            return;
        }

        const startedAt = performance.now();

        try {
            const packageName = await appiumClient.getCurrentPackage();

            storeResult(
                node.data.variableName,
                packageName,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Current Package completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration,
                details: {
                    variable: node.data.variableName,
                    value: packageName,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Current Package failed",
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