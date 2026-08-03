import type { Edge } from "reactflow";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import { GraphNavigator } from "../../execution/graph/GraphNavigator";

export function orderNodes(
    nodes: FlowNode[],
    edges: Edge[],
): FlowNode[] {
    const graph =
        new GraphNavigator(
            nodes,
            edges,
        );

    return graph.getExecutionOrder();
}