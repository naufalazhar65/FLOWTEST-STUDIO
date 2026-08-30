import type { Edge } from "reactflow";
import type { FlowNode } from "../types/flowNode";
import type { FlowProject } from "../types/FlowProject";

import type {
    AIAssistantSettings,
} from "../../ai/types/AIAssistantSettings";

interface CreateProjectOptions {
  id?: string;
  createdAt?: string;
  aiSettings?: AIAssistantSettings;
}

export function createProject(
  name: string,
  nodes: FlowNode[],
  edges: Edge[],
  options?: CreateProjectOptions,
): FlowProject {
  const now =
    new Date().toISOString();

  return {
    id:
      options?.id ??
      crypto.randomUUID(),

    name,

    createdAt:
      options?.createdAt ??
      now,

    updatedAt: now,

    nodes: structuredClone(
      nodes,
    ),

    edges: structuredClone(
      edges,
    ),

    ...(options?.aiSettings
      ? {
        aiSettings:
          options.aiSettings,
      }
      : {}),
  };
}

export function cloneProject(
  project: FlowProject,
): FlowProject {
  return {
    ...structuredClone(project),

    id: crypto.randomUUID(),

    updatedAt:
      new Date().toISOString(),
  };
}