import { getPageSource } from "./getPageSource";
import { parsePageSource } from "./parsePageSource";

import { useInspectorStore } from "../store/useInspectorStore";

const REFRESH_TIMEOUT = 10000;

export async function refreshInspector() {
    const store =
        useInspectorStore.getState();

    store.setLoading(true);
    store.setError(null);

    try {
        const source =
            await Promise.race([
                getPageSource(),

                new Promise<never>(
                    (_, reject) => {
                        setTimeout(() => {
                            reject(
                                new Error(
                                    "Timeout while retrieving Appium page source.",
                                ),
                            );
                        }, REFRESH_TIMEOUT);
                    },
                ),
            ]);

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

        store.setElements([]);
        store.setError(message);

        return [];
    } finally {
        store.setLoading(false);
    }
}