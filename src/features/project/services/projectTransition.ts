import { useProjectStore } from "../store/useProjectStore";

import { saveProjectWorkflow } from "../workflows/saveProjectWorkflow";

export type ProjectTransitionResult =
    | "cancel"
    | "discard"
    | "saved";

export async function saveBeforeProjectTransition(): Promise<ProjectTransitionResult> {
    const isModified =
        useProjectStore
            .getState()
            .isModified;

    if (!isModified) {
        return "saved";
    }

    const saved =
        await saveProjectWorkflow();

    if (!saved) {
        return "cancel";
    }

    return "saved";
}