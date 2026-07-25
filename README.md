ini isi file useflowstore

import { create } from "zustand";

import type { Node, Edge } from "reactflow";



import {

  initialNodes,

  initialEdges,

} from "../data/initialFlow";



import { createNode } from "../factories/nodeFactory";



interface FlowStore {

  // =========================

  // State

  // =========================

  nodes: Node[];

  edges: Edge[];



  selectedNodeId: string | null;



  // =========================

  // Actions

  // =========================

  setNodes: (nodes: Node[]) => void;

  setEdges: (edges: Edge[]) => void;



  addNode: (node: Node) => void;

  addTapNode: () => void;

  addInputNode: () => void;

  addAssertNode: () => void;



  updateNode: (id: string, data: Partial<Node>) => void;

  removeNode: (id: string) => void;



  setSelectedNode: (id: string | null) => void;

}



export const useFlowStore = create<FlowStore>((set) => ({

  // =========================

  // Initial State

  // =========================

  nodes: initialNodes,

  edges: initialEdges,



  selectedNodeId: null,



  // =========================

  // State Setters

  // =========================

  setNodes: (nodes) => set({ nodes }),



  setEdges: (edges) => set({ edges }),



  // =========================

  // Node Actions

  // =========================

  addNode: (node) =>

    set((state) => ({

      nodes: [...state.nodes, node],

    })),



  addTapNode: () =>

    set((state) => ({

      nodes: [...state.nodes, createNode("tap")],

    })),



  addInputNode: () =>

    set((state) => ({

      nodes: [...state.nodes, createNode("input")],

    })),



  addAssertNode: () =>

    set((state) => ({

      nodes: [...state.nodes, createNode("assert")],

    })),



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



  removeNode: (id) =>

    set((state) => ({

      nodes: state.nodes.filter((node) => node.id !== id),

      edges: state.edges.filter(

        (edge) => edge.source !== id && edge.target !== id

      ),

    })),



  // =========================

  // Selection

  // =========================

  setSelectedNode: (id) =>

    set({

      selectedNodeId: id,

    }),

}));



dan ini intialflow

import type { Node, Edge } from "reactflow";



export const initialNodes: Node[] = [

   {

    id: "1",

    type: "tap",

    position: {

      x: 250,

      y: 80,

    },

    data: {},

  },



  {

    id: "2",

    type: "input",

    position: {

      x: 250,

      y: 260,

    },

    data: {},

  },



  {

    id: "3",

    type: "assert",

    position: {

      x: 250,

      y: 440,

    },

    data: {},

  },

];



export const initialEdges: Edge[] = [

  {

    id: "e1",

    source: "1",

    target: "2",

  },



  {

    id: "e2",

    source: "2",

    target: "3",

  },

];