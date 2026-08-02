import type { Edge } from "reactflow";
import type { FlowNode } from "../../flow/types/flowNode";

import { findIncomingEdges } from "./findIncomingEdges";
import { findOutgoingEdges } from "./findOutgoingEdges";
import { findNextNode } from "./findNextNode";
import { findStartNode } from "./findStartNode";
import type { GraphTransition } from "../types/GraphTransition";

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

    getTransition(
        nodeId: string,
        output: string = "next"
    ): GraphTransition | null {

        const edge = this.edges.find(
            (edge) =>
                edge.source === nodeId &&
                (edge.sourceHandle ?? "next") === output
        );

        if (!edge) {
            return null;
        }

        const nextNode =
            this.nodes.find(
                (node) =>
                    node.id === edge.target
            );

        if (!nextNode) {
            return null;
        }

        return {
            edge,
            nextNode,
        };
    }

    getExecutionOrder(): FlowNode[] {
        const ordered: FlowNode[] = [];

        const visited = new Set<string>();

        let current = this.getStartNode();

        while (current) {
            if (visited.has(current.id)) {
                break;
            }

            visited.add(current.id);

            ordered.push(current);

            current = this.getNextNode(
                current.id,
            );
        }

        return ordered;
    }
}