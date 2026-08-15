import { emitInlineFunction } from "./emitInlineFunction";
import { quote } from "./quote";

export function emitExpression(
    value: string,
): string {
    const trimmed =
        value.trim();

    if (
        trimmed.startsWith("${") &&
        trimmed.endsWith("}")
    ) {
        return emitInlineFunction(
            "resolve_variables",
            [quote(value)],
        );
    }

    return quote(value);
}