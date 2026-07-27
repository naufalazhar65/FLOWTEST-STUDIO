import type { Node } from "reactflow";

export type NodeAction =
  | "tap"
  | "input"
  | "assert";
  

export interface BaseNodeData {
  action: NodeAction;

  title: string;
  subtitle: string;

  locatorStrategy: string;
  locator: string;
}

export interface TapNodeData
  extends BaseNodeData {
  action: "tap";
}

export interface InputNodeData
  extends BaseNodeData {
  action: "input";

  text: string;
}

export interface AssertNodeData
  extends BaseNodeData {
  action: "assert";

  expected: string;
}

export type FlowNodeData =
  | TapNodeData
  | InputNodeData
  | AssertNodeData;

export type FlowNode = Node<FlowNodeData>;