import type { FlowNodeData } from "../types/flowNode";

export function getNodeSummary(
  data: FlowNodeData
): string {
  switch (data.action) {
    case "tap":
      return `${data.locatorStrategy}=${data.locator}`;

    case "input":
      return data.text
        ? `${data.locatorStrategy}=${data.locator}\n${data.text}`
        : `${data.locatorStrategy}=${data.locator}`;

    case "assert":
      return data.expected
        ? `${data.locatorStrategy}=${data.locator}\nExpected: ${data.expected}`
        : `${data.locatorStrategy}=${data.locator}`;

    default:
      return "";
  }
}