import type { Edge } from "reactflow";
import type { FlowNode } from "../../flow/types/flowNode";

import { findIncomingEdges } from "./findIncomingEdges";
import { findOutgoingEdges } from "./findOutgoingEdges";
import { findNextNode } from "./findNextNode";
import { findStartNode } from "./findStartNode";

export class GraphNavigator {
    private readonly nodes: FlowNode[];
    private readonly edges: Edge[];

    constructor(
        nodes: FlowNode[],
        edges: Edge[]
    ) {
        this.nodes = nodes;
        this.edges = edges;
    }

    getStartNode(): FlowNode | null {
        return findStartNode(
            this.nodes,
            this.edges
        );
    }

    getOutgoingEdges(
        nodeId: string
    ): Edge[] {
        return findOutgoingEdges(
            nodeId,
            this.edges
        );
    }

    getIncomingEdges(
        nodeId: string
    ): Edge[] {
        return findIncomingEdges(
            nodeId,
            this.edges
        );
    }

    getNextNode(
        nodeId: string,
        output: string = "next"
    ): FlowNode | null {
        return findNextNode(
            nodeId,
            output,
            this.nodes,
            this.edges
        );
    }
}