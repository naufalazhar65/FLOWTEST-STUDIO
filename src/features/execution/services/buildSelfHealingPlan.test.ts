import {
    describe,
    expect,
    it,
    vi,
    beforeEach,
} from "vitest";

import {
    buildSelfHealingPlan,
} from "./buildSelfHealingPlan";

import type {
    ExecutionFailureAnalysis,
} from "./analyzeExecutionFailure";

import {
    resolveAILocatorFromApp,
} from "../../ai/services/resolveAILocatorFromApp";

vi.mock(
    "../../ai/services/resolveAILocatorFromApp",
    () => ({
        resolveAILocatorFromApp:
            vi.fn(),
    }),
);

function createAnalysis(
    options?: {
        fixType?:
        | "addWait"
        | "reviewLocator"
        | "repairLocator"
        | "restoreApplicationState"
        | "none";

        autoApplicable?:
        boolean;

        action?: string;

        locatorStrategy?:
        string | null;

        locator?:
        string | null;

        suggestedLocator?:
        string | null;
    },
): ExecutionFailureAnalysis {

    return {
        context: {
            node: {
                id:
                    "node-1",

                action:
                    options?.action ??
                    "tap",

                title:
                    "Tap Login",

                subtitle:
                    "Tap login",

                locatorStrategy:
                    options?.locatorStrategy ===
                        undefined
                        ? "accessibilityId"
                        : options.locatorStrategy,

                locator:
                    options?.locator ===
                        undefined
                        ? "Login"
                        : options.locator,
            },

            execution: {
                nodeId:
                    "node-1",

                nodeType:
                    options?.action ??
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
                    "Operation timed out",
            },

            previousNodeIds: [],

            previousNodes: [],

            nextNodeIds: [],

            nextNodes: [],
        },

        classification: {
            category:
                "timeout",

            confidence:
                "high",

            evidence: [
                "Operation timed out",
            ],
        },

        rootCause: {
            category:
                "elementNotReady",

            title:
                "Operation timed out",

            explanation:
                "Target was not ready.",

            confidence:
                "high",

            evidence: [
                "Operation timed out",
            ],

            likelyCauses: [
                "Element was not ready.",
            ],
        },

        suggestedFix: {
            type:
                options?.fixType ??
                "reviewLocator",

            title:
                "...",

            description:
                "...",

            targetNodeId:
                "node-1",

            suggestedLocator:
                options?.suggestedLocator ??
                null,

            locatorStrategy:
                options?.locatorStrategy ??
                null,

            confidence:
                "high",

            reason:
                "...",

            autoApplicable:
                options?.autoApplicable ??
                false,
        },
    };
}

describe(
    "buildSelfHealingPlan",
    () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it(
            "creates an auto-applicable modification plan when a deterministic repair exists",
            async () => {
                const result =
                    await buildSelfHealingPlan(
                        createAnalysis({
                            fixType:
                                "addWait",

                            autoApplicable:
                                true,
                        }),
                    );

                expect(
                    result.canAutoApply,
                ).toBe(
                    true,
                );

                expect(
                    result.strategy,
                ).toBe(
                    "modification",
                );

                expect(
                    result.modificationPlan,
                ).not.toBeNull();

                expect(
                    result.modificationPlan &&
                    "operation" in
                    result.modificationPlan,
                ).toBe(
                    true,
                );

                expect(
                    result.targetNodeId,
                ).toBe(
                    "node-1",
                );
            },
        );

        it(
            "requires manual review when the fix is not auto applicable",
            async () => {
                const result =
                    await buildSelfHealingPlan(
                        createAnalysis({
                            fixType:
                                "addWait",

                            autoApplicable:
                                false,
                        }),
                    );

                expect(
                    result.canAutoApply,
                ).toBe(
                    false,
                );

                expect(
                    result.strategy,
                ).toBe(
                    "manual",
                );

                expect(
                    result.modificationPlan,
                ).not.toBeNull();
            },
        );

        it(
            "requires manual review when no deterministic plan can be built",
            async () => {
                const result =
                    await buildSelfHealingPlan(
                        createAnalysis({
                            fixType:
                                "addWait",

                            autoApplicable:
                                true,

                            locatorStrategy:
                                null,

                            locator:
                                null,
                        }),
                    );

                expect(
                    result.canAutoApply,
                ).toBe(
                    false,
                );

                expect(
                    result.strategy,
                ).toBe(
                    "manual",
                );

                expect(
                    result.modificationPlan,
                ).toBeNull();
            },
        );

        it(
            "returns manual review for fixes that are not currently supported for automatic healing",
            async () => {
                const result =
                    await buildSelfHealingPlan(
                        createAnalysis({
                            fixType:
                                "reviewLocator",

                            autoApplicable:
                                false,
                        }),
                    );

                expect(
                    result.canAutoApply,
                ).toBe(
                    false,
                );

                expect(
                    result.strategy,
                ).toBe(
                    "manual",
                );

                expect(
                    result.modificationPlan,
                ).toBeNull();
            },
        );

        it(
            "returns none when no fix exists",
            async () => {
                const result =
                    await buildSelfHealingPlan(
                        createAnalysis({
                            fixType:
                                "none",

                            autoApplicable:
                                false,
                        }),
                    );

                expect(
                    result.canAutoApply,
                ).toBe(
                    false,
                );

                expect(
                    result.strategy,
                ).toBe(
                    "none",
                );

                expect(
                    result.modificationPlan,
                ).toBeNull();

                expect(
                    result.targetNodeId,
                ).toBeNull();
            },
        );

        it(
            "creates a runtime recovery plan for application state failures",
            async () => {
                const analysis =
                    createAnalysis({
                        fixType:
                            "restoreApplicationState",

                        autoApplicable:
                            true,
                    });

                analysis.rootCause = {
                    category:
                        "wrongApplicationState",

                    title:
                        "Application is in an unexpected state",

                    explanation:
                        "The application is not in the expected state.",

                    confidence:
                        "high",

                    evidence: [
                        "Unexpected application state.",
                    ],

                    likelyCauses: [
                        "Previous navigation step did not produce the expected state.",
                    ],
                };

                const result =
                    await buildSelfHealingPlan(
                        analysis,
                    );

                expect(
                    result.canAutoApply,
                ).toBe(true);

                expect(
                    result.strategy,
                ).toBe(
                    "runtimeRecovery",
                );

                expect(
                    result.modificationPlan,
                ).toBeNull();

                expect(
                    result.targetNodeId,
                ).toBe(
                    "node-1",
                );
            },
        );

        it(
            "creates an auto-applicable locator repair plan directly from failure evidence",
            async () => {
                const result =
                    await buildSelfHealingPlan(
                        createAnalysis({
                            fixType:
                                "repairLocator",

                            autoApplicable:
                                false,

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Menu Iconsgherhthrht",

                            suggestedLocator:
                                "Menu Icons",
                        }),
                    );

                expect(
                    resolveAILocatorFromApp,
                ).not.toHaveBeenCalled();

                expect(
                    result.canAutoApply,
                ).toBe(true);

                expect(
                    result.strategy,
                ).toBe(
                    "modification",
                );

                expect(
                    result.targetNodeId,
                ).toBe(
                    "node-1",
                );

                expect(
                    result.modificationPlan,
                ).toMatchObject({
                    type:
                        "modification_plan",

                    operation: {
                        type:
                            "updateNode",

                        targetNodeId:
                            "node-1",

                        step: {
                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Menu Icons",
                        },
                    },
                });
            },
        );

        it(
            "creates an auto-applicable locator repair plan",
            async () => {
                vi.mocked(
                    resolveAILocatorFromApp,
                ).mockResolvedValueOnce({
                    status:
                        "resolved",

                    target:
                        "Login",

                    selected: {
                        strategy:
                            "accessibilityId",

                        value:
                            "login-button",

                        score:
                            0.98,

                        reason:
                            "Exact accessibility label match.",

                        recommended:
                            true,
                    },

                    candidates: [
                        {
                            strategy:
                                "accessibilityId",

                            value:
                                "login-button",

                            score:
                                0.98,

                            reason:
                                "Exact accessibility label match.",

                            recommended:
                                true,
                        },
                    ],

                    matchedElementId:
                        "element-login-button",
                });

                const result =
                    await buildSelfHealingPlan(
                        createAnalysis({
                            fixType:
                                "repairLocator",

                            autoApplicable:
                                true,

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        }),
                    );

                expect(
                    resolveAILocatorFromApp,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    resolveAILocatorFromApp,
                ).toHaveBeenCalledWith(
                    "Tap Login",
                );

                expect(
                    result.canAutoApply,
                ).toBe(
                    true,
                );

                expect(
                    result.strategy,
                ).toBe(
                    "modification",
                );

                expect(
                    result.targetNodeId,
                ).toBe(
                    "node-1",
                );

                expect(
                    result.modificationPlan,
                ).not.toBeNull();

                ;
                expect(
                    result.modificationPlan,
                ).toMatchObject({
                    type:
                        "modification_plan",

                    operation: {
                        type:
                            "updateNode",

                        targetNodeId:
                            "node-1",

                        step: {
                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "login-button",
                        },
                    },
                });
            },
        );

        it(
            "requires manual review when direct locator repair does not change the locator",
            async () => {
                const result =
                    await buildSelfHealingPlan(
                        createAnalysis({
                            fixType:
                                "repairLocator",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",

                            suggestedLocator:
                                "Login",
                        }),
                    );

                expect(
                    resolveAILocatorFromApp,
                ).not.toHaveBeenCalled();

                expect(
                    result.canAutoApply,
                ).toBe(false);

                expect(
                    result.strategy,
                ).toBe(
                    "manual",
                );

                expect(
                    result.modificationPlan,
                ).toBeNull();
            },
        );

        it(
            "creates a modification plan when direct locator repair changes the strategy",
            async () => {
                const result =
                    await buildSelfHealingPlan(
                        createAnalysis({
                            fixType:
                                "repairLocator",

                            locatorStrategy:
                                "id",

                            locator:
                                "old-target",

                            suggestedLocator:
                                "target-action",

                        }),
                    );

                expect(
                    resolveAILocatorFromApp,
                ).not.toHaveBeenCalled();

                expect(
                    result.canAutoApply,
                ).toBe(true);

                expect(
                    result.strategy,
                ).toBe(
                    "modification",
                );

                expect(
                    result.modificationPlan,
                ).toMatchObject({
                    type:
                        "modification_plan",

                    operation: {
                        type:
                            "updateNode",

                        targetNodeId:
                            "node-1",

                        step: {
                            locatorStrategy:
                                "id",

                            locator:
                                "target-action",
                        },
                    },
                });
            },
        );

        it(
            "requires manual review when AI locator fallback fails",
            async () => {
                vi.mocked(
                    resolveAILocatorFromApp,
                ).mockResolvedValueOnce({
                    status: "unavailable",
                    target: "...",
                    selected: null,
                    candidates: [],
                    matchedElementId: null,
                    error: "No verified locator found.",
                });

                const result =
                    await buildSelfHealingPlan(
                        createAnalysis({
                            fixType:
                                "repairLocator",

                            autoApplicable:
                                true,

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",

                            suggestedLocator:
                                null,
                        }),
                    );

                expect(
                    resolveAILocatorFromApp,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    result.canAutoApply,
                ).toBe(false);

                expect(
                    result.strategy,
                ).toBe(
                    "manual",
                );

                expect(
                    result.modificationPlan,
                ).toBeNull();
            },
        );

        it(
            "requires manual review when AI resolves the same locator",
            async () => {
                vi.mocked(
                    resolveAILocatorFromApp,
                ).mockResolvedValueOnce({
                    status:
                        "resolved",

                    target:
                        "Login",

                    selected: {
                        strategy:
                            "accessibilityId",

                        value:
                            "Login",

                        score:
                            1,

                        reason:
                            "Exact accessibility label match.",

                        recommended:
                            true,
                    },

                    candidates: [
                        {
                            strategy:
                                "accessibilityId",

                            value:
                                "Login",

                            score:
                                1,

                            reason:
                                "Exact accessibility label match.",

                            recommended:
                                true,
                        },
                    ],

                    matchedElementId:
                        "element-login",
                });

                const result =
                    await buildSelfHealingPlan(
                        createAnalysis({
                            fixType:
                                "repairLocator",

                            autoApplicable:
                                true,

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",

                            suggestedLocator:
                                null,
                        }),
                    );

                expect(
                    resolveAILocatorFromApp,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    result.canAutoApply,
                ).toBe(false);

                expect(
                    result.strategy,
                ).toBe(
                    "manual",
                );

                expect(
                    result.modificationPlan,
                ).toBeNull();
            },
        );
    },
);