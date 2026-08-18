import type { ElementInfo } from "../../inspector/types/ElementInfo";

function normalize(
    value: string | undefined,
): string {
    return (
        value
            ?.trim()
            .toLowerCase() ?? ""
    );
}

function matchesTarget(
    element: ElementInfo,
    target: string,
): boolean {
    const normalizedTarget =
        normalize(target);

    if (!normalizedTarget) {
        return false;
    }

    const values = [
        element.text,
        element.label,
        element.value,
        element.name,
        element.contentDescription,
        element.resourceId,
        element.semanticLabel,
    ];

    return values.some(
        (value) =>
            normalize(value) ===
            normalizedTarget,
    );
}

function findInElement(
    element: ElementInfo,
    target: string,
): ElementInfo | null {
    if (
        matchesTarget(
            element,
            target,
        )
    ) {
        return element;
    }

    for (
        const child of
        element.children
    ) {
        const result =
            findInElement(
                child,
                target,
            );

        if (result) {
            return result;
        }
    }

    return null;
}

export function findElementInPageSource(
    elements: ElementInfo[],
    target: string,
): ElementInfo | null {
    for (
        const element of
        elements
    ) {
        const result =
            findInElement(
                element,
                target,
            );

        if (result) {
            return result;
        }
    }

    return null;
}