import type { Edge } from "reactflow";
import type { FlowNode } from "../../flow/types/flowNode";

function buildOutgoingMap(
    edges: Edge[],
): Map<string, string[]> {
    const outgoing =
        new Map<string, string[]>();

    for (const edge of edges) {
        const targets =
            outgoing.get(
                edge.source,
            );

        if (targets) {
            targets.push(
                edge.target,
            );
        } else {
            outgoing.set(
                edge.source,
                [
                    edge.target,
                ],
            );
        }
    }

    return outgoing;
}

export function findPathToNode(
    nodes: FlowNode[],
    edges: Edge[],
    targetNodeId: string,
): FlowNode[] {
    const targetNode =
        nodes.find(
            (node) =>
                node.id ===
                targetNodeId,
        );

    if (!targetNode) {
        return [];
    }

    const startNode =
        nodes.find(
            (node) =>
                !edges.some(
                    (edge) =>
                        edge.target ===
                        node.id,
                ),
        );

    if (!startNode) {
        return [];
    }

    const outgoing =
        buildOutgoingMap(
            edges,
        );

    const visited =
        new Set<string>();

    const path: FlowNode[] = [];

    function visit(
        node: FlowNode,
    ): boolean {
        if (
            visited.has(
                node.id,
            )
        ) {
            return false;
        }

        visited.add(
            node.id,
        );

        path.push(
            node,
        );

        if (
            node.id ===
            targetNodeId
        ) {
            return true;
        }

        const targets =
            outgoing.get(
                node.id,
            ) ?? [];

        for (
            const targetId of
            targets
        ) {
            const nextNode =
                nodes.find(
                    (candidate) =>
                        candidate.id ===
                        targetId,
                );

            if (
                !nextNode
            ) {
                continue;
            }

            if (
                visit(
                    nextNode,
                )
            ) {
                return true;
            }
        }

        path.pop();

        return false;
    }

    if (
        !visit(
            startNode,
        )
    ) {
        return [];
    }

    return path;
}