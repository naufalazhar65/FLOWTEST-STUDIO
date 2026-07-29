import { resolveVariables } from "./resolveVariable";

function isPlainObject(
    value: unknown
): value is Record<string, unknown> {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

export function resolveNodeVariables<T>(
    value: T
): T {
    if (typeof value === "string") {
        return resolveVariables(value) as T;
    }

    if (Array.isArray(value)) {
        return value.map((item) =>
            resolveNodeVariables(item)
        ) as T;
    }

    if (isPlainObject(value)) {
        const result: Record<string, unknown> = {};

        for (const [key, item] of Object.entries(value)) {
            result[key] =
                resolveNodeVariables(item);
        }

        return result as T;
    }

    return value;
}