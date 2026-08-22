import type {
    ElementInfo,
} from "../../inspector/types/ElementInfo";

import type {
    FailureContext,
} from "./buildFailureContext";

import {
    parsePageSource,
} from "../../inspector/services/parsePageSource";

export interface LocatorRepairSuggestion {
    currentLocator: string;

    suggestedLocator:
    | string
    | null;

    locatorStrategy:
    | string
    | null;

    confidence:
    | "high"
    | "medium"
    | "low";

    reason: string;

    candidates:
    LocatorRepairCandidate[];
}

interface LocatorCandidate {
    strategy: string;

    value: string;

    score: number;

    uniqueness: number;

    reason: string;
}

export interface LocatorRepairCandidate {
    strategy: string;

    locator: string;

    score: number;

    confidence:
    | "high"
    | "medium"
    | "low";

    reason: string;
}

function extractLocatorText(
    locator: string,
): string | null {
    const patterns = [
        /name\s*==\s*["']([^"']+)["']/i,

        /label\s*==\s*["']([^"']+)["']/i,

        /text\s*==\s*["']([^"']+)["']/i,

        /value\s*==\s*["']([^"']+)["']/i,

        /content-desc\s*==\s*["']([^"']+)["']/i,

        /resource-id\s*==\s*["']([^"']+)["']/i,

        /description\s*==\s*["']([^"']+)["']/i,

        /@(?:name|label|text|value|content-desc|resource-id)\s*=\s*["']([^"']+)["']/i,

        /contains\s*\([^,]+,\s*["']([^"']+)["']\s*\)/i,
    ];

    for (
        const pattern of
        patterns
    ) {
        const match =
            locator.match(
                pattern,
            );

        if (
            match?.[1]?.trim()
        ) {
            return match[1].trim();
        }
    }

    /*
     * Direct-value strategies such as
     * accessibilityId, id, and className.
     */
    if (
        !locator.includes(
            "==",
        ) &&
        !locator.includes(
            "//",
        ) &&
        !locator.includes(
            "UiSelector",
        ) &&
        !locator.includes(
            "**/",
        )
    ) {
        return (
            locator.trim() ||
            null
        );
    }

    return null;
}

function normalize(
    value: string,
): string {
    return value
        .toLowerCase()
        .trim()
        .replace(
            /[\s_-]+/g,
            "",
        );
}

function levenshteinSimilarity(
    first: string,
    second: string,
): number {
    const a =
        normalize(first);

    const b =
        normalize(second);

    if (
        !a ||
        !b
    ) {
        return 0;
    }

    if (
        a === b
    ) {
        return 1;
    }

    const matrix =
        Array.from(
            {
                length:
                    a.length + 1,
            },
            () =>
                Array(
                    b.length + 1,
                ).fill(0),
        );

    for (
        let i = 0;
        i <= a.length;
        i++
    ) {
        matrix[i][0] = i;
    }

    for (
        let j = 0;
        j <= b.length;
        j++
    ) {
        matrix[0][j] = j;
    }

    for (
        let i = 1;
        i <= a.length;
        i++
    ) {
        for (
            let j = 1;
            j <= b.length;
            j++
        ) {
            const cost =
                a[i - 1] ===
                    b[j - 1]
                    ? 0
                    : 1;

            matrix[i][j] =
                Math.min(
                    matrix[i - 1][j] +
                    1,

                    matrix[i][j - 1] +
                    1,

                    matrix[i - 1][j - 1] +
                    cost,
                );
        }
    }

    const distance =
        matrix[a.length][b.length];

    const maxLength =
        Math.max(
            a.length,
            b.length,
        );

    return maxLength === 0
        ? 1
        : 1 -
        distance /
        maxLength;
}

function partialSimilarity(
    first: string,
    second: string,
): number {
    const a =
        normalize(first);

    const b =
        normalize(second);

    if (
        !a ||
        !b
    ) {
        return 0;
    }

    if (
        a === b
    ) {
        return 1;
    }

    const shorterLength =
        Math.min(
            a.length,
            b.length,
        );

    const longerLength =
        Math.max(
            a.length,
            b.length,
        );

    /*
     * Handle generated suffix/prefix noise.
     *
     * Example:
     *
     * MenuIconsgherhthrht
     * MenuIcons
     *
     * The complete shorter value is
     * preserved as a prefix.
     */
    const prefixLimit =
        Math.min(
            a.length,
            b.length,
        );

    let prefixLength =
        0;

    while (
        prefixLength <
        prefixLimit &&
        a[prefixLength] ===
        b[prefixLength]
    ) {
        prefixLength += 1;
    }

    if (
        prefixLength >= 4
    ) {
        const prefixCoverage =
            prefixLength /
            shorterLength;

        const lengthRatio =
            shorterLength /
            longerLength;

        if (
            prefixCoverage >=
            0.8
        ) {
            return Math.min(
                1,
                0.84 +
                prefixCoverage *
                0.10 +
                lengthRatio *
                0.06,
            );
        }
    }

    let suffixLength =
        0;

    while (
        suffixLength <
        prefixLimit &&
        a[
        a.length -
        1 -
        suffixLength
        ] ===
        b[
        b.length -
        1 -
        suffixLength
        ]
    ) {
        suffixLength += 1;
    }

    if (
        suffixLength >= 4
    ) {
        const suffixCoverage =
            suffixLength /
            shorterLength;

        const lengthRatio =
            shorterLength /
            longerLength;

        if (
            suffixCoverage >=
            0.8
        ) {
            return Math.min(
                1,
                0.82 +
                suffixCoverage *
                0.10 +
                lengthRatio *
                0.08,
            );
        }
    }

    if (
        a.includes(b) ||
        b.includes(a)
    ) {
        const lengthRatio =
            shorterLength /
            longerLength;

        if (
            lengthRatio >=
            0.5
        ) {
            return 0.82 +
                lengthRatio *
                0.12;
        }
    }

    return levenshteinSimilarity(
        a,
        b,
    );
}

function getElementValues(
    element: ElementInfo,
    strategy: string,
): string[] {
    switch (
    strategy
    ) {
        case "accessibilityId":
            return [
                element.name,

                element.label,

                element.contentDescription,

                element.semanticLabel,

                element.value,

                element.text,
            ].filter(
                (
                    value,
                ): value is string =>
                    Boolean(
                        value?.trim(),
                    ),
            );

        case "id":
            return [
                element.resourceId,

                element.name,

                element.label,
            ].filter(
                (
                    value,
                ): value is string =>
                    Boolean(
                        value?.trim(),
                    ),
            );

        case "className":
            return [
                element.className,

                element.tagName,
            ].filter(
                (
                    value,
                ): value is string =>
                    Boolean(
                        value?.trim(),
                    ),
            );

        case "iOSClassChain":
        case "iOSPredicateString":
            return [
                element.name,

                element.label,

                element.value,

                element.semanticLabel,

                element.text,
            ].filter(
                (
                    value,
                ): value is string =>
                    Boolean(
                        value?.trim(),
                    ),
            );

        case "androidUiAutomator":
            return [
                element.resourceId,

                element.text,

                element.contentDescription,

                element.name,

                element.label,
            ].filter(
                (
                    value,
                ): value is string =>
                    Boolean(
                        value?.trim(),
                    ),
            );

        case "xpath":
        default:
            return [
                element.resourceId,

                element.name,

                element.label,

                element.text,

                element.value,

                element.contentDescription,

                element.semanticLabel,
            ].filter(
                (
                    value,
                ): value is string =>
                    Boolean(
                        value?.trim(),
                    ),
            );
    }
}

function getPrimaryElementValue(
    element: ElementInfo,
    strategy: string,
): string | null {
    switch (
    strategy
    ) {
        case "accessibilityId":
            return (
                element.name ??
                element.label ??
                element.contentDescription ??
                element.semanticLabel ??
                element.value ??
                element.text ??
                null
            );

        case "id":
            return (
                element.resourceId ??
                element.name ??
                element.label ??
                null
            );

        case "className":
            return (
                element.className ??
                element.tagName ??
                null
            );

        case "iOSClassChain":
        case "iOSPredicateString":
            return (
                element.name ??
                element.label ??
                element.value ??
                element.semanticLabel ??
                element.text ??
                null
            );

        case "androidUiAutomator":
            return (
                element.resourceId ??
                element.text ??
                element.contentDescription ??
                element.name ??
                element.label ??
                null
            );

        default:
            return (
                element.resourceId ??
                element.name ??
                element.label ??
                element.text ??
                element.value ??
                element.contentDescription ??
                element.semanticLabel ??
                null
            );
    }
}

function getLocatorStrategies(
    element: ElementInfo,
): string[] {
    const strategies: string[] = [];

    if (
        element.resourceId?.trim()
    ) {
        strategies.push(
            "id",
        );
    }

    if (
        element.name?.trim() ||
        element.label?.trim() ||
        element.contentDescription?.trim() ||
        element.semanticLabel?.trim()
    ) {
        strategies.push(
            "accessibilityId",
        );
    }

    if (
        element.className?.trim() ||
        element.tagName?.trim()
    ) {
        strategies.push(
            "className",
        );
    }

    if (
        element.tagName?.trim() &&
        (
            element.name?.trim() ||
            element.label?.trim() ||
            element.text?.trim() ||
            element.value?.trim() ||
            element.resourceId?.trim()
        )
    ) {
        strategies.push(
            "xpath",
        );
    }

    if (
        element.resourceId?.trim() ||
        element.text?.trim() ||
        element.contentDescription?.trim()
    ) {
        strategies.push(
            "androidUiAutomator",
        );
    }

    if (
        element.name?.trim() ||
        element.label?.trim() ||
        element.value?.trim()
    ) {
        strategies.push(
            "iOSPredicateString",
        );
    }

    if (
        element.tagName?.trim() &&
        (
            element.name?.trim() ||
            element.label?.trim() ||
            element.value?.trim()
        )
    ) {
        strategies.push(
            "iOSClassChain",
        );
    }

    return [
        ...new Set(
            strategies,
        ),
    ];
}

function findBestCandidateForStrategy(
    element: ElementInfo,
    target: string,
    originalLocator: string,
    strategy: string,
    originalStrategy: string,
): LocatorCandidate | null {
    const suggestedLocator =
        buildSuggestedLocator(
            strategy,
            element,
            originalLocator,
        );

    if (
        !suggestedLocator ||
        (
            suggestedLocator ===
            originalLocator &&
            strategy ===
            originalStrategy
        )
    ) {
        return null;
    }

    const values =
        getElementValues(
            element,
            strategy,
        );

    let bestSimilarity = 0;

    let bestValue:
        | string
        | null = null;

    for (
        const value of values
    ) {
        const similarity =
            partialSimilarity(
                target,
                value,
            );

        if (
            similarity >
            bestSimilarity
        ) {
            bestSimilarity =
                similarity;

            bestValue =
                value;
        }
    }

    if (!bestValue) {
        return null;
    }

    /*
     * Make the generated locator and the
     * scored evidence consistent.
     *
     * A strategy must be scored by the
     * attribute that actually produces the
     * suggested locator.
     */
    let generatedValue:
        | string
        | null = null;

    switch (
    strategy
    ) {
        case "accessibilityId":
            generatedValue =
                element.name ??
                element.label ??
                element.contentDescription ??
                element.semanticLabel ??
                element.value ??
                element.text ??
                null;
            break;

        case "id":
            generatedValue =
                element.resourceId ??
                element.name ??
                element.label ??
                null;
            break;

        case "className":
            generatedValue =
                element.className ??
                element.tagName ??
                null;
            break;

        case "xpath":
            generatedValue =
                element.name ??
                element.label ??
                element.text ??
                element.value ??
                element.resourceId ??
                null;
            break;

        case "androidUiAutomator":
            generatedValue =
                element.resourceId ??
                element.text ??
                element.contentDescription ??
                null;
            break;

        case "iOSPredicateString":
            generatedValue =
                element.name ??
                element.label ??
                element.value ??
                null;
            break;

        case "iOSClassChain":
            generatedValue =
                element.name ??
                element.label ??
                element.value ??
                null;
            break;

        default:
            generatedValue =
                bestValue;
    }

    if (
        !generatedValue
    ) {
        return null;
    }

    const generatedSimilarity =
        partialSimilarity(
            target,
            generatedValue,
        );

    let strategyBonus = 0;

    if (
        strategy ===
        originalStrategy
    ) {
        if (
            strategy ===
            "accessibilityId"
        ) {
            strategyBonus =
                0.03;
        } else if (
            strategy ===
            "id" ||
            strategy ===
            "className"
        ) {
            strategyBonus =
                0.05;
        }
    }

    if (
        strategy ===
        "id"
    ) {
        strategyBonus +=
            0.05;
    } else if (
        strategy ===
        "accessibilityId"
    ) {
        strategyBonus +=
            0.04;
    } else if (
        strategy ===
        "className"
    ) {
        strategyBonus +=
            0.02;
    }

    return {
        strategy,

        value:
            suggestedLocator,

        score:
            generatedSimilarity +
            strategyBonus,

        uniqueness:
            0,

        reason:
            `Matched "${bestValue}" using ${strategy}.`,
    };
}

function buildLocatorCandidates(
    element: ElementInfo,
    target: string,
    originalLocator: string,
    originalStrategy: string,
): LocatorCandidate[] {
    const strategies = [
        originalStrategy,

        ...getLocatorStrategies(
            element,
        ).filter(
            (
                strategy,
            ) =>
                strategy !==
                originalStrategy,
        ),
    ];

    return strategies
        .map(
            (
                strategy,
            ) =>
                findBestCandidateForStrategy(
                    element,
                    target,
                    originalLocator,
                    strategy,
                    originalStrategy,
                )
        )
        .filter(
            (
                candidate,
            ): candidate is LocatorCandidate =>
                candidate !== null,
        );
}

function escapeValue(
    value: string,
): string {
    return value
        .replace(
            /\\/g,
            "\\\\",
        )
        .replace(
            /"/g,
            '\\"',
        );
}

function extractClassChainIndex(
    locator: string,
): string {
    const match =
        locator.match(
            /(\[\d+\])\s*$/,
        );

    return (
        match?.[1] ??
        ""
    );
}

function buildSuggestedLocator(
    strategy: string,
    element: ElementInfo,
    originalLocator: string,
): string | null {
    const value =
        getPrimaryElementValue(
            element,
            strategy,
        );

    if (
        !value &&
        strategy !==
        "className"
    ) {
        return null;
    }

    const escaped =
        value
            ? escapeValue(value)
            : null;

    switch (
    strategy
    ) {
        case "accessibilityId":
            return value;

        case "id":
            return (
                element.resourceId ??
                element.name ??
                value
            );

        case "className":
            return (
                element.className ??
                element.tagName ??
                null
            );

        case "xpath": {
            const elementType =
                element.tagName?.trim() ||
                element.className?.trim();

            if (
                !elementType
            ) {
                return null;
            }

            if (
                element.name
            ) {
                return `//${elementType}[@name="${escaped}"]`;
            }

            if (
                element.label
            ) {
                return `//${elementType}[@label="${escaped}"]`;
            }

            if (
                element.text
            ) {
                return `//${elementType}[@text="${escaped}"]`;
            }

            if (
                element.value
            ) {
                return `//${elementType}[@value="${escaped}"]`;
            }

            if (
                element.resourceId
            ) {
                return `//${elementType}[@resource-id="${escaped}"]`;
            }

            return null;
        }

        case "androidUiAutomator":
            if (
                element.resourceId
            ) {
                return `new UiSelector().resourceId("${escaped}")`;
            }

            if (
                element.text
            ) {
                return `new UiSelector().text("${escaped}")`;
            }

            if (
                element.contentDescription
            ) {
                return `new UiSelector().description("${escaped}")`;
            }

            return null;

        case "iOSPredicateString":
            if (
                element.name
            ) {
                return `name == "${escaped}"`;
            }

            if (
                element.label
            ) {
                return `label == "${escaped}"`;
            }

            if (
                element.value
            ) {
                return `value == "${escaped}"`;
            }

            return null;

        case "iOSClassChain": {
            const elementType =
                element.tagName?.trim() ||
                element.className?.trim();

            if (
                !elementType
            ) {
                return null;
            }

            const index =
                extractClassChainIndex(
                    originalLocator,
                );

            if (
                element.name
            ) {
                return `**/${elementType}[\`name == "${escaped}"\`]${index}`;
            }

            if (
                element.label
            ) {
                return `**/${elementType}[\`label == "${escaped}"\`]${index}`;
            }

            if (
                element.value
            ) {
                return `**/${elementType}[\`value == "${escaped}"\`]${index}`;
            }

            return null;
        }

        default:
            return null;
    }
}

function collectElements(
    elements: ElementInfo[],
): ElementInfo[] {
    const result: ElementInfo[] =
        [];

    function visit(
        element: ElementInfo,
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
        const element of
        elements
    ) {
        visit(element);
    }

    return result;
}


export function suggestLocatorRepair(
    context: FailureContext,
): LocatorRepairSuggestion | null {
    const locator =
        context.node.locator?.trim();

    const pageSource =
        context.execution.pageSource?.trim();

    const locatorStrategy =
        context.node.locatorStrategy;

    if (
        !locator ||
        !pageSource ||
        !locatorStrategy
    ) {
        return null;
    }

    const target =
        extractLocatorText(
            locator,
        );

    if (!target) {
        return null;
    }

    let elements: ElementInfo[];

    try {
        elements =
            parsePageSource(
                pageSource,
            );
    } catch {
        return null;
    }


    const allElements =
        collectElements(
            elements,
        );


    const rankedCandidates =
        allElements
            .flatMap(
                (
                    element,
                ) =>
                    buildLocatorCandidates(
                        element,
                        target,
                        locator,
                        locatorStrategy,
                    ),
            )
            .sort(
                (first, second) =>
                    second.score -
                    first.score,
            );

    const candidate =
        rankedCandidates[0];

    if (
        !candidate
    ) {
        return null;
    }

    /*
     * Only automatic repair when there
     * is sufficiently strong evidence.
     */
    if (
        candidate.score <
        0.70
    ) {
        return null;
    }

    const candidates:
        LocatorRepairCandidate[] =
        rankedCandidates
            .filter(
                (
                    item,
                ) =>
                    item.score >=
                    0.70,
            )
            .map(
                (
                    item,
                ): LocatorRepairCandidate => ({
                    strategy:
                        item.strategy,

                    locator:
                        item.value,

                    score:
                        item.score,

                    confidence:
                        item.score >=
                            0.90
                            ? "high"
                            : item.score >=
                                0.80
                                ? "medium"
                                : "low",

                    reason:
                        item.reason,
                }),
            );

    const suggestedLocator =
        candidate.value;

    if (
        !suggestedLocator ||
        (
            suggestedLocator ===
            locator &&
            candidate.strategy ===
            locatorStrategy
        )
    ) {
        return null;
    }

    const confidence =
        candidate.score >=
            0.90
            ? "high"
            : candidate.score >=
                0.80
                ? "medium"
                : "low";

    return {
        currentLocator:
            locator,

        suggestedLocator,

        locatorStrategy:
            candidate.strategy,

        confidence,

        reason:
            candidate.reason,

        candidates,
    };
}