import {
    describe,
    expect,
    it,
} from "vitest";

import type { Edge } from "reactflow";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import {
    analyzeExecutionFailure,
} from "./analyzeExecutionFailure";

function createNodes(): FlowNode[] {
    return [
        {
            id: "tap-login",

            type: "flow",

            position: {
                x: 0,
                y: 0,
            },

            data: {
                action: "tap",

                title: "Tap Login",

                subtitle:
                    "Tap login button",

                locatorStrategy:
                    "accessibilityId",

                locator:
                    "Login",

                debug: {
                    breakpoint:
                        false,
                },
            },
        },
    ];
}

function createEdges(): Edge[] {
    return [];
}

describe(
    "analyzeExecutionFailure",
    () => {
        it(
            "analyzes the first failed node",
            () => {
                const result =
                    analyzeExecutionFailure(
                        [
                            {
                                nodeId:
                                    "tap-login",

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
                        ],
                        createNodes(),
                        createEdges(),
                    );

                expect(
                    result,
                ).not.toBeNull();

                if (!result) {
                    throw new Error(
                        "Expected failure analysis result.",
                    );
                }

                expect(
                    result.context
                        ?.node.id,
                ).toBe(
                    "tap-login",
                );

                expect(
                    result.context
                        ?.execution.error,
                ).toBe(
                    "Element not found",
                );

                expect(
                    result.classification
                        .category,
                ).toBe(
                    "elementNotFound",
                );

                expect(
                    result.rootCause
                        .category,
                ).toBe(
                    "staleLocator",
                );

                expect(
                    result.suggestedFix
                        .type,
                ).toBe(
                    "reviewLocator",
                );
            },
        );

        it(
            "returns null when there is no failure",
            () => {
                const result =
                    analyzeExecutionFailure(
                        [
                            {
                                nodeId:
                                    "tap-login",

                                nodeType:
                                    "tap",

                                nodeTitle:
                                    "Tap Login",

                                status:
                                    "passed",

                                startedAt:
                                    1000,

                                finishedAt:
                                    1500,

                                duration:
                                    500,
                            },
                        ],
                        createNodes(),
                        createEdges(),
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );
    },
);