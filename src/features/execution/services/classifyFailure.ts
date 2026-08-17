import type {
    FailureContext,
} from "./buildFailureContext";

export type FailureCategory =
    | "elementNotFound"
    | "invalidLocator"
    | "timeout"
    | "assertionFailure"
    | "sessionError"
    | "applicationStateError"
    | "unknown";

export interface FailureClassification {
    category:
        FailureCategory;

    confidence:
        | "high"
        | "medium"
        | "low";

    evidence: string[];
}

interface FailureRule {
    category:
        FailureCategory;

    confidence:
        | "high"
        | "medium"
        | "low";

    patterns: RegExp[];

    actionPatterns?: RegExp[];

    evidence:
        string;
}

const FAILURE_RULES: FailureRule[] = [
    {
        category:
            "elementNotFound",

        confidence:
            "high",

        patterns: [
            /element\s+not\s+found/i,
            /no\s+such\s+element/i,
            /unable\s+to\s+find\s+element/i,
            /could\s+not\s+find\s+element/i,
            /element\s+was\s+not\s+found/i,
        ],

        evidence:
            "The failure message indicates that the target element could not be found.",
    },

    {
        category:
            "invalidLocator",

        confidence:
            "high",

        patterns: [
            /invalid\s+selector/i,
            /invalid\s+locator/i,
            /invalid\s+xpath/i,
            /xpath.*invalid/i,
            /malformed.*xpath/i,
            /invalid\s+predicate/i,
            /selector.*invalid/i,
        ],

        evidence:
            "The failure message indicates that the locator or selector is invalid.",
    },

    {
        category:
            "timeout",

        confidence:
            "high",

        patterns: [
            /timeout/i,
            /timed\s+out/i,
            /time\s+out/i,
            /wait.*exceeded/i,
            /exceeded.*timeout/i,
        ],

        evidence:
            "The failure message indicates that an operation exceeded its allowed time.",
    },

    {
        category:
            "assertionFailure",

        confidence:
            "high",

        patterns: [
            /assert(?:ion)?\s+(?:failed|failure)/i,
            /expected.*but\s+received/i,
            /expected.*to\s+(?:equal|be|match)/i,
            /actual.*expected/i,
            /assert.*not\s+equal/i,
        ],

        actionPatterns: [
            /^assert$/i,
        ],

        evidence:
            "The failure is associated with an assertion or an expected-versus-actual mismatch.",
    },

    {
        category:
            "sessionError",

        confidence:
            "high",

        patterns: [
            /invalid\s+session/i,
            /session\s+not\s+created/i,
            /session\s+deleted/i,
            /session.*closed/i,
            /webdriver.*session/i,
            /appium.*session/i,
            /unable\s+to\s+connect.*appium/i,
            /connection\s+refused/i,
        ],

        evidence:
            "The failure indicates that the automation session or connection is unavailable.",
    },

    {
        category:
            "applicationStateError",

        confidence:
            "medium",

        patterns: [
            /application\s+is\s+not\s+in/i,
            /app.*not\s+running/i,
            /app.*closed/i,
            /wrong\s+screen/i,
            /unexpected\s+screen/i,
            /page.*not\s+loaded/i,
            /screen.*not\s+loaded/i,
        ],

        evidence:
            "The failure suggests that the application is not in the expected state.",
    },
];

function normalizeError(
    error: string | undefined,
): string {
    return (
        error
            ?.trim()
            .replace(
                /\s+/g,
                " ",
            ) ?? ""
    );
}

function matchesAny(
    text: string,
    patterns: RegExp[],
): boolean {
    return patterns.some(
        (
            pattern,
        ) =>
            pattern.test(
                text,
            ),
    );
}

export function classifyFailure(
    context: FailureContext,
): FailureClassification {
    const error =
        normalizeError(
            context.execution
                .error,
        );

    const action =
        context.node.action ??
        "";

    if (!error) {
        return {
            category:
                "unknown",

            confidence:
                "low",

            evidence: [
                "No failure error message was available.",
            ],
        };
    }

    for (
        const rule of
        FAILURE_RULES
    ) {
        const errorMatch =
            matchesAny(
                error,
                rule.patterns,
            );

        const actionMatch =
            rule.actionPatterns
                ? matchesAny(
                    action,
                    rule.actionPatterns,
                )
                : true;

        if (
            errorMatch &&
            actionMatch
        ) {
            return {
                category:
                    rule.category,

                confidence:
                    rule.confidence,

                evidence: [
                    rule.evidence,
                    `Matched error: "${error}"`,
                    `Failed action: "${action}".`,
                ],
            };
        }
    }

    /*
     * A failed assert node is still
     * useful evidence even when the
     * exact assertion wording is
     * unknown.
     */
    if (
        /^assert$/i.test(
            action,
        )
    ) {
        return {
            category:
                "assertionFailure",

            confidence:
                "medium",

            evidence: [
                `The failed node action is "${action}".`,
                `Failure message: "${error}"`,
            ],
        };
    }

    return {
        category:
            "unknown",

        confidence:
            "low",

        evidence: [
            `No deterministic failure rule matched "${error}".`,
            `Failed action: "${action}".`,
        ],
    };
}