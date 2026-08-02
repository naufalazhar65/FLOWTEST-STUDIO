import type { GetAttributeNodeData } from "../../flow/types/flowNode";

import type { NodeEmitter } from "../types/NodeEmitter";

import { emitFunction } from "../utils/emitFunction";
import { locatorStrategy } from "../utils/locator";
import { quote } from "../utils/quote";

export const getAttributeEmitter: NodeEmitter<GetAttributeNodeData> = {
    emit(node) {
        const data = node.data;

        return `variables[${quote(
            data.variableName,
        )}] = ${emitFunction(
            "get_attribute",
            [
                locatorStrategy(
                    data.locatorStrategy,
                ),

                quote(
                    data.locator,
                ),

                quote(
                    data.attribute,
                ),
            ],
        )}`;
    },
};