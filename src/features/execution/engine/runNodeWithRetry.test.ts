import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    ExecutionContext,
} from "../types/ExecutionContext";

import {
    runNodeWithRetry,
} from "./runNodeWithRetry";

const runnerMock =
    vi.fn();

vi.mock(
    "../services/runnerRegistry",
    () => ({
        getRunner: () => ({
            run:
                runnerMock,
        }),
    }),
);

function createNode(
    action:
        FlowNode["data"]["action"] =
        "tap",
): FlowNode {
    return {
        id: "node-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action,

            title: "Test Node",

            subtitle:
                "Test node",

            locatorStrategy:
                "accessibilityId",

            locator:
                "Login",
        },
    } as FlowNode;
}

const context:
    ExecutionContext = {
    edges: [],
};

describe(
    "runNodeWithRetry",
    () => {
        beforeEach(() => {
            runnerMock.mockReset();
        });

        it(
            "retries a timeout and then succeeds",
            async () => {
                runnerMock
                    .mockRejectedValueOnce(
                        new Error(
                            "Operation timed out",
                        ),
                    )
                    .mockResolvedValueOnce(
                        {
                            outputs: [
                                "next",
                            ],
                        },
                    );

                const result =
                    await runNodeWithRetry(
                        createNode(),
                        context,
                        {
                            enableRetry:
                                true,

                            maxAttempts:
                                2,

                            retryDelayMs:
                                0,
                        },
                    );

                expect(
                    runnerMock,
                ).toHaveBeenCalledTimes(
                    2,
                );

                expect(
                    result.attempts,
                ).toBe(2);

                expect(
                    result.retries,
                ).toBe(1);

                expect(
                    result.retryReason,
                ).toBe(
                    "Timeout may be caused by temporary application or device slowness.",
                );
            },
        );

        it(
            "does not retry assertion failures",
            async () => {
                runnerMock.mockRejectedValue(
                    new Error(
                        "Expected Dashboard but received Login",
                    ),
                );

                await expect(
                    runNodeWithRetry(
                        createNode(
                            "assert",
                        ),
                        context,
                        {
                            maxAttempts:
                                3,

                            retryDelayMs:
                                0,
                        },
                    ),
                ).rejects.toThrow(
                    "Expected Dashboard but received Login",
                );

                expect(
                    runnerMock,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "does not retry invalid locators",
            async () => {
                runnerMock.mockRejectedValue(
                    new Error(
                        "Invalid selector: XPath expression is malformed",
                    ),
                );

                await expect(
                    runNodeWithRetry(
                        createNode(),
                        context,
                        {
                            maxAttempts:
                                3,

                            retryDelayMs:
                                0,
                        },
                    ),
                ).rejects.toThrow(
                    "Invalid selector",
                );

                expect(
                    runnerMock,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "stops after the configured attempts",
            async () => {
                runnerMock.mockRejectedValue(
                    new Error(
                        "Operation timed out",
                    ),
                );

                await expect(
                    runNodeWithRetry(
                        createNode(),
                        context,
                        {
                            enableRetry:
                                true,

                            maxAttempts:
                                3,

                            retryDelayMs:
                                0,
                        },
                    ),
                ).rejects.toThrow(
                    "Operation timed out",
                );

                expect(
                    runnerMock,
                ).toHaveBeenCalledTimes(
                    3,
                );
            },
        );

        it(
            "can disable retry",
            async () => {
                runnerMock.mockRejectedValue(
                    new Error(
                        "Operation timed out",
                    ),
                );

                await expect(
                    runNodeWithRetry(
                        createNode(),
                        context,
                        {
                            maxAttempts:
                                3,

                            retryDelayMs:
                                0,

                            enableRetry:
                                false,
                        },
                    ),
                ).rejects.toThrow(
                    "Operation timed out",
                );

                expect(
                    runnerMock,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );
    },
);