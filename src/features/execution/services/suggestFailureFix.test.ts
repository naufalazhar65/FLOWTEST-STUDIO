import {
    describe,
    expect,
    it,
} from "vitest";

import {
    suggestFailureFix,
} from "./suggestFailureFix";

import type {
    FailureContext,
} from "./buildFailureContext";

import type {
    FailureRootCause,
} from "./analyzeFailureRootCause";

function createContext(): FailureContext {
    return {
        node: {
            id: "node-1",

            action: "tap",

            title: "Tap Login",

            subtitle:
                "Tap login",

            locatorStrategy:
                "accessibilityId",

            locator:
                "Login",
        },

        execution: {
            nodeId:
                "node-1",

            nodeType:
                "tap",

            nodeTitle:
                "Tap Login",

            status:
                "failed",

            startedAt:
                1000,

            finishedAt:
                1500,

            duration:
                500,

            error:
                "Element not found",
        },

        previousNodeIds: [],

        previousNodes: [],

        nextNodeIds: [],

        nextNodes: [],
    };
}

function createRootCause(
    category:
        FailureRootCause["category"],
): FailureRootCause {
    return {
        category,

        title:
            "Test root cause",

        explanation:
            "Test explanation",

        confidence:
            "high",

        evidence: [
            "Test evidence",
        ],

        likelyCauses: [
            "Test cause",
        ],
    };
}

describe(
    "suggestFailureFix",
    () => {
        it(
            "suggests locator review for stale locator",
            () => {
                const result =
                    suggestFailureFix(
                        createContext(),
                        createRootCause(
                            "staleLocator",
                        ),
                    );

                expect(
                    result.type,
                ).toBe(
                    "reviewLocator",
                );

                expect(
                    result.targetNodeId,
                ).toBe(
                    "node-1",
                );

                expect(
                    result.autoApplicable,
                ).toBe(
                    false,
                );
            },
        );

        it(
            "suggests locator replacement for invalid locator",
            () => {
                const result =
                    suggestFailureFix(
                        createContext(),
                        createRootCause(
                            "invalidLocator",
                        ),
                    );

                expect(
                    result.type,
                ).toBe(
                    "repairLocator",
                );

                expect(
                    result.autoApplicable,
                ).toBe(
                    true,
                );
            },
        );

        it(
            "suggests synchronization for element not ready",
            () => {
                const result =
                    suggestFailureFix(
                        createContext(),
                        createRootCause(
                            "elementNotReady",
                        ),
                    );

                expect(
                    result.type,
                ).toBe(
                    "addWait",
                );

                expect(
                    result.autoApplicable,
                ).toBe(
                    true,
                );
            },
        );

        it(
            "suggests assertion review for assertion mismatch",
            () => {
                const result =
                    suggestFailureFix(
                        createContext(),
                        createRootCause(
                            "assertionMismatch",
                        ),
                    );

                expect(
                    result.type,
                ).toBe(
                    "reviewAssertion",
                );

                expect(
                    result.autoApplicable,
                ).toBe(
                    false,
                );
            },
        );

        it(
            "suggests state recovery for application state failures",
            () => {
                const result =
                    suggestFailureFix(
                        createContext(),
                        createRootCause(
                            "wrongApplicationState",
                        ),
                    );

                expect(
                    result.type,
                ).toBe(
                    "restoreApplicationState",
                );

                expect(
                    result.autoApplicable,
                ).toBe(
                    false,
                );
            },
        );

        it(
            "suggests session recovery for automation session failures",
            () => {
                const result =
                    suggestFailureFix(
                        createContext(),
                        createRootCause(
                            "automationSession",
                        ),
                    );

                expect(
                    result.type,
                ).toBe(
                    "restartAutomationSession",
                );

                expect(
                    result.targetNodeId,
                ).toBeNull();

                expect(
                    result.autoApplicable,
                ).toBe(
                    false,
                );
            },
        );

        it(
            "falls back to manual investigation for unknown failures",
            () => {
                const result =
                    suggestFailureFix(
                        createContext(),
                        createRootCause(
                            "unknown",
                        ),
                    );

                expect(
                    result.type,
                ).toBe(
                    "none",
                );

                expect(
                    result.autoApplicable,
                ).toBe(
                    false,
                );
            },
        );
    },
);