import type {
    SelfHealingPlan,
} from "./buildSelfHealingPlan";

export interface SelfHealingApplyResult {
    success: boolean;

    appliedSteps?: number;

    error?: string;
}

export type SelfHealingExecutionStatus =
    | "applied"
    | "manualReview"
    | "failed"
    | "skipped";

export interface SelfHealingExecutionResult {
    status:
    SelfHealingExecutionStatus;

    attempted:
    boolean;

    rerunAttempted:
    boolean;

    rerunSucceeded:
    boolean;

    healingAttempts:
    number;

    error:
    string | null;
}

export interface SelfHealingExecutorOptions {
    applyModificationPlan(
        plan: NonNullable<
            SelfHealingPlan["modificationPlan"]
        >,
    ):
        | SelfHealingApplyResult
        | Promise<SelfHealingApplyResult>;

    executeRecovery?():
        | SelfHealingApplyResult
        | Promise<SelfHealingApplyResult>;

    rerun(): Promise<boolean>;
}

export async function executeSelfHealing(
    plan: SelfHealingPlan,
    options: SelfHealingExecutorOptions,
): Promise<SelfHealingExecutionResult> {
    /*
     * No healing strategy exists.
     */
    if (
        plan.strategy ===
        "none"
    ) {
        return {
            status:
                "skipped",

            attempted:
                false,

            rerunAttempted:
                false,

            rerunSucceeded:
                false,

            healingAttempts:
                0,

            error:
                null,
        };
    }

    /*
     * A fix exists, but automatic
     * application is not allowed.
     */
    if (
        !plan.canAutoApply
    ) {
        return {
            status:
                "manualReview",

            attempted:
                false,

            rerunAttempted:
                false,

            rerunSucceeded:
                false,

            healingAttempts:
                0,

            error:
                null,
        };
    }

    /*
     * One and only one healing attempt.
     */
    let applyResult:
        | SelfHealingApplyResult;

    if (
        plan.strategy ===
        "runtimeRecovery"
    ) {
        if (
            !options.executeRecovery
        ) {
            return {
                status:
                    "failed",

                attempted:
                    false,

                rerunAttempted:
                    false,

                rerunSucceeded:
                    false,

                healingAttempts:
                    0,

                error:
                    "Runtime recovery executor is not configured.",
            };
        }

        applyResult =
            await options.executeRecovery();
    } else {
        if (
            !plan.modificationPlan
        ) {
            return {
                status:
                    "manualReview",

                attempted:
                    false,

                rerunAttempted:
                    false,

                rerunSucceeded:
                    false,

                healingAttempts:
                    0,

                error:
                    "No modification plan is available.",
            };
        }

        applyResult =
            await options.applyModificationPlan(
                plan.modificationPlan,
            );
    }

    if (
        !applyResult.success
    ) {
        return {
            status:
                "failed",

            attempted:
                true,

            rerunAttempted:
                false,

            rerunSucceeded:
                false,

            healingAttempts:
                1,

            error:
                applyResult.error ??
                "Failed to apply self-healing modification.",
        };
    }

    /*
     * Re-run once.
     */
    try {
        const rerunSucceeded =
            await options.rerun();

        return {
            status:
                rerunSucceeded
                    ? "applied"
                    : "failed",

            attempted:
                true,

            rerunAttempted:
                true,

            rerunSucceeded,

            healingAttempts:
                1,

            error:
                rerunSucceeded
                    ? null
                    : "Flow still failed after self-healing.",
        };
    } catch (
    error
    ) {
        return {
            status:
                "failed",

            attempted:
                true,

            rerunAttempted:
                true,

            rerunSucceeded:
                false,

            healingAttempts:
                1,

            error:
                error instanceof Error
                    ? error.message
                    : String(
                        error,
                    ),
        };
    }
}