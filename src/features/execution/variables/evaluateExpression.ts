import { getVariable } from "./VariableStore";

const variablePattern = /\$\{([^}]+)\}/g;

function getNestedValue(
    value: unknown,
    path: string
): unknown {
    if (!path) {
        return value;
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
        }, value);
}

export function evaluateExpression(
    expression: string
): boolean {
    const resolved = expression.replace(
        variablePattern,
        (_, variableExpression: string) => {
            const parts = variableExpression.trim().split(".");

            const variableName = parts.shift();

            if (!variableName) {
                return "undefined";
            }

            const variable = getVariable(variableName);

            const value = getNestedValue(
                variable,
                parts.join(".")
            );

            return JSON.stringify(value);
        }
    );

    try {
        return Boolean(
            Function(
                `"use strict"; return (${resolved});`
            )()
        );
    } catch {
        return false;
    }
}