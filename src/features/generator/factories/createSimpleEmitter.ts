import type { FlowNodeData } from "../../flow/types/flowNode";

import { createEmitter } from "./createEmitter";

export function createSimpleEmitter<
    T extends FlowNodeData,
>(
    functionName: string,
    buildArguments: (
        data: T,
    ) => string[],
) {
    return createEmitter<T>(
        functionName,
        (data) => buildArguments(data),
    );
}