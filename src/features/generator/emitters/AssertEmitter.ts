import type {
    AssertNodeData,
} from "../../flow/types/flowNode";

import type {
    NodeEmitter,
} from "../types/NodeEmitter";

import { quote } from "../utils/quote";

const operatorMap: Record<
    AssertNodeData["operator"],
    (
        actual: string,
        expected: string,
    ) => string
> = {
    equals: (a, e) =>
        `assert ${a} == ${e}`,

    notEquals: (a, e) =>
        `assert ${a} != ${e}`,

    contains: (a, e) =>
        `assert ${e} in ${a}`,

    notContains: (a, e) =>
        `assert ${e} not in ${a}`,

    startsWith: (a, e) =>
        `assert ${a}.startswith(${e})`,

    endsWith: (a, e) =>
        `assert ${a}.endswith(${e})`,

    greaterThan: (a, e) =>
        `assert ${a} > ${e}`,

    greaterThanOrEqual: (a, e) =>
        `assert ${a} >= ${e}`,

    lessThan: (a, e) =>
        `assert ${a} < ${e}`,

    lessThanOrEqual: (a, e) =>
        `assert ${a} <= ${e}`,

    isTrue: (a) =>
        `assert ${a}`,

    isFalse: (a) =>
        `assert not ${a}`,

    isEmpty: (a) =>
        `assert len(${a}) == 0`,

    isNotEmpty: (a) =>
        `assert len(${a}) > 0`,

    matches: (a, e) =>
        `assert re.match(${e}, ${a})`,
};

export const assertEmitter: NodeEmitter<
    AssertNodeData
> = {
    emit(node) {
        const data = node.data;

        return operatorMap[
            data.operator
        ](
            quote(data.actual),
            quote(data.expected),
        );
    },
};