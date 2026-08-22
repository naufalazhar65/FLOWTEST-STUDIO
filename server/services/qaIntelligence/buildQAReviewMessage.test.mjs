import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildQAReviewMessage,
} from "./buildQAReviewMessage.mjs";

describe(
    "buildQAReviewMessage",
    () => {
        it(
            "builds an Indonesian QA review",
            () => {
                const result =
                    buildQAReviewMessage(
                        {
                            score: 78,

                            nodeCount: 5,

                            edgeCount: 4,

                            findings: [
                                {
                                    severity:
                                        "warning",

                                    category:
                                        "assertion",

                                    nodeId:
                                        "login",

                                    title:
                                        "Missing assertion",

                                    message:
                                        "Login is not followed by validation.",

                                    recommendation:
                                        "Add an assertion after Login.",
                                },
                            ],
                        },
                        "id",
                    );

                expect(
                    result,
                ).toContain(
                    "Review Kualitas Flow",
                );

                expect(
                    result,
                ).toContain(
                    "78/100",
                );

                expect(
                    result,
                ).toContain(
                    "Missing assertion",
                );

                expect(
                    result,
                ).toContain(
                    "Add an assertion after Login.",
                );
            },
        );

        it(
            "builds an English QA review",
            () => {
                const result =
                    buildQAReviewMessage(
                        {
                            score: 95,

                            nodeCount: 3,

                            edgeCount: 2,

                            findings: [],
                        },
                        "en",
                    );

                expect(
                    result,
                ).toContain(
                    "QA Flow Review",
                );

                expect(
                    result,
                ).toContain(
                    "95/100",
                );

                expect(
                    result,
                ).toContain(
                    "No significant QA quality issues",
                );
            },
        );

        it(
            "summarizes finding severity counts",
            () => {
                const result =
                    buildQAReviewMessage(
                        {
                            score: 60,

                            nodeCount: 4,

                            edgeCount: 3,

                            findings: [
                                {
                                    severity:
                                        "error",

                                    category:
                                        "locator",

                                    nodeId:
                                        "node-1",

                                    title:
                                        "Incomplete locator",

                                    message:
                                        "Missing locator.",

                                    recommendation:
                                        "Configure the locator.",
                                },

                                {
                                    severity:
                                        "warning",

                                    category:
                                        "timing",

                                    nodeId:
                                        "node-2",

                                    title:
                                        "Long fixed delay",

                                    message:
                                        "Delay is long.",

                                    recommendation:
                                        "Use explicit wait.",
                                },

                                {
                                    severity:
                                        "info",

                                    category:
                                        "locator",

                                    nodeId:
                                        "node-3",

                                    title:
                                        "Duplicate locator",

                                    message:
                                        "Locator is reused.",

                                    recommendation:
                                        "Verify reuse.",
                                },
                            ],
                        },
                        "id",
                    );

                expect(
                    result,
                ).toContain(
                    "Error: 1",
                );

                expect(
                    result,
                ).toContain(
                    "Warning: 1",
                );

                expect(
                    result,
                ).toContain(
                    "Temuan informasional: 1",
                );
            },
        );

        it(
    "includes suggested fixes in QA review",
    () => {
        const result =
            buildQAReviewMessage(
                {
                    score: 60,

                    nodeCount: 2,

                    edgeCount: 1,

                    findings: [
                        {
                            severity:
                                "error",

                            category:
                                "locator",

                            nodeId:
                                "login-1",

                            title:
                                "Incomplete locator",

                            message:
                                "Login does not have complete locator data.",

                            recommendation:
                                "Configure both locator strategy and locator.",

                            suggestedFix: {
                                type:
                                    "fixLocator",

                                targetNodeId:
                                    "login-1",
                            },
                        },
                    ],
                },
                "en",
            );

        expect(
            result,
        ).toContain(
            "Suggested fix: `fixLocator`",
        );
    },
);
    },
);