const DATABASE_NAME = "flowtest-studio";

const DATABASE_VERSION = 1;

export const STORES = {
    recentProjects: "recent-projects",

    sessions: "sessions",

    settings: "settings",
} as const;

export async function openDatabase() {
    return new Promise<IDBDatabase>(
        (resolve, reject) => {
            const request =
                indexedDB.open(
                    DATABASE_NAME,
                    DATABASE_VERSION,
                );

            request.onerror = () =>
                reject(request.error);

            request.onsuccess = () =>
                resolve(request.result);

            request.onupgradeneeded = () => {
                const db =
                    request.result;

                Object.values(STORES)
                    .forEach((store) => {
                        if (
                            !db.objectStoreNames.contains(
                                store,
                            )
                        ) {
                            db.createObjectStore(
                                store,
                                {
                                    keyPath: "id",
                                },
                            );
                        }
                    });
            };
        },
    );
}