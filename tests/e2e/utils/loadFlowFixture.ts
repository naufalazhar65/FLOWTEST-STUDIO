/// <reference types="vite/client" />

import type {
    FlowProject,
} from "../../../src/features/flow/types/FlowProject";

const fixtureFiles =
    import.meta.glob(
        "../fixtures/*.flow",
        {
            query: "?raw",

            import: "default",

            eager: true,
        },
    ) as Record<
        string,
        string
    >;

function normalizeFixtureName(
    path: string,
): string {
    return path
        .split("/")
        .pop()
        ?.replace(
            /\.flow$/,
            "",
        )
        .trim()
        .toLowerCase() ?? "";
}

export function loadFlowFixture(
    fileName: string,
): FlowProject {
    const targetName =
        normalizeFixtureName(
            fileName,
        );

    const entry =
        Object.entries(
            fixtureFiles,
        ).find(
            ([path]) =>
                normalizeFixtureName(
                    path,
                ) === targetName,
        );

    if (!entry) {
        throw new Error(
            `Flow fixture not found: ${fileName}`,
        );
    }

    const [
        fixturePath,
        text,
    ] = entry;

    console.info(
        `[E2E] Loaded flow fixture: ${fixturePath}`,
    );

    return JSON.parse(
        text,
    ) as FlowProject;
}