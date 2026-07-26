import type { Edge } from "reactflow";
import type { FlowNode } from "../types/flowNode";

export interface FlowSnapshot {
  nodes: FlowNode[];
  edges: Edge[];
}