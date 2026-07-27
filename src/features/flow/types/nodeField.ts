import type { FlowNodeData } from "../types/flowNode";
export interface NodeField {
  key: keyof FlowNodeData;
  label: string;

  type: "text" | "select";

  options?: string[];
}