import type {
    SetVariableNodeData,
} from "../../flow/types/flowNode";

import type {
    NodeEmitter,
} from "../types/NodeEmitter";

import { emitFunction } from "../utils/emitFunction";
import { emitExpression } from "../utils/emitExpression";
import { quote } from "../utils/quote";

export const setVariableEmitter: NodeEmitter<
    SetVariableNodeData
> = {
    emit(node) {
        const data =
            node.data;

        return emitFunction(
            "set_variable",
            [
                quote(
                    data.variableName,
                ),

                emitExpression(
                    data.value,
                ),
            ],
        );
    },
};