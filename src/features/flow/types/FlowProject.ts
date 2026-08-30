import type { Edge } from "reactflow";
import type { FlowNode } from "./flowNode";

import type {
    AIAssistantSettings,
} from "../../ai/types/AIAssistantSettings";

export interface FlowProject {
  id: string;
  name: string;

  createdAt: string;
  updatedAt: string;

  nodes: FlowNode[];
  edges: Edge[];

  aiSettings?: AIAssistantSettings;
}