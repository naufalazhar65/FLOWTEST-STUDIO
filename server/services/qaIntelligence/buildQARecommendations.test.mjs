import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildQARecommendations,
} from "./buildQARecommendations.mjs";

describe(
    "buildQARecommendations",
    () => {
        it(
            "prioritizes flow ending without validation",
            () => {
                const result =
                    buildQARecommendations({
                        findings: [
                            {
                                severity:
                                    "warning",

                                category:
                                    "flow",

                                title:
                                    "Flow ends without validation",

                                nodeId:
                                    "tap-1",

                                message:
                                    'The flow ends at "Tap".',

                                recommendation:
                                    "Add validation.",
                            },
                        ],
                    });

                expect(
                    result,
                ).toHaveLength(
                    1,
                );

                expect(
                    result[0].priority,
                ).toBe(
                    "high",
                );

                expect(
                    result[0].impact,
                ).toBe(
                    "high",
                );

                expect(
                    result[0].suggestedFix
                        ?.type,
                ).toBe(
                    "addValidation",
                );

                expect(
                    result[0].suggestedFix
                        ?.targetNodeId,
                ).toBe(
                    "tap-1",
                );
            },
        );

        it(
            "prioritizes missing assertions",
            () => {
                const result =
                    buildQARecommendations({
                        findings: [
                            {
                                severity:
                                    "warning",

                                category:
                                    "assertion",

                                title:
                                    "Missing assertion",

                                nodeId:
                                    "tap-1",

                                message:
                                    "No validation path.",

                                recommendation:
                                    "Add an assertion.",
                            },
                        ],
                    });

                expect(
                    result[0].priority,
                ).toBe(
                    "high",
                );

                expect(
                    result[0].suggestedFix
                        ?.type,
                ).toBe(
                    "addValidation",
                );
            },
        );

        it(
            "treats duplicate locators as medium priority",
            () => {
                const result =
                    buildQARecommendations({
                        findings: [
                            {
                                severity:
                                    "warning",

                                category:
                                    "locator",

                                title:
                                    "Duplicate locator",

                                nodeId:
                                    "tap-1",

                                message:
                                    "Locator is reused.",

                                recommendation:
                                    "Review locator reuse.",
                            },
                        ],
                    });

                expect(
                    result[0].priority,
                ).toBe(
                    "medium",
                );

                expect(
                    result[0].impact,
                ).toBe(
                    "medium",
                );

                expect(
                    result[0].suggestedFix
                        ?.type,
                ).toBe(
                    "reviewLocator",
                );
            },
        );

        it(
            "treats XPath as low priority",
            () => {
                const result =
                    buildQARecommendations({
                        findings: [
                            {
                                severity:
                                    "info",

                                category:
                                    "locator",

                                title:
                                    "XPath locator",

                                nodeId:
                                    "node-1",

                                message:
                                    "Uses XPath.",

                                recommendation:
                                    "Review XPath stability.",
                            },
                        ],
                    });

                expect(
                    result[0].priority,
                ).toBe(
                    "low",
                );

                expect(
                    result[0].impact,
                ).toBe(
                    "low",
                );
            },
        );

        it(
            "sorts recommendations by priority",
            () => {
                const result =
                    buildQARecommendations({
                        findings: [
                            {
                                severity:
                                    "info",

                                category:
                                    "locator",

                                title:
                                    "XPath locator",

                                nodeId:
                                    "node-1",
                            },

                            {
                                severity:
                                    "warning",

                                category:
                                    "assertion",

                                title:
                                    "Missing assertion",

                                nodeId:
                                    "node-2",
                            },

                            {
                                severity:
                                    "warning",

                                category:
                                    "flow",

                                title:
                                    "Flow ends without validation",

                                nodeId:
                                    "node-3",
                            },
                        ],
                    });

                expect(
                    result[0].priority,
                ).toBe(
                    "high",
                );

                expect(
                    result[1].priority,
                ).toBe(
                    "high",
                );

                expect(
                    result[2].priority,
                ).toBe(
                    "low",
                );
            },
        );

        it(
            "returns an empty array for invalid analysis",
            () => {
                expect(
                    buildQARecommendations(
                        null,
                    ),
                ).toEqual(
                    [],
                );

                expect(
                    buildQARecommendations(
                        {},
                    ),
                ).toEqual(
                    [],
                );
            },
        );

        it(
    "treats pressReturn missing validation as low priority",
    () => {
        const result =
            buildQARecommendations({
                findings: [
                    {
                        severity:
                            "info",

                        category:
                            "assertion",

                        nodeId:
                            "return-1",

                        action:
                            "pressReturn",

                        title:
                            "Missing assertion",

                        message:
                            "Press Return does not lead to validation.",

                        recommendation:
                            "Review validation coverage.",
                    },
                ],
            });

        expect(
            result[0].priority,
        ).toBe(
            "low",
        );

        expect(
            result[0].impact,
        ).toBe(
            "low",
        );

        expect(
            result[0].suggestedFix,
        ).toBeNull();
    },
);

it(
    "deduplicates missing assertion when the same node ends the flow",
    () => {
        const result =
            buildQARecommendations({
                findings: [
                    {
                        severity:
                            "warning",

                        category:
                            "assertion",

                        nodeId:
                            "tap-final",

                        action:
                            "tap",

                        title:
                            "Missing assertion",

                        message:
                            "Tap does not lead to validation.",

                        recommendation:
                            "Add validation.",
                    },

                    {
                        severity:
                            "warning",

                        category:
                            "flow",

                        nodeId:
                            "tap-final",

                        action:
                            "tap",

                        title:
                            "Flow ends without validation",

                        message:
                            "Flow ends at Tap.",

                        recommendation:
                            "Add final validation.",
                    },
                ],
            });

        expect(
            result,
        ).toHaveLength(
            1,
        );

        expect(
            result[0].finding,
        ).toBe(
            "Flow ends without validation",
        );

        expect(
            result[0].suggestedFix
                ?.type,
        ).toBe(
            "addValidation",
        );
    },
);
    },
);