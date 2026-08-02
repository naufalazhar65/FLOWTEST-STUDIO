export function formatPython(
    sections: string[],
): string {
    return sections
        .filter(
            (section) =>
                section.trim().length > 0,
        )
        .join("\n\n");
}