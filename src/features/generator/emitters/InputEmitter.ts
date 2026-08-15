import type {
    InputNodeData,
} from "../../flow/types/flowNode";

import type {
    NodeEmitter,
} from "../types/NodeEmitter";

import { emitFunction } from "../utils/emitFunction";
import { emitExpression } from "../utils/emitExpression";
import { locatorStrategy } from "../utils/locator";
import { quote } from "../utils/quote";

export const inputEmitter: NodeEmitter<
    InputNodeData
> = {
    emit(node) {
        const data =
            node.data;

        return emitFunction(
            "input_text",
            [
                locatorStrategy(
                    data.locatorStrategy,
                ),

                quote(
                    data.locator,
                ),

                emitExpression(
                    data.text,
                ),
            ],
        );
    },
};