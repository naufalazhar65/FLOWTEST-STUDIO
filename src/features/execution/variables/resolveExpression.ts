import { getVariable } from "./VariableStore";

const VARIABLE_REGEX = /\{\{\s*(.*?)\s*\}\}/g;

function getNestedValue(
  object: unknown,
  path: string
): unknown {
  if (!path) {
    return object;
  }

  return path
    .split(".")
    .reduce<unknown>((current, key) => {
      if (
        current !== null &&
        typeof current === "object"
      ) {
        return (current as Record<string, unknown>)[key];
      }

      return undefined;
    }, object);
}

export function resolveExpression(
  input: string
): string {
  return input.replace(
    VARIABLE_REGEX,
    (_, expression: string) => {
      const parts = expression.split(".");

      const variableName = parts.shift();

      if (!variableName) {
        return "";
      }

      const value = getVariable(variableName);

      if (value === undefined) {
        return "";
      }

      const resolved = getNestedValue(
        value,
        parts.join(".")
      );

      if (resolved === undefined) {
        return "";
      }

      return String(resolved);
    }
  );
}