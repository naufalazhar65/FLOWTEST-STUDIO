import type {
    LocatorNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";
import type { NodeEmitter } from "../types/NodeEmitter";

import { emitFunction } from "../utils/emitFunction";
import { locatorStrategy } from "../utils/locator";
import { quote } from "../utils/quote";

export function createLocatorEmitter<
    T extends LocatorNodeData,
>(
    functionName: string,
    extraArguments?: (
        data: T,
        context: GeneratorContext,
    ) => string[],
): NodeEmitter<T> {
    return {
        emit(node, context) {
            const data = node.data;

            return emitFunction(
                functionName,
                [
                    locatorStrategy(
                        data.locatorStrategy,
                    ),

                    quote(
                        data.locator,
                    ),

                    ...(extraArguments
                        ? extraArguments(
                            data,
                            context,
                        )
                        : []),
                ],
            );
        },
    };
}