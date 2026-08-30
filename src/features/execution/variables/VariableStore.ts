import type {
  RuntimeVariable,
  VariableType,
} from "./VariableTypes";

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

export class VariableStore {
  private variables = new Map<
    string,
    RuntimeVariable
  >();

  setVariable<T>(
    name: string,
    value: T
  ): void {
    this.variables.set(name, {
      name,
      value,
      type: detectType(value),
      updatedAt: Date.now(),
    });
  }

  getVariable<T = unknown>(
    name: string
  ): T | undefined {
    return this.variables.get(name)?.value as
      | T
      | undefined;
  }

  getVariableInfo(
    name: string
  ): RuntimeVariable | undefined {
    return this.variables.get(name);
  }

  getAllVariables(): RuntimeVariable[] {
    return Array.from(this.variables.values());
  }

  removeVariable(
    name: string
  ): void {
    this.variables.delete(name);
  }

  clearVariables(): void {
    this.variables.clear();
  }

  get size(): number {
    return this.variables.size;
  }
}

// Default singleton for backward compatibility (UI, tests that don't create instances)
const defaultStore = new VariableStore();

export function setVariable<T>(
  name: string,
  value: T
) {
  defaultStore.setVariable(name, value);
}

export function getVariable<T = unknown>(
  name: string
): T | undefined {
  return defaultStore.getVariable(name);
}

export function getVariableInfo(
  name: string
): RuntimeVariable | undefined {
  return defaultStore.getVariableInfo(name);
}

export function getAllVariables(): RuntimeVariable[] {
  return defaultStore.getAllVariables();
}

export function removeVariable(
  name: string
): void {
  defaultStore.removeVariable(name);
}

export function clearVariables(): void {
  defaultStore.clearVariables();
}

export function getDefaultStore(): VariableStore {
  return defaultStore;
}

/**
 * Safely extract VariableStore from ExecutionContext.
 * Falls back to default singleton if not provided.
 */
export function getStoreFromContext(
  context: { variableStore?: VariableStore } | undefined
): VariableStore {
  return context?.variableStore ?? defaultStore;
}

export {
} from "./VariableTypes";