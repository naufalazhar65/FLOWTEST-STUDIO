import type { IfNodeData } from "../../flow/types/flowNode";

import type { NodeEmitter } from "../types/NodeEmitter";

import { emitInlineFunction } from "../utils/emitInlineFunction";
import { quote } from "../utils/quote";

export const ifEmitter: NodeEmitter<
    IfNodeData
> = {
    emit(node) {
        const data = node.data;

        const actual =
            emitInlineFunction(
                "resolve_variables",
                [quote(data.actual)],
            );

        const expected =
            emitInlineFunction(
                "resolve_variables",
                [quote(data.expected)],
            );

        const condition =
            emitInlineFunction(
                "compare",
                [
                    actual,
                    expected,
                    quote(data.operator),
                ],
            );

        return `if ${condition}:`;
    },
};