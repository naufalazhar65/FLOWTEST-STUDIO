import type { Edge } from "reactflow";

import type { FlowNode } from "../../flow/types/flowNode";
import { GraphNavigator } from "../../execution/graph/GraphNavigator";

import {
    pythonTestTemplate,
} from "../templates/pythonTestTemplate";

import {
    generateNode,
} from "./generateNode";

import type {
    GeneratorContext,
} from "../types/GeneratorContext";

export interface GeneratePythonOptions {
    capabilities?:
    Record<string, unknown>;

    serverUrl?: string;

    edges?: Edge[];
}

const DEFAULT_CAPABILITIES:
    Record<string, unknown> = {
    platformName: "Android",

    "appium:automationName":
        "UiAutomator2",

    "appium:deviceName":
        "Android Emulator",

    "appium:noReset": false,
};

const DEFAULT_SERVER_URL =
    "http://127.0.0.1:4723";

/**
 * Indent every non-empty line of generated code.
 */
function indentCode(
    code: string,
    level: number,
    indent: string,
): string {
    const prefix =
        indent.repeat(level);

    return code
        .split("\n")
        .map((line) => {
            if (!line.trim()) {
                return line;
            }

            return `${prefix}${line}`;
        })
        .join("\n");
}

/**
 * Get outgoing branch targets.
 *
 * Normal node:
 *   next
 *
 * IF node:
 *   true
 *   false
 */
function getBranchTargets(
    node: FlowNode,
    graph: GraphNavigator,
): FlowNode[] {
    if (
        node.data.action === "if"
    ) {
        const targets: FlowNode[] =
            [];

        const trueTransition =
            graph.getTransition(
                node.id,
                "true",
            );

        const falseTransition =
            graph.getTransition(
                node.id,
                "false",
            );

        if (trueTransition) {
            targets.push(
                trueTransition.nextNode,
            );
        }

        if (falseTransition) {
            targets.push(
                falseTransition.nextNode,
            );
        }

        return targets;
    }

    if (
        node.data.action === "repeat"
    ) {
        const targets: FlowNode[] =
            [];

        const bodyTransition =
            graph.getTransition(
                node.id,
                "body",
            );

        const nextTransition =
            graph.getTransition(
                node.id,
                "next",
            );

        if (bodyTransition) {
            targets.push(
                bodyTransition.nextNode,
            );
        }

        if (nextTransition) {
            targets.push(
                nextTransition.nextNode,
            );
        }

        return targets;
    }

    const next =
        graph.getNextNode(
            node.id,
            "next",
        );

    return next
        ? [next]
        : [];
}

/**
 * Find the first node reachable from
 * both IF branches.
 *
 * Example:
 *
 *          IF
 *         /  \
 *        A    B
 *         \  /
 *          C
 *
 * C is the join node.
 */
function findJoinNode(
    trueStart: FlowNode | null,
    falseStart: FlowNode | null,
    graph: GraphNavigator,
    nodes: FlowNode[],
): FlowNode | null {
    if (
        !trueStart ||
        !falseStart
    ) {
        return null;
    }

    function collectReachable(
        start: FlowNode,
    ): Map<string, number> {
        const distances =
            new Map<
                string,
                number
            >();

        const queue: Array<{
            node: FlowNode;
            distance: number;
        }> = [
                {
                    node: start,
                    distance: 0,
                },
            ];

        while (
            queue.length > 0
        ) {
            const current =
                queue.shift();

            if (!current) {
                continue;
            }

            if (
                distances.has(
                    current.node.id,
                )
            ) {
                continue;
            }

            distances.set(
                current.node.id,
                current.distance,
            );

            for (
                const next
                of getBranchTargets(
                    current.node,
                    graph,
                )
            ) {
                if (
                    !distances.has(
                        next.id,
                    )
                ) {
                    queue.push({
                        node: next,
                        distance:
                            current.distance +
                            1,
                    });
                }
            }
        }

        return distances;
    }

    const trueDistances =
        collectReachable(
            trueStart,
        );

    const falseDistances =
        collectReachable(
            falseStart,
        );

    const candidates =
        nodes
            .filter(
                (node) =>
                    trueDistances.has(
                        node.id,
                    ) &&
                    falseDistances.has(
                        node.id,
                    ),
            )
            .map((node) => ({
                node,
                distance:
                    Math.max(
                        trueDistances.get(
                            node.id,
                        ) ?? Infinity,
                        falseDistances.get(
                            node.id,
                        ) ?? Infinity,
                    ),
            }))
            .sort(
                (a, b) =>
                    a.distance -
                    b.distance,
            );

    return (
        candidates[0]?.node ??
        null
    );
}

/**
 * Generate a graph-aware Python block.
 *
 * Handles:
 * - normal nodes
 * - IF true branch
 * - IF false branch
 * - nested IF
 * - branch joins
 */
function generateBlock(
    startNode: FlowNode | null,
    stopNodeId: string | null,
    graph: GraphNavigator,
    nodes: FlowNode[],
    context: GeneratorContext,
    indentLevel: number,
    path: Set<string>,
): string[] {
    const lines: string[] = [];

    let current =
        startNode;

    while (current) {
        if (
            stopNodeId &&
            current.id === stopNodeId
        ) {
            break;
        }

        if (
            path.has(current.id)
        ) {
            break;
        }

        const nextPath =
            new Set(path);

        nextPath.add(
            current.id,
        );

        /*
         * IF node
         */
        if (
            current.data.action ===
            "if"
        ) {
            const header =
                generateNode(
                    current,
                    context,
                );

            lines.push(
                indentCode(
                    header,
                    indentLevel,
                    context.indent,
                ),
            );

            const trueTransition =
                graph.getTransition(
                    current.id,
                    "true",
                );

            const falseTransition =
                graph.getTransition(
                    current.id,
                    "false",
                );

            const trueNode =
                trueTransition?.nextNode ??
                null;

            const falseNode =
                falseTransition?.nextNode ??
                null;

            const join =
                findJoinNode(
                    trueNode,
                    falseNode,
                    graph,
                    nodes,
                );

            const trueLines =
                generateBlock(
                    trueNode,
                    join?.id ?? null,
                    graph,
                    nodes,
                    context,
                    indentLevel + 1,
                    nextPath,
                );

            if (
                trueLines.length === 0
            ) {
                lines.push(
                    indentCode(
                        "pass",
                        indentLevel + 1,
                        context.indent,
                    ),
                );
            } else {
                lines.push(
                    ...trueLines,
                );
            }

            if (falseNode) {
                lines.push(
                    indentCode(
                        "else:",
                        indentLevel,
                        context.indent,
                    ),
                );

                const falseLines =
                    generateBlock(
                        falseNode,
                        join?.id ?? null,
                        graph,
                        nodes,
                        context,
                        indentLevel + 1,
                        nextPath,
                    );

                if (
                    falseLines.length === 0
                ) {
                    lines.push(
                        indentCode(
                            "pass",
                            indentLevel + 1,
                            context.indent,
                        ),
                    );
                } else {
                    lines.push(
                        ...falseLines,
                    );
                }
            }

            current =
                join;

            continue;
        }

        /*
         * REPEAT node
         *
         * Repeat has two outputs:
         *
         *   body -> first node in the loop
         *   next -> node after the loop
         */
        if (
            current.data.action ===
            "repeat"
        ) {
            const bodyTransition =
                graph.getTransition(
                    current.id,
                    "body",
                );

            const nextTransition =
                graph.getTransition(
                    current.id,
                    "next",
                );

            if (
                !bodyTransition
            ) {
                throw new Error(
                    `Repeat node "${current.data.title}" has no body transition.`,
                );
            }

            if (
                !nextTransition
            ) {
                throw new Error(
                    `Repeat node "${current.data.title}" has no next transition.`,
                );
            }

            const parsedCount =
                Number(
                    current.data.count,
                );

            const count =
                Number.isFinite(
                    parsedCount,
                )
                    ? Math.max(
                        1,
                        Math.floor(
                            parsedCount,
                        ),
                    )
                    : 1;

            const exitNode =
                nextTransition.nextNode;

            const bodyLines =
                generateBlock(
                    bodyTransition.nextNode,
                    exitNode.id,
                    graph,
                    nodes,
                    context,
                    indentLevel + 1,
                    nextPath,
                );

            lines.push(
                indentCode(
                    `for _ in range(${count}):`,
                    indentLevel,
                    context.indent,
                ),
            );

            if (
                bodyLines.length === 0
            ) {
                lines.push(
                    indentCode(
                        "pass",
                        indentLevel + 1,
                        context.indent,
                    ),
                );
            } else {
                lines.push(
                    ...bodyLines,
                );
            }

            current =
                exitNode;

            continue;
        }

        /*
         * Normal node
         */
        const generated =
            generateNode(
                current,
                context,
            );

        lines.push(
            indentCode(
                generated,
                indentLevel,
                context.indent,
            ),
        );

        current =
            graph.getNextNode(
                current.id,
                "next",
            );
    }

    return lines;
}

export function generatePython(
    nodes: FlowNode[],
    options: GeneratePythonOptions = {},
): string {
    const context:
        GeneratorContext = {
        framework:
            "selenium-python-mobile",

        indent: "    ",

        newline: "\n",

        capabilities:
            options.capabilities ??
            DEFAULT_CAPABILITIES,

        serverUrl:
            options.serverUrl ??
            DEFAULT_SERVER_URL,
    };

    let lines: string[];

    /*
     * Graph mode
     *
     * Used when the caller provides
     * actual React Flow edges.
     *
     * This is required for IF branching.
     */
    if (
        options.edges &&
        options.edges.length > 0
    ) {
        const graph =
            new GraphNavigator(
                nodes,
                options.edges,
            );

        const startNode =
            graph.getStartNode();

        lines =
            generateBlock(
                startNode,
                null,
                graph,
                nodes,
                context,
                1,
                new Set<string>(),
            );
    } else {
        /*
         * Linear mode
         *
         * Keep backward compatibility
         * with existing generator tests
         * and callers that only provide
         * an ordered node array.
         */
        lines =
            nodes.map(
                (node) => {
                    const generated =
                        generateNode(
                            node,
                            context,
                        );

                    return indentCode(
                        generated,
                        1,
                        context.indent,
                    );
                },
            );
    }

    const body =
        lines.join(
            context.newline +
            context.newline,
        );

    return pythonTestTemplate(
        body,
        {
            capabilities:
                context.capabilities ??
                DEFAULT_CAPABILITIES,

            serverUrl:
                context.serverUrl ??
                DEFAULT_SERVER_URL,
        },
    );
}