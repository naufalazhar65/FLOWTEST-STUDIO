import type { DeviceGetterNodeData } from "../../flow/types/flowNode";

import type { NodeEmitter } from "../types/NodeEmitter";

import { emitFunction } from "../utils/emitFunction";
import { quote } from "../utils/quote";

export function createDeviceGetterEmitter<
    T extends DeviceGetterNodeData,
>(
    functionName: string,
): NodeEmitter<T> {
    return {
        emit(node) {
            const data = node.data;

            return `variables[${quote(
                data.variableName,
            )}] = ${emitFunction(
                functionName,
                [],
            )}`;
        },
    };
}