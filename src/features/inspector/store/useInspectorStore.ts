import { create } from "zustand";

import type { ElementInfo } from "../types/ElementInfo";

interface InspectorState {
    elements: ElementInfo[];

    selectedElement: ElementInfo | null;

    loading: boolean;

    error: string | null;

    setElements(
        elements: ElementInfo[],
    ): void;

    selectElement(
        element: ElementInfo | null,
    ): void;

    setLoading(
        loading: boolean,
    ): void;

    setError(
        error: string | null,
    ): void;

    reset(): void;
}

export const useInspectorStore =
    create<InspectorState>((set) => ({
        elements: [],

        selectedElement: null,

        loading: false,

        error: null,

        setElements(elements) {
            set({
                elements,

                selectedElement:
                    null,

                error: null,
            });
        },

        selectElement(element) {
            set({
                selectedElement:
                    element,
            });
        },

        setLoading(loading) {
            set({
                loading,
            });
        },

        setError(error) {
            set({
                error,
            });
        },

        reset() {
            set({
                elements: [],

                selectedElement:
                    null,

                loading: false,

                error: null,
            });
        },
    }));