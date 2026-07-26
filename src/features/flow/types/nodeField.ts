import type { FlowNodeData } from "./FlowNodeData";

export interface NodeField {
  key: keyof FlowNodeData;
  label: string;

  type: "text" | "select";

  options?: string[];
}