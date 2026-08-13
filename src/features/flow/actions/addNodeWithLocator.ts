import type { Edge } from "reactflow";

import type { LocatorStrategy } from "../../execution/types/LocatorStrategy";

import type { NodeType } from "../types/NodePlugin";
import type { FlowNode } from "../types/flowNode";

import { createNode } from "../factories/nodeFactory";
import { appendEdge } from "../services/graphService";

export interface LocatorOverride {
    locatorStrategy: LocatorStrategy;

    locator: string;

    text?: string;
}

export function addNodeWithLocatorAction(
    nodes: FlowNode[],
    edges: Edge[],
    type: NodeType,
    locator: LocatorOverride,
) {
    const lastNode = nodes.at(-1);

    const node = createNode(
        type,
        {
            locatorStrategy:
                locator.locatorStrategy,

            locator:
                locator.locator,

            ...(locator.text !==
                undefined && {
                text: locator.text,
            }),
        },
        {
            x: 250,
            y: lastNode
                ? lastNode.position.y + 180
                : 80,
        },
    );

    return {
        nodes: [
            ...nodes,
            node,
        ],

        edges: lastNode
            ? appendEdge(
                edges,
                lastNode.id,
                node.id,
            )
            : edges,

        node,
    };
}