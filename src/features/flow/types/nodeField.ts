import type {
  TapNodeData,
  InputNodeData,
  AssertNodeData,
  SetVariableNodeData,
  DelayNodeData,
  SwipeNodeData,
  ScrollNodeData,
} from "./flowNode";

export type NodeFieldKey =
  | keyof TapNodeData
  | keyof InputNodeData
  | keyof AssertNodeData
  | keyof SetVariableNodeData
  | keyof DelayNodeData
  | keyof SwipeNodeData
  | keyof ScrollNodeData;

export interface NodeField {
  key: NodeFieldKey;

  label: string;

  type:
  | "text"
  | "number"
  | "select"
  | "checkbox"
  | "textarea";

  placeholder?: string;

  options?: string[];

  min?: number;

  max?: number;

  step?: number;
}