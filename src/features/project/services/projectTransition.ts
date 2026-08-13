import {
    useProjectStore,
} from "../store/useProjectStore";

import {
    useProjectTransitionStore,
} from "../store/useProjectTransitionStore";

import type {
    ProjectTransitionAction,
} from "../store/useProjectTransitionStore";

import {
    saveProjectWorkflow,
} from "../workflows/saveProjectWorkflow";

import {
    openProjectWorkflow,
} from "./openProjectWorkflow";

import {
    closeProject,
} from "./closeProject";

import {
    useWorkspaceStore,
} from "../../workspace/store/useWorkspaceStore";

export type {
    ProjectTransitionAction,
};

export async function executeProjectTransition(
    action: ProjectTransitionAction,
): Promise<void> {
    switch (action) {
        case "new":
            useWorkspaceStore
                .getState()
                .openCreateProject();

            return;

        case "open":
            await openProjectWorkflow();

            return;

        case "close":
            closeProject();

            return;
    }
}

export function requestProjectTransition(
    action: ProjectTransitionAction,
): void {
    const isModified =
        useProjectStore
            .getState()
            .isModified;

    if (isModified) {
        useProjectTransitionStore
            .getState()
            .requestTransition(
                action,
            );

        return;
    }

    void executeProjectTransition(
        action,
    ).catch((error) => {
        console.error(
            `Failed to execute project transition "${action}":`,
            error,
        );
    });
}

export function cancelProjectTransition(): void {
    useProjectTransitionStore
        .getState()
        .clearTransition();
}

export async function discardProjectTransition(): Promise<void> {
    const action =
        useProjectTransitionStore
            .getState()
            .pendingAction;

    if (!action) {
        return;
    }

    useProjectTransitionStore
        .getState()
        .clearTransition();

    try {
        await executeProjectTransition(
            action,
        );
    } catch (error) {
        console.error(
            "Failed to continue project transition:",
            error,
        );

        useProjectTransitionStore
            .getState()
            .requestTransition(
                action,
            );
    }
}

export async function saveAndContinueProjectTransition(): Promise<void> {
    const action =
        useProjectTransitionStore
            .getState()
            .pendingAction;

    if (!action) {
        return;
    }

    try {
        const saved =
            await saveProjectWorkflow();

        if (!saved) {
            return;
        }

        if (
            useProjectStore
                .getState()
                .isModified
        ) {
            return;
        }

        useProjectTransitionStore
            .getState()
            .clearTransition();

        await executeProjectTransition(
            action,
        );
    } catch (error) {
        console.error(
            "Failed to save project before transition:",
            error,
        );
    }
}