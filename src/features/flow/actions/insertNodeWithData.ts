import type { Edge } from "reactflow";

import type {
    FlowNode,
    FlowNodeDataPatch,
} from "../types/flowNode";

import type { NodeType } from "../types/NodePlugin";

import { createNode } from "../factories/nodeFactory";
import { createEdge } from "../factories/edgeFactory";
import { plugins } from "../plugins";

interface InsertNodeWithDataResult {
    nodes: FlowNode[];

    edges: Edge[];

    node: FlowNode | null;
}

interface NodeCreateOverrides {
    locatorStrategy?: FlowNode["data"] extends infer T
        ? T extends {
            locatorStrategy: infer S;
        }
        ? S
        : never
        : never;

    locator?: string;

    text?: string;
}

function toCreateNodeOverrides(
    data: FlowNodeDataPatch,
): NodeCreateOverrides {
    const overrides: NodeCreateOverrides =
        {};

    if (
        "locatorStrategy" in data &&
        typeof data.locatorStrategy ===
        "string"
    ) {
        overrides.locatorStrategy =
            data.locatorStrategy as NodeCreateOverrides["locatorStrategy"];
    }

    if (
        "locator" in data &&
        typeof data.locator ===
        "string"
    ) {
        overrides.locator =
            data.locator;
    }

    if (
        "text" in data &&
        typeof data.text ===
        "string"
    ) {
        overrides.text =
            data.text;
    }

    return overrides;
}

function getDefaultSourceHandle(
    type: NodeType,
): string | undefined {
    const plugin =
        plugins.find(
            (item) =>
                item.type ===
                type,
        );

    return plugin?.handles?.outputs?.[0];
}

export function insertNodeWithDataAction(
    nodes: FlowNode[],
    edges: Edge[],
    edgeId: string | null,
    type: NodeType,
    data: FlowNodeDataPatch,
    afterNodeId?: string,
    beforeNodeId?: string,
): InsertNodeWithDataResult {
    /*
     * --------------------------------------------------
     * Insert before a specific node.
     *
     * source -> target
     *
     * becomes:
     *
     * source -> new -> target
     *
     * The new node's source handle is resolved from
     * its plugin definition.
     * --------------------------------------------------
     */

    if (beforeNodeId) {
        const targetNode =
            nodes.find(
                (node) =>
                    node.id ===
                    beforeNodeId,
            );

        if (!targetNode) {
            return {
                nodes,
                edges,
                node: null,
            };
        }

        const incomingEdges =
            edges.filter(
                (edge) =>
                    edge.target ===
                    targetNode.id,
            );

        const node =
            createNode(
                type,
                toCreateNodeOverrides(
                    data,
                ),
                {
                    x:
                        targetNode.position.x,

                    y:
                        targetNode.position.y -
                        180,
                },
            );

        const newNodeSourceHandle =
            getDefaultSourceHandle(
                type,
            );

        /*
         * Root node:
         *
         * No incoming edge exists.
         *
         * Simply create:
         *
         * new -> target
         */
        if (
            incomingEdges.length ===
            0
        ) {
            return {
                nodes: [
                    ...nodes,
                    node,
                ],

                edges: [
                    ...edges,

                    createEdge(
                        node.id,
                        targetNode.id,
                        newNodeSourceHandle,
                    ),
                ],

                node,
            };
        }

        /*
         * Normal node:
         *
         * Every incoming edge:
         *
         * source -> target
         *
         * becomes:
         *
         * source -> new -> target
         */
        const incomingEdgeIds =
            new Set(
                incomingEdges.map(
                    (edge) =>
                        edge.id,
                ),
            );

        const remainingEdges =
            edges.filter(
                (edge) =>
                    !incomingEdgeIds.has(
                        edge.id,
                    ),
            );

        const replacementEdges =
            incomingEdges.flatMap(
                (edge) => [
                    createEdge(
                        edge.source,
                        node.id,
                        edge.sourceHandle ??
                        undefined,
                    ),

                    createEdge(
                        node.id,
                        edge.target,
                        newNodeSourceHandle,
                        edge.targetHandle ??
                        undefined,
                    ),
                ],
            );

        return {
            nodes: [
                ...nodes,
                node,
            ],

            edges: [
                ...remainingEdges,
                ...replacementEdges,
            ],

            node,
        };
    }

    /*
     * --------------------------------------------------
     * Insert after a specific edge.
     *
     * source -> target
     *
     * becomes:
     *
     * source -> new -> target
     * --------------------------------------------------
     */

    if (edgeId) {
        const edge =
            edges.find(
                (item) =>
                    item.id ===
                    edgeId,
            );

        if (!edge) {
            return {
                nodes,
                edges,
                node: null,
            };
        }

        const sourceNode =
            nodes.find(
                (node) =>
                    node.id ===
                    edge.source,
            );

        const targetNode =
            nodes.find(
                (node) =>
                    node.id ===
                    edge.target,
            );

        const position = {
            x:
                sourceNode &&
                    targetNode
                    ? (
                        sourceNode.position.x +
                        targetNode.position.x
                    ) / 2
                    : sourceNode
                        ? sourceNode.position.x
                        : targetNode
                            ? targetNode.position.x
                            : 250,

            y:
                sourceNode &&
                    targetNode
                    ? (
                        sourceNode.position.y +
                        targetNode.position.y
                    ) / 2
                    : sourceNode
                        ? sourceNode.position.y +
                        180
                        : targetNode
                            ? targetNode.position.y -
                            180
                            : 80,
        };

        const node =
            createNode(
                type,
                toCreateNodeOverrides(
                    data,
                ),
                position,
            );

        const newNodeSourceHandle =
            getDefaultSourceHandle(
                type,
            );

        const remainingEdges =
            edges.filter(
                (item) =>
                    item.id !==
                    edgeId,
            );

        const nextEdges: Edge[] = [
            ...remainingEdges,

            createEdge(
                edge.source,
                node.id,
                edge.sourceHandle ??
                undefined,
            ),

            createEdge(
                node.id,
                edge.target,
                newNodeSourceHandle,
                edge.targetHandle ??
                undefined,
            ),
        ];

        return {
            nodes: [
                ...nodes,
                node,
            ],

            edges: nextEdges,

            node,
        };
    }

    /*
     * --------------------------------------------------
     * Terminal-node case.
     *
     * There is no outgoing edge, so append the
     * new node after the requested target node.
     * --------------------------------------------------
     */

    if (afterNodeId) {
        const targetNode =
            nodes.find(
                (node) =>
                    node.id ===
                    afterNodeId,
            );

        if (!targetNode) {
            return {
                nodes,
                edges,
                node: null,
            };
        }

        const node =
            createNode(
                type,
                toCreateNodeOverrides(
                    data,
                ),
                {
                    x:
                        targetNode.position.x,

                    y:
                        targetNode.position.y +
                        180,
                },
            );

        const newNodeSourceHandle =
            getDefaultSourceHandle(
                type,
            );

        const nextEdges: Edge[] = [
            ...edges,

            createEdge(
                targetNode.id,
                node.id,
            ),
        ];

        /*
         * The new node has no outgoing edge yet,
         * so its source handle is intentionally not
         * used here.
         */
        void newNodeSourceHandle;

        return {
            nodes: [
                ...nodes,
                node,
            ],

            edges: nextEdges,

            node,
        };
    }

    return {
        nodes,

        edges,

        node: null,
    };
}