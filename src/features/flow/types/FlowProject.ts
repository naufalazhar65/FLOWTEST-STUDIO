import type { Edge } from "reactflow";
import type { FlowNode } from "./flowNode";

export interface FlowProject {
  id: string;
  name: string;

  createdAt: string;
  updatedAt: string;

  nodes: FlowNode[];
  edges: Edge[];
}