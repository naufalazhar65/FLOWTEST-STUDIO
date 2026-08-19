import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { GraphNavigator } from "../graph/GraphNavigator";
import { executeNode } from "./executeNode";

export async function executeRepeat(
    repeatNode: FlowNode,
    nodes: FlowNode[],
    context: ExecutionContext,
) {
    const graph =
        new GraphNavigator(
            nodes,
            context.edges,
        );

    const bodyTransition =
        graph.getTransition(
            repeatNode.id,
            "body",
        );

    const nextTransition =
        graph.getTransition(
            repeatNode.id,
            "next",
        );

    if (!bodyTransition) {
        throw new Error(
            `Repeat node "${repeatNode.data.title}" has no body transition.`,
        );
    }

    if (!nextTransition) {
        throw new Error(
            `Repeat node "${repeatNode.data.title}" has no next transition.`,
        );
    }

    const count =
        repeatNode.data.action ===
            "repeat"
            ? Math.max(
                1,
                Math.floor(
                    Number(
                        repeatNode.data
                            .count,
                    ),
                ),
            )
            : 1;

    const exitNode =
        nextTransition.nextNode;

    for (
        let iteration = 0;
        iteration < count;
        iteration++
    ) {
        let currentNode:
            | FlowNode
            | null =
            bodyTransition.nextNode;

        const visited =
            new Set<string>();

        while (
            currentNode &&
            currentNode.id !==
            exitNode.id
        ) {
            if (
                visited.has(
                    currentNode.id,
                )
            ) {
                throw new Error(
                    `Repeat body contains a cycle at node "${currentNode.data.title}".`,
                );
            }

            visited.add(
                currentNode.id,
            );

            const result =
                await executeNode(
                    currentNode,
                    context,
                );

            const output =
                result.outputs[0] ??
                "next";

            const transition =
                graph.getTransition(
                    currentNode.id,
                    output,
                );

            /*
             * No outgoing transition means
             * this node is the end of the
             * Repeat body.
             *
             * The Repeat controller will
             * restart the body on the next
             * iteration.
             */
            if (!transition) {
                currentNode = null;

                break;
            }

            /*
             * If the body reaches the Repeat
             * exit node, stop this iteration.
             */
            if (
                transition.nextNode.id ===
                exitNode.id
            ) {
                currentNode = null;

                break;
            }

            currentNode =
                transition.nextNode;
        }
    }

    return {
        nextNode:
            exitNode,
    };
}