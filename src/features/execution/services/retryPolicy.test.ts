import {
    describe,
    expect,
    it,
} from "vitest";

import {
    shouldRetryFailure,
} from "./retryPolicy";

import type {
    FailureClassification,
} from "./classifyFailure";

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
    "shouldRetryFailure",
    () => {
        it(
            "retries session errors",
            () => {
                const result =
                    shouldRetryFailure(
                        classification(
                            "sessionError",
                        ),
                    );

                expect(
                    result.retryable,
                ).toBe(true);

                expect(
                    result.maxAttempts,
                ).toBe(2);
            },
        );

        it(
            "retries timeouts",
            () => {
                const result =
                    shouldRetryFailure(
                        classification(
                            "timeout",
                        ),
                    );

                expect(
                    result.retryable,
                ).toBe(true);
            },
        );

        it(
            "retries application state errors",
            () => {
                const result =
                    shouldRetryFailure(
                        classification(
                            "applicationStateError",
                        ),
                    );

                expect(
                    result.retryable,
                ).toBe(true);
            },
        );

        it(
            "does not retry assertion failures",
            () => {
                const result =
                    shouldRetryFailure(
                        classification(
                            "assertionFailure",
                        ),
                    );

                expect(
                    result.retryable,
                ).toBe(false);

                expect(
                    result.maxAttempts,
                ).toBe(1);
            },
        );

        it(
            "does not retry invalid locators",
            () => {
                const result =
                    shouldRetryFailure(
                        classification(
                            "invalidLocator",
                        ),
                    );

                expect(
                    result.retryable,
                ).toBe(false);
            },
        );

        it(
            "does not retry element-not-found failures",
            () => {
                const result =
                    shouldRetryFailure(
                        classification(
                            "elementNotFound",
                        ),
                    );

                expect(
                    result.retryable,
                ).toBe(false);
            },
        );

        it(
            "does not retry unknown failures",
            () => {
                const result =
                    shouldRetryFailure(
                        classification(
                            "unknown",
                        ),
                    );

                expect(
                    result.retryable,
                ).toBe(false);
            },
        );

        it(
            "supports custom retry policy values",
            () => {
                const result =
                    shouldRetryFailure(
                        classification(
                            "sessionError",
                        ),
                        {
                            maxAttempts:
                                3,

                            retryDelayMs:
                                1000,
                        },
                    );

                expect(
                    result.maxAttempts,
                ).toBe(3);

                expect(
                    result.retryDelayMs,
                ).toBe(1000);
            },
        );
    },
);