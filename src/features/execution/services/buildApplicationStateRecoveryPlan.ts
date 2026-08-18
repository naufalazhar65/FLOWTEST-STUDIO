import type { Edge } from "reactflow";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    LocatorStrategy,
} from "../types/LocatorStrategy";

import {
    findPathToNode,
} from "../graph/findPathToNode";

const RECOVERY_SYNCHRONIZATION_ACTIONS =
    new Set([
        "tap",
        "input",
        "swipe",
        "scroll",
        "back",
        "home",
        "closeApp",
        "hideKeyboard",
        "pressReturn",
    ]);

function isLocatorNode(
    node: FlowNode,
): boolean {
    if (!node.data) {
        return false;
    }

    return (
        "locatorStrategy" in
            node.data &&
        "locator" in
            node.data &&
        Boolean(
            node.data
                .locatorStrategy,
        ) &&
        Boolean(
            node.data
                .locator
                ?.trim(),
        )
    );
}

function createRecoveryWaitNode(
    targetNode: FlowNode,
): FlowNode {
    if (!targetNode.data) {
        return targetNode;
    }

    if (
        !(
            "locatorStrategy" in
            targetNode.data
        ) ||
        !(
            "locator" in
            targetNode.data
        )
    ) {
        return targetNode;
    }

    return {
        id:
            `recovery-wait-${targetNode.id}`,

        type:
            "flow",

        position: {
            ...targetNode.position,
        },

        data: {
            action:
                "wait",

            title:
                "Wait for recovery target",

            subtitle:
                "Wait until the recovery target becomes available.",

            locatorStrategy:
                targetNode.data
                    .locatorStrategy as LocatorStrategy,

            locator:
                targetNode.data
                    .locator,

            timeout:
                10000,

            pollingInterval:
                500,

            debug: {
                breakpoint:
                    false,
            },
        },
    } as FlowNode;
}

function findLaunchAppNode(
    path: FlowNode[],
): FlowNode | undefined {
    return path.find(
        (node) =>
            node.data?.action ===
            "launchApp",
    );
}

export function buildApplicationStateRecoveryPlan(
    nodes: FlowNode[],
    edges: Edge[],
    failedNodeId: string,
): FlowNode[] {
    const path =
        findPathToNode(
            nodes,
            edges,
            failedNodeId,
        );

    if (
        path.length === 0
    ) {
        return [];
    }

    const prerequisitePath =
        path.slice(
            0,
            -1,
        );

    const launchNode =
        findLaunchAppNode(
            prerequisitePath,
        );

    /*
     * When a Launch App node exists,
     * use it as the deterministic
     * application-state recovery
     * baseline.
     *
     * Replaying every predecessor can
     * reproduce the wrong application
     * state instead of restoring it.
     */
    if (
        launchNode
    ) {
        return [
            launchNode,
        ];
    }

    const recoveryPath:
        FlowNode[] = [];

    for (
        let index = 0;
        index <
        prerequisitePath.length;
        index++
    ) {
        const currentNode =
            prerequisitePath[
                index
            ];

        recoveryPath.push(
            currentNode,
        );

        const nextNode =
            prerequisitePath[
                index + 1
            ];

        if (
            !nextNode ||
            !currentNode.data
        ) {
            continue;
        }

        if (
            !RECOVERY_SYNCHRONIZATION_ACTIONS.has(
                currentNode.data.action,
            )
        ) {
            continue;
        }

        if (
            !isLocatorNode(
                nextNode,
            )
        ) {
            continue;
        }

        if (
            nextNode.data.action ===
            "wait"
        ) {
            continue;
        }

        recoveryPath.push(
            createRecoveryWaitNode(
                nextNode,
            ),
        );
    }

    return recoveryPath;
}