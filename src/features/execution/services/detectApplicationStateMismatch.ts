import type { FailureContext } from "./buildFailureContext";

import {
    findElementInPageSource,
} from "./findElementInPageSource";

import {
    parsePageSource,
} from "../../inspector/services/parsePageSource";

export type ApplicationStateMismatchResult = {
    detected: boolean;

    confidence:
    | "high"
    | "medium"
    | "low";

    evidence: string[];
};

const STATE_CHANGING_ACTIONS = new Set([
    "launchApp",
    "closeApp",
    "back",
    "home",
]);

function hasStateChangingPreviousNode(
    context: FailureContext,
): boolean {
    const pathNodes =
        context.executionPathNodes ??
        context.previousNodes;

    return pathNodes.some(
        (node) =>
            STATE_CHANGING_ACTIONS.has(
                node.action,
            ),
    );
}

function getFailedTarget(
    context: FailureContext,
): string {
    return (
        context.node.locator?.trim() ||
        context.node.title?.trim() ||
        ""
    );
}

export function detectApplicationStateMismatch(
    context: FailureContext,
): ApplicationStateMismatchResult {
    const evidence: string[] = [];

    if (
        !context.execution.pageSource?.trim()
    ) {
        return {
            detected: false,

            confidence:
                "low",

            evidence: [
                "No page source was available for application state analysis.",
            ],
        };
    }

    if (
        !hasStateChangingPreviousNode(
            context,
        )
    ) {
        return {
            detected: false,

            confidence:
                "low",

            evidence: [
                "No deterministic application state-changing predecessor was found.",
            ],
        };
    }

    const target =
        getFailedTarget(
            context,
        );

    if (!target) {
        return {
            detected: false,

            confidence:
                "low",

            evidence: [
                "The failed node does not contain a usable target for UI state comparison.",
            ],
        };
    }

    let elements;

    try {
        elements =
            parsePageSource(
                context.execution
                    .pageSource,
            );
    } catch (
    error
    ) {
        return {
            detected: false,

            confidence:
                "low",

            evidence: [
                "The active page source could not be parsed.",

                error instanceof Error
                    ? error.message
                    : String(
                        error,
                    ),
            ],
        };
    }

    const targetElement =
        findElementInPageSource(
            elements,
            target,
        );

    if (
        targetElement
    ) {
        return {
            detected: false,

            confidence:
                "low",

            evidence: [
                `The failed target "${target}" is still present in the active UI.`,
            ],
        };
    }

    evidence.push(
        `The failed target "${target}" is not present in the active UI.`,
    );

    const pathNodes =
        context.executionPathNodes ??
        context.previousNodes;

    const stateChangingNodes =
        pathNodes.filter(
            (node) =>
                STATE_CHANGING_ACTIONS.has(
                    node.action,
                ),
        );

    evidence.push(
        `A state-changing predecessor was executed: ${stateChangingNodes
            .map(
                (node) =>
                    `"${node.title}" (${node.action})`,
            )
            .join(", ")}.`,
    );

    return {
        detected: true,

        confidence:
            "high",

        evidence,
    };
}