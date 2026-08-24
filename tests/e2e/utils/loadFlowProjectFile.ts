/// <reference types="node" />

import {
    readFile,
} from "node:fs/promises";

import type {
    FlowProject,
} from "../../../src/features/flow/types/FlowProject";

export async function loadFlowProjectFile(
    filePath: string,
): Promise<FlowProject> {
    const text =
        await readFile(
            filePath,
            "utf-8",
        );

    return JSON.parse(
        text,
    ) as FlowProject;
}