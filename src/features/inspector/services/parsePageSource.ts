import type {
    ElementInfo,
} from "../types/ElementInfo";

let elementCounter = 0;

function createElementId(): string {
    elementCounter += 1;

    return `element-${elementCounter}`;
}

function getAttribute(
    element: Element,
    name: string,
): string | undefined {
    const value =
        element.getAttribute(
            name,
        );

    if (
        value === null ||
        value === ""
    ) {
        return undefined;
    }

    return value;
}

function getBooleanAttribute(
    element: Element,
    name: string,
): boolean | undefined {
    const value =
        element.getAttribute(
            name,
        );

    if (
        value === null ||
        value === ""
    ) {
        return undefined;
    }

    return value === "true";
}

function getOwnSemanticLabel(
    element: Element,
): string | undefined {
    const candidates = [
        getAttribute(
            element,
            "label",
        ),

        getAttribute(
            element,
            "name",
        ),

        getAttribute(
            element,
            "text",
        ),

        getAttribute(
            element,
            "content-desc",
        ),

        getAttribute(
            element,
            "value",
        ),
    ];

    for (
        const candidate of
        candidates
    ) {
        if (
            candidate &&
            candidate.trim()
        ) {
            return candidate.trim();
        }
    }

    return undefined;
}

function isSemanticTextElement(
    element: Element,
): boolean {
    const tagName =
        element.tagName
            .trim()
            .toLowerCase();

    return (
        tagName ===
        "xcuielementtypestatictext" ||
        tagName ===
        "android.widget.textview"
    );
}

function parseElement(
    element: Element,
    inheritedLabel?: string,
    parentLabel?: string,
    parentName?: string,
): ElementInfo {
    const ownLabel =
        getOwnSemanticLabel(
            element,
        );

    const currentSemanticLabel =
        isSemanticTextElement(
            element,
        )
            ? ownLabel ??
            inheritedLabel
            : inheritedLabel;

    const elementParentLabel =
        parentLabel ??
        getAttribute(
            element,
            "label",
        );

    const elementParentName =
        parentName ??
        getAttribute(
            element,
            "name",
        );

    /*
     * IMPORTANT:
     *
     * Children must be processed sequentially.
     *
     * Example:
     *
     * StaticText "User Name"
     * Other
     *   TextField
     *
     * The second sibling must inherit
     * the semantic label from the first
     * sibling.
     */
    let latestSiblingSemanticLabel =
        currentSemanticLabel;

    const children:
        ElementInfo[] =
        [];

    for (
        const child of
        Array.from(
            element.children,
        )
    ) {
        const childOwnLabel =
            getOwnSemanticLabel(
                child,
            );

        const childIsSemanticText =
            isSemanticTextElement(
                child,
            );

        const childInheritedLabel =
            childIsSemanticText
                ? (
                    childOwnLabel ??
                    latestSiblingSemanticLabel ??
                    currentSemanticLabel
                )
                : (
                    latestSiblingSemanticLabel ??
                    currentSemanticLabel
                );

        const parsedChild =
            parseElement(
                child,
                childInheritedLabel,
                getAttribute(
                    element,
                    "label",
                ) ??
                elementParentLabel,
                getAttribute(
                    element,
                    "name",
                ) ??
                elementParentName,
            );

        children.push(
            parsedChild,
        );

        /*
         * If this sibling itself contains
         * a semantic text label, make that
         * label available to the next
         * sibling.
         */
        if (
            childIsSemanticText &&
            childOwnLabel
        ) {
            latestSiblingSemanticLabel =
                childOwnLabel;
        }
    }

    /*
     * For an interactive child inside
     * a wrapper/container, preserve the
     * semantic label coming from the
     * preceding sibling.
     */
    const finalSemanticLabel =
        currentSemanticLabel ??
        latestSiblingSemanticLabel;

    return {
        id:
            createElementId(),

        tagName:
            element.tagName,

        // Android
        text:
            getAttribute(
                element,
                "text",
            ),

        contentDescription:
            getAttribute(
                element,
                "content-desc",
            ),

        resourceId:
            getAttribute(
                element,
                "resource-id",
            ),

        // iOS
        label:
            getAttribute(
                element,
                "label",
            ),

        name:
            getAttribute(
                element,
                "name",
            ),

        value:
            getAttribute(
                element,
                "value",
            ),

        // Common
        className:
            getAttribute(
                element,
                "class",
            ),

        bounds:
            getAttribute(
                element,
                "bounds",
            ),

        displayed:
            getBooleanAttribute(
                element,
                "displayed",
            ),

        enabled:
            getBooleanAttribute(
                element,
                "enabled",
            ),

        selected:
            getBooleanAttribute(
                element,
                "selected",
            ),

        accessible:
            getBooleanAttribute(
                element,
                "accessible",
            ),

        semanticLabel:
            finalSemanticLabel,

        parentLabel:
            elementParentLabel,

        parentName:
            elementParentName,

        children,
    };
}

export function parsePageSource(
    source: string,
): ElementInfo[] {
    elementCounter = 0;

    const parser =
        new DOMParser();

    const document =
        parser.parseFromString(
            source,
            "application/xml",
        );

    const parserError =
        document.querySelector(
            "parsererror",
        );

    if (
        parserError
    ) {
        throw new Error(
            "Failed to parse Appium page source.",
        );
    }

    return document.documentElement
        ? [
            parseElement(
                document.documentElement,
            ),
        ]
        : [];
}