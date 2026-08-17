import {
    describe,
    expect,
    it,
} from "vitest";

import {
    classifyFailure,
} from "./classifyFailure";

import type {
    FailureContext,
} from "./buildFailureContext";

function createContext(
    error: string,
    action = "tap",
): FailureContext {
    return {
        node: {
            id: "node-1",

            action,

            title: "Test Node",

            subtitle:
                "Test node",

            locatorStrategy:
                "accessibilityId",

            locator:
                "Login",
        },

        execution: {
            nodeId:
                "node-1",

            nodeType:
                action,

            nodeTitle:
                "Test Node",

            status:
                "failed",

            startedAt:
                1000,

            finishedAt:
                1500,

            duration:
                500,

            error,
        },

        previousNodeIds:
            [],

        nextNodeIds:
            [],
    };
}

describe(
    "classifyFailure",
    () => {
        it(
            "classifies element not found failures",
            () => {
                const result =
                    classifyFailure(
                        createContext(
                            "Element not found",
                        ),
                    );

                expect(
                    result.category,
                ).toBe(
                    "elementNotFound",
                );

                expect(
                    result.confidence,
                ).toBe(
                    "high",
                );
            },
        );

        it(
            "classifies invalid locator failures",
            () => {
                const result =
                    classifyFailure(
                        createContext(
                            "Invalid selector: XPath expression is malformed",
                        ),
                    );

                expect(
                    result.category,
                ).toBe(
                    "invalidLocator",
                );
            },
        );

        it(
            "classifies timeout failures",
            () => {
                const result =
                    classifyFailure(
                        createContext(
                            "Operation timed out after 10000ms",
                        ),
                    );

                expect(
                    result.category,
                ).toBe(
                    "timeout",
                );
            },
        );

        it(
            "classifies assertion failures",
            () => {
                const result =
                    classifyFailure(
                        createContext(
                            "expected value Product but received empty value",
                            "assert",
                        ),
                    );

                expect(
                    result.category,
                ).toBe(
                    "assertionFailure",
                );
            },
        );

        it(
            "classifies session failures",
            () => {
                const result =
                    classifyFailure(
                        createContext(
                            "Invalid session id",
                        ),
                    );

                expect(
                    result.category,
                ).toBe(
                    "sessionError",
                );
            },
        );

        it(
            "classifies application state failures",
            () => {
                const result =
                    classifyFailure(
                        createContext(
                            "Unexpected screen was displayed",
                        ),
                    );

                expect(
                    result.category,
                ).toBe(
                    "applicationStateError",
                );
            },
        );

        it(
            "uses failed assert action as evidence",
            () => {
                const result =
                    classifyFailure(
                        createContext(
                            "Value did not match",
                            "assert",
                        ),
                    );

                expect(
                    result.category,
                ).toBe(
                    "assertionFailure",
                );

                expect(
                    result.confidence,
                ).toBe(
                    "medium",
                );
            },
        );

        it(
            "returns unknown for unmatched failures",
            () => {
                const result =
                    classifyFailure(
                        createContext(
                            "Something unexpected happened",
                        ),
                    );

                expect(
                    result.category,
                ).toBe(
                    "unknown",
                );

                expect(
                    result.confidence,
                ).toBe(
                    "low",
                );
            },
        );

        it(
            "returns unknown when the error is missing",
            () => {
                const result =
                    classifyFailure(
                        {
                            ...createContext(
                                "ignored",
                            ),

                            execution: {
                                ...createContext(
                                    "ignored",
                                ).execution,

                                error:
                                    undefined,
                            },
                        },
                    );

                expect(
                    result.category,
                ).toBe(
                    "unknown",
                );

                expect(
                    result.confidence,
                ).toBe(
                    "low",
                );
            },
        );
    },
);