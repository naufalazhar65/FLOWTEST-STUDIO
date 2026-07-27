import type {
  FlowNodeData,
  LocatorNodeData,
} from "../types/flowNode";

import type { ValidationResult } from "./ValidationResult";

function validateLocator(
  data: LocatorNodeData,
  errors: string[]
) {
  if (!data.locator.trim()) {
    errors.push("Locator is required.");
  }

  if (!data.locatorStrategy.trim()) {
    errors.push("Locator strategy is required.");
  }
}

export function validateNode(
  data: FlowNodeData
): ValidationResult {
  const errors: string[] = [];

  switch (data.action) {
    case "tap":
      validateLocator(data, errors);
      break;

    case "input":
      validateLocator(data, errors);

      if (!data.text.trim()) {
        errors.push("Text is required.");
      }

      break;

    case "assert":
      validateLocator(data, errors);

      if (!data.expected.trim()) {
        errors.push("Expected value is required.");
      }

      break;

    case "setVariable":
      if (!data.variableName.trim()) {
        errors.push("Variable name is required.");
      }

      if (!data.value.trim()) {
        errors.push("Value is required.");
      }

      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}