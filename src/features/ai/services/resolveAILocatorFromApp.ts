import {
    getPageSource,
} from "../../inspector/services/getPageSource";

import {
    parsePageSource,
} from "../../inspector/services/parsePageSource";

import {
    testLocator,
} from "../../inspector/services/testLocator";

import {
    resolveAILocator,
} from "./resolveAILocator";

import type {
    LocatorCandidate,
} from "../../inspector/types/LocatorCandidate";

export type AILocatorAppResolutionStatus =
    | "resolved"
    | "ambiguous"
    | "notFound"
    | "unavailable";

export interface AILocatorAppResolution {
    status:
    AILocatorAppResolutionStatus;

    target: string;

    selected:
    LocatorCandidate | null;

    candidates:
    LocatorCandidate[];

    matchedElementId:
    string | null;

    error?: string;
}

export async function resolveAILocatorFromApp(
    target: string,
    action:
        | "input"
        | "tap"
        | "wait"
        | "generic" = "generic",
): Promise<AILocatorAppResolution> {
    const normalizedTarget =
        target.trim();

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

            error:
                "Locator target is required.",
        };
    }

    let source: string;

    try {
        source =
            await getPageSource();
            console.log(
    "[AI LOCATOR] Active page source:",
    source,
);
    } catch (error) {
        return {
            status:
                "unavailable",

            target:

                normalizedTarget,

            selected:
                null,

            candidates: [],

            matchedElementId:
                null,

            error:
                error instanceof Error
                    ? error.message
                    : String(
                        error,
                    ),
        };
    }

    let elements;

    try {
        elements =
            parsePageSource(
                source,
            );
            console.log(
    "[AI LOCATOR] Parsed elements:",
    JSON.stringify(
        elements,
        null,
        2,
    ),
);
    } catch (error) {
        return {
            status:
                "unavailable",

            target:
                normalizedTarget,

            selected:
                null,

            candidates: [],

            matchedElementId:
                null,

            error:
                error instanceof Error
                    ? error.message
                    : String(
                        error,
                    ),
        };
    }

    const resolution =
        resolveAILocator(
            elements,
            normalizedTarget,
            action,
        );

    if (
        resolution.status !==
        "resolved"
    ) {
        return {
            status:
                resolution.status,

            target:
                normalizedTarget,

            selected:
                null,

            candidates:
                resolution.candidates,

            matchedElementId:
                resolution.matchedElementId,
        };
    }

    /*
     * Resolve candidates one by one
     * against the real active Appium
     * session.
     *
     * A semantic match is not enough:
     * the locator must actually find
     * an element.
     */
    for (
        const candidate of
        resolution.candidates
    ) {
        const result =
            await testLocator(
                candidate,
            );

        if (
            result.found
        ) {
            return {
                status:
                    "resolved",

                target:
                    normalizedTarget,

                selected:
                {
                    ...candidate,

                    recommended:
                        true,
                },

                candidates:
                    resolution.candidates,

                matchedElementId:
                    resolution.matchedElementId,
            };
        }
    }

    return {
        status:
            "notFound",

        target:
            normalizedTarget,

        selected:
            null,

        candidates:
            resolution.candidates,

        matchedElementId:
            resolution.matchedElementId,

        error:
            "No generated locator candidate matched an element in the active Appium session.",
    };
}