import type {
    AIFlowContext,
} from "../types/AIRequest";

interface FlowAnalysisResult {
    summary: string;

    details: string[];
}

function formatNodeLabel(
    action: string,
): string {
    return action
        .replace(
            /([a-z])([A-Z])/g,
            "$1 $2",
        )
        .replace(/^./, (value) =>
            value.toUpperCase(),
        );
}

function describeNode(
    node: AIFlowContext["nodes"][number],
): string {
    const label =
        node.title ||
        formatNodeLabel(
            node.action,
        );

    const parts: string[] = [
        label,
    ];

    if (node.locator) {
        parts.push(
            `locator: ${node.locator}`,
        );
    }

    if (
        node.locatorStrategy
    ) {
        parts.push(
            `strategy: ${node.locatorStrategy}`,
        );
    }

    return parts.join(" — ");
}

export function analyzeFlowContext(
    context: AIFlowContext,
): FlowAnalysisResult {
    if (
        context.nodes.length === 0
    ) {
        return {
            summary:
                "The current flow is empty.",

            details: [],
        };
    }

    const details =
        context.nodes.map(
            (node, index) =>
                `${index + 1}. ${describeNode(node)}`,
        );

    const selectedNode =
        context.selectedNode;

    const selectedText =
        selectedNode
            ? ` The currently selected node is "${selectedNode.title}".`
            : "";

    return {
        summary:
            `The current flow contains ${context.nodeCount} node${context.nodeCount === 1
                ? ""
                : "s"
            } and ${context.edgeCount} edge${context.edgeCount === 1
                ? ""
                : "s"
            }.${selectedText}`,

        details,
    };
}

export function analyzeSelectedNode(
    context: AIFlowContext,
): string {
    const node =
        context.selectedNode;

    if (!node) {
        return "There is no node currently selected.";
    }

    const lines = [
        `Selected node: ${node.title}`,
        `Action: ${node.action}`,
        `Subtitle: ${node.subtitle}`,
    ];

    if (
        node.locatorStrategy
    ) {
        lines.push(
            `Locator strategy: ${node.locatorStrategy}`,
        );
    }

    if (node.locator) {
        lines.push(
            `Locator: ${node.locator}`,
        );
    }

    if (node.details) {
        for (
            const [key, value] of Object.entries(
                node.details,
            )
        ) {
            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                continue;
            }

            lines.push(
                `${key}: ${String(value)}`,
            );
        }
    }

    return lines.join("\n");
}