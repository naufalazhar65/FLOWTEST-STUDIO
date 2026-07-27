import type {
  TapNodeData,
  InputNodeData,
  AssertNodeData,
  SetVariableNodeData,
} from "./flowNode";

export type NodeFieldKey =
  | keyof TapNodeData
  | keyof InputNodeData
  | keyof AssertNodeData
  | keyof SetVariableNodeData;

export interface NodeField {
  key: NodeFieldKey;

  label: string;

  type: "text" | "select";

  options?: string[];
}