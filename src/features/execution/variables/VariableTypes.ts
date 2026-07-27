export type VariableType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "null";

export interface RuntimeVariable<T = unknown> {
  name: string;

  value: T;

  type: VariableType;

  updatedAt: number;
}