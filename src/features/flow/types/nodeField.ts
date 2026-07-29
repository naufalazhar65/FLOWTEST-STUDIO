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
  | keyof GetAttributeNodeData;

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