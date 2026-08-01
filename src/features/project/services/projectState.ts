import { useProjectStore } from "../store/useProjectStore";

export function markProjectModified() {
    useProjectStore
        .getState()
        .markModified();
}

export function markProjectSaved() {
    useProjectStore
        .getState()
        .markSaved();
}

export function resetProjectState() {
    useProjectStore
        .getState()
        .reset();
}