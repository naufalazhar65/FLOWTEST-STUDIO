import { getVariable } from "./VariableStore";

const variablePattern =
  /\$\{([^}]+)\}/g;

export function resolveVariables(
  value: string
): string {
  return value.replace(
    variablePattern,
    (_, variableName: string) => {
      return (
        getVariable(variableName) ??
        ""
      );
    }
  );
}