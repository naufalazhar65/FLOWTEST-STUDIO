import type { Edge } from "reactflow";

import type { FlowNode } from "../types/flowNode";

export function buildExecutionOrder(
  nodes: FlowNode[],
  edges: Edge[]
): FlowNode[] {
  if (nodes.length <= 1) {
    return nodes;
  }

  const nodeMap = new Map(
    nodes.map((node) => [
      node.id,
      node,
    ])
  );

  const incoming = new Map<
    string,
    number
  >();

  const outgoing = new Map<
    string,
    string[]
  >();

  for (const node of nodes) {
    incoming.set(node.id, 0);

    outgoing.set(node.id, []);
  }

  for (const edge of edges) {
    incoming.set(
      edge.target,
      (incoming.get(edge.target) ?? 0) + 1
    );

    outgoing
      .get(edge.source)
      ?.push(edge.target);
  }

  const queue = nodes.filter(
    (node) =>
      incoming.get(node.id) === 0
  );

  const ordered: FlowNode[] = [];

  while (queue.length) {
    const current = queue.shift()!;

    ordered.push(current);

    for (const target of outgoing.get(
      current.id
    ) ?? []) {
      incoming.set(
        target,
        incoming.get(target)! - 1
      );

      if (
        incoming.get(target) === 0
      ) {
        queue.push(
          nodeMap.get(target)!
        );
      }
    }
  }

  return ordered;
}