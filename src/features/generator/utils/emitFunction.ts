export function emitFunction(
    name: string,
    args: string[],
): string {
    if (args.length === 0) {
        return `${name}()`;
    }

    return `${name}(
${args
        .map(
            (arg) => `    ${arg},`,
        )
        .join("\n")}
)`;
}