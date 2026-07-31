import type {
    FlowNode,
    LaunchAppNodeData,
} from "../types/flowNode";

function isLaunchAppNode(
    node: FlowNode,
): node is FlowNode & {
    data: LaunchAppNodeData;
} {
    return node.data.action === "launchApp";
}

export function getFlowPlatform(
    nodes: FlowNode[],
): "Android" | "iOS" | null {
    const launchNode =
        nodes.find(isLaunchAppNode);

    return launchNode?.data.platform ?? null;
}