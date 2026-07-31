import type { GetEnabledNodeData } from "../../flow/types/flowNode";

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import type { NodeRunner } from "../types/NodeRunner";
    import { executeGetter } from "../utils/executeGetter";
import { resolveVariables } from "../variables/resolveVariable";

export const getEnabledRunner: NodeRunner = {
    async run(node) {
        if (node.data.action !== "getEnabled") {
            return;
        }

        const startedAt = performance.now();

        const data = node.data as GetEnabledNodeData;

        const locator = resolveVariables(data.locator);

        try {
            const value = await executeGetter(
                () =>
                    appiumClient.isEnabled(
                        data.locatorStrategy,
                        locator,
                    ),
                {
                    variableName: data.variableName,
                    label: "Element Enabled",
                },
            );

            const elapsed = performance.now() - startedAt;

            executionLogger.success({
                message: "Get Enabled completed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
                duration: elapsed,
                details: {
                    locator,
                    locatorStrategy: data.locatorStrategy,
                    variable: data.variableName,
                    value,
                },
            });

            return value;
        } catch (error) {
            const elapsed = performance.now() - startedAt;

            executionLogger.error({
                message: "Get Enabled failed",
                nodeId: node.id,
                nodeType: node.data.action,
                nodeTitle: node.data.title,
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