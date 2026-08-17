import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import type {
    AIModificationPlan,
} from "../../ai/types/AIModificationPlan";

import {
    executeSelfHealing,
} from "./executeSelfHealing";

import type {
    SelfHealingPlan,
} from "./buildSelfHealingPlan";

function createModificationPlan(): AIModificationPlan {
    return {
        type:
            "modification_plan",

        summary:
            "Test healing plan",

        operation: {
            type:
                "updateNode",

            targetNodeId:
                "node-1",

            step: {
                action:
                    "tap",

                title:
                    "Tap",

                description:
                    "Tap element",

                locatorStrategy:
                    "accessibilityId",

                locator:
                    "Login",
            },
        },
    };
}

function createAutoApplyPlan(): SelfHealingPlan {
    return {
        canAutoApply:
            true,

        strategy:
            "modification",

        confidence:
            "high",

        reason:
            "Deterministic modification plan is available.",

        modificationPlan:
            createModificationPlan(),

        targetNodeId:
            "node-1",
    };
}

describe(
    "executeSelfHealing",
    () => {
        it(
            "applies a healing plan and reruns once",
            async () => {
                const apply =
                    vi.fn()
                        .mockResolvedValue({
                            success:
                                true,

                            appliedSteps:
                                1,
                        });

                const rerun =
                    vi.fn()
                        .mockResolvedValue(
                            true,
                        );

                const result =
                    await executeSelfHealing(
                        createAutoApplyPlan(),
                        {
                            applyModificationPlan:
                                apply,

                            rerun,
                        },
                    );

                expect(
                    result.status,
                ).toBe(
                    "applied",
                );

                expect(
                    result.attempted,
                ).toBe(
                    true,
                );

                expect(
                    result.rerunAttempted,
                ).toBe(
                    true,
                );

                expect(
                    result.rerunSucceeded,
                ).toBe(
                    true,
                );

                expect(
                    result.healingAttempts,
                ).toBe(
                    1,
                );

                expect(
                    apply,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    rerun,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "does not rerun when applying the modification fails",
            async () => {
                const apply =
                    vi.fn()
                        .mockResolvedValue({
                            success:
                                false,

                            error:
                                "Invalid modification plan.",
                        });

                const rerun =
                    vi.fn();

                const result =
                    await executeSelfHealing(
                        createAutoApplyPlan(),
                        {
                            applyModificationPlan:
                                apply,

                            rerun,
                        },
                    );

                expect(
                    result.status,
                ).toBe(
                    "failed",
                );

                expect(
                    result.rerunAttempted,
                ).toBe(
                    false,
                );

                expect(
                    result.healingAttempts,
                ).toBe(
                    1,
                );

                expect(
                    result.error,
                ).toBe(
                    "Invalid modification plan.",
                );

                expect(
                    apply,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    rerun,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "reports failure when the rerun still fails",
            async () => {
                const apply =
                    vi.fn()
                        .mockResolvedValue({
                            success:
                                true,

                            appliedSteps:
                                2,
                        });

                const rerun =
                    vi.fn()
                        .mockResolvedValue(
                            false,
                        );

                const result =
                    await executeSelfHealing(
                        createAutoApplyPlan(),
                        {
                            applyModificationPlan:
                                apply,

                            rerun,
                        },
                    );

                expect(
                    result.status,
                ).toBe(
                    "failed",
                );

                expect(
                    result.rerunAttempted,
                ).toBe(
                    true,
                );

                expect(
                    result.rerunSucceeded,
                ).toBe(
                    false,
                );

                expect(
                    result.healingAttempts,
                ).toBe(
                    1,
                );

                expect(
                    result.error,
                ).toBe(
                    "Flow still failed after self-healing.",
                );
            },
        );

        it(
            "stops after one healing attempt",
            async () => {
                const apply =
                    vi.fn()
                        .mockResolvedValue({
                            success:
                                true,
                        });

                const rerun =
                    vi.fn()
                        .mockResolvedValue(
                            false,
                        );

                const result =
                    await executeSelfHealing(
                        createAutoApplyPlan(),
                        {
                            applyModificationPlan:
                                apply,

                            rerun,
                        },
                    );

                expect(
                    result.healingAttempts,
                ).toBe(
                    1,
                );

                expect(
                    apply,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    rerun,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "does not auto-apply manual fixes",
            async () => {
                const apply =
                    vi.fn();

                const rerun =
                    vi.fn();

                const result =
                    await executeSelfHealing(
                        {
                            canAutoApply:
                                false,

                            strategy:
                                "manual",

                            confidence:
                                "medium",

                            reason:
                                "Manual review required.",

                            modificationPlan:
                                null,

                            targetNodeId:
                                "node-1",
                        },
                        {
                            applyModificationPlan:
                                apply,

                            rerun,
                        },
                    );

                expect(
                    result.status,
                ).toBe(
                    "manualReview",
                );

                expect(
                    result.attempted,
                ).toBe(
                    false,
                );

                expect(
                    apply,
                ).not.toHaveBeenCalled();

                expect(
                    rerun,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "skips when no self-healing strategy exists",
            async () => {
                const apply =
                    vi.fn();

                const rerun =
                    vi.fn();

                const result =
                    await executeSelfHealing(
                        {
                            canAutoApply:
                                false,

                            strategy:
                                "none",

                            confidence:
                                "low",

                            reason:
                                "No healing strategy.",

                            modificationPlan:
                                null,

                            targetNodeId:
                                null,
                        },
                        {
                            applyModificationPlan:
                                apply,

                            rerun,
                        },
                    );

                expect(
                    result.status,
                ).toBe(
                    "skipped",
                );

                expect(
                    result.healingAttempts,
                ).toBe(
                    0,
                );

                expect(
                    apply,
                ).not.toHaveBeenCalled();

                expect(
                    rerun,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "handles rerun exceptions",
            async () => {
                const apply =
                    vi.fn()
                        .mockResolvedValue({
                            success:
                                true,
                        });

                const rerun =
                    vi.fn()
                        .mockRejectedValue(
                            new Error(
                                "Device disconnected.",
                            ),
                        );

                const result =
                    await executeSelfHealing(
                        createAutoApplyPlan(),
                        {
                            applyModificationPlan:
                                apply,

                            rerun,
                        },
                    );

                expect(
                    result.status,
                ).toBe(
                    "failed",
                );

                expect(
                    result.rerunAttempted,
                ).toBe(
                    true,
                );

                expect(
                    result.rerunSucceeded,
                ).toBe(
                    false,
                );

                expect(
                    result.error,
                ).toBe(
                    "Device disconnected.",
                );

                expect(
                    result.healingAttempts,
                ).toBe(
                    1,
                );
            },
        );
    },
);