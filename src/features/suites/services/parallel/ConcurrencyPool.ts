export const SAFE_DEFAULT_CONCURRENCY = 1;

export interface PoolTask<T = unknown> {
    id: string;

    run: () => Promise<T>;
}

export type PoolItemStatus =
    | "queued"
    | "running"
    | "completed"
    | "failed"
    | "cancelled";

export interface PoolItem<T = unknown> {
    id: string;

    status: PoolItemStatus;

    startedAt?: number;

    finishedAt?: number;

    duration?: number;

    error?: string;

    result?: T;
}

export interface PoolOptions {
    concurrency: number;

    maxQueueDepth?: number;
}

export interface PoolSnapshot {
    concurrency: number;

    running: number;

    queued: number;

    completed: number;

    failed: number;

    cancelled: number;

    items: PoolItem[];
}

export interface PoolResult<T = unknown> {
    item: PoolItem<T>;

    cancelled: boolean;
}

export interface ConcurrencyPool {
    run<T>(
        task: PoolTask<T>,
    ): Promise<PoolResult<T>>;

    cancelPending(): string[];

    getSnapshot(): PoolSnapshot;

    get running(): number;

    get queued(): number;
}

interface QueueEntry {
    task: PoolTask;

    resolve: (
        result: PoolResult,
    ) => void;

    reject: (
        reason: unknown,
    ) => void;
}

export function createConcurrencyPool(
    options: PoolOptions,
): ConcurrencyPool {
    const concurrency =
        Math.max(
            1,
            Math.floor(
                options.concurrency,
            ),
        );

    const items = new Map<
        string,
        PoolItem
    >();

    const queue: QueueEntry[] = [];

    let active = 0;

    function snapshotInternal(): PoolSnapshot {
        const allItems = [
            ...items.values(),
        ];

        return {
            concurrency,

            running: active,

            queued:
                queue.length,

            completed:
                allItems.filter(
                    (item) =>
                        item.status ===
                        "completed",
                ).length,

            failed:
                allItems.filter(
                    (item) =>
                        item.status ===
                        "failed",
                ).length,

            cancelled:
                allItems.filter(
                    (item) =>
                        item.status ===
                        "cancelled",
                ).length,

            items: allItems,
        };
    }

    function markCancelled(
        taskId: string,
    ): void {
        const item =
            items.get(
                taskId,
            );

        if (item) {
            item.status =
                "cancelled";
        }
    }

    function drain(): void {
        while (
            active < concurrency &&
            queue.length > 0
        ) {
            const entry =
                queue.shift();

            if (!entry) {
                break;
            }

            void dispatch(entry);
        }
    }

    async function dispatch(
        entry: QueueEntry,
    ): Promise<void> {
        const {
            task,
            resolve,
        } = entry;

        const item =
            items.get(task.id) ??
            {
                id: task.id,

                status: "queued",
            };

        items.set(
            task.id,
            item,
        );

        active += 1;

        item.status = "running";

        item.startedAt =
            Date.now();

        try {
            const result =
                await task.run();

            item.status =
                "completed";

            item.result =
                result;

            item.finishedAt =
                Date.now();

            item.duration =
                item.finishedAt -
                item.startedAt;

            resolve({
                item,

                cancelled:
                    false,
            });
        } catch (error) {
            item.status =
                "failed";

            item.error =
                error instanceof Error
                    ? error.message
                    : String(error);

            item.finishedAt =
                Date.now();

            item.duration =
                item.finishedAt -
                item.startedAt;

            resolve({
                item,

                cancelled:
                    false,
            });
        } finally {
            active -= 1;

            drain();
        }
    }

    function run<T>(
        task: PoolTask<T>,
    ): Promise<PoolResult<T>> {
        return new Promise<
            PoolResult<T>
        >(
            (
                resolve,
                reject,
            ) => {
                if (
                    options.maxQueueDepth !=
                        null &&
                    queue.length >=
                        options.maxQueueDepth
                ) {
                    reject(
                        new Error(
                            "Concurrency pool queue is full.",
                        ),
                    );

                    return;
                }

                items.set(
                    task.id,
                    {
                        id: task.id,

                        status: "queued",
                    },
                );

                const entry: QueueEntry = {
                    task,

                    resolve: resolve as (
                        result: PoolResult,
                    ) => void,

                    reject,
                };

                queue.push(entry);

                drain();
            },
        );
    }

    function cancelPending(): string[] {
        const cancelledIds =
            queue.map(
                (entry) =>
                    entry.task.id,
            );

        for (const entry of queue) {
            markCancelled(
                entry.task.id,
            );

            entry.resolve({
                item: {
                    id: entry.task.id,

                    status:
                        "cancelled",
                },

                cancelled:
                    true,
            });
        }

        queue.length = 0;

        return cancelledIds;
    }

    function getSnapshot(): PoolSnapshot {
        return snapshotInternal();
    }

    return {
        run,

        cancelPending,

        getSnapshot,

        get running() {
            return active;
        },

        get queued() {
            return queue.length;
        },
    };
}
