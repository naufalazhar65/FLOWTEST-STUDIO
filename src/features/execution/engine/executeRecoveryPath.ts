import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    ExecutionContext,
} from "../types/ExecutionContext";

import {
    executeNode,
} from "./executeNode";

export async function executeRecoveryPath(
    path: FlowNode[],
    context: ExecutionContext,
): Promise<void> {
    for (
        const node of path
    ) {
        await executeNode(
            node,
            context,
        );
    }
}