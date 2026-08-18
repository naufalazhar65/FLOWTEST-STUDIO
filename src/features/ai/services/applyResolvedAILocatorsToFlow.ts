import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    resolveAILocatorFromApp,
} from "./resolveAILocatorFromApp";

import type {
    LocatorCandidate,
} from "../../inspector/types/LocatorCandidate";

type ResolvedFlowLocatorStrategy =
    | "id"
    | "xpath"
    | "accessibilityId";

function isResolvedFlowLocatorStrategy(
    strategy:
        LocatorCandidate["strategy"],
): strategy is ResolvedFlowLocatorStrategy {
    return (
        strategy ===
        "id" ||
        strategy ===
        "xpath" ||
        strategy ===
        "accessibilityId"
    );
}

export type AILocatorApplyStatus =
    | "resolved"
    | "ambiguous"
    | "notFound"
    | "unavailable";

export interface AILocatorApplyResult {
    nodeId: string;

    target: string;

    status:
    AILocatorApplyStatus;

    locatorStrategy:
    | ResolvedFlowLocatorStrategy
    | null;

    locator:
    string | null;

    error?: string;
}

export interface ApplyResolvedAILocatorsResult {
    success: boolean;

    resolved: number;

    unresolved: number;

    results:
    AILocatorApplyResult[];

    error?: string;
}

function isLocatorNode(
    node: ReturnType<
        typeof useFlowStore.getState
    >["nodes"][number],
): boolean {
    const action =
        node.data.action;

    return (
        action === "tap" ||
        action === "input" ||
        action === "wait" ||
        action === "longPress" ||
        action === "doubleTap" ||
        action === "elementExists" ||
        action === "getText" ||
        action === "getDisplayed" ||
        action === "getEnabled" ||
        action === "getSelected" ||
        action === "getAttribute" ||
        action === "getLocation" ||
        action === "getRect" ||
        action === "getSize"
    );
}

function getSemanticTarget(
    node: ReturnType<
        typeof useFlowStore.getState
    >["nodes"][number],
): string | null {
    const data =
        node.data;

    if (
        "semanticTarget" in data &&
        typeof data.semanticTarget ===
        "string"
    ) {
        const semanticTarget =
            normalizeSemanticTarget(
                data.semanticTarget,
            );

        if (
            semanticTarget
        ) {
            return semanticTarget;
        }
    }

    if (
        "locator" in data &&
        typeof data.locator ===
        "string"
    ) {
        const locator =
            data.locator.trim();

        if (
            locator
        ) {
            return locator;
        }
    }

    return null;
}
function normalizeSemanticTarget(
    value: string,
): string | null {
    let normalized =
        value.trim();

    if (!normalized) {
        return null;
    }

    /*
     * Ignore generic UI titles that don't
     * identify a real semantic target.
     */
    const genericTitles =
        new Set([
            "input text",
            "tap element",
            "verify value",
            "wait until element",
            "long press",
            "double tap",
            "get text",
            "element exists",
            "get displayed",
            "get enabled",
            "get selected",
            "get attribute",
            "get location",
            "get rect",
            "get size",
        ]);

    if (
        genericTitles.has(
            normalized.toLowerCase(),
        )
    ) {
        return null;
    }

    /*
     * Remove common action prefixes.
     *
     * Example:
     *   "Input Username"
     *       → "Username"
     *
     *   "Tap Login Button"
     *       → "Login"
     */
    normalized =
        normalized
            .replace(
                /^(enter|input|type|tap|click|press|verify|check|assert|select|choose)\s+/i,
                "",
            )
            .trim();

    /*
     * Remove common UI suffixes.
     *
     * Example:
     *   "Username Field"
     *       → "Username"
     *
     *   "Login Button"
     *       → "Login"
     */
    normalized =
        normalized
            .replace(
                /\s+(button|field|element|input|textbox|text field)$/i,
                "",
            )
            .trim();

    return normalized || null;
}

export async function applyResolvedAILocatorsToFlow(
    nodeIds?: ReadonlySet<string>,
): Promise<ApplyResolvedAILocatorsResult> {
    const store =
        useFlowStore.getState();

    /*
     * If nodeIds are supplied, only those nodes
     * belong to the current AI-generated flow.
     *
     * If nodeIds are omitted, preserve legacy
     * behavior for existing callers/tests.
     */
    const nodes =
        store.nodes.filter(
            (node) =>
                isLocatorNode(
                    node,
                ) &&
                (
                    !nodeIds ||
                    nodeIds.has(
                        node.id,
                    )
                ),
        );

    if (
        nodes.length ===
        0
    ) {
        return {
            success:
                true,

            resolved:
                0,

            unresolved:
                0,

            results:
                [],
        };
    }

    const results:
        AILocatorApplyResult[] =
        [];

    const resolvedPatches:
        Array<{
            nodeId:
            string;

            locatorStrategy:
            ResolvedFlowLocatorStrategy;

            locator:
            string;
        }> = [];

    for (
        const node of nodes
    ) {
        const target =
            getSemanticTarget(
                node,
            );

        if (!target) {
            /*
             * Nodes such as Assert may intentionally
             * not have a locator. They are not part
             * of the locator-resolution operation.
             */
            continue;
        }

        const action =
    node.data.action;

const resolution =
    await resolveAILocatorFromApp(
        target,
        action === "input"
            ? "input"
            : action === "tap"
                ? "tap"
                : action === "wait"
                    ? "wait"
                    : "generic",
    );

        if (
            resolution.status !==
            "resolved"
        ) {
            results.push({
                nodeId:
                    node.id,

                target,

                status:
                    resolution.status,

                locatorStrategy:
                    null,

                locator:
                    null,

                error:
                    resolution.error,
            });

            continue;
        }

        const selected =
            resolution.selected;

        if (
            !selected ||
            !isResolvedFlowLocatorStrategy(
                selected.strategy,
            )
        ) {
            results.push({
                nodeId:
                    node.id,

                target,

                status:
                    "notFound",

                locatorStrategy:
                    null,

                locator:
                    null,

                error:
                    selected
                        ? `Unsupported flow locator strategy: ${selected.strategy}.`
                        : "Locator resolution returned no selected candidate.",
            });

            continue;
        }

        resolvedPatches.push({
            nodeId:
                node.id,

            locatorStrategy:
                selected.strategy,

            locator:
                selected.value,
        });

        results.push({
            nodeId:
                node.id,

            target,

            status:
                "resolved",

            locatorStrategy:
                selected.strategy,

            locator:
                selected.value,
        });
    }

    const resolved =
        results.filter(
            (
                result,
            ) =>
                result.status ===
                "resolved",
        ).length;

    const unresolved =
        results.filter(
            (
                result,
            ) =>
                result.status !==
                "resolved",
        ).length;

    /*
     * Do not partially modify the flow.
     *
     * If one generated AI locator cannot be
     * resolved, leave all generated nodes
     * untouched.
     */
    if (
        unresolved > 0
    ) {
        return {
            success:
                false,

            resolved,

            unresolved,

            results,
        };
    }

    /*
     * Commit locator changes only after
     * every selected locator has resolved.
     */
    for (
        const patch of
        resolvedPatches
    ) {
        store.updateNodeData(
            patch.nodeId,
            {
                locatorStrategy:
                    patch.locatorStrategy,

                locator:
                    patch.locator,
            },
        );
    }

    return {
        success:
            true,

        resolved,

        unresolved:
            0,

        results,
    };
}