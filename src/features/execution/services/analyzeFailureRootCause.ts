import type {
    FailureClassification,
} from "./classifyFailure";

import type {
    FailureContext,
} from "./buildFailureContext";

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
        case "elementNotFound":
            if (
                context.node.locator
            ) {
                return {
                    category:
                        "staleLocator",

                    title:
                        "Target element could not be located",

                    explanation:
                        "The configured locator did not resolve to an element during execution. The locator may no longer match the current UI hierarchy or the application may not be in the expected state.",

                    confidence:
                        "high",

                    evidence: [
                        ...classification.evidence,

                        `Locator strategy: ${
                            context.node
                                .locatorStrategy ??
                            "unknown"
                        }`,

                        `Locator: ${
                            context.node
                                .locator
                        }`,
                    ],

                    likelyCauses: [
                        "Locator became stale after a UI change.",
                        "The application is on a different screen.",
                        "The target element is not currently rendered.",
                        "The target locator is too specific.",
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

                    `Locator strategy: ${
                        context.node
                            .locatorStrategy ??
                        "unknown"
                    }`,

                    `Locator: ${
                        context.node
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