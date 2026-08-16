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

                    /*
                     * Some details are named
                     * elementName / text / value.
                     */
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

        /*
         * "Login action" should resolve to
         * "Login".
         */
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

    function extractExplicitNodeReference() {
        const patterns = [
            /*
             * IMPORTANT:
             * Put "before/after" patterns first,
             * because "Tambahkan wait sebelum Login"
             * must extract Login, not the whole sentence.
             */

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

    /*
     * --------------------------------------------------
     * Resolve explicit node reference
     * --------------------------------------------------
     */

    const explicitNodeReference =
        extractExplicitNodeReference();

    const referencedNodes =
        explicitNodeReference
            ? findNodesByReference(
                explicitNodeReference,
            )
            : [];

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
            findFirstNextNode(
                selectedNodeId,
            );

        if (
            nextNode?.action ===
            "assert"
        ) {
            return nextNode.id;
        }

        const visited =
            new Set();

        const queue = [
            selectedNodeId,
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

            const nextIds =
                getNextNodeIds(
                    currentId,
                );

            for (
                const nextId of
                nextIds
            ) {
                const node =
                    getNodeById(
                        nextId,
                    );

                if (
                    node?.action ===
                    "assert"
                ) {
                    return node.id;
                }

                queue.push(
                    nextId,
                );
            }
        }
    }

    /*
     * --------------------------------------------------
     * 2. Explicit node reference
     * --------------------------------------------------
     */

    if (
        referencedNodes.length >
        0
    ) {
        const referencedNode =
            referencedNodes[0];

        if (
            operation.type ===
                "addNodeBefore" ||
            operation.type ===
                "addNodeAfter"
        ) {
            return referencedNode.id;
        }

        if (
            operation.type ===
                "updateNode" ||
            operation.type ===
                "deleteNode"
        ) {
            return referencedNode.id;
        }
    }

    /*
     * --------------------------------------------------
     * 3. Node after selected node
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
     * 4. Node before selected node
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
     * 5. Generic selected-node semantics
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
     * 6. Explicit AI target fallback
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
     * 7. Selected node fallback
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