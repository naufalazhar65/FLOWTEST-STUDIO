import { executionLogger } from "../services/executionLogger";
import { getVariable } from "./VariableStore";

const variablePattern = /\$\{([^}]+)\}/g;

function getNestedValue(
  value: unknown,
  path: string,
): unknown {
  if (!path) {
    return value;
  }

  return path
    .split(".")
    .reduce((current, key) => {
      if (
        current !== null &&
        typeof current === "object"
      ) {
        return (
          current as Record<string, unknown>
        )[key];
      }

      return undefined;
    }, value);
}

export function resolveVariables(
  value: string,
): string {
  return value.replace(
    variablePattern,
    (_, expression: string) => {
      const parts = expression
        .trim()
        .split(".");

      const variableName = parts.shift();

      if (!variableName) {
        return "";
      }

      const variable =
        getVariable(variableName);

      if (variable === undefined) {
        executionLogger.warning({
          message: `Variable "${variableName}" not found`,
        });

        return `\${${expression}}`;
      }

      const resolved = getNestedValue(
        variable,
        parts.join("."),
      );

      if (resolved === undefined) {
        executionLogger.warning({
          message: `Property "${expression}" not found`,
        });

        return `\${${expression}}`;
      }

      return String(resolved);
    },
  );
}