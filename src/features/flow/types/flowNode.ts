import type { Node } from "reactflow";

export type NodeAction =
  | "tap"
  | "input"
  | "swipe"
  | "scroll"
  | "delay"
  | "wait"
  | "assert"
  | "setVariable"
  | "launchApp"
  | "closeApp"
  | "back"
  | "home"
  | "screenshot"
  | "if"
  | "getText"
  | "elementExists"
  

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

export interface WaitNodeData
  extends LocatorNodeData {

  action: "wait";

  timeout: number;

  pollingInterval: number;
}

export interface LaunchAppNodeData extends BaseNodeData {
  action: "launchApp";

  appPackage: string;
  appActivity: string;
  noReset: boolean;
}

export interface CloseAppNodeData
  extends BaseNodeData {
  action: "closeApp";

  appPackage: string;
}

export interface BackNodeData
  extends BaseNodeData {
  action: "back";
}

export interface HomeNodeData
  extends BaseNodeData {
  action: "home";
}

export interface ScreenshotNodeData
  extends BaseNodeData {
  action: "screenshot";

  fileName: string;
}

export interface IfNodeData
  extends BaseNodeData {

  action: "if";

  condition: string;
}

export interface GetTextNodeData extends LocatorNodeData {
  action: "getText";

  variableName: string;
}

export interface ElementExistsNodeData
  extends LocatorNodeData {

  action: "elementExists";

  variableName: string;
}



export type FlowNodeData =
  | TapNodeData
  | InputNodeData
  | SwipeNodeData
  | ScrollNodeData
  | DelayNodeData
  | WaitNodeData
  | AssertNodeData
  | SetVariableNodeData
  | LaunchAppNodeData
  | CloseAppNodeData
  | BackNodeData
  | HomeNodeData
  | ScreenshotNodeData
  | IfNodeData
  | GetTextNodeData
  | ElementExistsNodeData


export type FlowNode = Node<FlowNodeData>;