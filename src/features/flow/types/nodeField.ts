import type {
  TapNodeData,
  InputNodeData,
  AssertNodeData,
  SetVariableNodeData,
  DelayNodeData,
  SwipeNodeData,
  ScrollNodeData,
  WaitNodeData,
  LaunchAppNodeData,
  CloseAppNodeData,
  ScreenshotNodeData,
  IfNodeData,
  GetTextNodeData,
  ElementExistsNodeData,
  GetAttributeNodeData,
  GetCurrentActivityNodeData,
  GetCurrentPackageNodeData,
  GetOrientationNodeData,
  GetPlatformVersionNodeData,
  GetDeviceNameNodeData,
  GetDeviceTimeNodeData,
  GetDisplayedNodeData,
  GetEnabledNodeData,
  GetSelectedNodeData,
  GetLocationNodeData
  
} from "./flowNode";

export type NodeFieldKey =
  | keyof TapNodeData
  | keyof InputNodeData
  | keyof AssertNodeData
  | keyof SetVariableNodeData
  | keyof DelayNodeData
  | keyof SwipeNodeData
  | keyof ScrollNodeData
  | keyof WaitNodeData
  | keyof LaunchAppNodeData
  | keyof CloseAppNodeData
  | keyof ScreenshotNodeData
  | keyof IfNodeData
  | keyof GetTextNodeData
  | keyof ElementExistsNodeData
  | keyof GetAttributeNodeData
  | keyof GetCurrentActivityNodeData
  | keyof GetCurrentPackageNodeData
  | keyof GetOrientationNodeData
  | keyof GetPlatformVersionNodeData
  | keyof GetDeviceNameNodeData
  | keyof GetDeviceTimeNodeData
  | keyof GetDisplayedNodeData
  | keyof GetEnabledNodeData
  | keyof GetSelectedNodeData
  | keyof GetLocationNodeData

export interface NodeField {
  key: NodeFieldKey;

  label: string;

  type:
  | "text"
  | "number"
  | "select"
  | "checkbox"
  | "textarea"
  | "fileName";

  placeholder?: string;

  options?: string[];

  min?: number;

  max?: number;

  step?: number;
}