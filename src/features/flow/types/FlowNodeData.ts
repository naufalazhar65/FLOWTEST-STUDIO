import type { NodeAction } from "./flowNode";

export interface FlowNodeData {
  action: NodeAction;

  title: string;
  subtitle: string;

  locatorStrategy: string;
  locator: string;

  text?: string;
  expected?: string;

  [key: string]: string | undefined;
}