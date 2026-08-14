import type { ElementGetterNodeData } from "../../flow/types/flowNode";

import type { NodeEmitter } from "../types/NodeEmitter";

import { emitFunction } from "../utils/emitFunction";
import { indent } from "../utils/indent";
import { locatorStrategy } from "../utils/locator";
import { quote } from "../utils/quote";

export function createGetterEmitter<
    T extends ElementGetterNodeData,
>(
    functionName: string,
): NodeEmitter<T> {
    return {
        emit(node) {
            const data = node.data;

            const value = indent(
                emitFunction(
                    functionName,
                    [
                        locatorStrategy(
                            data.locatorStrategy,
                        ),

                        quote(
                            data.locator,
                        ),
                    ],
                ),
            );

            return `set_variable(
    ${quote(data.variableName)},
${value},
)`;
        },
    };
}