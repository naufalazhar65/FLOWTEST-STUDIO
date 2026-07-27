import type { Edge } from "reactflow";
import type { FlowNode } from "../types/flowNode";
import type { FlowProject } from "../types/FlowProject";

export function createProject(
  name: string,
  nodes: FlowNode[],
  edges: Edge[]
): FlowProject {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name,

    createdAt: now,
    updatedAt: now,

    nodes: structuredClone(nodes),
    edges: structuredClone(edges),
  };
}

export function cloneProject(
  project: FlowProject
): FlowProject {
  return {
    ...structuredClone(project),

    id: crypto.randomUUID(),

    updatedAt: new Date().toISOString(),
  };
}