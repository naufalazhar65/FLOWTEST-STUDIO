import type { ElementInfo } from "../types/ElementInfo";

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
        element.getAttribute(name);

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
        element.getAttribute(name);

    if (
        value === null ||
        value === ""
    ) {
        return undefined;
    }

    return value === "true";
}

function parseElement(
    element: Element,
): ElementInfo {
    const children =
        Array.from(
            element.children,
        ).map(parseElement);

    return {
        id: createElementId(),

        tagName:
            element.tagName,

        // Android
        text: getAttribute(
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
        label: getAttribute(
            element,
            "label",
        ),

        name: getAttribute(
            element,
            "name",
        ),

        value: getAttribute(
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

    if (parserError) {
        throw new Error(
            "Failed to parse Appium page source.",
        );
    }

    return document.documentElement
        ? [parseElement(
            document.documentElement,
        )]
        : [];
}