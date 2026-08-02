import type { FlowNode } from "../../flow/types/flowNode";
import type { GeneratorContext } from "./GeneratorContext";

export interface NodeEmitter<T = unknown> {
    emit(
        node: Omit<FlowNode, "data"> & {
            data: T;
        },
        context: GeneratorContext,
    ): string;
}