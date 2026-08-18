import {
    describe,
    expect,
    it,
} from "vitest";

import {
    analyzeFailureRootCause,
} from "./analyzeFailureRootCause";

import type {
    FailureContext,
} from "./buildFailureContext";

import type {
    FailureClassification,
} from "./classifyFailure";

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

        previousNodeIds: [],

        previousNodes: [],

        nextNodeIds: [],

        nextNodes: [],
    };
}

describe(
    "analyzeFailureRootCause",
    () => {
        it(
            "detects stale locator as root cause for element not found",
            () => {
                const context =
                    createContext(
                        "Element not found",
                    );

                const classification:
                    FailureClassification =
                {
                    category:
                        "elementNotFound",

                    confidence:
                        "high",

                    evidence: [
                        "Element not found",
                    ],
                };

                const result =
                    analyzeFailureRootCause(
                        context,
                        classification,
                    );

                expect(
                    result.category,
                ).toBe(
                    "staleLocator",
                );

                expect(
                    result.confidence,
                ).toBe(
                    "high",
                );
            },
        );

        it(
            "detects invalid locator root cause",
            () => {
                const context =
                    createContext(
                        "Invalid selector",
                    );

                const classification:
                    FailureClassification =
                {
                    category:
                        "invalidLocator",

                    confidence:
                        "high",

                    evidence: [
                        "Invalid selector",
                    ],
                };

                const result =
                    analyzeFailureRootCause(
                        context,
                        classification,
                    );

                expect(
                    result.category,
                ).toBe(
                    "invalidLocator",
                );
            },
        );

        it(
            "detects timeout as element readiness problem",
            () => {
                const context =
                    createContext(
                        "Operation timed out",
                    );

                const classification:
                    FailureClassification =
                {
                    category:
                        "timeout",

                    confidence:
                        "high",

                    evidence: [
                        "Operation timed out",
                    ],
                };

                const result =
                    analyzeFailureRootCause(
                        context,
                        classification,
                    );

                expect(
                    result.category,
                ).toBe(
                    "elementNotReady",
                );
            },
        );

        it(
            "detects assertion mismatch",
            () => {
                const context =
                    createContext(
                        "expected Product but received empty",
                        "assert",
                    );

                const classification:
                    FailureClassification =
                {
                    category:
                        "assertionFailure",

                    confidence:
                        "high",

                    evidence: [
                        "expected Product but received empty",
                    ],
                };

                const result =
                    analyzeFailureRootCause(
                        context,
                        classification,
                    );

                expect(
                    result.category,
                ).toBe(
                    "assertionMismatch",
                );
            },
        );

        it(
            "detects automation session root cause",
            () => {
                const context =
                    createContext(
                        "Invalid session id",
                    );

                const classification:
                    FailureClassification =
                {
                    category:
                        "sessionError",

                    confidence:
                        "high",

                    evidence: [
                        "Invalid session id",
                    ],
                };

                const result =
                    analyzeFailureRootCause(
                        context,
                        classification,
                    );

                expect(
                    result.category,
                ).toBe(
                    "automationSession",
                );
            },
        );

        it(
            "detects unexpected application state",
            () => {
                const context =
                    createContext(
                        "Unexpected screen",
                    );

                const classification:
                    FailureClassification =
                {
                    category:
                        "applicationStateError",

                    confidence:
                        "medium",

                    evidence: [
                        "Unexpected screen",
                    ],
                };

                const result =
                    analyzeFailureRootCause(
                        context,
                        classification,
                    );

                expect(
                    result.category,
                ).toBe(
                    "wrongApplicationState",
                );
            },
        );

        it(
            "falls back to unknown root cause",
            () => {
                const context =
                    createContext(
                        "Something strange happened",
                    );

                const classification:
                    FailureClassification =
                {
                    category:
                        "unknown",

                    confidence:
                        "low",

                    evidence: [
                        "Something strange happened",
                    ],
                };

                const result =
                    analyzeFailureRootCause(
                        context,
                        classification,
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
            "detects wrong application state when runtime UI evidence indicates a state mismatch",
            () => {
                const context =
                    createContext(
                        "Element not found",
                    );

                context.execution.pageSource =
                    "<XCUIElementTypeApplication><XCUIElementTypeStaticText name='Home' /></XCUIElementTypeApplication>";

                context.previousNodeIds = [
                    "back",
                ];

                context.previousNodes = [
                    {
                        id:
                            "back",

                        action:
                            "back",

                        title:
                            "Back",

                        subtitle:
                            "Go back",

                        locatorStrategy:
                            null,

                        locator:
                            null,
                    },
                ];

                const classification:
                    FailureClassification =
                {
                    category:
                        "elementNotFound",

                    confidence:
                        "high",

                    evidence: [
                        "Element not found",
                    ],
                };

                const result =
                    analyzeFailureRootCause(
                        context,
                        classification,
                    );

                expect(
                    result.category,
                ).toBe(
                    "wrongApplicationState",
                );

                expect(
                    result.confidence,
                ).toBe(
                    "high",
                );
            },
        );
    },
);