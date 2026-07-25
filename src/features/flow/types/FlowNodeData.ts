export interface FlowNodeData {
  action: "tap" | "input" | "assert";

  title: string;
  subtitle: string;

  locatorStrategy: string;
  locator: string;

  text?: string;

  expected?: string;
}