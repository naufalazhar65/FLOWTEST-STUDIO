import {
    useState,
} from "react";

import {
    useProjectStore,
} from "../store/useProjectStore";

export type ProjectTransitionAction =
    | "new"
    | "open"
    | "close";

export function useProjectTransitionGuard() {
    const [pendingAction, setPendingAction] =
        useState<ProjectTransitionAction | null>(
            null,
        );

    const isModified =
        useProjectStore(
            (state) => state.isModified,
        );

    function requestTransition(
        action: ProjectTransitionAction,
        onContinue: () => void,
    ) {
        if (!isModified) {
            onContinue();
            return;
        }

        setPendingAction(action);
    }

    function cancelTransition() {
        setPendingAction(null);
    }

    return {
        pendingAction,

        requestTransition,

        cancelTransition,
    };
}