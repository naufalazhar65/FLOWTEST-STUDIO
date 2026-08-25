import type {
    FailureClassification,
} from "./classifyFailure";

export interface RetryPolicy {
    maxAttempts: number;

    retryDelayMs: number;
}

export interface RetryDecision {
    retryable: boolean;

    reason: string;

    maxAttempts: number;

    retryDelayMs: number;
}

const DEFAULT_POLICY:
    RetryPolicy = {
    maxAttempts: 2,

    retryDelayMs: 500,
};

export function shouldRetryFailure(
    classification:
        FailureClassification,
    policy:
        RetryPolicy = DEFAULT_POLICY,
): RetryDecision {
    switch (
        classification.category
    ) {
        case "sessionError":
            return {
                retryable:
                    true,

                reason:
                    "Automation session or Appium connection failure may be transient.",

                maxAttempts:
                    policy.maxAttempts,

                retryDelayMs:
                    policy.retryDelayMs,
            };

        case "timeout":
            return {
                retryable:
                    true,

                reason:
                    "Timeout may be caused by temporary application or device slowness.",

                maxAttempts:
                    policy.maxAttempts,

                retryDelayMs:
                    policy.retryDelayMs,
            };

        case "applicationStateError":
            return {
                retryable:
                    true,

                reason:
                    "Application state may recover after a transient transition.",

                maxAttempts:
                    policy.maxAttempts,

                retryDelayMs:
                    policy.retryDelayMs,
            };

        case "elementNotFound":
            return {
                retryable:
                    false,

                reason:
                    "Element-not-found failures should be handled by locator/self-healing logic rather than generic retry.",

                maxAttempts:
                    1,

                retryDelayMs:
                    policy.retryDelayMs,
            };

        case "invalidLocator":
            return {
                retryable:
                    false,

                reason:
                    "Invalid locators are deterministic failures and should not be retried.",

                maxAttempts:
                    1,

                retryDelayMs:
                    policy.retryDelayMs,
            };

        case "assertionFailure":
            return {
                retryable:
                    false,

                reason:
                    "Assertion failures represent expected-versus-actual mismatches and must not be masked by retry.",

                maxAttempts:
                    1,

                retryDelayMs:
                    policy.retryDelayMs,
            };

        case "unknown":
        default:
            return {
                retryable:
                    false,

                reason:
                    "Unknown failures are not safe to retry automatically.",

                maxAttempts:
                    1,

                retryDelayMs:
                    policy.retryDelayMs,
            };
    }
}