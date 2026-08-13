import type {
    FlowNodeDataPatch,
} from "../types/flowNode";

import type {
    NodeFieldKey,
} from "../types/nodeField";

export function createNodeFieldPatch(
    key: NodeFieldKey,
    value: string | number | boolean,
): FlowNodeDataPatch {
    return {
        [key]: value,
    } as FlowNodeDataPatch;
}