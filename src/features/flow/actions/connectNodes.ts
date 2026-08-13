import type {
    Connection,
    Edge,
} from "reactflow";

import { createEdge } from "../factories/edgeFactory";

export function connectNodesAction(
    edges: Edge[],
    connection: Connection,
): Edge[] {
    if (
        !connection.source ||
        !connection.target
    ) {
        return edges;
    }

    return [
        ...edges,
        createEdge(
            connection.source,
            connection.target,
            connection.sourceHandle ??
            undefined,
            connection.targetHandle ??
            undefined,
        ),
    ];
}