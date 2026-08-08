import { openDatabase } from "./database";

export async function put(
    store: string,
    value: unknown,
) {
    const db = await openDatabase();

    return new Promise<void>(
        (resolve, reject) => {
            const transaction =
                db.transaction(
                    store,
                    "readwrite",
                );

            transaction
                .objectStore(store)
                .put(value);

            transaction.oncomplete =
                () => resolve();

            transaction.onerror =
                () =>
                    reject(
                        transaction.error,
                    );
        },
    );
}

export async function getAll<T>(
    store: string,
): Promise<T[]> {
    const db = await openDatabase();

    return new Promise(
        (resolve, reject) => {
            const transaction =
                db.transaction(
                    store,
                    "readonly",
                );

            const request =
                transaction
                    .objectStore(store)
                    .getAll();

            request.onsuccess = () =>
                resolve(
                    request.result as T[],
                );

            request.onerror = () =>
                reject(
                    request.error,
                );
        },
    );
}