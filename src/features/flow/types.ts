export type FlowNodeType =
  | "start"
  | "tap"
  | "input"
  | "assert"
  | "wait"
  | "swipe"
  | "scroll"
  | "screenshot"
  | "end";

export interface FlowNodeData {
  label: string;
  locator?: string;
  value?: string;
}

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  data: FlowNodeData;
}