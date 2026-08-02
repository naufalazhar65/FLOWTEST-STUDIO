import type {
    FlowNode,
    InputNodeData,
} from "../../flow/types/flowNode";

import type { NodeEmitter } from "../types/NodeEmitter";

import { emitFunction } from "../utils/emitFunction";
import { locatorStrategy } from "../utils/locator";
import { quote } from "../utils/quote";

export const inputEmitter: NodeEmitter = {
    emit(node: FlowNode, context) {
        void context;

        const data =
            node.data as InputNodeData;

        return emitFunction(
            "input",
            [
                locatorStrategy(
                    data.locatorStrategy,
                ),

                quote(
                    data.locator,
                ),

                quote(
                    data.text,
                ),
            ],
        );
    },
};