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
    getRunner,
} from "../services/runnerRegistry";

import {
    shouldRetryFailure,
} from "../services/retryPolicy";

import {
    classifyFailure,
} from "../services/classifyFailure";

import type {
    FailureContext,
} from "../services/buildFailureContext";

export interface RunNodeWithRetryOptions {
    maxAttempts?: number;

    retryDelayMs?: number;

    enableRetry?: boolean;
}

export interface RunNodeWithRetryResult {
    result: RunnerResult;

    attempts: number;

    retries: number;

    retryReason?: string;
}

export async function runNodeWithRetry(
    node: FlowNode,
    context: ExecutionContext,
    options: RunNodeWithRetryOptions = {},
): Promise<RunNodeWithRetryResult> {
    const maxAttempts =
        options.maxAttempts ?? 2;

    const retryDelayMs =
        options.retryDelayMs ?? 500;

    const enableRetry =
        options.enableRetry ?? false;

    const runner =
        getRunner(
            node.data.action,
        );

    let attempts = 0;

    let retryReason:
        | string
        | undefined;

    while (
        attempts <
        maxAttempts
    ) {
        attempts += 1;

        try {
            const result =
                await runner.run(
                    node,
                    context,
                );

            return {
                result:
                    result ?? {
                        outputs: [
                            "next",
                        ],
                    },

                attempts,

                retries:
                    attempts - 1,

                ...(retryReason
                    ? {
                          retryReason,
                      }
                    : {}),
            };
        } catch (error) {
            if (
                !enableRetry ||
                attempts >=
                    maxAttempts
            ) {
                throw error;
            }

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : String(error);

            const failureContext:
                FailureContext = {
                node: {
                    id:
                        node.id,

                    action:
                        node.data.action,

                    title:
                        node.data.title,

                    subtitle:
                        node.data.subtitle,

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

                    text:
                        "text" in
                        node.data
                            ? node.data.text
                            : undefined,
                },

                execution: {
                    nodeId:
                        node.id,

                    nodeType:
                        node.data.action,

                    nodeTitle:
                        node.data.title,

                    status:
                        "failed",

                    startedAt:
                        Date.now(),

                    finishedAt:
                        Date.now(),

                    duration:
                        0,

                    error:
                        errorMessage,
                },

                previousNodeIds:
                    [],

                previousNodes:
                    [],

                nextNodeIds:
                    [],

                nextNodes:
                    [],
            };

            const classification =
                classifyFailure(
                    failureContext,
                );

            const decision =
                shouldRetryFailure(
                    classification,
                    {
                        maxAttempts,

                        retryDelayMs,
                    },
                );

            if (
                !decision.retryable
            ) {
                throw error;
            }

            retryReason =
                decision.reason;

            if (
                decision.retryDelayMs >
                0
            ) {
                await new Promise<void>(
                    (
                        resolve,
                    ) =>
                        setTimeout(
                            resolve,
                            decision.retryDelayMs,
                        ),
                );
            }
        }
    }

    throw new Error(
        "Node retry loop exited unexpectedly.",
    );
}