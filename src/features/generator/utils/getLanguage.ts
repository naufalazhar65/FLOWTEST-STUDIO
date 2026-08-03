export function getLanguage(
    path: string,
): string {
    if (path.endsWith(".py")) {
        return "python";
    }

    if (path.endsWith(".md")) {
        return "markdown";
    }

    if (path.endsWith(".json")) {
        return "json";
    }

    if (path.endsWith(".yaml")) {
        return "yaml";
    }

    if (path.endsWith(".yml")) {
        return "yaml";
    }

    if (path.endsWith(".ini")) {
        return "ini";
    }

    if (path.endsWith(".txt")) {
        return "plaintext";
    }

    return "plaintext";
}