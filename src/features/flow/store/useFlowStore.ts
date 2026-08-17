import { create } from "zustand";

import type {
  Connection,
  Edge,
} from "reactflow";

import type { FlowProject } from "../types/FlowProject";

import {
  connectNodesAction,
} from "../actions/connectNodes";

import {
  markProjectModified,
} from "../../project/services/projectState";

import {
  createProject,
} from "../services/projectService";

import {
  initialNodes,
  initialEdges,
} from "../data/initialFlow";

import type { NodeType } from "../types/NodePlugin";

import type {
  FlowNode,
  FlowNodeDataPatch,
} from "../types/flowNode";

import type { FlowSnapshot } from "../types/FlowSnapshot";

import {
  addNodeAction,
} from "../actions/addNode";

import {
  addNodeWithLocatorAction,
} from "../actions/addNodeWithLocator";

import type { LocatorStrategy } from "../../execution/types/LocatorStrategy";

import {
  updateNodeAction,
} from "../actions/updateNode";

import {
  updateNodeDataAction,
} from "../actions/updateNodeData";

import {
  deleteNodeAction,
} from "../actions/deleteNode";

import {
  insertNodeAction,
} from "../actions/insertNode";

import {
  duplicateNodeAction,
} from "../actions/duplicateNode";

import {
  pushHistory,
} from "./historyHelpers";

import {
  insertNodeWithDataAction,
} from "../actions/insertNodeWithData";

interface FlowStore {
  nodes: FlowNode[];

  edges: Edge[];

  history: FlowSnapshot[];

  future: FlowSnapshot[];

  selectedNodeId: string | null;

  clipboard: FlowNode | null;

  resetFlow(): void;

  undo(): void;

  redo(): void;

  runInHistoryBatch(
    callback: () => void,
  ): void;

  copyNode(): void;

  pasteNode(): void;

  setNodes(
    updater:
      | FlowNode[]
      | ((nodes: FlowNode[]) => FlowNode[])
  ): void;

  setEdges(
    updater:
      | Edge[]
      | ((edges: Edge[]) => Edge[])
  ): void;

  connectNodes(
    connection: Connection,
  ): void;

  addNode(
    type: NodeType,
  ): void;

  insertNodeWithData(
    edgeId: string | null,
    type: NodeType,
    data: FlowNodeDataPatch,
    afterNodeId?: string,
    beforeNodeId?: string,
  ): void;

  addNodeWithLocator(
    type: NodeType,
    locatorStrategy: LocatorStrategy,
    locator: string,
    text?: string,
  ): void;

  updateNode(
    id: string,
    data: Partial<FlowNode>,
  ): void;

  updateNodeData(
    id: string,
    data: FlowNodeDataPatch,
  ): void;

  removeNode(
    id: string,
  ): void;

  insertNode(
    edgeId: string,
    type: NodeType,
  ): void;

  duplicateNode(
    id: string,
  ): void;

  setSelectedNode(
    id: string | null,
  ): void;

  saveProject(
    name?: string,
    options?: {
      id?: string;
      createdAt?: string;
    },
  ): FlowProject;

  loadProject(
    project: FlowProject,
  ): void;
}

export const useFlowStore =
  create<FlowStore>((set, get) => ({
    nodes: initialNodes,

    edges: initialEdges,

    history: [],

    future: [],

    selectedNodeId: null,

    clipboard: null,

    copyNode: () => {
      const {
        nodes,
        selectedNodeId,
      } = get();

      const node = nodes.find(
        (node) =>
          node.id === selectedNodeId,
      );

      if (!node) {
        return;
      }

      set({
        clipboard:
          structuredClone(node),
      });
    },

    pasteNode: () => {
      const {
        clipboard,
        nodes,
        edges,
        history,
      } = get();

      if (!clipboard) {
        return;
      }

      const newNode: FlowNode = {
        ...structuredClone(clipboard),

        id: crypto.randomUUID(),

        position: {
          x:
            clipboard.position.x +
            40,

          y:
            clipboard.position.y +
            40,
        },
      };

      set({
        nodes: [
          ...nodes,
          newNode,
        ],

        selectedNodeId:
          newNode.id,

        history: pushHistory(
          history,
          nodes,
          edges,
        ),

        future: [],
      });

      markProjectModified();
    },

    runInHistoryBatch: (
      callback,
    ) => {
      const before =
        get();

      const beforeNodes =
        before.nodes;

      const beforeEdges =
        before.edges;

      const beforeHistory =
        before.history;

      const beforeFuture =
        before.future;

      const beforeSelectedNodeId =
        before.selectedNodeId;

      try {
        callback();
      } catch (error) {
        /*
         * ----------------------------------------------
         * Transaction rollback
         * ----------------------------------------------
         *
         * If any operation in the batch fails,
         * restore the exact state that existed
         * before the batch started.
         */
        set({
          nodes:
            beforeNodes,

          edges:
            beforeEdges,

          history:
            beforeHistory,

          future:
            beforeFuture,

          selectedNodeId:
            beforeSelectedNodeId,
        });

        throw error;
      }

      const after =
        get();

      const hasChanges =
        after.nodes !==
        beforeNodes ||
        after.edges !==
        beforeEdges;

      if (!hasChanges) {
        return;
      }

      /*
       * ----------------------------------------------
       * Atomic history entry
       * ----------------------------------------------
       *
       * Individual actions may have pushed
       * intermediate history entries.
       *
       * Discard those intermediate entries and
       * keep exactly one snapshot representing
       * the state immediately before the batch.
       */
      set({
        history: [
          ...beforeHistory,
          {
            nodes:
              beforeNodes,

            edges:
              beforeEdges,
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

      if (history.length === 0) {
        return;
      }

      const previous =
        history[
        history.length - 1
        ];

      set({
        nodes: previous.nodes,

        edges: previous.edges,

        history:
          history.slice(0, -1),

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

      if (future.length === 0) {
        return;
      }

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

        future:
          future.slice(1),
      });
    },

    setNodes: (updater) => {
      set((state) => ({
        nodes:
          typeof updater ===
            "function"
            ? updater(state.nodes)
            : updater,
      }));

      markProjectModified();
    },

    setEdges: (updater) => {
      set((state) => ({
        edges:
          typeof updater ===
            "function"
            ? updater(state.edges)
            : updater,
      }));

      markProjectModified();
    },

    connectNodes: (
      connection,
    ) => {
      set((state) => ({
        edges:
          connectNodesAction(
            state.edges,
            connection,
          ),

        history: pushHistory(
          state.history,
          state.nodes,
          state.edges,
        ),

        future: [],
      }));

      markProjectModified();
    },

    addNode: (type) => {
      set((state) => {
        const result =
          addNodeAction(
            state.nodes,
            state.edges,
            type,
          );

        return {
          ...result,

          history: pushHistory(
            state.history,
            state.nodes,
            state.edges,
          ),

          future: [],
        };
      });

      markProjectModified();
    },

    addNodeWithLocator: (
      type,
      locatorStrategy,
      locator,
      text,
    ) => {
      set((state) => {
        const result =
          addNodeWithLocatorAction(
            state.nodes,
            state.edges,
            type,
            {
              locatorStrategy,
              locator,
              text,
            },
          );

        return {
          nodes: result.nodes,

          edges: result.edges,

          selectedNodeId:
            result.node.id,

          history: pushHistory(
            state.history,
            state.nodes,
            state.edges,
          ),

          future: [],
        };
      });

      markProjectModified();
    },

    updateNode: (
      id,
      data,
    ) => {
      set((state) => ({
        nodes:
          updateNodeAction(
            state.nodes,
            id,
            data,
          ),

        history: pushHistory(
          state.history,
          state.nodes,
          state.edges,
        ),

        future: [],
      }));

      markProjectModified();
    },

    updateNodeData: (
      id,
      data,
    ) => {
      set((state) => ({
        nodes:
          updateNodeDataAction(
            state.nodes,
            id,
            data,
          ),

        history: pushHistory(
          state.history,
          state.nodes,
          state.edges,
        ),

        future: [],
      }));

      markProjectModified();
    },

    removeNode: (id) => {
      set((state) => {
        const result =
          deleteNodeAction(
            state.nodes,
            state.edges,
            id,
          );

        return {
          ...result,

          history: pushHistory(
            state.history,
            state.nodes,
            state.edges,
          ),

          future: [],
        };
      });

      markProjectModified();
    },

    insertNode: (
      edgeId,
      type,
    ) => {
      set((state) => {
        const result =
          insertNodeAction(
            state.nodes,
            state.edges,
            edgeId,
            type,
          );

        return {
          ...result,

          history: pushHistory(
            state.history,
            state.nodes,
            state.edges,
          ),

          future: [],
        };
      });

      markProjectModified();
    },

    duplicateNode: (id) => {
      set((state) => {
        const result =
          duplicateNodeAction(
            state.nodes,
            state.edges,
            id,
          );

        return {
          ...result,

          history: pushHistory(
            state.history,
            state.nodes,
            state.edges,
          ),

          future: [],
        };
      });

      markProjectModified();
    },

    saveProject: (
      name = "Untitled",
      options,
    ) => {
      const {
        nodes,
        edges,
      } = get();

      return createProject(
        name,
        nodes,
        edges,
        options,
      );
    },

    loadProject: (
      project,
    ) => {
      set({
        nodes:
          structuredClone(
            project.nodes,
          ),

        edges:
          structuredClone(
            project.edges,
          ),

        selectedNodeId: null,

        clipboard: null,

        history: [],

        future: [],
      });
    },

    setSelectedNode: (
      id,
    ) => {
      set({
        selectedNodeId: id,
      });
    },

    resetFlow: () => {
      set({
        nodes:
          structuredClone(
            initialNodes,
          ),

        edges:
          structuredClone(
            initialEdges,
          ),

        selectedNodeId: null,

        clipboard: null,

        history: [],

        future: [],
      });
    },
    insertNodeWithData: (
      edgeId,
      type,
      data,
      afterNodeId,
      beforeNodeId,
    ) => {
      set((state) => {
        const result =
          insertNodeWithDataAction(
            state.nodes,
            state.edges,
            edgeId,
            type,
            data,
            afterNodeId,
            beforeNodeId,
          );

        if (!result.node) {
          return state;
        }

        return {
          nodes:
            result.nodes,

          edges:
            result.edges,

          selectedNodeId:
            result.node.id,

          history:
            pushHistory(
              state.history,
              state.nodes,
              state.edges,
            ),

          future: [],
        };
      });

      markProjectModified();
    },
  }));

