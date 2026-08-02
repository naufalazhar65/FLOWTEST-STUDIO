import type {
    AssertNodeData,
    DragNodeData,
    DoubleTapNodeData,
    FlowNode,
    GetTextNodeData,
    LongPressNodeData,
    PinchNodeData,
    TapNodeData,
    ZoomNodeData,
    FlingNodeData
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

export function isLongPressNode(
    node: FlowNode,
): node is FlowNode & {
    data: LongPressNodeData;
} {
    return node.data.action === "longPress";
}

export function isDoubleTapNode(
    node: FlowNode,
): node is FlowNode & {
    data: DoubleTapNodeData;
} {
    return node.data.action === "doubleTap";
}

export function isDragNode(
    node: FlowNode,
): node is FlowNode & {
    data: DragNodeData;
} {
    return node.data.action === "drag";
}

export function isPinchNode(
    node: FlowNode,
): node is FlowNode & {
    data: PinchNodeData;
} {
    return node.data.action === "pinch";
}

export function isZoomNode(
    node: FlowNode,
): node is FlowNode & {
    data: ZoomNodeData;
} {
    return node.data.action === "zoom";
}

export function isFlingNode(
    node: FlowNode,
): node is FlowNode & {
    data: FlingNodeData;
} {
    return node.data.action === "fling";
}