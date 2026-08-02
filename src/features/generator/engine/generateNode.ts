import type { FlowNode } from "../../flow/types/flowNode";

import { emitterRegistry } from "../registry/emitterRegistry";
import type { GeneratorContext } from "../types/GeneratorContext";

export function generateNode(
    node: FlowNode,
    context: GeneratorContext,
): string {
    const emitter =
        emitterRegistry[node.data.action];

    if (!emitter) {
        throw new Error(
            `No emitter registered for "${node.data.action}"`,
        );
    }

    return emitter.emit(
        node,
        context,
    );
}