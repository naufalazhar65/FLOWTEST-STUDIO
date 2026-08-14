import type {
    Connection,
    Edge,
} from "reactflow";

import { createEdge } from "../factories/edgeFactory";

export function connectNodesAction(
    edges: Edge[],
    connection: Connection,
): Edge[] {
    console.log(
        "[FLOW] Connecting:",
        {
            source:
                connection.source,  
            sourceHandle:
                connection.sourceHandle,
            target:
                connection.target,
            targetHandle:
                connection.targetHandle,
        },
    );

    if (
        !connection.source ||
        !connection.target
    ) {
        return edges;
    }

    const edge =
        createEdge(
            connection.source,
            connection.target,
            connection.sourceHandle ??
            undefined,
            connection.targetHandle ??
            undefined,
        );

    console.log(
        "[FLOW] Created edge:",
        edge,
    );

    return [
        ...edges,
        edge,
    ];
}