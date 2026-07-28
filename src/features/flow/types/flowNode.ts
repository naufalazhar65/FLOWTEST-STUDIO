import type { Node } from "reactflow";

export type NodeAction =
  | "tap"
  | "input"
  | "assert"
  | "setVariable"
  | "delay"
  | "swipe"
  | "scroll";

export interface NodeDebug {
  breakpoint: boolean;
}

export interface BaseNodeData {
  action: NodeAction;

  title: string;
  subtitle: string;

  debug: NodeDebug;
}

export interface LocatorNodeData extends BaseNodeData {
  locatorStrategy: string;

  locator: string;
}

export interface TapNodeData extends LocatorNodeData {
  action: "tap";
}

export interface InputNodeData extends LocatorNodeData {
  action: "input";

  text: string;
}

export interface AssertNodeData extends LocatorNodeData {
  action: "assert";

  expected: string;
}

export interface SetVariableNodeData extends BaseNodeData {
  action: "setVariable";

  variableName: string;

  value: string;
}

export interface DelayNodeData extends BaseNodeData {
  action: "delay";

  duration: number;
}

export interface SwipeNodeData
  extends BaseNodeData {
  action: "swipe";

  direction:
  | "up"
  | "down"
  | "left"
  | "right";

  distance: number;

  duration: number;
}

export interface ScrollNodeData
  extends BaseNodeData {
  action: "scroll";

  direction:
    | "up"
    | "down";

  amount: number;
}

export type FlowNodeData =
  | TapNodeData
  | InputNodeData
  | AssertNodeData
  | SetVariableNodeData
  | DelayNodeData
  | SwipeNodeData
  | ScrollNodeData;

export type FlowNode = Node<FlowNodeData>;