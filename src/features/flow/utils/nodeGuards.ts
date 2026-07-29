import type {
    AssertNodeData,
    FlowNode,
    GetTextNodeData,
    TapNodeData,

} from "../types/flowNode";

export function isGetTextNode(
    node: FlowNode,
): node is FlowNode & {
    data: GetTextNodeData;
} {
    return node.data.action === "getText";
}

export function isAssertNode(
    node: FlowNode,
): node is FlowNode & {
    data: AssertNodeData;
} {
    return node.data.action === "assert";
}

export function isTapNode(
    node: FlowNode,
): node is FlowNode & {
    data: TapNodeData;
} {
    return node.data.action === "tap";
}