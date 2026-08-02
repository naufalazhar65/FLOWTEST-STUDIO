export function indent(
    code: string,
    spaces = 4,
): string {
    const prefix =
        " ".repeat(spaces);

    return code
        .split("\n")
        .map((line) =>
            line.length === 0
                ? ""
                : prefix + line,
        )
        .join("\n");
}