import type {
  CloseAppNodeData,
  DeviceGetterNodeData,
  ElementGetterNodeData,
  FlowNodeData,
  LaunchAppNodeData,
  LocatorNodeData,
} from "../types/flowNode";

import type { ValidationResult } from "./ValidationResult";

function validateLaunchApp(
  data: LaunchAppNodeData,
  errors: string[],
) {
  if (data.platform === "Android") {
    if (!data.appPackage.trim()) {
      errors.push("App Package is required.");
    }

    if (!data.appActivity.trim()) {
      errors.push("App Activity is required.");
    }
  }

  if (data.platform === "iOS") {
    if (
      !data.bundleId.trim() &&
      !data.app.trim()
    ) {
      errors.push(
        "Bundle ID or App path is required.",
      );
    }
  }
}

function validateCloseApp(
  data: CloseAppNodeData,
  errors: string[],
) {
  if (data.platform === "Android") {
    if (!data.appPackage.trim()) {
      errors.push("App Package is required.");
    }
  }

  if (data.platform === "iOS") {
    if (!data.bundleId.trim()) {
      errors.push("Bundle ID is required.");
    }
  }
}

function validateLocator(
  data: LocatorNodeData,
  errors: string[],
) {
  if (!data.locatorStrategy.trim()) {
    errors.push(
      "Locator strategy is required.",
    );
  }

  if (!data.locator.trim()) {
    errors.push("Locator is required.");
  }
}

function validateElementGetter(
  data: ElementGetterNodeData,
  errors: string[],
) {
  validateLocator(data, errors);

  if (!data.variableName.trim()) {
    errors.push(
      "Variable name is required.",
    );
  }
}

function validateDeviceGetter(
  data: DeviceGetterNodeData,
  errors: string[],
) {
  if (!data.variableName.trim()) {
    errors.push(
      "Variable name is required.",
    );
  }
}

function validateComparison(
  data: {
    actual?: string;
    expected?: string;
  },
  errors: string[],
) {
  if (!(data.actual ?? "").trim()) {
    errors.push(
      "Actual value is required.",
    );
  }

  if (!(data.expected ?? "").trim()) {
    errors.push(
      "Expected value is required.",
    );
  }
}

function validatePositiveNumber(
  value: number,
  field: string,
  errors: string[],
) {
  if (
    Number.isNaN(Number(value)) ||
    Number(value) <= 0
  ) {
    errors.push(
      `${field} must be greater than 0.`,
    );
  }
}

export function validateNode(
  data: FlowNodeData,
): ValidationResult {
  const errors: string[] = [];

  switch (data.action) {
    case "launchApp":
      validateLaunchApp(data, errors);
      break;

    case "closeApp":
      validateCloseApp(data, errors);
      break;

    case "tap":
    case "longPress":
    case "doubleTap":
      validateLocator(data, errors);
      break;

    case "drag":
      validateLocator(data, errors);

      validatePositiveNumber(
        data.distance,
        "Distance",
        errors,
      );

      validatePositiveNumber(
        data.duration,
        "Duration",
        errors,
      );

      break;

    case "pinch":
      validateLocator(data, errors);

      if (
        Number.isNaN(Number(data.percent)) ||
        data.percent <= 0 ||
        data.percent > 1
      ) {
        errors.push(
          "Percent must be between 0 and 1.",
        );
      }

      validatePositiveNumber(
        data.duration,
        "Duration",
        errors,
      );

      break;

    case "zoom":
      validateLocator(data, errors);

      if (
        Number.isNaN(Number(data.percent)) ||
        data.percent <= 0 ||
        data.percent > 1
      ) {
        errors.push(
          "Percent must be between 0 and 1.",
        );
      }

      validatePositiveNumber(
        data.duration,
        "Duration",
        errors,
      );

      break;

    case "fling":
      validateLocator(data, errors);

      validatePositiveNumber(
        data.speed,
        "Speed",
        errors,
      );

      break;

    case "input":
      validateLocator(data, errors);

      if (!data.text.trim()) {
        errors.push("Text is required.");
      }

      break;

    case "assert":
      validateComparison(data, errors);
      break;

    case "if":
      validateComparison(data, errors);
      break;

    case "getText":
    case "getAttribute":
    case "elementExists":
    case "getDisplayed":
    case "getEnabled":
    case "getSelected":
    case "getLocation":
    case "getSize":
    case "getRect":
      validateElementGetter(
        data,
        errors,
      );
      break;

    case "getCurrentActivity":
    case "getCurrentPackage":
    case "getOrientation":
    case "getPlatformVersion":
    case "getDeviceName":
    case "getDeviceTime":
      validateDeviceGetter(
        data,
        errors,
      );
      break;

    case "setVariable":
      if (!data.variableName.trim()) {
        errors.push(
          "Variable name is required.",
        );
      }

      if (!data.value.trim()) {
        errors.push("Value is required.");
      }

      break;

    case "delay":
      validatePositiveNumber(
        data.duration,
        "Duration",
        errors,
      );
      break;

    case "pressReturn":
      break;

    case "hideKeyboard":
      break;
  }


  return {
    valid: errors.length === 0,
    errors,
  };
}