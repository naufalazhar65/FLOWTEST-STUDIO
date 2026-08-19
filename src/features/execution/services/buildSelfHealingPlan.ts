import type {
    ExecutionFailureAnalysis,
} from "./analyzeExecutionFailure";

import {
    buildFailureModificationPlan,
} from "./buildFailureModificationPlan";

import {
    resolveAILocatorFromApp,
} from "../../ai/services/resolveAILocatorFromApp";

import type {
    AIModificationPlan,
} from "../../ai/types/AIModificationPlan";

import type {
    NodeAction,
} from "../../flow/types/flowNode";

import type {
    LocatorStrategy,
} from "../types/LocatorStrategy";

import type {
    LocatorStrategy as AILocatorStrategy,
} from "../../inspector/types/LocatorCandidate";

export interface SelfHealingPlan {
    canAutoApply: boolean;

    strategy:
    | "modification"
    | "runtimeRecovery"
    | "manual"
    | "none";

    confidence:
    | "high"
    | "medium"
    | "low";

    reason: string;

    modificationPlan:
    | AIModificationPlan
    | null;

    targetNodeId:
    string | null;
}

function toExecutionLocatorStrategy(
    strategy:
        AILocatorStrategy,
): LocatorStrategy {
    switch (
    strategy
    ) {
        case "accessibilityId":
            return "accessibilityId";

        case "id":
            return "id";

        case "xpath":
            return "xpath";

        case "className":
            return "className";

        case "androidUiAutomator":
            return "androidUiAutomator";

        case "iosPredicate":
            return "iOSPredicateString";

        case "iosClassChain":
            return "iOSClassChain";

        default:
            throw new Error(
                `Unsupported locator strategy: ${strategy}`,
            );
    }
}

function deriveLocatorTarget(
    analysis:
        ExecutionFailureAnalysis,
): string | null {
    const node =
        analysis.context?.node;

    if (!node) {
        return null;
    }

    /*
     * Prefer an explicit semantic target when the
     * failure context already provides one.
     */
    const semanticTarget =
        "semanticTarget" in node &&
            typeof node.semanticTarget ===
            "string"
            ? node.semanticTarget.trim()
            : "";

    if (semanticTarget) {
        return semanticTarget;
    }

    /*
     * Derive a stable human-readable target from
     * the node metadata.
     */
    const source =
        [
            node.title,
            node.subtitle,
            node.locator,
        ]
            .filter(
                (
                    value,
                ): value is string =>
                    typeof value ===
                    "string" &&
                    value.trim()
                        .length > 0,
            )
            .join(" ")
            .trim();

    const normalized =
        source.toLowerCase();

    if (
        /\busername\b/
            .test(
                normalized,
            )
    ) {
        return "username";
    }

    if (
        /\bpassword\b/
            .test(
                normalized,
            )
    ) {
        return "password";
    }

    if (
        /\blogin\b/
            .test(
                normalized,
            )
    ) {
        return "login";
    }

    if (
        /\bdashboard\b/
            .test(
                normalized,
            )
    ) {
        return "dashboard";
    }

    /*
     * Last fallback: use the title itself.
     *
     * Do not use the broken locator as the
     * semantic target.
     */
    return (
        node.title?.trim() ||
        null
    );
}

export async function buildSelfHealingPlan(
    analysis:
        ExecutionFailureAnalysis,
): Promise<SelfHealingPlan> {
    const fix =
        analysis.suggestedFix;

    /*
     * --------------------------------------------------
     * Locator repair
     * --------------------------------------------------
     *
     * A missing element is different from a timing
     * issue. We must first resolve a replacement
     * locator against the current Appium UI.
     * --------------------------------------------------
     */
    if (
        fix.type ===
        "repairLocator"
    ) {
        const targetNode =
            analysis.context?.node;

        if (!targetNode) {
            return {
                canAutoApply:
                    false,

                strategy:
                    "manual",

                confidence:
                    fix.confidence,

                reason:
                    "The failed node context is unavailable.",

                modificationPlan:
                    null,

                targetNodeId:
                    fix.targetNodeId,
            };
        }

        const semanticTarget =
            deriveLocatorTarget(
                analysis,
            );

        if (!semanticTarget) {
            return {
                canAutoApply:
                    false,

                strategy:
                    "manual",

                confidence:
                    fix.confidence,

                reason:
                    "A semantic target could not be determined for locator recovery.",

                modificationPlan:
                    null,

                targetNodeId:
                    targetNode.id,
            };
        }

        const resolution =
            await resolveAILocatorFromApp(
                semanticTarget,
            );

        if (
            resolution.status !==
            "resolved" ||
            !resolution.selected
        ) {
            return {
                canAutoApply:
                    false,

                strategy:
                    "manual",

                confidence:
                    fix.confidence,

                reason:
                    resolution.error ??
                    `No verified replacement locator was found for "${semanticTarget}".`,

                modificationPlan:
                    null,

                targetNodeId:
                    targetNode.id,
            };
        }

        const replacement =
            resolution.selected;

        /*
         * Never apply the repair when the
         * replacement is identical to the
         * broken locator.
         */
        if (
            replacement.strategy ===
            targetNode.locatorStrategy &&
            replacement.value ===
            targetNode.locator
        ) {
            return {
                canAutoApply:
                    false,

                strategy:
                    "manual",

                confidence:
                    "low",

                reason:
                    "The resolved locator is identical to the failed locator.",

                modificationPlan:
                    null,

                targetNodeId:
                    targetNode.id,
            };
        }

        const modificationPlan:
            AIModificationPlan = {
            type:
                "modification_plan",

            summary:
                `Repair locator for "${targetNode.title}".`,

            operation: {
                type:
                    "updateNode",

                targetNodeId:
                    targetNode.id,

                step: {
                    action:
                        targetNode.action as NodeAction,

                    title:
                        targetNode.title,

                    description:
                        targetNode.subtitle,

                    locatorStrategy:
                        toExecutionLocatorStrategy(
                            replacement.strategy,
                        ),

                    locator:
                        replacement.value,
                },
            },

            warnings: [
                `Self-healing replaced the failed locator with a verified ${replacement.strategy} locator. Re-run should be used to verify that the repair is stable.`,
            ],
        };

        return {
            canAutoApply:
                true,

            strategy:
                "modification",

            confidence:
                fix.confidence,

            reason:
                `A verified replacement locator was found for "${semanticTarget}".`,

            modificationPlan,

            targetNodeId:
                targetNode.id,
        };
    }

    /*
     * --------------------------------------------------
     * Runtime application state recovery
     * --------------------------------------------------
     */
    if (
        fix.type ===
        "restoreApplicationState"
    ) {
        const targetNode =
            analysis.context?.node;

        if (!targetNode) {
            return {
                canAutoApply:
                    false,

                strategy:
                    "manual",

                confidence:
                    fix.confidence,

                reason:
                    "The failed node context is unavailable for application state recovery.",

                modificationPlan:
                    null,

                targetNodeId:
                    fix.targetNodeId,
            };
        }

        return {
            canAutoApply:
                true,

            strategy:
                "runtimeRecovery",

            confidence:
                fix.confidence,

            reason:
                "A deterministic runtime recovery strategy is available for the failed application state.",

            modificationPlan:
                null,

            targetNodeId:
                targetNode.id,
        };
    }

    /*
     * --------------------------------------------------
     * Existing deterministic repair strategies
     * --------------------------------------------------
     */
    const modificationPlan =
        buildFailureModificationPlan(
            analysis,
        );

    if (
        fix.autoApplicable &&
        modificationPlan
    ) {
        return {
            canAutoApply:
                true,

            strategy:
                "modification",

            confidence:
                fix.confidence,

            reason:
                `A deterministic modification plan is available for "${fix.title}".`,

            modificationPlan,

            targetNodeId:
                fix.targetNodeId,
        };
    }

    /*
     * --------------------------------------------------
     * Manual review
     * --------------------------------------------------
     */
    if (
        fix.type !==
        "none"
    ) {
        return {
            canAutoApply:
                false,

            strategy:
                "manual",

            confidence:
                fix.confidence,

            reason:
                modificationPlan
                    ? `The suggested fix "${fix.title}" requires manual review before it can be applied automatically.`
                    : fix.description,

            modificationPlan,

            targetNodeId:
                fix.targetNodeId,
        };
    }

    return {
        canAutoApply:
            false,

        strategy:
            "none",

        confidence:
            "low",

        reason:
            "No safe self-healing strategy was identified.",

        modificationPlan:
            null,

        targetNodeId:
            null,
    };
}