import type { Edge } from "reactflow";

import type { FlowNode } from "../types/flowNode";
import type { NodeType } from "../types/NodePlugin";

import { createNode } from "../factories/nodeFactory";
import { createEdge } from "../factories/edgeFactory";

interface InsertNodeResult {
  nodes: FlowNode[];
  edges: Edge[];
}

export function insertNodeAction(
  nodes: FlowNode[],
  edges: Edge[],
  edgeId: string,
  type: NodeType,
): InsertNodeResult {
  const edge = edges.find(
    (item) => item.id === edgeId,
  );

  if (!edge) {
    return {
      nodes,
      edges,
    };
  }

  const sourceNode =
    nodes.find(
      (node) =>
        node.id === edge.source,
    );

  const targetNode =
    nodes.find(
      (node) =>
        node.id === edge.target,
    );

  const position = {
    x:
      sourceNode &&
        targetNode
        ? (
          sourceNode.position.x +
          targetNode.position.x
        ) / 2
        : sourceNode
          ? sourceNode.position.x
          : targetNode
            ? targetNode.position.x
            : 250,

    y:
      sourceNode &&
        targetNode
        ? (
          sourceNode.position.y +
          targetNode.position.y
        ) / 2
        : sourceNode
          ? sourceNode.position.y +
          180
          : targetNode
            ? targetNode.position.y -
            180
            : 80,
  };

  const node = createNode(
    type,
    undefined,
    position,
  );

  const remainingEdges =
    edges.filter(
      (item) => item.id !== edgeId,
    );

  return {
    nodes: [
      ...nodes,
      node,
    ],

    edges: [
      ...remainingEdges,

      createEdge(
        edge.source,
        node.id,
        edge.sourceHandle ?? undefined,
      ),

      createEdge(
        node.id,
        edge.target,
        undefined,
        edge.targetHandle ?? undefined,
      ),
    ],
  };
}