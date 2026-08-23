import type {
    FailureClassification,
} from "./classifyFailure";

import type {
    FailureContext,
} from "./buildFailureContext";

import {
    detectApplicationStateMismatch,
} from "./detectApplicationStateMismatch";

export type RootCauseCategory =
    | "staleLocator"
    | "invalidLocator"
    | "elementNotReady"
    | "wrongApplicationState"
    | "assertionMismatch"
    | "automationSession"
    | "unknown";

export interface FailureRootCause {
    category:
    RootCauseCategory;

    title: string;

    explanation: string;

    confidence:
    | "high"
    | "medium"
    | "low";

    evidence: string[];

    likelyCauses: string[];
}

export function analyzeFailureRootCause(
    context: FailureContext,
    classification: FailureClassification,
): FailureRootCause {
    switch (
    classification.category
    ) {
        case "elementNotFound": {
            if (context.node.locator?.trim()) {
                return {
                    category:
                        "staleLocator",

                    title:
                        "Target locator may be stale",

                    explanation:
                        "The configured locator did not resolve to an element during execution. The target may still exist in the current UI under a different locator.",

                    confidence:
                        "high",

                    evidence: [
                        ...classification.evidence,

                        `Locator strategy: ${context.node.locatorStrategy ??
                        "unknown"
                        }`,

                        `Locator: ${context.node.locator
                        }`,
                    ],

                    likelyCauses: [
                        "The locator became stale after a UI change.",
                        "The target element is still present but uses a different locator.",
                        "The locator is too specific.",
                        "The application may be on a different screen.",
                    ],
                };
            }

            const stateMismatch =
                detectApplicationStateMismatch(
                    context,
                );

            if (stateMismatch.detected) {
                return {
                    category:
                        "wrongApplicationState",

                    title:
                        "Application is in an unexpected state",

                    explanation:
                        "The failed target was not present in the active UI after a state-changing predecessor, indicating that the application may no longer be on the screen expected by the flow.",

                    confidence:
                        stateMismatch.confidence,

                    evidence: [
                        ...classification.evidence,

                        ...stateMismatch.evidence,
                    ],

                    likelyCauses: [
                        "The application navigated to another screen.",
                        "A previous state-changing action changed the current application state.",
                        "The app was returned to a previous screen.",
                        "The test flow is attempting to interact with an element from another application state.",
                    ],
                };
            }

            return {
                category:
                    "elementNotReady",

                title:
                    "Target element was not available",

                explanation:
                    "The target element could not be found and the node does not contain a usable locator.",

                confidence:
                    "medium",

                evidence:
                    classification.evidence,

                likelyCauses: [
                    "The target element was not rendered yet.",
                    "The application is on an unexpected screen.",
                    "The node configuration is incomplete.",
                ],
            };
        }

        case "invalidLocator":
            return {
                category:
                    "invalidLocator",

                title:
                    "Locator is invalid",

                explanation:
                    "The configured locator cannot be parsed or evaluated by the automation driver.",

                confidence:
                    "high",

                evidence: [
                    ...classification.evidence,

                    `Locator strategy: ${context.node
                        .locatorStrategy ??
                    "unknown"
                    }`,

                    `Locator: ${context.node
                        .locator ??
                    "empty"
                    }`,
                ],

                likelyCauses: [
                    "Malformed XPath or selector.",
                    "Locator syntax is incompatible with the current automation strategy.",
                    "A locator was generated from an outdated UI structure.",
                ],
            };

        case "timeout":
            return {
                category:
                    "elementNotReady",

                title:
                    "Operation timed out",

                explanation:
                    "The operation did not complete within the configured timeout window.",

                confidence:
                    "high",

                evidence:
                    classification.evidence,

                likelyCauses: [
                    "The element was not ready in time.",
                    "The application was still loading.",
                    "The configured timeout is too short.",
                    "The application entered an unexpected state.",
                ],
            };

        case "assertionFailure":
            return {
                category:
                    "assertionMismatch",

                title:
                    "Assertion result did not match expectation",

                explanation:
                    "The application produced a value that did not satisfy the configured assertion.",

                confidence:
                    "high",

                evidence:
                    classification.evidence,

                likelyCauses: [
                    "The application produced an unexpected value.",
                    "The expected value is outdated.",
                    "The previous action did not produce the intended state.",
                    "The assertion is targeting the wrong value.",
                ],
            };

        case "sessionError":
            return {
                category:
                    "automationSession",

                title:
                    "Automation session is unavailable",

                explanation:
                    "The Appium/WebDriver session was unavailable or disconnected during execution.",

                confidence:
                    "high",

                evidence:
                    classification.evidence,

                likelyCauses: [
                    "The Appium session was terminated.",
                    "The device disconnected.",
                    "The automation server became unavailable.",
                    "The session became invalid.",
                ],
            };

        case "applicationStateError":
            return {
                category:
                    "wrongApplicationState",

                title:
                    "Application is in an unexpected state",

                explanation:
                    "The failure indicates that the application was not in the state required by the current test step.",

                confidence:
                    "medium",

                evidence:
                    classification.evidence,

                likelyCauses: [
                    "A previous step failed silently.",
                    "The application navigated to another screen.",
                    "The app was restarted or reset.",
                    "The test flow is missing a synchronization step.",
                ],
            };

        case "unknown":
        default:
            return {
                category:
                    "unknown",

                title:
                    "Failure root cause is unclear",

                explanation:
                    "The available execution evidence is not sufficient to determine a reliable root cause.",

                confidence:
                    "low",

                evidence:
                    classification.evidence,

                likelyCauses: [
                    "The failure message is too generic.",
                    "Additional execution evidence is required.",
                    "The failure may require driver-specific analysis.",
                ],
            };
    }
}