export function emitFunction(
    name: string,
    args: string[],
): string {
    if (args.length === 0) {
        return `${name}()`;
    }

    const formattedArgs = args
        .map((arg) =>
            arg
                .split("\n")
                .map(
                    (line) =>
                        `    ${line}`,
                )
                .join("\n"),
        )
        .join(",\n");

    return `${name}(
${formattedArgs},
)`;
}