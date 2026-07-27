import type {
  RuntimeVariable,
  VariableType,
} from "./VariableTypes";

const variables = new Map<
  string,
  RuntimeVariable
>();

function detectType(
  value: unknown
): VariableType {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  switch (typeof value) {
    case "string":
      return "string";

    case "number":
      return "number";

    case "boolean":
      return "boolean";

    case "object":
      return "object";

    default:
      return "string";
  }
}

export function setVariable<T>(
  name: string,
  value: T
) {
  variables.set(name, {
    name,
    value,
    type: detectType(value),
    updatedAt: Date.now(),
  });
}

export function getVariable<T = unknown>(
  name: string
): T | undefined {
  return variables.get(name)?.value as
    | T
    | undefined;
}

export function getVariableInfo(
  name: string
): RuntimeVariable | undefined {
  return variables.get(name);
}

export function getAllVariables(): RuntimeVariable[] {
  return Array.from(variables.values());
}

export function removeVariable(
  name: string
) {
  variables.delete(name);
}

export function clearVariables() {
  variables.clear();
}