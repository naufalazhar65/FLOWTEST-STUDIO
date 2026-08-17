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
        ResolvedFlowLocatorStrategy |
        null;

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
        action === "assert" ||
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
        !("locator" in data) ||
        typeof data.locator !==
            "string"
    ) {
        return null;
    }

    const locator =
        data.locator.trim();

    if (!locator) {
        return null;
    }

    return locator;
}

export async function applyResolvedAILocatorsToFlow(
    nodeIds?: ReadonlySet<string>,
): Promise<ApplyResolvedAILocatorsResult> {
    const store =
        useFlowStore.getState();

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
        nodes.length === 0
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
            continue;
        }

        const resolution =
            await resolveAILocatorFromApp(
                target,
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
     * If one generated AI node cannot be
     * resolved, leave every generated node
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
     * Commit the locator changes only after
     * every selected AI node has been resolved.
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