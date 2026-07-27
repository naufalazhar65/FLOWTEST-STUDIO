import type { Node } from "reactflow";

export type NodeAction =
  | "tap"
  | "input"
  | "assert"
  | "setVariable";

export interface NodeDebug {
  breakpoint: boolean;
}

export interface BaseNodeData {
  action: NodeAction;

  title: string;
  subtitle: string;

  debug: NodeDebug;
}

export interface LocatorNodeData
  extends BaseNodeData {
  locatorStrategy: string;

  locator: string;
}

export interface TapNodeData
  extends LocatorNodeData {
  action: "tap";
}

export interface InputNodeData
  extends LocatorNodeData {
  action: "input";

  text: string;
}

export interface AssertNodeData
  extends LocatorNodeData {
  action: "assert";

  expected: string;
}

export interface SetVariableNodeData
  extends BaseNodeData {
  action: "setVariable";

  variableName: string;

  value: string;
}

export type FlowNodeData =
  | TapNodeData
  | InputNodeData
  | AssertNodeData
  | SetVariableNodeData;

export type FlowNode = Node<FlowNodeData>;