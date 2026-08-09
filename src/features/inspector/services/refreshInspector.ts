import { getPageSource } from "./getPageSource";
import { parsePageSource } from "./parsePageSource";

import { useInspectorStore } from "../store/useInspectorStore";

export async function refreshInspector() {
    const store =
        useInspectorStore.getState();

    store.setLoading(true);
    store.setError(null);

    try {
        const source =
            await getPageSource();

        const elements =
            parsePageSource(source);

        store.setElements(
            elements,
        );

        return elements;
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to inspect Appium page.";

        store.setError(message);

        return [];
    } finally {
        store.setLoading(false);
    }
}