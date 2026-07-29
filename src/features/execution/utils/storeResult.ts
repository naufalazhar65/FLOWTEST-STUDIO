import { setVariable } from "../variables/VariableStore";

export function storeResult<T>(
    variableName: string,
    value: T,
): T {
    if (variableName.trim()) {
        setVariable(variableName, value);
    }

    return value;
}