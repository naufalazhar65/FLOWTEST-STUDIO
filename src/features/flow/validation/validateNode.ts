import type {
  DeviceGetterNodeData,
  ElementGetterNodeData,
  FlowNodeData,
  LocatorNodeData,
} from "../types/flowNode";

import type { ValidationResult } from "./ValidationResult";

function validateLocator(
  data: LocatorNodeData,
  errors: string[]
) {
  if (!data.locatorStrategy.trim()) {
    errors.push("Locator strategy is required.");
  }

  if (!data.locator.trim()) {
    errors.push("Locator is required.");
  }
}

function validateElementGetter(
  data: ElementGetterNodeData,
  errors: string[]
) {
  validateLocator(data, errors);

  if (!data.variableName.trim()) {
    errors.push("Variable name is required.");
  }
}

function validateDeviceGetter(
  data: DeviceGetterNodeData,
  errors: string[]
) {
  if (!data.variableName.trim()) {
    errors.push("Variable name is required.");
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

    case "getText":
    case "getAttribute":
    case "elementExists":
    case "getDisplayed":
    case "getEnabled":
    case "getSelected":
      validateElementGetter(data, errors);
      break;

    case "getCurrentActivity":
    case "getCurrentPackage":
    case "getOrientation":
    case "getPlatformVersion":
    case "getDeviceName":
    case "getDeviceTime":
    case "getLocation":
      validateDeviceGetter(data, errors);
      break;

    case "setVariable":
      if (!data.variableName.trim()) {
        errors.push("Variable name is required.");
      }

      if (!data.value.trim()) {
        errors.push("Value is required.");
      }

      break;

    case "delay":
      if (
        Number.isNaN(Number(data.duration)) ||
        Number(data.duration) <= 0
      ) {
        errors.push(
          "Duration must be greater than 0."
        );
      }

      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}