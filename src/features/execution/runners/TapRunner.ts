import type {
    TapNodeData,
} from "../../flow/types/flowNode";

import {
    executionLogger,
} from "../services/executionLogger";

import {
    appiumClient,
} from "../services/appium/AppiumClient";

import type {
    NodeRunner,
} from "../types/NodeRunner";

import {
    resolveVariables,
} from "../variables/resolveVariable";

export const tapRunner: NodeRunner<TapNodeData> = {
    async run(node) {
        const startedAt =
            performance.now();

        const data =
            node.data;

        const locator =
            resolveVariables(
                data.locator,
            );

        try {
            await appiumClient.tap(
                data.locatorStrategy,
                locator,
            );

            const duration =
                performance.now() -
                startedAt;

            executionLogger.success({
                message:
                    "Tap completed",

                nodeId:
                    node.id,

                nodeType:
                    data.action,

                nodeTitle:
                    data.title,

                duration,

                details: {
                    locator,

                    locatorStrategy:
                        data.locatorStrategy,
                },
            });

            return {
                outputs: [
                    "next",
                ],
            };
        } catch (
            error
        ) {
            const duration =
                performance.now() -
                startedAt;

            executionLogger.error({
                message:
                    "Tap failed",

                nodeId:
                    node.id,

                nodeType:
                    data.action,

                nodeTitle:
                    data.title,

                duration,

                details: {
                    locator,

                    locatorStrategy:
                        data.locatorStrategy,

                    reason:
                        error instanceof Error
                            ? error.message
                            : String(
                                error,
                            ),
                },
            });

            throw error;
        }
    },
};