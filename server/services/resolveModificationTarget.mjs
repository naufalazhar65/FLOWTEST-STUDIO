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

    const candidates =
        nodes.filter(
            (node) => {
                const values =
                    getSearchValues(
                        node,
                    );

                return values.some(
                    (value) =>
                        value ===
                            reference ||
                        value.includes(
                            reference,
                        ) ||
                        reference.includes(
                            value,
                        ),
                );
            },
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
        (node) => ({
            nodeId:
                node.id,

            title:
                node.title ??
                null,

            action:
                node.action ??
                null,

            subtitle:
                node.subtitle ??
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