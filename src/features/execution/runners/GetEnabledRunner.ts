import type { GetEnabledNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
import { storeResult } from "../utils/storeResult";
import { resolveVariables } from "../variables/resolveVariable";

export const getEnabledRunner: NodeRunner<GetEnabledNodeData> = {
    async run(node) {
        if (node.data.action !== "getEnabled") {
            return;
        }

        const startedAt = performance.now();

        const data = node.data;

        const locator = resolveVariables(data.locator);

        try {
            const value = await appiumClient.isEnabled(
                data.locatorStrategy,
                locator,
            );

            storeResult(
                data.variableName,
                value,
            );

            const duration = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Enabled completed",
                nodeId: node.id,
                nodeType: data.action,
                nodeTitle: data.title,
                duration,
                details: {
                    locator,
                    locatorStrategy: data.locatorStrategy,
                    variable: data.variableName,
                    value,
                },
            });

            return {
                outputs: ["next"],
            };
        } catch (error) {
            const duration = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Enabled failed",
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