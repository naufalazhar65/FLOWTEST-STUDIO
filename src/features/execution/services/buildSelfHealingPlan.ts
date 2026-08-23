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
    ModificationPlan,
} from "../../modification/types/ModificationPlan";

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
    | ModificationPlan
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

function deriveGenericLocatorTargets(
    analysis:
        ExecutionFailureAnalysis,
): string[] {
    const node =
        analysis.context?.node;

    if (!node) {
        return [];
    }

    return [
        node.locator,
        node.title,
        node.subtitle,
    ]
        .filter(
            (
                value,
            ): value is string =>
                typeof value ===
                "string" &&
                value.trim().length > 0,
        )
        .map(
            (value) =>
                value.trim(),
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

        /*
         * --------------------------------------------------
         * PRIMARY PATH
         *
         * Use the replacement locator already discovered
         * from the active page source.
         *
         * This path is completely generic:
         * no node names, semantic keywords, or Login-specific
         * rules are required.
         * --------------------------------------------------
         */
        const suggestedLocator =
            fix.suggestedLocator?.trim();

        const suggestedLocatorStrategy =
            fix.locatorStrategy?.trim();

        if (
            suggestedLocator &&
            suggestedLocatorStrategy
        ) {
            if (
                suggestedLocator ===
                targetNode.locator &&
                suggestedLocatorStrategy ===
                targetNode.locatorStrategy
            ) {
                return {
                    canAutoApply:
                        false,

                    strategy:
                        "manual",

                    confidence:
                        "low",

                    reason:
                        "The suggested locator is identical to the failed locator.",

                    modificationPlan:
                        null,

                    targetNodeId:
                        targetNode.id,
                };
            }

            const modificationPlan:
                ModificationPlan = {
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
                            suggestedLocatorStrategy as LocatorStrategy,

                        locator:
                            suggestedLocator,

                        ...(typeof targetNode.text ===
                            "string"
                            ? {
                                text:
                                    targetNode.text,
                            }
                            : {}),
                    },
                },

                warnings: [
                    "The replacement locator was derived directly from the active page source captured during the failed execution.",
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
                    "A replacement locator was found directly from the active page source.",

                modificationPlan,

                targetNodeId:
                    targetNode.id,
            };
        }

        /*
         * --------------------------------------------------
         * FALLBACK PATH
         *
         * Keep the existing AI locator resolver as a
         * fallback for cases where direct page-source repair
         * did not produce a replacement.
         *
         * The fallback target is generic node metadata only.
         * --------------------------------------------------
         */
        const genericTargets =
            deriveGenericLocatorTargets(
                analysis,
            );

        if (
            genericTargets.length ===
            0
        ) {
            return {
                canAutoApply:
                    false,

                strategy:
                    "manual",

                confidence:
                    fix.confidence,

                reason:
                    "A generic locator target could not be determined for fallback locator recovery.",

                modificationPlan:
                    null,

                targetNodeId:
                    targetNode.id,
            };
        }

        const resolution =
            await resolveAILocatorFromApp({
                targets:
                    genericTargets,

                action:
                    targetNode.action ===
                        "input"
                        ? "input"
                        : targetNode.action ===
                            "tap"
                            ? "tap"
                            : targetNode.action ===
                                "wait"
                                ? "wait"
                                : "generic",
            });

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
                    `No verified replacement locator was found for "${genericTargets.join(
                        " | ",
                    )}".`,

                modificationPlan:
                    null,

                targetNodeId:
                    targetNode.id,
            };
        }

        const replacement =
            resolution.selected;

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
                    fix.confidence,

                reason:
                    `No verified replacement locator was found for "${genericTargets.join(
                        " | ",
                    )}".`,

                modificationPlan:
                    null,

                targetNodeId:
                    targetNode.id,
            };
        }

        const modificationPlan:
            ModificationPlan = {
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

                    ...(typeof targetNode.text ===
                        "string"
                        ? {
                            text:
                                targetNode.text,
                        }
                        : {}),
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
                "A verified replacement locator was found by the generic fallback resolver.",

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
                    true,

                strategy:
                    "runtimeRecovery",

                confidence:
                    fix.confidence,

                reason:
                    "The application may be in the wrong state. Restore the application state before retrying the failed node.",

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
                "The application may be in the wrong state. Restore the application state before retrying the failed node.",

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