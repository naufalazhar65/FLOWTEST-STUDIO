import {
    describe,
    expect,
    it,
} from "vitest";

import {
    resolveAINodeTarget,
} from "./resolveAINodeTarget";

import type {
    AIFlowContextNode,
} from "../types/AIRequest";

function node(
    id: string,
    title: string,
    action = "tap",
): AIFlowContextNode {
    return {
        id,

        action,

        title,

        subtitle:
            `${action} ${title}`,

        locatorStrategy:
            "accessibilityId",

        locator:
            title,
    };
}

describe(
    "resolveAINodeTarget",
    () => {
        it(
            "resolves a unique node by title",
            () => {
                const result =
                    resolveAINodeTarget(
                        "Kenapa node Login Screen gagal?",
                        [
                            node(
                                "1",
                                "Login Screen",
                            ),

                            node(
                                "2",
                                "Menu",
                            ),
                        ],
                    );

                expect(
                    result.status,
                ).toBe(
                    "resolved",
                );

                if (
                    result.status ===
                    "resolved"
                ) {
                    expect(
                        result.node.id,
                    ).toBe(
                        "1",
                    );
                }
            },
        );

        it(
            "resolves the second duplicate node",
            () => {
                const result =
                    resolveAINodeTarget(
                        "Kenapa Product A yang kedua gagal?",
                        [
                            node(
                                "1",
                                "Product A",
                            ),

                            node(
                                "2",
                                "Product A",
                            ),

                            node(
                                "3",
                                "Checkout",
                            ),
                        ],
                    );

                expect(
                    result.status,
                ).toBe(
                    "resolved",
                );

                if (
                    result.status ===
                    "resolved"
                ) {
                    expect(
                        result.node.id,
                    ).toBe(
                        "2",
                    );
                }
            },
        );

        it(
            "resolves the last duplicate node",
            () => {
                const result =
                    resolveAINodeTarget(
                        "Kenapa Product A terakhir gagal?",
                        [
                            node(
                                "1",
                                "Product A",
                            ),

                            node(
                                "2",
                                "Product A",
                            ),
                        ],
                    );

                expect(
                    result.status,
                ).toBe(
                    "resolved",
                );

                if (
                    result.status ===
                    "resolved"
                ) {
                    expect(
                        result.node.id,
                    ).toBe(
                        "2",
                    );
                }
            },
        );

        it(
            "does not guess when duplicate nodes are ambiguous",
            () => {
                const result =
                    resolveAINodeTarget(
                        "Kenapa Product A gagal?",
                        [
                            node(
                                "1",
                                "Product A",
                            ),

                            node(
                                "2",
                                "Product A",
                            ),
                        ],
                    );

                expect(
                    result.status,
                ).toBe(
                    "ambiguous",
                );

                if (
                    result.status ===
                    "ambiguous"
                ) {
                    expect(
                        result.candidates,
                    ).toHaveLength(
                        2,
                    );
                }
            },
        );

        it(
            "returns notFound for an unknown node",
            () => {
                const result =
                    resolveAINodeTarget(
                        "Kenapa node Checkout gagal?",
                        [
                            node(
                                "1",
                                "Login",
                            ),

                            node(
                                "2",
                                "Menu",
                            ),
                        ],
                    );

                expect(
                    result.status,
                ).toBe(
                    "notFound",
                );
            },
        );

        it(
            "matches locator text when node title differs",
            () => {
                const result =
                    resolveAINodeTarget(
                        "Kenapa node ProductItem gagal?",
                        [
                            {
                                ...node(
                                    "1",
                                    "Tap Product",
                                ),

                                locator:
                                    "ProductItem",
                            },
                        ],
                    );

                expect(
                    result.status,
                ).toBe(
                    "resolved",
                );

                if (
                    result.status ===
                    "resolved"
                ) {
                    expect(
                        result.node.id,
                    ).toBe(
                        "1",
                    );
                }
            },
        );
    },
);