import { create } from "zustand";
import type { Edge } from "reactflow";

import {
  initialNodes,
  initialEdges,
} from "../data/initialFlow";

import type { NodeType } from "../config/nodeRegistry";

import type {
  FlowNode,
  FlowNodeData,
} from "../types/flowNode";

import type { FlowSnapshot } from "../history/history";

import { addNodeAction } from "../actions/addNode";
import { updateNodeAction } from "../actions/updateNode";
import { updateNodeDataAction } from "../actions/updateNodeData";
import { deleteNodeAction } from "../actions/deleteNode";
import { insertNodeAction } from "../actions/insertNode";
import { duplicateNodeAction } from "../actions/duplicateNode";
import { pushHistory } from "./historyHelpers";

interface FlowStore {
  nodes: FlowNode[];
  edges: Edge[];

  history: FlowSnapshot[];
  future: FlowSnapshot[];

  selectedNodeId: string | null;

  saveHistory: () => void;

  undo: () => void;
  redo: () => void;

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

  addNode: (type: NodeType) => void;

  updateNode: (
    id: string,
    data: Partial<FlowNode>
  ) => void;

  updateNodeData: (
    id: string,
    data: Partial<FlowNodeData>
  ) => void;

  removeNode: (id: string) => void;

  insertNode: (
    edgeId: string,
    type: NodeType
  ) => void;

  duplicateNode: (
    id: string
  ) => void;

  setSelectedNode: (
    id: string | null
  ) => void;
}

export const useFlowStore =
  create<FlowStore>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,

    history: [],
    future: [],

    selectedNodeId: null,

    saveHistory: () => {
      const { nodes, edges, history } = get();

      set({
        history: [
          ...history,
          {
            nodes: structuredClone(nodes),
            edges: structuredClone(edges),
          },
        ],
        future: [],
      });
    },

    undo: () => {
      const {
        history,
        future,
        nodes,
        edges,
      } = get();

      if (history.length === 0) return;

      const previous =
        history[history.length - 1];

      set({
        nodes: previous.nodes,
        edges: previous.edges,

        history: history.slice(0, -1),

        future: [
          {
            nodes,
            edges,
          },
          ...future,
        ],
      });
    },

    redo: () => {
      const {
        history,
        future,
        nodes,
        edges,
      } = get();

      if (future.length === 0) return;

      const next = future[0];

      set({
        nodes: next.nodes,
        edges: next.edges,

        history: [
          ...history,
          {
            nodes,
            edges,
          },
        ],

        future: future.slice(1),
      });
    },

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

    addNode: (type) =>
      set((state) => {
        const result = addNodeAction(
          state.nodes,
          state.edges,
          type
        );

        return {
          ...result,

          history: pushHistory(
            state.history,
            state.nodes,
            state.edges
          ),

          future: [],
        };
      }),

    updateNode: (id, data) =>
      set((state) => ({
        nodes: updateNodeAction(
          state.nodes,
          id,
          data
        ),

        history: pushHistory(
          state.history,
          state.nodes,
          state.edges
        ),

        future: [],
      })),

    updateNodeData: (id, data) =>
      set((state) => ({
        nodes: updateNodeDataAction(
          state.nodes,
          id,
          data
        ),

        history: pushHistory(
          state.history,
          state.nodes,
          state.edges
        ),

        future: [],
      })),

    removeNode: (id) =>
      set((state) => {
        const result = deleteNodeAction(
          state.nodes,
          state.edges,
          id
        );

        return {
          ...result,

          history: pushHistory(
            state.history,
            state.nodes,
            state.edges
          ),

          future: [],
        };
      }),

    insertNode: (edgeId, type) =>
      set((state) => {
        const result = insertNodeAction(
          state.nodes,
          state.edges,
          edgeId,
          type
        );

        return {
          ...result,

          history: pushHistory(
            state.history,
            state.nodes,
            state.edges
          ),

          future: [],
        };
      }),

    duplicateNode: (id) =>
      set((state) => {
        const result = duplicateNodeAction(
          state.nodes,
          state.edges,
          id
        );

        return {
          ...result,

          history: pushHistory(
            state.history,
            state.nodes,
            state.edges
          ),

          future: [],
        };
      }),

    setSelectedNode: (id) =>
      set({
        selectedNodeId: id,
      }),
  }));