import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    ExecutionContext,
} from "../types/ExecutionContext";

import type {
    RunnerResult,
} from "../types/RunnerResult";

import {
    executionLogger,
} from "../services/executionLogger";

import {
    appiumClient,
} from "../services/appium/AppiumClient";

import {
    appiumSession,
} from "../services/appium/AppiumSession";

import {
    useExecutionStore,
} from "../store/useExecutionStore";

import {
    runNodeWithRetry,
} from "./runNodeWithRetry";

export async function executeNode(
    node: FlowNode,
    context: ExecutionContext,
): Promise<RunnerResult> {
    const execution =
        useExecutionStore.getState();

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

        nodeId:
            node.id,

        nodeType:
            node.data.action,

        nodeTitle:
            node.data.title,
    });

    try {
        const retryResult =
            await runNodeWithRetry(
                node,
                context,
                {
                    enableRetry:
                        context.retry?.enabled ??
                        false,

                    maxAttempts:
                        context.retry?.maxAttempts ??
                        2,

                    retryDelayMs:
                        context.retry?.retryDelayMs ??
                        500,
                },
            );

        const result =
            retryResult.result;

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
            nodeId:
                node.id,

            nodeType:
                node.data.action,

            nodeTitle:
                node.data.title,

            status:
                "passed",

            attempts:
                retryResult.attempts,

            retries:
                retryResult.retries,

            retryReason:
                retryResult.retryReason,

            locatorStrategy:
                "locatorStrategy" in
                    node.data
                    ? node.data
                        .locatorStrategy
                    : null,

            locator:
                "locator" in
                    node.data
                    ? node.data
                        .locator
                    : null,

            startedAt,

            finishedAt,

            duration,

            screenshot:
                result?.screenshot,

            screenshotFileName:
                result?.screenshotFileName,
        });

        executionLogger.success({
            message:
                "Node execution completed",

            nodeId:
                node.id,

            nodeType:
                node.data.action,

            nodeTitle:
                node.data.title,

            duration,

            details: {
                attempts:
                    retryResult.attempts,

                retries:
                    retryResult.retries,

                ...(retryResult.retryReason
                    ? {
                        retryReason:
                            retryResult.retryReason,
                    }
                    : {}),
            },
        });

        execution.completeNode(
            true,
        );

        return (
            result ?? {
                outputs: [
                    "next",
                ],
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

        let pageSource:
            | string
            | undefined;

        if (
            appiumSession.hasSession()
        ) {
            try {
                screenshot =
                    await appiumClient.takeScreenshot();
            } catch (
            screenshotError
            ) {
                console.warn(
                    "Failed to capture failure screenshot.",
                    screenshotError,
                );
            }

            try {
                pageSource =
                    await appiumClient.getPageSource();
            } catch (
            pageSourceError
            ) {
                console.warn(
                    "Failed to capture failure page source.",
                    pageSourceError,
                );
            }
        }

        execution.setNodeStatus(
            node.id,
            "failed",
        );

        execution.setNodeResult({
            nodeId:
                node.id,

            nodeType:
                node.data.action,

            nodeTitle:
                node.data.title,

            status:
                "failed",

            attempts:
                context.retry?.enabled
                    ? context.retry.maxAttempts ??
                    2
                    : 1,

            retries:
                0,

            locatorStrategy:
                "locatorStrategy" in
                    node.data
                    ? node.data
                        .locatorStrategy
                    : null,

            locator:
                "locator" in
                    node.data
                    ? node.data
                        .locator
                    : null,

            startedAt,

            finishedAt,

            duration,

            error:
                errorMessage,

            screenshot,

            pageSource,
        });

        executionLogger.error({
            message:
                "Node execution failed",

            nodeId:
                node.id,

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

        execution.completeNode(
            false,
        );

        throw error;
    } finally {
        execution.setCurrentNode(
            null,
        );
    }
}