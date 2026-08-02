import type { FlowNodeData } from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";
import type { NodeEmitter } from "../types/NodeEmitter";

import { emitFunction } from "../utils/emitFunction";

export function createEmitter<
    T extends FlowNodeData,
>(
    functionName: string,
    buildArguments: (
        data: T,
        context: GeneratorContext,
    ) => string[],
): NodeEmitter<T> {
    return {
        emit(
            node,
            context,
        ) {
            return emitFunction(
                functionName,
                buildArguments(
                    node.data,
                    context,
                ),
            );
        },
    };
}