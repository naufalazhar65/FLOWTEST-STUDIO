import type { Node } from "reactflow";

export type NodeAction =
  | "tap"
  | "input"
  | "assert";

export interface FlowNodeData {
  action: NodeAction;

  title: string;
  subtitle: string;

  locatorStrategy: string;
  locator: string;

  text?: string;
  expected?: string;

  [key: string]: unknown;
}

export type FlowNode = Node<FlowNodeData>;