import { beforeEach } from "vitest";

function createMemoryStorage(): Storage {
    const store = new Map<string, string>();

    return {
        get length(): number {
            return store.size;
        },

        clear(): void {
            store.clear();
        },

        getItem(key: string): string | null {
            return store.get(key) ?? null;
        },

        key(index: number): string | null {
            return Array.from(store.keys())[index] ?? null;
        },

        removeItem(key: string): void {
            store.delete(key);
        },

        setItem(key: string, value: string): void {
            store.set(key, String(value));
        },
    };
}

function installWebStorage(): void {
    const windowObject = globalThis.window as (Window & typeof globalThis) | undefined;

    const target =
        windowObject ?? (globalThis as unknown as Window);

    Object.defineProperty(target, "localStorage", {
        configurable: true,
        value: createMemoryStorage(),
    });

    Object.defineProperty(target, "sessionStorage", {
        configurable: true,
        value: createMemoryStorage(),
    });
}

if (typeof globalThis.window !== "undefined") {
    installWebStorage();
}

beforeEach(() => {
    if (typeof globalThis.window === "undefined") {
        return;
    }

    const windowObject = globalThis.window as (Window & typeof globalThis) | undefined;

    const target =
        windowObject ?? (globalThis as unknown as Window);

    target.localStorage?.clear();

    target.sessionStorage?.clear();
});
