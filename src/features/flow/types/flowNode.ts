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
  | "getAttribute"
  | "getCurrentActivity"
  | "getCurrentPackage"
  | "getOrientation"
  | "getPlatformVersion"
  | "getDeviceName"
  | "getDeviceTime"
  | "getDisplayed"
  | "getEnabled"
  | "getSelected"
  | "getLocation"


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

export interface ElementGetterNodeData
  extends LocatorNodeData {

  variableName: string;
}

export interface DeviceGetterNodeData
  extends BaseNodeData {

  variableName: string;
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

export interface GetTextNodeData
  extends ElementGetterNodeData {

  action: "getText";
}

export interface ElementExistsNodeData
  extends ElementGetterNodeData {

  action: "elementExists";
}

export interface GetAttributeNodeData
  extends ElementGetterNodeData {

  action: "getAttribute";

  attribute: string;
}

export interface GetDisplayedNodeData
  extends ElementGetterNodeData {

  action: "getDisplayed";
}

export interface GetEnabledNodeData
  extends ElementGetterNodeData {

  action: "getEnabled";
}

export interface GetSelectedNodeData
  extends ElementGetterNodeData {

  action: "getSelected";
}

export interface GetCurrentActivityNodeData
  extends DeviceGetterNodeData {

  action: "getCurrentActivity";
}

export interface GetCurrentPackageNodeData
  extends DeviceGetterNodeData {

  action: "getCurrentPackage";
}

export interface GetOrientationNodeData
  extends DeviceGetterNodeData {

  action: "getOrientation";
}

export interface GetPlatformVersionNodeData
  extends DeviceGetterNodeData {

  action: "getPlatformVersion";
}

export interface GetDeviceNameNodeData
  extends DeviceGetterNodeData {

  action: "getDeviceName";
}

export interface GetDeviceTimeNodeData
  extends DeviceGetterNodeData {

  action: "getDeviceTime";
}

export interface GetLocationNodeData
    extends ElementGetterNodeData {
    action: "getLocation";
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
  | GetAttributeNodeData
  | ElementExistsNodeData
  | GetDisplayedNodeData
  | GetEnabledNodeData
  | GetSelectedNodeData
  | GetCurrentActivityNodeData
  | GetCurrentPackageNodeData
  | GetOrientationNodeData
  | GetPlatformVersionNodeData
  | GetDeviceNameNodeData
  | GetDeviceTimeNodeData
  | GetLocationNodeData


export type FlowNode = Node<FlowNodeData>;