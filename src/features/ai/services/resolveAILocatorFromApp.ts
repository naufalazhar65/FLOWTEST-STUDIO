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

export interface AILocatorResolutionContext {
    targets: string[];

    action:
    | "input"
    | "tap"
    | "wait"
    | "generic";
}

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
    contextOrTarget:
        | AILocatorResolutionContext
        | string,
    legacyAction:
        | "input"
        | "tap"
        | "wait"
        | "generic" =
        "generic",
): Promise<AILocatorAppResolution> {
    const context =
        typeof contextOrTarget ===
            "string"
            ? {
                targets: [
                    contextOrTarget,
                ],

                action:
                    legacyAction,
            }
            : contextOrTarget;

    const rawTargets =
        context.targets;

    const targets =
        rawTargets
            .map(
                (
                    target,
                ) =>
                    target.trim(),
            )
            .filter(Boolean);

    const targetDescription =
        rawTargets.join(
            " | ",
        );

    if (
        targets.length ===
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

            error:
                "Locator target is required.",
        };
    }

    let source: string;

    try {
        source =
            await getPageSource();
    } catch (error) {
        return {
            status:
                "unavailable",

            target:
                targetDescription,

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
    } catch (error) {
        return {
            status:
                "unavailable",

            target:
                targetDescription,

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
            targets,
            context.action,
        );

    if (
        resolution.status !==
        "resolved"
    ) {
        return {
            status:
                resolution.status,

            target:
                targetDescription,

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
        try {
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
                        targetDescription,

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
        } catch {
            /*
             * Continue testing the
             * remaining candidates.
             *
             * A single invalid candidate
             * must not abort the entire
             * resolution process.
             */
        }
    }

    return {
        status:
            "notFound",

        target:
            targetDescription,

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