const PRIORITY_ORDER = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
};

const VALIDATION_ACTIONS = new Set([
    "assert",
    "gettext",
    "getdisplayed",
    "getenabled",
    "getselected",
    "elementexists",
    "getattribute",
]);

const PASSIVE_ACTIONS = new Set([
    "launchapp",
    "closeapp",
    "back",
    "home",
    "screenshot",
    "pressreturn",
]);

const INTERACTION_ACTIONS = new Set([
    "tap",
    "input",
    "longpress",
    "doubletap",
    "drag",
    "pinch",
    "zoom",
    "fling",
    "swipe",
    "scroll",
]);

function normalizeAction(
    finding,
) {
    const action =
        finding?.action ??
        finding?.nodeAction ??
        finding?.nodeType ??
        "";

    return String(action)
        .trim()
        .toLowerCase();
}

function getPriority(
    finding,
) {
    if (
        finding.severity ===
        "error"
    ) {
        return "critical";
    }

    if (
        finding.title ===
        "Flow ends without validation"
    ) {
        return "high";
    }

    if (
        finding.title ===
        "Missing assertion"
    ) {
        const action =
            normalizeAction(
                finding,
            );

        /*
         * Preserve the original behavior
         * when the analyzer does not provide
         * action context.
         */
        if (!action) {
            return "high";
        }

        /*
         * Validation/read actions do not
         * normally need another automatic
         * validation inserted.
         */
        if (
            VALIDATION_ACTIONS.has(
                action,
            )
        ) {
            return "low";
        }

        /*
         * Passive/setup actions are lower
         * priority than user interactions.
         */
        if (
            PASSIVE_ACTIONS.has(
                action,
            )
        ) {
            return "low";
        }

        /*
         * Actual interaction actions may change
         * application state and therefore have
         * higher validation importance.
         */
        if (
            INTERACTION_ACTIONS.has(
                action,
            )
        ) {
            return "high";
        }

        return "medium";
    }

    if (
        finding.title ===
        "Duplicate locator"
    ) {
        return "medium";
    }

    if (
        finding.title ===
        "XPath locator"
    ) {
        return "low";
    }

    if (
        finding.severity ===
        "warning"
    ) {
        return "medium";
    }

    return "low";
}

function getImpact(
    finding,
) {
    if (
        finding.title ===
        "Flow ends without validation"
    ) {
        return "high";
    }

    if (
        finding.title ===
        "Missing assertion"
    ) {
        const action =
            normalizeAction(
                finding,
            );

        /*
         * Preserve original behavior when
         * action information is unavailable.
         */
        if (!action) {
            return "high";
        }

        if (
            PASSIVE_ACTIONS.has(
                action,
            )
        ) {
            return "low";
        }

        if (
            INTERACTION_ACTIONS.has(
                action,
            )
        ) {
            return "high";
        }

        if (
            VALIDATION_ACTIONS.has(
                action,
            )
        ) {
            return "low";
        }

        return "medium";
    }

    if (
        finding.title ===
        "Duplicate locator"
    ) {
        return "medium";
    }

    if (
        finding.title ===
        "XPath locator"
    ) {
        return "low";
    }

    if (
        finding.severity ===
        "error"
    ) {
        return "high";
    }

    return "low";
}

function buildMissingAssertionRecommendation(
    finding,
) {
    const action =
        normalizeAction(
            finding,
        );

    /*
     * Analyzer findings without action
     * retain the original automatic fix.
     */
    if (!action) {
        return {
            title:
                "Add validation",

            description:
                "This action does not lead to a validation step within the expected flow path.",

            suggestedFix: {
                type:
                    "addValidation",

                targetNodeId:
                    finding.nodeId ??
                    null,
            },
        };
    }

    /*
     * Passive/setup actions should not
     * automatically receive a validation node.
     */
    if (
        PASSIVE_ACTIONS.has(
            action,
        )
    ) {
        return {
            title:
                "Review validation coverage",

            description:
                `The "${action}" step is not itself a strong validation boundary. Check whether the following state-changing action has an explicit validation.`,

            suggestedFix:
                null,
        };
    }

    /*
     * Read/validation actions already observe
     * application state.
     */
    if (
        VALIDATION_ACTIONS.has(
            action,
        )
    ) {
        return {
            title:
                "Review validation chain",

            description:
                `The "${action}" step already observes application state. Review the following validation chain instead of blindly adding another assertion.`,

            suggestedFix:
                null,
        };
    }

    /*
     * State-changing interactions can benefit
     * from an explicit validation.
     */
    if (
        INTERACTION_ACTIONS.has(
            action,
        )
    ) {
        return {
            title:
                "Add validation",

            description:
                `The "${action}" action may change application state without a clear validation. Add an observable validation after the relevant state change.`,

            suggestedFix: {
                type:
                    "addValidation",

                targetNodeId:
                    finding.nodeId ??
                    null,
            },
        };
    }

    return {
        title:
            "Review validation coverage",

        description:
            `The "${action}" step does not clearly establish whether the scenario reached its expected state. Review the next observable step and add validation if needed.`,

        suggestedFix: {
            type:
                "addValidation",

            targetNodeId:
                finding.nodeId ??
                null,
        },
    };
}

function buildRecommendation(
    finding,
) {
    switch (
        finding.title
    ) {
        case "Flow ends without validation":
            return {
                title:
                    "Add final validation",

                description:
                    "The scenario ends after an interaction without explicitly validating the expected outcome.",

                suggestedFix: {
                    type:
                        "addValidation",

                    targetNodeId:
                        finding.nodeId ??
                        null,
                },
            };

        case "Missing assertion":
            return buildMissingAssertionRecommendation(
                finding,
            );

        case "Duplicate locator":
            return {
                title:
                    "Review locator reuse",

                description:
                    "The same locator is reused by multiple nodes. Reuse can be valid, but it should be reviewed when the nodes represent different UI states or targets.",

                suggestedFix: {
                    type:
                        "reviewLocator",

                    targetNodeId:
                        finding.nodeId ??
                        null,
                },
            };

        case "XPath locator":
            return {
                title:
                    "Review XPath stability",

                description:
                    "XPath can be more sensitive to UI hierarchy changes than platform-specific locator strategies.",

                suggestedFix: {
                    type:
                        "reviewLocator",

                    targetNodeId:
                        finding.nodeId ??
                        null,
                },
            };

        default:
            return {
                title:
                    finding.recommendation ??
                    "Review this finding.",

                description:
                    finding.message ??
                    "This finding may affect flow quality.",

                suggestedFix:
                    null,
            };
    }
}

function calculateRecommendationScore(
    priority,
    impact,
) {
    const priorityScore =
        PRIORITY_ORDER[
            priority
        ] ?? 1;

    const impactScore =
        impact === "high"
            ? 3
            : impact === "medium"
                ? 2
                : 1;

    return (
        priorityScore * 10 +
        impactScore
    );
}

export function buildQARecommendations(
    analysis,
) {
    if (
        !analysis ||
        !Array.isArray(
            analysis.findings,
        )
    ) {
        return [];
    }

    const recommendations =
    analysis.findings
        .map(
            (
                finding,
                index,
            ) => {
                const priority =
                    getPriority(
                        finding,
                    );

                const impact =
                    getImpact(
                        finding,
                    );

                const recommendation =
                    buildRecommendation(
                        finding,
                    );

                return {
                    id:
                        `qa-recommendation-${index + 1}`,

                    priority,

                    impact,

                    score:
                        calculateRecommendationScore(
                            priority,
                            impact,
                        ),

                    category:
                        finding.category ??
                        "quality",

                    finding:
                        finding.title ??
                        "Quality finding",

                    nodeId:
                        finding.nodeId ??
                        null,

                    title:
                        recommendation.title,

                    description:
                        recommendation.description,

                    recommendation:
                        finding.recommendation ??
                        null,

                    suggestedFix:
                        recommendation.suggestedFix,

                    action:
                        finding.action ??
                        null,
                };
            },
        )
        .sort(
            (
                a,
                b,
            ) =>
                b.score -
                a.score,
        );

/*
 * --------------------------------------------------
 * Deduplicate overlapping findings.
 *
 * A terminal node may produce both:
 *
 * - Missing assertion
 * - Flow ends without validation
 *
 * Both describe the same missing-validation
 * problem. Prefer the terminal-flow finding.
 * --------------------------------------------------
 */
const terminalNodeIds =
    new Set(
        recommendations
            .filter(
                (
                    recommendation,
                ) =>
                    recommendation.finding ===
                    "Flow ends without validation" &&
                    recommendation.nodeId,
            )
            .map(
                (
                    recommendation,
                ) =>
                    recommendation.nodeId,
            ),
    );

const deduplicatedRecommendations =
    recommendations.filter(
        (
            recommendation,
        ) => {
            if (
                recommendation.finding ===
                    "Missing assertion" &&
                recommendation.nodeId &&
                terminalNodeIds.has(
                    recommendation.nodeId,
                )
            ) {
                return false;
            }

            return true;
        },
    );

return deduplicatedRecommendations;
}