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
    elements: ElementInfo[],
): ElementInfo[] {
    const result: ElementInfo[] =
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
            visit(child);
        }
    }

    for (
        const element of elements
    ) {
        visit(element);
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
        normalize(field);

    if (
        !normalizedField
    ) {
        return false;
    }

    return targetTokens.every(
        (token) =>
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
        normalize(field);

    return (
        normalizedField !==
            "" &&
        normalizedField ===
            normalize(target)
    );
}

function scoreElement(
    element:
        ElementInfo,
    target:
        string,
): ElementMatch | null {
    const normalizedTarget =
        normalize(target);

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
        string[] = [];

    if (
        exactMatch(
            element.resourceId,
            normalizedTarget,
        )
    ) {
        score += 100;
        reasons.push(
            "Exact resource-id match.",
        );
    } else if (
        containsToken(
            element.resourceId,
            targetTokens,
        )
    ) {
        score += 80;
        reasons.push(
            "Resource-id contains the target.",
        );
    }

    if (
        exactMatch(
            element.contentDescription,
            normalizedTarget,
        )
    ) {
        score += 95;
        reasons.push(
            "Exact content-description match.",
        );
    } else if (
        containsToken(
            element.contentDescription,
            targetTokens,
        )
    ) {
        score += 75;
        reasons.push(
            "Content-description contains the target.",
        );
    }

    if (
        exactMatch(
            element.label,
            normalizedTarget,
        )
    ) {
        score += 95;
        reasons.push(
            "Exact label match.",
        );
    } else if (
        containsToken(
            element.label,
            targetTokens,
        )
    ) {
        score += 75;
        reasons.push(
            "Label contains the target.",
        );
    }

    if (
        exactMatch(
            element.name,
            normalizedTarget,
        )
    ) {
        score += 90;
        reasons.push(
            "Exact name match.",
        );
    } else if (
        containsToken(
            element.name,
            targetTokens,
        )
    ) {
        score += 70;
        reasons.push(
            "Name contains the target.",
        );
    }

    if (
        exactMatch(
            element.text,
            normalizedTarget,
        )
    ) {
        score += 90;
        reasons.push(
            "Exact text match.",
        );
    } else if (
        containsToken(
            element.text,
            targetTokens,
        )
    ) {
        score += 65;
        reasons.push(
            "Text contains the target.",
        );
    }

    if (
        exactMatch(
            element.value,
            normalizedTarget,
        )
    ) {
        score += 60;
        reasons.push(
            "Exact value match.",
        );
    }

    /*
     * Semantic aliases are intentionally
     * conservative. They help when the AI
     * says "username" while the application
     * exposes "user_name" or "username_input".
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
    ].filter(Boolean);

    const semanticAliases =
        getSemanticAliases(
            normalizedTarget,
        );

    for (
        const alias of
        semanticAliases
    ) {
        if (
            normalizedFields.some(
                (field) =>
                    field.includes(
                        alias,
                    ),
            )
        ) {
            score += 35;

            reasons.push(
                `Semantic alias "${alias}" matched.`,
            );

            break;
        }
    }

    if (
        score <= 0
    ) {
        return null;
    }

    /*
     * Non-interactive container nodes
     * should receive a small penalty.
     */
    if (
        element.children.length >
            0 &&
        !element.resourceId &&
        !element.contentDescription &&
        !element.label &&
        !element.name &&
        !element.text
    ) {
        score -= 10;
    }

    return {
        element,
        score,
        reasons,
    };
}

function getSemanticAliases(
    target:
        string,
): string[] {
    const aliases:
        Record<string, string[]> =
        {
            username: [
                "user",
                "user name",
                "username",
                "login user",
            ],

            password: [
                "pass",
                "password",
                "pwd",
            ],

            login: [
                "login",
                "sign in",
                "signin",
                "log in",
            ],

            email: [
                "email",
                "e mail",
                "mail",
            ],

            search: [
                "search",
                "query",
                "find",
            ],

            submit: [
                "submit",
                "save",
                "confirm",
                "continue",
            ],
        };

    return [
        target,
        ...(aliases[target] ??
            []),
    ]
        .map(normalize)
        .filter(Boolean);
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
                ].join(" "),
        });
    }

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
                ].join(" "),
        });
    }

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
                ].join(" "),
        });
    }

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
                ].join(" "),
        });
    }

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
                ].join(" "),
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
            (part) =>
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
            map.get(key);

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

export function resolveAILocator(
    elements:
        ElementInfo[],
    target:
        string,
): AILocatorResolution {
    const normalizedTarget =
        normalize(target);

    if (
        !normalizedTarget
    ) {
        return {
            status:
                "notFound",

            target,

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
                    scoreElement(
                        element,
                        normalizedTarget,
                    ),
            )
            .filter(
                (
                    match,
                ): match is ElementMatch =>
                    match !==
                    null,
            )
            .sort(
                (
                    left,
                    right,
                ) =>
                    right.score -
                    left.score,
            );

    if (
        matches.length === 0
    ) {
        return {
            status:
                "notFound",

            target,

            selected:
                null,

            candidates: [],

            matchedElementId:
                null,
        };
    }

    const topMatch =
        matches[0];

    const secondMatch =
        matches[1];

    /*
     * Treat close top-level matches
     * as ambiguous instead of guessing.
     */
    const ambiguous =
        !!secondMatch &&
        secondMatch.score >=
            topMatch.score - 10;

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
        ambiguous
    ) {
        return {
            status:
                "ambiguous",

            target,

            selected:
                null,

            candidates,

            matchedElementId:
                null,
        };
    }

    const selected =
        candidates.find(
            (
                candidate,
            ) =>
                candidate.recommended,
        ) ??
        candidates[0] ??
        null;

    return {
        status:
            selected
                ? "resolved"
                : "notFound",

        target,

        selected,

        candidates,

        matchedElementId:
            selected
                ? topMatch
                    .element
                    .id
                : null,
    };
}