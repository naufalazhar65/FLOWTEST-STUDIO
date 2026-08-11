import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";
import type { RunnerResult } from "../types/RunnerResult";

import { getRunner } from "../services/runnerRegistry";
import { executionLogger } from "../services/executionLogger";
import { appiumClient } from "../services/appium/AppiumClient";
import { useExecutionStore } from "../store/useExecutionStore";

export async function executeNode(
    node: FlowNode,
    context: ExecutionContext,
): Promise<RunnerResult> {
    const execution =
        useExecutionStore.getState();

    const runner =
        getRunner(node.data.action);

    const startedAt =
        Date.now();

    execution.setCurrentNode(
        node.id,
    );

    execution.setNodeStatus(
        node.id,
        "running",
    );

    executionLogger.info({
        message:
            "Executing node",

        nodeId: node.id,

        nodeType:
            node.data.action,

        nodeTitle:
            node.data.title,
    });

    try {
        const result =
            await runner.run(
                node,
                context,
            );

        const finishedAt =
            Date.now();

        const duration =
            finishedAt -
            startedAt;

        execution.setNodeStatus(
            node.id,
            "passed",
        );

        execution.setNodeResult({
            nodeId: node.id,

            nodeType:
                node.data.action,

            nodeTitle:
                node.data.title,

            status: "passed",

            startedAt,

            finishedAt,

            duration,
        });

        execution.completeNode(
            true,
        );

        return (
            result ?? {
                outputs: ["next"],
            }
        );
    } catch (error) {
        const finishedAt =
            Date.now();

        const duration =
            finishedAt -
            startedAt;

        const errorMessage =
            error instanceof Error
                ? error.message
                : String(error);

        let screenshot:
            | string
            | undefined;

        try {
            screenshot =
                await appiumClient.takeScreenshot();
        } catch (screenshotError) {
            console.warn(
                "Failed to capture failure screenshot.",
                screenshotError,
            );
        }

        execution.setNodeStatus(
            node.id,
            "failed",
        );

        execution.setNodeResult({
            nodeId: node.id,

            nodeType:
                node.data.action,

            nodeTitle:
                node.data.title,

            status: "failed",

            startedAt,

            finishedAt,

            duration,

            error: errorMessage,

            screenshot,
        });

        execution.completeNode(
            false,
        );

        executionLogger.error({
            message:
                "Node execution failed",

            nodeId: node.id,

            nodeType:
                node.data.action,

            nodeTitle:
                node.data.title,

            duration,

            details: {
                reason:
                    errorMessage,
            },
        });

        throw error;
    } finally {
        execution.setCurrentNode(
            null,
        );
    }
}