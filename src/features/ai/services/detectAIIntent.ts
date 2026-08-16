export type AIIntent =
    | "analyzeFlow"
    | "analyzeSelectedNode"
    | "generateFlow";

export function detectAIIntent(
    message: string,
): AIIntent {
    const normalized =
        message
            .trim()
            .toLowerCase();

    if (
        normalized.includes(
            "selected node",
        ) ||
        normalized.includes(
            "node yang dipilih",
        ) ||
        normalized.includes(
            "node terpilih",
        ) ||
        normalized.includes(
            "node ini",
        )
    ) {
        return "analyzeSelectedNode";
    }

    if (
        normalized.includes(
            "jelaskan flow",
        ) ||
        normalized.includes(
            "jelaskan alur",
        ) ||
        normalized.includes(
            "apa yang dilakukan flow",
        ) ||
        normalized.includes(
            "flow saya",
        ) ||
        normalized.includes(
            "what does my flow do",
        ) ||
        normalized.includes(
            "explain my flow",
        ) ||
        normalized.includes(
            "describe my flow",
        ) ||
        normalized.includes(
            "current flow",
        )
    ) {
        return "analyzeFlow";
    }

    return "generateFlow";
}