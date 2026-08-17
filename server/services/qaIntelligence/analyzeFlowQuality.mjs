/**
 * Deterministic QA quality analyzer.
 *
 * The analyzer evaluates the current FlowTest Studio
 * graph without calling an LLM.
 */

/**
 * @typedef {Object} QAFlowFinding
 * @property {"info"|"warning"|"error"} severity
 * @property {"assertion"|"locator"|"timing"|"flow"} category
 * @property {string|null} nodeId
 * @property {string} title
 * @property {string} message
 * @property {string} recommendation
 */

/**
 * @typedef {Object} QAFlowAnalysis
 * @property {QAFlowFinding[]} findings
 * @property {number} score
 * @property {number} nodeCount
 * @property {number} edgeCount
 * @property {number} assertionCoverage
 * @property {number} locatorCoverage
 * @property {number} validationCoverage
 */

function normalizeText(
    value,
) {
    return typeof value ===
        "string"
        ? value
            .trim()
            .toLowerCase()
        : "";
}

function getOutgoingNodes(
    nodeId,
    nodes,
    edges,
) {
    const nextIds =
        edges
            .filter(
                (edge) =>
                    edge?.source ===
                    nodeId,
            )
            .map(
                (edge) =>
                    edge?.target,
            );

    return nextIds
        .map(
            (id) =>
                nodes.find(
                    (node) =>
                        node?.id ===
                        id,
                ),
        )
        .filter(Boolean);
}

function getIncomingNodes(
    nodeId,
    nodes,
    edges,
) {
    const previousIds =
        edges
            .filter(
                (edge) =>
                    edge?.target ===
                    nodeId,
            )
            .map(
                (edge) =>
                    edge?.source,
            );

    return previousIds
        .map(
            (id) =>
                nodes.find(
                    (node) =>
                        node?.id ===
                        id,
                ),
        )
        .filter(Boolean);
}

function isLocatorBasedAction(
    action,
) {
    return [
        "tap",
        "input",
        "wait",
        "getText",
        "elementExists",
        "getAttribute",
        "getDisplayed",
        "getEnabled",
        "getSelected",
        "getLocation",
        "getSize",
        "getRect",
    ].includes(
        action,
    );
}

function isValidationAction(
    action,
) {
    return [
        "assert",
        "getText",
        "getDisplayed",
        "getEnabled",
        "getSelected",
        "elementExists",
        "getAttribute",
        "getLocation",
        "getSize",
        "getRect",
    ].includes(
        action,
    );
}

function isOutcomeAction(
    action,
) {
    return [
        "tap",
        "pressReturn",
        "back",
        "home",
        "closeApp",
        "launchApp",
    ].includes(
        action,
    );
}

function isTerminalValidationAction(
    node,
) {
    return [
        "assert",
        "getText",
        "getDisplayed",
        "getEnabled",
        "getSelected",
        "elementExists",
        "getAttribute",
        "getLocation",
        "getSize",
        "getRect",
    ].includes(
        node?.action,
    );
}

function addFinding(
    findings,
    finding,
) {
    findings.push({
        severity:
            finding.severity,

        category:
            finding.category,

        nodeId:
            finding.nodeId ??
            null,

        title:
            finding.title,

        message:
            finding.message,

        recommendation:
            finding.recommendation,
    });
}

/**
 * Find whether an action reaches a validation step
 * within a short forward path.
 *
 * This intentionally looks beyond the immediate next node.
 *
 * Example:
 *
 * Tap
 *   ↓
 * Get Text
 *   ↓
 * Assert
 *
 * is considered validated.
 */
function reachesValidation(
    node,
    nodes,
    edges,
    maxDepth = 4,
) {
    const visited =
        new Set();

    function visit(
        currentNode,
        depth,
    ) {
        if (
            !currentNode ||
            depth >
                maxDepth
        ) {
            return false;
        }

        if (
            depth > 0 &&
            isValidationAction(
                currentNode.action,
            )
        ) {
            return true;
        }

        if (
            visited.has(
                currentNode.id,
            )
        ) {
            return false;
        }

        visited.add(
            currentNode.id,
        );

        const nextNodes =
            getOutgoingNodes(
                currentNode.id,
                nodes,
                edges,
            );

        return nextNodes.some(
            (nextNode) =>
                visit(
                    nextNode,
                    depth + 1,
                ),
        );
    }

    return visit(
        node,
        0,
    );
}

function countReachableValidatedActions(
    nodes,
    edges,
) {
    const relevantNodes =
        nodes.filter(
            (node) =>
                isOutcomeAction(
                    node?.action,
                ),
        );

    if (
        relevantNodes.length ===
        0
    ) {
        return {
            total: 0,
            validated: 0,
        };
    }

    const validated =
        relevantNodes.filter(
            (node) =>
                reachesValidation(
                    node,
                    nodes,
                    edges,
                ),
        );

    return {
        total:
            relevantNodes.length,

        validated:
            validated.length,
    };
}

function findFlowStarts(
    nodes,
    edges,
) {
    const incomingIds =
        new Set(
            edges.map(
                (edge) =>
                    edge?.target,
            ),
        );

    return nodes.filter(
        (node) =>
            !incomingIds.has(
                node?.id,
            ),
    );
}

function findFlowTerminals(
    nodes,
    edges,
) {
    const outgoingIds =
        new Set(
            edges.map(
                (edge) =>
                    edge?.source,
            ),
        );

    return nodes.filter(
        (node) =>
            !outgoingIds.has(
                node?.id,
            ),
    );
}

function calculateScore({
    assertionCoverage,
    locatorCoverage,
    findings,
}) {
    /*
     * --------------------------------------------------
     * Base quality components
     * --------------------------------------------------
     */

    const assertionScore =
        assertionCoverage * 0.35;

    const locatorScore =
        locatorCoverage * 0.30;

    /*
     * Flow structure starts at 100 and only loses
     * points for structural findings.
     */
    const flowFindings =
        findings.filter(
            (finding) =>
                finding.category ===
                "flow",
        );

    let flowScore =
        100;

    for (
        const finding of flowFindings
    ) {
        if (
            finding.severity ===
            "warning"
        ) {
            flowScore -= 10;
        } else if (
            finding.severity ===
            "info"
        ) {
            flowScore -= 2;
        }
    }

    flowScore =
        Math.max(
            0,
            flowScore,
        );

    const structureScore =
        flowScore * 0.20;

    /*
     * Timing quality.
     */
    const timingFindings =
        findings.filter(
            (finding) =>
                finding.category ===
                "timing",
        );

    let timingScore =
        100;

    for (
        const finding of timingFindings
    ) {
        if (
            finding.severity ===
            "warning"
        ) {
            timingScore -= 20;
        } else if (
            finding.severity ===
            "info"
        ) {
            timingScore -= 5;
        }
    }

    timingScore =
        Math.max(
            0,
            timingScore,
        );

    const timingComponent =
        timingScore * 0.15;

    /*
     * --------------------------------------------------
     * Final weighted score
     * --------------------------------------------------
     */

    const score =
        assertionScore +
        locatorScore +
        structureScore +
        timingComponent;

    /*
     * Errors are a hard quality concern.
     * Apply a controlled final deduction instead
     * of letting every finding destroy the score.
     */
    const errorCount =
        findings.filter(
            (finding) =>
                finding.severity ===
                "error",
        ).length;

    const finalScore =
        score -
        errorCount * 10;

    return Math.round(
        Math.max(
            0,
            Math.min(
                100,
                finalScore,
            ),
        ),
    );
}

/**
 * @param {{
 *   nodes?: Array<any>,
 *   edges?: Array<any>
 * }} context
 * @returns {QAFlowAnalysis}
 */
export function analyzeFlowQuality(
    context = {},
) {
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

    const findings = [];

    if (
        nodes.length ===
        0
    ) {
        return {
            findings: [
                {
                    severity:
                        "info",

                    category:
                        "flow",

                    nodeId:
                        null,

                    title:
                        "Empty flow",

                    message:
                        "The current flow does not contain any nodes.",

                    recommendation:
                        "Add at least one executable test step.",
                },
            ],

            score: 100,

            nodeCount: 0,

            edgeCount:
                edges.length,

            assertionCoverage:
                100,

            locatorCoverage:
                100,

            validationCoverage:
                100,
        };
    }

    /*
     * --------------------------------------------------
     * 1. Assertion / validation coverage
     * --------------------------------------------------
     */

    const stateChangingNodes =
        nodes.filter(
            (node) =>
                    isOutcomeAction(
                    node?.action,
                ),
        );

    const validationResult =
        countReachableValidatedActions(
            nodes,
            edges,
        );

    const validationCoverage =
        validationResult.total >
        0
            ? Math.round(
                (
                    validationResult.validated /
                    validationResult.total
                ) *
                    100,
            )
            : 100;

    const assertCount =
        nodes.filter(
            (node) =>
                node?.action ===
                "assert",
        ).length;

    const assertionCoverage =
        stateChangingNodes.length >
        0
            ? Math.round(
                (
                    stateChangingNodes.filter(
                        (node) =>
                            reachesValidation(
                                node,
                                nodes,
                                edges,
                            ),
                    ).length /
                    stateChangingNodes.length
                ) *
                    100,
            )
            : 100;

    /*
     * Only warn when the action genuinely has
     * no validation path.
     */
    for (
        const node of stateChangingNodes
    ) {
        if (
            reachesValidation(
                node,
                nodes,
                edges,
            )
        ) {
            continue;
        }

        /*
         * Do not strongly penalize generic navigation
         * and setup steps.
         *
         * Launch/close/back/home are contextual.
         */
        const severity =
            [
                "tap",
                "input",
            ].includes(
                node.action,
            )
                ? "warning"
                : "info";

        addFinding(
    findings,
    {
        severity,

        category:
            "assertion",

        nodeId:
            node.id,

        action:
            node.action,

        title:
            "Missing assertion",

        message:
            `"${node.title ?? node.action}" does not lead to a validation step within the expected flow path.`,

        recommendation:
            "Consider validating the observable result of the relevant user action.",
    },
);
    }

    /*
     * Explicitly report flows without any assertions
     * only when they also lack another validation action.
     */
    const validationNodes =
        nodes.filter(
            (node) =>
                isValidationAction(
                    node?.action,
                ),
        );

    if (
        assertCount === 0 &&
        validationNodes.length === 0
    ) {
        addFinding(
            findings,
            {
                severity:
                    "warning",

                category:
                    "assertion",

                nodeId:
                    null,

                title:
                    "No validation step",

                message:
                    "The flow contains no assertion or observable validation step.",

                recommendation:
                    "Add an assertion or another validation action that confirms the expected result.",
            },
        );
    }

    /*
     * --------------------------------------------------
     * 2. Locator completeness
     * --------------------------------------------------
     */

    const locatorNodes =
        nodes.filter(
            (node) =>
                isLocatorBasedAction(
                    node?.action,
                ),
        );

    const completeLocatorNodes =
        locatorNodes.filter(
            (node) =>
                typeof node?.locator ===
                    "string" &&
                node.locator.trim() &&
                typeof node?.locatorStrategy ===
                    "string" &&
                node.locatorStrategy.trim(),
        );

    const locatorCoverage =
        locatorNodes.length >
        0
            ? Math.round(
                (
                    completeLocatorNodes.length /
                    locatorNodes.length
                ) *
                    100,
            )
            : 100;

    for (
        const node of locatorNodes
    ) {
        const hasLocator =
            typeof node?.locator ===
                "string" &&
            node.locator.trim() !== "";

        const hasStrategy =
            typeof node?.locatorStrategy ===
                "string" &&
            node.locatorStrategy.trim() !== "";

        if (
            hasLocator &&
            hasStrategy
        ) {
            continue;
        }

        addFinding(
            findings,
            {
                severity:
                    "error",

                category:
                    "locator",

                nodeId:
                    node.id,

                title:
                    "Incomplete locator",

                message:
                    `"${node.title ?? node.action}" does not have complete locator data.`,

                recommendation:
                    "Configure both locator strategy and locator before executing this node.",
            },
        );
    }

    /*
     * --------------------------------------------------
     * 3. Locator stability
     * --------------------------------------------------
     */

    for (
        const node of locatorNodes
    ) {
        if (
            normalizeText(
                node?.locatorStrategy,
            ) !==
            "xpath"
        ) {
            continue;
        }

        const locator =
            normalizeText(
                node?.locator,
            );

        /*
         * XPath itself is not automatically an error.
         * Escalate only when it appears structurally
         * fragile.
         */
        const looksFragile =
            locator.includes(
                "following-sibling",
            ) ||
            locator.includes(
                "preceding-sibling",
            ) ||
            locator.includes(
                "/..",
            ) ||
            (
                (
                    locator.match(
                        /\//g,
                    ) ?? []
                ).length >=
                5
            );

        addFinding(
            findings,
            {
                severity:
                    looksFragile
                        ? "warning"
                        : "info",

                category:
                    "locator",

                nodeId:
                    node.id,

                title:
                    looksFragile
                        ? "Potentially fragile XPath"
                        : "XPath locator",

                message:
                    looksFragile
                        ? `"${node.title ?? node.action}" uses a structurally complex XPath that may be sensitive to UI hierarchy changes.`
                        : `"${node.title ?? node.action}" uses XPath.`,

                recommendation:
                    looksFragile
                        ? "Prefer a stable accessibility identifier, resource ID, predicate, or class-chain when available."
                        : "Verify that the XPath remains stable on the target device.",
            },
        );
    }

    /*
     * --------------------------------------------------
     * 4. Duplicate locators
     * --------------------------------------------------
     */

    const locatorMap =
        new Map();

    for (
        const node of locatorNodes
    ) {
        const strategy =
            normalizeText(
                node?.locatorStrategy,
            );

        const locator =
            normalizeText(
                node?.locator,
            );

        if (
            !strategy ||
            !locator
        ) {
            continue;
        }

        const key =
            `${strategy}::${locator}`;

        const matching =
            locatorMap.get(
                key,
            ) ?? [];

        matching.push(
            node,
        );

        locatorMap.set(
            key,
            matching,
        );
    }

    for (
        const [
            ,
            matchingNodes,
        ] of locatorMap
    ) {
        if (
            matchingNodes.length <
            2
        ) {
            continue;
        }

        const actions =
    matchingNodes.map(
        (node) =>
            node?.action,
    );

            const hasRepeatedInteractiveTarget =
                actions.filter(
                    (action) =>
                        [
                            "tap",
                            "input",
                        ].includes(
                            action,
                        ),
                ).length > 1;

            const hasMoreThanTwoUses =
                matchingNodes.length > 2;

            const duplicateIsRisky =
                hasRepeatedInteractiveTarget ||
                hasMoreThanTwoUses;

        for (
            const node of matchingNodes
        ) {
            addFinding(
                findings,
                {
                    severity:
                        duplicateIsRisky
                            ? "warning"
                            : "info",

                    category:
                        "locator",

                    nodeId:
                        node.id,

                    title:
                        "Duplicate locator",

                    message:
                        `This locator is reused by ${matchingNodes.length} nodes.`,

                    recommendation:
                        duplicateIsRisky
                            ? "Verify that each node intentionally targets the same element and that the locator is not ambiguous."
                            : "Verify that locator reuse is intentional.",
                },
            );
        }
    }

    /*
     * --------------------------------------------------
     * 5. Long fixed delays
     * --------------------------------------------------
     */

    for (
        const node of nodes
    ) {
        if (
            node?.action !==
            "delay"
        ) {
            continue;
        }

        const duration =
            Number(
                node?.details
                    ?.duration ??
                node?.duration ??
                0,
            );

        if (
            !Number.isFinite(
                duration,
            ) ||
            duration <
                3000
        ) {
            continue;
        }

        const severity =
            duration >=
            10000
                ? "warning"
                : "info";

        addFinding(
            findings,
            {
                severity,

                category:
                    "timing",

                nodeId:
                    node.id,

                title:
                    "Long fixed delay",

                message:
                    `This delay waits ${duration}ms before continuing.`,

                recommendation:
                    "Consider replacing a long fixed delay with an explicit wait for a meaningful UI condition.",
            },
        );
    }

    /*
     * --------------------------------------------------
     * 6. Flow structure
     * --------------------------------------------------
     */

    const terminalNodes =
        findFlowTerminals(
            nodes,
            edges,
        );

    const unvalidatedTerminals =
        terminalNodes.filter(
            (node) =>
                !isTerminalValidationAction(
                    node,
                ),
        );

    for (
        const node of unvalidatedTerminals
    ) {
        addFinding(
    findings,
    {
        severity:
            node?.action ===
            "tap"
                ? "warning"
                : "info",

        category:
            "flow",

        nodeId:
            node.id,

        action:
            node.action,

        title:
            "Flow ends without validation",

        message:
            `The flow ends at "${node.title ?? node.action}" without an explicit validation step.`,

        recommendation:
            "Consider ending the scenario with an assertion or another observable validation.",
    },
);
    }

    /*
     * Branching without validation is useful context,
     * but should not automatically lower the score.
     */
    const branchingNodes =
        nodes.filter(
            (node) =>
                getOutgoingNodes(
                    node.id,
                    nodes,
                    edges,
                ).length > 1,
        );

    if (
        branchingNodes.length >
        0 &&
        assertCount === 0
    ) {
        addFinding(
            findings,
            {
                severity:
                    "info",

                category:
                    "flow",

                nodeId:
                    null,

                title:
                    "Branching without assertion",

                message:
                    `The flow contains ${branchingNodes.length} branching node(s) but no assertion node.`,

                recommendation:
                    "Consider validating the outcome of each meaningful branch.",
            },
        );
    }

    /*
     * --------------------------------------------------
     * 7. Score
     * --------------------------------------------------
     */

    const score =
        calculateScore({
            assertionCoverage,
            locatorCoverage,
            validationCoverage,
            findings,
        });

    return {
        findings,

        score,

        nodeCount:
            nodes.length,

        edgeCount:
            edges.length,

        assertionCoverage,

        locatorCoverage,

        validationCoverage,
    };
}