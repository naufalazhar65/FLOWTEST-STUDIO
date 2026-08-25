import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import type {
    FailureClassification,
} from "./classifyFailure";

import {
    executeWithRetry,
} from "./executeWithRetry";

function classification(
    category:
        FailureClassification[
        "category"
        ],
): FailureClassification {
    return {
        category,

        confidence:
            "high",

        evidence: [],
    };
}

describe(
    "executeWithRetry",
    () => {
        it(
            "retries a transient failure and succeeds",
            async () => {
                const execute =
                    vi
                        .fn<
                            () =>
                                Promise<string>
                        >()
                        .mockRejectedValueOnce(
                            new Error(
                                "timeout",
                            ),
                        )
                        .mockResolvedValue(
                            "success",
                        );

                const result =
                    await executeWithRetry(
                        execute,
                        {
                            maxAttempts:
                                2,

                            retryDelayMs:
                                0,

                            classifyFailure:
                                () =>
                                    classification(
                                        "timeout",
                                    ),
                        },
                    );

                expect(
                    result.value,
                ).toBe(
                    "success",
                );

                expect(
                    result.attempts,
                ).toBe(2);

                expect(
                    result.retries,
                ).toBe(1);
            },
        );

        it(
            "does not retry assertion failures",
            async () => {
                const execute =
                    vi
                        .fn<
                            () =>
                                Promise<string>
                        >()
                        .mockRejectedValue(
                            new Error(
                                "Expected dashboard but received login",
                            ),
                        );

                await expect(
                    executeWithRetry(
                        execute,
                        {
                            maxAttempts:
                                3,

                            retryDelayMs:
                                0,

                            classifyFailure:
                                () =>
                                    classification(
                                        "assertionFailure",
                                    ),
                        },
                    ),
                ).rejects.toThrow(
                    "Expected dashboard but received login",
                );

                expect(
                    execute,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "stops after the configured attempts",
            async () => {
                const execute =
                    vi
                        .fn<
                            () =>
                                Promise<string>
                        >()
                        .mockRejectedValue(
                            new Error(
                                "timeout",
                            ),
                        );

                await expect(
                    executeWithRetry(
                        execute,
                        {
                            maxAttempts:
                                3,

                            retryDelayMs:
                                0,

                            classifyFailure:
                                () =>
                                    classification(
                                        "timeout",
                                    ),
                        },
                    ),
                ).rejects.toThrow(
                    "timeout",
                );

                expect(
                    execute,
                ).toHaveBeenCalledTimes(
                    3,
                );
            },
        );
    },
);