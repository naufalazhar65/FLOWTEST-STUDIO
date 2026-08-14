export function emitInlineFunction(
    name: string,
    args: string[],
): string {
    return `${name}(${args.join(", ")})`;
}