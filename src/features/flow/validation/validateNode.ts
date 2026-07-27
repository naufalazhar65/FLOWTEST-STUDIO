import type { FlowNodeData } from "../types/flowNode";
import type { ValidationResult } from "./ValidationResult";

export function validateNode(
  data: FlowNodeData
): ValidationResult {
  const errors: string[] = [];

  if (!data.locator.trim()) {
    errors.push("Locator is required.");
  }

  switch (data.action) {
    case "input":
      if (!data.text.trim()) {
        errors.push("Text is required.");
      }
      break;

    case "assert":
      if (!data.expected.trim()) {
        errors.push("Expected value is required.");
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}