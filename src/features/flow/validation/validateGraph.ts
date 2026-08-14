import type { Edge } from "reactflow";

import type { FlowNode } from "../types/flowNode";

export interface GraphValidationError {
    type:
        | "no-start-node"
        | "multiple-start-nodes"
        | "unreachable-node"
        | "missing-target"
        | "if-missing-true"
        | "if-missing-false"
        | "duplicate-edge"
        | "self-loop";

    nodeId?: string;

    edgeId?: string;

    message: string;
}

export interface GraphValidationResult {
    valid: boolean;

    errors: GraphValidationError[];
}

export function validateGraph(
    nodes: FlowNode[],
    edges: Edge[],
): GraphValidationResult {
    const errors: GraphValidationError[] = [];

    if (nodes.length === 0) {
        return {
            valid: true,
            errors: [],
        };
    }

    const nodeIds = new Set(
        nodes.map(
            (node) => node.id,
        ),
    );

    /*
     * --------------------------------------------------
     * Edge validation
     * --------------------------------------------------
     */

    const edgeKeys = new Set<string>();

    for (const edge of edges) {
        /*
         * Target node must exist.
         */

        if (!nodeIds.has(edge.target)) {
            errors.push({
                type: "missing-target",

                edgeId: edge.id,

                message:
                    `Edge "${edge.id}" targets ` +
                    `missing node "${edge.target}".`,
            });
        }

        /*
         * Direct self-loop.
         *
         * General cycles are intentionally allowed
         * because Repeat / Loop will need cycles.
         */

        if (
            edge.source ===
            edge.target
        ) {
            errors.push({
                type: "self-loop",

                nodeId: edge.source,

                edgeId: edge.id,

                message:
                    `Node "${edge.source}" ` +
                    `cannot connect to itself.`,
            });
        }

        /*
         * Duplicate edge.
         */

        const key = [
            edge.source,
            edge.sourceHandle ?? "",
            edge.target,
            edge.targetHandle ?? "",
        ].join("::");

        if (edgeKeys.has(key)) {
            errors.push({
                type: "duplicate-edge",

                edgeId: edge.id,

                message:
                    `Duplicate edge from ` +
                    `"${edge.source}" to ` +
                    `"${edge.target}".`,
            });
        }

        edgeKeys.add(key);
    }

    /*
     * --------------------------------------------------
     * Find start node
     * --------------------------------------------------
     *
     * This intentionally follows the same concept as
     * GraphNavigator:
     *
     * execution starts from the first node without
     * an incoming edge.
     */

    const incomingNodeIds =
        new Set<string>();

    for (const edge of edges) {
        if (
            nodeIds.has(edge.target)
        ) {
            incomingNodeIds.add(
                edge.target,
            );
        }
    }

    const startNodes =
        nodes.filter(
            (node) =>
                !incomingNodeIds.has(
                    node.id,
                ),
        );

    if (
        startNodes.length === 0
    ) {
        errors.push({
            type: "no-start-node",

            message:
                "Flow does not contain a start node.",
        });

        return {
            valid: false,
            errors,
        };
    }

    /*
     * IMPORTANT
     *
     * We intentionally use ONLY the first
     * start node for reachability.
     *
     * This matches GraphNavigator.getStartNode().
     */

    const startNode =
        startNodes[0];

    /*
     * --------------------------------------------------
     * Build adjacency graph
     * --------------------------------------------------
     */

    const adjacency =
        new Map<
            string,
            string[]
        >();

    for (const node of nodes) {
        adjacency.set(
            node.id,
            [],
        );
    }

    for (const edge of edges) {
        if (
            nodeIds.has(
                edge.source,
            ) &&
            nodeIds.has(
                edge.target,
            )
        ) {
            adjacency
                .get(edge.source)
                ?.push(edge.target);
        }
    }

    /*
     * --------------------------------------------------
     * Reachability
     * --------------------------------------------------
     */

    const visited =
        new Set<string>();

    const queue: string[] = [
        startNode.id,
    ];

    while (
        queue.length > 0
    ) {
        const nodeId =
            queue.shift();

        if (!nodeId) {
            continue;
        }

        if (
            visited.has(nodeId)
        ) {
            continue;
        }

        visited.add(nodeId);

        const nextNodes =
            adjacency.get(
                nodeId,
            ) ?? [];

        for (
            const nextNodeId
            of nextNodes
        ) {
            if (
                !visited.has(
                    nextNodeId,
                )
            ) {
                queue.push(
                    nextNodeId,
                );
            }
        }
    }

    /*
     * Any node not reachable from the actual
     * execution start is an orphan/unreachable node.
     */

    for (
        const node of nodes
    ) {
        if (
            !visited.has(node.id)
        ) {
            errors.push({
                type:
                    "unreachable-node",

                nodeId: node.id,

                message:
                    `Node "${node.data.title}" ` +
                    `(${node.id}) is unreachable ` +
                    `from the flow start.`,
            });
        }
    }

    /*
     * --------------------------------------------------
     * IF branch validation
     * --------------------------------------------------
     */

    for (
        const node of nodes
    ) {
        if (
            node.data.action !==
            "if"
        ) {
            continue;
        }

        const outgoingEdges =
            edges.filter(
                (edge) =>
                    edge.source ===
                    node.id,
            );

        const hasTrue =
            outgoingEdges.some(
                (edge) =>
                    edge.sourceHandle ===
                    "true",
            );

        const hasFalse =
            outgoingEdges.some(
                (edge) =>
                    edge.sourceHandle ===
                    "false",
            );

        if (!hasTrue) {
            errors.push({
                type:
                    "if-missing-true",

                nodeId: node.id,

                message:
                    `IF node "${node.data.title}" ` +
                    `is missing its TRUE branch.`,
            });
        }

        if (!hasFalse) {
            errors.push({
                type:
                    "if-missing-false",

                nodeId: node.id,

                message:
                    `IF node "${node.data.title}" ` +
                    `is missing its FALSE branch.`,
            });
        }
    }

    return {
        valid:
            errors.length === 0,

        errors,
    };
}