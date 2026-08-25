import type {
    FailureClassification,
} from "./classifyFailure";

import {
    shouldRetryFailure,
} from "./retryPolicy";

export interface ExecuteWithRetryOptions {
    maxAttempts?: number;

    retryDelayMs?: number;

    classifyFailure(
        error: unknown,
    ): FailureClassification;
}

export interface ExecuteWithRetryResult<T> {
    value: T;

    attempts: number;

    retries: number;
}

export async function executeWithRetry<T>(
    execute: () => Promise<T>,
    options: ExecuteWithRetryOptions,
): Promise<
    ExecuteWithRetryResult<T>
> {
    const policy =
        shouldRetryFailure(
            options.classifyFailure(
                new Error(
                    "Initial retry policy placeholder",
                ),
            ),
            {
                maxAttempts:
                    options.maxAttempts ??
                    2,

                retryDelayMs:
                    options.retryDelayMs ??
                    500,
            },
        );

    const maxAttempts =
        policy.maxAttempts;

    const retryDelayMs =
        policy.retryDelayMs;

    let attempts = 0;

    while (
        attempts <
        maxAttempts
    ) {
        attempts += 1;

        try {
            const value =
                await execute();

            return {
                value,
                attempts,
                retries:
                    attempts - 1,
            };
        } catch (error) {
            if (
                attempts >=
                maxAttempts
            ) {
                throw error;
            }

            const classification =
                options.classifyFailure(
                    error,
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

            if (
                decision.retryDelayMs >
                0
            ) {
                await new Promise<void>(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            decision.retryDelayMs,
                        ),
                );
            }
        }
    }

    throw new Error(
        "Execution retry loop exited unexpectedly.",
    );
}