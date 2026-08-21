import type {
    AIFlowContextNode,
} from "../types/AIRequest";

export type AINodeTargetResolution =
    | {
        status:
        "resolved";

        node:
        AIFlowContextNode;

        index:
        number;
    }
    | {
        status:
        "ambiguous";

        candidates:
        Array<{
            node:
            AIFlowContextNode;

            index:
            number;
        }>;
    }
    | {
        status:
        "notFound";
    };

function normalize(
    value: string,
): string {
    return value
        .toLowerCase()
        .trim()
        .replace(
            /[\s_-]+/g,
            " ",
        );
}

function getSearchableValues(
    node: AIFlowContextNode,
): string[] {
    return [
        node.title,
        node.subtitle,
        node.action,
        node.locator,
    ].filter(
        (
            value,
        ): value is string =>
            Boolean(
                value?.trim(),
            ),
    );
}

function scoreNode(
    message: string,
    node: AIFlowContextNode,
): number {
    const normalizedMessage =
        normalize(
            message,
        );

    const normalizedValues =
        getSearchableValues(
            node,
        ).map(
            normalize,
        );

    let bestScore =
        0;

    for (
        const value of
        normalizedValues
    ) {
        if (
            normalizedMessage.includes(
                value,
            )
        ) {
            bestScore =
                Math.max(
                    bestScore,
                    1,
                );

            continue;
        }

        const messageWords =
            normalizedMessage
                .split(
                    " ",
                )
                .filter(
                    Boolean,
                );

        const valueWords =
            value
                .split(
                    " ",
                )
                .filter(
                    Boolean,
                );

        if (
            valueWords.length ===
            0
        ) {
            continue;
        }

        const matchedWords =
            valueWords.filter(
                (
                    word,
                ) =>
                    messageWords.includes(
                        word,
                    ),
            ).length;

        const wordScore =
            matchedWords /
            valueWords.length;

        bestScore =
            Math.max(
                bestScore,
                wordScore *
                0.85,
            );
    }

    return bestScore;
}

function extractOrdinal(
    message: string,
): number | null {
    const patterns: Array<{
        pattern: RegExp;
        index: number;
    }> = [
            {
                pattern:
                    /\b(?:yang\s+)?pertama\b/i,
                index:
                    0,
            },

            {
                pattern:
                    /\b(?:yang\s+)?kedua\b/i,
                index:
                    1,
            },

            {
                pattern:
                    /\b(?:yang\s+)?ketiga\b/i,
                index:
                    2,
            },

            {
                pattern:
                    /\b(?:yang\s+)?keempat\b/i,
                index:
                    3,
            },

            {
                pattern:
                    /\b(?:yang\s+)?kelima\b/i,
                index:
                    4,
            },
        ];

    for (
        const item of
        patterns
    ) {
        if (
            item.pattern.test(
                message,
            )
        ) {
            return item.index;
        }
    }

    const englishPatterns:
        Array<{
            pattern: RegExp;
            index: number;
        }> = [
            {
                pattern:
                    /\b(?:the\s+)?first\b/i,
                index:
                    0,
            },

            {
                pattern:
                    /\b(?:the\s+)?second\b/i,
                index:
                    1,
            },

            {
                pattern:
                    /\b(?:the\s+)?third\b/i,
                index:
                    2,
            },

            {
                pattern:
                    /\b(?:the\s+)?fourth\b/i,
                index:
                    3,
            },

            {
                pattern:
                    /\b(?:the\s+)?fifth\b/i,
                index:
                    4,
            },
        ];

    for (
        const item of
        englishPatterns
    ) {
        if (
            item.pattern.test(
                message,
            )
        ) {
            return item.index;
        }
    }

    return null;
}

function extractLastModifier(
    message: string,
): boolean {
    return /\b(?:terakhir|paling akhir|last|latest)\b/i.test(
        message,
    );
}

export function resolveAINodeTarget(
    message: string,
    nodes: AIFlowContextNode[],
): AINodeTargetResolution {
    if (
        !message.trim() ||
        nodes.length ===
        0
    ) {
        return {
            status:
                "notFound",
        };
    }

    const scored =
        nodes
            .map(
                (
                    node,
                    index,
                ) => ({
                    node,

                    index,

                    score:
                        scoreNode(
                            message,
                            node,
                        ),
                }),
            )
            .filter(
                (
                    candidate,
                ) =>
                    candidate.score >
                    0,
            )
            .sort(
                (
                    first,
                    second,
                ) =>
                    second.score -
                    first.score ||
                    first.index -
                    second.index,
            );

    if (
        scored.length ===
        0
    ) {
        return {
            status:
                "notFound",
        };
    }

    const ordinal =
        extractOrdinal(
            message,
        );

    const last =
        extractLastModifier(
            message,
        );

    /*
     * When the user specifies an ordinal
     * (e.g. "Product A yang kedua"),
     * apply it only among equally named
     * top candidates.
     */
    const bestScore =
        scored[0].score;

    const topCandidates =
        scored.filter(
            (
                candidate,
            ) =>
                candidate.score ===
                bestScore,
        );

    if (
        ordinal !== null
    ) {
        const selected =
            topCandidates[
            ordinal
            ];

        if (
            selected
        ) {
            return {
                status:
                    "resolved",

                node:
                    selected.node,

                index:
                    selected.index,
            };
        }
    }

    if (
        last &&
        topCandidates.length >
        0
    ) {
        const selected =
            topCandidates[
            topCandidates.length -
            1
            ];

        return {
            status:
                "resolved",

            node:
                selected.node,

            index:
                selected.index,
        };
    }

    /*
     * Exact unique match.
     */
    if (
        topCandidates.length ===
        1
    ) {
        return {
            status:
                "resolved",

            node:
                topCandidates[0].node,

            index:
                topCandidates[0].index,
        };
    }

    /*
     * Multiple equally strong candidates:
     * do not guess.
     */
    return {
        status:
            "ambiguous",

        candidates:
            topCandidates.map(
                (
                    candidate,
                ) => ({
                    node:
                        candidate.node,

                    index:
                        candidate.index,
                }),
            ),
    };
}