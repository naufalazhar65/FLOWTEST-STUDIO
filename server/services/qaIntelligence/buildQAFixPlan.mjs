function createAssertStep() {
    return {
        action: "assert",

        title: "Assert",

        description:
            "Verify the expected result of the previous action.",

        locatorStrategy: null,

        locator: null,

        text: null,

        duration: null,

        actual: "${actualText}",

        operator: "isNotEmpty",

        expected: "true",

        variableName: null,

        timeout: null,

        pollingInterval: null,
    };
}

function createGetTextStep() {
    return {
        action: "getText",

        title: "Get Text",

        description:
            "Read text from the target element.",

        locatorStrategy: null,

        locator: null,

        text: null,

        duration: null,

        actual: null,

        operator: null,

        expected: null,

        variableName: "actualText",

        timeout: null,

        pollingInterval: null,
    };
}

function hasLocator(
    node,
) {
    return (
        Boolean(
            node?.locatorStrategy,
        ) &&
        typeof node.locator ===
            "string" &&
        node.locator.trim()
            .length > 0
    );
}

function buildOutgoingMap(
    context,
) {
    const outgoing =
        new Map();

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

    for (
        const node of nodes
    ) {
        if (
            node?.id
        ) {
            outgoing.set(
                node.id,
                [],
            );
        }
    }

    for (
        const edge of edges
    ) {
        if (
            !edge?.source ||
            !edge?.target
        ) {
            continue;
        }

        const targets =
            outgoing.get(
                edge.source,
            );

        if (
            targets
        ) {
            targets.push(
                edge.target,
            );

            continue;
        }

        outgoing.set(
            edge.source,
            [
                edge.target,
            ],
        );
    }

    return outgoing;
}

const OBSERVABLE_ACTION_SCORES = {
    gettext: 100,

    getattribute: 95,

    getdisplayed: 90,

    elementexists: 90,

    getenabled: 85,

    getselected: 85,

    getlocation: 75,

    getsize: 75,

    getrect: 75,
};

function normalizeAction(
    action,
) {
    return String(
        action ?? "",
    )
        .trim()
        .toLowerCase();
}

function getObservableScore(
    node,
) {
    const action =
        normalizeAction(
            node?.action,
        );

    return (
        OBSERVABLE_ACTION_SCORES[
            action
        ] ?? 10
    );
}

function findSemanticValidationTarget(
    targetNodeId,
    context,
) {
    const nodes =
        Array.isArray(
            context?.nodes,
        )
            ? context.nodes
            : [];

    const nodeById =
        new Map(
            nodes
                .filter(
                    (
                        node,
                    ) =>
                        node?.id,
                )
                .map(
                    (
                        node,
                    ) => [
                        node.id,
                        node,
                    ],
                ),
        );

    const outgoing =
        buildOutgoingMap(
            context,
        );

    const candidates = [];

    const queue = [];

    const visited =
        new Set();

    const initialTargets =
        outgoing.get(
            targetNodeId,
        ) ?? [];

    for (
        const nodeId of
        initialTargets
    ) {
        queue.push({
            nodeId,

            distance: 1,
        });
    }

    while (
        queue.length >
        0
    ) {
        const current =
            queue.shift();

        if (
            !current?.nodeId ||
            visited.has(
                current.nodeId,
            )
        ) {
            continue;
        }

        visited.add(
            current.nodeId,
        );

        const node =
            nodeById.get(
                current.nodeId,
            );

        if (
            node &&
            hasLocator(
                node,
            )
        ) {
            const observableScore =
                getObservableScore(
                    node,
                );

            const score =
                observableScore -
                current.distance;

            candidates.push({
                node,

                distance:
                    current.distance,

                observableScore,

                score,
            });
        }

        const nextNodes =
            outgoing.get(
                current.nodeId,
            ) ?? [];

        for (
            const nextNodeId of
            nextNodes
        ) {
            if (
                !visited.has(
                    nextNodeId,
                )
            ) {
                queue.push({
                    nodeId:
                        nextNodeId,

                    distance:
                        current.distance +
                        1,
                });
            }
        }
    }

    if (
        candidates.length ===
        0
    ) {
        return {
            node: null,

            ambiguous: false,
        };
    }

    candidates.sort(
        (
            a,
            b,
        ) => {
            if (
                b.score !==
                a.score
            ) {
                return (
                    b.score -
                    a.score
                );
            }

            if (
                b.observableScore !==
                a.observableScore
            ) {
                return (
                    b.observableScore -
                    a.observableScore
                );
            }

            return (
                a.distance -
                b.distance
            );
        },
    );

    const best =
        candidates[0];

    const second =
        candidates[1];

    if (
        second &&
        best.score ===
            second.score &&
        best.observableScore ===
            second.observableScore &&
        best.distance ===
            second.distance
    ) {
        return {
            node: null,

            ambiguous: true,

            candidates:
                candidates.slice(
                    0,
                    5,
                ),
        };
    }

    return {
        node:
            best.node,

        ambiguous:
            false,
    };
}

function resolveValidationLocatorNode(
    targetNode,
    context,
) {
    if (
        hasLocator(
            targetNode,
        )
    ) {
        return {
            node:
                targetNode,

            ambiguous:
                false,
        };
    }

    return findSemanticValidationTarget(
        targetNode.id,
        context,
    );
}

export function buildQAFixPlan(
    recommendation,
    context,
) {
    if (
        !recommendation ||
        typeof recommendation !==
            "object"
    ) {
        return null;
    }

    if (
        !context ||
        typeof context !==
            "object"
    ) {
        return null;
    }

    const targetNodeId =
        recommendation
            .suggestedFix
            ?.targetNodeId ??
        recommendation.nodeId ??
        null;

    if (!targetNodeId) {
        return null;
    }

    const targetNode =
        Array.isArray(
            context.nodes,
        )
            ? context.nodes.find(
                  (
                      node,
                  ) =>
                      node?.id ===
                      targetNodeId,
              )
            : null;

    if (!targetNode) {
        return null;
    }

    const fixType =
        recommendation
            .suggestedFix
            ?.type;

    if (
        fixType ===
        "addValidation"
    ) {
        const validationTarget =
            resolveValidationLocatorNode(
                targetNode,
                context,
            );

        if (
            validationTarget.ambiguous
        ) {
            return null;
        }

        const locatorNode =
            validationTarget.node;

        if (
            !locatorNode
        ) {
            return null;
        }

        const getTextStep =
            createGetTextStep();

        const assertStep =
            createAssertStep();

        getTextStep.locatorStrategy =
            locatorNode.locatorStrategy;

        getTextStep.locator =
            locatorNode.locator;

        return {
            type:
                "modification_plan",

            summary:
                "Add validation after the target action.",

            operations: [
                {
                    type:
                        "addNodeAfter",

                    targetNodeId,

                    resultId:
                        "validationText",

                    step:
                        getTextStep,
                },

                {
                    type:
                        "addNodeAfter",

                    targetNodeId:
                        "$validationText",

                    step:
                        assertStep,
                },
            ],

            warnings:
                locatorNode.id !==
                targetNode.id
                    ? [
                        `The target node does not have a locator. Validation will use the nearest semantically observable downstream node "${locatorNode.title ?? locatorNode.action}" as the observable target.`,
                    ]
                    : [],
        };
    }

        if (
            fixType ===
                "repairLocator" ||
            fixType ===
                "fixLocator"
        ) {
        const suggestedLocator =
            recommendation
                .suggestedFix
                ?.suggestedLocator;

        const suggestedLocatorStrategy =
            recommendation
                .suggestedFix
                ?.locatorStrategy ??
            targetNode.locatorStrategy ??
            null;

        if (
            !suggestedLocator ||
            !suggestedLocatorStrategy
        ) {
            return null;
        }

        return {
            type:
                "modification_plan",

            summary:
                "Repair the failed node locator using evidence from the active UI.",

            operation: {
                type:
                    "updateNode",

                targetNodeId,

                step: {
                    action:
                        targetNode.action ??
                        "tap",

                    title:
                        targetNode.title ??
                        "Repair Locator",

                    description:
                        targetNode.subtitle ??
                        "Replace the failed locator with a locator found from the active UI.",

                    locatorStrategy:
                        suggestedLocatorStrategy,

                    locator:
                        suggestedLocator,

                    text: null,

                    duration: null,

                    actual: null,

                    operator: null,

                    expected: null,

                    variableName: null,

                    timeout: null,

                    pollingInterval: null,
                },
            },

            warnings: [
                "The locator replacement is based on the active page source. Review the suggested locator before applying the modification.",
            ],
        };
    }

    if (
        fixType ===
        "reviewLocator"
    ) {
        return {
            type:
                "modification_plan",

            summary:
                "Review the locator used by the target node.",

            operation: {
                type:
                    "updateNode",

                targetNodeId,

                step: {
                    action:
                        targetNode.action ??
                        "tap",

                    title:
                        targetNode.title ??
                        "Update Locator",

                    description:
                        targetNode.subtitle ??
                        "Review locator stability.",

                    locatorStrategy:
                        targetNode.locatorStrategy ??
                        null,

                    locator:
                        targetNode.locator ??
                        null,

                    text: null,

                    duration: null,

                    actual: null,

                    operator: null,

                    expected: null,

                    variableName: null,

                    timeout: null,

                    pollingInterval: null,
                },
            },

            warnings: [
                "Locator review requires a stable replacement locator before applying the modification.",
            ],
        };
    }

    return null;
}