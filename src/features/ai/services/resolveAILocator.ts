import type {
    ElementInfo,
} from "../../inspector/types/ElementInfo";

import type {
    LocatorCandidate,
} from "../../inspector/types/LocatorCandidate";

export type AILocatorResolutionStatus =
    | "resolved"
    | "ambiguous"
    | "notFound";

export interface AILocatorResolution {
    status:
    AILocatorResolutionStatus;

    target: string;

    selected:
    LocatorCandidate | null;

    candidates:
    LocatorCandidate[];

    matchedElementId:
    string | null;
}

interface ElementMatch {
    element:
    ElementInfo;

    score:
    number;

    reasons:
    string[];
}

type AILocatorElementType =
    | "input"
    | "tap"
    | "wait"
    | "generic";

function normalize(
    value:
        | string
        | undefined
        | null,
): string {
    return (
        value ??
        ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /[_-]+/g,
            " ",
        )
        .replace(
            /\s+/g,
            " ",
        );
}

function isCompatibleElement(
    element: ElementInfo,
    action: AILocatorElementType,
): boolean {
    const tagName =
        (
            element.tagName ??
            element.className ??
            ""
        )
            .trim()
            .toLowerCase();

    if (!tagName) {
        return true;
    }

    switch (action) {
        case "input":
            return (
                tagName.includes(
                    "textfield",
                ) ||
                tagName.includes(
                    "searchfield",
                ) ||
                tagName.includes(
                    "textview",
                ) ||
                tagName.includes(
                    "edittext",
                )
            );

        case "tap":
            return (
                tagName.includes(
                    "button",
                ) ||
                tagName.includes(
                    "other",
                ) ||
                tagName.includes(
                    "cell",
                ) ||
                tagName.includes(
                    "link",
                )
            );

        case "wait":
        case "generic":
        default:
            return true;
    }
}

function tokenize(
    value: string,
): string[] {
    return normalize(
        value,
    )
        .split(" ")
        .filter(Boolean);
}

function flattenElements(
    elements:
        ElementInfo[],
): ElementInfo[] {
    const result:
        ElementInfo[] =
        [];

    function visit(
        element:
            ElementInfo,
    ) {
        result.push(
            element,
        );

        for (
            const child of
            element.children
        ) {
            visit(
                child,
            );
        }
    }

    for (
        const element of
        elements
    ) {
        visit(
            element,
        );
    }

    return result;
}

function containsToken(
    field:
        | string
        | undefined,
    targetTokens:
        string[],
): boolean {
    const normalizedField =
        normalize(
            field,
        );

    if (
        !normalizedField
    ) {
        return false;
    }

    return targetTokens.every(
        (
            token,
        ) =>
            normalizedField.includes(
                token,
            ),
    );
}

function exactMatch(
    field:
        | string
        | undefined,
    target:
        string,
): boolean {
    const normalizedField =
        normalize(
            field,
        );

    return (
        normalizedField !==
        "" &&
        normalizedField ===
        normalize(
            target,
        )
    );
}

function matchesInputSemanticLabel(
    element:
        ElementInfo,
    target:
        string,
): boolean {
    const normalizedTarget =
        normalize(
            target,
        );

    const semanticLabel =
        normalize(
            element.semanticLabel,
        );

    const parentLabel =
        normalize(
            element.parentLabel,
        );

    const parentName =
        normalize(
            element.parentName,
        );

    const ownText =
        [
            element.label,
            element.name,
            element.text,
            element.value,
        ]
            .filter(
                (
                    value,
                ): value is string =>
                    typeof value ===
                    "string",
            )
            .map(
                normalize,
            )
            .filter(Boolean);

    const allLabels =
        [
            semanticLabel,
            parentLabel,
            parentName,
            ...ownText,
        ].filter(Boolean);

    if (
        allLabels.length ===
        0
    ) {
        return false;
    }

    if (
        normalizedTarget ===
        "username"
    ) {
        return allLabels.some(
            (
                label,
            ) =>
                label ===
                "username" ||
                label ===
                "user name" ||
                label.includes(
                    "username",
                ) ||
                label.includes(
                    "user name",
                ) ||
                label === "user",
        );
    }

    if (
        normalizedTarget ===
        "password"
    ) {
        return allLabels.some(
            (
                label,
            ) =>
                label ===
                "password" ||
                label.includes(
                    "password",
                ),
        );
    }

    return allLabels.some(
        (
            label,
        ) =>
            label ===
            normalizedTarget ||
            label.includes(
                normalizedTarget,
            ),
    );
}

function getSemanticAliases(
    target: string,
): string[] {
    const normalized =
        normalize(target);

    if (!normalized) {
        return [];
    }

    const aliases =
        new Set<string>([
            normalized,
        ]);

    const words =
        normalized.split(" ");

    if (words.length > 1) {
        aliases.add(
            words.join(""),
        );

        aliases.add(
            words.join("-"),
        );

        aliases.add(
            words.join("_"),
        );
    }

    return [
        ...aliases,
    ];
}

function scoreElement(
    element:
        ElementInfo,
    target:
        string,
    action:
        AILocatorElementType,
): ElementMatch | null {
    const normalizedTarget =
        normalize(
            target,
        );

    if (
        !isCompatibleElement(
            element,
            action,
        )
    ) {
        return null;
    }

    if (
        !normalizedTarget
    ) {
        return null;
    }

    const targetTokens =
        tokenize(
            normalizedTarget,
        );

    let score =
        0;

    const reasons:
        string[] =
        [];

    /*
     * Input semantic matching.
     *
     * This is especially important for iOS
     * fields that have empty label/name/value
     * but inherit semantic context from the
     * surrounding UI hierarchy.
     */
    if (
        action ===
        "input" &&
        matchesInputSemanticLabel(
            element,
            normalizedTarget,
        )
    ) {
        score +=
            120;

        reasons.push(
            "Input element matched semantic field label.",
        );
    }

    /*
     * Strong identifiers
     */
    if (
        exactMatch(
            element.resourceId,
            normalizedTarget,
        )
    ) {
        score +=
            100;

        reasons.push(
            "Exact resource-id match.",
        );
    } else if (
        containsToken(
            element.resourceId,
            targetTokens,
        )
    ) {
        score +=
            80;

        reasons.push(
            "Resource-id contains the target.",
        );
    }

    /*
     * Accessibility / content description
     */
    if (
        exactMatch(
            element.contentDescription,
            normalizedTarget,
        )
    ) {
        score +=
            95;

        reasons.push(
            "Exact content-description match.",
        );
    } else if (
        containsToken(
            element.contentDescription,
            targetTokens,
        )
    ) {
        score +=
            75;

        reasons.push(
            "Content-description contains the target.",
        );
    }

    /*
     * iOS label
     */
    if (
        exactMatch(
            element.label,
            normalizedTarget,
        )
    ) {
        score +=
            95;

        reasons.push(
            "Exact label match.",
        );
    } else if (
        containsToken(
            element.label,
            targetTokens,
        )
    ) {
        score +=
            75;

        reasons.push(
            "Label contains the target.",
        );
    }

    /*
     * iOS name
     */
    if (
        exactMatch(
            element.name,
            normalizedTarget,
        )
    ) {
        score +=
            90;

        reasons.push(
            "Exact name match.",
        );
    } else if (
        containsToken(
            element.name,
            targetTokens,
        )
    ) {
        score +=
            70;

        reasons.push(
            "Name contains the target.",
        );
    }

    /*
     * Text
     */
    if (
        exactMatch(
            element.text,
            normalizedTarget,
        )
    ) {
        score +=
            90;

        reasons.push(
            "Exact text match.",
        );
    } else if (
        containsToken(
            element.text,
            targetTokens,
        )
    ) {
        score +=
            65;

        reasons.push(
            "Text contains the target.",
        );
    }

    /*
     * Value
     */
    if (
        exactMatch(
            element.value,
            normalizedTarget,
        )
    ) {
        score +=
            60;

        reasons.push(
            "Exact value match.",
        );
    }

    /*
     * Semantic aliases
     */
    const normalizedFields = [
        normalize(
            element.resourceId,
        ),

        normalize(
            element.contentDescription,
        ),

        normalize(
            element.label,
        ),

        normalize(
            element.name,
        ),

        normalize(
            element.text,
        ),

        normalize(
            element.semanticLabel,
        ),

        normalize(
            element.parentLabel,
        ),

        normalize(
            element.parentName,
        ),
    ].filter(Boolean);

    const semanticAliases =
        getSemanticAliases(
            normalizedTarget,
        );

    if (
        semanticAliases.some(
            (alias) =>
                normalizedFields.some(
                    (field) =>
                        field === alias ||
                        field.includes(alias) ||
                        alias.includes(field),
                ),
        )
    ) {
        score += 40;

        reasons.push(
            "Semantic alias matched.",
        );
    }

    /*
     * For input actions, interactive fields
     * should receive a positive priority.
     */
    if (
        action ===
        "input"
    ) {
        const tagName =
            (
                element.tagName ??
                element.className ??
                ""
            )
                .trim()
                .toLowerCase();

        if (
            tagName.includes(
                "securetextfield",
            )
        ) {
            if (
                normalizedTarget ===
                "password"
            ) {
                score +=
                    25;

                reasons.push(
                    "Secure text field matches password input.",
                );
            }
        }

        if (
            tagName.includes(
                "textfield",
            )
        ) {
            if (
                normalizedTarget ===
                "username" &&
                !tagName.includes(
                    "securetextfield",
                )
            ) {
                score +=
                    25;

                reasons.push(
                    "Text field matches username input.",
                );
            }
        }
    }

    /*
     * Non-interactive containers should receive
     * a penalty.
     */
    if (
        element.children.length >
        0 &&
        !element.resourceId &&
        !element.contentDescription &&
        !element.label &&
        !element.name &&
        !element.text &&
        !element.semanticLabel
    ) {
        score -=
            10;

        reasons.push(
            "Non-interactive container penalty.",
        );
    }

    return {
        element,

        score,

        reasons,
    };
}

function buildCandidates(
    match:
        ElementMatch,
): LocatorCandidate[] {
    const {
        element,
        score,
        reasons,
    } = match;

    const candidates:
        LocatorCandidate[] =
        [];

    /*
     * Android resource-id /
     * generic id.
     */
    if (
        element.resourceId
    ) {
        candidates.push({
            strategy:
                "id",

            value:
                element.resourceId,

            score:
                score + 15,

            recommended:
                true,

            reason:
                [
                    "Resolved from resource-id.",

                    ...reasons,
                ].join(
                    " ",
                ),
        });
    }

    /*
     * Accessibility id from content description.
     */
    if (
        element.contentDescription
    ) {
        candidates.push({
            strategy:
                "accessibilityId",

            value:
                element.contentDescription,

            score:
                score + 10,

            recommended:
                !element.resourceId,

            reason:
                [
                    "Resolved from content-description.",

                    ...reasons,
                ].join(
                    " ",
                ),
        });
    }

    /*
     * iOS label.
     */
    if (
        element.label
    ) {
        candidates.push({
            strategy:
                "accessibilityId",

            value:
                element.label,

            score:
                score + 8,

            recommended:
                !element.resourceId &&
                !element.contentDescription,

            reason:
                [
                    "Resolved from label.",

                    ...reasons,
                ].join(
                    " ",
                ),
        });
    }

    /*
     * iOS name.
     */
    if (
        element.name
    ) {
        candidates.push({
            strategy:
                "accessibilityId",

            value:
                element.name,

            score:
                score + 6,

            recommended:
                false,

            reason:
                [
                    "Resolved from name.",

                    ...reasons,
                ].join(
                    " ",
                ),
        });
    }

    /*
     * For input fields without a usable
     * accessibility label, generate a robust
     * XPath based on the actual element type
     * and its semantic context.
     */
    if (
        element.tagName &&
        (
            element.tagName
                .toLowerCase()
                .includes(
                    "textfield",
                )
        )
    ) {
        const semantic =
            normalize(
                element.semanticLabel,
            );

        if (
            semantic ===
            "username" ||
            semantic ===
            "user name"
        ) {
            candidates.push({
                strategy:
                    "xpath",

                value:
                    "//XCUIElementTypeTextField",

                score:
                    score + 5,

                recommended:
                    true,

                reason:
                    [
                        "Resolved from iOS TextField with username semantic context.",

                        ...reasons,
                    ].join(
                        " ",
                    ),
            });
        }
    }

    if (
        element.tagName &&
        element.tagName
            .toLowerCase()
            .includes(
                "securetextfield",
            )
    ) {
        const semantic =
            normalize(
                element.semanticLabel,
            );

        if (
            semantic ===
            "password"
        ) {
            candidates.push({
                strategy:
                    "xpath",

                value:
                    "//XCUIElementTypeSecureTextField",

                score:
                    score + 5,

                recommended:
                    true,

                reason:
                    [
                        "Resolved from iOS SecureTextField with password semantic context.",

                        ...reasons,
                    ].join(
                        " ",
                    ),
            });
        }
    }

    /*
     * Fallback XPath from text.
     */
    if (
        element.text
    ) {
        candidates.push({
            strategy:
                "xpath",

            value:
                `//*[@text="${escapeXPathValue(
                    element.text,
                )}"]`,

            score:
                score,

            recommended:
                false,

            reason:
                [
                    "Fallback XPath generated from element text.",

                    ...reasons,
                ].join(
                    " ",
                ),
        });
    }

    return candidates;
}

function escapeXPathValue(
    value:
        string,
): string {
    if (
        !value.includes(
            '"',
        )
    ) {
        return value;
    }

    if (
        !value.includes(
            "'",
        )
    ) {
        return `'${value}'`;
    }

    const parts =
        value.split(
            '"',
        );

    return `concat(${parts
        .map(
            (
                part,
            ) =>
                `"${part}"`,
        )
        .join(
            ', \'"\', ',
        )})`;
}

function deduplicateCandidates(
    candidates:
        LocatorCandidate[],
): LocatorCandidate[] {
    const map =
        new Map<
            string,
            LocatorCandidate
        >();

    for (
        const candidate of
        candidates
    ) {
        const key =
            `${candidate.strategy}:${candidate.value}`;

        const existing =
            map.get(
                key,
            );

        if (
            !existing ||
            candidate.score >
            existing.score
        ) {
            map.set(
                key,
                candidate,
            );
        }
    }

    return [
        ...map.values(),
    ].sort(
        (
            left,
            right,
        ) =>
            right.score -
            left.score,
    );
}

function scoreAgainstTargets(
    element:
        ElementInfo,
    targets:
        string[],
    action:
        AILocatorElementType,
): ElementMatch | null {
    let bestMatch:
        ElementMatch | null =
        null;

    for (
        const target of
        targets
    ) {
        const match =
            scoreElement(
                element,
                target,
                action,
            );

        if (
            match &&
            (
                !bestMatch ||
                match.score >
                bestMatch.score
            )
        ) {
            bestMatch =
                match;
        }
    }

    return bestMatch;
}

export function resolveAILocator(
    elements:
        ElementInfo[],
    targets:
        string | string[],
    action:
        AILocatorElementType =
        "generic",
): AILocatorResolution {
    const normalizedTargets =
        (
            Array.isArray(
                targets,
            )
                ? targets
                : [targets]
        )
            .map(
                normalize,
            )
            .filter(Boolean);

    const targetDescription =
        normalizedTargets.join(
            " | ",
        );

    if (
        normalizedTargets.length ===
        0
    ) {
        return {
            status:
                "notFound",

            target:
                targetDescription,

            selected:
                null,

            candidates: [],

            matchedElementId:
                null,
        };
    }

    const flattened =
        flattenElements(
            elements,
        );



    const matches =
        flattened
            .map(
                (
                    element,
                ) =>
                    scoreAgainstTargets(
                        element,
                        normalizedTargets,
                        action,
                    ),
            )
            .filter(
                (
                    match,
                ): match is ElementMatch =>
                    match !== null,
            )
            .sort(
                (
                    left,
                    right,
                ) =>
                    right.score -
                    left.score,
            );

    const bestMatch =
        matches[0];

    const MIN_RESOLUTION_SCORE =
        70;

    if (
        !bestMatch ||
        bestMatch.score <
        MIN_RESOLUTION_SCORE
    ) {
        return {
            status:
                "notFound",

            target:
                targetDescription,

            selected:
                null,

            candidates: [],

            matchedElementId:
                null,
        };
    }

    if (
        matches.length ===
        0
    ) {
        return {
            status:
                "notFound",

            target:
                targetDescription,

            selected:
                null,

            candidates: [],

            matchedElementId:
                null,
        };
    }

    const candidates =
        deduplicateCandidates(
            matches.flatMap(
                (
                    match,
                ) =>
                    buildCandidates(
                        match,
                    ),
            ),
        );

    if (
        candidates.length ===
        0
    ) {
        return {
            status:
                "notFound",

            target:
                targetDescription,

            selected:
                null,

            candidates: [],

            matchedElementId:
                null,
        };
    }

    const selected =
        candidates[0];

    const topMatch =
        matches[0];

    return {
        status:
            "resolved",

        target:
            targetDescription,

        selected,

        candidates,

        matchedElementId:
            topMatch
                ?.element
                .id ??
            null,
    };
}