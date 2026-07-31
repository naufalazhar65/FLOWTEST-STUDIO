import type {
  AssertNodeData,
  CloseAppNodeData,
  DelayNodeData,
  ElementExistsNodeData,
  GetAttributeNodeData,
  GetCurrentActivityNodeData,
  GetCurrentPackageNodeData,
  GetDeviceNameNodeData,
  GetDeviceTimeNodeData,
  GetDisplayedNodeData,
  GetEnabledNodeData,
  GetLocationNodeData,
  GetOrientationNodeData,
  GetPlatformVersionNodeData,
  GetRectNodeData,
  GetSelectedNodeData,
  GetSizeNodeData,
  GetTextNodeData,
  IfNodeData,
  InputNodeData,
  LaunchAppNodeData,
  ScrollNodeData,
  ScreenshotNodeData,
  SetVariableNodeData,
  SwipeNodeData,
  TapNodeData,
  WaitNodeData,
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
  | keyof GetSizeNodeData
  | keyof GetRectNodeData;

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

  visibleWhen?: {
    platform?: "Android" | "iOS";
  };
}