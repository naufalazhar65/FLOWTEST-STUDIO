function createTargetCandidate(
    node,
) {
    if (!node) {
        return null;
    }

    return {
        nodeId: node.id,
        action: node.action ?? null,
        title: node.title ?? null,
        subtitle:
            node.subtitle ?? null,
    };
}

function normalizeNodeTargetText(
    value,
) {
    return String(
        value ?? "",
    )
        .toLowerCase()
        .trim()
        .replace(
            /[?!.,;:]+$/g,
            "",
        )
        .replace(
            /[\s_-]+/g,
            " ",
        )
        .trim();
}

function getNodeSearchValues(
    node,
) {
    const values = [];

    if (
        typeof node?.title ===
        "string"
    ) {
        values.push(
            node.title,
        );
    }

    if (
        typeof node?.subtitle ===
        "string"
    ) {
        values.push(
            node.subtitle,
        );
    }

    if (
        typeof node?.action ===
        "string"
    ) {
        values.push(
            node.action,
        );
    }

    if (
        typeof node?.locator ===
        "string"
    ) {
        values.push(
            node.locator,
        );
    }

    if (
        node?.details &&
        typeof node.details ===
            "object"
    ) {
        for (
            const value of
            Object.values(
                node.details,
            )
        ) {
            if (
                typeof value ===
                "string"
            ) {
                values.push(
                    value,
                );
            }
        }
    }

    return values
        .map(
            normalizeNodeTargetText,
        )
        .filter(Boolean);
}

function extractNodeReference(
    message,
) {
    const normalized =
        normalizeNodeTargetText(
            message,
        );

    const failureMatch =
        normalized.match(
            /^(?:kenapa|mengapa)\s+(?:node\s+)?(.+?)\s+(?:gagal|fail|failed)$/i,
        );

    if (
        failureMatch?.[1]
    ) {
        return failureMatch[1].trim();
    }

    const englishFailureMatch =
        normalized.match(
            /^why\s+did\s+(?:the\s+)?(?:node\s+)?(.+?)\s+(?:fail|failed)$/i,
        );

    if (
        englishFailureMatch?.[1]
    ) {
        return englishFailureMatch[1].trim();
    }

    const causedByMatch =
        normalized.match(
            /^(?:apa\s+penyebab|what\s+caused)\s+(?:node\s+)?(.+?)\s+(?:gagal|fail|failed)$/i,
        );

    if (
        causedByMatch?.[1]
    ) {
        return causedByMatch[1].trim();
    }

    const genericNodeMatch =
        normalized.match(
            /^(?:kenapa|mengapa|why)\s+(?:node\s+)?(.+)$/i,
        );

    return (
        genericNodeMatch?.[1]?.trim() ??
        ""
    );
}

function extractNodeOrdinal(
    message,
) {
    const normalized =
        normalizeNodeTargetText(
            message,
        );

    if (
        /\b(?:yang\s+)?pertama\b|\bfirst\b/i.test(
            normalized,
        )
    ) {
        return 0;
    }

    if (
        /\b(?:yang\s+)?kedua\b|\bsecond\b/i.test(
            normalized,
        )
    ) {
        return 1;
    }

    if (
        /\b(?:yang\s+)?ketiga\b|\bthird\b/i.test(
            normalized,
        )
    ) {
        return 2;
    }

    if (
        /\b(?:yang\s+)?keempat\b|\bfourth\b/i.test(
            normalized,
        )
    ) {
        return 3;
    }

    if (
        /\b(?:yang\s+)?kelima\b|\bfifth\b/i.test(
            normalized,
        )
    ) {
        return 4;
    }

    if (
        /\b(?:yang\s+)?terakhir\b|\blast\b|\blatest\b/i.test(
            normalized,
        )
    ) {
        return "last";
    }

    const numericMatch =
        normalized.match(
            /\b(?:yang\s+)?ke[-\s]?(\d+)\b/i,
        );

    if (
        numericMatch
    ) {
        return (
            Number(
                numericMatch[1],
            ) - 1
        );
    }

    const englishNumericMatch =
        normalized.match(
            /\b(\d+)(?:st|nd|rd|th)\b/i,
        );

    if (
        englishNumericMatch
    ) {
        return (
            Number(
                englishNumericMatch[1],
            ) - 1
        );
    }

    return null;
}

function removeNodeOrdinal(
    value,
) {
    return value
        .replace(
            /\b(?:yang\s+)?(?:pertama|kedua|ketiga|keempat|kelima|terakhir)\b/gi,
            "",
        )
        .replace(
            /\b(?:first|second|third|fourth|fifth|last|latest)\b/gi,
            "",
        )
        .replace(
            /\b(?:yang\s+)?ke[-\s]?\d+\b/gi,
            "",
        )
        .replace(
            /\b\d+(?:st|nd|rd|th)\b/gi,
            "",
        )
        .replace(
            /\s+/g,
            " ",
        )
        .trim();
}

export function resolveNodeTarget(
    {
        context,
        message = "",
    },
) {
    const nodes =
        Array.isArray(
            context?.nodes,
        )
            ? context.nodes
            : [];

    if (
        nodes.length === 0 ||
        typeof message !== "string"
    ) {
        return {
            status:
                "notFound",
        };
    }

    const reference =
        extractNodeReference(
            message,
        );

    if (
        !reference
    ) {
        return {
            status:
                "notFound",
        };
    }

    const normalizedReference =
        normalizeNodeTargetText(
            removeNodeOrdinal(
                reference,
            ),
        );

    if (
        !normalizedReference
    ) {
        return {
            status:
                "notFound",
        };
    }

        /*
     * --------------------------------------------------
     * Semantic target matching
     *
     * Semantic target is the strongest signal.
     *
     * Examples:
     * "Login Screen"
     * -> "login screen"
     * -> matches semanticTarget "login-screen"
     *
     * "Login button"
     * -> matches semanticTarget "login-button"
     *
     * Do this before title/locator matching so
     * "login-screen" can never accidentally resolve
     * to a "login-button" locator.
     * --------------------------------------------------
     */

    function normalizeSemanticTarget(
        value,
    ) {
        return normalizeNodeTargetText(
            value,
        )
            .replace(
                /[-_]+/g,
                " ",
            )
            .replace(
                /\s+/g,
                " ",
            )
            .trim();
    }

    const normalizedSemanticReference =
        normalizeSemanticTarget(
            normalizedReference,
        );
        console.error(
    "[AI SELECTED NODE] SEMANTIC MATCH DEBUG",
    {
        normalizedReference,
        normalizedSemanticReference,

        semanticTargets:
            nodes.map(
                (
                    node,
                ) => ({
                    id:
                        node.id,

                    title:
                        node.title,

                    rawSemanticTarget:
                        node?.details
                            ?.semanticTarget,

                    normalizedSemanticTarget:
                        normalizeSemanticTarget(
                            node?.details
                                ?.semanticTarget,
                        ),
                }),
            ),
    },
);
    const semanticCandidates =
        nodes
            .map(
                (
                    node,
                    index,
                ) => ({
                    node,
                    index,

                    semanticTarget:
                        normalizeSemanticTarget(
                            node?.details
                                ?.semanticTarget,
                        ),
                }),
            )
            .filter(
                (
                    candidate,
                ) =>
                    candidate
                        .semanticTarget ===
                    normalizedSemanticReference,
            );

    if (
        semanticCandidates.length >
        0
    ) {
        const ordinal =
            extractNodeOrdinal(
                message,
            );

        if (
            ordinal === "last"
        ) {
            const selected =
                semanticCandidates[
                    semanticCandidates.length -
                        1
                ];

            return {
                status:
                    "resolved",

                targetNodeId:
                    selected.node.id,

                candidate:
                    createTargetCandidate(
                        selected.node,
                    ),
            };
        }

        if (
            typeof ordinal ===
            "number"
        ) {
            if (
                ordinal < 0 ||
                ordinal >=
                    semanticCandidates.length
            ) {
                return {
                    status:
                        "notFound",
                };
            }

            const selected =
                semanticCandidates[
                    ordinal
                ];

            return {
                status:
                    "resolved",

                targetNodeId:
                    selected.node.id,

                candidate:
                    createTargetCandidate(
                        selected.node,
                    ),
            };
        }

        if (
            semanticCandidates.length ===
            1
        ) {
            return {
                status:
                    "resolved",

                targetNodeId:
                    semanticCandidates[0]
                        .node.id,

                candidate:
                    createTargetCandidate(
                        semanticCandidates[0]
                            .node,
                    ),
            };
        }

        return {
            status:
                "ambiguous",

            candidates:
                semanticCandidates.map(
                    (
                        candidate,
                    ) =>
                        createTargetCandidate(
                            candidate.node,
                        ),
                ),
        };
    }

    const referenceWords =
        normalizedReference
            .split(" ")
            .filter(
                (word) =>
                    word.length >= 2 &&
                    ![
                        "node",
                        "element",
                        "screen",
                        "test",
                        "flow",
                        "the",
                        "yang",
                        "ini",
                        "itu",
                    ].includes(
                        word,
                    ),
            );

    function getSemanticTarget(
        node,
    ) {
        const semanticTarget =
            node?.details
                ?.semanticTarget;

        return typeof semanticTarget ===
            "string"
            ? normalizeNodeTargetText(
                semanticTarget,
            )
            : "";
    }

    function extractLocatorNames(
        locator,
    ) {
        if (
            typeof locator !==
            "string"
        ) {
            return [];
        }

        const matches = [];

        /*
         * iOS / XPath style:
         * @name="Login"
         * @label="Login"
         * name == "Login"
         * label == "Login"
         */
        const quotedMatches =
            locator.matchAll(
                /(?:@name|@label|name|label)\s*(?:==|=)\s*["'`]([^"'`]+)["'`]/gi,
            );

        for (
            const match of
            quotedMatches
        ) {
            if (
                match[1]
            ) {
                matches.push(
                    normalizeNodeTargetText(
                        match[1],
                    ),
                );
            }
        }

        /*
         * Generic quoted values inside locator.
         *
         * This also helps accessibility/id based
         * locators without hardcoding a platform.
         */
        const quotedValues =
            locator.matchAll(
                /["'`]([^"'`]+)["'`]/g,
            );

        for (
            const match of
            quotedValues
        ) {
            if (
                match[1]
            ) {
                matches.push(
                    normalizeNodeTargetText(
                        match[1],
                    ),
                );
            }
        }

        return [
            ...new Set(
                matches.filter(
                    Boolean,
                ),
            ),
        ];
    }

    function scoreNode(
        node,
    ) {
        const title =
            normalizeNodeTargetText(
                node.title,
            );

        const subtitle =
            normalizeNodeTargetText(
                node.subtitle,
            );

        const semanticTarget =
            getSemanticTarget(
                node,
            );

        const locatorNames =
            extractLocatorNames(
                node.locator,
            );

        /*
         * Exact title is the strongest
         * human-facing signal.
         */
        if (
            title ===
            normalizedReference
        ) {
            return 100;
        }

        /*
         * Explicit semantic target.
         */
        if (
            semanticTarget ===
            normalizedReference
        ) {
            return 95;
        }

        /*
         * Exact semantic/locator name.
         *
         * Example:
         * "Login Screen"
         * -> reference word "login"
         * -> locator name "Login"
         */
        if (
            referenceWords.some(
                (
                    word,
                ) =>
                    semanticTarget ===
                        word ||
                    locatorNames.includes(
                        word,
                    ),
            )
        ) {
            return 80;
        }

        /*
         * Match all meaningful reference words
         * against title.
         */
        const titleWords =
            title.split(" ")
                .filter(Boolean);

        const titleMatches =
            referenceWords.filter(
                (
                    word,
                ) =>
                    titleWords.includes(
                        word,
                    ),
            );

        if (
            referenceWords.length > 0 &&
            titleMatches.length ===
                referenceWords.length
        ) {
            return 75;
        }

        /*
         * Match all meaningful reference words
         * against locator names.
         */
        const locatorMatches =
            referenceWords.filter(
                (
                    word,
                ) =>
                    locatorNames.some(
                        (
                            name,
                        ) =>
                            name ===
                                word ||
                            name.includes(
                                word,
                            ) ||
                            word.includes(
                                name,
                            ),
                    ),
            );

        if (
            referenceWords.length > 0 &&
            locatorMatches.length ===
                referenceWords.length
        ) {
            return 70;
        }

        /*
         * Subtitle is weaker evidence.
         */
        const subtitleWords =
            subtitle
                .split(" ")
                .filter(Boolean);

        const subtitleMatches =
            referenceWords.filter(
                (
                    word,
                ) =>
                    subtitleWords.includes(
                        word,
                    ),
            );

        if (
            referenceWords.length > 0 &&
            subtitleMatches.length ===
                referenceWords.length
        ) {
            return 40;
        }

        return 0;
    }

    const scoredCandidates =
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
        scoredCandidates.length ===
        0
    ) {
        return {
            status:
                "notFound",
        };
    }

    const bestScore =
        scoredCandidates[0]
            .score;

    let candidates =
        scoredCandidates.filter(
            (
                candidate,
            ) =>
                candidate.score ===
                bestScore,
        );

    const ordinal =
        extractNodeOrdinal(
            message,
        );

    if (
        ordinal === "last"
    ) {
        const selected =
            candidates[
                candidates.length -
                    1
            ];

        return {
            status:
                "resolved",

            targetNodeId:
                selected.node.id,

            candidate:
                createTargetCandidate(
                    selected.node,
                ),
        };
    }

    if (
        typeof ordinal ===
        "number"
    ) {
        /*
         * Ordinal applies to equally
         * strong candidates only.
         */
        if (
            ordinal < 0 ||
            ordinal >=
                candidates.length
        ) {
            return {
                status:
                    "notFound",
            };
        }

        const selected =
            candidates[
                ordinal
            ];

        return {
            status:
                "resolved",

            targetNodeId:
                selected.node.id,

            candidate:
                createTargetCandidate(
                    selected.node,
                ),
        };
    }

    if (
        candidates.length ===
        1
    ) {
        return {
            status:
                "resolved",

            targetNodeId:
                candidates[0]
                    .node.id,

            candidate:
                createTargetCandidate(
                    candidates[0]
                        .node,
                ),
        };
    }

    return {
        status:
            "ambiguous",

        candidates:
            candidates.map(
                (
                    candidate,
                ) =>
                    createTargetCandidate(
                        candidate.node,
                    ),
            ),
    };
}

export function findAmbiguousModificationTargets({
    context,
    message = "",
}) {
    const nodes =
        Array.isArray(
            context?.nodes,
        )
            ? context.nodes
            : [];

    if (
        nodes.length === 0 ||
        typeof message !==
            "string"
    ) {
        return [];
    }

    const normalizedMessage =
        message
            .toLowerCase()
            .trim();

    /*
     * --------------------------------------------------
     * Explicit ordinal references are already
     * deterministic.
     *
     * Examples:
     * "Login pertama"
     * "Login kedua"
     * "Login terakhir"
     * --------------------------------------------------
     */

    const hasOrdinalReference =
        /\b(pertama|kedua|ketiga|keempat|kelima|terakhir|first|second|third|fourth|fifth|last)\b/i.test(
            normalizedMessage,
        ) ||
        /\bke[-\s]?\d+\b/i.test(
            normalizedMessage,
        ) ||
        /\b\d+(?:st|nd|rd|th)\b/i.test(
            normalizedMessage,
        );

    if (
        hasOrdinalReference
    ) {
        return [];
    }

    /*
     * --------------------------------------------------
     * Build searchable node values.
     *
     * Keep this aligned with the main target
     * resolver:
     *
     * title
     * action
     * locator
     * details.elementName
     * details.text
     * details.value
     * --------------------------------------------------
     */

    function getSearchValues(
        node,
    ) {
        const values = [];

        if (
            typeof node?.title ===
            "string"
        ) {
            values.push(
                node.title,
            );
        }

        if (
            typeof node?.action ===
            "string"
        ) {
            values.push(
                node.action,
            );
        }

        if (
            typeof node?.locator ===
            "string"
        ) {
            values.push(
                node.locator,
            );
        }

        if (
            node?.details &&
            typeof node.details ===
                "object"
        ) {
            for (
                const [
                    key,
                    value,
                ] of Object.entries(
                    node.details,
                )
            ) {
                if (
                    typeof value ===
                    "string"
                ) {
                    values.push(
                        value,
                    );

                    if (
                        key ===
                            "elementName" ||
                        key ===
                            "text" ||
                        key ===
                            "value"
                    ) {
                        values.push(
                            value,
                        );
                    }
                }
            }
        }

        return values
            .map(
                (value) =>
                    value
                        .toLowerCase()
                        .trim(),
            )
            .filter(Boolean);
    }

    /*
     * --------------------------------------------------
     * Extract a likely human-readable target
     * from the request.
     *
     * Example:
     *
     * "Tambahkan wait sebelum Login"
     *
     * target = "login"
     * --------------------------------------------------
     */

    const referenceMatch =
        normalizedMessage.match(
            /(?:sebelum|before|setelah|after|hapus|delete|remove|ubah|update|edit|modify)\s+(?:node\s+)?(.+?)(?:\s+(?:setelah|after|sebelum|before)\s+.+)?$/i,
        );

    let reference =
        referenceMatch?.[1] ??
        "";

    reference =
        reference
            .replace(
                /^(tambahkan|tambah|add|insert|masukkan|buat|create)\s+/i,
                "",
            )
            .replace(
                /^(wait|delay)\s+/i,
                "",
            )
            .trim();

    if (
        !reference
    ) {
        return [];
    }

    /*
     * Remove trailing operation words that are
     * not part of the node reference.
     */
    reference =
        reference
            .replace(
                /\s+(setelah|after|sebelum|before)\s+.+$/i,
                "",
            )
            .trim();

    if (
        !reference
    ) {
        return [];
    }

    /*
     * --------------------------------------------------
     * Find candidate nodes.
     * --------------------------------------------------
     */

    const STOP_WORDS = new Set([
    "node",
    "element",
    "screen",
    "test",
    "flow",
    "the",
    "yang",
    "ini",
    "itu",
]);

function tokenize(
    value,
) {
    return normalizeNodeTargetText(
        value,
    )
        .split(" ")
        .filter(
            (word) =>
                word.length >= 2 &&
                !STOP_WORDS.has(
                    word,
                ),
        );
}

function getSemanticTarget(
    node,
) {
    if (
        node?.details &&
        typeof node.details ===
            "object" &&
        typeof node.details
            .semanticTarget ===
            "string"
    ) {
        return normalizeNodeTargetText(
            node.details.semanticTarget,
        );
    }

    return "";
}

function scoreNode(
    node,
    reference,
) {
    const normalizedReference =
        normalizeNodeTargetText(
            reference,
        );

    const referenceWords =
        tokenize(
            normalizedReference,
        );

    const title =
        normalizeNodeTargetText(
            node.title,
        );

    const locator =
        normalizeNodeTargetText(
            node.locator,
        );

    const semanticTarget =
        getSemanticTarget(
            node,
        );

    const scores = [];

    if (
        semanticTarget ===
        normalizedReference
    ) {
        scores.push(
            100,
        );
    }

    if (
        referenceWords.some(
            (
                word,
            ) =>
                semanticTarget
                    .split(" ")
                    .includes(
                        word,
                    ),
        )
    ) {
        scores.push(
            95,
        );
    }

    if (
        title ===
        normalizedReference
    ) {
        scores.push(
            90,
        );
    }

    if (
        locator ===
        normalizedReference
    ) {
        scores.push(
            85,
        );
    }

    const titleWords =
        tokenize(
            title,
        );

    const titleMatches =
        referenceWords.filter(
            (
                word,
            ) =>
                titleWords.includes(
                    word,
                ),
        ).length;

    if (
        referenceWords.length > 0 &&
        titleMatches ===
            referenceWords.length
    ) {
        scores.push(
            80,
        );
    }

    const locatorWords =
        tokenize(
            locator,
        );

    const locatorMatches =
        referenceWords.filter(
            (
                word,
            ) =>
                locatorWords.some(
                    (
                        locatorWord,
                    ) =>
                        locatorWord.includes(
                            word,
                        ),
                ),
        ).length;

    if (
        referenceWords.length > 0 &&
        locatorMatches ===
            referenceWords.length
    ) {
        scores.push(
            70,
        );
    }

    if (
        referenceWords.some(
            (
                word,
            ) =>
                semanticTarget.includes(
                    word,
                ),
        )
    ) {
        scores.push(
            65,
        );
    }

    return (
        scores.length > 0
            ? Math.max(
                ...scores,
            )
            : 0
    );
}

console.error(
    "[AI NODE RESOLUTION] SCORED",
    scoredCandidates.map(
        (
            candidate,
        ) => ({
            id:
                candidate.node.id,

            title:
                candidate.node.title,

            locator:
                candidate.node.locator,

            score:
                candidate.score,
        }),
    ),
);

const scoredCandidates =
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
                        node,
                        reference,
                    )
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
                a,
                b,
            ) =>
                b.score -
                a.score,
        );

        console.error(
    "[AI SELECTED NODE] SCORES",
    nodes.map(
        (
            node,
        ) => ({
            id:
                node.id,

            title:
                node.title,

            locator:
                node.locator,

            semanticTarget:
                node.details?.semanticTarget,

            score:
                scoreNode(
                    node,
                ),
        }),
    ),
);

if (
    scoredCandidates.length ===
    0
) {
    return {
        status:
            "notFound",
    };
}

const bestScore =
    scoredCandidates[0].score;

const candidates =
    scoredCandidates.filter(
        (
            candidate,
        ) =>
            candidate.score ===
            bestScore,
    );

    /*
     * --------------------------------------------------
     * Only ambiguity with multiple candidates
     * matters.
     * --------------------------------------------------
     */

    if (
        candidates.length <=
        1
    ) {
        return [];
    }

    return candidates.map(
    (
        candidate,
    ) => ({
        nodeId:
            candidate.node.id,

        title:
            candidate.node.title ??
            null,

        action:
            candidate.node.action ??
            null,

        subtitle:
            candidate.node.subtitle ??
            null,
    }),
);
}

export function resolveModificationTarget({
    operation,
    context,
    message = "",
}) {

    if (
        !operation ||
        typeof operation !==
            "object"
    ) {
        return null;
    }

    const nodes =
        Array.isArray(
            context?.nodes,
        )
            ? context.nodes
            : [];

    const edges =
        Array.isArray(
            context?.edges,
        )
            ? context.edges
            : [];

    if (
        nodes.length ===
        0
    ) {
        return null;
    }

    const normalizedMessage =
        typeof message ===
        "string"
            ? message
                .toLowerCase()
                .trim()
            : "";

    const selectedNodeId =
        typeof context?.selectedNodeId ===
            "string" &&
        context.selectedNodeId.trim()
            ? context.selectedNodeId
            : null;

    /*
     * --------------------------------------------------
     * Helpers
     * --------------------------------------------------
     */

    function normalizeReference(
        value,
    ) {
        if (
            typeof value !==
            "string"
        ) {
            return "";
        }

        return value
            .toLowerCase()
            .trim()
            .replace(
                /\s+/g,
                " ",
            );
    }

    function getNodeById(
        nodeId,
    ) {
        if (
            typeof nodeId !==
            "string"
        ) {
            return null;
        }

        return (
            nodes.find(
                (node) =>
                    node?.id ===
                    nodeId,
            ) ?? null
        );
    }

    function getNodeSearchValues(
        node,
    ) {
        const values = [];

        if (
            typeof node?.title ===
            "string"
        ) {
            values.push(
                node.title,
            );
        }

        if (
            typeof node?.action ===
            "string"
        ) {
            values.push(
                node.action,
            );
        }

        if (
            typeof node?.locator ===
            "string"
        ) {
            values.push(
                node.locator,
            );
        }

        if (
            node?.details &&
            typeof node.details ===
                "object"
        ) {
            for (
                const [
                    key,
                    value,
                ] of Object.entries(
                    node.details,
                )
            ) {
                if (
                    typeof value ===
                    "string"
                ) {
                    values.push(
                        value,
                    );

                    if (
                        key ===
                            "elementName" ||
                        key ===
                            "text" ||
                        key ===
                            "value"
                    ) {
                        values.push(
                            value,
                        );
                    }
                }
            }
        }

        return values
            .map(
                normalizeReference,
            )
            .filter(Boolean);
    }

    function findNodesByReference(
        reference,
    ) {
        const normalizedReference =
            normalizeReference(
                reference,
            );

        if (
            !normalizedReference
        ) {
            return [];
        }

        const searchTerms = [
            normalizedReference,
        ];

        if (
            normalizedReference.endsWith(
                " action",
            )
        ) {
            searchTerms.push(
                normalizedReference
                    .replace(
                        / action$/,
                        "",
                    )
                    .trim(),
            );
        }

        return nodes.filter(
            (node) => {
                const values =
                    getNodeSearchValues(
                        node,
                    );

                return values.some(
                    (value) =>
                        searchTerms.some(
                            (term) =>
                                value ===
                                    term ||
                                value.includes(
                                    term,
                                ) ||
                                term.includes(
                                    value,
                                ),
                        ),
                );
            },
        );
    }

    function extractOrdinal(
        text,
    ) {
        const normalized =
            normalizeReference(
                text,
            );

        const ordinalPatterns = [
            {
                pattern:
                    /\bpertama\b/,
                value: 1,
            },
            {
                pattern:
                    /\bkedua\b/,
                value: 2,
            },
            {
                pattern:
                    /\bketiga\b/,
                value: 3,
            },
            {
                pattern:
                    /\bkeempat\b/,
                value: 4,
            },
            {
                pattern:
                    /\bkelima\b/,
                value: 5,
            },
            {
                pattern:
                    /\bpertama\b/,
                value: 1,
            },
        ];

        for (
            const item of
            ordinalPatterns
        ) {
            if (
                item.pattern.test(
                    normalized,
                )
            ) {
                return item.value;
            }
        }

        const numericMatch =
            normalized.match(
                /\bke[-\s]?(\d+)\b/,
            );

        if (
            numericMatch
        ) {
            return Number(
                numericMatch[1],
            );
        }

        const numericSuffixMatch =
            normalized.match(
                /\b(\d+)(?:st|nd|rd|th)\b/,
            );

        if (
            numericSuffixMatch
        ) {
            return Number(
                numericSuffixMatch[1],
            );
        }

        return null;
    }

    function extractReferenceCore(
        reference,
    ) {
        return normalizeReference(
            reference
                .replace(
                    /\bpertama\b/gi,
                    "",
                )
                .replace(
                    /\bkedua\b/gi,
                    "",
                )
                .replace(
                    /\bketiga\b/gi,
                    "",
                )
                .replace(
                    /\bkeempat\b/gi,
                    "",
                )
                .replace(
                    /\bkelima\b/gi,
                    "",
                )
                .replace(
                    /\bke[-\s]?\d+\b/gi,
                    "",
                )
                .replace(
                    /\b\d+(?:st|nd|rd|th)\b/gi,
                    "",
                ),
        );
    }

    function extractPositionQualifier() {
        if (
            /\bterakhir\b/i.test(
                normalizedMessage,
            ) ||
            /\blast\b/i.test(
                normalizedMessage,
            ) ||
            /\blast\s+one\b/i.test(
                normalizedMessage,
            )
        ) {
            return "last";
        }

        const ordinal =
            extractOrdinal(
                normalizedMessage,
            );

        if (
            ordinal !== null
        ) {
            return ordinal;
        }

        return null;
    }

    function stripPositionQualifier(
        reference,
    ) {
        return normalizeReference(
            reference
                .replace(
                    /\bterakhir\b/gi,
                    "",
                )
                .replace(
                    /\blast\b/gi,
                    "",
                )
                .replace(
                    /\blast\s+one\b/gi,
                    "",
                )
                .replace(
                    /\bpertama\b/gi,
                    "",
                )
                .replace(
                    /\bkedua\b/gi,
                    "",
                )
                .replace(
                    /\bketiga\b/gi,
                    "",
                )
                .replace(
                    /\bkeempat\b/gi,
                    "",
                )
                .replace(
                    /\bkelima\b/gi,
                    "",
                )
                .replace(
                    /\bke[-\s]?\d+\b/gi,
                    "",
                )
                .replace(
                    /\b\d+(?:st|nd|rd|th)\b/gi,
                    "",
                ),
        );
    }

    function extractExplicitNodeReference() {
        const patterns = [
            /(?:sebelum|before)\s+(?:node\s+)?(.+?)(?:\.|,|$)/i,

            /(?:setelah|after)\s+(?:node\s+)?(.+?)(?:\.|,|$)/i,

            /(?:hapus|delete|remove)\s+(?:node\s+)?(.+?)(?:\.|,|$)/i,

            /(?:ubah|update|edit|modify)\s+(?:node\s+)?(.+?)\s+(?:menjadi|to)\b/i,
        ];

        for (
            const pattern of
            patterns
        ) {
            const match =
                normalizedMessage.match(
                    pattern,
                );

            if (
                match?.[1]
            ) {
                return normalizeReference(
                    match[1]
                        .replace(
                            /^(the|node)\s+/i,
                            "",
                        )
                        .trim(),
                );
            }
        }

        return null;
    }

    function getNextNodeIds(
        nodeId,
    ) {
        return edges
            .filter(
                (edge) =>
                    edge?.source ===
                    nodeId,
            )
            .map(
                (edge) =>
                    edge.target,
            );
    }

    function getPreviousNodeIds(
        nodeId,
    ) {
        return edges
            .filter(
                (edge) =>
                    edge?.target ===
                    nodeId,
            )
            .map(
                (edge) =>
                    edge.source,
            );
    }

    function findFirstNextNode(
        nodeId,
    ) {
        const nextIds =
            getNextNodeIds(
                nodeId,
            );

        if (
            nextIds.length ===
            0
        ) {
            return null;
        }

        return (
            getNodeById(
                nextIds[0],
            ) ?? null
        );
    }

    function findFirstPreviousNode(
        nodeId,
    ) {
        const previousIds =
            getPreviousNodeIds(
                nodeId,
            );

        if (
            previousIds.length ===
            0
        ) {
            return null;
        }

        return (
            getNodeById(
                previousIds[0],
            ) ?? null
        );
    }

    function containsAny(
        values,
    ) {
        return values.some(
            (value) =>
                normalizedMessage.includes(
                    value,
                ),
        );
    }

    function mentionsSelectedNode() {
        return containsAny([
            "node yang dipilih",
            "selected node",
            "node terpilih",
        ]);
    }

    function mentionsAfter() {
        return containsAny([
            " setelah ",
            " after ",
            " sesudah ",
            " kemudian ",
        ]);
    }

    function mentionsBefore() {
        return containsAny([
            " sebelum ",
            " before ",
            " sebelumnya ",
        ]);
    }

    function mentionsAssertion() {
        return containsAny([
            "assertion",
            "assert",
        ]);
    }

    function findRelativeNode(
        anchorNodeId,
        direction,
        expectedAction = null,
    ) {
        const visited =
            new Set();

        const queue = [
            anchorNodeId,
        ];

        while (
            queue.length >
            0
        ) {
            const currentId =
                queue.shift();

            if (
                !currentId ||
                visited.has(
                    currentId,
                )
            ) {
                continue;
            }

            visited.add(
                currentId,
            );

            const relatedIds =
                direction ===
                "after"
                    ? getNextNodeIds(
                        currentId,
                    )
                    : getPreviousNodeIds(
                        currentId,
                    );

            for (
                const relatedId of
                relatedIds
            ) {
                const relatedNode =
                    getNodeById(
                        relatedId,
                    );

                if (
                    relatedNode &&
                    (
                        !expectedAction ||
                        relatedNode.action ===
                            expectedAction
                    )
                ) {
                    return relatedNode;
                }

                queue.push(
                    relatedId,
                );
            }
        }

        return null;
    }

   /*
 * --------------------------------------------------
 * Explicit graph relation
 * --------------------------------------------------
 *
 * Examples:
 *
 * "Tambahkan wait sebelum Login setelah Get Text"
 *
 * target  = Login
 * anchor  = Get Text
 * direction = after
 *
 * "Tambahkan delay setelah Tap sebelum Assert"
 *
 * target  = Tap
 * anchor  = Assert
 * direction = before
 * --------------------------------------------------
 */

function resolveExplicitGraphRelation() {
    const patterns = [
        {
            pattern:
                /(?:sebelum|before)\s+(.+?)\s+(?:setelah|after)\s+(.+)$/i,

            direction:
                "after",
        },

        {
            pattern:
                /(?:setelah|after)\s+(.+?)\s+(?:sebelum|before)\s+(.+)$/i,

            direction:
                "before",
        },
    ];

    for (
        const relation of
        patterns
    ) {
        const match =
            normalizedMessage.match(
                relation.pattern,
            );

        if (
            !match
        ) {
            continue;
        }

        const targetReference =
            normalizeReference(
                match[1]
                    .replace(
                        /^(node|the)\s+/i,
                        "",
                    )
                    .trim(),
            );

        const anchorReference =
            normalizeReference(
                match[2]
                    .replace(
                        /^(node|the)\s+/i,
                        "",
                    )
                    .trim(),
            );

        /*
         * Remove command words that can be
         * captured by the first regex group.
         *
         * Example:
         * "Tambahkan wait sebelum Login"
         * -> "Login"
         */
        const cleanedTargetReference =
            targetReference
                .replace(
                    /^(tambahkan|add|insert|buat|create)\s+(?:wait|delay)\s+/i,
                    "",
                )
                .trim();

        const targetCandidates =
            findNodesByReference(
                cleanedTargetReference,
            );

        const anchorCandidates =
            findNodesByReference(
                anchorReference,
            );

        /*
         * The anchor must be unique.
         */
        if (
            anchorCandidates.length !==
            1
        ) {
            continue;
        }

        const anchorNode =
            anchorCandidates[0];

        const relativeNode =
            findRelativeNode(
                anchorNode.id,
                relation.direction,
            );

        if (
            !relativeNode
        ) {
            continue;
        }

        /*
         * If the relative node itself matches
         * the requested target, use it.
         */
        const relativeValues =
            getNodeSearchValues(
                relativeNode,
            );

        const targetMatchesRelative =
            relativeValues.some(
                (value) =>
                    value ===
                        cleanedTargetReference ||
                    value.includes(
                        cleanedTargetReference,
                    ) ||
                    cleanedTargetReference.includes(
                        value,
                    ),
            );

        if (
            targetMatchesRelative
        ) {
            return relativeNode.id;
        }

        /*
         * If exactly one explicit target candidate
         * exists and it is the graph-relative node,
         * use it.
         */
        if (
            targetCandidates.length ===
                1 &&
            targetCandidates[0].id ===
                relativeNode.id
        ) {
            return targetCandidates[0]
                .id;
        }
    }

    return null;
}
    /*
     * --------------------------------------------------
     * Explicit reference information
     * --------------------------------------------------
     */

    const explicitNodeReference =
        extractExplicitNodeReference();

    const positionQualifier =
        extractPositionQualifier();

    const referenceCore =
        explicitNodeReference
            ? extractReferenceCore(
                explicitNodeReference,
            )
            : null;

    const referencedNodes =
        referenceCore
            ? findNodesByReference(
                referenceCore,
            )
            : [];

    const explicitGraphRelation =
    resolveExplicitGraphRelation();

if (
    explicitGraphRelation
) {
    return explicitGraphRelation;
}

    /*
     * --------------------------------------------------
     * Relative explicit references
     * --------------------------------------------------
     *
     * Examples:
     *
     * "Login setelah Get Text"
     * "Assert setelah Get Text"
     * "Login sebelum Assert"
     * --------------------------------------------------
     */

    const afterMatch =
        normalizedMessage.match(
            /(?:after|setelah)\s+(.+?)\s+(?:before|sebelum|menjadi|to|menambah|tambahkan|ubah|update|hapus|delete|remove|$)/i,
        );

    const beforeMatch =
        normalizedMessage.match(
            /(?:before|sebelum)\s+(.+?)\s+(?:after|setelah|menjadi|to|menambah|tambahkan|ubah|update|hapus|delete|remove|$)/i,
        );

    /*
     * --------------------------------------------------
     * 1. Assertion after selected node
     * --------------------------------------------------
     */

    if (
        selectedNodeId &&
        mentionsSelectedNode() &&
        mentionsAfter() &&
        mentionsAssertion()
    ) {
        const nextNode =
            findRelativeNode(
                selectedNodeId,
                "after",
                "assert",
            );

        if (
            nextNode
        ) {
            return nextNode.id;
        }
    }

    /*
     * --------------------------------------------------
     * 2. Explicit reference with positional
     * qualifier.
     *
     * Examples:
     *
     * "Login pertama"
     * "Login kedua"
     * "Login terakhir"
     * --------------------------------------------------
     */

    if (
        referencedNodes.length >
        0
    ) {
        if (
            positionQualifier ===
            "last"
        ) {
            return referencedNodes.at(
                -1,
            )?.id ?? null;
        }

        if (
            typeof positionQualifier ===
                "number" &&
            positionQualifier >
                0
        ) {
            const index =
                positionQualifier -
                1;

            return (
                referencedNodes[
                    index
                ]?.id ?? null
            );
        }
    }

    /*
     * --------------------------------------------------
     * 3. Explicit reference with graph relation
     * --------------------------------------------------
     *
     * "Login setelah Get Text"
     * --------------------------------------------------
     */

    if (
        referenceCore &&
        referencedNodes.length ===
            0
    ) {
        const relationPatterns = [
            {
                pattern:
                    /(.+?)\s+(?:setelah|after)\s+(.+)/i,
                direction:
                    "after",
            },

            {
                pattern:
                    /(.+?)\s+(?:sebelum|before)\s+(.+)/i,
                direction:
                    "before",
            },
        ];

        for (
            const relation of
            relationPatterns
        ) {
            const match =
                normalizedMessage.match(
                    relation.pattern,
                );

            if (
                !match
            ) {
                continue;
            }

            const targetReference =
                normalizeReference(
                    match[1],
                );

            const anchorReference =
                normalizeReference(
                    match[2],
                );

            const anchorCandidates =
                findNodesByReference(
                    anchorReference,
                );

            if (
                anchorCandidates.length !==
                1
            ) {
                continue;
            }

            const targetCandidates =
                findNodesByReference(
                    targetReference,
                );

            if (
                targetCandidates.length ===
                1
            ) {
                return targetCandidates[0]
                    .id;
            }

            const relativeNode =
                findRelativeNode(
                    anchorCandidates[0]
                        .id,
                    relation.direction,
                );

            if (
                relativeNode
            ) {
                const targetValues =
                    getNodeSearchValues(
                        relativeNode,
                    );

                if (
                    targetValues.some(
                        (value) =>
                            value.includes(
                                targetReference,
                            ),
                    )
                ) {
                    return relativeNode.id;
                }
            }
        }
    }

    /*
     * --------------------------------------------------
     * 4. Explicit node reference
     * --------------------------------------------------
     *
     * Only resolve automatically when:
     *
     * - exactly one candidate exists
     * - OR a positional qualifier selected one
     *
     * If multiple candidates exist without
     * disambiguation, return null instead of
     * modifying a random node.
     * --------------------------------------------------
     */

    if (
        referencedNodes.length ===
        1
    ) {
        return referencedNodes[0].id;
    }

    if (
    referencedNodes.length >
    1
) {
    /*
     * If the AI provided an explicit target and
     * that target is one of the matching candidates,
     * trust that specific target.
     *
     * This prevents a valid AI target from being
     * discarded merely because several nodes share
     * the same human-readable reference.
     */
    if (
        typeof operation.targetNodeId ===
            "string" &&
        operation.targetNodeId.trim()
    ) {
        const explicitTarget =
            referencedNodes.find(
                (node) =>
                    node?.id ===
                    operation.targetNodeId,
            );

        if (
            explicitTarget
        ) {
            return explicitTarget.id;
        }
    }

    /*
     * Still refuse to guess when multiple candidates
     * exist and the AI did not identify one of them.
     */
    return null;
}

    /*
     * --------------------------------------------------
     * 5. Node after selected node
     * --------------------------------------------------
     */

    if (
        selectedNodeId &&
        mentionsSelectedNode() &&
        mentionsAfter()
    ) {
        const nextNode =
            findFirstNextNode(
                selectedNodeId,
            );

        if (
            nextNode
        ) {
            return nextNode.id;
        }
    }

    /*
     * --------------------------------------------------
     * 6. Node before selected node
     * --------------------------------------------------
     */

    if (
        selectedNodeId &&
        mentionsSelectedNode() &&
        mentionsBefore()
    ) {
        const previousNode =
            findFirstPreviousNode(
                selectedNodeId,
            );

        if (
            previousNode
        ) {
            return previousNode.id;
        }
    }

    /*
     * --------------------------------------------------
     * 7. Generic selected-node semantics
     * --------------------------------------------------
     */

    if (
        mentionsSelectedNode() &&
        selectedNodeId
    ) {
        if (
            operation.type ===
                "addNodeBefore" ||
            operation.type ===
                "addNodeAfter" ||
            operation.type ===
                "updateNode" ||
            operation.type ===
                "deleteNode"
        ) {
            return selectedNodeId;
        }
    }

    /*
     * --------------------------------------------------
     * 8. Explicit AI target fallback
     * --------------------------------------------------
     */

    if (
        typeof operation.targetNodeId ===
            "string" &&
        operation.targetNodeId.trim()
    ) {
        const explicitNode =
            getNodeById(
                operation.targetNodeId,
            );

        if (
            explicitNode
        ) {
            return explicitNode.id;
        }
    }

    /*
     * --------------------------------------------------
     * 9. Selected node fallback
     * --------------------------------------------------
     */

    if (
        selectedNodeId &&
        getNodeById(
            selectedNodeId,
        )
    ) {
        return selectedNodeId;
    }

    return null;
}