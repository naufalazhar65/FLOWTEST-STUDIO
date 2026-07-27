const variables = new Map<string, string>();

export function setVariable(
  name: string,
  value: string
) {
  variables.set(name, value);
}

export function getVariable(
  name: string
): string | undefined {
  return variables.get(name);
}

export function getVariables() {
  return new Map(variables);
}

export function clearVariables() {
  variables.clear();
}