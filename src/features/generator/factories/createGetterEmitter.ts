import type { ElementGetterNodeData } from "../../flow/types/flowNode";

import type { NodeEmitter } from "../types/NodeEmitter";

import { emitFunction } from "../utils/emitFunction";
import { locatorStrategy } from "../utils/locator";
import { quote } from "../utils/quote";

export function createGetterEmitter<
    T extends ElementGetterNodeData,
>(
    functionName: string,
): NodeEmitter<T> {
    return {
        emit(node, context) {
            void context;

            const data = node.data;

            return `variables[${quote(
                data.variableName,
            )}] = ${emitFunction(
                functionName,
                [
                    locatorStrategy(
                        data.locatorStrategy,
                    ),

                    quote(
                        data.locator,
                    ),
                ],
            )}`;
        },
    };
}