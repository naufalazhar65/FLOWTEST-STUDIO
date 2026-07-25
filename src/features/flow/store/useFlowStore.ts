import { create } from "zustand";
import type { Edge } from "reactflow";

import {
  initialNodes,
  initialEdges,
} from "../data/initialFlow";

import { createNode } from "../factories/nodeFactory";
import { createEdge } from "../factories/edgeFactory";

import type {
  FlowNode,
  FlowNodeData,
} from "../types/flowNode";

interface FlowStore {
  // =========================
  // State
  // =========================

  nodes: FlowNode[];
  edges: Edge[];

  selectedNodeId: string | null;

  // =========================
  // State Actions
  // =========================

  setNodes: (
    updater:
      | FlowNode[]
      | ((nodes: FlowNode[]) => FlowNode[])
  ) => void;

  setEdges: (
    updater:
      | Edge[]
      | ((edges: Edge[]) => Edge[])
  ) => void;

  // =========================
  // Node Actions
  // =========================

  addNode: (node: FlowNode) => void;

  addTapNode: () => void;
  addInputNode: () => void;
  addAssertNode: () => void;

  updateNode: (
    id: string,
    data: Partial<FlowNode>
  ) => void;

  updateNodeData: (
    id: string,
    data: Partial<FlowNodeData>
  ) => void;

  removeNode: (id: string) => void;

  // =========================
  // Selection
  // =========================

  setSelectedNode: (
    id: string | null
  ) => void;
}

export const useFlowStore =
  create<FlowStore>((set) => ({
    // =========================
    // Initial State
    // =========================

    nodes: initialNodes,
    edges: initialEdges,

    selectedNodeId: null,

    // =========================
    // State Actions
    // =========================

    setNodes: (updater) =>
      set((state) => ({
        nodes:
          typeof updater === "function"
            ? updater(state.nodes)
            : updater,
      })),

    setEdges: (updater) =>
      set((state) => ({
        edges:
          typeof updater === "function"
            ? updater(state.edges)
            : updater,
      })),

    // =========================
    // Node Actions
    // =========================

    addNode: (node) =>
      set((state) => ({
        nodes: [...state.nodes, node],
      })),

    addTapNode: () =>
      set((state) => {
        const node = createNode("tap");

        const lastNode =
          state.nodes[state.nodes.length - 1];

        return {
          nodes: [...state.nodes, node],

          edges: lastNode
            ? [
              ...state.edges,
              createEdge(lastNode.id, node.id),
            ]
            : state.edges,
        };
      }),

    addInputNode: () =>
      set((state) => {
        const node = createNode("input");

        const lastNode =
          state.nodes[state.nodes.length - 1];

        return {
          nodes: [...state.nodes, node],

          edges: lastNode
            ? [
              ...state.edges,
              createEdge(lastNode.id, node.id),
            ]
            : state.edges,
        };
      }),

    addAssertNode: () =>
      set((state) => {
        const node = createNode("assert");

        const lastNode =
          state.nodes[state.nodes.length - 1];

        return {
          nodes: [...state.nodes, node],

          edges: lastNode
            ? [
              ...state.edges,
              createEdge(lastNode.id, node.id),
            ]
            : state.edges,
        };
      }),

    updateNode: (id, data) =>
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === id
            ? {
              ...node,
              ...data,
            }
            : node
        ),
      })),

    // =========================
    // Update Node Data
    // =========================

    updateNodeData: (id, data) =>
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === id
            ? {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            }
            : node
        ),
      })),

    removeNode: (id) =>
      set((state) => {
        const incomingEdge = state.edges.find(
          (edge) => edge.target === id
        );

        const outgoingEdge = state.edges.find(
          (edge) => edge.source === id
        );

        const nodes = state.nodes.filter(
          (node) => node.id !== id
        );

        const edges = state.edges.filter(
          (edge) =>
            edge.source !== id &&
            edge.target !== id
        );

        if (incomingEdge && outgoingEdge) {
          edges.push(
            createEdge(
              incomingEdge.source,
              outgoingEdge.target
            )
          );
        }

        return {
          nodes,
          edges,
        };
      }),

    // =========================
    // Selection
    // =========================

    setSelectedNode: (id) =>
      set({
        selectedNodeId: id,
      }),
  }));