import type { Edge } from "reactflow";

export interface ExecutionContext {
  device: string;

  edges: Edge[];
}