import type { Edge } from "reactflow";
import type { FlowNode } from "./flowNode";

export interface FlowSnapshot {
  nodes: FlowNode[];
  edges: Edge[];
}