import type {
    FailureContext,
} from "./buildFailureContext";

import type {
    FailureRootCause,
} from "./analyzeFailureRootCause";

export type FailureFixType =
    | "reviewLocator"
    | "repairLocator"
    | "addWait"
    | "reviewAssertion"
    | "restoreApplicationState"
    | "restartAutomationSession"
    | "none";

export interface FailureFixSuggestion {
    type:
    FailureFixType;

    title: string;

    description: string;

    targetNodeId:
    string | null;

    confidence:
    | "high"
    | "medium"
    | "low";

    reason: string;

    autoApplicable: boolean;
}

export function suggestFailureFix(
    context: FailureContext,
    rootCause: FailureRootCause,
): FailureFixSuggestion {
    switch (
    rootCause.category
    ) {
        case "staleLocator":
            return {
                type:
                    "reviewLocator",

                title:
                    "Review locator",

                description:
                    "Review the failed node locator and replace it with a more stable locator when necessary.",

                targetNodeId:
                    context.node.id,

                confidence:
                    rootCause.confidence,

                reason:
                    "The failure indicates that the configured locator may no longer match the current UI.",

                autoApplicable:
                    true,
            };

        case "invalidLocator":
            return {
                type:
                    "repairLocator",

                title:
                    "Repair invalid locator",

                description:
                    "Resolve and replace the failed locator with a verified locator from the active application UI.",

                targetNodeId:
                    context.node.id,

                confidence:
                    "high",

                reason:
                    "The automation driver could not locate the target using the configured locator.",

                autoApplicable:
                    true,
            };

        case "elementNotReady":
            return {
                type:
                    "addWait",

                title:
                    "Add synchronization",

                description:
                    "Add an appropriate wait or synchronization step before the failed interaction.",

                targetNodeId:
                    context.node.id,

                confidence:
                    rootCause.confidence,

                reason:
                    "The target element or operation was not ready within the available execution window.",

                autoApplicable:
                    true,
            };

        case "assertionMismatch":
            return {
                type:
                    "reviewAssertion",

                title:
                    "Review assertion",

                description:
                    "Review the expected value, actual value, and preceding action that produced the observed state.",

                targetNodeId:
                    context.node.id,

                confidence:
                    rootCause.confidence,

                reason:
                    "The observed value did not satisfy the configured assertion.",

                autoApplicable:
                    false,
            };

        case "wrongApplicationState":
            return {
                type:
                    "restoreApplicationState",

                title:
                    "Restore application state",

                description:
                    "Review the previous navigation or synchronization steps and restore the application to the expected screen before retrying.",

                targetNodeId:
                    context.node.id,

                confidence:
                    rootCause.confidence,

                reason:
                    "The application was not in the state required by the failed action.",

                autoApplicable:
                    false,
            };

        case "automationSession":
            return {
                type:
                    "restartAutomationSession",

                title:
                    "Reconnect automation session",

                description:
                    "Reconnect or recreate the Appium/WebDriver session before retrying the failed flow.",

                targetNodeId:
                    null,

                confidence:
                    rootCause.confidence,

                reason:
                    "The failure indicates that the automation session is unavailable or invalid.",

                autoApplicable:
                    false,
            };

        case "unknown":
        default:
            return {
                type:
                    "none",

                title:
                    "Manual investigation required",

                description:
                    "The available evidence is not sufficient for a safe automatic repair.",

                targetNodeId:
                    context.node.id,

                confidence:
                    "low",

                reason:
                    "No deterministic and safe automatic fix was identified.",

                autoApplicable:
                    false,
            };
    }
}