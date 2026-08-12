import type { FlowNode } from "../../features/flow/types/flowNode";

export function createIfNode(
    condition: string,
): FlowNode {
    return {
        id: "if-node",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "if",

            title: "If",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            actual: condition,

            expected: "",

            operator: "equals",
        },
    } as FlowNode;
}